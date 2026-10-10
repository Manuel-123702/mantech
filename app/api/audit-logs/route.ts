import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError } from '@/lib/authz';
import { requireAdminUser } from '@/lib/admin-dashboard';

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action')?.trim() || undefined;
    const entityType = searchParams.get('entityType')?.trim() || undefined;
    const actorRole = searchParams.get('actorRole')?.trim() || undefined;
    const take = Math.min(Math.max(Number(searchParams.get('take')) || 100, 1), 200);
    const skip = Math.max(Number(searchParams.get('skip')) || 0, 0);

    const where = {
      action: action ? { contains: action, mode: 'insensitive' as const } : undefined,
      entityType: entityType || undefined,
      actorRole: actorRole || undefined,
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: { actor: { select: { fullName: true, email: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({ logs, total });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
