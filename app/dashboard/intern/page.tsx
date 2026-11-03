import Link from 'next/link';
import {
  Briefcase,
  Search,
  Eye,
  Award,
  ChevronRight,
  CheckCircle2,
  Circle,
  History as HistoryIcon,
  Bell,
  CalendarClock,
  Sparkles,
  UserPlus,
  MessageCircle,
  LayoutDashboard,
} from 'lucide-react';

import { syncDbUser } from '@/lib/authz';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/shared/share-button';
import { waReferralLink } from '@/lib/whatsapp';
import { getReferralStats } from '@/lib/referrals';
import { buildReadinessChecklist, readinessPercent, nextActions } from '@/lib/readiness';
import { loadInternHistory } from '@/lib/intern-history-data';
import { statusLabel } from '@/lib/intern-history';
import { calculateMatch, matchLabel, type MatchProfile } from '@/lib/matching';

export const metadata = {
  title: 'Intern Dashboard | MANTECH Nexus',
  robots: { index: false, follow: false },
};

/** Statuses that mean the intern should expect contact from a recruiter. */
const ACTIONABLE_STATUSES = ['SHORTLISTED', 'INTERVIEW', 'SELECTED'];

const PIPELINE_STAGES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
] as const;

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'SELECTED':
    case 'PLACED':
    case 'INTERNSHIP_ACTIVE':
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-700';
    case 'INTERVIEW':
      return 'bg-blue-100 text-blue-700';
    case 'SHORTLISTED':
    case 'UNDER_REVIEW':
      return 'bg-amber-100 text-amber-700';
    case 'REJECTED':
    case 'WITHDRAWN':
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

/** Applications that reached `stage`, counting those who moved past it. */
function reachedStage(statuses: string[], stage: string): number {
  const target = PIPELINE_STAGES.indexOf(stage as (typeof PIPELINE_STAGES)[number]);
  return statuses.filter((status) => {
    const index = PIPELINE_STAGES.indexOf(status as (typeof PIPELINE_STAGES)[number]);
    if (index === -1) return false;
    return index >= target;
  }).length;
}

