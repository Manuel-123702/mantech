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
        <h2 className="text-lg font-bold text-slate-900">Moderation reports</h2>
        <p className="mt-1 text-xs text-slate-500">
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
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {REPORT_STATUS_LABELS[value]} ({countFor(value)})
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            No {REPORT_STATUS_LABELS[activeStatus].toLowerCase()} reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={
                        report.targetType === 'OPPORTUNITY'
                          ? `/internships/${report.targetId}`
                          : `/intern-passports/${report.targetId}`
                      }
                      className="text-sm font-bold text-slate-900 hover:text-blue-700"
                    >
                      {report.targetTitle}
                    </Link>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {REPORT_TARGET_LABELS[report.targetType]}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                      {REPORT_REASON_LABELS[report.reason]}
                    </Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      <Flag className="h-3 w-3" />
                      {report.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>
                      Reported by {report.reporter.fullName}
                      {report.reporter.email ? ` (${report.reporter.email})` : ''}
                    </span>
                    <span>Filed {report.createdAt.toISOString().slice(0, 10)}</span>
                    {report.reviewedAt && (
                      <span>Reviewed {report.reviewedAt.toISOString().slice(0, 10)}</span>
                    )}
                  </div>
                  {report.details && (
                    <p className="max-w-2xl text-xs text-slate-600">{report.details}</p>
                  )}
                  {report.resolution && (
                    <p className="text-[11px] font-medium text-slate-500">
                      Resolution: {report.resolution}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {report.status === 'OPEN' && (
                    <AdminActionButton
                      endpoint={`/api/admin/reports/${report.id}`}
                      payload={{ action: 'start_review' }}
                      label="Start review"
                    />
                  )}
                  {report.status !== 'ACTIONED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/reports/${report.id}`}
                      payload={{ action: 'action' }}
                      label="Mark actioned"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      reasonLabel="Resolution note (optional)"
                      reasonField="resolution"
                    />
                  )}
                  {report.status !== 'DISMISSED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/reports/${report.id}`}
                      payload={{ action: 'dismiss' }}
                      label="Dismiss"
                      variant="outline"
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