'use client';

import { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { BOOST_DAY_OPTIONS } from '@/lib/boost-rules';

type BoostState = {
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  endsAt?: string | Date | null;
  resolution?: string | null;
} | null;

/**
 * "Request boost" control shown on each PUBLISHED opportunity card in the
 * company dashboard. Files a POST /api/opportunities/[id]/boost request that
 * an admin later approves from /dashboard/admin/boosts; shows the live state
 * (pending / active until…) once one exists.
 */
export function BoostRequestButton({
  opportunityId,
  moderationStatus,
  boost,
}: {
  opportunityId: string;
  moderationStatus: string;
  boost: BoostState;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (moderationStatus !== 'PUBLISHED') return null;

  if (boost?.status === 'APPROVED' && boost.endsAt) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <Rocket className="h-3 w-3" />
        Boosted until {new Date(boost.endsAt).toLocaleDateString()}
      </span>
    );
  }
  if (boost?.status === 'REQUESTED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        <Rocket className="h-3 w-3" />
        Boost pending review
      </span>
    );
  }

  async function requestBoost(days: number) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/boost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || 'Could not file the request');
        return;
      }
      setOpen(false);
      // Re-render with the new REQUESTED state — simplest reliable signal
      // is a full refresh of the dashboard data.
      window.location.reload();
    } catch {
      setError('Network error — please retry');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        <Rocket className="h-3 w-3" />
        Request boost
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-700">Choose a boost length</p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            An admin reviews the request; approved boosts feature this posting until the window ends.
          </p>
          <div className="mt-2 flex gap-1.5">
            {BOOST_DAY_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => requestBoost(days)}
                disabled={busy}
                className="flex-1 rounded-lg bg-slate-900 px-2 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
              >
                {days}d
              </button>
            ))}
          </div>
          {error && <p className="mt-2 text-[10px] font-medium text-red-600">{error}</p>}
          {busy && (
            <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Sending…
            </p>
          )}
        </div>
      )}
    </div>
  );
}