import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

export async function GET() {
  try {
    const companies = await prisma.organization.findMany({
      where: {
        type: 'COMPANY',
        verificationStatus: 'VERIFIED',
      },
      include: {
        companyProfile: true,
        region: true,
        industry: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    logDatabaseUnavailable('companies', error);
    // Option A: no fake demo data — an unreachable DB yields an honest empty list.
    return NextResponse.json(
      { companies: [] },
      { status: 200, headers: { 'X-Data-Source': 'db-unavailable' } },
    );
  }
}
