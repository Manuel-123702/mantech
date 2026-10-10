import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Users,
  Eye,
  Star,
  UserCheck,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText,
  MapPin,
  Workflow,
} from 'lucide-react';

export async function AnalyticsView({
  organizationId,
  subtitle = 'Opportunity views, candidate pipeline, recruitment and placement insights.',
}: {
  organizationId: string;
  subtitle?: string;
}) {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    opportunitiesAgg,
    applicationsAgg,
    savedCandidatesCount,
    interviewsAgg,
    placementsAgg,
  ] = await Promise.all([
    prisma.internshipOpportunity.findMany({
      where: { organizationId },
      include: { applications: true, field: true, region: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.application.findMany({
      where: {
        opportunity: { organizationId },
      },
      include: { opportunity: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.savedCandidate.count({ where: { organizationId } }),
    prisma.interview.findMany({
      where: {
        application: { opportunity: { organizationId } },
      },
    }),
    prisma.placement.findMany({
      where: { organizationId },
    }),
  ]);

  const totalOpportunityViews = opportunitiesAgg.reduce(
    (sum, o) => sum + (o.viewCount || 0),
    0
  );
  const published = opportunitiesAgg.filter((o) => o.moderationStatus === 'PUBLISHED');
  const totalApplications = applicationsAgg.length;
  const viewToApply =
    totalOpportunityViews > 0 ? ((totalApplications / totalOpportunityViews) * 100).toFixed(1) : '0';

  const byStatus: Record<string, number> = {};
  applicationsAgg.forEach((a) => {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
  });

  const topOpportunities = opportunitiesAgg
    .map((o) => ({
      title: o.title,
      views: o.viewCount || 0,
      applications: o.applications.length,
      field: o.field?.name,
      location: o.city,
      status: o.moderationStatus,
      ratio:
        o.viewCount && o.viewCount > 0
          ? ((o.applications.length / o.viewCount) * 100).toFixed(1)
          : '0',
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 8);

  const fieldsMap = new Map<string, number>();
  opportunitiesAgg.forEach((o) => {
    if (o.field) {
      fieldsMap.set(o.field.name, (fieldsMap.get(o.field.name) || 0) + o.applications.length);
    }
  });
  const topFields = Array.from(fieldsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const locationsMap = new Map<string, number>();
  opportunitiesAgg.forEach((o) => {
    if (o.city) {
      locationsMap.set(o.city, (locationsMap.get(o.city) || 0) + o.applications.length);
    } else if (o.region) {
      locationsMap.set(o.region.name, (locationsMap.get(o.region.name) || 0) + o.applications.length);
    }
  });
  const topLocations = Array.from(locationsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const last30DaysApplications = applicationsAgg.filter(
    (a) => new Date(a.createdAt) >= thirtyDaysAgo
  ).length;
  const last30Placements = placementsAgg.filter(
    (p) => new Date(p.createdAt) >= thirtyDaysAgo
  ).length;
  const last30Interviews = interviewsAgg.filter(
    (i) => new Date(i.scheduledAt) >= thirtyDaysAgo && new Date(i.scheduledAt) <= now
  ).length;

  const pipeline = {
    received: byStatus['SUBMITTED'] || 0,
    review: byStatus['UNDER_REVIEW'] || 0,
    shortlisted: byStatus['SHORTLISTED'] || 0,
    interview: byStatus['INTERVIEW'] || 0,
    selected: (byStatus['SELECTED'] || 0) + (byStatus['PLACEMENT_PENDING'] || 0) + (byStatus['PLACED'] || 0),
    active: (byStatus['INTERNSHIP_ACTIVE'] || 0) + placementsAgg.filter((p) => p.status === 'ACTIVE').length,
    completed: (byStatus['COMPLETED'] || 0) + placementsAgg.filter((p) => p.status === 'COMPLETED').length,
    rejected: (byStatus['REJECTED'] || 0) + (byStatus['WITHDRAWN'] || 0),
  };

  const pipelineSteps = [
    { label: 'Received', value: pipeline.received, icon: FileText, tone: 'bg-blue-500' },
    { label: 'Under review', value: pipeline.review, icon: Workflow, tone: 'bg-indigo-500' },
    { label: 'Shortlisted', value: pipeline.shortlisted, icon: Star, tone: 'bg-amber-500' },
    { label: 'Interviews', value: pipeline.interview, icon: Calendar, tone: 'bg-purple-500' },
    { label: 'Selected', value: pipeline.selected, icon: UserCheck, tone: 'bg-emerald-500' },
    { label: 'Active', value: pipeline.active, icon: TrendingUp, tone: 'bg-teal-500' },
    { label: 'Completed', value: pipeline.completed, icon: Check, tone: 'bg-sky-500' },
  ];

  const summaryKpis = [
    {
      label: 'Opportunities posted',
      value: opportunitiesAgg.length,
      sub: `${published.length} published`,
      icon: Briefcase,
      tone: 'text-blue-600',
    },
    {
      label: 'Opportunity views',
      value: totalOpportunityViews,
      sub: 'All time',
      icon: Eye,
      tone: 'text-indigo-600',
    },
    {
      label: 'Applications received',
      value: totalApplications,
      sub: `${last30DaysApplications} last 30d`,
      icon: Users,
      tone: 'text-purple-600',
    },
    {
      label: 'Shortlisted candidates',
      value: pipeline.shortlisted,
      sub: `${savedCandidatesCount} saved`,
      icon: Star,
      tone: 'text-amber-600',
    },
    {
      label: 'Interviews',
      value: interviewsAgg.length,
      sub: `${last30Interviews} last 30d`,
      icon: Calendar,
      tone: 'text-pink-600',
    },
    {
      label: 'Placements',
      value: placementsAgg.length,
      sub: `${last30Placements} last 30d`,
      icon: UserCheck,
      tone: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <Badge variant="secondary" className="inline-flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5" />
          Live data
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {summaryKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{kpi.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{kpi.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{kpi.sub}</p>
                </div>
                <div className={`rounded-xl bg-slate-100 p-3 ${kpi.tone}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">View-to-apply rate</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{viewToApply}%</p>
            <p className="mt-1 text-xs text-slate-500">
              Applications per 100 opportunity views
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recruitment pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {pipelineSteps.map((step, idx) => {
              const next = pipelineSteps[idx + 1];
              const conversion =
                step.value > 0 && next
                  ? ((next.value / step.value) * 100).toFixed(0)
                  : null;
              return (
                <div key={step.label} className="rounded-2xl border bg-white p-4 relative">
                  <div className={`h-1.5 w-12 rounded-full ${step.tone} mb-3`} />
                  <step.icon className="mb-2 h-5 w-5 text-slate-500" />
                  <p className="text-xs text-slate-500">{step.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{step.value}</p>
                  {conversion !== null && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700">
                      {Number(conversion) >= 50 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {conversion}% to next
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {totalApplications > 0 && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">
                Status distribution
              </p>
              <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
                {(['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'PLACEMENT_PENDING', 'PLACED', 'INTERNSHIP_ACTIVE', 'COMPLETED', 'REJECTED', 'WITHDRAWN'] as const).map(
                  (s) => {
                    const count = byStatus[s] || 0;
                    if (count === 0) return null;
                    const pct = (count / totalApplications) * 100;
                    const colors: Record<string, string> = {
                      SUBMITTED: 'bg-blue-500',
                      UNDER_REVIEW: 'bg-indigo-500',
                      SHORTLISTED: 'bg-amber-500',
                      INTERVIEW: 'bg-purple-500',
                      SELECTED: 'bg-emerald-500',
                      PLACEMENT_PENDING: 'bg-teal-500',
                      PLACED: 'bg-teal-600',
                      INTERNSHIP_ACTIVE: 'bg-cyan-500',
                      COMPLETED: 'bg-sky-600',
                      REJECTED: 'bg-red-500',
                      WITHDRAWN: 'bg-slate-500',
                    };
                    return (
                      <div
                        key={s}
                        title={`${s}: ${count} (${pct.toFixed(1)}%)`}
                        className={`${colors[s] || 'bg-slate-400'} h-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    );
                  }
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topOpportunities.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Post an opportunity to start collecting analytics.
              </p>
            ) : (
              topOpportunities.map((o, idx) => (
                <div key={idx} className="rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 truncate">{o.title}</p>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          {o.status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">
                        {o.field || '—'} · {o.location || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{o.applications} apps</p>
                      <p className="text-xs text-slate-500">{o.views} views · {o.ratio}%</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                Applications by location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topLocations.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No location data yet.
                </p>
              ) : (
                topLocations.map((loc) => {
                  const max = topLocations[0].count || 1;
                  const pct = (loc.count / max) * 100;
                  return (
                    <div key={loc.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{loc.name}</span>
                        <span className="font-medium text-slate-900">{loc.count}</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                Applications by field
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topFields.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No field data yet.
                </p>
              ) : (
                topFields.map((f) => {
                  const max = topFields[0].count || 1;
                  const pct = (f.count / max) * 100;
                  return (
                    <div key={f.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{f.name}</span>
                        <span className="font-medium text-slate-900">{f.count}</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
