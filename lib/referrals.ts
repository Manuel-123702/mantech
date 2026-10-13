/**
 * MANTECH Nexus — referral loop helpers (DB-aware).
 *
 * Every member gets one stable shareable code. Sharing /sign-up?ref=CODE
 * stores the code in a first-party cookie (components/shared/referral-capture)
 * which lib/authz.ts reads the moment the referred account is created.
 * "Qualified" means the referred member actually finished onboarding
 * (completed intern profile or joined an organization) — not just signed up.
 *
 * The pure code primitives live in lib/referral-codes.ts (no imports) so
 * tests and client components never touch Prisma.
 */

import { prisma } from '@/lib/prisma';
import {
  generateReferralCode,
  isReferralCodeFormat,
} from '@/lib/referral-codes';

// Re-exported so call sites can keep importing everything from here.
export {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_CODE_LENGTH,
  generateReferralCode,
  isReferralCodeFormat,
} from '@/lib/referral-codes';

/**
 * Returns the user's referral code, creating one on first use. Codes are
 * unique, so a collision simply retries with a fresh draw.
 */
export async function ensureReferralCode(userId: string): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (existing?.referralCode) return existing.referralCode;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateReferralCode();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      return code;
    } catch {
      // Unique-constraint collision on `referralCode` — draw again.
    }
  }
  throw new Error('Could not allocate a referral code, please retry.');
}

/**
 * Attributes a brand-new account to the referrer owning `code`. Best-effort
 * and defensive: returns the updated id when linked, `null` when the code is
 * unknown/malformed or the user already has a referrer. Never throws — a
 * referral must not be able to break sign-up.
 */
export async function attributeReferral(
  code: string | null | undefined,
  newUserId: string,
): Promise<string | null> {
  const trimmed = code?.trim().toUpperCase();
  if (!trimmed || !isReferralCodeFormat(trimmed)) return null;

  const referrer = await prisma.user.findUnique({
    where: { referralCode: trimmed },
    select: { id: true },
  });
  // Unknown code, or someone shared their own link — ignore.
  if (!referrer || referrer.id === newUserId) return null;

  const alreadyLinked = await prisma.user.findUnique({
    where: { id: newUserId },
    select: { referredById: true },
  });
  if (alreadyLinked?.referredById) return null;

  await prisma.user.update({
    where: { id: newUserId },
    data: { referredById: referrer.id },
  });
  return referrer.id;
}

export type ReferralStats = {
  code: string;
  /** Members who signed up through this member's link. */
  invited: number;
  /** Invited members who finished onboarding (profile or organization). */
  qualified: number;
};

/** Live referral counters for one member. */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const code = await ensureReferralCode(userId);

  const referred = await prisma.user.findMany({
    where: { referredById: userId },
    select: {
      internProfile: { select: { profileCompleted: true } },
      organizationMembers: { select: { id: true } },
    },
  });

  const qualified = referred.filter(
    (member) =>
      member.internProfile?.profileCompleted === true ||
      member.organizationMembers.length > 0,
  ).length;

  return { code, invited: referred.length, qualified };
}