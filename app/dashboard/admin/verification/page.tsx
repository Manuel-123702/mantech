import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { FileText, Globe, Mail, MapPin, Phone, Building2, Landmark } from 'lucide-react';

const STATUSES = ['PENDING', 'REJECTED', 'SUSPENDED', 'VERIFIED'] as const;

export default async function AdminVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminDashboard();
  const { status } = await searchParams;
  const activeStatus = (STATUSES as readonly string[]).includes(status || '') ? (status as string) : 'PENDING';

  const [counts, organizations] = await Promise.all([
    prisma.organization.groupBy({ by: ['verificationStatus'], _count: { _all: true } }),
    prisma.organization.findMany({
      where: { verificationStatus: activeStatus as 'PENDING' | 'REJECTED' | 'SUSPENDED' | 'VERIFIED' },
      include: {
        region: true,
        industry: true,
        members: { include: { user: { select: { fullName: true, email: true } } } },
        verifications: { orderBy: { submittedAt: 'desc' }, take: 1 },
        _count: { select: { opportunities: true, members: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    }),
  ]);

  const countFor = (value: string) => counts.find((entry) => entry.verificationStatus === value)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Organization verification</h2>
        <p className="mt-1 text-xs text-slate-500">
          Organizations contact MANTECH, submit credentials, and await administrative verification before recruiter
          privileges unlock. Every decision is written to the audit trail and notifies the organization.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/verification?status=${value}`}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value} ({countFor(value)})
          </Link>
        ))}
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No organizations in {activeStatus.toLowerCase()} state.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {organizations.map((organization) => {
            const latestVerification = organization.verifications[0];
            const Icon = organization.type === 'UNIVERSITY' ? Landmark : Building2;
            return (
              <div key={organization.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-bold text-slate-900">{organization.name}</span>
                      <Badge variant="outline">{organization.type}</Badge>
                      <Badge variant="secondary">{organization.packageCode}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[organization.city, organization.region?.name].filter(Boolean).join(', ') || 'Cameroon'}
                      </span>
                      {organization.website && (
                        <a
                          href={organization.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Globe className="h-3 w-3" />
                          {organization.website}
                        </a>
                      )}
                      {organization.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {organization.email}
                        </span>
                      )}
                      {organization.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {organization.phone}
                        </span>
                      )}
                    </div>
                    {organization.description && (
                      <p className="max-w-2xl text-xs text-slate-600 line-clamp-2">{organization.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500">
                      <span>{organization._count.members} member(s)</span>
                      <span>{organization._count.opportunities} opportunity(ies)</span>
                      {organization.industry?.name && <span>Industry: {organization.industry.name}</span>}
                      <span>
                        Contact: {organization.members.map((member) => member.user.fullName).join(', ') || 'no member yet'}
                      </span>
                    </div>
                    {latestVerification && (
                      <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-600">
                        <p className="font-semibold text-slate-700">
                          Verification dossier · submitted {latestVerification.submittedAt.toISOString().slice(0, 10)}
                          {latestVerification.taxIdNumber ? ` · Tax ID: ${latestVerification.taxIdNumber}` : ''}
                        </p>
                        {latestVerification.documentUrls.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {latestVerification.documentUrls.map((url, index) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-medium text-blue-600 hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                Document {index + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1 text-slate-400">No supporting documents uploaded.</p>
                        )}
                        {latestVerification.reviewerNote && (
                          <p className="mt-1">Last reviewer note: {latestVerification.reviewerNote}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <AdminActionButton
                      endpoint={`/api/admin/verifications/${organization.id}`}
                      payload={{ action: 'approve' }}
                      label="Approve & verify"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      disabled={organization.verificationStatus === 'VERIFIED'}
                    />
                    {organization.verificationStatus !== 'REJECTED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/verifications/${organization.id}`}
                        payload={{ action: 'reject' }}
                        label="Reject"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        reasonLabel="Rejection reason (shared with the organization)"
                        reasonField="note"
                      />
                    )}
                    {organization.verificationStatus !== 'SUSPENDED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/verifications/${organization.id}`}
                        payload={{ action: 'suspend' }}
                        label="Suspend"
                        variant="outline"
                        reasonLabel="Suspension reason (shared with the organization)"
                        reasonField="note"
                      />
                    )}
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