export default async function InternDashboardPage() {
  const user = await syncDbUser();

  // Public preview: unauthenticated visitors can view the dashboard page
  // without a hard 401 wall. They see a feature overview + CTAs to sign in.
  if (!user) {
    return (
      <div className="py-10 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 mb-4 shadow-lg shadow-blue-900/30">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 font-heading">Intern Career Workspace</h1>
            <p className="text-slate-300 text-sm">
              Track your internship applications, build your profile, and get
              matched with verified opportunities in Cameroon.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              What you can do here
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <Briefcase className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Browse internships &amp; jobs
                  </p>
                  <p className="text-xs text-slate-300">
                    Discover verified opportunities from companies and
                    universities across Cameroon.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Build your profile &amp; passport
                  </p>
                  <p className="text-xs text-slate-300">
                    Showcase your skills, education, and availability to
                    recruiters.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Track your applications
                  </p>
                  <p className="text-xs text-slate-300">
                    Follow your journey from submitted to selected — all in
                    one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800">
              <Link href="/sign-in" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-600/25">
                  Sign In to Your Workspace
                </Button>
              </Link>
              <Link href="/register/intern" className="flex-1">
                <Button variant="outline" className="w-full border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 h-11 rounded-xl">
                  Register as Candidate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-4">
                  Sign in to unlock your personal dashboard and start applying.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-in">
                    <Button className="flex-1">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register/intern">
                    <Button
                      variant="outline"
                      className="flex-1"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const profile = await prisma.internProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      phone: true,
      qualification: true,
      fieldOfStudyId: true,
      city: true,
      regionId: true,
      availability: true,
      cvUrl: true,
      profileCompleted: true,
      user: { select: { fullName: true, avatarUrl: true } },
      passport: { select: { viewCount: true, summary: true, headline: true } },
      skills: { select: { id: true }, take: 1 },
      educations: { select: { id: true }, take: 1 },
      applications: {
        select: {
          id: true,
          status: true,
          opportunityId: true,
          opportunity: {
            select: { title: true, organization: { select: { name: true } } },
          },
          job: {
            select: { title: true, organization: { select: { name: true } } },
          },
          interviews: { select: { id: true, scheduledAt: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const [savedCount, unreadCount] = await Promise.all([
    prisma.savedOpportunity.count({ where: { userId: user.id } }),
    prisma.notification.count({ where: { userId: user.id, isRead: false } }),
  ]);

  // PLACEHOLDER_BODY

  // Everyone must finish signing up before they can use the intern area.
  if (!profile || !profile.profileCompleted) {
    // A member without an intern profile (an admin, company or university
    // account browsing this workspace) cannot register as an intern, so the
    // normal "Complete Registration" call-to-action would be a dead end for
    // them. Show a neutral notice instead.
    if (user.role !== 'INTERN') {
      return (
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Briefcase className="h-8 w-8 text-slate-400" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">No Intern Profile on This Account</h1>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              This workspace shows applications, saved internships and readiness for
              an intern profile. Your account does not have one yet, so there is
              nothing to display here.
            </p>
            <Link href="/dashboard" className="mt-6">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Back to Your Dashboards
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardContent className="flex flex-col items-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Award className="h-8 w-8 text-blue-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Intern Profile</h1>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Your phone number, diploma and CV are required before you can apply to
            internships and appear in Intern Passport search.
          </p>
          <Link href="/register/intern" className="mt-6">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Complete Registration
              <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Every number below comes from the real saved records — nothing is made up.
  const applications = profile.applications;
  const checklist = buildReadinessChecklist({
    hasCv: Boolean(profile.cvUrl),
    hasPhoto: Boolean(profile.user.avatarUrl),
    hasPhone: Boolean(profile.phone),
    hasQualification: Boolean(profile.qualification),
    hasField: Boolean(profile.fieldOfStudyId),
    hasSkills: profile.skills.length > 0,
    hasEducation: profile.educations.length > 0,
    hasLocation: Boolean(profile.regionId && profile.city),
    hasAvailability: Boolean(profile.availability),
    // The Passport headline doubles as the professional summary (SRS §7), so
    // either one satisfies this item. Derived from real saved data — never
    // hardcoded — so finishing registration with a headline reaches 100%.
    hasSummary: Boolean(profile.passport?.summary || profile.passport?.headline),
  });
  const computedReadiness = readinessPercent(checklist);
  const todo = nextActions(checklist);
  const statuses = applications.map((application) => application.status);

  const upcomingInterviews = applications
    .flatMap((application) =>
      application.interviews
        .filter((interview) => interview.status === 'scheduled')
        .map((interview) => ({ ...interview, application })),
    )
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

  const inProgress = applications.filter((application) =>
    ACTIONABLE_STATUSES.includes(application.status),
  );

  const history = await loadInternHistory(user.id);

  // Growth loop: the intern's personal referral code + live counters.
  const referralStats = await getReferralStats(user.id);

  // ───── RANKED RECOMMENDATIONS ─────
  // "Recommended for you" — scored with the same matching engine that powers
  // the Best-match sort on /internships. Only live (PUBLISHED, non-expired)
  // openings the intern has NOT already applied to are considered.
  const matchSource = await prisma.internProfile.findUnique({
    where: { userId: user.id },
    select: {
      city: true,
      preferredWorkMode: true,
      fieldOfStudy: { select: { name: true, slug: true } },
      region: { select: { name: true } },
      skills: { select: { skill: { select: { name: true } } } },
    },
  });
  const matchProfile: MatchProfile = {
    skills: matchSource?.skills.map((entry) => entry.skill.name) ?? [],
    fieldSlug: matchSource?.fieldOfStudy?.slug ?? null,
    fieldName: matchSource?.fieldOfStudy?.name ?? null,
    city: matchSource?.city ?? null,
    regionName: matchSource?.region?.name ?? null,
    preferredWorkMode: matchSource?.preferredWorkMode ?? null,
    wantsPaid: null,
  };
  const appliedOpportunityIds = profile.applications
    .map((application) => application.opportunityId)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
  const openOpportunities = await prisma.internshipOpportunity.findMany({
    where: {
      moderationStatus: 'PUBLISHED',
      deadline: { gte: new Date() },
      id: { notIn: appliedOpportunityIds },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      workMode: true,
      isPaid: true,
      requiredSkills: true,
      preferredSkills: true,
      field: { select: { name: true, slug: true } },
      region: { select: { name: true } },
      organization: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 60,
  });
  const recommended = openOpportunities
    .map((opportunity) => ({
      opportunity,
      ...calculateMatch(matchProfile, {
        requiredSkills: opportunity.requiredSkills,
        preferredSkills: opportunity.preferredSkills,
        fieldSlug: opportunity.field?.slug ?? null,
        fieldName: opportunity.field?.name ?? null,
        city: opportunity.city,
        regionName: opportunity.region?.name ?? null,
        workMode: opportunity.workMode,
        isPaid: opportunity.isPaid,
      }),
    }))
    .filter((entry) => entry.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const stats = [
    { label: 'Applications', value: String(applications.length), icon: Briefcase, tone: 'text-blue-600' },
    { label: 'Saved', value: String(savedCount), icon: Search, tone: 'text-emerald-600' },
    { label: 'Passport views', value: String(profile.passport?.viewCount ?? 0), icon: Eye, tone: 'text-amber-600' },
    { label: 'Profile readiness', value: `${computedReadiness}%`, icon: Award, tone: 'text-violet-600' },
  ];

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Welcome back, {profile.user.fullName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Track your applications, interviews and progress across Cameroon.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl p-5 shadow-xl hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-white font-heading">{stat.value}</span>
              <stat.icon className={`h-6 w-6 ${stat.tone}`} aria-hidden="true" />
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {(upcomingInterviews.length > 0 ||
        inProgress.length > 0 ||
        todo.length > 0 ||
        unreadCount > 0) && (
          <div className="rounded-3xl border border-blue-500/30 bg-blue-950/40 backdrop-blur-xl p-6 shadow-xl text-white">
            <h2 className="flex items-center gap-2 text-base font-bold text-blue-300 font-heading">
              <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
              Next actions
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {upcomingInterviews.slice(0, 2).map((interview) => (
                <li key={interview.id} className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60">
                  <CalendarClock className="h-4 w-4 text-blue-400" aria-hidden="true" />
                  <span className="font-bold text-white">Interview:</span>
                  <span className="text-slate-200">
                    {interview.application?.opportunity?.title ?? 'Unknown opportunity'} ·{' '}
                    {interview.application?.opportunity?.organization?.name ?? 'Unknown organization'}
                  </span>
                  <span className="text-xs text-blue-300 font-mono ml-auto">
                    {new Date(interview.scheduledAt).toLocaleString()}
                  </span>
                </li>
              ))}
              {inProgress.length > 0 && (
                <li className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60">
                  <Award className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <span className="font-bold text-white">
                    {inProgress.length} application{inProgress.length === 1 ? '' : 's'} in progress:
                  </span>
                  <span className="text-slate-300">
                    {inProgress.map((a) => statusLabel(a.status)).join(', ')}
                  </span>
                </li>
              )}
              {todo.length > 0 && (
                <li className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60">
                  <Circle className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <span className="font-bold text-white">Strengthen your profile:</span>
                  <span className="text-slate-300">
                    {todo.length} checklist item{todo.length === 1 ? '' : 's'} to improve readiness
                  </span>
                </li>
              )}
              {unreadCount > 0 && (
                <li className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60">
                  <Bell className="h-4 w-4 text-blue-400" aria-hidden="true" />
                  <span className="font-bold text-white">
                    {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl p-6 shadow-xl lg:col-span-2 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-white font-heading">Profile readiness</h2>
            <Badge
              className={
                computedReadiness === 100
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold'
              }
            >
              {computedReadiness}% complete
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            A complete profile gets shortlisted faster. Select an item to fix it.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 p-3 transition-colors hover:border-blue-400 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {item.done ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span
                      className={`block text-xs font-semibold ${item.done ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                    >
                      {item.label}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">{item.detail}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl p-6 shadow-xl text-white">
          <h2 className="text-base font-bold text-white font-heading">Application pipeline</h2>
          {applications.length === 0 ? (
            <div className="mt-6 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
              <p className="mt-3 text-xs text-slate-400">No applications yet.</p>
              <Link href="/internships" className="mt-4 inline-block">
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs">
                  Browse internships
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {PIPELINE_STAGES.map((stage) => (
                <li key={stage} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-300 font-medium">{statusLabel(stage)}</span>
                  <span className="font-extrabold text-white font-mono">
                    {reachedStage(statuses, stage)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {recommended.length > 0 && (
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl p-6 shadow-xl text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-base font-bold text-white font-heading">
              <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
              Recommended for you
            </h2>
            <Link
              href="/internships"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Browse all internships →
            </Link>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Ranked by how well each live opening matches your skills, field and location.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {recommended.map(({ opportunity, score, reasons }) => {
              const color =
                score >= 70
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : score >= 45
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700';
              return (
                <li key={opportunity.id}>
                  <Link
                    href={`/internships/${opportunity.slug}`}
                    className="flex h-full flex-col rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 transition-all hover:border-blue-400 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-white line-clamp-1">
                        {opportunity.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${color}`}
                      >
                        {score}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {opportunity.organization.name} · {opportunity.city}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {matchLabel(score)}
                      {reasons.length > 0 ? ` · ${reasons.slice(0, 2).join(' · ')}` : ''}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl shadow-xl overflow-hidden text-white">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-base font-bold text-white font-heading">Recent applications</h2>
          <Link
            href="/dashboard/intern/applications"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        {applications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
            <p className="mt-3 text-xs text-slate-400">
              You have not applied to any internship yet.
            </p>
            <Link href="/internships" className="mt-4 inline-block">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs">
                Browse opportunities
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {applications.slice(0, 5).map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {application.opportunity?.title ?? application.job?.title ?? 'Application'}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {application.opportunity?.organization.name ?? application.job?.organization.name ?? ''}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(application.status)}`}
                >
                  {statusLabel(application.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl p-6 shadow-xl text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <HistoryIcon className="mt-0.5 h-5 w-5 text-blue-400" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold text-white font-heading">Your journey</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {history.length} milestone{history.length === 1 ? '' : 's'} recorded from your
              real activity on MANTECH.
            </p>
          </div>
        </div>
        <Link href="/dashboard/intern/history">
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 rounded-xl text-xs">
            View full journey
            <ChevronRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/85 backdrop-blur-xl p-6 shadow-xl text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <UserPlus className="mt-0.5 h-5 w-5 text-blue-400" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold text-white font-heading">Invite friends</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Your code{' '}
              <span className="font-mono font-bold text-amber-300">{referralStats.code}</span>
              {' — '}
              {referralStats.invited} joined
              {referralStats.qualified > 0
                ? `, ${referralStats.qualified} completed onboarding`
                : ''}
              .
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <ShareButton
            path={`/sign-up?ref=${referralStats.code}`}
            title="Join me on MANTECH Nexus"
            text="Create your free account and discover verified internships in Cameroon."
            label="Copy invite link"
          />
          <a
            href={waReferralLink(referralStats.code)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-900/60"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
            Share on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
