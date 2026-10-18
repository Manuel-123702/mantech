import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Calendar, User, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { AdminActionButton } from '@/components/admin/admin-action-button';

const statusConfig = {
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  INTERVIEW: { label: 'Interview', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  SELECTED: { label: 'Selected', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  PLACEMENT_PENDING: { label: 'Placement Pending', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  PLACED: { label: 'Placed', color: 'bg-green-100 text-green-700 border-green-200' },
  INTERNSHIP_ACTIVE: { label: 'Internship Active', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  COMPLETED: { label: 'Completed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
  WITHDRAWN: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export default async function CompanyApplicationsPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const applications = await prisma.application.findMany({
    where: {
      OR: [
        { opportunity: { organizationId: organization.id } },
        { job: { organizationId: organization.id } },
      ],
    },
    include: {
      internProfile: {
        include: {
          user: { select: { fullName: true, email: true, avatarUrl: true } },
          fieldOfStudy: true,
          skills: { include: { skill: true } },
        },
      },
      opportunity: {
        include: {
          field: true,
          region: true,
        },
      },
      job: {
        include: {
          field: true,
          region: true,
        },
      },
      placement: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === 'SUBMITTED').length,
    underReview: applications.filter((a) => a.status === 'UNDER_REVIEW').length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    interview: applications.filter((a) => a.status === 'INTERVIEW').length,
    selected: applications.filter((a) => a.status === 'SELECTED').length,
    placed: applications.filter((a) => a.status === 'PLACED' || a.status === 'INTERNSHIP_ACTIVE').length,
  };

  const getApplicationsByStatus = (statuses: string[]) => {
    return applications.filter((a) => statuses.includes(a.status));
  };

  const renderApplicationCard = (application: any) => {
    const config = statusConfig[application.status as keyof typeof statusConfig];
    return (
      <Card key={application.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {application.internProfile.user.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{application.internProfile.user.fullName}</h3>
                    <Badge className={config.color} variant="outline">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{application.internProfile.qualification}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <User className="w-3 h-3" />
                    <span>{application.internProfile.fieldOfStudy?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Briefcase className="w-3 h-3" />
                    <span>{application.opportunity?.title ?? application.job?.title ?? 'Application'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  {application.readinessScore && (
                    <div className="mt-2">
                      <span className="text-xs text-slate-500">Readiness Score: </span>
                      <span className="text-xs font-semibold text-slate-900">{application.readinessScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 sm:w-auto w-full">
              <Link href={`/dashboard/company/applications/${application.id}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
              {application.status === 'SUBMITTED' && (
                <AdminActionButton
                  endpoint={`/api/applications/${application.id}`}
                  method="PATCH"
                  payload={{ status: 'UNDER_REVIEW' }}
                  label="Start review"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                />
              )}
              {application.status === 'UNDER_REVIEW' && (
                <AdminActionButton
                  endpoint={`/api/applications/${application.id}`}
                  method="PATCH"
                  payload={{ status: 'SHORTLISTED' }}
                  label="Shortlist"
                  className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700"
                />
              )}
              {application.status === 'SHORTLISTED' && (
                <Link href={`/dashboard/company/applications/${application.id}`}>
                  <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-600 text-sm">Manage and track all internship applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
            <div className="text-xs text-slate-600">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.underReview}</div>
            <div className="text-xs text-slate-600">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
            <div className="text-xs text-slate-600">Shortlisted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-600">{stats.interview}</div>
            <div className="text-xs text-slate-600">Interview</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.placed}</div>
            <div className="text-xs text-slate-600">Placed</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="new">New ({stats.submitted})</TabsTrigger>
          <TabsTrigger value="review">Review ({stats.underReview})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({stats.shortlisted})</TabsTrigger>
          <TabsTrigger value="interview">Interview ({stats.interview})</TabsTrigger>
          <TabsTrigger value="selected">Selected ({stats.selected})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications yet</h3>
                <p className="text-slate-600 text-sm">Applications will appear here when candidates apply to your opportunities</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {applications.map(renderApplicationCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {getApplicationsByStatus(['SUBMITTED']).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No new applications</h3>
                <p className="text-slate-600 text-sm">Check back later for new submissions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getApplicationsByStatus(['SUBMITTED']).map(renderApplicationCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {getApplicationsByStatus(['UNDER_REVIEW']).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications under review</h3>
                <p className="text-slate-600 text-sm">Applications you&apos;re reviewing will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getApplicationsByStatus(['UNDER_REVIEW']).map(renderApplicationCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          {getApplicationsByStatus(['SHORTLISTED']).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No shortlisted candidates</h3>
                <p className="text-slate-600 text-sm">Shortlist candidates you want to interview</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getApplicationsByStatus(['SHORTLISTED']).map(renderApplicationCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {getApplicationsByStatus(['INTERVIEW']).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No interviews scheduled</h3>
                <p className="text-slate-600 text-sm">Scheduled interviews will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getApplicationsByStatus(['INTERVIEW']).map(renderApplicationCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="selected" className="space-y-4">
          {getApplicationsByStatus(['SELECTED', 'PLACEMENT_PENDING', 'PLACED', 'INTERNSHIP_ACTIVE']).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No selected candidates</h3>
                <p className="text-slate-600 text-sm">Selected interns will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getApplicationsByStatus(['SELECTED', 'PLACEMENT_PENDING', 'PLACED', 'INTERNSHIP_ACTIVE']).map(renderApplicationCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
