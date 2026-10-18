import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { notifyMatchingAlerts } from '@/lib/alert-delivery';

const updateSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().optional(),
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
  salaryMinXAF: z.number().optional().nullable(),
  salaryMaxXAF: z.number().optional().nullable(),
  type: z.string().optional(),
  expiryDate: z.string().optional(),
  isRemote: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  applicationMethod: z.enum(['MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL']).optional(),
  applicationUrl: z.string().url().refine(
    (value) => ['http:', 'https:'].includes(new URL(value).protocol),
    'Application URL must use HTTP or HTTPS'
  ).optional().or(z.literal('')).nullable(),
  externalPlatform: z.string().optional(),
  instructions: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')).nullable(),
  moderationStatus: z.enum(['DRAFT', 'PENDING_REVIEW', 'ARCHIVED', 'EXPIRED', 'PUBLISHED', 'REJECTED']).optional(),
});

async function loadOwnedJob(id: string) {
  const { user, organization } = await requireRecruiterContext({ requireOrg: true });
  if (!organization) throw new AuthError(400, 'Organization profile required');
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || (job.organizationId !== organization.id && user.role !== 'ADMIN')) {
    throw new AuthError(404, 'Job not found');
  }
  return { user, organization, job };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { job } = await loadOwnedJob(id);
    return NextResponse.json({ job });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, job } = await loadOwnedJob(id);
    const body = updateSchema.parse(await request.json());

    const updated = await prisma.job.update({
      where: { id: job.id },
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
        salaryMinXAF: body.salaryMinXAF === undefined ? undefined : body.salaryMinXAF,
        salaryMaxXAF: body.salaryMaxXAF === undefined ? undefined : body.salaryMaxXAF,
        type: body.type,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
        isRemote: body.isRemote,
        isFeatured: body.isFeatured,
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
      action: 'UPDATE_JOB',
      entityType: 'Job',
      entityId: updated.id,
      details: { title: updated.title, moderationStatus: updated.moderationStatus },
      request,
    });

    // Freshly published job → instant fan-out to matched alert subscribers
    // (in-app + email + WhatsApp). Never throws — the update already landed.
    if (updated.moderationStatus === 'PUBLISHED' && job.moderationStatus !== 'PUBLISHED') {
      const withContext = await prisma.job.findUnique({
        where: { id: updated.id },
        include: {
          organization: { select: { name: true } },
          region: { select: { name: true } },
        },
      });
      await notifyMatchingAlerts({
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        organizationName: withContext?.organization?.name ?? null,
        regionName: withContext?.region?.name ?? null,
        city: updated.city ?? null,
        workMode: String(updated.workMode ?? ''),
        kind: 'job',
      });
    }

    return NextResponse.json({ job: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, job } = await loadOwnedJob(id);

    await prisma.job.delete({ where: { id: job.id } });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'DELETE_JOB',
      entityType: 'Job',
      entityId: job.id,
      details: { title: job.title },
      request: _request,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}