import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { AuthError, requireUser } from '@/lib/authz';

const updateSchema = z.object({
  ids: z.array(z.string().uuid()).max(100).optional(),
  markAllRead: z.boolean().optional(),
}).refine(value => Boolean(value.markAllRead) || Boolean(value.ids?.length), {
  message: 'Provide notification IDs or markAllRead.',
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const rawLimit = Number(request.nextUrl.searchParams.get('limit') || 30);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 30;
    const cursor = request.nextUrl.searchParams.get('cursor');
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    const hasMore = notifications.length > limit;
    const page = hasMore ? notifications.slice(0, limit) : notifications;
    return NextResponse.json({
      notifications: page,
      nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
      unreadCount: await prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('GET /api/notifications failed', error);
    return NextResponse.json({ error: 'Unable to load notifications.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid request.' }, { status: 400 });
    const { ids, markAllRead } = parsed.data;
    const result = await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false, ...(markAllRead ? {} : { id: { in: ids } }) },
      data: { isRead: true },
    });
    return NextResponse.json({ updated: result.count });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('PATCH /api/notifications failed', error);
    return NextResponse.json({ error: 'Unable to update notifications.' }, { status: 500 });
  }
}
