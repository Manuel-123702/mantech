import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { jsonError, requireOrganizationContext } from '@/lib/authz';
import { APP_CONFIG } from '@/lib/config';

const schema = z.object({
  packageCode: z.enum(['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE']),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { user, organization } = await requireOrganizationContext({ requireOrg: true });
    if (!organization) {
      return NextResponse.json({ error: 'Organization profile required' }, { status: 400 });
    }

    const body = schema.parse(await request.json());
    const pkg = await prisma.package.findUnique({ where: { code: body.packageCode } });
    if (!pkg) {
      return NextResponse.json({ error: 'Package is not available yet. Contact MANTECH on WhatsApp.' }, { status: 404 });
    }

    const subscription = await prisma.organizationSubscription.create({
      data: {
        organizationId: organization.id,
        packageId: pkg.id,
        status: 'PENDING_PAYMENT',
        paymentMethod: 'WHATSAPP_MANUAL',
        notes: body.notes,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'REQUEST_PACKAGE_UPGRADE',
      entityType: 'OrganizationSubscription',
      entityId: subscription.id,
      details: { packageCode: body.packageCode },
      request,
    });

    const message = encodeURIComponent(
      `Hello MANTECH Nexus, ${organization.name} would like to upgrade to the ${pkg.name} package (${pkg.priceXAF} XAF). Subscription request: ${subscription.id}`
    );

    return NextResponse.json({
      subscription,
      whatsappUrl: `${APP_CONFIG.contacts.whatsappLink}?text=${message}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
