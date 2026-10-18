import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/company/status-badge';
import { Briefcase, Users, Star, Calendar, UserCheck, Clock, Bell, AlertTriangle } from 'lucide-react';

export default async function CompanyOverviewPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 14);

  const [
    opportunities,
    applications,
    interviews,
    placements,
    savedCount,
    notifications,
  ] = await Promise.all([
    prisma.internshipOpportunity.findMany({
      where: { organizationId: organization.id },
      include: { applications: true, region: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.application.findMany({
      where: { opportunity: { organizationId: organization.id } },
      include: {
        internProfile: { include: { user: { select: { fullName: true } } } },
        opportunity: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.interview.count({
      where: {
        application: { opportunity: { organizationId: organization.id } },
        status: 'scheduled',
        scheduledAt: { gte: now },
      },
    }),
    prisma.placement.findMany({
      where: { organizationId: organization.id },
    }),
    prisma.savedCandidate.count({ where: { organizationId: organization.id } }),
    prisma.notification.findMany({
      where: { userId: { in: organization.members.map((m) => m.userId) } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  const activeOpportunities = opportunities.filter((o) => o.moderationStatus === 'PUBLISHED');
  const expiring = activeOpportunities.filter((o) => o.deadline <= soon && o.deadline >= now);
  const selected = applications.filter((a) => a.status === 'SELECTED').length;
  const shortlisted = await prisma.application.count({
    where: { opportunity: { organizationId: organization.id }, status: 'SHORTLISTED' },
  });

  const stats = [
    { label: 'Active opportunities', value: activeOpportunities.length, icon: Briefcase },
    { label: 'Applications', value: opportunities.reduce((sum, o) => sum + o.applications.length, 0), icon: Users },
    { label: 'Shortlisted', value: shortlisted, icon: Star },
    { label: 'Upcoming interviews', value: interviews, icon: Calendar },
    { label: 'Selected interns', value: selected, icon: UserCheck },
    { label: 'Active placements', value: placements.filter((p) => p.status === 'ACTIVE').length, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {organization.verificationStatus !== 'VERIFIED' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Your organization is {organization.verificationStatus.toLowerCase()}. You can create opportunities now;
          Intern Passport discovery and CV access unlock after MANTECH verification.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Opportunities</CardTitle>
            <Link href="/dashboard/company/opportunities/create">
              <Button size="sm">New opportunity</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {opportunities.slice(0, 5).map((opp) => (
              <div key={opp.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-slate-900">{opp.title}</p>
                  <p className="text-xs text-slate-500">
                    {opp.applications.length} applications · {opp.city}
                  </p>
                </div>
                <StatusBadge status={opp.moderationStatus} />
              </div>
            ))}
            {opportunities.length === 0 && <p className="py-8 text-center text-slate-500">No opportunities yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/company/applications/${app.id}`}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 hover:bg-slate-100"
              >
                <div>
                  <p className="font-medium text-slate-900">{app.internProfile.user.fullName}</p>
                  <p className="text-xs text-slate-500">{app.opportunity?.title ?? 'No opportunity'}</p>
                </div>
                <StatusBadge status={app.status} />
              </Link>
            ))}
            {applications.length === 0 && <p className="py-8 text-center text-slate-500">No applications yet.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Expiring opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiring.length === 0 ? (
              <p className="text-sm text-slate-500">No deadlines in the next 14 days.</p>
            ) : (
              <div className="space-y-2">
                {expiring.map((opp) => (
                  <p key={opp.id} className="text-sm">
                    {opp.title} · {opp.deadline.toLocaleDateString()}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-4 text-sm text-slate-500">Saved Intern Passports: {savedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id}>
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.message}</p>
              </div>
            ))}
            {notifications.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
