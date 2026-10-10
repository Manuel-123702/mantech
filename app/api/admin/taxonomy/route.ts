import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

const schema = z.object({
  type: z.enum(['field', 'skill', 'industry', 'qualification', 'region']),
  id: z.string().min(1),
  isActive: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminUser();
    const body = schema.parse(await request.json());

    switch (body.type) {
      case 'field':
        await prisma.field.update({ where: { id: body.id }, data: { isActive: body.isActive } });
        break;
      case 'skill':
        await prisma.skill.update({ where: { id: body.id }, data: { isActive: body.isActive } });
        break;
      case 'industry':
        await prisma.industry.update({ where: { id: body.id }, data: { isActive: body.isActive } });
        break;
      case 'qualification':
        await prisma.qualification.update({ where: { id: body.id }, data: { isActive: body.isActive } });
        break;
      case 'region':
        await prisma.region.update({ where: { id: body.id }, data: { isActive: body.isActive } });
        break;
    }

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: 'TAXONOMY_UPDATED',
      entityType: body.type,
      entityId: body.id,
      details: { isActive: body.isActive },
      request,
    });

    return NextResponse.json({ id: body.id, type: body.type, isActive: body.isActive });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
