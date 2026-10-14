import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { expireDueBoosts } from '@/lib/boosts';

/**
 * Boost expiry sweep — GET /api/cron/expire-boosts
 *
 * Runs daily (Vercel Cron with `CRON_SECRET`). Flips APPROVED boosts whose
 * window elapsed to EXPIRED and switches the featured flag off, so boosted
 * opportunities stop sorting first exactly when their window ends.
 *
 * Auth: same contract as /api/cron/weekly-digest — Bearer CRON_SECRET when
 * configured; open only in development, 503 in production without a secret.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured' },
      { status: 503 },
    );
  }

  const expired = await expireDueBoosts();
  return NextResponse.json({ ok: true, expired });
}