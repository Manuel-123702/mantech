import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { redactPrivateInternData } from '@/lib/privacy';
import {
  dispatchWhatsAppNotification,
  formatInterviewWhatsAppAlert,
} from '@/lib/whatsapp-notifications';

const createSchema = z.object({
  applicationId: z.string(),
  scheduledAt: z.string(),
  durationMinutes: z.number().min(15).max(240).optional(),
  type: z.enum(['online', 'onsite', 'phone']).optional(),
  meetingLink: z.string().url().optional().or(z.literal('')),
  locationAddress: z.string().optional(),
  interviewerName: z.string().optional(),
  instructions: z.string().optional(),
});

export async function GET() {
  try {
    const { organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const interviews = await prisma.interview.findMany({
      where: { application: { opportunity: { organizationId: organization.id } } },
      include: {
        application: {
          include: {
            internProfile: { include: { user: { select: { fullName: true, email: true } } } },
            opportunity: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return NextResponse.json({ interviews: redactPrivateInternData(interviews) });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: Request) {
  try {
    const { user, organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const body = createSchema.parse(await request.json());
    const application = await prisma.application.findUnique({
      where: { id: body.applicationId },
      include: {
        opportunity: { include: { organization: { select: { name: true } } } },
        internProfile: { include: { user: true } },
      },
    });
    if (!application || application.opportunity.organizationId !== organization.id) {
      throw new AuthError(404, 'Application not found');
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId: application.id,
        scheduledAt: new Date(body.scheduledAt),
        durationMinutes: body.durationMinutes || 45,
        type: body.type || 'online',
        meetingLink: body.meetingLink || null,
        locationAddress: body.locationAddress,
        interviewerName: body.interviewerName || user.fullName,
        instructions: body.instructions,
        status: 'scheduled',
      },
    });

    await prisma.application.update({
      where: { id: application.id },
      data: {
        status: 'INTERVIEW',
        statusHistory: {
          create: {
            status: 'INTERVIEW',
            note: `Interview scheduled for ${new Date(body.scheduledAt).toLocaleString()}`,
            actorName: user.fullName,
          },
        },
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'SCHEDULE_INTERVIEW',
      entityType: 'Interview',
      entityId: interview.id,
      request,
    });

    // ── In-app + email notification ────────────────────────────────────────────
    await notifyUser({
      userId: application.internProfile.userId,
      title: 'Interview scheduled',
      message: `An interview was scheduled for ${application.opportunity.title}.`,
      category: 'interview',
      link: '/dashboard/intern',
    });

    // ── WhatsApp interview alert (fire-and-forget) ─────────────────────────────
    const internPhone = application.internProfile.phone;
    if (internPhone) {
      const companyName = application.opportunity.organization?.name ?? 'the company';
      const waText = formatInterviewWhatsAppAlert({
        candidateName: application.internProfile.user.fullName,
        opportunityTitle: application.opportunity.title,
        companyName,
        scheduledAt: body.scheduledAt,
        durationMinutes: body.durationMinutes || 45,
        type: body.type || 'online',
        meetingLink: body.meetingLink || null,
        locationAddress: body.locationAddress || null,
        interviewerName: body.interviewerName || user.fullName,
        applicationId: application.id,
      });

      dispatchWhatsAppNotification({
        phone: internPhone,
        text: waText,
        eventType: 'INTERVIEW_SCHEDULED',
        applicationId: application.id,
      }).catch((err) => {
        console.warn('[WhatsApp] Interview alert dispatch failed (non-fatal):', err);
      });
    }

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
