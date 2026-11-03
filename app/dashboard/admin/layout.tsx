import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminNav } from '@/components/admin/admin-nav';
import { Badge } from '@/components/ui/badge';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdminDashboard();

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/images/admin_dash_bg.svg')" }}
    >
      {/* Dark overlay with backdrop blur */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />

      <div className="relative z-10 container-mantech px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              National Administration & Oversight
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              National Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Platform accreditation, member moderation, system telemetry & verified conventions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              {user.fullName || user.email}
            </span>
            <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold tracking-wide px-3 py-1 shadow-lg shadow-amber-500/20">
              PLATFORM ROOT ADMIN
            </Badge>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <AdminNav />
          </aside>
          <div className="min-w-0 bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
