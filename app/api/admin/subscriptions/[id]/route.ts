import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  action: z.enum(['activate', 'cancel']),
  transactionRef: z.string().max(200).optional(),
  days: z.number().int().min(1).max(730).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const subscription = await prisma.organizationSubscription.findUnique({
      where: { id },
      include: { package: true, organization: { include: { members: true } } },
    });
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    const dashboardPath =
      subscription.organization.type === 'UNIVERSITY'
        ? '/dashboard/university/billing'
        : '/dashboard/company/billing';

    if (body.action === 'activate') {
      const activatedAt = new Date();
      const expiresAt = new Date(activatedAt.getTime() + (body.days ?? 30) * 24 * 60 * 60 * 1000);

      await prisma.$transaction([
        prisma.organizationSubscription.updateMany({
          where: { organizationId: subscription.organizationId, id: { not: subscription.id }, status: 'ACTIVE' },
          data: { status: 'EXPIRED' },
        }),
        prisma.organizationSubscription.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            activatedAt,
            expiresAt,
            transactionRef: body.transactionRef,
          },
        }),
        prisma.organization.update({
          where: { id: subscription.organizationId },
          data: { packageCode: subscription.package.code },
        }),
      ]);

      await Promise.all(
        subscription.organization.members.map((member) =>
          notifyUser({
            userId: member.userId,
            title: `${subscription.package.name} activated`,
            message: `Your ${subscription.package.name} package is active until ${expiresAt.toDateString()}. All package limits are now in effect.`,
            category: 'system',
            link: dashboardPath,
          })
        )
      );

      await writeAudit({
        actorId: admin.id,
        actorRole: admin.role,
        action: 'PACKAGE_ACTIVATED',
        entityType: 'OrganizationSubscription',
        entityId: subscription.id,
        details: {
          packageCode: subscription.package.code,
          organizationId: subscription.organizationId,
          transactionRef: body.transactionRef,
          expiresAt,
        },
        request,
      });

      return NextResponse.json({ subscriptionId: subscription.id, status: 'ACTIVE', expiresAt });
    }

    await prisma.$transaction([
      prisma.organizationSubscription.update({
        where: { id: subscription.id },
        data: { status: 'CANCELLED' },
      }),
      prisma.organization.update({
        where: { id: subscription.organizationId },
        data:
          subscription.organization.packageCode === subscription.package.code
            ? { packageCode: 'FREE' }
            : {},
      }),
    ]);

    await Promise.all(
      subscription.organization.members.map((member) =>
        notifyUser({
          userId: member.userId,
          title: 'Package request cancelled',
          message: `The ${subscription.package.name} request was cancelled. Contact MANTECH on WhatsApp for assistance.`,
          category: 'system',
          link: dashboardPath,
        })
      )
    );

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: 'PACKAGE_CANCELLED',
      entityType: 'OrganizationSubscription',
      entityId: subscription.id,
      details: { packageCode: subscription.package.code, organizationId: subscription.organizationId },
      request,
    });

    return NextResponse.json({ subscriptionId: subscription.id, status: 'CANCELLED' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
