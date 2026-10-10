/**
 * Fixed-window rate limiter (SRS Sec.20 - "rate limiting" is mandatory).
 *
 * Backed by an in-process Map, which is correct for a single Node process and
 * for `next dev`. On serverless (Vercel) each instance keeps its own counters,
 * so the effective limit scales with instance count - swap `hits` for a shared
 * store (Upstash Redis, Vercel KV, or a Postgres table) when running across
 * many instances. The interface below is already async-friendly for that swap.
 */

type Bucket = { count: number; resetAt: number };

const hits = new Map<string, Bucket>();

/** Keeps the map from growing without bound on long-running processes. */
function sweep(now: number) {
  if (hits.size < 10_000) return;
  for (const [key, bucket] of hits) {
    if (bucket.resetAt <= now) hits.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window resets. */
  resetSeconds: number;
};

export type RateLimitRule = {
  /** Maximum requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

/**
 * Count one request against `key`.
 * Returns `success: false` once the caller exceeds the rule.
 */
export function rateLimit(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = hits.get(key);
  const bucket =
    !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + rule.windowMs }
      : existing;

  bucket.count += 1;
  hits.set(key, bucket);

  const allowed = bucket.count <= rule.limit;
  return {
    success: allowed,
    limit: rule.limit,
    remaining: Math.max(0, rule.limit - bucket.count),
    resetSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Clears a key - used by tests and after a successful privileged action. */
export function resetRateLimit(key: string): void {
  hits.delete(key);
}

/** Clears every bucket. Test helper only. */
export function resetAllRateLimits(): void {
  hits.clear();
}

/** Best-effort client identity for rate-limit keys. */
export function clientKey(request: Request | { headers: Headers }, scope = ''): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown';
  return `${scope}:${ip}`;
}

/** Standard response headers so clients can see the budget remaining. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetSeconds),
  };
}

/** Per-route budgets. Tuned so normal browsing never trips them. */
export const RATE_LIMITS = {
  /** Broad safety net for any /api route. */
  api: { limit: 120, windowMs: 60_000 },
  /** Write-heavy endpoints: application submission, contact, uploads. */
  write: { limit: 10, windowMs: 60_000 },
  /** Authentication attempts - strict, brute-force protection. */
  auth: { limit: 8, windowMs: 5 * 60_000 },
  /** Read-only catalog/search endpoints. */
  read: { limit: 60, windowMs: 60_000 },
} satisfies Record<string, RateLimitRule>;