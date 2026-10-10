import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';

const updateSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  department: z.string().optional(),
  fieldId: z.string().optional().nullable(),
  specializationId: z.string().optional().nullable(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  educationLevel: z.string().optional(),
  regionId: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']).optional(),
  durationMonths: z.number().min(1).max(24).optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  deadline: z.string().optional(),
  isPaid: z.boolean().optional(),
  allowanceXAF: z.number().optional(),
  positions: z.number().min(1).optional(),
  applicationMethod: z.enum(['MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL']).optional(),
  applicationUrl: z.string().url().refine(
    (value) => ['http:', 'https:'].includes(new URL(value).protocol),
    'Application URL must use HTTP or HTTPS'
  ).optional().or(z.literal('')).nullable(),
  externalPlatform: z.string().optional(),
  instructions: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')).nullable(),
  moderationStatus: z.enum(['DRAFT', 'PENDING_REVIEW', 'ARCHIVED', 'EXPIRED']).optional(),
});

async function loadOwnedOpportunity(id: string) {
  const { user, organization } = await requireRecruiterContext({ requireOrg: true });
  if (!organization) throw new AuthError(400, 'Organization profile required');
  const opportunity = await prisma.internshipOpportunity.findUnique({ where: { id } });
  if (!opportunity || (opportunity.organizationId !== organization.id && user.role !== 'ADMIN')) {
    throw new AuthError(404, 'Opportunity not found');
  }
  return { user, organization, opportunity };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { opportunity } = await loadOwnedOpportunity(id);
    return NextResponse.json({ opportunity });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, opportunity } = await loadOwnedOpportunity(id);
    const body = updateSchema.parse(await request.json());

    const updated = await prisma.internshipOpportunity.update({
      where: { id: opportunity.id },
      data: {
        title: body.title,
        description: body.description,
        department: body.department,
        fieldId: body.fieldId === undefined ? undefined : body.fieldId,
        specializationId: body.specializationId === undefined ? undefined : body.specializationId,
        requiredSkills: body.requiredSkills,
        preferredSkills: body.preferredSkills,
        educationLevel: body.educationLevel,
        regionId: body.regionId,
        city: body.city,
        location: body.location,
        workMode: body.workMode,
        durationMonths: body.durationMonths,
        startDate: body.startDate === undefined ? undefined : body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate === undefined ? undefined : body.endDate ? new Date(body.endDate) : null,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        isPaid: body.isPaid,
        allowanceXAF: body.allowanceXAF,
        positions: body.positions,
        applicationMethod: body.applicationMethod,
        applicationUrl: body.applicationUrl === undefined ? undefined : body.applicationUrl || null,
        externalPlatform: body.externalPlatform,
        instructions: body.instructions,
        contactEmail: body.contactEmail === undefined ? undefined : body.contactEmail || null,
        moderationStatus: body.moderationStatus,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'UPDATE_OPPORTUNITY',
      entityType: 'InternshipOpportunity',
      entityId: updated.id,
      details: { moderationStatus: updated.moderationStatus },
      request,
    });

    return NextResponse.json({ opportunity: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
