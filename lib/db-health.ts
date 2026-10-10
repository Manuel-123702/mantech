/**
 * Database health helpers.
 *
 * An unreachable database is an *expected* operational state for the public
 * marketplace: `/api/internships`, `/api/stats` and `/api/taxonomy` all fall
 * back to the offline catalog, while account-scoped pages render a friendly
 * "temporarily unavailable" state. These helpers let callers distinguish that
 * recoverable case from a genuine bug so they degrade instead of returning 500.
 */

const DB_OUTAGE_PATTERNS =
  /PrismaClientInitializationError|Can'?t reach database server|P1001|P1017|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|database server/i;

/** True when the thrown value indicates the database could not be reached. */
export function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof Error) return DB_OUTAGE_PATTERNS.test(error.message);
  if (typeof error === 'string') return DB_OUTAGE_PATTERNS.test(error);
  return false;
}

/**
 * Logs a database outage concisely.
 *
 * Deliberately logs only the error *name* and a short reason rather than the
 * whole Prisma error object, whose message embeds the connection string (host,
 * user and password). Never print the raw driver error to shared logs.
 */
export function logDatabaseUnavailable(scope: string, error: unknown): void {
  const name = error instanceof Error ? error.name : 'UnknownError';
  console.warn(`[${scope}] database unavailable (${name}) — serving fallback state.`);
}