import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { notifyMatchingAlerts } from '@/lib/alert-delivery';
import { syncDbUser } from '@/lib/authz';
import { CAMEROON_MARKETPLACE_JOBS, MarketplaceJob, saveExpressPosting } from '@/lib/cameroon-marketplace-data';

const WORK_MODE_STRINGS = ['ONSITE', 'HYBRID', 'REMOTE'];
const APP_METHOD_STRINGS = ['MANTECH', 'COMPANY_WEBSITE', 'EXTERNAL'];
const JOB_TYPE_STRINGS = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE'];

function mapMarketplaceJob(m: MarketplaceJob) {
  return {
    id: m.id,
    slug: m.slug,
    title: m.title,
    description: m.description,
    department: m.department,
    type: m.type,
    workMode: m.workMode,
    city: m.city,
    salaryMinXAF: m.salaryMinXAF,
    salaryMaxXAF: m.salaryMaxXAF,
    requiredSkills: m.requiredSkills,
    educationLevel: m.educationLevel,
    moderationStatus: 'PUBLISHED',
    isFeatured: Boolean(m.isFeatured),
    postingDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    organization: {
      name: m.companyName,
      slug: m.companySlug,
      logoUrl: m.logoUrl || null,
    },
    region: { name: m.region },
    field: { name: m.field },
  };
}

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

  const now = new Date();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Background auto-purge for jobs expired more than 1 week
  prisma.job.deleteMany({
    where: { expiryDate: { lt: oneWeekAgo } },
  }).catch(() => {});

  const where: Prisma.JobWhereInput = {
    moderationStatus: 'PUBLISHED',
    // Rule §5: Expired postings still show for 1 week; older are purged
    expiryDate: { gte: oneWeekAgo },
  };
  const availability = params.get('availability');
  if (availability === 'active') {
    where.expiryDate = { gte: now };
  } else if (availability === 'expired') {
    where.expiryDate = { lt: now, gte: oneWeekAgo };
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

  let filteredMarketplace = CAMEROON_MARKETPLACE_JOBS.filter((j) => {
    if (city && city.toLowerCase() !== 'all' && !j.city.toLowerCase().includes(city.toLowerCase())) return false;
    if (workMode && workMode !== 'all' && j.workMode !== workMode) return false;
    if (jobType && jobType !== 'all' && j.type !== jobType) return false;
    if (field && field.toLowerCase() !== 'all' && !j.field.toLowerCase().includes(field.toLowerCase())) return false;
    if (search) {
      const s = search.toLowerCase();
      const matches =
        j.title.toLowerCase().includes(s) ||
        j.description.toLowerCase().includes(s) ||
        j.companyName.toLowerCase().includes(s) ||
        j.city.toLowerCase().includes(s) ||
        j.field.toLowerCase().includes(s);
      if (!matches) return false;
    }
    return true;
  }).map(mapMarketplaceJob);

  try {
    const [dbJobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { organization: { include: { companyProfile: true, universityProfile: true } }, field: true, specialization: true, region: true },
        orderBy: [{ isFeatured: 'desc' }, { postingDate: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    // Combine database jobs and marketplace jobs, avoiding slug duplicates
    const seenSlugs = new Set(dbJobs.map((j) => j.slug));
    const combined = [...dbJobs];
    for (const m of filteredMarketplace) {
      if (!seenSlugs.has(m.slug)) {
        combined.push(m as any);
        seenSlugs.add(m.slug);
      }
    }

    return NextResponse.json({
      jobs: combined.slice(0, limit),
      page,
      limit,
      total: Math.max(totalCount, combined.length),
      pages: Math.ceil(Math.max(totalCount, combined.length) / limit),
    });
  } catch (error) {
    logDatabaseUnavailable('jobs', error);
    return NextResponse.json(
      {
        jobs: filteredMarketplace.slice((page - 1) * limit, page * limit),
        page,
        limit,
        total: filteredMarketplace.length,
        pages: Math.ceil(filteredMarketplace.length / limit),
      },
      { status: 200, headers: { 'X-Data-Source': 'catalog-fallback' } },
    );
  }
}

function slugify(text: string): string {
  return (text || 'opening')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'opening';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title, slug, description, department, fieldId, specializationId,
      requiredSkills, preferredSkills, educationLevel, regionId, city,
      location, workMode, salaryMinXAF, salaryMaxXAF, type,
      postingDate, expiryDate, isRemote, isFeatured, moderationStatus, organizationId,
      applicationUrl, applicationMethod, contactPhone, flyerUrl,
    } = body;

    const orgName = (body.organizationName || body.employerName || body.companyName || 'Verified Enterprise').trim();
    const effectiveCity = (city || location || 'Douala').trim();
    const effectiveExpiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const generatedSlug = slug
      ? slugify(slug)
      : `${slugify(title || 'opportunity')}-${slugify(effectiveCity)}-${Date.now().toString(36)}`;

    const effectiveType = (type || (body.postType === 'internship' ? 'INTERNSHIP' : 'FULL_TIME')).toUpperCase();
    const skillsArr = Array.isArray(requiredSkills)
      ? requiredSkills
      : (typeof requiredSkills === 'string'
        ? requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []);

    // 1. Try to persist to database if available
    let dbJob: any = null;
    try {
      let effectiveOrgId = organizationId;
      if (!effectiveOrgId) {
        try {
          const user = await syncDbUser();
          if (user) {
            const membership = await prisma.organizationMember.findFirst({
              where: { userId: user.id },
              select: { organizationId: true },
            });
            if (membership) effectiveOrgId = membership.organizationId;
          }
        } catch {
          // not logged in
        }
      }

      if (!effectiveOrgId) {
        // Find existing organization with this name
        let org = await prisma.organization.findFirst({
          where: { name: { equals: orgName, mode: 'insensitive' } },
          select: { id: true },
        });
        if (!org) {
          // Or any company organization
          org = await prisma.organization.findFirst({
            where: { type: 'COMPANY' },
            select: { id: true },
          });
        }
        if (!org) {
          // Create new organization
          org = await prisma.organization.create({
            data: {
              name: orgName,
              slug: slugify(orgName) + '-' + Math.random().toString(36).slice(2, 6),
              type: 'COMPANY',
              verificationStatus: 'PENDING',
              city: effectiveCity,
            },
            select: { id: true },
          });
        }
        effectiveOrgId = org?.id;
      }

      if (effectiveOrgId) {
        dbJob = await prisma.job.create({
          data: {
            title: (title || 'New Opportunity').trim(),
            slug: generatedSlug,
            description: description || 'Opportunity posted via MANTECH Express.',
            department: department || null,
            fieldId: fieldId || null,
            specializationId: specializationId || null,
            requiredSkills: skillsArr,
            preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],
            educationLevel: educationLevel || null,
            regionId: regionId || null,
            city: effectiveCity,
            location: location || null,
            workMode: (workMode || 'ONSITE') as any,
            applicationMethod: (applicationMethod || (applicationUrl ? 'COMPANY_WEBSITE' : 'MANTECH')) as any,
            applicationUrl: applicationUrl || null,
            salaryMinXAF: salaryMinXAF ? Number(salaryMinXAF) : null,
            salaryMaxXAF: salaryMaxXAF ? Number(salaryMaxXAF) : null,
            type: effectiveType,
            postingDate: postingDate ? new Date(postingDate) : new Date(),
            expiryDate: effectiveExpiry,
            isRemote: isRemote ?? false,
            isFeatured: isFeatured ?? false,
            moderationStatus: moderationStatus || 'PUBLISHED',
            organizationId: effectiveOrgId,
          },
          include: {
            organization: { include: { companyProfile: true, universityProfile: true } },
            field: true,
            specialization: true,
            region: true,
          },
        });

        // If internship, also mirror to internshipOpportunity table
        if (effectiveType === 'INTERNSHIP' || body.postType === 'internship') {
          try {
            await prisma.internshipOpportunity.create({
              data: {
                organizationId: effectiveOrgId,
                title: (title || 'New Internship Opening').trim(),
                slug: generatedSlug,
                description: description || 'Internship opportunity posted via MANTECH Express.',
                city: effectiveCity,
                workMode: (workMode || 'ONSITE') as any,
                durationMonths: body.durationMonths || 3,
                deadline: effectiveExpiry,
                isPaid: Boolean(salaryMinXAF && Number(salaryMinXAF) > 0),
                allowanceXAF: salaryMinXAF ? Number(salaryMinXAF) : 0,
                requiredSkills: skillsArr,
                applicationMethod: (applicationMethod || (applicationUrl ? 'COMPANY_WEBSITE' : 'MANTECH')) as any,
                applicationUrl: applicationUrl || null,
                moderationStatus: 'PUBLISHED',
              },
            });
          } catch (mErr) {
            console.warn('[jobs] Mirror to internshipOpportunity skipped:', mErr);
          }
        }
      }
    } catch (dbErr) {
      console.warn('[jobs] Database write skipped or offline — activating resilient express fallback:', dbErr);
    }

    // 2. Prepare normalized job object (from DB or rich fallback)
    const normalizedJob = dbJob || {
      id: `job-exp-${Date.now()}`,
      slug: generatedSlug,
      title: (title || 'New Opportunity').trim(),
      description: description || 'Opportunity posted via MANTECH Express.',
      city: effectiveCity,
      region: body.region || 'Littoral',
      workMode: workMode || 'ONSITE',
      type: effectiveType,
      salaryMinXAF: salaryMinXAF ? Number(salaryMinXAF) : 0,
      salaryMaxXAF: salaryMaxXAF ? Number(salaryMaxXAF) : 0,
      department: department || 'General',
      field: body.field || 'General Business & Technology',
      requiredSkills: skillsArr,
      educationLevel: educationLevel || 'All levels welcome',
      companyName: orgName,
      companySlug: slugify(orgName),
      organization: {
        name: orgName,
        logoUrl: flyerUrl || null,
        verificationStatus: 'PENDING',
      },
      applicationMethod: applicationMethod || (applicationUrl ? 'COMPANY_WEBSITE' : 'MANTECH'),
      applicationUrl: applicationUrl || null,
      contactPhone: contactPhone || null,
      flyerUrl: flyerUrl || null,
      isFeatured: Boolean(isFeatured),
      isVisualFlyerOnly: Boolean(body.isVisualFlyerOnly),
      isLinkOnly: Boolean(body.isLinkOnly),
      externalUrl: applicationUrl || null,
      expiryDate: effectiveExpiry.toISOString(),
      postingDate: new Date().toISOString(),
    };

    // Save to persistent file and in-memory marketplace
    saveExpressPosting(normalizedJob);

    // Send notifications if DB was active
    if (dbJob) {
      try {
        await notifyMatchingAlerts({
          id: dbJob.id,
          title: dbJob.title,
          slug: dbJob.slug,
          organizationName: dbJob.organization?.name ?? orgName,
          regionName: dbJob.region?.name ?? null,
          city: dbJob.city ?? effectiveCity,
          workMode: String(dbJob.workMode ?? ''),
          kind: 'job',
        });
      } catch {}
    }

    return NextResponse.json({ job: normalizedJob, slug: generatedSlug }, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs fatal error:', error);
    return NextResponse.json({ error: 'Failed to process posting. Please check required fields.' }, { status: 400 });
  }
}
