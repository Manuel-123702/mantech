import { requireUniversityDashboard } from '@/lib/university-dashboard';
import { UniversityNav } from '@/components/university/university-nav';

export default async function UniversityDashboardLayout({ children }: { children: React.ReactNode }) {
  const { organization, universityProfile } = await requireUniversityDashboard({ requireOrg: false });

  if (!organization) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <UniversityNav
        orgName={organization.name}
        verificationStatus={organization.verificationStatus}
        canRecruit={universityProfile?.canRecruitInterns ?? true}
        canCoordinate={universityProfile?.supportsPlacementCoordination ?? true}
      />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
