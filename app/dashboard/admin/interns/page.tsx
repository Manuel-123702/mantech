import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';

const PASSPORT_FILTERS = ['ALL', 'verified', 'unverified'] as const;

export default async function AdminInternsPage({
  searchParams,
}: {
  searchParams: Promise<{ passport?: string; q?: string }>;
}) {
  await requireAdminDashboard();
  const { passport, q } = await searchParams;
  const activePassport = (PASSPORT_FILTERS as readonly string[]).includes(passport || '')
    ? (passport as string)
    : 'ALL';
  const query = (q || '').trim();

  const where = {
    ...(activePassport === 'verified'
      ? { passport: { isVerified: true } }
      : activePassport === 'unverified'
        ? { passport: { isVerified: false } }
        : {}),
    ...(query
      ? {
          OR: [
            { user: { fullName: { contains: query, mode: 'insensitive' as const } } },
            { user: { email: { contains: query, mode: 'insensitive' as const } } },
            { passport: { passportNumber: { contains: query, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  };

  const [profiles, total, profileCount, passportCount, unverifiedCount, searchableCount] = await Promise.all([
    prisma.internProfile.findMany({
      where,
      include: {
        user: { select: { fullName: true, email: true, status: true } },
        fieldOfStudy: { select: { name: true } },
        specialization: { select: { name: true } },
        region: { select: { name: true } },
        passport: { select: { id: true, passportNumber: true, isVerified: true, viewCount: true, totalHoursCompleted: true } },
        _count: { select: { applications: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
    prisma.internProfile.count({ where }),
    prisma.internProfile.count(),
    prisma.internPassport.count(),
    prisma.internPassport.count({ where: { isVerified: false } }),
    prisma.internProfile.count({ where: { isCvSearchable: true } }),
  ]);

  const buildHref = (nextPassport: string) => {
    const params = new URLSearchParams();
    params.set('passport', nextPassport);
    if (query) params.set('q', query);
    return `/dashboard/admin/interns?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Interns &amp; Intern Passports</h2>
        <p className="mt-1 text-xs text-slate-500">
          {total} profile(s) in this view. CV metadata is shown for moderation only — CV contents are never displayed
          here and remain accessible exclusively through audited recruiter flows.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Intern profiles', value: profileCount },
          { label: 'Passports issued', value: passportCount },
          { label: 'Passports unverified', value: unverifiedCount },
          { label: 'CVs discoverable', value: searchableCount },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PASSPORT_FILTERS.map((value) => (
          <Link
            key={value}
            href={buildHref(value)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activePassport === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value === 'ALL' ? 'All passports' : value === 'verified' ? 'Verified' : 'Unverified'}
          </Link>
        ))}
        <form action="/dashboard/admin/interns" className="ml-auto flex items-center gap-2">
          <input type="hidden" name="passport" value={activePassport} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name, email or passport no..."
            className="w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white">
            Search
          </button>
        </form>
      </div>

      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No intern profiles match this filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Intern</th>
                  <th className="px-4 py-3">Field &amp; location</th>
                  <th className="px-4 py-3">Readiness</th>
                  <th className="px-4 py-3">Intern Passport</th>
                  <th className="px-4 py-3">CV metadata</th>
                  <th className="px-4 py-3 text-right">Passport moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {profile.user.fullName}
                        {profile.user.status === 'suspended' && (
                          <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                            suspended
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500">{profile.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{profile.fieldOfStudy?.name || profile.qualification}</p>
                      <p className="text-[10px] text-slate-500">
                        {[profile.specialization?.name, profile.city, profile.region?.name].filter(Boolean).join(' · ') ||
                          'No location set'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-900"
                            style={{ width: `${Math.min(100, profile.readinessScore)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{profile.readinessScore}%</span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {profile._count.applications} application(s) · {profile._count.placements} placement(s)
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {profile.passport ? (
                        <>
                          <p className="font-mono text-[11px] font-semibold text-slate-800">
                            {profile.passport.passportNumber}
                          </p>
                          <p className="mt-0.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                profile.passport.isVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {profile.passport.isVerified ? 'verified' : 'unverified'}
                            </span>
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {profile.passport.viewCount} view(s) · {profile.passport.totalHoursCompleted}h logged
                          </p>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400">No passport issued</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {profile.cvFileName ? (
                        <>
                          <p className="max-w-[160px] truncate text-[11px] text-slate-700">{profile.cvFileName}</p>
                          <p className="text-[10px] text-slate-500">
                            {profile.cvFileSize ? `${Math.round(profile.cvFileSize / 1024)} KB · ` : ''}
                            {profile.cvUploadedAt ? profile.cvUploadedAt.toISOString().slice(0, 10) : 'date unknown'}
                          </p>
                        </>
                      ) : (
                        <p className="text-[10px] text-slate-500">CV on file (no metadata)</p>
                      )}
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {profile.isCvSearchable ? 'Discoverable by verified recruiters' : 'Hidden from search'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        {profile.passport ? (
                          profile.passport.isVerified ? (
                            <AdminActionButton
                              endpoint={`/api/admin/passports/${profile.passport.id}`}
                              payload={{ isVerified: false }}
                              label="Remove verification"
                              method="PATCH"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              confirmText="Remove verification from this Intern Passport? The intern will be notified."
                            />
                          ) : (
                            <AdminActionButton
                              endpoint={`/api/admin/passports/${profile.passport.id}`}
                              payload={{ isVerified: true }}
                              label="Verify passport"
                              method="PATCH"
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                            />
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
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
