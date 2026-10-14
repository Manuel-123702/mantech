/**
 * MANTECH Nexus — boost rules (pure, import-free).
 *
 * A boost is a time-boxed featured placement for a PUBLISHED internship
 * opportunity. Companies request one; admins approve or reject; approval
 * flips the existing isFeatured machinery (same as the admin feature route)
 * so boosted postings sort first. When the window ends the boost expires.
 *
 * DB-aware helpers live in lib/boosts.ts; this module only carries the
 * constants, math and guards so tests and UI share one source of truth.
 */

export const BOOST_MIN_DAYS = 1;
export const BOOST_MAX_DAYS = 90;

/** Preset lengths offered in the request UI. */
export const BOOST_DAY_OPTIONS = [7, 14, 30] as const;

export function isValidBoostDays(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= BOOST_MIN_DAYS &&
    value <= BOOST_MAX_DAYS
  );
}

/** Window end for a boost: start + N whole days. */
export function boostEndsAt(days: number, startsAt: Date = new Date()): Date {
  return new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000);
}

export function isBoostWindowOver(endsAt: Date | null | undefined, now: Date = new Date()): boolean {
  if (!endsAt) return false;
  return endsAt.getTime() <= now.getTime();
}

export const BOOST_STATUSES = ['REQUESTED', 'APPROVED', 'REJECTED', 'EXPIRED'] as const;
export type BoostStatus = (typeof BOOST_STATUSES)[number];

export const BOOST_STATUS_LABELS: Record<BoostStatus, string> = {
  REQUESTED: 'Requested',
  APPROVED: 'Active',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

/** REQUESTED is the only state an admin can decide on. */
export function canDecideBoost(status: unknown): boolean {
  return status === 'REQUESTED';
}

/** An opportunity must be PUBLISHED before its organization can boost it. */
export function canRequestBoost(moderationStatus: unknown): boolean {
  return moderationStatus === 'PUBLISHED';
}