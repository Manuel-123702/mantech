import { MessageSquareReply } from 'lucide-react';
import type { ResponseRateStats } from '@/lib/response-rate';

/**
 * "This employer actually replies" trust badge.
 *
 * Rendered on public company and internship pages from the stats the API
 * already computes (see lib/response-rate.ts). Hidden entirely until the
 * sample is large enough to mean anything — an empty or missing payload
 * renders nothing rather than a guess.
 *
 * `surface` switches between dark hero backgrounds and light cards.
 */
export function ResponseRateBadge({
  stats,
  surface = 'dark',
}: {
  stats: ResponseRateStats | null;
  surface?: 'dark' | 'light';
}) {
  if (!stats || !stats.publishable || !stats.label) return null;

  const positive = stats.ratePercent >= 50;
  const tone =
    surface === 'dark'
      ? positive
        ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
        : 'bg-amber-500/20 border-amber-400/30 text-amber-300'
      : positive
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : 'bg-amber-50 border-amber-200 text-amber-700';

  return (
    <span
      title={`${stats.responded} of ${stats.received} applicants heard back`}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
    >
      <MessageSquareReply className="w-3.5 h-3.5" /> {stats.label}
    </span>
  );
}
