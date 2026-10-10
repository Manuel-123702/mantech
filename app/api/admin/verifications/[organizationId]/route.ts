import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  action: z.enum(['approve', 'reject', 'suspend']),
  note: z.string().max(2000).optional(),
});

const STATUS_BY_ACTION = {
  approve: 'VERIFIED',
  reject: 'REJECTED',
  suspend: 'SUSPENDED',
} as const;

const AUDIT_BY_ACTION = {
  approve: 'ORGANIZATION_VERIFIED',
  reject: 'ORGANIZATION_REJECTED',
  suspend: 'ORGANIZATION_SUSPENDED',
} as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const admin = await requireAdminUser();
    const { organizationId } = await params;
    const body = schema.parse(await request.json());

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { members: true },
    });
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const nextStatus = STATUS_BY_ACTION[body.action];

    await prisma.$transaction([
      prisma.organization.update({
        where: { id: organization.id },
        data: {
          verificationStatus: nextStatus,
          verifiedAt: body.action === 'approve' ? new Date() : organization.verifiedAt,
        },
      }),
      prisma.verification.create({
        data: {
          organizationId: organization.id,
          status: nextStatus,
          reviewerNote: body.note,
          reviewedAt: new Date(),
        },
      }),
    ]);

    const dashboardPath =
      organization.type === 'UNIVERSITY' ? '/dashboard/university' : '/dashboard/company';
    const titles = {
      approve: 'Organization verified',
      reject: 'Verification rejected',
      suspend: 'Organization suspended',
    } as const;
    const messages = {
      approve: `${organization.name} is now verified. Full recruiter and discovery features are unlocked.`,
      reject: `${organization.name} verification was rejected.${body.note ? ` Reviewer note: ${body.note}` : ''}`,
      suspend: `${organization.name} has been suspended.${body.note ? ` Reason: ${body.note}` : ''}`,
    } as const;

    await Promise.all(
      organization.members.map((member) =>
        notifyUser({
          userId: member.userId,
          title: titles[body.action],
          message: messages[body.action],
          category: 'system',
          link: dashboardPath,
        })
      )
    );

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: AUDIT_BY_ACTION[body.action],
      entityType: 'Organization',
      entityId: organization.id,
      details: { from: organization.verificationStatus, to: nextStatus, note: body.note },
      request,
    });

    return NextResponse.json({ organizationId: organization.id, verificationStatus: nextStatus });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
