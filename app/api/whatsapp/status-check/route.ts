import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { formatStatusQueryWhatsAppResponse, createWhatsAppDeepLink } from '@/lib/whatsapp-notifications';
import { APP_CONFIG } from '@/lib/config';

const querySchema = z.object({
  query: z.string().min(3).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const rawQuery = request.nextUrl.searchParams.get('q') || request.nextUrl.searchParams.get('ref') || '';
    const parsed = querySchema.safeParse({ query: rawQuery.trim() });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid Application ID (e.g. UUID or 8-character prefix) or registered phone number.' },
        { status: 400 },
      );
    }

    const search = parsed.data.query;
    const cleanDigits = search.replace(/\D/g, '');

    // Search by Application ID (exact or prefix) or candidate Phone Number
    const application = await prisma.application.findFirst({
      where: {
        OR: [
          { id: search },
          { id: { startsWith: search.toLowerCase() } },
          ...(cleanDigits.length >= 8
            ? [
                { internProfile: { phone: { contains: cleanDigits.slice(-8) } } },
                { internProfile: { user: { phone: { contains: cleanDigits.slice(-8) } } } },
              ]
            : []),
        ],
      },
      include: {
        internProfile: {
          include: {
            user: { select: { fullName: true, phone: true } },
          },
        },
        opportunity: {
          include: {
            organization: { select: { name: true, slug: true, phone: true } },
          },
        },
        interviews: {
          where: { status: 'scheduled' },
          orderBy: { scheduledAt: 'asc' },
          take: 1,
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          found: false,
          message: `No application matching reference "${search}" was found. Please check your Application ID in your dashboard or contact our WhatsApp Concierge.`,
          conciergeLink: `https://wa.me/${APP_CONFIG.contacts.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello MANTECH Nexus, I need help checking the status of my application: ${search}`)}`,
        },
        { status: 404 },
      );
    }

    const nextInterview = application.interviews[0] || null;
    const candidateName = application.internProfile.user.fullName;
    const opportunityTitle = application.opportunity.title;
    const companyName = application.opportunity.organization.name;

    const formattedWhatsAppReply = formatStatusQueryWhatsAppResponse({
      candidateName,
      opportunityTitle,
      companyName,
      status: application.status,
      updatedAt: application.updatedAt,
      applicationId: application.id,
      hasInterview: Boolean(nextInterview),
      interviewDate: nextInterview?.scheduledAt,
      interviewLink: nextInterview?.meetingLink,
    });

    // wa.me deep link allowing candidate to send inquiry directly to official concierge
    const conciergeWhatsAppLink = createWhatsAppDeepLink(
      APP_CONFIG.contacts.whatsapp,
      `STATUS ${application.id.slice(0, 8).toUpperCase()}`,
    );

    return NextResponse.json({
      found: true,
      application: {
        id: application.id,
        ref: application.id.slice(0, 8).toUpperCase(),
        status: application.status,
        candidateName,
        opportunityTitle,
        companyName,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        interview: nextInterview
          ? {
              scheduledAt: nextInterview.scheduledAt,
              type: nextInterview.type,
              meetingLink: nextInterview.meetingLink,
              durationMinutes: nextInterview.durationMinutes,
            }
          : null,
      },
      whatsAppFormattedSummary: formattedWhatsAppReply,
      conciergeWhatsAppLink,
    });
  } catch (error) {
    console.error('WhatsApp status check failed:', error);
    return NextResponse.json({ error: 'Internal server error processing status check.' }, { status: 500 });
  }
}
