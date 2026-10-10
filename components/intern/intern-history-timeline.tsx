import {
  History,
  FileText,
  Briefcase,
  CalendarClock,
  Building2,
  Trophy,
  UserPlus,
  BadgeCheck,
  CircleDot,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { summarizeHistory, type HistoryEntry } from '@/lib/intern-history';

/**
 * Visual treatment per tone. Kept local to the view: the timeline data itself
 * stays free of presentation concerns so it can be unit tested.
 */
const TONE_STYLES = {
  milestone: {
    dot: 'bg-emerald-600 ring-emerald-100',
    icon: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    title: 'text-slate-900',
  },
  progress: {
    dot: 'bg-blue-600 ring-blue-100',
    icon: 'text-blue-700 bg-blue-50 border-blue-200',
    title: 'text-slate-900',
  },
  neutral: {
    dot: 'bg-slate-400 ring-slate-100',
    icon: 'text-slate-600 bg-slate-50 border-slate-200',
    title: 'text-slate-800',
  },
  closed: {
    dot: 'bg-slate-300 ring-slate-100',
    icon: 'text-slate-500 bg-slate-50 border-slate-200',
    title: 'text-slate-600',
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

/**
 * Your journey through MANTECH. It lists what you have really done here, newest
 * first, so you can see your progress at a glance.
 *
 * Entries arrive already sorted newest-first from `buildInternHistory`, so this
 * component only renders — it never re-sorts, which keeps the server and client
 * markup identical (no hydration mismatch).
 */
export function InternHistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
  const summary = summarizeHistory(entries);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">My journey</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Everything you have done on MANTECH, built from your real activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {summary.applications} application{summary.applications === 1 ? '' : 's'}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              {summary.interviews} interview{summary.interviews === 1 ? '' : 's'}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              {summary.placements} placement{summary.placements === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <History className="mb-3 h-9 w-9 text-slate-300" />
            <h3 className="font-semibold text-slate-900">No activity yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Your applications, interviews and placements will appear here as your
              journey grows.
            </p>
          </div>
        ) : (
          <ol className="relative px-6 py-6">
            {/* Vertical rail behind the markers (decorative only). */}
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-[2.05rem] top-10 w-px bg-slate-200 sm:left-[2.55rem]"
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
                      <h3 className={`text-sm font-semibold ${style.title}`}>
                        {entry.title}
                      </h3>
                      <time
                        dateTime={entry.occurredAt}
                        className="text-xs text-slate-500"
                      >
                        {formatDate(entry.occurredAt)}
                      </time>
                    </div>
                    {entry.description ? (
                      <p className="mt-0.5 text-sm text-slate-600">
                        {entry.description}
                      </p>
                    ) : null}
                  </div>
                </>
              );

              return (
                <li key={entry.id} className="relative flex gap-4">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      className="group flex min-w-0 flex-1 gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex min-w-0 flex-1 gap-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}