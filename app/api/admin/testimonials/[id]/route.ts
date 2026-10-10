import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  action: z.enum(['approve', 'reject', 'reset']),
  reason: z.string().max(2000).optional(),
});

const STATUS_BY_ACTION = {
  approve: 'APPROVED',
  reject: 'REJECTED',
  reset: 'PENDING',
} as const;

/** Lets an admin decide whether a visitor's experience appears on the page. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated = await prisma.testimonial.update({
      where: { id: testimonial.id },
      data: {
        status: STATUS_BY_ACTION[body.action],
        reviewedAt: new Date(),
      },
      select: { id: true, status: true },
    });

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: `TESTIMONIAL_${body.action.toUpperCase()}`,
      entityType: 'Testimonial',
      entityId: testimonial.id,
      details: { status: updated.status, reason: body.reason ?? null },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}