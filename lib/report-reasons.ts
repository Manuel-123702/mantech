/**
 * MANTECH Nexus — moderation-report primitives (pure, import-free).
 *
 * Signed-in members flag opportunities / passports they believe are scammy,
 * misleading or inappropriate. Admins review the queue (dashboard/admin/
 * reports) and act through the existing moderation tools or dismiss.
 *
 * These constants + guards carry no Prisma import so tests and client
 * components (components/shared/report-button.tsx) can share one source of
 * truth with the API routes. DB access for reports lives in lib/moderation-
 * reports.ts; the deprecated academic-reports API (app/api/reports) is a
 * deliberate 410 and is not related to this feature.
 */

export const REPORT_TARGET_TYPES = ['OPPORTUNITY', 'PASSPORT'] as const;
export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

export function isReportTargetType(value: unknown): value is ReportTargetType {
  return (
    typeof value === 'string' && (REPORT_TARGET_TYPES as readonly string[]).includes(value)
  );
}

export const REPORT_TARGET_LABELS: Record<ReportTargetType, string> = {
  OPPORTUNITY: 'Internship posting',
  PASSPORT: 'Intern passport',
};

export const REPORT_REASONS = [
  'SCAM',
  'MISLEADING',
  'SPAM',
  'INAPPROPRIATE',
  'OTHER',
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export function isReportReason(value: unknown): value is ReportReason {
  return typeof value === 'string' && (REPORT_REASONS as readonly string[]).includes(value);
}

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SCAM: 'Scam / asks for money',
  MISLEADING: 'Misleading description',
  SPAM: 'Spam or duplicate',
  INAPPROPRIATE: 'Inappropriate content',
  OTHER: 'Something else',
};

/** Short helper text shown under the reason select in the report dialog. */
export const REPORT_REASON_HINTS: Record<ReportReason, string> = {
  SCAM: 'Fake opening, requests payment, or phishing for personal data.',
  MISLEADING: 'The description does not match the real role or conditions.',
  SPAM: 'Duplicate posting or low-effort content.',
  INAPPROPRIATE: 'Offensive, discriminatory or unsafe content.',
  OTHER: 'Anything else — please describe the issue below.',
};

export const REPORT_STATUSES = [
  'OPEN',
  'REVIEWING',
  'ACTIONED',
  'DISMISSED',
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export function isReportStatus(value: unknown): value is ReportStatus {
  return typeof value === 'string' && (REPORT_STATUSES as readonly string[]).includes(value);
}

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: 'Open',
  REVIEWING: 'Reviewing',
  ACTIONED: 'Actioned',
  DISMISSED: 'Dismissed',
};

export const REPORT_DETAILS_MAX = 1000;

/**
 * Sanitizes reporter free-text: trims, collapses to the cap, and turns an
 * empty/whitespace-only string into null so the column stays NULLable-clean.
 */
export function normalizeReportDetails(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  return trimmed.length > REPORT_DETAILS_MAX ? trimmed.slice(0, REPORT_DETAILS_MAX) : trimmed;
}

/** True when the reason is OTHER and no details were supplied (invalid submit). */
export function reportNeedsDetails(reason: unknown, details: unknown): boolean {
  if (reason !== 'OTHER') return false;
  return normalizeReportDetails(details) === null;
}