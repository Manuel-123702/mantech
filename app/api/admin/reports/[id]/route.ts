import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { requireAdminUser } from '@/lib/admin-dashboard';
import { updateReportStatus } from '@/lib/moderation-reports';
import { normalizeReportDetails } from '@/lib/report-reasons';

const schema = z.object({
  action: z.enum(['start_review', 'action', 'dismiss']),
  resolution: z.string().max(2000).optional(),
});

const STATUS_BY_ACTION = {
  start_review: 'REVIEWING',
  action: 'ACTIONED',
  dismiss: 'DISMISSED',
} as const;

/**
 * Lets an admin work the moderation-report queue: pick a report up
 * (start_review), mark it actioned (action) or dismiss it (dismiss).
 * The moderation itself (suspending an opportunity etc.) happens through the
 * existing moderation tools — this endpoint only tracks the case state.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const updated = await updateReportStatus({
      id: report.id,
      status: STATUS_BY_ACTION[body.action],
      resolution: normalizeReportDetails(body.resolution),
      reviewerId: admin.id,
    });

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: `REPORT_${body.action.toUpperCase()}`,
      entityType: 'Report',
      entityId: report.id,
      details: {
        status: updated.status,
        targetType: report.targetType,
        targetId: report.targetId,
        reason: report.reason,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}