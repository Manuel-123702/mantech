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
        <h2 className="text-lg font-bold text-slate-900">Organization registry</h2>
        <p className="mt-1 text-xs text-slate-500">
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
              activeType === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value === 'ALL' ? 'All types' : value === 'COMPANY' ? 'Companies' : 'Universities'}
          </Link>
        ))}
        <form action="/dashboard/admin/organizations" className="ml-auto flex items-center gap-2">
          <input type="hidden" name="type" value={activeType} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name..."
            className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white">
            Search
          </button>
        </form>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No organizations match this filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3">Opps</th>
                  <th className="px-4 py-3">Placements</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((organization) => {
                  const Icon = organization.type === 'UNIVERSITY' ? Landmark : Building2;
                  return (
                    <tr key={organization.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <div>
                            <p className="font-semibold text-slate-900">{organization.name}</p>
                            <p className="text-[10px] text-slate-500">
                              {organization.type}
                              {organization.industry?.name ? ` · ${organization.industry.name}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {[organization.city, organization.region?.name].filter(Boolean).join(', ') || 'Cameroon'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            organization.verificationStatus === 'VERIFIED'
                              ? 'default'
                              : organization.verificationStatus === 'SUSPENDED'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {organization.verificationStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{organization.packageCode}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">{organization._count.members}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">{organization._count.opportunities}</td>
                      <td className="px-4 py-3 font-mono text-slate-700">{organization._count.placements}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {organization.verificationStatus !== 'VERIFIED' && (
                            <AdminActionButton
                              endpoint={`/api/admin/verifications/${organization.id}`}
                              payload={{ action: 'approve' }}
                              label="Verify"
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                            />
                          )}
                          {organization.verificationStatus !== 'SUSPENDED' && (
                            <AdminActionButton
                              endpoint={`/api/admin/verifications/${organization.id}`}
                              payload={{ action: 'suspend' }}
                              label="Suspend"
                              variant="outline"
                              reasonLabel="Suspension reason (shared with the organization)"
                              reasonField="note"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
