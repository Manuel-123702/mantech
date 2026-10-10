import type { PackageCode } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function getPackageLimits(code: PackageCode) {
  const pkg = await prisma.package.findUnique({ where: { code } });
  if (!pkg) throw new Error(`Package ${code} is missing from the database. Seed the package catalog.`);
  return {
    activeOpportunities: pkg.opportunityLimit,
    monthlyCandidateViews: pkg.candidateSearchLimit,
    recruiterAccounts: pkg.maxRecruiterAccounts,
    featuredBadges: pkg.featuredOpportunitiesLimit,
  };
}

export async function getPackageDefinition(code: PackageCode) {
  const pkg = await prisma.package.findUnique({ where: { code } });
  if (!pkg) throw new Error(`Package ${code} is missing from the database. Seed the package catalog.`);
  return pkg;
}
