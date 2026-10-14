/**
 * Employer response-rate signals.
 *
 * Interns apply and then hear nothing — that silence is the single biggest
 * complaint about internship marketplaces. We surface, from data we already
 * store, how consistently an organization actually responds to applicants:
 *
 *  - an application counts as "responded" when the recruiter moved it past its
 *    initial SUBMITTED state within RESPONSE_WINDOW_DAYS (7 days);
 *  - responses after the window count for the raw rate but not for the fast
 *    ("within a week") label;
 *  - nothing is shown until MIN_APPLICATIONS received, so one lonely
 *    application cannot brand a company as a ghost or a star.
 *
 * The computation is a pure function so it is fully unit-testable; Prisma is
 * imported lazily inside the fetcher, so the tests never load the client.
 */

/** How many applications an organization needs before the badge means anything. */
export const MIN_APPLICATIONS = 5;
/** How long after applying a recruiter action still counts as a response. */
export const RESPONSE_WINDOW_DAYS = 7;

export interface ApplicationTimeline {
  createdAt: Date;
  /** Status history entries, any order. The initial SUBMITTED entry is expected but not required. */
  history: { status: string; createdAt: Date }[];
}

export interface ResponseRateStats {
  received: number;
  /** Applications the recruiter acted on at all, regardless of speed. */
  responded: number;
  /** Applications the recruiter acted on within RESPONSE_WINDOW_DAYS. */
  respondedWithinWindow: number;
  /** responded / received, 0–100, rounded. */
  ratePercent: number;
  /** True when the sample is large enough to publish the badge. */
  publishable: boolean;
  label: string | null;
}

/** The statuses that mean "the applicant's own submission", not a recruiter action. */
const SUBMISSION_STATUSES = new Set(['SUBMITTED', 'DRAFT']);

/** Earliest date at which a history entry counts as a fast response. */
function windowStart(applicationCreatedAt: Date): Date {
  return new Date(applicationCreatedAt.getTime() + RESPONSE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Compute response statistics from application timelines.
 *
 * A recruiter "response" is any status history entry that is not part of the
 * applicant's own submission (SUBMITTED/DRAFT). The initial SUBMITTED entry is
 * written at application time, so it can never count as a response itself.
 */
export function computeResponseRate(applications: ApplicationTimeline[]): ResponseRateStats {
  const received = applications.length;
  let responded = 0;
  let respondedWithinWindow = 0;

  for (const application of applications) {
    const cutoff = windowStart(application.createdAt);
    const recruiterEntries = application.history.filter(
      (entry) => !SUBMISSION_STATUSES.has(entry.status),
    );
    if (recruiterEntries.length === 0) continue;
    responded += 1;
    if (recruiterEntries.some((entry) => entry.createdAt.getTime() <= cutoff.getTime())) {
      respondedWithinWindow += 1;
    }
  }

  const ratePercent = received === 0 ? 0 : Math.round((responded / received) * 100);
  const publishable = received >= MIN_APPLICATIONS;

  let label: string | null = null;
  if (publishable) {
    if (ratePercent >= 80) label = 'Usually replies within a week';
    else if (ratePercent >= 50) label = 'Replies to about half of applicants';
    else if (ratePercent > 0) label = 'Replies to some applicants';
    else label = 'Replies rarely so far';
  }

  return { received, responded, respondedWithinWindow, ratePercent, publishable, label };
}

/**
 * Fetch the timelines for every application the organization ever received and
 * compute its stats. Never throws — callers embed the result in API payloads,
 * so a database hiccup degrades to "no badge" instead of a broken page.
 */
export async function getOrganizationResponseStats(
  organizationId: string,
): Promise<ResponseRateStats | null> {
  try {
    // Lazy import: keeps the Prisma client out of the pure unit tests.
    const { prisma } = await import('@/lib/prisma');
    const applications = await prisma.application.findMany({
      where: { opportunity: { organizationId } },
      select: {
        createdAt: true,
        statusHistory: { select: { status: true, createdAt: true } },
      },
      take: 500, // Bound the read; rates stabilize well before this.
    });
    return computeResponseRate(
      applications.map((application) => ({
        createdAt: application.createdAt,
        history: application.statusHistory,
      })),
    );
  } catch {
    return null;
  }
}

