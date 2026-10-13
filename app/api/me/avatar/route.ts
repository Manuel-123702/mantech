import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/authz';
import { AuthError } from '@/lib/authz-policy';

export const runtime = 'nodejs';

/** Replaces the signed-in intern's profile photo (Clerk avatar URL). */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { avatarUrl } = body ?? {};

    if (typeof avatarUrl !== 'string' || !avatarUrl) {
      return NextResponse.json(
        { error: 'avatarUrl is required' },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: updated.avatarUrl,
    });
  } catch (error) {
    console.error('[api/me/avatar] unexpected error:', error);
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Could not update avatar' }, { status: 500 });
  }
}
