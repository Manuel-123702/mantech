import { requireUser } from '@/lib/authz';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Building2, Calendar, Clock, CheckCircle2, XCircle, Search, FileText, ArrowRight } from 'lucide-react';

const STATUS_ORDER = ['ALL', 'SUBMITTED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'] as const;

const statusStyles: Record<string, string> = {
  SUBMITTED: 'bg-slate-800 text-slate-200 border-slate-600',
  SHORTLISTED: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
  INTERVIEW: 'bg-blue-950/70 text-blue-300 border-blue-500/40',
  SELECTED: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
  REJECTED: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
};

function statusIcon(status: string) {
  if (status === 'SELECTED') return <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />;
  if (status === 'INTERVIEW') return <Clock className="h-3.5 w-3.5 shrink-0" />;
  if (status === 'REJECTED') return <XCircle className="h-3.5 w-3.5 shrink-0" />;
  return <Briefcase className="h-3.5 w-3.5 shrink-0" />;
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
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">My Applications</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 break-words">
            Track every application from submission through interview to final selection.
          </p>
        </div>
        <Link href="/internships" className="shrink-0">
          <Button className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-xl text-xs font-bold shadow-md">
            <Search className="mr-2 h-4 w-4" />
            Browse Opportunities
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATUS_ORDER.map((s) => (
          <div
            key={s}
            className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-3.5 sm:p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 break-words">
              {s === 'ALL' ? 'Total' : s.charAt(0) + s.slice(1).toLowerCase()}
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-extrabold text-white">{counts[s]}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="ALL">
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0 justify-start">
          {STATUS_ORDER.map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              className="rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white data-[state=active]:border-blue-500 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
            >
              <span>{s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}</span>
              <span className="ml-1.5 rounded-full bg-slate-950/50 px-1.5 py-0.5 text-[10px] text-slate-200">
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
                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 flex flex-col items-center py-14 px-4 text-center">
                  <FileText className="mb-3 h-10 w-10 text-slate-500" />
                  <h3 className="font-semibold text-white">
                    {s === 'ALL' ? 'No applications yet' : `No ${s.toLowerCase()} applications`}
                  </h3>
                  <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-400">
                    {s === 'ALL'
                      ? 'Head to the marketplace to discover and apply for verified internships & jobs across Cameroon.'
                      : 'Check back as recruiters review your profile and update your status.'}
                  </p>
                  {s === 'ALL' && (
                    <Link href="/internships" className="mt-5">
                      <Button className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-xl text-xs font-bold">
                        Find Opportunities
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {list.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 sm:p-5 hover:border-blue-500/40 transition-all"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {app.opportunity?.field && (
                              <Badge className="bg-blue-950/70 text-blue-300 border border-blue-500/30 text-[11px]">
                                {app.opportunity.field.name}
                              </Badge>
                            )}
                            {app.opportunity?.workMode && (
                              <Badge className="bg-slate-800 text-slate-300 border border-slate-600 text-[11px]">
                                {String(app.opportunity.workMode).replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <h3 className="mt-3 text-base font-bold text-white leading-snug break-words">
                            <Link
                              href={`/internships/${app.opportunity?.slug || ''}`}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {app.opportunity?.title || 'Untitled opportunity'}
                            </Link>
                          </h3>
                          <p className="mt-1 text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 break-words">
                            <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>{app.opportunity?.organization?.name || 'Organization'}</span>
                          </p>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            statusStyles[app.status] || 'bg-slate-800 text-slate-200 border-slate-600'
                          }`}
                        >
                          {statusIcon(app.status)}
                          {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 px-3 py-2">
                          <span className="font-medium text-slate-400 flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3 w-3 shrink-0" /> Submitted
                          </span>
                          <div className="mt-0.5 font-semibold text-white">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 px-3 py-2">
                          <span className="font-medium text-slate-400 flex items-center gap-1 text-[11px]">
                            <Briefcase className="h-3 w-3 shrink-0" /> Duration
                          </span>
                          <div className="mt-0.5 font-semibold text-white">
                            {app.opportunity?.durationMonths || 6} months
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                        <span className="text-xs text-slate-400">
                          Deadline:{' '}
                          {app.opportunity?.deadline
                            ? new Date(app.opportunity.deadline).toLocaleDateString()
                            : 'Rolling'}
                        </span>
                        <Link
                          href={`/internships/${app.opportunity?.slug || ''}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>View posting</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
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
