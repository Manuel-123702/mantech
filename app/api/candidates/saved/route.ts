import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, requireRecruiterContext, requireUser } from '@/lib/authz';

const saveSchema = z.object({
  internProfileId: z.string().min(1).optional(),
  internshipId: z.string().min(1).optional(),
  opportunityId: z.string().min(1).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // "Is this opportunity saved by me?" — the public internship page calls
    // this to hydrate its Save button after a reload. This branch serves the
    // signed-in intern, so it must run before the recruiter context check.
    const statusOpportunityId = searchParams.get('opportunityId') ?? searchParams.get('internshipId');
    if (statusOpportunityId) {
      const user = await requireUser();
      const saved = await prisma.savedOpportunity.findUnique({
        where: { userId_opportunityId: { userId: user.id, opportunityId: statusOpportunityId } },
        select: { id: true, savedAt: true },
      });
      return NextResponse.json({ isSaved: Boolean(saved), savedAt: saved?.savedAt ?? null, item: saved });
    }

    const { organization } = await requireRecruiterContext({ requireOrg: true });
    if (!organization) return NextResponse.json({ error: 'Organization profile required.' }, { status: 400 });

    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 100);

    const where = { organizationId: organization.id };
    const [rows, total] = await Promise.all([
      prisma.savedCandidate.findMany({
        where,
        orderBy: { savedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          internProfile: {
            include: {
              user: { select: { id: true, fullName: true, avatarUrl: true } },
              fieldOfStudy: { select: { name: true } },
              region: { select: { name: true } },
            },
          },
        },
      }),
      prisma.savedCandidate.count({ where }),
    ]);

    return NextResponse.json({
      items: rows,
      candidates: rows,
      count: rows.length,
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('[candidates/saved] GET error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed.', details: parsed.error.flatten() }, { status: 400 });
    }

    // Recruiter shortlisting a candidate -> SavedCandidate
    if (parsed.data.internProfileId) {
      const { organization } = await requireRecruiterContext({ requireOrg: true });
      if (!organization) return NextResponse.json({ error: 'Organization profile required.' }, { status: 400 });

      const internProfileId = parsed.data.internProfileId;
      const intern = await prisma.internProfile.findUnique({ where: { id: internProfileId }, select: { id: true } });
      if (!intern) return NextResponse.json({ error: 'Candidate not found.' }, { status: 404 });

      const existing = await prisma.savedCandidate.findUnique({
        where: { organizationId_internProfileId: { organizationId: organization.id, internProfileId } },
      });
      if (existing) return NextResponse.json({ error: 'Already saved.', item: existing }, { status: 409 });

      const saved = await prisma.savedCandidate.create({
        data: { organizationId: organization.id, internProfileId, notes: parsed.data.notes ?? null },
      });
      return NextResponse.json({ item: saved, ok: true }, { status: 201 });
    }

    // Intern saving an opportunity -> SavedOpportunity
    const opportunityId = parsed.data.opportunityId ?? parsed.data.internshipId;
    if (!opportunityId) {
      return NextResponse.json({ error: 'internProfileId or opportunityId is required.' }, { status: 400 });
    }
    const user = await requireUser();
    const opportunity = await prisma.internshipOpportunity.findUnique({ where: { id: opportunityId }, select: { id: true } });
    if (!opportunity) return NextResponse.json({ error: 'Internship not found.' }, { status: 404 });

    const existing = await prisma.savedOpportunity.findUnique({
      where: { userId_opportunityId: { userId: user.id, opportunityId } },
    });
    if (existing) return NextResponse.json({ error: 'Already saved.', item: existing }, { status: 409 });

    const saved = await prisma.savedOpportunity.create({ data: { userId: user.id, opportunityId } });
    return NextResponse.json({ item: saved, ok: true }, { status: 201 });
  } catch (error) {
    console.error('[candidates/saved] POST error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const internProfileId = searchParams.get('internProfileId');
    const opportunityId = searchParams.get('opportunityId') ?? searchParams.get('internshipId');

    if (internProfileId) {
      const { organization } = await requireRecruiterContext({ requireOrg: true });
      if (!organization) return NextResponse.json({ error: 'Organization profile required.' }, { status: 400 });
      const deleted = await prisma.savedCandidate.deleteMany({ where: { organizationId: organization.id, internProfileId } });
      if (deleted.count === 0) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    if (!opportunityId) {
      return NextResponse.json({ error: 'internProfileId or opportunityId query parameter required.' }, { status: 400 });
    }
    const user = await requireUser();
    const deleted = await prisma.savedOpportunity.deleteMany({ where: { userId: user.id, opportunityId } });
    if (deleted.count === 0) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[candidates/saved] DELETE error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}


