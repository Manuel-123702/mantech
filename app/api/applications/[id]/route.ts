import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApplicationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { redactPrivateInternData } from '@/lib/privacy';
import { inviteSuccessStory } from '@/lib/success-stories';

const PIPELINE: ApplicationStatus[] = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'PLACEMENT_PENDING',
  'PLACED',
  'INTERNSHIP_ACTIVE',
  'COMPLETED',
  'REJECTED',
  'WITHDRAWN',
  'ARCHIVED',
  'CANCELLED',
  'DRAFT',
];

const patchSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW',
    'SELECTED',
    'PLACEMENT_PENDING',
    'PLACED',
    'INTERNSHIP_ACTIVE',
    'COMPLETED',
    'REJECTED',
    'WITHDRAWN',
    'ARCHIVED',
    'CANCELLED',
    'DRAFT',
  ]).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  candidateRating: z.number().int().min(1).max(5).optional(),
  rejectionReason: z.string().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        internProfile: {
          include: {
            user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
            passport: true,
            fieldOfStudy: true,
            specialization: true,
            region: true,
            skills: { include: { skill: true } },
            cvFiles: { select: { id: true, fileName: true }, orderBy: { uploadedAt: 'desc' }, take: 1 },
          },
        },
        opportunity: true,
        interviews: { orderBy: { scheduledAt: 'desc' } },
        placement: { include: { onboardingItems: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!application || application.opportunity.organizationId !== organization.id) {
      throw new AuthError(404, 'Application not found');
    }

    return NextResponse.json({ application: redactPrivateInternData(application) });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const body = patchSchema.parse(await request.json());
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        opportunity: { include: { organization: { select: { name: true } } } },
        internProfile: { include: { user: true } },
      },
    });

    if (!application || application.opportunity.organizationId !== organization.id) {
      throw new AuthError(404, 'Application not found');
    }

    if (body.status && !PIPELINE.includes(body.status)) {
      throw new AuthError(400, 'Unsupported status');
    }

    const nextStatus = body.status ?? application.status;
    const statusChanged = nextStatus !== application.status;
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: nextStatus,
        internalNotes: body.internalNotes ?? application.internalNotes,
        candidateRating: body.candidateRating ?? application.candidateRating,
        rejectionReason: body.rejectionReason,
        statusHistory: statusChanged ? {
          create: {
            status: nextStatus,
            note: body.notes,
            actorName: user.fullName,
          },
        } : undefined,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: statusChanged ? 'UPDATE_APPLICATION_STATUS' : 'UPDATE_APPLICATION_DETAILS',
      entityType: 'Application',
      entityId: updated.id,
      details: { status: body.status },
      request,
    });

    if (statusChanged && body.status) {
      await notifyUser({
        userId: application.internProfile.userId,
        title: 'Application status updated',
        message: `Your application for ${application.opportunity.title} is now ${body.status.replaceAll('_', ' ').toLowerCase()}.`,
        category: 'application',
        link: '/dashboard/intern',
        whatsApp: {
          opportunityTitle: application.opportunity.title,
          companyName: application.opportunity.organization?.name ?? 'the company',
          newStatus: body.status,
          note: body.notes ?? null,
          applicationId: application.id,
        },
      });

      // A finished internship is the perfect moment to ask for a success
      // story — invite the intern to /testimonials (never auto-post).
      if (body.status === 'COMPLETED') {
        await inviteSuccessStory({
          userId: application.internProfile.userId,
          email: application.internProfile.user.email,
          organizationName: application.opportunity.organization?.name ?? 'your host organization',
          internshipTitle: application.opportunity.title,
        });
      }
    }

    return NextResponse.json({ application: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
