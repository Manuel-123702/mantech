import { Trans, useLingui } from '@lingui/react/macro';
import { prisma } from '@/lib/prisma';
import { requireUniversityDashboard, resolveDashboardMode } from '@/lib/university-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/config';
import {
  Users,
  Briefcase,
  FileText,
  CalendarDays,
  GraduationCap,
  Handshake,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  Link as LinkIcon,
  Building2,
  BookOpen,
  Bell,
} from 'lucide-react';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/company/status-badge';

export default async function UniversityDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { user, organization, universityProfile } = await requireUniversityDashboard();
  if (!organization) return null;

  const sp = await searchParams;
  const mode = resolveDashboardMode(sp?.mode, universityProfile || {});
  const orgId = organization.id;
  const institutionWhere = {
    institution: { equals: organization.name, mode: 'insensitive' as const },
  };

  const [
    studentsCount,
    opportunities,
    placements,
    applications,
    interviews,
    savedCandidates,
    recentActivity,
    partnerCompanies,
    verifiedPartnersCount,
    liveOppsCount,
    placementStatusGroups,
    placedStudentRows,
    activePlacementsCount,
    oppsTotalCount,
    applicationsTotalCount,
    interviewsTotalCount,
    selectedCount,
    placementsTotalCount,
    notifications,
  ] = await Promise.all([
    prisma.internProfile.count({ where: institutionWhere }),
    prisma.internshipOpportunity.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { field: true, region: true },
    }),
    prisma.placement.findMany({
      where: { internProfile: institutionWhere },
      include: {
        internProfile: { include: { user: true } },
        application: {
          include: { opportunity: { include: { organization: { select: { name: true } } } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.application.findMany({
      where: { opportunity: { organizationId: orgId } },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        opportunity: true,
        internProfile: { include: { user: true } },
      },
    }),
    prisma.interview.findMany({
      where: { application: { opportunity: { organizationId: orgId } } },
      orderBy: { scheduledAt: 'desc' },
      take: 5,
      include: {
        application: { include: { internProfile: { include: { user: true } } } },
      },
    }),
    prisma.savedCandidate.count({ where: { organizationId: orgId } }),
    prisma.auditLog.findMany({
      where: {
        OR: [
          { actorId: user.id },
          {
            entityType: { in: ['InternshipOpportunity', 'Application', 'Placement', 'Interview'] },
            details: { contains: `"organizationId":"${orgId}"` },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.organization.findMany({
      where: { type: 'COMPANY', verificationStatus: 'VERIFIED' },
      take: 6,
      include: { companyProfile: true, region: true },
      orderBy: { name: 'asc' },
    }),
    prisma.organization.count({ where: { type: 'COMPANY', verificationStatus: 'VERIFIED' } }),
    prisma.internshipOpportunity.count({ where: { moderationStatus: 'PUBLISHED' } }),
    prisma.placement.groupBy({
      by: ['status'],
      where: { internProfile: institutionWhere },
      _count: { _all: true },
    }),
    prisma.placement.findMany({
      where: { internProfile: institutionWhere, status: { not: 'CANCELLED' } },
      distinct: ['internProfileId'],
      select: { internProfileId: true },
    }),
    prisma.placement.count({ where: { internProfile: institutionWhere, status: 'ACTIVE' } }),
    prisma.internshipOpportunity.count({ where: { organizationId: orgId } }),
    prisma.application.count({ where: { opportunity: { organizationId: orgId } } }),
    prisma.interview.count({ where: { application: { opportunity: { organizationId: orgId } } } }),
    prisma.application.count({
      where: { opportunity: { organizationId: orgId }, status: 'SELECTED' },
    }),
    prisma.placement.count({ where: { organizationId: orgId } }),
    prisma.notification.findMany({
      where: { userId: { in: organization.members.map((m) => m.userId) } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  const placedStudentsCount = placedStudentRows.length;
  const placementStatusData = placementStatusGroups.map((g) => ({
    status: g.status,
    count: g._count._all,
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={mode === 'placement' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-blue-200 text-blue-700 bg-blue-50'}>
              {mode === 'placement' ? 'Placement Office Mode' : 'Institution Recruiter Mode'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            <Trans comment="page h1 visible text">Welcome back, </Trans>{user.fullName?.split(' ')[0] || 'Coordinator'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'placement'
              ? `Monitor student placements for ${organization.name}. View opportunities, partner companies, and placement progress.`
              : 'Manage institution recruitment operations. Publish roles, discover candidates, and onboard interns.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="outline" size="sm">
            <Link href={mode === 'placement' ? '/dashboard/university/opportunities' : '/dashboard/university/opportunities-recruiter'}>
              <Briefcase className="w-4 h-4 mr-1.5" />
              {mode === 'placement' ? 'Browse Opportunities' : 'Post Opportunity'}
            </Link>
          </Button>
          <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <LinkIcon className="w-4 h-4 mr-1.5" />
              <Trans comment="page Button visible text">MANTECH Support
            </Trans></Button>
          </a>
        </div>
      </header>

      {mode === 'placement' ? (
        <PlacementKPICards
          totalStudents={studentsCount}
          placedCount={placedStudentsCount}
          activePlacementCount={activePlacementsCount}
          partnerCount={verifiedPartnersCount}
          oppCount={liveOppsCount}
          staffCount={organization.members.length}
        />
      ) : (
        <RecruiterKPICards
          oppCount={oppsTotalCount}
          appCount={applicationsTotalCount}
          shortlisted={savedCandidates}
          interviewCount={interviewsTotalCount}
          selected={selectedCount}
          placed={placementsTotalCount}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {mode === 'placement' ? (
            <PlacementMonitorCard placements={placements} />
          ) : (
            <RecruiterPipelineCard applications={applications} />
          )}

          {mode === 'placement' ? (
            <PartnerCompaniesCard companies={partnerCompanies} />
          ) : (
            <OpportunitiesCard opportunities={opportunities} />
          )}
        </div>

        <div className="space-y-6">
          <QuickActionsCard mode={mode} verificationStatus={organization.verificationStatus} />
          <NotificationsCard notifications={notifications} />
          <RecentActivityCard activities={recentActivity} />
          {mode === 'placement' ? (
            <PlacementSnapshotCard groups={placementStatusData} />
          ) : (
            <UpcomingInterviewsCard interviews={interviews} />
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  Icon,
  tone = 'slate',
  footer,
}: {
  title: string;
  value: string | number;
  Icon: any;
  tone?: 'slate' | 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
  footer?: React.ReactNode;
}) {
  const tones = {
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{value}</span>
            </div>
            {footer && <div className="mt-2 text-[11px] text-slate-500">{footer}</div>}
          </div>
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tones[tone]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlacementKPICards(props: {
  totalStudents: number;
  placedCount: number;
  activePlacementCount: number;
  partnerCount: number;
  oppCount: number;
  staffCount: number;
}) {
  const { t } = useLingui();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard title={t({ message: "Registered Students", comment: "page component title attribute" })} value={props.totalStudents} Icon={Users} tone="emerald" footer="Profiles matching your institution" />
      <KPICard
        title={t({ message: "Students Placed", comment: "page component title attribute" })}
        value={props.placedCount}
        Icon={GraduationCap}
        tone="blue"
        footer={`${Math.min(100, Math.round((props.placedCount / Math.max(1, props.totalStudents)) * 100))}% placement rate`}
      />
      <KPICard title={t({ message: "Active Internships", comment: "page component title attribute" })} value={props.activePlacementCount} Icon={CheckCircle2} tone="emerald" footer={`${props.activePlacementCount} currently onsite`} />
      <KPICard title={t({ message: "Partner Companies", comment: "page component title attribute" })} value={props.partnerCount} Icon={Handshake} tone="amber" footer="Verified host organizations" />
      <KPICard title={t({ message: "Live Opportunities", comment: "page component title attribute" })} value={props.oppCount} Icon={Briefcase} tone="purple" footer="Open to your students" />
      <KPICard title={t({ message: "Staff Coordinators", comment: "page component title attribute" })} value={props.staffCount} Icon={Building2} tone="slate" footer="Faculty + industrial leads" />
    </div>
  );
}

function RecruiterKPICards(props: {
  oppCount: number;
  appCount: number;
  shortlisted: number;
  interviewCount: number;
  selected: number;
  placed: number;
}) {
  const { t } = useLingui();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard title={t({ message: "Opportunities", comment: "page component title attribute" })} value={props.oppCount} Icon={Briefcase} tone="blue" footer="All postings by your institution" />
      <KPICard title={t({ message: "Applications", comment: "page component title attribute" })} value={props.appCount} Icon={FileText} tone="slate" footer="All time received" />
      <KPICard title={t({ message: "Shortlisted", comment: "page component title attribute" })} value={props.shortlisted} Icon={Users} tone="amber" footer="Saved candidates" />
      <KPICard title={t({ message: "Interviews", comment: "page component title attribute" })} value={props.interviewCount} Icon={CalendarDays} tone="purple" footer="Scheduled + past" />
      <KPICard title={t({ message: "Selected", comment: "page component title attribute" })} value={props.selected} Icon={TrendingUp} tone="emerald" footer="Awaiting placement" />
      <KPICard title={t({ message: "Placed", comment: "page component title attribute" })} value={props.placed} Icon={CheckCircle2} tone="emerald" footer="Onboarded interns" />
    </div>
  );
}

function PlacementMonitorCard({
  placements,
}: {
  placements: {
    id: string;
    status: string;
    department: string | null;
    startDate: Date;
    endDate: Date;
    internProfileId: string;
    internProfile?: { user?: { fullName: string } | null } | null;
    application?: {
      opportunity?: { title: string; organization?: { name: string } | null } | null;
    } | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <Trans comment="page CardTitle visible text">Active Placement Monitor
          </Trans></CardTitle>
          <CardDescription className="text-xs"><Trans comment="page CardDescription visible text">Latest placements of students associated with your institution.</Trans></CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/university/placements"><Trans comment="page Link visible text">View full roster</Trans></Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3"><Trans comment="page th visible text">Student</Trans></th>
                <th className="px-5 py-3"><Trans comment="page th visible text">Host Organization</Trans></th>
                <th className="px-5 py-3"><Trans comment="page th visible text">Period</Trans></th>
                <th className="px-5 py-3"><Trans comment="page th visible text">Progress</Trans></th>
                <th className="px-5 py-3"><Trans comment="page th visible text">Status</Trans></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {placements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                    <Trans comment="page td visible text">No placements yet. Browse partner opportunities or coordinate with MANTECH to register assignments.
                  </Trans></td>
                </tr>
              ) : (
                placements.map((p) => {
                  const start = p.startDate ? new Date(p.startDate) : null;
                  const end = p.endDate ? new Date(p.endDate) : null;
                  const now = new Date();
                  const total = start && end ? Math.max(1, end.getTime() - start.getTime()) : 0;
                  const elapsed = start && end ? Math.max(0, Math.min(total, now.getTime() - start.getTime())) : 0;
                  const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0;
                  const studentName = p.internProfile?.user?.fullName || 'Student';
                  const initials = studentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">{initials}</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{studentName}</p>
                            <p className="text-[11px] text-slate-500">{p.department || 'Internship Department'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {p.application?.opportunity?.organization?.name || 'Host organization'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {start?.toLocaleDateString() || '—'} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"→ "}{end?.toLocaleDateString() || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="w-full max-w-[180px]">
                          <div className="flex items-center justify-between text-[11px] mb-1.5">
                            <span className="text-slate-500"><Trans comment="page span visible text">Progress</Trans></span>
                            <span className="font-mono font-bold text-slate-700">{pct}{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"%"}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function RecruiterPipelineCard({
  applications,
}: {
  applications: {
    id: string;
    status: string;
    createdAt: Date;
    internProfile?: { user?: { fullName: string } | null } | null;
    opportunity?: { title: string } | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <Trans comment="page CardTitle visible text">Latest Applications
          </Trans></CardTitle>
          <CardDescription className="text-xs"><Trans comment="page CardDescription visible text">Manage applications for your institution&apos;s open internship positions.</Trans></CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/university/applications"><Trans comment="page Link visible text">All applications</Trans></Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100">
          {applications.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-slate-500"><Trans comment="page li visible text">No applications yet. Publish an opportunity to receive candidate submissions.</Trans></li>
          ) : (
            applications.map((app) => {
              const candidateName = app.internProfile?.user?.fullName || 'Candidate';
              const initials = candidateName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <li key={app.id} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">{initials}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{candidateName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{app.opportunity?.title || 'Opportunity'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}
                    </span>
                    <StatusBadge status={app.status} />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

function OpportunitiesCard({
  opportunities,
}: {
  opportunities: {
    id: string;
    title: string;
    workMode: string;
    moderationStatus: string;
    field?: { name: string } | null;
    region?: { name: string } | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <Trans comment="page CardTitle visible text">Your Opportunities
          </Trans></CardTitle>
          <CardDescription className="text-xs"><Trans comment="page CardDescription visible text">Internship positions published by your institution.</Trans></CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/university/opportunities-recruiter/create">
            <span className="mr-1.5">{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"+"}</span> <Trans comment="page Link visible text">New opportunity
          </Trans></Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100">
          {opportunities.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-slate-500"><Trans comment="page li visible text">No opportunities yet. Create your first internship posting for the institution.</Trans></li>
          ) : (
            opportunities.map((o) => (
              <li key={o.id} className="px-5 py-3.5 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{o.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {o.field?.name && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{o.field.name}</Badge>}
                      {o.region?.name && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{o.region.name}</Badge>}
                      {o.workMode && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-slate-200 text-slate-600">{o.workMode}</Badge>}
                    </div>
                  </div>
                  <StatusBadge status={o.moderationStatus} />
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

function PartnerCompaniesCard({
  companies,
}: {
  companies: {
    id: string;
    name: string;
    slug: string;
    type: string;
    region?: { name: string } | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-amber-600" />
            <Trans comment="page CardTitle visible text">Verified Partner Companies
          </Trans></CardTitle>
          <CardDescription className="text-xs"><Trans comment="page CardDescription visible text">Accredited organizations authorized to host your students.</Trans></CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/university/partners"><Trans comment="page Link visible text">All partners</Trans></Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {companies.length === 0 ? (
          <div className="col-span-full text-center text-sm text-slate-500 py-6"><Trans comment="page div visible text">No partner companies loaded yet. Coordinate with MANTECH for the accredited list.</Trans></div>
        ) : (
          companies.map((c) => (
            <Link key={c.id} href={`/companies/${c.slug || c.id}`} className="group rounded-xl border border-slate-200 p-3.5 hover:shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700">{c.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {c.region?.name ? `Verified partner • ${c.region.name}` : 'Verified partner'}
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ mode, verificationStatus }: { mode: 'placement' | 'recruiter'; verificationStatus: string }) {
  const verified = verificationStatus === 'VERIFIED';
  const placementActions = [
    { href: '/dashboard/university/students', label: 'View associated students', Icon: Users, external: false },
    { href: '/dashboard/university/opportunities', label: 'Browse live opportunities', Icon: Briefcase, external: false },
    { href: '/dashboard/university/placements', label: 'Monitor placement progress', Icon: BookOpen, external: false },
    { href: APP_CONFIG.contacts.whatsappLink, label: 'Request MANTECH facilitation', Icon: Handshake, external: true },
  ];
  const recruiterActions = [
    { href: '/dashboard/university/opportunities-recruiter/create', label: 'Create new opportunity', Icon: Briefcase, external: false },
    { href: '/dashboard/university/candidates', label: 'Discover candidates', Icon: Users, external: false },
    { href: '/dashboard/university/applications', label: 'Review applications', Icon: FileText, external: false },
    { href: '/dashboard/university/recruitment', label: 'Onboard new hires', Icon: CheckCircle2, external: false },
  ];
  const actions = mode === 'placement' ? placementActions : recruiterActions;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-500" />
          <Trans comment="page CardTitle visible text">Quick actions
        </Trans></CardTitle>
        {!verified && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold"><Trans comment="page p visible text">Awaiting institutional verification</Trans></p>
              <p className="mt-0.5 text-amber-800"><Trans comment="page p visible text">Contact MANTECH on WhatsApp to complete accreditation.</Trans></p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-1 gap-2">
        {actions.map((a) =>
          a.external ? (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <a.Icon className="w-3.5 h-3.5" />
              </div>
              {a.label}
            </a>
          ) : (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <a.Icon className="w-3.5 h-3.5" />
              </div>
              {a.label}
            </Link>
          )
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({
  activities,
}: {
  activities: { id: string; action: string; entityType: string; createdAt: Date }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <Trans comment="page CardTitle visible text">Recent activity
        </Trans></CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ol className="relative border-l border-slate-100 ml-2 space-y-4">
          {activities.length === 0 ? (
            <li className="ml-4 text-xs text-slate-500 py-2"><Trans comment="page li visible text">No activity yet.</Trans></li>
          ) : (
            activities.map((log) => (
              <li key={log.id} className="ml-4">
                <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 ring-4 ring-white" />
                <time className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recently'}
                </time>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{log.action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                <p className="text-[11px] text-slate-500">{log.entityType}</p>
              </li>
            ))
          )}
        </ol>
      </CardContent>
    </Card>
  );
}

function NotificationsCard({
  notifications,
}: {
  notifications: { id: string; title: string; message: string; isRead: boolean; createdAt: Date }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-500" />
          <Trans comment="page CardTitle visible text">Notifications
        </Trans></CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500"><Trans comment="page p visible text">No notifications yet.</Trans></p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-2.5">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.isRead ? 'bg-slate-300' : 'bg-emerald-500'}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function PlacementSnapshotCard({ groups }: { groups: { status: string; count: number }[] }) {
  const total = groups.reduce((s, g) => s + g.count, 0);
  const toneFor: Record<string, string> = {
    PENDING: 'from-amber-500 to-orange-500',
    CONFIRMED: 'from-blue-500 to-indigo-500',
    ACTIVE: 'from-emerald-500 to-teal-500',
    COMPLETED: 'from-slate-500 to-slate-700',
    CANCELLED: 'from-rose-500 to-pink-500',
  };
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-500" />
          <Trans comment="page CardTitle visible text">Placement snapshot
        </Trans></CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {total === 0 ? (
          <p className="text-xs text-slate-500 py-2"><Trans comment="page p visible text">No placements recorded for your students yet.</Trans></p>
        ) : (
          groups.map((g) => (
            <StatBar
              key={g.status}
              label={g.status}
              value={g.count}
              total={total}
              tone={toneFor[g.status] || 'from-slate-400 to-slate-500'}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function StatBar({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  const pct = Math.round((value / Math.max(1, total)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-mono font-bold text-slate-800">{value} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"· "}{pct}{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"%"}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${tone} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function UpcomingInterviewsCard({
  interviews,
}: {
  interviews: {
    id: string;
    status: string;
    type: string;
    scheduledAt: Date;
    application?: { internProfile?: { user?: { fullName: string } | null } | null } | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-slate-500" />
          <Trans comment="page CardTitle visible text">Upcoming interviews
        </Trans></CardTitle>
      </CardHeader>
      <CardContent className="pt-0 divide-y divide-slate-100">
        {interviews.length === 0 ? (
          <p className="text-xs text-slate-500 py-2"><Trans comment="page p visible text">No interviews scheduled.</Trans></p>
        ) : (
          interviews.slice(0, 5).map((iv) => (
            <div key={iv.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex flex-col items-center justify-center font-bold text-[10px] leading-tight">
                  <span>{iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleDateString(undefined, { month: 'short' }).toUpperCase() : '—'}</span>
                  <span className="text-xs">{iv.scheduledAt ? new Date(iv.scheduledAt).getDate() : '—'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {iv.application?.internProfile?.user?.fullName || 'Candidate'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {iv.type || 'Interview'} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"• "}{iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
                <StatusBadge status={iv.status} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
