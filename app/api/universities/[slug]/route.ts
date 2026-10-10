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
        universityProfile: true,
        region: true,
      },
    });

    if (!organization || organization.type !== 'UNIVERSITY') {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    return NextResponse.json({ university: organization });
  } catch (dbError) {
    logDatabaseUnavailable(`universities/${slug}`, dbError);
    // Option A: detail pages never invent a university — report the outage honestly.
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }
}
