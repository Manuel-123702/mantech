import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';

const patchSchema = z.object({
  isCompleted: z.boolean(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const item = await prisma.onboarding.findUnique({
      where: { id },
      include: { placement: true },
    });
    if (!item || item.placement.organizationId !== organization.id) {
      throw new AuthError(404, 'Onboarding item not found');
    }

    const body = patchSchema.parse(await request.json());
    const updated = await prisma.onboarding.update({
      where: { id },
      data: {
        isCompleted: body.isCompleted,
        completedAt: body.isCompleted ? new Date() : null,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'UPDATE_ONBOARDING',
      entityType: 'Onboarding',
      entityId: updated.id,
      request,
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
