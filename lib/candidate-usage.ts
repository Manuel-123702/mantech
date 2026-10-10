import { Prisma, type UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const UNLIMITED_MONTHLY_CANDIDATE_VIEWS = 9999;

export class CandidateViewLimitError extends Error {
  constructor() {
    super('Your monthly candidate-view limit has been reached. Upgrade your package to continue.');
    this.name = 'CandidateViewLimitError';
  }
}

export async function reserveCandidateViews({
  organizationId,
  actorId,
  actorRole,
  profileIds,
  monthlyLimit,
  request,
}: {
  organizationId: string;
  actorId: string;
  actorRole: UserRole;
  profileIds: string[];
  monthlyLimit: number;
  request?: Request;
}) {
  const requestedIds = [...new Set(profileIds)];
  if (requestedIds.length === 0) return { allowedIds: new Set<string>(), used: 0 };

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthKey = `${monthStart.getUTCFullYear()}-${monthStart.getUTCMonth() + 1}`;
  const forwarded = request?.headers.get('x-forwarded-for');
  const userAgent = request?.headers.get('user-agent');

  return prisma.$transaction(async (tx) => {
    // pg_advisory_xact_lock() returns PostgreSQL `void`, which Prisma cannot
    // deserialize ("Failed to deserialize the column of type 'void'"), crashing
    // every caller. Projecting the result through IS NOT NULL keeps the lock
    // semantics identical (the function still runs before the boolean is
    // computed) while returning a real column for the driver to parse.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${organizationId}), hashtext(${monthKey})) IS NOT NULL AS locked`;
    const priorViews = await tx.auditLog.findMany({
      where: {
        action: 'CANDIDATE_PROFILE_VIEW',
        entityType: 'InternProfile',
        createdAt: { gte: monthStart },
        details: { contains: `"organizationId":"${organizationId}"` },
      },
      select: { entityId: true },
    });
    const viewedIds = new Set(priorViews.map((view) => view.entityId));
    let used = viewedIds.size;
    const allowedIds = new Set<string>();
    const newViews: Prisma.AuditLogCreateManyInput[] = [];

    for (const id of requestedIds) {
      if (viewedIds.has(id)) {
        allowedIds.add(id);
        continue;
      }
      if (monthlyLimit !== UNLIMITED_MONTHLY_CANDIDATE_VIEWS && used >= monthlyLimit) continue;
      allowedIds.add(id);
      viewedIds.add(id);
      used += 1;
      newViews.push({
        actorId,
        actorRole,
        action: 'CANDIDATE_PROFILE_VIEW',
        entityType: 'InternProfile',
        entityId: id,
        details: JSON.stringify({ organizationId }),
        ipAddress: forwarded?.split(',')[0]?.trim(),
        userAgent,
      });
    }

    if (newViews.length > 0) {
      await tx.auditLog.createMany({ data: newViews });
    }

    return { allowedIds, used };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
