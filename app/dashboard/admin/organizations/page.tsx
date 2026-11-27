import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Building2, Landmark, MapPin } from 'lucide-react';

const TYPES = ['ALL', 'COMPANY', 'UNIVERSITY'] as const;

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>;
}) {
  await requireAdminDashboard();
  const { type, q } = await searchParams;
  const activeType = (TYPES as readonly string[]).includes(type || '') ? (type as string) : 'ALL';
  const query = (q || '').trim();

  const where = {
    type: activeType === 'ALL' ? undefined : (activeType as 'COMPANY' | 'UNIVERSITY'),
    name: query ? { contains: query, mode: 'insensitive' as const } : undefined,
  };

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      include: {
        region: true,
        industry: { select: { name: true } },
        _count: { select: { members: true, opportunities: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
    prisma.organization.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white break-words">Organization registry</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          {total} registered organization(s). Suspending an organization immediately blocks its recruiter privileges
          and is recorded in the audit trail.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TYPES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/organizations?type=${value}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeType === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value === 'ALL' ? 'All types' : value === 'COMPANY' ? 'Companies' : 'Universities'}
          </Link>
        ))}
        <form action="/dashboard/admin/organizations" className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 mt-2 sm:mt-0">
          <input type="hidden" name="type" value={activeType} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name..."
            className="flex-1 sm:w-56 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-500 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">No organizations match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {organizations.map((organization) => {
            const Icon = organization.type === 'UNIVERSITY' ? Landmark : Building2;
            return (
              <div
                key={organization.id}
                className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-amber-400" />
                      <p className="text-sm font-bold text-white break-words">{organization.name}</p>
                      <Badge
                        className={
                          organization.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                            : organization.verificationStatus === 'SUSPENDED'
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                        }
                      >
                        {organization.verificationStatus}
                      </Badge>
                      <Badge className="bg-slate-800 text-slate-200 border border-slate-700">
                        {organization.packageCode}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>
                        {organization.type}
                        {organization.industry?.name ? ` · ${organization.industry.name}` : ''}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {[organization.city, organization.region?.name].filter(Boolean).join(', ') || 'Cameroon'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 pt-1">
                      <span><strong className="font-mono text-white">{organization._count.members}</strong> Members</span>
                      <span><strong className="font-mono text-white">{organization._count.opportunities}</strong> Opps</span>
                      <span><strong className="font-mono text-white">{organization._count.placements}</strong> Placements</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {organization.verificationStatus !== 'VERIFIED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/verifications/${organization.id}`}
                        payload={{ action: 'approve' }}
                        label="Verify"
                        className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                      />
                    )}
                    {organization.verificationStatus !== 'SUSPENDED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/verifications/${organization.id}`}
                        payload={{ action: 'suspend' }}
                        label="Suspend"
                        className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                        reasonLabel="Suspension reason (shared with the organization)"
                        reasonField="note"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
