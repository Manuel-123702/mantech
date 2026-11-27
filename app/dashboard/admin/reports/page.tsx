import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';
import {
  REPORT_STATUSES,
  REPORT_STATUS_LABELS,
  REPORT_TARGET_LABELS,
  REPORT_REASON_LABELS,
  type ReportStatus,
} from '@/lib/report-reasons';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminDashboard();
  const { status } = await searchParams;
  const activeStatus = ((REPORT_STATUSES as readonly string[]).includes(status || '')
    ? status
    : 'OPEN') as ReportStatus;

  const [counts, reports] = await Promise.all([
    prisma.report.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.report.findMany({
      where: { status: activeStatus as 'OPEN' | 'REVIEWING' | 'ACTIONED' | 'DISMISSED' },
      include: { reporter: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'asc' },
      take: 50,
    }),
  ]);

  const countFor = (value: string) => counts.find((entry) => entry.status === value)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white break-words">Moderation reports</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          Members flag scammy, misleading or inappropriate content here. Act on a report by
          suspending or rejecting the content through the moderation tools, then mark the report
          actioned — or dismiss it. Every decision is recorded in the audit trail.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {REPORT_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/reports?status=${value}`}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {REPORT_STATUS_LABELS[value]} ({countFor(value)})
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">
            No {REPORT_STATUS_LABELS[activeStatus].toLowerCase()} reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={
                        report.targetType === 'OPPORTUNITY'
                          ? `/internships/${report.targetId}`
                          : `/intern-passports/${report.targetId}`
                      }
                      className="text-sm font-bold text-white hover:text-amber-300 break-words"
                    >
                      {report.targetTitle}
                    </Link>
                    <Badge className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] uppercase">
                      {REPORT_TARGET_LABELS[report.targetType]}
                    </Badge>
                    <Badge className="bg-rose-950/70 text-rose-300 border border-rose-500/30 text-[10px]">
                      {REPORT_REASON_LABELS[report.reason]}
                    </Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[10px] font-semibold text-slate-200">
                      <Flag className="h-3 w-3 text-amber-400" />
                      {report.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    <span className="break-words">
                      Reported by <strong className="text-slate-200">{report.reporter.fullName}</strong>
                      {report.reporter.email ? ` (${report.reporter.email})` : ''}
                    </span>
                    <span>Filed {report.createdAt.toISOString().slice(0, 10)}</span>
                    {report.reviewedAt && (
                      <span>Reviewed {report.reviewedAt.toISOString().slice(0, 10)}</span>
                    )}
                  </div>
                  {report.details && (
                    <p className="max-w-2xl text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 break-words">
                      {report.details}
                    </p>
                  )}
                  {report.resolution && (
                    <p className="text-[11px] font-medium text-emerald-300 break-words">
                      Resolution: {report.resolution}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
                  {report.status === 'OPEN' && (
                    <AdminActionButton
                      endpoint={`/api/admin/reports/${report.id}`}
                      payload={{ action: 'start_review' }}
                      label="Start review"
                      className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                    />
                  )}
                  {report.status !== 'ACTIONED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/reports/${report.id}`}
                      payload={{ action: 'action' }}
                      label="Mark actioned"
                      className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                      reasonLabel="Resolution note (optional)"
                      reasonField="resolution"
                    />
                  )}
                  {report.status !== 'DISMISSED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/reports/${report.id}`}
                      payload={{ action: 'dismiss' }}
                      label="Dismiss"
                      className="bg-slate-700 text-white hover:bg-slate-600 hover:text-white"
                      reasonLabel="Why is this report dismissed? (optional)"
                      reasonField="resolution"
                    />
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
