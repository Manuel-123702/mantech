import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { redactPrivateInternData } from '@/lib/privacy';

const createSchema = z.object({
  applicationId: z.string(),
  department: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  objectives: z.string().optional(),
});

export async function GET() {
  try {
    const { organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const placements = await prisma.placement.findMany({
      where: { organizationId: organization.id },
      include: {
        internProfile: { include: { user: { select: { fullName: true, email: true, avatarUrl: true } } } },
        application: { include: { opportunity: true } },
        onboardingItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ placements: redactPrivateInternData(placements) });
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
      include: { opportunity: true, internProfile: true, placement: true },
    });
    if (!application || application.opportunity.organizationId !== organization.id) {
      throw new AuthError(404, 'Application not found');
    }
    if (application.status !== 'SELECTED' && application.status !== 'PLACEMENT_PENDING') {
      return NextResponse.json({ error: 'Select the intern before creating a placement' }, { status: 400 });
    }
    if (application.placement) {
      return NextResponse.json({ error: 'Placement already exists' }, { status: 400 });
    }

    const placement = await prisma.placement.create({
      data: {
        applicationId: application.id,
        internProfileId: application.internProfileId,
        organizationId: organization.id,
        department: body.department || application.opportunity.department,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        objectives: body.objectives,
        status: 'PENDING',
        onboardingItems: {
          create: [
            { title: 'Welcome briefing', description: 'Introduce the intern to the team and workplace.', isRequired: true },
            { title: 'Access and tools', description: 'Provide accounts, workspace, and required equipment.', isRequired: true },
            { title: 'Role objectives', description: 'Confirm internship objectives and reporting contact.', isRequired: true },
          ],
        },
      },
      include: { onboardingItems: true },
    });

    await prisma.application.update({
      where: { id: application.id },
      data: {
        status: 'PLACEMENT_PENDING',
        statusHistory: {
          create: {
            status: 'PLACEMENT_PENDING',
            note: 'Placement created',
            actorName: user.fullName,
          },
        },
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'CREATE_PLACEMENT',
      entityType: 'Placement',
      entityId: placement.id,
      request,
    });

    await notifyUser({
      userId: application.internProfile.userId,
      title: 'Placement created',
      message: `${organization.name} created an internship placement for you.`,
      category: 'placement',
      link: '/dashboard/intern',
    });

    return NextResponse.json({ placement }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
