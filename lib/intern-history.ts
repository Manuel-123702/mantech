/**
 * Intern History — the intern's journey through MANTECH (SRS §13).
 *
 * The journey is *derived*, never stored as a parallel list of events: every
 * entry below is projected from records the intern actually owns
 * (Application, ApplicationStatusHistory, Interview, Placement,
 * PassportAchievement). That keeps the timeline honest — an intern can never
 * display an achievement with no backing row — and satisfies the SRS §5 rule
 * against hardcoded business data.
 *
 * This module deliberately imports nothing from Prisma so it can be unit tested
 * with `node --test` without a database connection.
 */

/**
 * Tone drives the visual treatment of a timeline entry.
 * - `milestone` positive, career-defining (placed, achievement).
 * - `progress` forward motion (shortlisted, interview scheduled).
 * - `neutral` routine activity (application submitted, CV uploaded).
 * - `closed` terminal negative outcome (rejected, withdrawn).
 */
export type HistoryTone = 'milestone' | 'progress' | 'neutral' | 'closed';

export type HistoryCategory =
  | 'registration'
  | 'application'
  | 'status'
  | 'interview'
  | 'placement'
  | 'achievement';

export type HistoryEntry = {
  /** Stable key for React lists and sorting: `${category}:${sourceId}`. */
  id: string;
  category: HistoryCategory;
  tone: HistoryTone;
  title: string;
  description: string;
  /** Organization involved, when the event is tied to one. */
  organization: string | null;
  /** ISO date used for both sorting and rendering. */
  occurredAt: string;
  /** Where the intern can go to act on this event. */
  href: string | null;
};

// ---------------------------------------------------------------------------
// Input shapes — structural subsets of the Prisma rows we depend on.
// ---------------------------------------------------------------------------

export type HistoryApplication = {
  id: string;
  status: string;
  createdAt: Date;
  opportunity: { title: string; organization: { name: string } } | null;
  job?: { title: string; organization: { name: string } } | null;
  statusHistory?: { id: string; status: string; createdAt: Date }[];
  interviews?: { id: string; scheduledAt: Date; status: string; type: string }[];
  placement?: {
    id: string;
    status: string;
    startDate: Date;
    endDate: Date;
    department: string | null;
  } | null;
};

export type HistoryAchievement = {
  id: string;
  title: string;
  category: string;
  issuer: string;
  issueDate: Date;
  description: string | null;
};

export type InternHistoryInput = {
  applications: HistoryApplication[];
  achievements: HistoryAchievement[];
  /** Creation date of the intern profile — the first milestone of the journey. */
  profileCreatedAt: Date;
  hasPassport: boolean;
  hasCv: boolean;
  passportNumber: string | null;
};
/** Statuses that are genuinely positive outcomes. */
const MILESTONE_STATUSES = new Set([
  'SELECTED',
  'PLACED',
  'INTERNSHIP_ACTIVE',
  'COMPLETED',
]);

/** Terminal negative statuses — rendered as `closed` rather than progress. */
const CLOSED_STATUSES = new Set(['REJECTED', 'WITHDRAWN', 'CANCELLED', 'ARCHIVED']);

/** Forward-motion statuses. */
const PROGRESS_STATUSES = new Set(['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW']);

/** Human labels for `ApplicationStatus` enum values. */
const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft saved',
  SUBMITTED: 'Application submitted',
  UNDER_REVIEW: 'Application under review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview stage',
  SELECTED: 'Selected',
  PLACEMENT_PENDING: 'Placement pending',
  PLACED: 'Placed',
  INTERNSHIP_ACTIVE: 'Internship active',
  COMPLETED: 'Internship completed',
  REJECTED: 'Application closed',
  WITHDRAWN: 'Application withdrawn',
  ARCHIVED: 'Application archived',
  CANCELLED: 'Application cancelled',
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status.replace(/_/g, ' ').toLowerCase();
}

function toneForStatus(status: string): HistoryTone {
  if (MILESTONE_STATUSES.has(status)) return 'milestone';
  if (CLOSED_STATUSES.has(status)) return 'closed';
  if (PROGRESS_STATUSES.has(status)) return 'progress';
  return 'neutral';
}

function toIso(date: Date): string {
  return date.toISOString();
}

/** Rough month count between two dates, never below 1. */
function formatMonths(start: Date, end: Date): string {
  const months = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
  );
  return `${months} month${months === 1 ? '' : 's'}`;
}

/**
 * Build the intern's history, newest first.
 *
 * Ordering is by `occurredAt` descending with a stable tie-break on `id`, so
 * the same database always renders in the same order (no hydration mismatch).
 */
