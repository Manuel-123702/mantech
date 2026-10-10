import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ArrowLeft, Briefcase, CheckCircle2, Clock, Filter, Search, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

const STATUS_ORDER = ['ALL', 'SUBMITTED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'] as const;
type StatusFilter = (typeof STATUS_ORDER)[number];

const statusStyles: Record<string, string> = {
  SUBMITTED: 'bg-slate-100 text-slate-700 border-slate-200',
  SHORTLISTED: 'bg-amber-100 text-amber-700 border-amber-200',
  INTERVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
  SELECTED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
};

type AppRow = {
  id: string;
  status: string;
  createdAt: Date;
  opportunity: {
    id: string;
    slug: string;
    title: string;
    workMode?: string | null;
    city?: string | null;
    durationMonths?: number | null;
    deadline?: Date | null;
    field?: { name: string } | null;
    organization: { name: string; slug?: string | null };
  };
  isExample?: boolean;
};

async function getApplications(): Promise<{ userSignedIn: boolean; items: AppRow[] }> {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    // Option A: visitors who are not signed in see the sign-in call to
    // action — never fabricated "example" application rows.
    return { userSignedIn: false, items: [] };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        internProfile: {
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
        },
      },
    });

    if (!user || !user.internProfile) return { userSignedIn: true, items: [] };
    const apps = user.internProfile.applications || [];

    const items: AppRow[] = apps.map((a: any) => ({
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
      opportunity: {
        id: a.opportunity.id,
        slug: a.opportunity.slug,
        title: a.opportunity.title,
        workMode: a.opportunity.workMode,
        city: a.opportunity.city,
        durationMonths: a.opportunity.durationMonths,
        deadline: a.opportunity.deadline,
        field: a.opportunity.field ? { name: a.opportunity.field.name } : null,
        organization: a.opportunity.organization
          ? { name: a.opportunity.organization.name, slug: a.opportunity.organization.slug }
          : { name: 'Organization', slug: null },
      },
    }));

    return { userSignedIn: true, items };
  } catch (err) {
    logDatabaseUnavailable('applications/page', err);
    // Option A: an unreachable DB yields an empty list, never demo rows.
    return { userSignedIn: true, items: [] };
  }
}

function statusIcon(status: string) {
  if (status === 'SELECTED') return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === 'INTERVIEW') return <Clock className="h-3.5 w-3.5" />;
  if (status === 'REJECTED') return <XCircle className="h-3.5 w-3.5" />;
  return <Briefcase className="h-3.5 w-3.5" />;
}

type PageProps = { searchParams?: Promise<{ status?: string }> };

export const metadata = {
  title: 'My Applications · MANTECH Nexus',
  description: 'Track the status of every internship application you submitted through MANTECH Nexus.',
};

export default async function ApplicationsPage(props: PageProps) {
  const search = await props.searchParams;
  const rawStatus = (search?.status || 'ALL').toUpperCase();
  const activeFilter: StatusFilter = (STATUS_ORDER as readonly string[]).includes(rawStatus)
    ? (rawStatus as StatusFilter)
    : 'ALL';

  const { userSignedIn, items } = await getApplications();
  const filtered = activeFilter === 'ALL' ? items : items.filter((a) => a.status === activeFilter);

  const counts = {
    ALL: items.length,
    SUBMITTED: items.filter((a) => a.status === 'SUBMITTED').length,
    SHORTLISTED: items.filter((a) => a.status === 'SHORTLISTED').length,
    INTERVIEW: items.filter((a) => a.status === 'INTERVIEW').length,
    SELECTED: items.filter((a) => a.status === 'SELECTED').length,
    REJECTED: items.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="app-dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" className="text-indigo-300" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#app-dots)" />
          </svg>
        </div>
        <div className="container-mantech relative px-4 sm:px-6 lg:px-8">
          <Link href="/internships" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Browse opportunities
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-300/10 px-3 py-1 text-xs font-semibold text-indigo-100">
              <Briefcase className="h-3.5 w-3.5" />
              Application Tracker
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">
              {userSignedIn ? 'My Applications' : 'Track Your Applications'}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-200">
              {userSignedIn
                ? `Follow every step of your pipeline — from submission through shortlist, interview, and final selection across ${items.length} tracked application${items.length === 1 ? '' : 's'}.`
                : 'Sign in to MANTECH Nexus to track every submission, receive interview invites, and see your placement status in real time. Shown below are example entries to preview how your pipeline will look.'}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {STATUS_ORDER.map((s) => (
              <div key={s} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs font-medium uppercase tracking-wider text-indigo-200/80">
                  {s === 'ALL' ? 'Total' : s.toLowerCase().charAt(0).toUpperCase() + s.toLowerCase().slice(1)}
                </div>
                <div className="mt-1 text-2xl font-bold">{counts[s]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-mantech space-y-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => {
                const active = activeFilter === s;
                return (
                  <Link
                    key={s}
                    href={s === 'ALL' ? '/applications' : `/applications?status=${s.toLowerCase()}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-700'
                    }`}
                  >
                    {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {counts[s]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!userSignedIn && (
              <Link href="/sign-in">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Sign in to view yours <Search className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {!userSignedIn && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-200 p-2">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Example entries shown</p>
                  <p className="text-sm text-amber-800/80">
                    Sign in with your MANTECH account to see applications tied to your own Intern Profile.
                  </p>
                </div>
              </div>
              <Link href="/sign-in">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">
              {activeFilter === 'ALL' ? 'No applications yet.' : `No ${activeFilter.toLowerCase()} applications.`}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {activeFilter === 'ALL'
                ? 'Head to the marketplace to discover and apply for internships across Cameroon.'
                : 'Try the All filter or check back as recruiters update your status.'}
            </p>
            <div className="mt-5 justify-center gap-2 sm:flex">
              <Link href="/internships">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Browse internships <Search className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((app) => (
              <article
                key={app.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ${
                  app.isExample ? 'border-indigo-200/60' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {app.opportunity.field && (
                        <Badge variant="secondary" className="text-[11px]">
                          {app.opportunity.field.name}
                        </Badge>
                      )}
                      {app.opportunity.workMode && (
                        <Badge variant="outline" className="text-[11px]">
                          {app.opportunity.workMode.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 leading-tight">
                      <Link
                        href={`/internships/${app.opportunity.slug}`}
                        className="hover:text-indigo-700 line-clamp-2"
                      >
                        {app.opportunity.title}
                      </Link>
                    </h3>
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {app.opportunity.organization.name} · {app.opportunity.city || 'Cameroon'}
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

                <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="font-medium text-slate-700">Submitted</div>
                    <div>{app.createdAt.toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="font-medium text-slate-700">Duration</div>
                    <div>{app.opportunity.durationMonths || 6} months</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    Deadline: {app.opportunity.deadline?.toLocaleDateString() || 'Rolling'}
                  </span>
                  <Link
                    href={`/internships/${app.opportunity.slug}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center"
                  >
                    View posting →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-8 text-white sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,auto] lg:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Ready for your next career step?
              </h2>
              <p className="mt-2 max-w-xl text-indigo-100">
                Discover verified internship openings across Cameroon — from
                agribusiness in the Centre Region to software engineering posts in Douala.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/internships">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                  Browse all internships
                </Button>
              </Link>
              <Link href="/register/intern">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  Create Intern Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
