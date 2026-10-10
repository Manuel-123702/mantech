import { auth, currentUser } from '@clerk/nextjs/server';
import type { Organization, OrganizationMember, User, UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AuthError, assertRecruiterAccess as assertRecruiterAccessPolicy, isUniqueConstraintViolation } from '@/lib/authz-policy';
import { resolveRole } from '@/lib/roles';

// Re-exported so existing call sites keep importing from '@/lib/authz'.
export { AuthError, jsonError } from '@/lib/authz-policy';

type SyncedUser = User & {
  internProfile: { id: string } | null;
  organizationMembers: (OrganizationMember & { organization: Organization })[];
};

export async function getClerkUserId() {
  const session = await auth();
  return session.userId;
}

const USER_INCLUDE = {
  internProfile: { select: { id: true } },
  organizationMembers: { include: { organization: true } },
} as const;

export async function syncDbUser(): Promise<SyncedUser | null> {
  const clerkId = await getClerkUserId();
  if (!clerkId) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId },
    include: USER_INCLUDE,
  });

  const clerk = await currentUser();
  if (!clerk) return existing ?? null;

  const email = clerk.emailAddresses[0]?.emailAddress;

  // Returning member: refresh their saved role from the email lists.
  //
  // The lists in the .env file are the source of truth for owners. If someone
  // was previously saved as an intern and their email is now on an admin list,
  // we upgrade them here instead of leaving them stuck without access.
  if (existing) {
    const wantedRole = resolveRole(email, existing.role);
    if (email && wantedRole !== existing.role) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { role: wantedRole, email },
        include: USER_INCLUDE,
      });
    }
    if (email && existing.email !== email) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { email },
        include: USER_INCLUDE,
      });
    }
    return existing;
  }

  if (!email) return null;

  const metaRole = clerk.publicMetadata?.role;
  // Email allowlist first: it is the authoritative source for platform admins,
  // who should not depend on Clerk metadata having been hand-edited.
  const role = resolveRole(email, metaRole);

  const fullName =
    [clerk.firstName, clerk.lastName].filter(Boolean).join(' ').trim() || email.split('@')[0];

  // First visit for this Clerk user, so create the local row.
  //
  // This is a read-then-write sequence, so two requests arriving at once (a
  // prefetch racing the navigation, or two tabs) can both observe "no user" and
  // both attempt an INSERT. The loser then fails with P2002 on the unique
  // `clerkId`/`email` constraints and the whole page 500s. Treating that as
  // "someone else already created it" and re-reading makes first-visit sync
  // idempotent under concurrency.
  try {
    return await prisma.user.create({
      data: {
        clerkId,
        email,
        fullName,
        avatarUrl: clerk.imageUrl,
        role,
      },
      include: USER_INCLUDE,
    });
  } catch (error) {
    if (!isUniqueConstraintViolation(error)) throw error;

    const raced = await prisma.user.findUnique({
      where: { clerkId },
      include: USER_INCLUDE,
    });
    if (raced) return raced;

    // The conflict was on `email` for a *different* Clerk account, so this
    // user genuinely cannot be provisioned. Surface a safe 409 instead of a
    // raw driver error.
    throw new AuthError(409, 'An account already exists for this email address');
  }
}

export async function requireUser() {
  const user = await syncDbUser();
  if (!user) throw new AuthError(401, 'Authentication required');
  return user;
}

export async function requireOrganizationContext(opts?: { requireOrg?: boolean }) {
  const user = await requireUser();
  if (user.role !== 'COMPANY' && user.role !== 'UNIVERSITY' && user.role !== 'ADMIN') {
    throw new AuthError(403, 'Organization access required');
  }

  const membership = user.organizationMembers[0] ?? null;
  const organization = membership
    ? await prisma.organization.findUnique({
        where: { id: membership.organizationId },
        include: {
          companyProfile: true,
          universityProfile: true,
          industry: true,
          region: true,
          members: { include: { user: true } },
        },
      })
    : null;

  if (opts?.requireOrg && !organization) {
    throw new AuthError(400, 'Organization profile required');
  }

  return { user, membership, organization };
}

export async function requireUniversityContext(opts?: { requireOrg?: boolean }) {
  const user = await requireUser();
  if (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN') {
    throw new AuthError(403, 'University access required');
  }

  const membership = user.organizationMembers[0] ?? null;
  const organization = membership
    ? await prisma.organization.findUnique({
        where: { id: membership.organizationId },
        include: {
          universityProfile: true,
          region: true,
          members: { include: { user: true } },
        },
      })
    : null;

  if (opts?.requireOrg && !organization) {
    throw new AuthError(400, 'University organization profile required');
  }

  return { user, membership, organization };
}

export async function requireRecruiterContext(opts?: { requireOrg?: boolean }) {
  const ctx = await requireOrganizationContext({ requireOrg: opts?.requireOrg ?? true });
  assertRecruiterAccessPolicy(ctx.user, ctx.organization);
  return ctx;
}

export async function requireVerifiedOrganization() {
  const ctx = await requireRecruiterContext({ requireOrg: true });
  if (!ctx.organization) throw new AuthError(400, 'Organization profile required');
  if (ctx.user.role !== 'ADMIN' && ctx.organization.verificationStatus !== 'VERIFIED') {
    throw new AuthError(403, 'Organization verification required');
  }
  return ctx;
}
