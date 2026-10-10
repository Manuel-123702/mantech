import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Briefcase, TrendingUp, Calendar, FileText, Star, CheckCircle } from 'lucide-react';

export default async function CompanyAnalyticsPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    opportunities,
    applications,
    placements,
    savedCandidates,
  ] = await Promise.all([
    prisma.internshipOpportunity.findMany({
      where: { organizationId: organization.id },
      include: { applications: true },
    }),
    prisma.application.findMany({
      where: { opportunity: { organizationId: organization.id } },
      include: { opportunity: true },
    }),
    prisma.placement.findMany({
      where: { organizationId: organization.id },
    }),
    prisma.savedCandidate.findMany({
      where: { organizationId: organization.id },
    }),
  ]);

  // Calculate metrics
  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter((o) => o.moderationStatus === 'PUBLISHED').length;
  const totalApplications = applications.length;
  const applicationsLast30Days = applications.filter((a) => new Date(a.createdAt) >= thirtyDaysAgo).length;
  const totalPlacements = placements.length;
  const activePlacements = placements.filter((p) => p.status === 'ACTIVE').length;
  const completedPlacements = placements.filter((p) => p.status === 'COMPLETED').length;
  const totalViews = opportunities.reduce((sum, o) => sum + o.viewCount, 0);
  const viewsLast30Days = opportunities.reduce((sum, o) => sum + o.viewCount, 0); // Simplified - would need timestamp tracking
  const savedCandidatesCount = savedCandidates.length;

  // Application funnel
  const submitted = applications.filter((a) => a.status === 'SUBMITTED').length;
  const underReview = applications.filter((a) => a.status === 'UNDER_REVIEW').length;
  const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const interview = applications.filter((a) => a.status === 'INTERVIEW').length;
  const selected = applications.filter((a) => a.status === 'SELECTED').length;

  // Opportunity performance
  const topOpportunities = opportunities
    .map((o) => ({
      title: o.title,
      views: o.viewCount,
      applications: o.applications.length,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 text-sm">Track your recruitment performance and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Applications</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalApplications}</p>
                <p className="text-xs text-emerald-600 mt-1">+{applicationsLast30Days} last 30 days</p>
              </div>
              <Users className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Placements</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalPlacements}</p>
                <p className="text-xs text-slate-600 mt-1">{activePlacements} active</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Saved Candidates</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{savedCandidatesCount}</p>
              </div>
              <Star className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Application Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Submitted', count: submitted, color: 'bg-blue-500' },
              { label: 'Under Review', count: underReview, color: 'bg-amber-500' },
              { label: 'Shortlisted', count: shortlisted, color: 'bg-purple-500' },
              { label: 'Interview', count: interview, color: 'bg-cyan-500' },
              { label: 'Selected', count: selected, color: 'bg-emerald-500' },
            ].map((stage) => (
              <div key={stage.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{stage.label}</span>
                  <span className="font-semibold text-slate-900">{stage.count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`${stage.color} h-2 rounded-full transition-all`}
                    style={{ width: `${totalApplications > 0 ? (stage.count / totalApplications) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Opportunity Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {topOpportunities.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">No opportunities yet</p>
            ) : (
              <div className="space-y-4">
                {topOpportunities.map((opp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{opp.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {opp.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {opp.applications} applications
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{opp.applications}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placement Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Placement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Active Internships</p>
                  <p className="text-2xl font-bold text-emerald-700">{activePlacements}</p>
                </div>
                <Briefcase className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Completed Internships</p>
                  <p className="text-2xl font-bold text-slate-700">{completedPlacements}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-slate-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-600">Total Placements</p>
                  <p className="text-2xl font-bold text-blue-700">{totalPlacements}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Active Opportunities</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{activeOpportunities}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Total Opportunities</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{totalOpportunities}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Package Limit</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {organization.packageCode === 'FREE' ? '5' : organization.packageCode === 'PROFESSIONAL' ? '20' : 'Unlimited'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Remaining</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {organization.packageCode === 'FREE' ? Math.max(0, 5 - activeOpportunities) : 'Unlimited'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
