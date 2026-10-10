import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

export async function GET() {
  try {
    const universities = await prisma.organization.findMany({
      where: {
        type: 'UNIVERSITY',
        verificationStatus: 'VERIFIED',
      },
      include: {
        universityProfile: true,
        region: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ universities });
  } catch (error) {
    logDatabaseUnavailable('universities', error);
    // Option A: no fake demo data — an unreachable DB yields an honest empty list.
    return NextResponse.json(
      { universities: [] },
      { status: 200, headers: { 'X-Data-Source': 'db-unavailable' } },
    );
  }
}
