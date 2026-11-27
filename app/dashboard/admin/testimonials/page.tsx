import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminDashboard();
  const { status } = await searchParams;
  const activeStatus = (STATUSES as readonly string[]).includes(status || '')
    ? (status as (typeof STATUSES)[number])
    : 'PENDING';

  const [counts, entries] = await Promise.all([
    prisma.testimonial.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.testimonial.findMany({
      where: { status: activeStatus },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  const countFor = (value: string) =>
    counts.find((entry) => entry.status === value)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white break-words">Testimonials</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          Experiences sent in by visitors. Only approved entries appear on the public
          testimonials page.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/testimonials?status=${value}`}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value.charAt(0) + value.slice(1).toLowerCase()} ({countFor(value)})
          </Link>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/75 px-6 py-14 text-center">
          <Quote className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-300">
            Nothing here. New experiences sent from the testimonials page will show up for
            review.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-0.5" aria-label={`${entry.rating} out of 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${
                            n <= entry.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <Badge className="bg-slate-800 text-slate-200 border border-slate-700">{entry.status}</Badge>
                  </div>

                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-100 break-words">
                    {entry.message}
                  </p>

                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-semibold text-amber-400 hover:text-amber-300">
                      Full story
                    </summary>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300 break-words">
                      {entry.details}
                    </p>
                  </details>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-blue-950/70 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
                      {entry.role}
                    </span>
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      {entry.focus}
                    </span>
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      {entry.region}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 break-words">
                    <span className="font-semibold text-white">{entry.name}</span>
                    {` · ${entry.company}`}
                    {` · ${entry.email}`}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Sent {new Date(entry.createdAt).toLocaleString()}
                    {entry.photoUrl ? ' · photo attached' : ' · no photo'}
                  </p>
                </div>

                <div className="flex flex-wrap shrink-0 gap-2">
                  {entry.status !== 'APPROVED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/testimonials/${entry.id}`}
                      payload={{ action: 'approve' }}
                      label="Approve"
                      className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                    />
                  )}
                  {entry.status !== 'REJECTED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/testimonials/${entry.id}`}
                      payload={{ action: 'reject' }}
                      label="Reject"
                      className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                    />
                  )}
                  {entry.status !== 'PENDING' && (
                    <AdminActionButton
                      endpoint={`/api/admin/testimonials/${entry.id}`}
                      payload={{ action: 'reset' }}
                      label="Send back"
                      className="bg-slate-700 text-white hover:bg-slate-600 hover:text-white"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
