import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import {
  Users,
  GraduationCap,
  Building2,
  Landmark,
  Briefcase,
  FileText,
  ShieldCheck,
  ClipboardList,
  BadgeCheck,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

function formatDateTime(date: Date) {
  return date.toISOString().replace('T', ' ').slice(0, 16);
}

function DistributionList({ title, groups }: { title: string; groups: { label: string; count: number }[] }) {
  const total = groups.reduce((sum, group) => sum + group.count, 0);
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
      <h3 className="text-sm font-bold text-white break-words">{title}</h3>
      <div className="mt-3 space-y-2.5">
        {total === 0 ? (
          <p className="text-xs text-slate-400">No records yet.</p>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-300 capitalize break-words">
                  {group.label.replace(/_/g, ' ').toLowerCase()}
                </span>
                <span className="font-mono font-semibold text-white shrink-0">{group.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${total ? Math.max((group.count / total) * 100, 3) : 0}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default async function AdminOverviewPage() {
  await requireAdminDashboard();

  const [
    usersByRole,
    suspendedUsers,
    totalInterns,
    companyCount,
    universityCount,
    pendingVerification,
    opportunitiesByStatus,
    applicationsTotal,
    applicationsByStatus,
    placementsByStatus,
    passportsTotal,
    unverifiedPassports,
    pendingSubscriptions,
    pendingSubscriptionsCount,
    activeFeatured,
    recentAudit,
  ] = await Promise.all([
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.user.count({ where: { status: 'suspended' } }),
    prisma.internProfile.count(),
    prisma.organization.count({ where: { type: 'COMPANY' } }),
    prisma.organization.count({ where: { type: 'UNIVERSITY' } }),
    prisma.organization.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.internshipOpportunity.groupBy({ by: ['moderationStatus'], _count: { _all: true } }),
    prisma.application.count(),
    prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.placement.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.internPassport.count(),
    prisma.internPassport.count({ where: { isVerified: false } }),
    prisma.organizationSubscription.findMany({
      where: { status: 'PENDING_PAYMENT' },
      include: { package: { select: { name: true } }, organization: { select: { name: true } } },
      orderBy: { requestedAt: 'asc' },
      take: 5,
    }),
    prisma.organizationSubscription.count({ where: { status: 'PENDING_PAYMENT' } }),
    prisma.featuredOpportunity.count({ where: { isActive: true, endsAt: { gte: new Date() } } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { actor: { select: { fullName: true, email: true } } },
    }),
  ]);

  const roleCounts = new Map(usersByRole.map((entry) => [entry.role, entry._count._all]));
  const totalUsers = usersByRole.reduce((sum, entry) => sum + entry._count._all, 0);
  const publishedCount = opportunitiesByStatus.find((entry) => entry.moderationStatus === 'PUBLISHED')?._count._all ?? 0;
  const pendingReviewCount = opportunitiesByStatus.find((entry) => entry.moderationStatus === 'PENDING_REVIEW')?._count._all ?? 0;
  const placedCount = placementsByStatus
    .filter((entry) => ['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(entry.status))
    .reduce((sum, entry) => sum + entry._count._all, 0);

  const kpis = [
    { label: 'Registered users', value: totalUsers, icon: Users, detail: `${suspendedUsers} suspended` },
    { label: 'Candidate profiles', value: totalInterns, icon: GraduationCap, detail: `${roleCounts.get('INTERN') ?? 0} candidate accounts` },
    { label: 'Companies', value: companyCount, icon: Building2, detail: 'enterprise hosts' },
    { label: 'Universities', value: universityCount, icon: Landmark, detail: 'institutions' },
    { label: 'Published openings', value: publishedCount, icon: Briefcase, detail: `${pendingReviewCount} awaiting review` },
    { label: 'Applications', value: applicationsTotal, icon: FileText, detail: `${placedCount} placements confirmed+` },
  ];

  const queues = [
    {
      href: '/dashboard/admin/verification',
      label: 'Verifications pending',
      count: pendingVerification,
      icon: ShieldCheck,
      hint: 'Organizations awaiting §15 verification review',
    },
    {
      href: '/dashboard/admin/moderation',
      label: 'Opportunities awaiting review',
      count: pendingReviewCount,
      icon: ClipboardList,
      hint: 'Moderation queue before public listing',
    },
    {
      href: '/dashboard/admin/interns',
      label: 'Unverified passports',
      count: unverifiedPassports,
      icon: BadgeCheck,
      hint: `${passportsTotal} passports issued in total`,
    },
    {
      href: '/dashboard/admin/packages',
      label: 'Package payments pending',
      count: pendingSubscriptionsCount,
      icon: CreditCard,
      hint: 'WhatsApp concierge activations awaiting confirmation',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 break-words">
                  {kpi.label}
                </span>
                <Icon className="h-4 w-4 text-amber-400 shrink-0" />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-white">{kpi.value.toLocaleString()}</div>
              <div className="mt-0.5 text-[11px] text-slate-400 break-words">{kpi.detail}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">Requires attention</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {queues.map((queue) => {
            const Icon = queue.icon;
            return (
              <Link
                key={queue.href}
                href={queue.href}
                className="group rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg transition-colors hover:border-amber-500/50 hover:bg-slate-800/80"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-amber-400" />
                  <span className={`font-mono text-2xl font-bold ${queue.count > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {queue.count}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white break-words">{queue.label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-400 break-words">{queue.hint}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DistributionList
          title="Applications by status"
          groups={applicationsByStatus.map((entry) => ({ label: entry.status, count: entry._count._all }))}
        />
        <DistributionList
          title="Placements by status"
          groups={placementsByStatus.map((entry) => ({ label: entry.status, count: entry._count._all }))}
        />
        <DistributionList
          title="Opportunities by moderation state"
          groups={opportunitiesByStatus.map((entry) => ({ label: entry.moderationStatus, count: entry._count._all }))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">Latest package requests</h3>
            <Link href="/dashboard/admin/packages" className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline shrink-0">
              Manage
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {pendingSubscriptions.length === 0 ? (
              <p className="text-xs text-slate-400">No pending payment requests.</p>
            ) : (
              pendingSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white break-words">{subscription.organization.name}</p>
                    <p className="text-[11px] text-slate-400 break-words">{subscription.package.name}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
                    {subscription.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {activeFeatured} featured {activeFeatured === 1 ? 'opportunity' : 'opportunities'} currently active.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">Recent audit activity</h3>
            <Link href="/dashboard/admin/audit" className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline shrink-0">
              Full trail
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {recentAudit.length === 0 ? (
              <p className="text-xs text-slate-400">No audit events recorded yet.</p>
            ) : (
              recentAudit.map((log) => (
                <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] font-semibold text-amber-300 break-all">{log.action}</p>
                    <p className="text-[11px] text-slate-400 break-words">
                      {log.actor?.fullName || log.actorRole || 'system'} · {log.entityType}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-slate-400">{formatDateTime(log.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
