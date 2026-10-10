import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requirePlacementMode } from '@/lib/university-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/config';
import { Eye, Briefcase, MapPin, Clock, CalendarDays, Banknote, Search, ArrowUpRight, Building2 } from 'lucide-react';
import { WorkMode, ModerationStatus } from '@prisma/client';

const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: 'ONSITE', label: 'Onsite' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
];

export default async function UniversityOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mode?: string }>;
}) {
  const { organization } = await requirePlacementMode();
  if (!organization) return null;

  const sp = await searchParams;
  const q = sp?.q?.trim() || '';
  const workMode = WORK_MODES.find((m) => m.value === sp?.mode)?.value;

  const baseWhere = { moderationStatus: ModerationStatus.PUBLISHED };

  const [opportunities, totalPublished, remoteCount, paidCount] = await Promise.all([
    prisma.internshipOpportunity.findMany({
      where: {
        ...baseWhere,
        ...(workMode ? { workMode } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { organization: { name: { contains: q, mode: 'insensitive' } } },
                { city: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 40,
      include: {
        organization: { select: { name: true, verificationStatus: true } },
        field: true,
        region: true,
      },
    }),
    prisma.internshipOpportunity.count({ where: baseWhere }),
    prisma.internshipOpportunity.count({ where: { ...baseWhere, workMode: 'REMOTE' } }),
    prisma.internshipOpportunity.count({ where: { ...baseWhere, isPaid: true } }),
  ]);

  const kpis = [
    { label: 'Open opportunities', value: totalPublished, Icon: Briefcase, hint: 'Published across all partners' },
    { label: 'Remote-friendly roles', value: remoteCount, Icon: Eye, hint: 'Accessible from any region' },
    { label: 'Paid internships', value: paidCount, Icon: Banknote, hint: 'Monthly allowance offered' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Opportunity discovery</h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified internships your students can apply to directly on MANTECH. Share the public links with your
            cohort — applications and CVs stay student-controlled.
          </p>
        </div>
        <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Request a partner introduction
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{kpi.value}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{kpi.hint}</p>
                </div>
                <div className="w-10 h-10 rounded-xl border bg-purple-50 text-purple-600 border-purple-100 flex items-center justify-center">
                  <kpi.Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Live opportunities</CardTitle>
              <CardDescription className="text-xs">
                {q ? `${opportunities.length} result(s) for "${q}"` : 'Newest published roles from verified hosts'}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form className="flex items-center gap-2" method="get">
                {workMode && <input type="hidden" name="mode" value={workMode} />}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Search role, company, city"
                    className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 w-60"
                  />
                </div>
                <Button type="submit" size="sm" variant="outline">
                  Search
                </Button>
              </form>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 bg-slate-50">
                <Link
                  href={`/dashboard/university/opportunities${q ? `?q=${encodeURIComponent(q)}` : ''}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                    !workMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  All
                </Link>
                {WORK_MODES.map((m) => (
                  <Link
                    key={m.value}
                    href={`/dashboard/university/opportunities?mode=${m.value}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                      workMode === m.value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {opportunities.length === 0 ? (
            <div className="py-14 text-center">
              <Eye className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No open opportunities found</p>
              <p className="text-xs text-slate-500 mt-1">
                {q || workMode
                  ? 'Try clearing your filters or searching a different term.'
                  : 'New internships appear here as soon as partner companies publish them.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {opportunities.map((opp) => (
                <li key={opp.id} className="px-5 py-4 hover:bg-slate-50">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                        {opp.isPaid && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Paid{opp.allowanceXAF ? ` · ${opp.allowanceXAF.toLocaleString()} FCFA/mo` : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-3xl">
                        {opp.description.slice(0, 180)}
                        {opp.description.length > 180 ? '…' : ''}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {opp.organization.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {opp.city}
                          {opp.region ? `, ${opp.region.name}` : ''}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {opp.durationMonths} months · {WORK_MODES.find((m) => m.value === opp.workMode)?.label}
                        </span>
                        {opp.field && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {opp.field.name}
                          </Badge>
                        )}
                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <CalendarDays className="w-3.5 h-3.5" />
                          Deadline {opp.deadline.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/internships/${opp.slug}`}>
                          View posting
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
