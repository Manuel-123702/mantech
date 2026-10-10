import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, requireUser } from '@/lib/authz';

const checkListSchema = z.object({
  items: z.array(z.any()),
  count: z.number(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 100);

    const where: Record<string, unknown> = {
      moderationStatus: 'PUBLISHED',
    };

    const field = searchParams.get('field');
    const specialization = searchParams.get('specialization');
    const region = searchParams.get('region');
    const industry = searchParams.get('industry');
    const city = searchParams.get('city');
    const workMode = searchParams.get('workMode');
    const applicationMethod = searchParams.get('applicationMethod');
    const paid = searchParams.get('paid');
    const minDuration = searchParams.get('minDuration');
    const maxDuration = searchParams.get('maxDuration');
    const skill = searchParams.get('skill');
    const search = searchParams.get('search') || searchParams.get('keyword');

    const savedIds = await prisma.savedOpportunity.findMany({
      where: { userId: user.id },
      select: { opportunityId: true },
    });
    const savedSet = new Set(savedIds.map((s) => s.opportunityId));

    const applicationIds = await prisma.candidateApplication.findMany({
      where: { applicantId: user.id },
      select: { internshipId: true },
    });
    const appliedSet = new Set(applicationIds.map((s) => s.internshipId));

    if (field) where.fieldId = field;
    if (specialization) where.specializationId = specialization;
    if (region) where.regionId = region;
    if (industry) where.organization = { industry: { name: { contains: industry, mode: 'insensitive' } } };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (workMode) where.workMode = workMode as unknown as typeof where.workMode;
    if (applicationMethod) where.applicationMethod = applicationMethod as unknown as typeof where.applicationMethod;
    if (paid === 'true' || paid === 'false') where.isPaid = paid === 'true';
    if (minDuration != null && minDuration !== '') where.durationMonths = { ...((where.durationMonths as object) ?? {}), gte: Number(minDuration) };
    if (maxDuration != null && maxDuration !== '') where.durationMonths = { ...((where.durationMonths as object) ?? {}), lte: Number(maxDuration) };
    if (skill) where.requiredSkills = { hasSome: [skill] };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { organization: { name: { contains: search, mode: 'insensitive' } } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [internships, total] = await Promise.all([
      prisma.internshipOpportunity.findMany({
        where,
        include: {
          organization: { select: { id: true, name: true, slug: true, logoUrl: true } },
          field: { select: { id: true, name: true } },
          specialization: { select: { id: true, name: true } },
          region: { select: { id: true, name: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.internshipOpportunity.count({ where }),
    ]);

    const items = internships.map((opp) => ({
      id: opp.id,
      title: opp.title,
      slug: opp.slug,
      companyName: opp.organization?.name ?? opp.title,
      companyLogoUrl: opp.organization?.logoUrl ?? null,
      region: opp.region?.name ?? null,
      regionId: opp.regionId,
      city: opp.city,
      workMode: opp.workMode,
      isPaid: opp.isPaid,
      isFeatured: opp.isFeatured,
      isSaved: savedSet.has(opp.id),
      isShortlisted: savedSet.has(opp.id),
      isApplied: appliedSet.has(opp.id),
    }));

    return NextResponse.json(checkListSchema.parse({ items, count: items.length, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) }));
  } catch (error) {
    console.error('[candidates/check] GET error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}


