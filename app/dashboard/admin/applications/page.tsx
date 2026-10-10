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
        <h2 className="text-lg font-bold text-slate-900">Application monitoring</h2>
        <p className="mt-1 text-xs text-slate-500">
          {total} application(s) in this view. Read-only oversight — recruiters manage pipelines in their own
          dashboards; admins only observe platform-wide activity.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={buildHref(value, activeMethod)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value === 'ALL' ? 'All' : value.replace(/_/g, ' ')}
            {value !== 'ALL' && countByStatus.get(value as never) ? (
              <span className="ml-1.5 text-[10px] opacity-70">{countByStatus.get(value as never)}</span>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL'].map((value) => (
          <Link
            key={value}
            href={buildHref(activeStatus, value)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeMethod === value ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value === 'ALL' ? 'All methods' : METHOD_LABELS[value]}
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No applications match this filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Opportunity</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{application.internProfile.user.fullName}</p>
                      <p className="text-[10px] text-slate-500">
                        {application.internProfile.fieldOfStudy?.name || application.internProfile.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <p className="max-w-[240px] truncate font-medium">{application.opportunity.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{application.opportunity.organization.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {application.opportunity.organization.type}
                        {application.opportunity.organization.verificationStatus !== 'VERIFIED' && (
                          <span className="ml-1 text-amber-600">
                            · {application.opportunity.organization.verificationStatus}
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{METHOD_LABELS[application.applicationMethod]}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                        {application.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                      {application.createdAt.toISOString().slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
