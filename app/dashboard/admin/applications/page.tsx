import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';

const STATUSES = [
  'ALL',
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'PLACEMENT_PENDING',
  'PLACED',
  'INTERNSHIP_ACTIVE',
  'COMPLETED',
  'REJECTED',
  'WITHDRAWN',
  'ARCHIVED',
] as const;

const METHOD_LABELS: Record<string, string> = {
  MANTECH: 'On MANTECH',
  COMPANY_WEBSITE: 'Company website',
  EXTERNAL: 'External platform',
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; method?: string }>;
}) {
  await requireAdminDashboard();
  const { status, method } = await searchParams;
  const activeStatus = (STATUSES as readonly string[]).includes(status || '') ? (status as string) : 'ALL';
  const activeMethod = ['ALL', 'MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL'].includes(method || '')
    ? (method as string)
    : 'ALL';

  const where = {
    status: activeStatus === 'ALL' ? undefined : (activeStatus as never),
    applicationMethod: activeMethod === 'ALL' ? undefined : (activeMethod as never),
  };

  const [applications, total, statusGroups] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        internProfile: {
          select: {
            user: { select: { fullName: true, email: true } },
            fieldOfStudy: { select: { name: true } },
          },
        },
        opportunity: {
          select: {
            title: true,
            slug: true,
            organization: { select: { name: true, type: true, verificationStatus: true } },
          },
        },
        job: {
          select: {
            title: true,
            slug: true,
            organization: { select: { name: true, type: true, verificationStatus: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 80,
    }),
    prisma.application.count({ where }),
    prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const countByStatus = new Map(statusGroups.map((group) => [group.status, group._count._all]));

  const buildHref = (nextStatus: string, nextMethod: string) => {
    const params = new URLSearchParams();
    params.set('status', nextStatus);
    params.set('method', nextMethod);
    return `/dashboard/admin/applications?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white break-words">Application monitoring</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          {total} application(s) in this view. Read-only oversight — recruiters manage pipelines in their own
          dashboards; admins only observe platform-wide activity.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={buildHref(value, activeMethod)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value === 'ALL' ? 'All' : value.replace(/_/g, ' ')}
            {value !== 'ALL' && countByStatus.get(value as never) ? (
              <span className="ml-1.5 text-[10px] opacity-80">{countByStatus.get(value as never)}</span>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL'].map((value) => (
          <Link
            key={value}
            href={buildHref(activeStatus, value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeMethod === value
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value === 'ALL' ? 'All methods' : METHOD_LABELS[value]}
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">No applications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => {
            const listing = application.opportunity ?? application.job;
            const orgRow = listing?.organization;
            return (
              <div
                key={application.id}
                className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white break-words">
                        {application.internProfile.user.fullName}
                      </p>
                      <span className="rounded-full bg-amber-950/70 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                        {application.status.replace(/_/g, ' ')}
                      </span>
                      <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                        {METHOD_LABELS[application.applicationMethod]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 break-words">
                      {application.internProfile.fieldOfStudy?.name || application.internProfile.user.email}
                    </p>
                    <p className="text-xs text-slate-200 break-words">
                      <span className="font-semibold text-white">{listing?.title ?? '—'}</span>{' '}
                      <span className="text-slate-400">({application.job ? 'Job' : 'Internship'})</span> ·{' '}
                      <span className="text-slate-300">{orgRow?.name ?? '—'}</span>
                      {orgRow && orgRow.verificationStatus !== 'VERIFIED' && (
                        <span className="ml-1 text-amber-400">· {orgRow.verificationStatus}</span>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 font-mono text-[11px] text-slate-400">
                    Applied {application.createdAt.toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
