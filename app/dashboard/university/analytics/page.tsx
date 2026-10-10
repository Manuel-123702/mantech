import { prisma } from '@/lib/prisma';
import { requirePlacementMode } from '@/lib/university-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/config';
import {
  BarChart3,
  Users,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Building2,
  BookOpen,
  MapPin,
  FileText,
  ArrowUpRight,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  PLACEMENT_PENDING: 'Placement pending',
  PLACED: 'Placed',
  INTERNSHIP_ACTIVE: 'Active internship',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  ARCHIVED: 'Archived',
};

function StatBar({
  label,
  value,
  total,
  tone = 'emerald',
}: {
  label: string;
  value: number;
  total: number;
  tone?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const tones = {
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-indigo-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-red-500',
    slate: 'from-slate-400 to-slate-500',
  };
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-slate-600 font-medium truncate">{label}</span>
        <span className="font-mono font-bold text-slate-700 shrink-0 ml-2">
          {value} · {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${tones[tone]} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function UniversityAnalyticsPage() {
  const { organization } = await requirePlacementMode();
  if (!organization) return null;

  const institutionMatch = {
    institution: { equals: organization.name, mode: 'insensitive' as const },
  };

  const [studentsCount, searchableCount, placements, applicationGroups, readiness] = await Promise.all([
    prisma.internProfile.count({ where: institutionMatch }),
    prisma.internProfile.count({ where: { ...institutionMatch, isCvSearchable: true } }),
    prisma.placement.findMany({
      where: { internProfile: institutionMatch },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        organization: { select: { name: true } },
        internProfile: {
          select: {
            id: true,
            readinessScore: true,
            fieldOfStudy: { select: { name: true } },
            region: { select: { name: true } },
          },
        },
      },
    }),
    prisma.application.groupBy({
      by: ['status'],
      where: { internProfile: institutionMatch },
      _count: { _all: true },
    }),
    prisma.internProfile.aggregate({ where: institutionMatch, _avg: { readinessScore: true } }),
  ]);

  const totalPlacements = placements.length;
  const statusCounts = new Map<string, number>();
  for (const p of placements) statusCounts.set(p.status, (statusCounts.get(p.status) || 0) + 1);
  const activeCount = statusCounts.get('ACTIVE') || 0;
  const completedCount = statusCounts.get('COMPLETED') || 0;
  const placedStudentIds = new Set(placements.map((p) => p.internProfile.id));
  const placementRate = studentsCount > 0 ? Math.round((placedStudentIds.size / studentsCount) * 100) : 0;

  const durations = placements
    .map((p) => (new Date(p.endDate).getTime() - new Date(p.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    .filter((d) => d > 0);
  const avgDurationMonths = durations.length > 0 ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10 : 0;

  const hostCounts = new Map<string, number>();
  for (const p of placements) {
    const name = p.organization.name;
    hostCounts.set(name, (hostCounts.get(name) || 0) + 1);
  }
  const topHosts = Array.from(hostCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const fieldCounts = new Map<string, number>();
  for (const p of placements) {
    const name = p.internProfile.fieldOfStudy?.name || 'Unspecified field';
    fieldCounts.set(name, (fieldCounts.get(name) || 0) + 1);
  }
  const topFields = Array.from(fieldCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const regionCounts = new Map<string, number>();
  for (const p of placements) {
    const name = p.internProfile.region?.name || 'Unspecified region';
    regionCounts.set(name, (regionCounts.get(name) || 0) + 1);
  }
  const topRegions = Array.from(regionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const now = new Date();
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const count = placements.filter((p) => {
      const c = new Date(p.createdAt);
      return c >= d && c < next;
    }).length;
    months.push({ label: d.toLocaleDateString(undefined, { month: 'short' }), count });
  }
  const maxMonthly = Math.max(1, ...months.map((m) => m.count));

  const applicationsTotal = applicationGroups.reduce((sum, g) => sum + g._count._all, 0);
  const avgReadiness = Math.round(readiness._avg.readinessScore || 0);

  const kpis = [
    { label: 'Students placed', value: placedStudentIds.size, Icon: GraduationCap, hint: `${placementRate}% placement rate` },
    { label: 'Active internships', value: activeCount, Icon: CheckCircle2, hint: `${completedCount} completed all time` },
    { label: 'Applications submitted', value: applicationsTotal, Icon: FileText, hint: 'By your students' },
    { label: 'Avg readiness score', value: `${avgReadiness}%`, Icon: TrendingUp, hint: `${searchableCount} profiles job-visible` },
  ];

  if (studentsCount === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Placement analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Insights across your institution&apos;s students and placements.</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-base font-semibold text-slate-700">No analytics data yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Analytics populate automatically once students list <span className="font-semibold">{organization.name}</span>{' '}
              as their institution on their intern profiles and start applying or getting placed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Placement analytics</h2>
          <p className="text-sm text-slate-500 mt-1">
            Live aggregates for {organization.name} — computed from your students&apos; real placement and application
            records.
          </p>
        </div>
        <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Badge variant="outline" className="cursor-pointer gap-1 text-emerald-700 border-emerald-200 bg-emerald-50 py-1.5 px-3">
            Request full cohort report
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Badge>
        </a>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{kpi.value}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{kpi.hint}</p>
                </div>
                <div className="w-10 h-10 rounded-xl border bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center">
                  <kpi.Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Placements by status
            </CardTitle>
            <CardDescription className="text-xs">
              {totalPlacements} placement record{totalPlacements === 1 ? '' : 's'} · avg duration{' '}
              {avgDurationMonths || '—'} months
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {totalPlacements === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No placements recorded yet.</p>
            ) : (
              Array.from(statusCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => (
                  <StatBar
                    key={status}
                    label={STATUS_LABELS[status] || status}
                    value={count}
                    total={totalPlacements}
                    tone={status === 'COMPLETED' ? 'emerald' : status === 'ACTIVE' ? 'blue' : status === 'CANCELLED' ? 'rose' : 'slate'}
                  />
                ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Placement starts — last 6 months
            </CardTitle>
            <CardDescription className="text-xs">New placements recorded per month.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-end justify-between gap-3 h-40">
              {months.map((m, i) => (
                <div key={`${m.label}-${i}`} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-600">{m.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 min-h-[4px]"
                    style={{ height: `${Math.max(4, (m.count / maxMonthly) * 100)}%` }}
                  />
                  <span className="text-[11px] text-slate-500">{m.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              Top host organizations
            </CardTitle>
            <CardDescription className="text-xs">Partners hosting the most students from your institution.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {topHosts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No host organizations yet.</p>
            ) : (
              topHosts.map(([name, count]) => (
                <StatBar key={name} label={name} value={count} total={totalPlacements} tone="amber" />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Placements by field of study
            </CardTitle>
            <CardDescription className="text-xs">Where your students are finding internships.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {topFields.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No placement data by field yet.</p>
            ) : (
              topFields.map(([name, count]) => (
                <StatBar key={name} label={name} value={count} total={totalPlacements} tone="blue" />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              Application pipeline
            </CardTitle>
            <CardDescription className="text-xs">
              Status of applications submitted by your students ({applicationsTotal} total).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            {applicationGroups.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No applications yet — share opportunity links with your cohort to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {applicationGroups
                  .sort((a, b) => b._count._all - a._count._all)
                  .map((g) => (
                    <StatBar
                      key={g.status}
                      label={STATUS_LABELS[g.status] || g.status}
                      value={g._count._all}
                      total={applicationsTotal}
                      tone={g.status === 'PLACED' || g.status === 'COMPLETED' ? 'emerald' : g.status === 'REJECTED' || g.status === 'WITHDRAWN' ? 'rose' : 'slate'}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {topRegions.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                Placements by region
              </CardTitle>
              <CardDescription className="text-xs">Geographic distribution of your students&apos; internships.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {topRegions.map(([name, count]) => (
                <StatBar key={name} label={name} value={count} total={totalPlacements} tone="emerald" />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
