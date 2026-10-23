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
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Intern Dashboard</h1>
            <p className="text-slate-600">
              Track your internship applications, build your profile, and get
              matched with verified opportunities in Cameroon.
            </p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                What you can do here
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Browse internships & jobs
                    </p>
                    <p className="text-xs text-slate-500">
                      Discover verified opportunities from companies and
                      universities across Cameroon.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50">
                  <Award className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Build your profile & passport
                    </p>
                    <p className="text-xs text-slate-500">
                      Showcase your skills, education, and availability to
                      recruiters.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Track your applications
                    </p>
                    <p className="text-xs text-slate-500">
                      Follow your journey from submitted to selected — all in
                      one place.
                    </p>
                  </div>
                </div>
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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {profile.user.fullName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track your applications, interviews and progress on MANTECH.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                <stat.icon className={`h-5 w-5 ${stat.tone}`} aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(upcomingInterviews.length > 0 ||
        inProgress.length > 0 ||
        todo.length > 0 ||
        unreadCount > 0) && (
          <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Next actions
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {upcomingInterviews.slice(0, 2).map((interview) => (
                  <li key={interview.id} className="flex flex-wrap items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    <span className="font-medium text-slate-900">Interview</span>
                    <span className="text-slate-600">
                      {interview.application?.opportunity?.title ?? 'Unknown opportunity'} ·{' '}
                      {interview.application?.opportunity?.organization?.name ?? 'Unknown organization'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(interview.scheduledAt).toLocaleString()}
                    </span>
                  </li>
                ))}
                {inProgress.length > 0 && (
                  <li className="flex flex-wrap items-center gap-2">
                    <Award className="h-4 w-4 text-amber-600" aria-hidden="true" />
                    <span className="font-medium text-slate-900">
                      {inProgress.length} application{inProgress.length === 1 ? '' : 's'} in progress
                    </span>
                    <span className="text-slate-600">
                      {inProgress.map((a) => statusLabel(a.status)).join(', ')}
                    </span>
                  </li>
                )}
                {todo.length > 0 && (
                  <li className="flex flex-wrap items-center gap-2">
                    <Circle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                    <span className="font-medium text-slate-900">Strengthen your profile</span>
                    <span className="text-slate-600">
                      {todo.length} item{todo.length === 1 ? '' : 's'} missing
                    </span>
                  </li>
                )}
                {unreadCount > 0 && (
                  <li className="flex flex-wrap items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    <span className="font-medium text-slate-900">
                      {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                    </span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Profile readiness</h2>
              <Badge
                className={
                  computedReadiness === 100
                    ? 'bg-emerald-600'
                    : 'bg-amber-100 text-amber-700'
                }
              >
                {computedReadiness}% complete
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              A complete profile gets shortlisted faster. Select an item to fix it.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {checklist.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-2 rounded-lg border border-slate-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    {item.done ? (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
                    )}
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-medium ${item.done ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}
                      >
                        {item.label}
                      </span>
                      <span className="block text-xs text-slate-500">{item.detail}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-slate-900">Application pipeline</h2>
            {applications.length === 0 ? (
              <div className="mt-6 text-center">
                <Briefcase className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-sm text-slate-600">No applications yet.</p>
                <Link href="/internships" className="mt-3 inline-block">
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    Browse internships
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {PIPELINE_STAGES.map((stage) => (
                  <li key={stage} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{statusLabel(stage)}</span>
                    <span className="font-semibold text-slate-900">
                      {reachedStage(statuses, stage)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      {recommended.length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Recommended for you
              </h2>
              <Link
                href="/internships"
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                Browse all internships
              </Link>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Ranked by how well each live opening matches your skills, field and location.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recommended.map(({ opportunity, score, reasons }) => {
                const color =
                  score >= 70
                    ? 'bg-emerald-100 text-emerald-700'
                    : score >= 45
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600';
                return (
                  <li key={opportunity.id}>
                    <Link
                      href={`/internships/${opportunity.slug}`}
                      className="flex h-full flex-col rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {opportunity.title}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${color}`}
                        >
                          {score}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {opportunity.organization.name} · {opportunity.city}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {matchLabel(score)}
                        {reasons.length > 0 ? ` · ${reasons.slice(0, 2).join(' · ')}` : ''}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Recent applications</h2>
            <Link
              href="/dashboard/intern/applications"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-600">
                You have not applied to any internship yet.
              </p>
              <Link href="/internships" className="mt-3 inline-block">
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Browse opportunities
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {applications.slice(0, 5).map((application) => (
                <li
                  key={application.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {application.opportunity?.title ?? application.job?.title ?? 'Application'}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {application.opportunity?.organization.name ?? application.job?.organization.name ?? ''}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(application.status)}`}
                  >
                    {statusLabel(application.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-start gap-3">
            <HistoryIcon className="mt-0.5 h-5 w-5 text-blue-600" aria-hidden="true" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">Your journey</h2>
              <p className="mt-0.5 text-sm text-slate-600">
                {history.length} milestone{history.length === 1 ? '' : 's'} recorded from your
                real activity on MANTECH.
              </p>
            </div>
          </div>
          <Link href="/dashboard/intern/history">
            <Button variant="outline" size="sm">
              View full journey
              <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-start gap-3">
            <UserPlus className="mt-0.5 h-5 w-5 text-blue-600" aria-hidden="true" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">Invite friends</h2>
              <p className="mt-0.5 text-sm text-slate-600">
                Your code{' '}
                <span className="font-mono font-semibold text-slate-900">{referralStats.code}</span>
                {' — '}
                {referralStats.invited} joined
                {referralStats.qualified > 0
                  ? `, ${referralStats.qualified} completed onboarding`
                  : ''}
                .
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
