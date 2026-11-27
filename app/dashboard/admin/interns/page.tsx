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
        <h2 className="text-lg font-bold text-white break-words">Candidates &amp; Talent Passports</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          {total} profile(s) in this view. CV metadata is shown for moderation only — CV contents are never displayed
          here and remain accessible exclusively through audited flows.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Candidate profiles', value: profileCount },
          { label: 'Passports issued', value: passportCount },
          { label: 'Passports unverified', value: unverifiedCount },
          { label: 'CVs discoverable', value: searchableCount },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 break-words">{item.label}</p>
            <p className="mt-1 font-mono text-xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PASSPORT_FILTERS.map((value) => (
          <Link
            key={value}
            href={buildHref(value)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
              activePassport === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value === 'ALL' ? 'All passports' : value === 'verified' ? 'Verified' : 'Unverified'}
          </Link>
        ))}
        <form action="/dashboard/admin/interns" className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 mt-2 sm:mt-0">
          <input type="hidden" name="passport" value={activePassport} />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name, email or passport no..."
            className="flex-1 sm:w-64 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-500 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">No candidate profiles match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-white break-words">{profile.user.fullName}</p>
                    {profile.user.status === 'suspended' && (
                      <span className="rounded-full bg-rose-950/70 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-300">
                        suspended
                      </span>
                    )}
                    {profile.passport && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          profile.passport.isVerified
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {profile.passport.isVerified ? 'verified' : 'unverified'} · {profile.passport.passportNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 break-all">{profile.user.email}</p>

                  <div className="grid gap-2 sm:grid-cols-3 text-xs pt-1">
                    <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Field & Location</p>
                      <p className="font-semibold text-slate-200 mt-0.5 break-words">
                        {profile.fieldOfStudy?.name || profile.qualification}
                      </p>
                      <p className="text-[11px] text-slate-400 break-words">
                        {[profile.specialization?.name, profile.city, profile.region?.name].filter(Boolean).join(' · ') || 'No location set'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Readiness & Activity</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-amber-500"
                            style={{ width: `${Math.min(100, profile.readinessScore)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-white">{profile.readinessScore}%</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {profile._count.applications} app(s) · {profile._count.placements} placement(s)
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">CV Metadata</p>
                      <p className="font-semibold text-slate-200 mt-0.5 break-all">
                        {profile.cvFileName || 'No CV file name'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {profile.isCvSearchable ? 'Discoverable' : 'Hidden'}
                        {profile.cvFileSize ? ` · ${Math.round(profile.cvFileSize / 1024)} KB` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start lg:justify-end shrink-0">
                  {profile.passport ? (
                    profile.passport.isVerified ? (
                      <AdminActionButton
                        endpoint={`/api/admin/passports/${profile.passport.id}`}
                        payload={{ isVerified: false }}
                        label="Remove verification"
                        method="PATCH"
                        className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                        confirmText="Remove verification from this Talent Passport? The candidate will be notified."
                      />
                    ) : (
                      <AdminActionButton
                        endpoint={`/api/admin/passports/${profile.passport.id}`}
                        payload={{ isVerified: true }}
                        label="Verify passport"
                        method="PATCH"
                        className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                      />
                    )
                  ) : (
                    <span className="text-xs text-slate-500">No passport</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
