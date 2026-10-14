/**
 * MANTECH Nexus — boost helpers (DB-aware).
 *
 * requestBoost()  — company files a boost request for one of its PUBLISHED
 *                   opportunities. Blocked when a live request/active boost
 *                   already exists for that posting.
 * approveBoost()  — admin approves: applies the same isFeatured +
 *                   FeaturedOpportunity machinery as the admin feature route
 *                   (so boosted postings sort first everywhere), respecting
 *                   the organization package's featured-badge limit.
 * rejectBoost()   — admin declines with an optional resolution note.
 * expireDueBoosts() — sweeps APPROVED boosts whose window elapsed, switching
 *                   the feature flag off. Called lazily from the boost admin
 *                   page and the digest cron; never throws.
 */

import { prisma } from '@/lib/prisma';
import { AuthError, isUniqueConstraintViolation } from '@/lib/authz-policy';
import { boostEndsAt, canDecideBoost, canRequestBoost, isValidBoostDays } from '@/lib/boost-rules';

export type RequestBoostInput = {
  organizationId: string;
  requestedById: string;
  opportunityId: string;
  days: number;
  note?: string | null;
};

export type RequestBoostResult =
  | { ok: true; id: string }
  | { ok: false; code: 'NOT_FOUND' | 'NOT_PUBLISHED' | 'NOT_MEMBER' | 'LIVE_BOOST_EXISTS' };

export async function requestBoost(input: RequestBoostInput): Promise<RequestBoostResult> {
  if (!isValidBoostDays(input.days)) return { ok: false, code: 'NOT_FOUND' };

  const opportunity = await prisma.internshipOpportunity.findUnique({
    where: { id: input.opportunityId },
    select: { id: true, organizationId: true, moderationStatus: true },
  });
  if (!opportunity || opportunity.organizationId !== input.organizationId) {
    return { ok: false, code: 'NOT_FOUND' };
  }
  if (!canRequestBoost(opportunity.moderationStatus)) {
    return { ok: false, code: 'NOT_PUBLISHED' };
  }

  const live = await prisma.boost.findFirst({
    where: { opportunityId: opportunity.id, status: { in: ['REQUESTED', 'APPROVED'] } },
    select: { id: true },
  });
  if (live) return { ok: false, code: 'LIVE_BOOST_EXISTS' };

  try {
    const created = await prisma.boost.create({
      data: {
        opportunityId: opportunity.id,
        organizationId: input.organizationId,
        requestedById: input.requestedById,
        days: input.days,
        note: input.note?.trim() ? input.note.trim() : null,
      },
      select: { id: true },
    });
    return { ok: true, id: created.id };
  } catch (error) {
    if (isUniqueConstraintViolation(error)) return { ok: false, code: 'LIVE_BOOST_EXISTS' };
    throw error;
  }
}

export type DecidedBoost = { id: string; status: string };

/** Admin approves a REQUESTED boost — applies the feature machinery now. */
export async function approveBoost(input: { id: string; adminId: string }): Promise<DecidedBoost> {
  const boost = await prisma.boost.findUnique({
    where: { id: input.id },
    include: { opportunity: { select: { id: true, organization: { select: { packageCode: true } } } } },
  });
  if (!boost) throw new AuthError(404, 'Boost not found');
  if (!canDecideBoost(boost.status)) {
    throw new AuthError(409, 'This boost has already been decided');
  }

  // Package cap: featured-badge limit per organization (FREE = 0 → any
  // approval requires a package with at least one badge slot).
  const packageCode = boost.opportunity.organization.packageCode;
  const pkg = await prisma.package.findUnique({ where: { code: packageCode } });
  const badgeLimit = pkg?.featuredOpportunitiesLimit ?? 0;
  const activeCount = await prisma.featuredOpportunity.count({
    where: { isActive: true, opportunity: { organizationId: boost.organizationId } },
  });
  if (activeCount >= badgeLimit) {
    throw new AuthError(
      403,
      `${packageCode} package allows ${badgeLimit} featured badge(s); ${activeCount} already active. Upgrade the package or end an existing boost.`,
    );
  }

  const startsAt = new Date();
  const endsAt = boostEndsAt(boost.days, startsAt);

  await prisma.$transaction([
    prisma.boost.update({
      where: { id: boost.id },
      data: {
        status: 'APPROVED',
        startsAt,
        endsAt,
        reviewedAt: startsAt,
        reviewedById: input.adminId,
      },
    }),
    prisma.internshipOpportunity.update({
      where: { id: boost.opportunityId },
      data: { isFeatured: true },
    }),
    prisma.featuredOpportunity.upsert({
      where: { opportunityId: boost.opportunityId },
      create: { opportunityId: boost.opportunityId, startsAt, endsAt, isActive: true },
      update: { startsAt, endsAt, isActive: true },
    }),
  ]);

  return { id: boost.id, status: 'APPROVED' };
}

/** Admin rejects a REQUESTED boost — nothing is featured. */
export async function rejectBoost(input: {
  id: string;
  adminId: string;
  resolution?: string | null;
}): Promise<DecidedBoost> {
  const boost = await prisma.boost.findUnique({ where: { id: input.id } });
  if (!boost) throw new AuthError(404, 'Boost not found');
  if (!canDecideBoost(boost.status)) {
    throw new AuthError(409, 'This boost has already been decided');
  }

  const updated = await prisma.boost.update({
    where: { id: boost.id },
    data: {
      status: 'REJECTED',
      resolution: input.resolution?.trim() ? input.resolution.trim() : null,
      reviewedAt: new Date(),
      reviewedById: input.adminId,
    },
    select: { id: true, status: true },
  });
  return updated;
}

/**
 * Expires APPROVED boosts whose window elapsed and switches the feature flag
 * off (mirrors the admin "unfeature" transaction). Returns how many expired.
 */
export async function expireDueBoosts(now: Date = new Date()): Promise<number> {
  const due = await prisma.boost.findMany({
    where: { status: 'APPROVED', endsAt: { lte: now } },
    select: { id: true, opportunityId: true },
  });
  for (const boost of due) {
    await prisma.$transaction([
      prisma.boost.update({ where: { id: boost.id }, data: { status: 'EXPIRED' } }),
      prisma.internshipOpportunity.update({
        where: { id: boost.opportunityId },
        data: { isFeatured: false },
      }),
      prisma.featuredOpportunity.updateMany({
        where: { opportunityId: boost.opportunityId },
        data: { isActive: false },
      }),
    ]);
  }
  return due.length;
}