import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';
import { z } from 'zod';

const packageUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  priceXAF: z.number().int().min(0),
  opportunityLimit: z.number().int().min(0),
  candidateSearchLimit: z.number().int().min(0),
  maxRecruiterAccounts: z.number().int().min(1),
  featuredOpportunitiesLimit: z.number().int().min(0),
  isFeaturedBadge: z.boolean(),
  prioritySupport: z.boolean(),
  description: z.string().trim().min(1).max(2000),
  features: z.array(z.string().trim().min(1).max(200)).max(50),
});

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminUser();
    const body = packageUpdateSchema.parse(await request.json());
    const updated = await prisma.package.update({
      where: { id: body.id },
      data: {
        name: body.name,
        priceXAF: body.priceXAF,
        opportunityLimit: body.opportunityLimit,
        candidateSearchLimit: body.candidateSearchLimit,
        maxRecruiterAccounts: body.maxRecruiterAccounts,
        featuredOpportunitiesLimit: body.featuredOpportunitiesLimit,
        isFeaturedBadge: body.isFeaturedBadge,
        prioritySupport: body.prioritySupport,
        description: body.description,
        features: body.features,
      },
    });
    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: 'UPDATE_PACKAGE',
      entityType: 'Package',
      entityId: updated.id,
      details: { code: updated.code },
      request,
    });
    return NextResponse.json({ package: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid package data', details: error.issues }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
