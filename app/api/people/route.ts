import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || 12), 1), 50);

    const users = await prisma.user.findMany({
      where: {
        role: 'INTERN',
        status: 'active',
      },
      include: {
        internProfile: {
          select: {
            id: true,
            qualification: true,
            city: true,
            cvUrl: true,
            profileCompleted: true,
            skills: {
              include: { skill: { select: { name: true } } },
              take: 5,
            },
            educations: {
              select: { institution: true, qualification: true },
              take: 2,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ people: users });
  } catch (error) {
    logDatabaseUnavailable('people', error);
    return NextResponse.json(
      { people: [] },
      { status: 200, headers: { 'X-Data-Source': 'db-unavailable' } },
    );
  }
}
