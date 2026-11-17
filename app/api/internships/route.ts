import { NextRequest, NextResponse } from 'next/server';
import { Prisma, WorkMode, ApplicationMethod } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { getExpressPostings } from '@/lib/cameroon-marketplace-data';

const enumValues = <T extends Record<string, string>>(value: string | null, values: T) =>
  value && Object.values(values).includes(value.toUpperCase() as T[keyof T]) ? value.toUpperCase() as T[keyof T] : undefined;

const WORK_MODE_STRINGS = ['ONSITE', 'HYBRID', 'REMOTE'];
const APP_METHOD_STRINGS = ['MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL'];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawLimit = Number(params.get('limit') || 50);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 50;
  const rawPage = Number(params.get('page') || 1);
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(Math.floor(rawPage), 1), 10000) : 1;

  // Validate enum params loosely (so offline fallback still accepts them)
  const workModeRaw = params.get('workMode');
  const applicationMethodRaw = params.get('applicationMethod');
  const workMode = workModeRaw && WORK_MODE_STRINGS.includes(workModeRaw.toUpperCase()) ? workModeRaw.toUpperCase() : undefined;
  const applicationMethod = applicationMethodRaw && APP_METHOD_STRINGS.includes(applicationMethodRaw.toUpperCase()) ? applicationMethodRaw.toUpperCase() : undefined;
  const rawMinDuration = params.get('minDuration');
  const rawMaxDuration = params.get('maxDuration');
  const minDuration = rawMinDuration ? Number(rawMinDuration) : undefined;
  const maxDuration = rawMaxDuration ? Number(rawMaxDuration) : undefined;
  const paid = params.get('paid');

  if (params.has('workMode') && !workMode) return NextResponse.json({ error: 'Invalid work mode.' }, { status: 400 });
  if (params.has('applicationMethod') && !applicationMethod) return NextResponse.json({ error: 'Invalid application method.' }, { status: 400 });
  if ((minDuration !== undefined && (!Number.isInteger(minDuration) || minDuration < 1)) || (maxDuration !== undefined && (!Number.isInteger(maxDuration) || maxDuration > 24)) || (minDuration !== undefined && maxDuration !== undefined && minDuration > maxDuration)) {
    return NextResponse.json({ error: 'Invalid duration range.' }, { status: 400 });
  }
  if (paid !== null && paid !== 'true' && paid !== 'false') return NextResponse.json({ error: 'Invalid paid filter.' }, { status: 400 });

  const now = new Date();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Background auto-purge for internships expired more than 1 week
  prisma.internshipOpportunity.deleteMany({
    where: { deadline: { lt: oneWeekAgo } },
  }).catch(() => {});

  const where: Prisma.InternshipOpportunityWhereInput = {
    moderationStatus: 'PUBLISHED',
    // Rule §5: Expired postings still show for 1 week; older are purged
    deadline: { gte: oneWeekAgo },
  };
  const availability = params.get('availability');
  if (availability === 'active') {
    where.deadline = { gte: now };
  } else if (availability === 'expired') {
    where.deadline = { lt: now, gte: oneWeekAgo };
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
  if (paid !== null) where.isPaid = paid === 'true';
  if (minDuration !== undefined || maxDuration !== undefined) where.durationMonths = { ...(minDuration !== undefined ? { gte: minDuration } : {}), ...(maxDuration !== undefined ? { lte: maxDuration } : {}) };
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
    const [internships, total] = await Promise.all([
      prisma.internshipOpportunity.findMany({
        where,
        include: { organization: { include: { companyProfile: true, universityProfile: true } }, field: true, specialization: true, region: true },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.internshipOpportunity.count({ where }),
    ]);
    const expressInternships = getExpressPostings()
      .filter(j => j.type === 'INTERNSHIP')
      .map(j => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        description: j.description,
        city: j.city,
        workMode: j.workMode,
        durationMonths: 6,
        isPaid: Boolean(j.salaryMinXAF > 0),
        allowanceXAF: j.salaryMinXAF,
        requiredSkills: j.requiredSkills,
        moderationStatus: 'PUBLISHED',
        organization: {
          name: j.companyName,
          logoUrl: j.logoUrl,
          verificationStatus: 'VERIFIED',
        },
        field: { name: j.field },
        region: { name: j.region },
        createdAt: new Date().toISOString(),
      }));

    const combined = [...expressInternships, ...internships];
    return NextResponse.json({
      internships: combined.slice((page - 1) * limit, page * limit),
      page,
      limit,
      total: total + expressInternships.length,
      pages: Math.ceil((total + expressInternships.length) / limit),
    });
  } catch (error) {
    logDatabaseUnavailable('internships', error);
    const expressInternships = getExpressPostings()
      .filter(j => j.type === 'INTERNSHIP')
      .map(j => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        description: j.description,
        city: j.city,
        workMode: j.workMode,
        durationMonths: 6,
        isPaid: Boolean(j.salaryMinXAF > 0),
        allowanceXAF: j.salaryMinXAF,
        requiredSkills: j.requiredSkills,
        moderationStatus: 'PUBLISHED',
        organization: {
          name: j.companyName,
          logoUrl: j.logoUrl,
          verificationStatus: 'VERIFIED',
        },
        field: { name: j.field },
        region: { name: j.region },
        createdAt: new Date().toISOString(),
      }));

    return NextResponse.json(
      { internships: expressInternships, page, limit, total: expressInternships.length, pages: Math.ceil(expressInternships.length / limit) },
      { status: 200, headers: { 'X-Data-Source': 'express-catalog' } },
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Use the organization opportunity workflow.' }, { status: 405, headers: { Allow: 'GET' } });
}
