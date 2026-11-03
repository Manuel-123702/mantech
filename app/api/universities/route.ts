import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { TOP_30_UNIVERSITIES } from '@/lib/cameroon-directory';

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

    if (universities && universities.length > 0) {
      return NextResponse.json({ universities });
    }

    // Fallback to Cameroon verified universities directory
    const mapped = TOP_30_UNIVERSITIES.map((u) => ({
      id: u.id,
      name: u.name,
      slug: u.slug,
      website: u.website,
      logoUrl: u.logoUrl,
      city: u.city,
      type: 'UNIVERSITY',
      verificationStatus: 'VERIFIED',
      description: u.description,
      region: { id: `reg-${u.region}`, name: u.region },
      universityProfile: {
        shortName: u.shortName,
        universityType: u.universityType,
        supportsPlacementCoordination: true,
        canRecruitInterns: true,
      },
    }));

    return NextResponse.json({ universities: mapped });
  } catch (error) {
    logDatabaseUnavailable('universities', error);
    const mapped = TOP_30_UNIVERSITIES.map((u) => ({
      id: u.id,
      name: u.name,
      slug: u.slug,
      website: u.website,
      logoUrl: u.logoUrl,
      city: u.city,
      type: 'UNIVERSITY',
      verificationStatus: 'VERIFIED',
      description: u.description,
      region: { id: `reg-${u.region}`, name: u.region },
      universityProfile: {
        shortName: u.shortName,
        universityType: u.universityType,
        supportsPlacementCoordination: true,
        canRecruitInterns: true,
      },
    }));
    return NextResponse.json({ universities: mapped });
  }
}
