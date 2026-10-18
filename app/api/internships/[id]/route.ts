import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { getOrganizationResponseStats } from '@/lib/response-rate';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { notifyMatchingAlerts } from '@/lib/alert-delivery';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const opportunity = await prisma.internshipOpportunity.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        organization: { include: { companyProfile: true, industry: true, region: true } },
        field: true,
        specialization: true,
        region: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    try {
      await prisma.internshipOpportunity.update({
        where: { id: opportunity.id },
        data: { viewCount: { increment: 1 } },
      });
    } catch {
      // Non-fatal: view counter update failure should not break page render
    }

    // Trust signal: the employer's historical reply behaviour, shown next to
    // the posting so interns can weigh "will I even hear back?".
    const responseRate = await getOrganizationResponseStats(opportunity.organizationId);

    return NextResponse.json({ opportunity, organization: opportunity.organization, responseRate });
  } catch (dbError) {
    logDatabaseUnavailable(`internships/${id}`, dbError);
    // Option A: detail pages never invent an opportunity — report the outage honestly.
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }
}

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
  moderationStatus: z.enum(['DRAFT', 'PENDING_REVIEW', 'ARCHIVED', 'EXPIRED', 'PUBLISHED', 'REJECTED']).optional(),
});

async function loadOwnedInternship(id: string) {
  const { user, organization } = await requireRecruiterContext({ requireOrg: true });
  if (!organization) throw new AuthError(400, 'Organization profile required');
  const opp = await prisma.internshipOpportunity.findUnique({ where: { id } });
  if (!opp || (opp.organizationId !== organization.id && user.role !== 'ADMIN')) {
    throw new AuthError(404, 'Internship not found');
  }
  return { user, organization, opportunity: opp };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, opportunity } = await loadOwnedInternship(id);
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
      action: 'UPDATE_INTERNSHIP',
      entityType: 'InternshipOpportunity',
      entityId: updated.id,
      details: { title: updated.title, moderationStatus: updated.moderationStatus },
      request,
    });

    // Freshly (re)published via direct PATCH (admin fast-path) → same instant
    // fan-out as the moderation queue. Never throws.
    if (updated.moderationStatus === 'PUBLISHED' && opportunity.moderationStatus !== 'PUBLISHED') {
      const withContext = await prisma.internshipOpportunity.findUnique({
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
        kind: 'internship',
      });
    }

    return NextResponse.json({ opportunity: updated });
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
    const { user, opportunity } = await loadOwnedInternship(id);

    await prisma.internshipOpportunity.delete({ where: { id: opportunity.id } });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'DELETE_INTERNSHIP',
      entityType: 'InternshipOpportunity',
      entityId: opportunity.id,
      details: { title: opportunity.title },
      request: _request,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
