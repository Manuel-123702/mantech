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
        <h2 className="text-lg font-bold text-white break-words">Organization verification</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
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
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value} ({countFor(value)})
          </Link>
        ))}
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">No organizations in {activeStatus.toLowerCase()} state.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {organizations.map((organization) => {
            const latestVerification = organization.verifications[0];
            const Icon = organization.type === 'UNIVERSITY' ? Landmark : Building2;
            return (
              <div key={organization.id} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Icon className="h-4 w-4 text-amber-400 shrink-0" />
                      <span className="text-sm font-bold text-white break-words">{organization.name}</span>
                      <Badge className="bg-slate-800 text-slate-200 border border-slate-700">{organization.type}</Badge>
                      <Badge className="bg-amber-950/70 text-amber-300 border border-amber-500/30">{organization.packageCode}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {[organization.city, organization.region?.name].filter(Boolean).join(', ') || 'Cameroon'}
                      </span>
                      {organization.website && (
                        <a
                          href={organization.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-amber-400 hover:underline break-all"
                        >
                          <Globe className="h-3 w-3 shrink-0" />
                          {organization.website}
                        </a>
                      )}
                      {organization.email && (
                        <span className="inline-flex items-center gap-1 break-all">
                          <Mail className="h-3 w-3 shrink-0" />
                          {organization.email}
                        </span>
                      )}
                      {organization.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 shrink-0" />
                          {organization.phone}
                        </span>
                      )}
                    </div>
                    {organization.description && (
                      <p className="max-w-2xl text-xs text-slate-300 break-words">{organization.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-400">
                      <span>{organization._count.members} member(s)</span>
                      <span>{organization._count.opportunities} opportunity(ies)</span>
                      {organization.industry?.name && <span>Industry: {organization.industry.name}</span>}
                      <span className="break-words">
                        Contact: {organization.members.map((member) => member.user.fullName).join(', ') || 'no member yet'}
                      </span>
                    </div>
                    {latestVerification && (
                      <div className="mt-2 rounded-xl border border-slate-700/80 bg-slate-800/60 p-3 text-[11px] text-slate-300">
                        <p className="font-semibold text-white">
                          Verification dossier · submitted {latestVerification.submittedAt.toISOString().slice(0, 10)}
                          {latestVerification.taxIdNumber ? ` · Tax ID: ${latestVerification.taxIdNumber}` : ''}
                        </p>
                        {latestVerification.documentUrls.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {latestVerification.documentUrls.map((url, index) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-1 font-medium text-amber-300 hover:bg-slate-700"
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
                          <p className="mt-1 text-slate-300 break-words">Last reviewer note: {latestVerification.reviewerNote}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
                    <AdminActionButton
                      endpoint={`/api/admin/verifications/${organization.id}`}
                      payload={{ action: 'approve' }}
                      label="Approve & verify"
                      className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                      disabled={organization.verificationStatus === 'VERIFIED'}
                    />
                    {organization.verificationStatus !== 'REJECTED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/verifications/${organization.id}`}
                        payload={{ action: 'reject' }}
                        label="Reject"
                        className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                        reasonLabel="Rejection reason (shared with the organization)"
                        reasonField="note"
                      />
                    )}
                    {organization.verificationStatus !== 'SUSPENDED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/verifications/${organization.id}`}
                        payload={{ action: 'suspend' }}
                        label="Suspend"
                        className="bg-amber-600 text-white hover:bg-amber-500 hover:text-white"
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
