import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminNav } from '@/components/admin/admin-nav';
import { Badge } from '@/components/ui/badge';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdminDashboard();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-mantech px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">MANTECH Nexus</p>
            <h1 className="text-2xl font-bold text-slate-900">National Admin Control Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{user.fullName}</span>
            <Badge variant="default">ADMIN</Badge>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border bg-white p-3 shadow-sm">
            <AdminNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
