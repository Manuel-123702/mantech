import { requireUser } from '@/lib/authz';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Building2, Calendar, Clock, CheckCircle2, XCircle, Search, FileText } from 'lucide-react';

const STATUS_ORDER = ['ALL', 'SUBMITTED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'] as const;

const statusStyles: Record<string, string> = {
  SUBMITTED: 'bg-slate-100 text-slate-700 border-slate-200',
  SHORTLISTED: 'bg-amber-100 text-amber-700 border-amber-200',
  INTERVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
  SELECTED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
};

function statusIcon(status: string) {
  if (status === 'SELECTED') return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === 'INTERVIEW') return <Clock className="h-3.5 w-3.5" />;
  if (status === 'REJECTED') return <XCircle className="h-3.5 w-3.5" />;
  return <Briefcase className="h-3.5 w-3.5" />;
}

export default async function InternApplicationsPage() {
  const user = await requireUser();

  const profile = await prisma.internProfile.findUnique({
    where: { userId: user.id },
    include: {
      applications: {
        include: {
          opportunity: {
            include: {
              organization: { select: { name: true, slug: true } },
              field: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const applications = profile?.applications || [];

  const counts = {
    ALL: applications.length,
    SUBMITTED: applications.filter((a) => a.status === 'SUBMITTED').length,
    SHORTLISTED: applications.filter((a) => a.status === 'SHORTLISTED').length,
    INTERVIEW: applications.filter((a) => a.status === 'INTERVIEW').length,
    SELECTED: applications.filter((a) => a.status === 'SELECTED').length,
    REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
  };

  const filterByStatus = (status: string) =>
    status === 'ALL' ? applications : applications.filter((a) => a.status === status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track every application from submission through interview to final selection.
          </p>
        </div>
        <Link href="/internships">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Search className="mr-2 h-4 w-4" />
            Browse internships
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATUS_ORDER.map((s) => (
          <Card key={s}>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {s === 'ALL' ? 'Total' : s.charAt(0) + s.slice(1).toLowerCase()}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{counts[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="ALL">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
          {STATUS_ORDER.map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold data-[state=active]:border-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                {counts[s]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_ORDER.map((s) => {
          const list = filterByStatus(s);
          return (
            <TabsContent key={s} value={s} className="mt-4">
              {list.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <FileText className="mb-3 h-10 w-10 text-slate-300" />
                    <h3 className="font-semibold text-slate-900">
                      {s === 'ALL' ? 'No applications yet' : `No ${s.toLowerCase()} applications`}
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      {s === 'ALL'
                        ? 'Head to the marketplace to discover and apply for verified internships across Cameroon.'
                        : 'Check back as recruiters review your profile and update your status.'}
                    </p>
                    {s === 'ALL' && (
                      <Link href="/internships" className="mt-5">
                        <Button className="bg-blue-600 hover:bg-blue-700">Find opportunities</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {list.map((app) => (
                    <Card key={app.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {app.opportunity?.field && (
                                <Badge variant="secondary" className="text-[11px]">
                                  {app.opportunity.field.name}
                                </Badge>
                              )}
                              {app.opportunity?.workMode && (
                                <Badge variant="outline" className="text-[11px]">
                                  {String(app.opportunity.workMode).replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                            <h3 className="mt-3 text-base font-bold text-slate-900 leading-tight">
                              <Link
                                href={`/internships/${app.opportunity?.slug || ''}`}
                                className="hover:text-blue-700 line-clamp-2"
                              >
                                {app.opportunity?.title || 'Untitled opportunity'}
                              </Link>
                            </h3>
                            <p className="mt-1 truncate text-sm text-slate-600 flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              {app.opportunity?.organization?.name || 'Organization'}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                              statusStyles[app.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {statusIcon(app.status)}
                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <span className="font-medium text-slate-700 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Submitted
                            </span>
                            <div className="mt-0.5">{new Date(app.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <span className="font-medium text-slate-700 flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> Duration
                            </span>
                            <div className="mt-0.5">{app.opportunity?.durationMonths || 6} months</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-xs text-slate-500">
                            Deadline: {app.opportunity?.deadline
                              ? new Date(app.opportunity.deadline).toLocaleDateString()
                              : 'Rolling'}
                          </span>
                          <Link
                            href={`/internships/${app.opportunity?.slug || ''}`}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View posting →
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
