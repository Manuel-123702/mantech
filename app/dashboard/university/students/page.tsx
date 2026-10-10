import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requirePlacementMode } from '@/lib/university-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/config';
import { Users, GraduationCap, ShieldCheck, MapPin, Search, BookOpen, Info } from 'lucide-react';

export default async function UniversityStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { organization } = await requirePlacementMode();
  if (!organization) return null;

  const sp = await searchParams;
  const q = sp?.q?.trim() || '';

  const institutionMatch = {
    institution: { equals: organization.name, mode: 'insensitive' as const },
  };

  const [students, totalCount, searchableCount, placedRows, readiness] = await Promise.all([
    prisma.internProfile.findMany({
      where: {
        ...institutionMatch,
        ...(q
          ? {
              OR: [
                { user: { fullName: { contains: q, mode: 'insensitive' as const } } },
                { qualification: { contains: q, mode: 'insensitive' as const } },
                { city: { contains: q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: true,
        fieldOfStudy: true,
        region: true,
        skills: { include: { skill: true } },
        placements: { select: { id: true, status: true } },
      },
    }),
    prisma.internProfile.count({ where: institutionMatch }),
    prisma.internProfile.count({ where: { ...institutionMatch, isCvSearchable: true } }),
    prisma.placement.groupBy({ by: ['internProfileId'], where: { internProfile: institutionMatch } }),
    prisma.internProfile.aggregate({ where: institutionMatch, _avg: { readinessScore: true } }),
  ]);

  const placedStudentCount = placedRows.length;
  const avgReadiness = Math.round(readiness._avg.readinessScore || 0);
  const placementRate = totalCount > 0 ? Math.round((placedStudentCount / totalCount) * 100) : 0;

  const kpis = [
    { label: 'Registered students', value: totalCount, Icon: Users, hint: 'Linked via institution name' },
    { label: 'Visible to verified companies', value: searchableCount, Icon: ShieldCheck, hint: 'CV searchability enabled' },
    { label: 'Students placed', value: placedStudentCount, Icon: GraduationCap, hint: `${placementRate}% placement rate` },
    { label: 'Average readiness score', value: `${avgReadiness}%`, Icon: BookOpen, hint: 'Across all associated students' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Associated students</h2>
          <p className="text-sm text-slate-500 mt-1">
            Students who listed <span className="font-semibold text-slate-700">{organization.name}</span> as their
            institution appear here automatically. MANTECH never shares their CVs without authorization.
          </p>
        </div>
        <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <Info className="w-4 h-4 mr-1.5" />
            Roster missing a student?
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Student roster</CardTitle>
            <CardDescription className="text-xs">
              {q ? `${students.length} match(es) for "${q}"` : `Showing the ${Math.min(50, totalCount)} most recent profiles`}
            </CardDescription>
          </div>
          <form className="flex items-center gap-2" method="get">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search name, qualification, city"
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 w-64"
              />
            </div>
            <Button type="submit" size="sm" variant="outline">
              Search
            </Button>
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Field of study</th>
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Readiness</th>
                  <th className="px-5 py-3">Placement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-700">
                        {q ? 'No students match your search' : 'No associated students yet'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        {q
                          ? 'Try a different name, qualification, or city.'
                          : `Students are linked automatically when the "institution" field on their intern profile matches "${organization.name}". Ask students to use this exact name, or contact MANTECH for a roster import.`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => {
                    const initials = (s.user.fullName || '? ?')
                      .split(' ')
                      .map((w) => w[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();
                    const activePlacement = s.placements.find((p) => p.status === 'ACTIVE' || p.status === 'CONFIRMED');
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{s.user.fullName}</p>
                              <p className="text-[11px] text-slate-500 truncate">{s.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-slate-700">{s.fieldOfStudy?.name || s.qualification}</p>
                          {s.skills.length > 0 && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {s.skills.slice(0, 3).map((sk) => sk.skill.name).join(', ')}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">{s.academicLevel || '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {s.city || s.region?.name || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="w-28">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-mono font-bold text-slate-700">{s.readinessScore}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                style={{ width: `${Math.min(100, s.readinessScore)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {activePlacement ? (
                            <Badge variant="default" className="bg-emerald-600">{activePlacement.status}</Badge>
                          ) : s.placements.length > 0 ? (
                            <Badge variant="secondary">{s.placements.length} placement(s)</Badge>
                          ) : (
                            <span className="text-xs text-slate-400">Not placed</span>
                          )}
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

      <p className="text-[11px] text-slate-400">
        Privacy: contact details and CV documents are not shown here. CV access is server-authorized and audited. Need
        enrolment data or roster corrections?{' '}
        <Link href="/dashboard/university/settings" className="text-emerald-600 hover:underline">
          Update your institution profile
        </Link>{' '}
        or contact MANTECH support.
      </p>
    </div>
  );
}
