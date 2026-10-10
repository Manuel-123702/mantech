import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, requireUser } from '@/lib/authz';

const applicationResponseSchema = z.object({
  id: z.string(),
  internshipId: z.string(),
  internshipTitle: z.string(),
  internshipSlug: z.string(),
  companyName: z.string(),
  status: z.string(),
  submittedAt: z.string().optional(),
  updatedAt: z.string(),
});

const applicationListSchema = z.object({
  items: z.array(applicationResponseSchema),
  count: z.number(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
});

const applicationActionSchema = z.object({
  action: z.enum(['submit', 'withdraw', 'update_status']),
  status: z.enum(['in_review', 'submitted', 'rejected', 'withdrawn', 'archived']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || 20), 1), 100);
    const internshipId = searchParams.get('internshipId');

    const userId = user.id;
    const where: Record<string, unknown> = { applicantId: userId };
    if (internshipId) where.internshipId = internshipId;

    const [applications, total] = await Promise.all([
      prisma.candidateApplication.findMany({
        where,
        orderBy: { appliedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { internship: { select: { id: true, title: true, slug: true, organization: { select: { name: true } } } } },
      }),
      prisma.candidateApplication.count({ where }),
    ]);

    const items = applications.map((app) => {
      const opp = app.internship;
      return {
        id: app.id,
        internshipId: opp.id,
        internshipTitle: opp.title,
        internshipSlug: opp.slug,
        companyName: opp.organization.name,
        status: app.status,
        submittedAt: app.appliedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(applicationListSchema.safeParse({ items, count: items.length, page, limit, total, pages: Math.ceil(total / limit) }).data);
  } catch (error) {
    console.error('[candidates/application] GET error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = z.object({
      internshipId: z.string(),
      action: z.enum(['submit', 'withdraw', 'update_status']),
      status: z.enum(['in_review', 'submitted', 'rejected', 'withdrawn', 'archived']).optional(),
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed.', details: parsed.error.flatten() }, { status: 400 });
    }

    const session = await requireUser();
    const userId = session.id;
    const { internshipId, action, status } = parsed.data;
    const application = await prisma.candidateApplication.findFirst({
      where: { applicantId: userId, internshipId },
    });

    if (action === 'submit') {
      if (application) {
        return NextResponse.json({ error: 'Already applied.' }, { status: 409 });
      }
      const valid = await prisma.internshipOpportunity.findUnique({
        where: { id: internshipId },
        select: { id: true },
      });
      if (!valid) {
        return NextResponse.json({ error: 'Internship not found.' }, { status: 404 });
      }

      const app = await prisma.candidateApplication.create({
        data: {
          applicantId: userId,
          internshipId,
          status: 'submitted',
        },
      });

      return NextResponse.json({ item: applicationResponseSchema.parse({ id: app.id, internshipId: app.internshipId, internshipTitle: '', internshipSlug: '', companyName: '', status: app.status, submittedAt: app.appliedAt.toISOString(), updatedAt: app.updatedAt.toISOString() }) }, { status: 201 });
    }

    if (action === 'withdraw' && application) {
      await prisma.candidateApplication.update({
        where: { id: application.id },
        data: { status: 'withdrawn' },
      });
      return NextResponse.json({ ok: true, message: 'Application withdrawn.' });
    }

    if (action === 'update_status' && application && status) {
      const updated = await prisma.candidateApplication.update({
        where: { id: application.id },
        data: { status },
      });
      return NextResponse.json({ item: applicationResponseSchema.parse({ id: updated.id, internshipId: updated.internshipId, internshipTitle: '', internshipSlug: '', companyName: '', status: updated.status, submittedAt: updated.appliedAt.toISOString(), updatedAt: updated.updatedAt.toISOString() }) });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('[candidates/application] POST error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

