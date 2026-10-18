import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { inviteSuccessStory } from '@/lib/success-stories';

const patchSchema = z.object({
  department: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  objectives: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const placement = await prisma.placement.findUnique({
      where: { id },
      include: {
        internProfile: { include: { user: { select: { id: true, email: true } } } },
        application: { include: { opportunity: true, job: true } },
      },
    });
    if (!placement || placement.organizationId !== organization.id) {
      throw new AuthError(404, 'Placement not found');
    }

    const body = patchSchema.parse(await request.json());
    const updated = await prisma.placement.update({
      where: { id },
      data: {
        department: body.department,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        objectives: body.objectives,
        status: body.status,
      },
    });

    if (body.status === 'ACTIVE') {
      await prisma.application.update({
        where: { id: placement.applicationId },
        data: {
          status: 'INTERNSHIP_ACTIVE',
          statusHistory: {
            create: { status: 'INTERNSHIP_ACTIVE', note: 'Placement activated', actorName: user.fullName },
          },
        },
      });
    }
    if (body.status === 'COMPLETED') {
      if (!placement.application || (!placement.application.opportunity && !placement.application.job)) {
        throw new AuthError(404, 'Application not found');
      }
      await prisma.application.update({
        where: { id: placement.applicationId },
        data: {
          status: 'COMPLETED',
          statusHistory: {
            create: { status: 'COMPLETED', note: 'Placement completed', actorName: user.fullName },
          },
        },
      });
      // Invite the intern to tell their story on /testimonials — consent
      // based, never auto-posted, and at most once per person.
      await inviteSuccessStory({
        userId: placement.internProfile.userId,
        email: placement.internProfile.user.email,
        organizationName: organization.name,
        internshipTitle: placement.application.opportunity?.title ?? placement.application.job?.title ?? 'Placement',
      });
    }

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'UPDATE_PLACEMENT',
      entityType: 'Placement',
      entityId: updated.id,
      details: { status: updated.status },
      request,
    });

    if (body.status) {
      await notifyUser({
        userId: placement.internProfile.userId,
        title: 'Placement status updated',
        message: `Your placement at ${organization.name} is now ${body.status.toLowerCase()}.`,
        category: 'placement',
        link: '/dashboard/intern',
      });
    }

    return NextResponse.json({ placement: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
