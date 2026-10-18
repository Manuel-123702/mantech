import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';

const patchSchema = z.object({
  scheduledAt: z.string().optional(),
  durationMinutes: z.number().min(15).max(240).optional(),
  type: z.enum(['online', 'onsite', 'phone']).optional(),
  meetingLink: z.string().url().optional().or(z.literal('')).nullable(),
  locationAddress: z.string().optional(),
  interviewerName: z.string().optional(),
  instructions: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).optional(),
  feedbackNotes: z.string().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            opportunity: true,
            job: true,
            internProfile: true,
          },
        },
      },
    });
    const listingOrgId = interview?.application?.opportunity?.organizationId ?? interview?.application?.job?.organizationId ?? null;
    if (!interview || listingOrgId !== organization.id) {
      throw new AuthError(404, 'Interview not found');
    }

    const body = patchSchema.parse(await request.json());
    const nextStatus = body.scheduledAt && body.status !== 'cancelled' ? 'rescheduled' : body.status;

    const updated = await prisma.interview.update({
      where: { id },
      data: {
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
        durationMinutes: body.durationMinutes,
        type: body.type,
        meetingLink: body.meetingLink === undefined ? undefined : body.meetingLink || null,
        locationAddress: body.locationAddress,
        interviewerName: body.interviewerName,
        instructions: body.instructions,
        status: nextStatus,
        feedbackNotes: body.feedbackNotes,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'UPDATE_INTERVIEW',
      entityType: 'Interview',
      entityId: updated.id,
      details: { status: updated.status },
      request,
    });

    if (nextStatus === 'rescheduled' || nextStatus === 'cancelled') {
      await notifyUser({
        userId: interview.application.internProfile.userId,
        title: nextStatus === 'cancelled' ? 'Interview cancelled' : 'Interview rescheduled',
        message: `Your interview for ${interview.application?.opportunity?.title ?? interview.application?.job?.title ?? 'your application'} was ${nextStatus}.`,
        category: 'interview',
        link: '/dashboard/intern',
      });
    }

    return NextResponse.json({ interview: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
