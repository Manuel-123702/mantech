import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { CompanyNav } from '@/components/company/company-nav';
import { Badge } from '@/components/ui/badge';

export default async function CompanyDashboardLayout({ children }: { children: React.ReactNode }) {
  const { organization } = await requireCompanyDashboard({ requireOrg: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-mantech px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Company workspace</p>
            <h1 className="text-2xl font-bold text-slate-900">{organization?.name || 'Set up your organization'}</h1>
          </div>
          {organization && (
            <div className="flex items-center gap-2">
              <Badge variant={organization.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                {organization.verificationStatus}
              </Badge>
              <Badge variant="outline">{organization.packageCode}</Badge>
            </div>
          )}
        </div>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border bg-white p-3 shadow-sm">
            <CompanyNav />
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
