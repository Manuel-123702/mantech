import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendWeeklyDigests } from '@/lib/alert-delivery';
import { expireDueBoosts } from '@/lib/boosts';

/**
 * Weekly opportunity digest — GET /api/cron/weekly-digest
 *
 * Scheduled once a week (e.g. by Vercel Cron with a `CRON_SECRET`, or any
 * external scheduler). For every saved alert it sends ONE digest listing the
 * opportunities published in the last 7 days that match the alert's region /
 * city / work-mode preferences (in-app notification + best-effort email).
 *
 * Auth: when CRON_SECRET is configured, callers must send
 * `Authorization: Bearer <CRON_SECRET>`. Without a configured secret the
 * route stays open in development and refuses to run in production, so a
 * misconfigured deployment can never become an open relay.
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

  const [result, expiredBoosts] = await Promise.all([
    sendWeeklyDigests({ days: 7 }),
    // Safety net for boost windows — the dedicated daily
    // /api/cron/expire-boosts sweep is the primary driver.
    expireDueBoosts().catch(() => 0),
  ]);
  return NextResponse.json({ ok: true, expiredBoosts, ...result });
}