import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthError, jsonError, requireUser } from '@/lib/authz';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { requestBoost } from '@/lib/boosts';
import { BOOST_MAX_DAYS, BOOST_MIN_DAYS } from '@/lib/boost-rules';

const schema = z.object({
  days: z.number().int().min(BOOST_MIN_DAYS).max(BOOST_MAX_DAYS),
  note: z.string().max(500).optional(),
});

/**
 * POST /api/opportunities/[id]/boost — an organization requests a visibility
 * boost for one of its PUBLISHED opportunities. An admin then approves or
 * rejects it from /dashboard/admin/boosts.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const membership = user.organizationMembers[0];
    if (!membership) {
      return NextResponse.json({ error: 'Only organization accounts can boost' }, { status: 403 });
    }

    const limit = rateLimit(clientKey(request, 'boost-request'), { limit: 5, windowMs: 600_000 });
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many requests, please retry later.' }, { status: 429 });
    }

    const { id } = await params;
    const body = schema.parse(await request.json());

    const result = await requestBoost({
      organizationId: membership.organizationId,
      requestedById: user.id,
      opportunityId: id,
      days: body.days,
      note: body.note,
    });

    if (result.ok) return NextResponse.json({ id: result.id }, { status: 201 });
    switch (result.code) {
      case 'NOT_FOUND':
        return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
      case 'NOT_PUBLISHED':
        return NextResponse.json(
          { error: 'Only published opportunities can be boosted' },
          { status: 409 },
        );
      case 'NOT_MEMBER':
        return NextResponse.json(
          { error: 'You cannot boost another organization’s opportunity' },
          { status: 403 },
        );
      case 'LIVE_BOOST_EXISTS':
      default:
        return NextResponse.json(
          { error: 'This opportunity already has a live boost request' },
          { status: 409 },
        );
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(jsonError(error).body, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('[boosts] request failed:', error);
    return NextResponse.json({ error: 'Could not file the boost request' }, { status: 400 });
  }
}