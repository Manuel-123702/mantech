/**
 * Dynamic Hourly Rotation & Expiration Engine for MANTECH Nexus Homepage
 * Implements Rule §5 (1-week grace period after expiry) and the 1-hour 10-post rotation loop.
 */

export interface RotatablePosting {
  id: string;
  slug: string;
  title: string;
  type: string; // 'FULL_TIME' | 'INTERNSHIP' | 'PART_TIME'
  postType?: 'job' | 'internship';
  companyName?: string;
  organizationName?: string;
  city?: string;
  flyerUrl?: string | null;
  isVisualFlyerOnly?: boolean;
  externalUrl?: string | null;
  isLinkOnly?: boolean;
  contactPhone?: string | null;
  expiryDate?: string | null;
  createdAt?: string | null;
  postingDate?: string | null;
  isFeatured?: boolean;
  salaryMinXAF?: number;
  salaryMaxXAF?: number;
  [key: string]: any;
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

export function filterActiveAndGracePostings<T extends RotatablePosting>(postings: T[]): {
  activeList: (T & { isOutdatedGrace?: boolean; isExpired?: boolean })[];
} {
  const now = Date.now();

  const activeList = postings
    .filter((post) => {
      if (!post.expiryDate) return true;
      const exp = new Date(post.expiryDate).getTime();
      // Drop if expired more than 7 days ago
      return now <= exp + ONE_WEEK_MS;
    })
    .map((post) => {
      const exp = post.expiryDate ? new Date(post.expiryDate).getTime() : now + 30 * 24 * 60 * 60 * 1000;
      const isExpired = now > exp;
      const isOutdatedGrace = isExpired && now <= exp + ONE_WEEK_MS;

      return {
        ...post,
        isExpired,
        isOutdatedGrace,
      };
    });

  return { activeList };
}

/**
 * Calculates the exact 30 postings for the homepage during the current hour.
 * - If total <= 30: displays all active postings.
 * - If total > 30: rotates 10 postings every hour, with recent postings surfaced.
 */
export function getHomepageRotatedPostings<T extends RotatablePosting>(
  allPostings: T[],
  targetCount = 30,
  stepPerHour = 10
): (T & { isOutdatedGrace?: boolean; isExpired?: boolean })[] {
  const { activeList } = filterActiveAndGracePostings(allPostings);

  if (activeList.length <= targetCount) {
    return activeList;
  }

  // Pin very recent postings (created in the last 2 hours) so users immediately see their new posts
  const now = Date.now();
  const twoHoursAgo = now - 2 * ONE_HOUR_MS;

  const fresh = activeList.filter((p) => {
    const postTime = new Date(p.createdAt || p.postingDate || now).getTime();
    return postTime >= twoHoursAgo;
  });

  const pool = activeList.filter((p) => !fresh.some((f) => f.id === p.id));

  // Current epoch hour for deterministic rotation
  const currentHour = Math.floor(now / ONE_HOUR_MS);
  const poolLen = pool.length;

  const slotsNeeded = Math.max(targetCount - fresh.length, 10);
  const startOffset = (currentHour * stepPerHour) % poolLen;

  const rotatedSlice: typeof activeList = [];
  for (let i = 0; i < slotsNeeded; i++) {
    const idx = (startOffset + i) % poolLen;
    rotatedSlice.push(pool[idx]);
  }

  // Combine fresh postings first, followed by rotated slice
  const result = [...fresh, ...rotatedSlice].slice(0, targetCount);
  return result;
}
