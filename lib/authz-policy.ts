/**
 * Pure authorization policy - no database, no Clerk, no I/O.
 *
 * Kept separate from `lib/authz.ts` (which performs real session/DB lookups) so
 * the rules can be unit-tested directly. SRS Sec.26 requires that unauthorized
 * access is tested explicitly; these are exactly those decisions.
 */

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    // Keeps `instanceof` working when this class is extended/transpiled.
    this.name = 'AuthError';
  }
}

/** Minimal role shape so this module stays free of Prisma/Clerk imports. */
export type PolicyUser = { role: string };

/** Minimal organization shape used by the recruiter gate. */
export type PolicyOrganization = {
  type: string;
  universityProfile: { canRecruitInterns: boolean } | null;
} | null;

/**
 * SRS Sec.13 - a university has two modes. A university that has not enabled
 * recruiting may coordinate placements but must never reach recruiter features.
 * Throws 403 when access is not permitted.
 */
export function assertRecruiterAccess(
  user: PolicyUser,
  organization: PolicyOrganization,
): void {
  if (user.role !== 'UNIVERSITY') return;
  if (organization?.type !== 'UNIVERSITY' || !organization.universityProfile) {
    throw new AuthError(403, 'University profile required');
  }
  if (!organization.universityProfile.canRecruitInterns) {
    throw new AuthError(
      403,
      'This university account is limited to placement coordination',
    );
  }
}

/**
 * Detects a Prisma unique-constraint violation (P2002).
 *
 * Kept in this pure module so the concurrency guard in `lib/authz.ts` can be
 * unit-tested without a database. Accepts any thrown value because Prisma
 * errors arrive as class instances that will not survive our test doubles.
 */
export function isUniqueConstraintViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { code?: unknown; message?: unknown };
  if (candidate.code === 'P2002') return true;
  return (
    typeof candidate.message === 'string' &&
    candidate.message.includes('Unique constraint failed')
  );
}

/**
 * Maps thrown values to safe HTTP responses.
 *
 * Only `AuthError` messages are forwarded, because those are messages this
 * codebase authors deliberately and that are safe to show a user. Every other
 * error is replaced with a generic string so that database URLs, connection
 * strings, SQL fragments and stack details can never reach a client.
 */
export function jsonError(error: unknown): {
  body: { error: string };
  status: number;
} {
  if (error instanceof AuthError) {
    return { body: { error: error.message }, status: error.status };
  }
  // Log the real cause server-side; return nothing revealing.
  if (error instanceof Error) {
    console.error('[authz] unhandled error:', error.message);
    return { body: { error: 'An unexpected error occurred.' }, status: 500 };
  }
  return { body: { error: 'An unexpected error occurred.' }, status: 500 };
}