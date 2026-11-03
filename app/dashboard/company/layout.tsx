import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { CompanyNav } from '@/components/company/company-nav';
import { Badge } from '@/components/ui/badge';

export default async function CompanyDashboardLayout({ children }: { children: React.ReactNode }) {
  const { organization } = await requireCompanyDashboard({ requireOrg: false });

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/images/company_dash_bg.svg')" }}
    >
      {/* Dark overlay with backdrop blur */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />

      <div className="relative z-10 container-mantech px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Corporate Recruiter Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {organization?.name || 'Enterprise Talent Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Publish internships and jobs, screen verified talent & coordinate interviews.
            </p>
          </div>
          {organization && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={organization.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'} className={organization.verificationStatus === 'VERIFIED' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}>
                {organization.verificationStatus}
              </Badge>
              <Badge variant="outline" className="border-emerald-400/40 text-emerald-300 font-semibold bg-emerald-950/40">
                {organization.packageCode || 'FREE ENTERPRISE'}
              </Badge>
            </div>
          )}
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <CompanyNav />
          </aside>
          <div className="min-w-0 bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
