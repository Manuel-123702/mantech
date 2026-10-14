import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';
import { getOrganizationResponseStats } from '@/lib/response-rate';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const opportunity = await prisma.internshipOpportunity.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        organization: { include: { companyProfile: true, industry: true, region: true } },
        field: true,
        specialization: true,
        region: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    try {
      await prisma.internshipOpportunity.update({
        where: { id: opportunity.id },
        data: { viewCount: { increment: 1 } },
      });
    } catch {
      // Non-fatal: view counter update failure should not break page render
    }

    // Trust signal: the employer's historical reply behaviour, shown next to
    // the posting so interns can weigh "will I even hear back?".
    const responseRate = await getOrganizationResponseStats(opportunity.organizationId);

    return NextResponse.json({ opportunity, organization: opportunity.organization, responseRate });
  } catch (dbError) {
    logDatabaseUnavailable(`internships/${id}`, dbError);
    // Option A: detail pages never invent an opportunity — report the outage honestly.
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }
}
