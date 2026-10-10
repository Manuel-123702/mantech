import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        companyProfile: true,
        industry: true,
        region: true,
      },
    });

    if (!organization || organization.type !== 'COMPANY') {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const opportunities = await prisma.internshipOpportunity.findMany({
      where: {
        organizationId: organization.id,
        moderationStatus: 'PUBLISHED',
      },
      include: {
        field: true,
        specialization: true,
        region: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ company: organization, opportunities });
  } catch (dbError) {
    logDatabaseUnavailable(`companies/${slug}`, dbError);
    // Option A: detail pages never invent a company — report the outage honestly.
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }
}
