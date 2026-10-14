import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { expireDueBoosts } from '@/lib/boosts';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';
import { BOOST_STATUSES, BOOST_STATUS_LABELS, type BoostStatus } from '@/lib/boost-rules';

const STATUS_CLASS: Record<BoostStatus, string> = {
  REQUESTED: 'bg-amber-100 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default async function AdminBoostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminDashboard();
  // Lazily expire boosts whose window elapsed before showing the queue.
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
        <h2 className="text-lg font-bold text-slate-900">Boost requests</h2>
        <p className="mt-1 text-xs text-slate-500">
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
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {BOOST_STATUS_LABELS[value]} ({countFor(value)})
          </Link>
        ))}
      </div>

      {boosts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            No {BOOST_STATUS_LABELS[activeStatus].toLowerCase()} boosts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {boosts.map((boost) => (
            <div key={boost.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/internships/${boost.opportunity.slug ?? boost.opportunity.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-700"
                    >
                      {boost.opportunity.title}
                    </Link>
                    <Badge className={`${STATUS_CLASS[boost.status]} text-[10px]`}>
                      {BOOST_STATUS_LABELS[boost.status]}
                    </Badge>
                    {boost.status === 'APPROVED' && boost.opportunity.isFeatured && (
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>
                      {boost.organization.name} ({boost.organization.packageCode} package)
                    </span>
                    <span>{boost.days}-day boost</span>
                    <span>
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
                  {boost.note && <p className="max-w-2xl text-xs text-slate-600">{boost.note}</p>}
                  {boost.resolution && (
                    <p className="text-[11px] font-medium text-slate-500">
                      Resolution: {boost.resolution}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {boost.status === 'REQUESTED' && (
                    <>
                      <AdminActionButton
                        endpoint={`/api/admin/boosts/${boost.id}`}
                        payload={{ action: 'approve' }}
                        label="Approve boost"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      />
                      <AdminActionButton
                        endpoint={`/api/admin/boosts/${boost.id}`}
                        payload={{ action: 'reject' }}
                        label="Reject"
                        variant="outline"
                        reasonLabel="Why is this request rejected? (optional)"
                        reasonField="resolution"
                      />
                    </>
                  )}
                  {boost.status !== 'REQUESTED' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      <Rocket className="h-3 w-3" />
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