export function buildInternHistory(input: InternHistoryInput): HistoryEntry[] {
  const entries: HistoryEntry[] = [];

  // Journey origin — always present, so the timeline is never empty for a
  // registered intern even before they apply anywhere.
  entries.push({
    id: 'registration:profile',
    category: 'registration',
    tone: 'milestone',
    title: 'Joined MANTECH',
    description: 'Intern profile created',
    organization: null,
    occurredAt: toIso(input.profileCreatedAt),
    href: '/dashboard/intern/settings',
  });

  if (input.hasPassport) {
    entries.push({
      id: 'registration:passport',
      category: 'registration',
      tone: 'milestone',
      title: 'Intern Passport issued',
      description: input.passportNumber
        ? `Passport ${input.passportNumber} created and visible to verified organizations`
        : 'Professional passport created and visible to verified organizations',
      organization: null,
      occurredAt: toIso(input.profileCreatedAt),
      href: '/dashboard/intern/passport',
    });
  }

  if (input.hasCv) {
    entries.push({
      id: 'registration:cv',
      category: 'registration',
      tone: 'neutral',
      title: 'CV uploaded',
      description: 'Stored securely and shared only with authorized recruiters',
      organization: null,
      occurredAt: toIso(input.profileCreatedAt),
      href: '/dashboard/intern/passport',
    });
  }

  for (const app of input.applications) {
    const orgName = app.opportunity?.organization.name ?? app.job?.organization.name ?? 'MANTECH partner';
    const opportunityTitle = app.opportunity?.title ?? app.job?.title ?? 'Placement application';

    entries.push({
      id: `application:${app.id}`,
      category: 'application',
      tone: toneForStatus(app.status),
      title: `Applied to ${opportunityTitle}`,
      description: `Application submitted to ${orgName}`,
      organization: orgName,
      occurredAt: toIso(app.createdAt),
      href: '/dashboard/intern/applications',
    });

    for (const history of app.statusHistory ?? []) {
      // The initial submission is already represented by the entry above.
      if (history.status === 'SUBMITTED' || history.status === 'DRAFT') continue;
      entries.push({
        id: `status:${history.id}`,
        category: 'status',
        tone: toneForStatus(history.status),
        title: statusLabel(history.status),
        description: `${opportunityTitle} · ${orgName}`,
        organization: orgName,
        occurredAt: toIso(history.createdAt),
        href: '/dashboard/intern/applications',
      });
    }

    for (const interview of app.interviews ?? []) {
      const cancelled = interview.status === 'cancelled';
      entries.push({
        id: `interview:${interview.id}`,
        category: 'interview',
        tone: cancelled ? 'closed' : 'progress',
        title: cancelled ? 'Interview cancelled' : 'Interview scheduled',
        description: `${opportunityTitle} · ${orgName} · ${interview.type}`,
        organization: orgName,
        occurredAt: toIso(interview.scheduledAt),
        href: '/dashboard/intern/applications',
      });
    }

    const placement = app.placement;
    if (placement) {
      entries.push({
        id: `placement:${placement.id}`,
        category: 'placement',
        tone: 'milestone',
        title: 'Placement confirmed',
        description: [
          `${opportunityTitle} · ${orgName}`,
          placement.department ? `Department: ${placement.department}` : null,
          `${formatMonths(placement.startDate, placement.endDate)} placement`,
        ]
          .filter(Boolean)
          .join(' · '),
        organization: orgName,
        occurredAt: toIso(placement.startDate),
        href: '/dashboard/intern/applications',
      });
    }
  }

  for (const achievement of input.achievements) {
    entries.push({
      id: `achievement:${achievement.id}`,
      category: 'achievement',
      tone: 'milestone',
      title: achievement.title,
      description: [
        achievement.issuer ? `Issued by ${achievement.issuer}` : null,
        achievement.description,
      ]
        .filter(Boolean)
        .join(' · '),
      organization: null,
      occurredAt: toIso(achievement.issueDate),
      href: '/dashboard/intern/passport',
    });
  }

  return entries.sort((a, b) => {
    const delta = Date.parse(b.occurredAt) - Date.parse(a.occurredAt);
    if (delta !== 0) return delta;
    return a.id.localeCompare(b.id);
  });
}

/**
 * Counts used by the dashboard overview and the history summary header.
 * Derived from the same entries so the numbers can never drift from the list.
 */
export function summarizeHistory(entries: HistoryEntry[]) {
  const summary = {
    total: entries.length,
    applications: 0,
    interviews: 0,
    placements: 0,
    achievements: 0,
  };

  for (const entry of entries) {
    switch (entry.category) {
      case 'application':
        summary.applications += 1;
        break;
      case 'interview':
        if (entry.tone !== 'closed') summary.interviews += 1;
        break;
      case 'placement':
        summary.placements += 1;
        break;
      case 'achievement':
        summary.achievements += 1;
        break;
      default:
        break;
    }
  }

  return summary;
}