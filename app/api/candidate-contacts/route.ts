import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { jsonError, requireVerifiedOrganization } from '@/lib/authz';

const contactSchema = z.object({
  internProfileId: z.string(),
  message: z.string().min(10),
  requestedPhoneAccess: z.boolean().optional(),
  requestedCvAccess: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const { user, organization } = await requireVerifiedOrganization();
    if (!organization) {
      return NextResponse.json({ error: 'Organization profile required' }, { status: 400 });
    }

    const body = contactSchema.parse(await request.json());
    const intern = await prisma.internProfile.findUnique({
      where: { id: body.internProfileId },
      include: { user: true },
    });
    if (!intern || !intern.profileCompleted) {
      return NextResponse.json({ error: 'Intern not found' }, { status: 404 });
    }
    if (!intern.isCvSearchable) {
      const hasApplication = await prisma.application.findFirst({
        where: {
          internProfileId: intern.id,
          opportunity: { organizationId: organization.id },
        },
        select: { id: true },
      });
      if (!hasApplication) {
        return NextResponse.json({ error: 'Intern Passport is not available for discovery' }, { status: 404 });
      }
    }

    const contact = await prisma.candidateContact.create({
      data: {
        organizationId: organization.id,
        internProfileId: intern.id,
        message: body.message,
        requestedPhoneAccess: body.requestedPhoneAccess || false,
        requestedCvAccess: body.requestedCvAccess ?? true,
        status: 'pending',
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'CANDIDATE_CONTACT_REQUEST',
      entityType: 'CandidateContact',
      entityId: contact.id,
      request,
    });

    await notifyUser({
      userId: intern.userId,
      title: 'A company contacted you',
      message: `${organization.name} sent a recruitment message through MANTECH.`,
      category: 'contact',
      link: '/dashboard/intern',
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
