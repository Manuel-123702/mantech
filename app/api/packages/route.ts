import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        priceXAF: true,
        opportunityLimit: true,
        candidateSearchLimit: true,
        maxRecruiterAccounts: true,
        featuredOpportunitiesLimit: true,
        isFeaturedBadge: true,
        prioritySupport: true,
        description: true,
        features: true,
      },
      orderBy: { priceXAF: 'asc' },
    });
    return NextResponse.json({ packages });
  } catch (error) {
    logDatabaseUnavailable('packages', error);
    // Option A: packages live in the DB (admin-managed) — never substituted.
    return NextResponse.json(
      { packages: [] },
      { status: 200, headers: { 'X-Data-Source': 'db-unavailable' } },
    );
  }
}
