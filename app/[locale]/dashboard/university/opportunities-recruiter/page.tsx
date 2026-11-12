import { Trans } from '@lingui/react/macro';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { prisma } from '@/lib/prisma';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/company/status-badge';
import { OpportunityActions } from '@/components/dashboard/opportunity-actions';
import { Plus, Eye, Users } from 'lucide-react';

export default async function UniversityRecruiterOpportunitiesPage() {
  const { organization } = await requireUniversityRecruiterMode();
  if (!organization) return null;

  const opportunities = await prisma.internshipOpportunity.findMany({
    where: { organizationId: organization.id },
    include: { applications: true, region: true, field: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900"><Trans comment="page h2 visible text">Recruitment opportunities</Trans></h2>
          <p className="text-sm text-slate-500">
            <Trans comment="page p visible text">Post internships hosted by your institution and manage roles from your organization only.
          </Trans></p>
        </div>
        <Link href="/dashboard/university/opportunities-recruiter/create">
          <Button><Plus className="mr-2 h-4 w-4" /><Trans comment="page Button visible text">Create opportunity</Trans></Button>
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {opportunities.map((opp) => (
            <div key={opp.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                    <StatusBadge status={opp.moderationStatus} />
                  </div>
                  <p className="text-sm text-slate-600">{opp.description.slice(0, 160)}{opp.description.length > 160 ? '…' : ''}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{opp.positions} <Trans comment="page span visible text">positions</Trans></span>
                    <span>{opp.city}{opp.region ? `, ${opp.region.name}` : ''}</span>
                    <span>{opp.workMode}</span>
                    <span>{opp.durationMonths} <Trans comment="page span visible text">months</Trans></span>
                    <span>{opp.applicationMethod.replaceAll('_', ' ')}</span>
                    <span><Trans comment="page span visible text">Deadline </Trans>{opp.deadline.toLocaleDateString()}</span>
                  </div>
                </div>
                <OpportunityActions
                  id={opp.id}
                  status={opp.moderationStatus}
                  opportunitiesBase="/dashboard/university/opportunities-recruiter"
                />
              </div>
              <div className="mt-4 flex items-center gap-4 border-t pt-3 text-sm text-slate-500">
                <span><Users className="mr-1 inline h-4 w-4" />{opp.applications.length} <Trans comment="page span visible text">applications</Trans></span>
                <span><Eye className="mr-1 inline h-4 w-4" />{opp.viewCount} <Trans comment="page span visible text">views</Trans></span>
                <Link href={`/internships/${opp.slug}`} className="text-blue-600 hover:underline"><Trans comment="page Link visible text">Public page</Trans></Link>
              </div>
            </div>
          ))}
          {opportunities.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Trans comment="page div visible text">No opportunities yet. Create your first internship posting as a host institution.
            </Trans></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
