import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  featured: z.boolean(),
  days: z.number().int().min(1).max(365).optional(),
  priorityOrder: z.number().int().min(1).max(100).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const opportunity = await prisma.internshipOpportunity.findUnique({ where: { id } });
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    if (body.featured) {
      const endsAt = new Date(Date.now() + (body.days ?? 30) * 24 * 60 * 60 * 1000);
      await prisma.$transaction([
        prisma.internshipOpportunity.update({
          where: { id: opportunity.id },
          data: { isFeatured: true },
        }),
        prisma.featuredOpportunity.upsert({
          where: { opportunityId: opportunity.id },
          create: {
            opportunityId: opportunity.id,
            startsAt: new Date(),
            endsAt,
            priorityOrder: body.priorityOrder ?? 1,
            isActive: true,
          },
          update: {
            startsAt: new Date(),
            endsAt,
            priorityOrder: body.priorityOrder ?? 1,
            isActive: true,
          },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.internshipOpportunity.update({
          where: { id: opportunity.id },
          data: { isFeatured: false },
        }),
        prisma.featuredOpportunity.updateMany({
          where: { opportunityId: opportunity.id },
          data: { isActive: false },
        }),
      ]);
    }

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: body.featured ? 'OPPORTUNITY_FEATURED' : 'OPPORTUNITY_UNFEATURED',
      entityType: 'InternshipOpportunity',
      entityId: opportunity.id,
      details: { days: body.days, priorityOrder: body.priorityOrder },
      request,
    });

    return NextResponse.json({ opportunityId: opportunity.id, isFeatured: body.featured });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
