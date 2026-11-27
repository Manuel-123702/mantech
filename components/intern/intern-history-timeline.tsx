import {
  History,
  FileText,
  CalendarClock,
  Building2,
  Trophy,
  UserPlus,
  BadgeCheck,
  CircleDot,
} from 'lucide-react';
import { summarizeHistory, type HistoryEntry } from '@/lib/intern-history';

const TONE_STYLES = {
  milestone: {
    icon: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40',
    title: 'text-white',
  },
  progress: {
    icon: 'text-blue-300 bg-blue-950/80 border-blue-500/40',
    title: 'text-white',
  },
  neutral: {
    icon: 'text-slate-300 bg-slate-800 border-slate-600',
    title: 'text-slate-200',
  },
  closed: {
    icon: 'text-slate-400 bg-slate-800/60 border-slate-700',
    title: 'text-slate-400',
  },
} as const;

const CATEGORY_ICONS = {
  registration: UserPlus,
  application: FileText,
  status: BadgeCheck,
  interview: CalendarClock,
  placement: Building2,
  achievement: Trophy,
} as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function InternHistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
  const summary = summarizeHistory(entries);

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 overflow-hidden text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 sm:px-6 py-4 sm:py-5">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white font-heading">My Journey</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-300 break-words">
            Everything you have done on MANTECH, built from your real activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 font-semibold text-slate-200">
            {summary.applications} application{summary.applications === 1 ? '' : 's'}
          </span>
          <span className="rounded-full bg-blue-950/70 border border-blue-500/40 px-3 py-1 font-semibold text-blue-300">
            {summary.interviews} interview{summary.interviews === 1 ? '' : 's'}
          </span>
          <span className="rounded-full bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 font-semibold text-emerald-300">
            {summary.placements} placement{summary.placements === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center px-4 sm:px-6 py-14 text-center">
          <History className="mb-3 h-9 w-9 text-slate-500" />
          <h3 className="font-semibold text-white">No activity yet</h3>
          <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-400">
            Your applications, interviews and placements will appear here as your journey grows.
          </p>
        </div>
      ) : (
        <ol className="relative px-4 sm:px-6 py-6">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[1.9rem] top-10 w-px bg-slate-800 sm:left-[2.55rem]"
          />
          {entries.map((entry) => {
            const Icon = CATEGORY_ICONS[entry.category] ?? CircleDot;
            const style = TONE_STYLES[entry.tone];
            const body = (
              <>
                <span
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${style.icon}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 pb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className={`text-sm font-semibold break-words ${style.title}`}>
                      {entry.title}
                    </h3>
                    <time
                      dateTime={entry.occurredAt}
                      className="text-xs text-slate-400 shrink-0"
                    >
                      {formatDate(entry.occurredAt)}
                    </time>
                  </div>
                  {entry.description ? (
                    <p className="mt-1 text-xs sm:text-sm text-slate-300 break-words leading-relaxed">
                      {entry.description}
                    </p>
                  ) : null}
                </div>
              </>
            );

            return (
              <li key={entry.id} className="relative flex gap-3 sm:gap-4">
                {entry.href ? (
                  <a
                    href={entry.href}
                    className="group flex min-w-0 flex-1 gap-3 sm:gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
