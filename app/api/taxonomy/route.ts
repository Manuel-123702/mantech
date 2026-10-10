import { NextResponse } from 'next/server';
import { prisma, withDatabaseRetry } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

export async function GET() {
  try {
    const [fields, regions, industries, skills, packages] = await withDatabaseRetry(() =>
      Promise.all([
        prisma.field.findMany({
          where: { isActive: true },
          include: { specializations: { where: { isActive: true }, orderBy: { name: 'asc' } } },
          orderBy: { name: 'asc' },
        }),
        prisma.region.findMany({
          where: { isActive: true },
          include: { locations: { where: { isActive: true }, orderBy: { city: 'asc' } } },
          orderBy: { name: 'asc' },
        }),
        prisma.industry.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
        prisma.skill.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, take: 200 }),
        prisma.package.findMany({ orderBy: { priceXAF: 'asc' } }),
      ]),
    );

    return NextResponse.json({ fields, regions, industries, skills, packages });
  } catch (error) {
    logDatabaseUnavailable('taxonomy', error);
    // Option A: reference data is seeded into the DB and admin-managed —
    // an unreachable DB yields empty lists rather than a stale hardcode.
    return NextResponse.json(
      { fields: [], regions: [], industries: [], skills: [], packages: [] },
      { status: 200, headers: { 'X-Data-Source': 'db-unavailable' } }
    );
  }
}
