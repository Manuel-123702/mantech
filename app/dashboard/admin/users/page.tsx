import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton, AdminRoleForm } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';

const ROLES = ['ALL', 'INTERN', 'COMPANY', 'UNIVERSITY', 'ADMIN'] as const;
const STATUSES = ['ALL', 'active', 'suspended', 'pending'] as const;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; q?: string }>;
}) {
  await requireAdminDashboard();
  const { role, status, q } = await searchParams;
  const activeRole = (ROLES as readonly string[]).includes(role || '') ? (role as string) : 'ALL';
  const activeStatus = (STATUSES as readonly string[]).includes(status || '') ? (status as string) : 'ALL';
  const query = (q || '').trim();

  const where = {
    role: activeRole === 'ALL' ? undefined : (activeRole as 'INTERN' | 'COMPANY' | 'UNIVERSITY' | 'ADMIN'),
    status: activeStatus === 'ALL' ? undefined : activeStatus,
    OR: query
      ? [
          { fullName: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
        ]
      : undefined,
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        organizationMembers: { include: { organization: { select: { name: true, type: true } } } },
        internProfile: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
    prisma.user.count({ where }),
  ]);

  const buildHref = (nextRole: string, nextStatus: string) => {
    const params = new URLSearchParams();
    params.set('role', nextRole);
    params.set('status', nextStatus);
    if (query) params.set('q', query);
    return `/dashboard/admin/users?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">User moderation</h2>
        <p className="mt-1 text-xs text-slate-500">
          {total} user account(s). Suspended accounts cannot use their dashboards. Role changes apply to platform
          authorization; ADMIN roles are provisioned through Clerk metadata only.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ROLES.map((value) => (
          <Link
            key={value}
            href={buildHref(value, activeStatus)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeRole === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value}
          </Link>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={buildHref(activeRole, value)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value}
          </Link>
        ))}
        <form action="/dashboard/admin/users" className="ml-auto flex items-center gap-2">
          <input type="hidden" name="role" value={activeRole} />
          <input type="hidden" name="status" value={activeStatus} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name or email..."
            className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white">
            Search
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No users match this filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{user.fullName}</p>
                      <p className="text-[10px] text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : user.status === 'suspended'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {user.organizationMembers[0]?.organization.name || (user.internProfile ? 'Intern profile' : '—')}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                      {user.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {user.status === 'suspended' ? (
                          <AdminActionButton
                            endpoint={`/api/admin/users/${user.id}`}
                            payload={{ action: 'reactivate' }}
                            label="Reactivate"
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                          />
                        ) : (
                          <AdminActionButton
                            endpoint={`/api/admin/users/${user.id}`}
                            payload={{ action: 'suspend' }}
                            label="Suspend"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            reasonLabel="Suspension reason (sent to the user)"
                            reasonField="note"
                          />
                        )}
                        {user.role !== 'ADMIN' && <AdminRoleForm userId={user.id} currentRole={user.role} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
