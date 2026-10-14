import { NextResponse } from 'next/server';
import { z } from 'zod';
import { writeAudit } from '@/lib/audit';
import { requireAdminUser } from '@/lib/admin-dashboard';
import { AuthError, jsonError } from '@/lib/authz-policy';
import { approveBoost, rejectBoost } from '@/lib/boosts';

const schema = z.object({
  action: z.enum(['approve', 'reject']),
  resolution: z.string().max(500).optional(),
});

/**
 * Admin decision on a boost request: approve (activates the featured
 * placement for the requested window, respecting the package's featured
 * badge limit) or reject with an optional note.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { id } = await params;
    const body = schema.parse(await request.json());

    const result =
      body.action === 'approve'
        ? await approveBoost({ id, adminId: admin.id })
        : await rejectBoost({ id, adminId: admin.id, resolution: body.resolution });

    await writeAudit({
      actorId: admin.id,
      actorRole: admin.role,
      action: `BOOST_${body.action.toUpperCase()}`,
      entityType: 'Boost',
      entityId: result.id,
      details: { status: result.status },
      request,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(jsonError(error).body, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}