import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { syncDbUser } from '@/lib/authz';
import { writeAudit } from '@/lib/audit';

const boostSchema = z.object({
  days: z.number().int().min(1).max(90).default(7),
  paymentMethod: z.enum(['MOMO', 'ORANGE_MONEY', 'PROMO']).default('PROMO'),
  payerPhone: z.string().optional(),
  note: z.string().max(500).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = boostSchema.parse(await request.json().catch(() => ({})));

    const job = await prisma.job.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const user = await syncDbUser();

    // Mark job as featured/boosted
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        isFeatured: true,
      },
      include: {
        organization: true,
        region: true,
        field: true,
      },
    });

    // Notify administrators
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: `🚀 Job Boost Activated: ${job.title}`,
            message: `Boosted for ${body.days} days via ${body.paymentMethod}. Payer: ${body.payerPhone || 'Direct promo'}.`,
            category: 'boost',
            link: `/jobs/${job.slug || job.id}`,
          },
        });
      }
    } catch (notifyErr) {
      console.warn('[jobs-boost] Admin notification skipped:', notifyErr);
    }

    if (user) {
      await writeAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'BOOST_JOB',
        entityType: 'Job',
        entityId: job.id,
        details: { days: body.days, paymentMethod: body.paymentMethod, payerPhone: body.payerPhone },
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Job boosted successfully for ${body.days} days!`,
      job: updatedJob,
    });
  } catch (error) {
    console.error('Job boost error:', error);
    return NextResponse.json({ error: 'Failed to activate boost' }, { status: 500 });
  }
}
