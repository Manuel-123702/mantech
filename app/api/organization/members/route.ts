import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireOrganizationContext } from '@/lib/authz';
import { isUniqueConstraintViolation } from '@/lib/authz-policy';
import { getPackageLimits } from '@/lib/package-limits';

const inviteSchema = z.object({
  email: z.string().email(),
  jobTitle: z.string().optional(),
  role: z.enum(['admin', 'recruiter', 'member']).default('recruiter'),
});

export async function POST(request: Request) {
  try {
    const { user, membership, organization } = await requireOrganizationContext({ requireOrg: true });
    if (!organization || !membership) throw new AuthError(400, 'Organization profile required');
    if (!membership.isOwner && membership.role !== 'admin' && user.role !== 'ADMIN') {
      throw new AuthError(403, 'Only organization admins can add recruiters');
    }

    const body = inviteSchema.parse(await request.json());
    const limits = await getPackageLimits(organization.packageCode);
    const memberCount = await prisma.organizationMember.count({
      where: { organizationId: organization.id },
    });
    if (memberCount >= limits.recruiterAccounts) {
      return NextResponse.json(
        { error: 'Recruiter seat limit reached for your current package. Upgrade via WhatsApp.' },
        { status: 403 }
      );
    }

    const invitee = await prisma.user.findUnique({ where: { email: body.email } });
    if (!invitee) {
      return NextResponse.json(
        { error: 'No MANTECH account exists for that email. Ask them to sign up first.' },
        { status: 404 }
      );
    }

    // Friendly pre-check so the common "already on the team" case never reaches
    // the database's unique constraint. The catch below still guards the race
    // where two invites for the same person land at the same moment.
    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: invitee.id,
        },
      },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: `${body.email} is already a member of this organization.` },
        { status: 409 }
      );
    }

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: invitee.id,
        jobTitle: body.jobTitle,
        role: body.role,
        isOwner: false,
      },
      include: { user: true },
    });

    if (invitee.role === 'INTERN') {
      await prisma.user.update({
        where: { id: invitee.id },
        data: { role: organization.type === 'UNIVERSITY' ? 'UNIVERSITY' : 'COMPANY' },
      });
    }

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'ADD_ORGANIZATION_MEMBER',
      entityType: 'OrganizationMember',
      entityId: member.id,
      details: { email: body.email, role: body.role },
      request,
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    // The (organizationId, userId) unique constraint. The pre-check above
    // handles the ordinary duplicate; this only fires when two identical
    // invites race each other. Without it the route surfaced a raw Prisma
    // P2002 as an HTTP 500.
    if (isUniqueConstraintViolation(error)) {
      return NextResponse.json(
        { error: 'That person is already a member of this organization.' },
        { status: 409 }
      );
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
