import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { TOP_30_COMPANIES } from '@/lib/cameroon-directory';

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

    if (companies && companies.length > 0) {
      return NextResponse.json({ companies });
    }

    // Fallback to Cameroon verified directory when DB is unseeded or sleeping
    const mapped = TOP_30_COMPANIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      website: c.website,
      logoUrl: c.logoUrl,
      city: c.city,
      type: 'COMPANY',
      verificationStatus: 'VERIFIED',
      description: c.description,
      region: { id: `reg-${c.region}`, name: c.region },
      industry: { id: `ind-${c.industry}`, name: c.industry },
      companyProfile: {
        size: c.size,
        companyType: c.industry,
      },
    }));

    return NextResponse.json({ companies: mapped });
  } catch (error) {
    logDatabaseUnavailable('companies', error);
    const mapped = TOP_30_COMPANIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      website: c.website,
      logoUrl: c.logoUrl,
      city: c.city,
      type: 'COMPANY',
      verificationStatus: 'VERIFIED',
      description: c.description,
      region: { id: `reg-${c.region}`, name: c.region },
      industry: { id: `ind-${c.industry}`, name: c.industry },
      companyProfile: {
        size: c.size,
        companyType: c.industry,
      },
    }));
    return NextResponse.json({ companies: mapped });
  }
}
