/**
 * MANTECH Nexus — moderation-report helpers (DB-aware).
 *
 * fileReport() validates the target exists, blocks self-reports, snapshots
 * the target title (so the admin queue still makes sense if the content is
 * later deleted) and enforces one report per member per target via the
 * (reporterId, targetType, targetId) unique key.
 *
 * updateReportStatus() lets an admin pick a report up, mark it actioned or
 * dismiss it. Callers write the audit entry (see the admin reports route).
 */

import { prisma } from '@/lib/prisma';
import { isUniqueConstraintViolation } from '@/lib/authz-policy';
import {
  normalizeReportDetails,
  type ReportReason,
  type ReportStatus,
  type ReportTargetType,
} from '@/lib/report-reasons';

export type FileReportInput = {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  details?: unknown;
};

export type FileReportResult =
  | { ok: true; id: string }
  | { ok: false; code: 'TARGET_NOT_FOUND' | 'SELF_REPORT' | 'DUPLICATE' };

export async function fileReport(input: FileReportInput): Promise<FileReportResult> {
  const details = normalizeReportDetails(input.details);

  let targetTitle: string;
  if (input.targetType === 'OPPORTUNITY') {
    const opportunity = await prisma.internshipOpportunity.findUnique({
      where: { id: input.targetId },
      select: {
        id: true,
        title: true,
        organization: { select: { members: { select: { userId: true } } } },
      },
    });
    if (!opportunity) return { ok: false, code: 'TARGET_NOT_FOUND' };
    const isOwnOrg = opportunity.organization?.members.some(
      (member) => member.userId === input.reporterId,
    );
    if (isOwnOrg) return { ok: false, code: 'SELF_REPORT' };
    targetTitle = opportunity.title;
  } else {
    const profile = await prisma.internProfile.findUnique({
      where: { id: input.targetId },
      select: { id: true, userId: true, user: { select: { fullName: true } } },
    });
    if (!profile) return { ok: false, code: 'TARGET_NOT_FOUND' };
    if (profile.userId === input.reporterId) return { ok: false, code: 'SELF_REPORT' };
    targetTitle = profile.user.fullName;
  }

  try {
    const created = await prisma.report.create({
      data: {
        reporterId: input.reporterId,
        targetType: input.targetType,
        targetId: input.targetId,
        targetTitle,
        reason: input.reason,
        details,
      },
      select: { id: true },
    });
    return { ok: true, id: created.id };
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      // (reporterId, targetType, targetId) already has a case — treat a
      // repeat submission as a harmless no-op instead of an error page.
      return { ok: false, code: 'DUPLICATE' };
    }
    throw error;
  }
}

export type UpdateReportInput = {
  id: string;
  status: Extract<ReportStatus, 'REVIEWING' | 'ACTIONED' | 'DISMISSED'>;
  resolution?: string | null;
  reviewerId: string;
};

export async function updateReportStatus(input: UpdateReportInput) {
  return prisma.report.update({
    where: { id: input.id },
    data: {
      status: input.status,
      resolution: input.resolution?.trim() ? input.resolution.trim() : undefined,
      reviewedAt: new Date(),
      reviewedById: input.reviewerId,
    },
    select: { id: true, status: true },
  });
}