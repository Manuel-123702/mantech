import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyUser, writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const statusSchema = z.object({
  action: z.enum(['suspend', 'reactivate']),
  note: z.string().max(2000).optional(),
});

const roleSchema = z.object({
  role: z.enum(['INTERN', 'COMPANY', 'UNIVERSITY']),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    if (id === admin.id) {
      return NextResponse.json({ error: 'Administrators cannot moderate their own account' }, { status: 400 });
    }

    const payload = await request.json();
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (payload && typeof payload === 'object' && 'action' in payload) {
      const body = statusSchema.parse(payload);
      const status = body.action === 'suspend' ? 'suspended' : 'active';
      const updated = await prisma.user.update({ where: { id: user.id }, data: { status } });

      await notifyUser({
        userId: user.id,
        title: body.action === 'suspend' ? 'Account suspended' : 'Account reactivated',
        message:
          body.action === 'suspend'
            ? `Your MANTECH Nexus account has been suspended.${body.note ? ` Reason: ${body.note}` : ''}`
            : 'Your MANTECH Nexus account is active again.',
        category: 'system',
      });

      await writeAudit({
        actorId: admin.id,
        actorRole: admin.role,
        action: body.action === 'suspend' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
        entityType: 'User',
        entityId: user.id,
        details: { note: body.note, email: user.email },
        request,
      });

      return NextResponse.json({ user: { id: updated.id, status: updated.status } });
    }

    const body = roleSchema.parse(payload);
    const updated = await prisma.user.update({ where: { id: user.id }, data: { role: body.role } });

    await notifyUser({
      userId: user.id,
      title: 'Account role updated',
      message: `Your MANTECH Nexus role is now ${body.role}. Sign out and back in if your dashboard does not update immediately.`,
      category: 'system',
    });

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: 'USER_ROLE_CHANGED',
      entityType: 'User',
      entityId: user.id,
      details: { from: user.role, to: body.role, email: user.email },
      request,
    });

    return NextResponse.json({ user: { id: updated.id, role: updated.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
