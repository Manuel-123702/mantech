import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { writeAudit } from '@/lib/audit';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';
import { getPackageLimits } from '@/lib/package-limits';

const opportunitySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  department: z.string().optional(),
  fieldId: z.string().optional(),
  specializationId: z.string().optional(),
  requiredSkills: z.array(z.string()).min(1),
  preferredSkills: z.array(z.string()).optional(),
  educationLevel: z.string().optional(),
  regionId: z.string().min(1),
  city: z.string().min(1),
  location: z.string().optional(),
  workMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']),
  durationMonths: z.number().min(1).max(24),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deadline: z.string().min(1),
  isPaid: z.boolean().optional(),
  allowanceXAF: z.number().optional(),
  positions: z.number().min(1),
  applicationMethod: z.enum(['MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL']),
  applicationUrl: z.string().url().refine(
    (value) => ['http:', 'https:'].includes(new URL(value).protocol),
    'Application URL must use HTTP or HTTPS'
  ).optional().or(z.literal('')),
  externalPlatform: z.string().optional(),
  instructions: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  saveAsDraft: z.boolean().optional(),
});

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
}

export async function GET() {
  try {
    const { organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const opportunities = await prisma.internshipOpportunity.findMany({
      where: { organizationId: organization.id },
      include: {
        field: true,
        specialization: true,
        region: true,
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ opportunities });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: Request) {
  try {
    const { user, organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const body = opportunitySchema.parse(await request.json());
    if (
      (body.applicationMethod === 'COMPANY_WEBSITE' || body.applicationMethod === 'EXTERNAL') &&
      !body.applicationUrl
    ) {
      return NextResponse.json({ error: 'Application URL is required for this method' }, { status: 400 });
    }

    const limits = await getPackageLimits(organization.packageCode);
    const activeCount = await prisma.internshipOpportunity.count({
      where: {
        organizationId: organization.id,
        moderationStatus: { in: ['PUBLISHED', 'PENDING_REVIEW', 'APPROVED'] },
      },
    });
    if (!body.saveAsDraft && activeCount >= limits.activeOpportunities) {
      return NextResponse.json(
        { error: 'Active opportunity limit reached for your current package. Upgrade via WhatsApp.' },
        { status: 403 }
      );
    }

    const opportunity = await prisma.internshipOpportunity.create({
      data: {
        organizationId: organization.id,
        title: body.title,
        slug: slugify(body.title),
        description: body.description,
        department: body.department,
        fieldId: body.fieldId || null,
        specializationId: body.specializationId || null,
        requiredSkills: body.requiredSkills,
        preferredSkills: body.preferredSkills || [],
        educationLevel: body.educationLevel,
        regionId: body.regionId,
        city: body.city,
        location: body.location,
        workMode: body.workMode,
        durationMonths: body.durationMonths,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        deadline: new Date(body.deadline),
        isPaid: body.isPaid || false,
        allowanceXAF: body.allowanceXAF || 0,
        positions: body.positions,
        applicationMethod: body.applicationMethod,
        applicationUrl: body.applicationUrl || null,
        externalPlatform: body.externalPlatform,
        instructions: body.instructions,
        contactEmail: body.contactEmail || null,
        moderationStatus: body.saveAsDraft ? 'DRAFT' : 'PENDING_REVIEW',
      },
    });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'CREATE_OPPORTUNITY',
      entityType: 'InternshipOpportunity',
      entityId: opportunity.id,
      details: { title: opportunity.title, status: opportunity.moderationStatus },
      request,
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
