import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { AuthError, jsonError, requireRecruiterContext } from '@/lib/authz';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
  fieldId: z.string().optional(),
  regionId: z.string().optional(),
  qualification: z.string().optional(),
  workMode: z.string().optional(),
  availability: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) throw new AuthError(400, 'Organization profile required');

    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid filters.', details: parsed.error.flatten() }, { status: 400 });
    }
    const { page, limit, q, fieldId, regionId, qualification, workMode, availability } = parsed.data;

    const where: Record<string, unknown> = { profileCompleted: true };
    if (fieldId) where.fieldOfStudyId = fieldId;
    if (regionId) where.regionId = regionId;
    if (qualification) where.qualification = { contains: qualification, mode: 'insensitive' };
    if (workMode) where.preferredWorkMode = workMode;
    if (availability) where.availability = { contains: availability, mode: 'insensitive' };
    if (q) {
      where.OR = [
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
        { qualification: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { institution: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.internProfile.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          qualification: true,
          academicLevel: true,
          institution: true,
          city: true,
          availability: true,
          preferredWorkMode: true,
          readinessScore: true,
          user: { select: { id: true, fullName: true, avatarUrl: true } },
          passport: { select: { headline: true, summary: true, passportNumber: true } },
          fieldOfStudy: { select: { name: true } },
          specialization: { select: { name: true } },
          region: { select: { name: true } },
          skills: { select: { skill: { select: { name: true } } } },
          cvFiles: { select: { id: true, fileName: true } },
          savedByOrganizations: { where: { organizationId: organization.id }, select: { id: true } },
        },
      }),
      prisma.internProfile.count({ where }),
    ]);

    const candidates = rows.map((r) => ({ ...r, isSaved: r.savedByOrganizations.length > 0, savedByOrganizations: undefined }));

    return NextResponse.json({
      candidates,
      count: candidates.length,
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('[candidates] GET error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

