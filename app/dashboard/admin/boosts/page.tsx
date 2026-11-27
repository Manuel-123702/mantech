import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { expireDueBoosts } from '@/lib/boosts';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';
import { BOOST_STATUSES, BOOST_STATUS_LABELS, type BoostStatus } from '@/lib/boost-rules';

const STATUS_CLASS: Record<BoostStatus, string> = {
  REQUESTED: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
  APPROVED: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-rose-950/70 text-rose-300 border-rose-500/30',
  EXPIRED: 'bg-slate-800 text-slate-300 border-slate-700',
};

export default async function AdminBoostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminDashboard();
  await expireDueBoosts();

  const { status } = await searchParams;
  const activeStatus = ((BOOST_STATUSES as readonly string[]).includes(status || '')
    ? status
    : 'REQUESTED') as BoostStatus;

  const [counts, boosts] = await Promise.all([
    prisma.boost.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.boost.findMany({
      where: { status: activeStatus },
      include: {
        opportunity: { select: { id: true, title: true, slug: true, isFeatured: true } },
        organization: { select: { name: true, packageCode: true } },
        requestedBy: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    }),
  ]);

  const countFor = (value: string) => counts.find((entry) => entry.status === value)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-amber-400 break-words">Boost requests</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          Companies request a time-boxed featured placement for a published opportunity. Approving
          sorts the posting first in listings until the window ends; the organization&apos;s package
          featured-badge limit is enforced on approval. Every decision lands in the audit trail.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {BOOST_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/boosts?status=${value}`}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {BOOST_STATUS_LABELS[value]} ({countFor(value)})
          </Link>
        ))}
      </div>

      {boosts.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">
            No {BOOST_STATUS_LABELS[activeStatus].toLowerCase()} boosts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {boosts.map((boost) => (
            <div key={boost.id} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/internships/${boost.opportunity.slug ?? boost.opportunity.id}`}
                      className="text-sm font-bold text-white hover:text-amber-300 break-words"
                    >
                      {boost.opportunity.title}
                    </Link>
                    <Badge className={`${STATUS_CLASS[boost.status]} border text-[10px]`}>
                      {BOOST_STATUS_LABELS[boost.status]}
                    </Badge>
                    {boost.status === 'APPROVED' && boost.opportunity.isFeatured && (
                      <Badge className="bg-amber-950/70 text-amber-300 border border-amber-500/30 text-[10px] uppercase">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    <span className="break-words">
                      {boost.organization.name} ({boost.organization.packageCode} package)
                    </span>
                    <span className="text-slate-200 font-semibold">{boost.days}-day boost</span>
                    <span className="break-words">
                      Requested by {boost.requestedBy.fullName} on{' '}
                      {boost.createdAt.toISOString().slice(0, 10)}
                    </span>
                    {boost.startsAt && boost.endsAt && (
                      <span>
                        Window {boost.startsAt.toISOString().slice(0, 10)} →{' '}
                        {boost.endsAt.toISOString().slice(0, 10)}
                      </span>
                    )}
                  </div>
                  {boost.note && <p className="max-w-2xl text-xs text-slate-300 break-words">{boost.note}</p>}
                  {boost.resolution && (
                    <p className="text-[11px] font-medium text-emerald-300 break-words">
                      Resolution: {boost.resolution}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
                  {boost.status === 'REQUESTED' && (
                    <>
                      <AdminActionButton
                        endpoint={`/api/admin/boosts/${boost.id}`}
                        payload={{ action: 'approve' }}
                        label="Approve boost"
                        className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                      />
                      <AdminActionButton
                        endpoint={`/api/admin/boosts/${boost.id}`}
                        payload={{ action: 'reject' }}
                        label="Reject"
                        className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                        reasonLabel="Why is this request rejected? (optional)"
                        reasonField="resolution"
                      />
                    </>
                  )}
                  {boost.status !== 'REQUESTED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                      <Rocket className="h-3 w-3 text-amber-400" />
                      {BOOST_STATUS_LABELS[boost.status]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
