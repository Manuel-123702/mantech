import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { syncDbUser } from '@/lib/authz';

export type UniversityDashboardMode = 'placement' | 'recruiter';

export async function requireUniversityDashboard(opts?: { requireOrg?: boolean }) {
  const user = await syncDbUser();
  if (!user) redirect('/sign-in?redirect_url=/dashboard/university');
  if (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN') redirect('/dashboard');

  const membership = user.organizationMembers[0];
  if (!membership) {
    if (opts?.requireOrg !== false) redirect('/dashboard/university/setup');
    return { user, membership: null, organization: null, universityProfile: null };
  }

  const organization = await prisma.organization.findUnique({
    where: { id: membership.organizationId },
    include: {
      universityProfile: true,
      region: true,
      members: { include: { user: true } },
      subscriptions: { include: { package: true }, orderBy: { requestedAt: 'desc' } },
    },
  });

  if (!organization) redirect('/dashboard/university/setup');
  const universityProfile = organization.universityProfile;

  return {
    user,
    membership,
    organization,
    universityProfile,
  };
}

export function resolveDashboardMode(
  modeParam: string | null | undefined,
  profile: { canRecruitInterns?: boolean; supportsPlacementCoordination?: boolean } | null
): UniversityDashboardMode {
  if (modeParam === 'recruiter' && profile?.canRecruitInterns !== false) return 'recruiter';
  if (modeParam === 'placement' && profile?.supportsPlacementCoordination !== false) return 'placement';
  if (profile?.supportsPlacementCoordination === true) return 'placement';
  return 'recruiter';
}

export async function requirePlacementMode() {
  const ctx = await requireUniversityDashboard();
  if (ctx.universityProfile && !ctx.universityProfile.supportsPlacementCoordination) {
    redirect('/dashboard/university?mode=recruiter');
  }
  return ctx;
}

export async function requireUniversityRecruiterMode() {
  const ctx = await requireUniversityDashboard();
  if (ctx.universityProfile && !ctx.universityProfile.canRecruitInterns) {
    redirect('/dashboard/university');
  }
  return ctx;
}
