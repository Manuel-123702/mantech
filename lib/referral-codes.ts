/**
 * MANTECH Nexus — referral code primitives (pure, no imports).
 * Kept import-free so unit tests (node --test --experimental-strip-types)
 * can load it directly, and so client components can use the cookie
 * constants without pulling Prisma into the browser bundle.
 */

/** Cookie name used to carry ?ref= across the Clerk sign-up redirect. */
export const REFERRAL_COOKIE = 'mantech_referral';
/** 30 days — long enough for slow sign-ups, short enough to stay honest. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
/** Codes are short, URL-safe and free of look-alike characters (0/O, 1/I). */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const REFERRAL_CODE_LENGTH = 8;

/**
 * Random referral code, e.g. "K7MQ2XBD". `random` is injectable for tests;
 * production uses the platform PRNG.
 */
export function generateReferralCode(
  random: () => number = Math.random,
): string {
  let code = '';
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  }
  return code;
}

/** Shape guard for codes arriving from ?ref= / cookie values. */
export function isReferralCodeFormat(value: string): boolean {
  return new RegExp(`^[${CODE_ALPHABET}]{${REFERRAL_CODE_LENGTH}}$`).test(value);
}