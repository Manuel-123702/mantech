import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requirePlacementMode } from '@/lib/university-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/company/status-badge';
import { APP_CONFIG } from '@/lib/config';
import { BookOpen, CheckCircle2, Clock, AlertTriangle, Building2, ArrowUpRight, ClipboardList } from 'lucide-react';
import { PlacementStatus } from '@prisma/client';

const STATUS_FILTERS: { value: PlacementStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default async function UniversityPlacementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { organization } = await requirePlacementMode();
  if (!organization) return null;

  const sp = await searchParams;
  const statusFilter = STATUS_FILTERS.find((s) => s.value === sp?.status)?.value;

  const institutionMatch = {
    internProfile: { institution: { equals: organization.name, mode: 'insensitive' as const } },
  };

  const [placements, statusGroups] = await Promise.all([
    prisma.placement.findMany({
      where: {
        ...institutionMatch,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: { startDate: 'desc' },
      take: 100,
      include: {
        internProfile: { include: { user: true, fieldOfStudy: true } },
        organization: { select: { name: true, city: true } },
        application: { select: { opportunity: { select: { title: true } } } },
        onboardingItems: true,
      },
    }),
    prisma.placement.groupBy({
      by: ['status'],
      where: institutionMatch,
      _count: { _all: true },
    }),
  ]);

  const counts = new Map(statusGroups.map((g) => [g.status, g._count._all]));
  const totalCount = statusGroups.reduce((sum, g) => sum + g._count._all, 0);
  const activeCount = counts.get('ACTIVE') || 0;
  const completedCount = counts.get('COMPLETED') || 0;
  const upcomingCount = (counts.get('PENDING') || 0) + (counts.get('CONFIRMED') || 0);

  const kpis = [
    { label: 'Total placements', value: totalCount, Icon: ClipboardList, hint: 'All time, your students' },
    { label: 'Active internships', value: activeCount, Icon: CheckCircle2, hint: 'Currently onsite' },
    { label: 'Completed', value: completedCount, Icon: BookOpen, hint: 'Successfully finished' },
    { label: 'Upcoming', value: upcomingCount, Icon: Clock, hint: 'Pending + confirmed starts' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Placement monitoring</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track internships for students associated with {organization.name}: periods, host organizations, and
            onboarding progress.
          </p>
        </div>
        <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Report a placement issue
          </Button>
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

      <Card>
        <CardHeader className="border-b border-slate-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Placement roster</CardTitle>
              <CardDescription className="text-xs">
                {statusFilter
                  ? `${placements.length} ${STATUS_FILTERS.find((s) => s.value === statusFilter)?.label.toLowerCase()} placement(s)`
                  : `${placements.length} placement(s) shown`}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
              <Link
                href="/dashboard/university/placements"
                className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                  !statusFilter ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All ({totalCount})
              </Link>
              {STATUS_FILTERS.map((s) => (
                <Link
                  key={s.value}
                  href={`/dashboard/university/placements?status=${s.value}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                    statusFilter === s.value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s.label} ({counts.get(s.value) || 0})
                </Link>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Host organization</th>
                  <th className="px-5 py-3">Period</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">Onboarding</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {placements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-700">
                        {statusFilter ? 'No placements with this status' : 'No placements recorded yet'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        {statusFilter
                          ? 'Clear the filter to see the full roster.'
                          : 'Placements appear here once your students are onboarded with host organizations through MANTECH.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  placements.map((p) => {
                    const start = new Date(p.startDate);
                    const end = new Date(p.endDate);
                    const now = new Date();
                    const total = Math.max(1, end.getTime() - start.getTime());
                    const elapsed = Math.max(0, Math.min(total, now.getTime() - start.getTime()));
                    const pct = Math.round((elapsed / total) * 100);
                    const initials = (p.internProfile.user.fullName || '? ?')
                      .split(' ')
                      .map((w) => w[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();
                    const done = p.onboardingItems.filter((i) => i.isCompleted).length;
                    const onboardingTotal = p.onboardingItems.length;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {p.internProfile.user.fullName}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {p.internProfile.fieldOfStudy?.name || p.internProfile.qualification}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-slate-700 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {p.organization.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                            {p.application?.opportunity?.title || p.department || 'Internship'}
                            {p.organization.city ? ` · ${p.organization.city}` : ''}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                          {start.toLocaleDateString()} → {end.toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="w-full max-w-[160px]">
                            <div className="flex items-center justify-between text-[11px] mb-1.5">
                              <span className="text-slate-500">Elapsed</span>
                              <span className="font-mono font-bold text-slate-700">{pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          {onboardingTotal > 0 ? (
                            <span className="inline-flex items-center gap-1.5">
                              {done === onboardingTotal ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                              )}
                              <span className="font-mono">
                                {done}/{onboardingTotal}
                              </span>
                              <span className="text-[11px] text-slate-400">tasks</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">No checklist</span>
                          )}
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
    </div>
  );
}
