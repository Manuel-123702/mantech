import { requireUniversityDashboard } from '@/lib/university-dashboard';
import { UniversityNav } from '@/components/university/university-nav';

export default async function UniversityDashboardLayout({ children }: { children: React.ReactNode }) {
  const { organization, universityProfile } = await requireUniversityDashboard({ requireOrg: false });

  if (!organization) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-fixed text-white"
        style={{ backgroundImage: "url('/images/university_dash_bg.svg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />
        <div className="relative z-10 p-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen relative bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/images/university_dash_bg.svg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />

      <div className="relative z-10 flex w-full">
        <UniversityNav
          orgName={organization.name}
          verificationStatus={organization.verificationStatus}
          canRecruit={universityProfile?.canRecruitInterns ?? true}
          canCoordinate={universityProfile?.supportsPlacementCoordination ?? true}
        />
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-700/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-slate-100">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
