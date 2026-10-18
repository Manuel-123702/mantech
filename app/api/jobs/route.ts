import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { notifyMatchingAlerts } from '@/lib/alert-delivery';

const WORK_MODE_STRINGS = ['ONSITE', 'HYBRID', 'REMOTE'];
const APP_METHOD_STRINGS = ['MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL'];
const JOB_TYPE_STRINGS = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE'];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawLimit = Number(params.get('limit') || 50);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 50;
  const rawPage = Number(params.get('page') || 1);
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(Math.floor(rawPage), 1), 10000) : 1;

  const workModeRaw = params.get('workMode');
  const applicationMethodRaw = params.get('applicationMethod');
  const jobTypeRaw = params.get('jobType');
  const workMode = workModeRaw && WORK_MODE_STRINGS.includes(workModeRaw.toUpperCase()) ? workModeRaw.toUpperCase() : undefined;
  const applicationMethod = applicationMethodRaw && APP_METHOD_STRINGS.includes(applicationMethodRaw.toUpperCase()) ? applicationMethodRaw.toUpperCase() : undefined;
  const jobType = jobTypeRaw && JOB_TYPE_STRINGS.includes(jobTypeRaw.toUpperCase()) ? jobTypeRaw.toUpperCase() : undefined;

  if (params.has('workMode') && !workMode) return NextResponse.json({ error: 'Invalid work mode.' }, { status: 400 });
  if (params.has('applicationMethod') && !applicationMethod) return NextResponse.json({ error: 'Invalid application method.' }, { status: 400 });
  if (params.has('jobType') && !jobType) return NextResponse.json({ error: 'Invalid job type.' }, { status: 400 });

  const where: Prisma.JobWhereInput = {
    moderationStatus: 'PUBLISHED',
  };
  const availability = params.get('availability');
  if (availability === 'active') {
    where.expiryDate = { gte: new Date() };
  } else if (availability === 'expired') {
    where.expiryDate = { lt: new Date() };
  }
  const field = params.get('field');
  const specialization = params.get('specialization');
  const region = params.get('region');
  const industry = params.get('industry');
  const city = params.get('city');
  const skill = params.get('skill');
  const search = params.get('search') || params.get('keyword');
  if (field) where.field = { OR: [{ name: { contains: field, mode: 'insensitive' } }, { slug: { equals: field, mode: 'insensitive' } }] };
  if (specialization) where.specialization = { OR: [{ name: { contains: specialization, mode: 'insensitive' } }, { slug: { equals: specialization, mode: 'insensitive' } }] };
  if (region) where.region = { OR: [{ name: { contains: region, mode: 'insensitive' } }, { id: region }, { code: { equals: region, mode: 'insensitive' } }] };
  if (industry) where.organization = { industry: { name: { contains: industry, mode: 'insensitive' } } };
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (workMode) where.workMode = workMode as unknown as typeof where.workMode;
  if (applicationMethod) where.applicationMethod = applicationMethod as unknown as typeof where.applicationMethod;
  if (jobType) where.type = jobType as unknown as typeof where.type;
  if (skill) where.requiredSkills = { hasSome: [skill] };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { organization: { name: { contains: search, mode: 'insensitive' } } },
      { city: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { organization: { include: { companyProfile: true, universityProfile: true } }, field: true, specialization: true, region: true },
        orderBy: [{ postingDate: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);
    return NextResponse.json({ jobs, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    logDatabaseUnavailable('jobs', error);
    return NextResponse.json(
      { jobs: [], page, limit, total: 0, pages: 0 },
      { status: 200, headers: { 'X-Data-Source': 'db-unavailable' } },
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title, slug, description, department, fieldId, specializationId,
      requiredSkills, preferredSkills, educationLevel, regionId, city,
      location, workMode, salaryMinXAF, salaryMaxXAF, type,
      postingDate, expiryDate, isRemote, isFeatured, moderationStatus, organizationId,
      applicationUrl,
    } = body;

    if (!title || !organizationId || !city || !expiryDate) {
      return NextResponse.json({ error: 'Missing required fields: title, organizationId, city, expiryDate' }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        slug: slug || undefined,
        description,
        department,
        fieldId,
        specializationId,
        requiredSkills: requiredSkills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
        preferredSkills: preferredSkills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
        educationLevel,
        regionId,
        city,
        location,
        workMode: workMode || 'ONSITE',
        salaryMinXAF: salaryMinXAF || null,
        salaryMaxXAF: salaryMaxXAF || null,
        type: type || 'FULL_TIME' as any,
        postingDate: postingDate || new Date(),
        expiryDate: new Date(expiryDate),
        isRemote: isRemote ?? false,
        isFeatured: isFeatured ?? false,
        moderationStatus: moderationStatus || 'PENDING_REVIEW',
        organizationId,
        applicationUrl: applicationUrl || null,
      },
      include: {
        organization: { include: { companyProfile: true, universityProfile: true } },
        field: true,
        specialization: true,
        region: true,
      },
    });

    // Job created already PUBLISHED (e.g. seed/admin fast-path) → same
    // instant fan-out as a moderation publish. Never throws.
    if (job.moderationStatus === 'PUBLISHED') {
      await notifyMatchingAlerts({
        id: job.id,
        title: job.title,
        slug: job.slug,
        organizationName: job.organization?.name ?? null,
        regionName: job.region?.name ?? null,
        city: job.city ?? null,
        workMode: String(job.workMode ?? ''),
        kind: 'job',
      });
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    if ((error as Error).message?.includes('unique constraint')) {
      return NextResponse.json({ error: 'A job with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create job.' }, { status: 500 });
  }
}
