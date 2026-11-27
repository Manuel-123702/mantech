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
        <h2 className="text-lg font-bold text-white break-words">User moderation</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
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
              activeRole === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value}
          </Link>
        ))}
        <span className="hidden sm:inline-block mx-1 h-5 w-px bg-slate-700" />
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={buildHref(activeRole, value)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value}
          </Link>
        ))}
        <form action="/dashboard/admin/users" className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 mt-2 sm:mt-0">
          <input type="hidden" name="role" value={activeRole} />
          <input type="hidden" name="status" value={activeStatus} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name or email..."
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

      {users.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">No users match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-white break-words">{user.fullName}</p>
                    <Badge
                      className={
                        user.role === 'ADMIN'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }
                    >
                      {user.role}
                    </Badge>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        user.status === 'active'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          : user.status === 'suspended'
                            ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 break-all">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    <span className="break-words">
                      Org/Profile:{' '}
                      <strong className="text-slate-200">
                        {user.organizationMembers[0]?.organization.name || (user.internProfile ? 'Candidate profile' : '—')}
                      </strong>
                    </span>
                    <span className="font-mono">Joined {user.createdAt.toISOString().slice(0, 10)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {user.status === 'suspended' ? (
                    <AdminActionButton
                      endpoint={`/api/admin/users/${user.id}`}
                      payload={{ action: 'reactivate' }}
                      label="Reactivate"
                      className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                    />
                  ) : (
                    <AdminActionButton
                      endpoint={`/api/admin/users/${user.id}`}
                      payload={{ action: 'suspend' }}
                      label="Suspend"
                      className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                      reasonLabel="Suspension reason (sent to the user)"
                      reasonField="note"
                    />
                  )}
                  {user.role !== 'ADMIN' && <AdminRoleForm userId={user.id} currentRole={user.role} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
