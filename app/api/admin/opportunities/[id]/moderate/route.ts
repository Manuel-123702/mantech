import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  action: z.enum(['approve', 'publish', 'reject', 'suspend', 'restore', 'archive']),
  reason: z.string().max(2000).optional(),
});

const STATUS_BY_ACTION = {
  approve: 'APPROVED',
  publish: 'PUBLISHED',
  reject: 'REJECTED',
  suspend: 'SUSPENDED',
  restore: 'PENDING_REVIEW',
  archive: 'ARCHIVED',
} as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const opportunity = await prisma.internshipOpportunity.findUnique({
      where: { id },
      include: { organization: { include: { members: true } } },
    });
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const nextStatus = STATUS_BY_ACTION[body.action];
    const updated = await prisma.internshipOpportunity.update({
      where: { id: opportunity.id },
      data: {
        moderationStatus: nextStatus,
        moderatedAt: new Date(),
        rejectionReason: body.action === 'reject' ? body.reason : body.action === 'approve' || body.action === 'publish' ? null : undefined,
      },
    });

    const dashboardPath =
      opportunity.organization.type === 'UNIVERSITY'
        ? '/dashboard/university/opportunities-recruiter'
        : '/dashboard/company/opportunities';
    await Promise.all(
      opportunity.organization.members.map((member) =>
        notifyUser({
          userId: member.userId,
          title: `Opportunity ${nextStatus.toLowerCase().replace('_', ' ')}`,
          message: `"${opportunity.title}" is now ${nextStatus.replace('_', ' ').toLowerCase()}.${body.reason ? ` Reason: ${body.reason}` : ''}`,
          category: 'system',
          link: dashboardPath,
        })
      )
    );

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: 'OPPORTUNITY_MODERATED',
      entityType: 'InternshipOpportunity',
      entityId: opportunity.id,
      details: { action: body.action, from: opportunity.moderationStatus, to: nextStatus, reason: body.reason },
      request,
    });

    return NextResponse.json({ opportunity: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
