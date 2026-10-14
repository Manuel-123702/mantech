import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/company/status-badge';
import { OpportunityActions } from '@/components/dashboard/opportunity-actions';
import { BoostRequestButton } from '@/components/company/boost-request-button';
import { Plus, Eye, Users } from 'lucide-react';

export default async function CompanyOpportunitiesPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const [opportunities, boosts] = await Promise.all([
    prisma.internshipOpportunity.findMany({
      where: { organizationId: organization.id },
      include: { applications: true, region: true, field: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Latest live or terminal boost per opportunity (for the boost control).
    prisma.boost.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'desc' },
      select: { opportunityId: true, status: true, endsAt: true, resolution: true, createdAt: true },
    }),
  ]);

  const boostByOpportunity = new Map<string, (typeof boosts)[number]>();
  for (const boost of boosts) {
    if (!boostByOpportunity.has(boost.opportunityId)) {
      boostByOpportunity.set(boost.opportunityId, boost);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Internship opportunities</h2>
          <p className="text-sm text-slate-500">Draft, submit for review, archive, or close roles from your organization only.</p>
        </div>
        <Link href="/dashboard/company/opportunities/create">
          <Button><Plus className="mr-2 h-4 w-4" />Create opportunity</Button>
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
                    <span>{opp.positions} positions</span>
                    <span>{opp.city}{opp.region ? `, ${opp.region.name}` : ''}</span>
                    <span>{opp.workMode}</span>
                    <span>{opp.durationMonths} months</span>
                    <span>{opp.applicationMethod.replaceAll('_', ' ')}</span>
                    <span>Deadline {opp.deadline.toLocaleDateString()}</span>
                  </div>
                </div>
                <OpportunityActions id={opp.id} status={opp.moderationStatus} opportunitiesBase="/dashboard/company/opportunities" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t pt-3 text-sm text-slate-500">
                <span><Users className="mr-1 inline h-4 w-4" />{opp.applications.length} applications</span>
                <span><Eye className="mr-1 inline h-4 w-4" />{opp.viewCount} views</span>
                <Link href={`/internships/${opp.slug}`} className="text-blue-600 hover:underline">Public page</Link>
                <BoostRequestButton
                  opportunityId={opp.id}
                  moderationStatus={opp.moderationStatus}
                  boost={boostByOpportunity.get(opp.id) ?? null}
                />
              </div>
            </div>
          ))}
          {opportunities.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No opportunities yet. Create your first internship posting.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
