import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, MapPin, User, Briefcase, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { AdminActionButton } from '@/components/admin/admin-action-button';

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
  rescheduled: { label: 'Rescheduled', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default async function CompanyInterviewsPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  const interviews = await prisma.interview.findMany({
    where: {
      application: {
        opportunity: { organizationId: organization.id },
      },
    },
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
    },
    orderBy: { scheduledAt: 'desc' },
    take: 50,
  });

  const now = new Date();
  const upcoming = interviews.filter((i) => i.status === 'scheduled' && new Date(i.scheduledAt) >= now);
  const past = interviews.filter((i) => i.status === 'completed' || new Date(i.scheduledAt) < now);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interviews</h1>
          <p className="text-slate-600 text-sm">Schedule and manage candidate interviews</p>
        </div>
        <Link href="/dashboard/company/applications">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Choose Applicant
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{interviews.length}</div>
            <div className="text-xs text-slate-600">Total Interviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{upcoming.length}</div>
            <div className="text-xs text-slate-600">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{past.length}</div>
            <div className="text-xs text-slate-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">
              {interviews.filter((i) => i.status === 'scheduled' && new Date(i.scheduledAt) < now).length}
            </div>
            <div className="text-xs text-slate-600">Pending Action</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Interviews</h2>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming interviews</h3>
              <p className="text-slate-600 text-sm">Schedule interviews with shortlisted candidates</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcoming.map((interview) => {
              const config = statusConfig[interview.status as keyof typeof statusConfig];
              const scheduledDate = new Date(interview.scheduledAt);
              return (
                <Card key={interview.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {interview.application.internProfile.user.fullName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900">
                                {interview.application.internProfile.user.fullName}
                              </h3>
                              <Badge className={config.color} variant="outline">
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              {interview.application.opportunity.title}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{scheduledDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Duration: {interview.durationMinutes} min</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                              {interview.type === 'online' && <Video className="w-3 h-3" />}
                              {interview.type === 'onsite' && <MapPin className="w-3 h-3" />}
                              <span className="capitalize">{interview.type}</span>
                              {interview.meetingLink && (
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline ml-2"
                                >
                                  Join Meeting
                                </a>
                              )}
                              {interview.locationAddress && (
                                <span className="ml-2">• {interview.locationAddress}</span>
                              )}
                            </div>
                            {interview.instructions && (
                              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                                {interview.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 sm:w-auto w-full">
                        <AdminActionButton
                          endpoint={`/api/interviews/${interview.id}`}
                          method="PATCH"
                          payload={{ status: 'completed' }}
                          label="Complete"
                          variant="outline"
                          className="w-full sm:w-auto"
                        />
                        <Link href={`/dashboard/company/applications/${interview.applicationId}`}>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            Manage interview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Interviews */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Past Interviews</h2>
        {past.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No past interviews</h3>
              <p className="text-slate-600 text-sm">Completed interviews will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {past.map((interview) => {
              const config = statusConfig[interview.status as keyof typeof statusConfig];
              const scheduledDate = new Date(interview.scheduledAt);
              return (
                <Card key={interview.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {interview.application.internProfile.user.fullName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900">
                                {interview.application.internProfile.user.fullName}
                              </h3>
                              <Badge className={config.color} variant="outline">
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              {interview.application.opportunity.title}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{scheduledDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            {interview.feedbackNotes && (
                              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                                <strong>Feedback:</strong> {interview.feedbackNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 sm:w-auto w-full">
                        <Link href={`/dashboard/company/applications/${interview.applicationId}`}>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            View Application
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
