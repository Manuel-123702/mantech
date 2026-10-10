import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requirePlacementMode } from '@/lib/university-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/config';
import { Building2, MapPin, Globe, Handshake, Briefcase, GraduationCap, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default async function UniversityPartnersPage() {
  const { organization } = await requirePlacementMode();
  if (!organization) return null;

  const institutionMatch = {
    institution: { equals: organization.name, mode: 'insensitive' as const },
  };

  const [companies, placementsByOrg, totalVerified, hostedTotal] = await Promise.all([
    prisma.organization.findMany({
      where: { type: 'COMPANY', verificationStatus: 'VERIFIED' },
      orderBy: { name: 'asc' },
      take: 60,
      include: {
        companyProfile: true,
        region: true,
        industry: true,
        _count: { select: { opportunities: true } },
      },
    }),
    prisma.placement.groupBy({
      by: ['organizationId'],
      where: { internProfile: institutionMatch },
      _count: { _all: true },
    }),
    prisma.organization.count({ where: { type: 'COMPANY', verificationStatus: 'VERIFIED' } }),
    prisma.placement.count({
      where: { internProfile: institutionMatch, status: { in: ['ACTIVE', 'COMPLETED'] } },
    }),
  ]);

  const placementCounts = new Map(placementsByOrg.map((row) => [row.organizationId, row._count._all]));

  const kpis = [
    { label: 'Verified partner companies', value: totalVerified, Icon: ShieldCheck, hint: 'Screened by MANTECH' },
    { label: 'Partners hosting your students', value: placementsByOrg.length, Icon: Handshake, hint: 'With at least one placement' },
    { label: 'Students onsite or completed', value: hostedTotal, Icon: GraduationCap, hint: 'Active + completed placements' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Partner companies</h2>
          <p className="text-sm text-slate-500 mt-1">
            Verified host organizations on MANTECH Nexus. Your students can apply to any of their published
            opportunities.
          </p>
        </div>
        <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Request new partnership
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
                <div className="w-10 h-10 rounded-xl border bg-amber-50 text-amber-600 border-amber-100 flex items-center justify-center">
                  <kpi.Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="text-lg font-bold text-slate-900">Verified hosts</CardTitle>
          <CardDescription className="text-xs">
            {companies.length === 0
              ? 'No verified companies yet'
              : `Showing ${companies.length} of ${totalVerified} verified partner${totalVerified === 1 ? '' : 's'}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {companies.length === 0 ? (
            <div className="py-14 text-center">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No verified partner companies yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Companies appear here once MANTECH completes their verification.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
              {companies.map((company) => {
                const placedCount = placementCounts.get(company.id) || 0;
                const initials = company.name
                  .split(/\s+/)
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                return (
                  <li key={company.id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{company.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {company.industry?.name || 'General sector'}
                          {company.size ? ` · ${company.size} employees` : ''}
                        </p>
                      </div>
                      {placedCount > 0 && (
                        <Badge variant="default" className="bg-emerald-600 shrink-0">
                          {placedCount} placed
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {company.city || company.region?.name || 'Cameroon'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {company._count.opportunities} role{company._count.opportunities === 1 ? '' : 's'} published
                      </span>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Website
                        </a>
                      )}
                    </div>
                    {company.companyProfile && company.companyProfile.branches.length > 0 && (
                      <p className="mt-2 text-[11px] text-slate-400 truncate">
                        Branches: {company.companyProfile.branches.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="text-[11px] text-slate-400">
        Placement counts reflect only your institution&apos;s students.{' '}
        <Link href="/dashboard/university/placements" className="text-emerald-600 hover:underline">
          View the full placement monitor
        </Link>{' '}
        for details.
      </p>
    </div>
  );
}
