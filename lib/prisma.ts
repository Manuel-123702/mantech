import { PrismaClient } from '@prisma/client';
import { isDatabaseUnavailable } from '@/lib/db-health';

/** Waits a little longer each time, so we do not hammer a struggling database. */
function backoffMs(attempt: number): number {
  return 400 * attempt + Math.floor(Math.random() * 250);
}

/** How many times to try before giving up. */
const MAX_ATTEMPTS = 3;

/**
 * Every query goes through this wrapper.
 *
 * Our database host puts idle connections to sleep, so a request that arrives
 * after a pause is often handed a connection that has already been closed. That
 * made whole dashboard pages fail with "Can't reach database server" even though
 * nothing was actually wrong.
 *
 * Doing the retry here — in one place — means every page is protected, instead
 * of each page having to remember to protect itself.
 *
 * Only a lost connection is retried. A genuine mistake (a wrong field, a broken
 * rule) is passed straight through so real problems are never hidden. Because a
 * lost connection means the statement never ran, trying again cannot double up
 * any work.
 */
function withConnectionRetry() {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          for (let attempt = 1; ; attempt += 1) {
            try {
              return await query(args);
            } catch (error) {
              const giveUp = !isDatabaseUnavailable(error) || attempt >= MAX_ATTEMPTS;
              if (giveUp) throw error;
              await new Promise((resolve) => setTimeout(resolve, backoffMs(attempt)));
            }
          }
        },
      },
    },
  });
}

// The type of the client after the retry wrapper is added.
type SafePrismaClient = ReturnType<typeof withConnectionRetry>;

const globalForPrisma = globalThis as unknown as {
  prisma: SafePrismaClient | undefined;
};

// Reuse one connection for the whole server instead of opening a new one on
// every request, which is what makes the site fast and keeps us well inside the
// number of connections the database plan allows.
export const prisma: SafePrismaClient = globalForPrisma.prisma ?? withConnectionRetry();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Runs a database read, retrying once if the connection was cold.
 *
 * The retry wrapper above already covers this, so this helper simply runs the
 * work. It is kept because it reads clearly at the call sites that fall back to
 * an offline copy of the catalogue.
 */
export async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  return operation();
}
