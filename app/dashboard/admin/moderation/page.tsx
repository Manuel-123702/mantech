import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const STATUSES = ['PENDING_REVIEW', 'PUBLISHED', 'SUSPENDED', 'REJECTED', 'DRAFT', 'ARCHIVED'] as const;

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminDashboard();
  const { status } = await searchParams;
  const activeStatus = (STATUSES as readonly string[]).includes(status || '') ? (status as string) : 'PENDING_REVIEW';

  const [counts, opportunities] = await Promise.all([
    prisma.internshipOpportunity.groupBy({ by: ['moderationStatus'], _count: { _all: true } }),
    prisma.internshipOpportunity.findMany({
      where: { moderationStatus: activeStatus as 'PENDING_REVIEW' | 'PUBLISHED' | 'SUSPENDED' | 'REJECTED' | 'DRAFT' | 'ARCHIVED' },
      include: {
        organization: { select: { id: true, name: true, type: true, verificationStatus: true } },
        field: { select: { name: true } },
        region: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    }),
  ]);

  const countFor = (value: string) => counts.find((entry) => entry.moderationStatus === value)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Opportunity moderation queue</h2>
        <p className="mt-1 text-xs text-slate-500">
          Every posting passes through administrative review before it becomes publicly visible. Decisions notify the
          hosting organization and are recorded in the audit trail.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/moderation?status=${value}`}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value.replace('_', ' ')} ({countFor(value)})
          </Link>
        ))}
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No opportunities in {activeStatus.replace('_', ' ').toLowerCase()} state.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/internships/${opportunity.slug}`} className="text-sm font-bold text-slate-900 hover:text-blue-700">
                      {opportunity.title}
                    </Link>
                    {opportunity.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                    <Badge variant="outline">{opportunity.applicationMethod.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    {opportunity.organization.name} · {opportunity.organization.type}
                    {opportunity.organization.verificationStatus !== 'VERIFIED' && (
                      <span className="ml-1 font-semibold text-amber-700">({opportunity.organization.verificationStatus})</span>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>Field: {opportunity.field?.name || 'Not set'}</span>
                    <span>
                      Location: {opportunity.city}
                      {opportunity.region?.name ? `, ${opportunity.region.name}` : ''}
                    </span>
                    <span>Deadline: {opportunity.deadline.toISOString().slice(0, 10)}</span>
                    <span>{opportunity._count.applications} application(s)</span>
                    <span>Submitted {opportunity.createdAt.toISOString().slice(0, 10)}</span>
                  </div>
                  <p className="max-w-2xl text-xs text-slate-600 line-clamp-2">{opportunity.description}</p>
                  {opportunity.rejectionReason && (
                    <p className="text-[11px] font-medium text-red-600">Rejection reason: {opportunity.rejectionReason}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {opportunity.moderationStatus !== 'PUBLISHED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'publish' }}
                      label="Approve & publish"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    />
                  )}
                  {opportunity.moderationStatus === 'PUBLISHED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'suspend' }}
                      label="Suspend"
                      variant="outline"
                      reasonLabel="Suspension reason (sent to the organization)"
                      reasonField="reason"
                    />
                  )}
                  {opportunity.moderationStatus !== 'REJECTED' && opportunity.moderationStatus !== 'ARCHIVED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'reject' }}
                      label="Reject"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      reasonLabel="Rejection reason (sent to the organization)"
                      reasonField="reason"
                    />
                  )}
                  {(opportunity.moderationStatus === 'SUSPENDED' ||
                    opportunity.moderationStatus === 'REJECTED' ||
                    opportunity.moderationStatus === 'ARCHIVED') && (
                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'restore' }}
                      label="Restore to review"
                      variant="outline"
                    />
                  )}
                  {opportunity.moderationStatus !== 'ARCHIVED' && (
                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'archive' }}
                      label="Archive"
                      variant="ghost"
                      confirmText="Archive this opportunity? It will be removed from public listings."
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
