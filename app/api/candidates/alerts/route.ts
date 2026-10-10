import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, requireUser } from '@/lib/authz';
import { toCandidateAlert } from '@/lib/models/candidate-alert';

const alertResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categories: z.array(z.enum(['application', 'interview', 'placement', 'shortlist', 'contact', 'verification', 'package', 'system', 'report', 'evaluation', 'business'])),
  regions: z.array(z.string()),
  cities: z.array(z.string()),
  workModes: z.array(z.enum(['onsite', 'on-site', 'hybrid', 'remote'])),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const alertListSchema = z.object({
  items: z.array(alertResponseSchema),
  count: z.number(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
});

const alertInputSchema = z.object({
  categories: z.array(z.enum(['application', 'interview', 'placement', 'shortlist', 'contact', 'verification', 'package', 'system', 'report', 'evaluation', 'business'])).default([]),
  regions: z.array(z.string()).default([]),
  cities: z.array(z.string()).default([]),
  workModes: z.array(z.enum(['onsite', 'on-site', 'hybrid', 'remote'])).default([]),
});

const alertActionSchema = z.object({
  action: z.enum(['subscribe', 'unsubscribe', 'update']),
  data: alertInputSchema.optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const userId = user.id;

    const [rows, total] = await Promise.all([
      prisma.candidateAlert.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 1,
        select: {
          id: true,
          userId: true,
          categories: true,
          regions: true,
          cities: true,
          workModes: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.candidateAlert.count({ where: { userId } }),
    ]);

    const items = rows.map((r) => toCandidateAlert(r));
    const parsed = alertListSchema.safeParse({ items, count: items.length, page: 1, limit: 1, total: total ?? 0, pages: total ? 1 : 0 });
    if (!parsed.success) {
      return NextResponse.json({ error: 'Serialized response failed.' }, { status: 500 });
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error('[candidates/alerts] GET error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = z.object({
      action: z.enum(['subscribe', 'unsubscribe', 'update']), data: alertInputSchema.optional(),
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed.', details: parsed.error.flatten() }, { status: 400 });
    }

    const session = await requireUser();
    const userId = session.id;
    const { action, data } = parsed.data;

    if (action === 'subscribe') {
      const existing = await prisma.candidateAlert.findFirst({
        where: { userId },
      });
      if (existing) {
        return NextResponse.json({ error: 'Already subscribed.' }, { status: 409 });
      }

      const alert = await prisma.candidateAlert.create({
        data: {
          userId,
          categories: data?.categories ?? [],
          regions: data?.regions ?? [],
          cities: data?.cities ?? [],
          workModes: data?.workModes ?? [],
        },
      });

      return NextResponse.json({ item: alertResponseSchema.parse(toCandidateAlert(alert)) }, { status: 201 });
    }

    if (action === 'unsubscribe') {
      const deleted = await prisma.candidateAlert.deleteMany({
        where: { userId },
      });
      if (deleted.count === 0) {
        return NextResponse.json({ error: 'Not subscribed.' }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'update' && data) {
      const existing = await prisma.candidateAlert.findFirst({
        where: { userId },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Not subscribed.' }, { status: 404 });
      }

      const updated = await prisma.candidateAlert.update({
        where: { id: existing.id },
        data,
      });

      return NextResponse.json({ item: alertResponseSchema.parse(toCandidateAlert(updated)) });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('[candidates/alerts] POST error:', error);
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}

