import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/authz';
import { AuthError } from '@/lib/authz-policy';
import { prisma } from '@/lib/prisma';
import type { MatchProfile } from '@/lib/matching';

export const dynamic = 'force-dynamic';

/**
 * Returns the signed-in intern's matching profile (skills, field, city,
 * region, preferred work mode) so the internships list can show a live
 * "match %" badge per opportunity. Guests or anyone without a completed
 * intern profile simply get `null`, and the UI hides the badges.
 */
export async function GET() {
  try {
    const user = await requireUser();

    const profile = await prisma.internProfile.findUnique({
      where: { userId: user.id },
      select: {
        city: true,
        preferredWorkMode: true,
        fieldOfStudy: { select: { name: true, slug: true } },
        region: { select: { name: true } },
        skills: { select: { skill: { select: { name: true } } } },
      },
    });

    if (!profile) {
      return NextResponse.json({ matchProfile: null as MatchProfile | null });
    }

    const matchProfile: MatchProfile = {
      skills: profile.skills.map((s) => s.skill.name),
      fieldSlug: profile.fieldOfStudy?.slug ?? null,
      fieldName: profile.fieldOfStudy?.name ?? null,
      city: profile.city ?? null,
      regionName: profile.region?.name ?? null,
      preferredWorkMode: profile.preferredWorkMode ?? null,
      wantsPaid: null,
    };

    return NextResponse.json({ matchProfile });
  } catch (error) {
    // Signed out is normal (badges are optional), so we return null
    // instead of a scary error.
    if (error instanceof AuthError) {
      return NextResponse.json({ matchProfile: null as MatchProfile | null });
    }
    console.error('[api/me/match-profile] unexpected error');
    return NextResponse.json(
      { matchProfile: null as MatchProfile | null },
      { status: 500 },
    );
  }
}
