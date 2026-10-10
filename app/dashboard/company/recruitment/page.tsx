import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, Calendar, MapPin, CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';

const placementStatusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ACTIVE: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default async function CompanyRecruitmentPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const placements = await prisma.placement.findMany({
    where: { organizationId: organization.id },
    include: {
      application: {
        include: {
          internProfile: {
            include: {
              user: { select: { fullName: true, email: true, avatarUrl: true } },
              fieldOfStudy: true,
            },
          },
          opportunity: {
            include: {
              field: true,
            },
          },
        },
      },
      onboardingItems: true,
    },
    orderBy: { startDate: 'desc' },
    take: 50,
  });

  const selectedApplications = await prisma.application.findMany({
    where: {
      opportunity: { organizationId: organization.id },
      status: 'SELECTED',
    },
    include: {
      internProfile: {
        include: {
          user: { select: { fullName: true, email: true } },
          fieldOfStudy: true,
        },
      },
      opportunity: {
        include: {
          field: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  });

  const stats = {
    total: placements.length,
    active: placements.filter((p) => p.status === 'ACTIVE').length,
    completed: placements.filter((p) => p.status === 'COMPLETED').length,
    pending: placements.filter((p) => p.status === 'PENDING' || p.status === 'CONFIRMED').length,
    selected: selectedApplications.length,
  };

  const renderPlacementCard = (placement: any) => {
    const config = placementStatusConfig[placement.status as keyof typeof placementStatusConfig];
    const startDate = new Date(placement.startDate);
    const endDate = new Date(placement.endDate);
    const completedOnboarding = placement.onboarding.filter((o: any) => o.isCompleted).length;
    const totalOnboarding = placement.onboarding.length;

    return (
      <Card key={placement.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {placement.application.internProfile.user.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">
                      {placement.application.internProfile.user.fullName}
                    </h3>
                    <Badge className={config.color} variant="outline">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{placement.application.opportunity.title}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{placement.department || 'General'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  {totalOnboarding > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Onboarding Progress</span>
                        <span>{completedOnboarding}/{totalOnboarding}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${(completedOnboarding / totalOnboarding) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 sm:w-auto w-full">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <User className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Options
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSelectedCard = (application: any) => {
    return (
      <Card key={application.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {application.internProfile.user.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">
                      {application.internProfile.user.fullName}
                    </h3>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline">
                      Selected
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{application.opportunity.title}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{application.internProfile.fieldOfStudy?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{application.internProfile.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 sm:w-auto w-full">
              <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Placement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recruitment & Placements</h1>
          <p className="text-slate-600 text-sm">Track selected candidates and manage active internships</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Create Placement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-600">Total Placements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            <div className="text-xs text-slate-600">Active Internships</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-600">{stats.completed}</div>
            <div className="text-xs text-slate-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-xs text-slate-600">Pending Start</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.selected}</div>
            <div className="text-xs text-slate-600">Selected</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="placements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="placements">Active Placements ({stats.active + stats.pending})</TabsTrigger>
          <TabsTrigger value="selected">Selected Candidates ({stats.selected})</TabsTrigger>
        </TabsList>

        <TabsContent value="placements" className="space-y-4">
          {placements.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No placements yet</h3>
                <p className="text-slate-600 text-sm">Create placements for selected candidates to track their internships</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {placements.map(renderPlacementCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="selected" className="space-y-4">
          {selectedApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No selected candidates</h3>
                <p className="text-slate-600 text-sm">Select candidates from applications to create placements</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {selectedApplications.map(renderSelectedCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
