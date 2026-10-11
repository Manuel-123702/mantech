import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { syncDbUser } from '@/lib/authz';

export async function requireCompanyDashboard(opts?: { requireOrg?: boolean }) {
  const user = await syncDbUser();
  if (!user) redirect('/sign-in?redirect_url=/dashboard/company');
  if (user.status === 'suspended') redirect('/suspended');
  // Access is controlled by the email two-factor gate in middleware.ts, so any
  // signed-in member who verified may open the Company workspace. Members with
  // no organization yet are sent to setup by the caller (requireOrg).

  const membership = user.organizationMembers[0];
  if (!membership) {
    if (opts?.requireOrg !== false) redirect('/dashboard/company/setup');
    return { user, membership: null, organization: null };
  }

  const organization = await prisma.organization.findUnique({
    where: { id: membership.organizationId },
    include: {
      companyProfile: true,
      industry: true,
      region: true,
      members: { include: { user: true } },
      subscriptions: { include: { package: true }, orderBy: { requestedAt: 'desc' } },
    },
  });

  if (!organization) redirect('/dashboard/company/setup');
  return { user, membership, organization };
}
