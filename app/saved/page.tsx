import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ArrowLeft, BookmarkCheck, Briefcase, Building2, Heart, MapPin, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { logDatabaseUnavailable } from '@/lib/db-health';

type SavedRow = {
  id: string;
  savedAt: Date;
  notes?: string | null;
  opportunity: {
    id: string;
    slug: string;
    title: string;
    workMode?: string | null;
    city?: string | null;
    durationMonths?: number | null;
    deadline?: Date | null;
    regionId?: string | null;
    field?: { name: string } | null;
    fieldId?: string | null;
    organization: { name: string; slug?: string | null; logoUrl?: string | null };
  };
  isExample?: boolean;
};

async function getSaved(): Promise<{ userSignedIn: boolean; items: SavedRow[] }> {
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    // Option A: visitors who are not signed in see the sign-in call to
    // action — never fabricated "example" saved rows.
    return { userSignedIn: false, items: [] };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        savedOpportunities: {
          include: {
            opportunity: {
              include: {
                organization: { select: { name: true, slug: true, logoUrl: true } },
                field: { select: { name: true } },
              },
            },
          },
          orderBy: { savedAt: 'desc' },
        },
      },
    });

    if (!user) return { userSignedIn: true, items: [] };
    const saved = user.savedOpportunities || [];

    const items: SavedRow[] = saved.map((s: any) => ({
      id: s.id,
      savedAt: s.savedAt,
      notes: s.notes,
      opportunity: {
        id: s.opportunity.id,
        slug: s.opportunity.slug,
        title: s.opportunity.title,
        workMode: s.opportunity.workMode,
        city: s.opportunity.city,
        durationMonths: s.opportunity.durationMonths,
        deadline: s.opportunity.deadline,
        regionId: s.opportunity.regionId,
        field: s.opportunity.field ? { name: s.opportunity.field.name } : null,
        fieldId: s.opportunity.fieldId,
        organization: s.opportunity.organization
          ? {
              name: s.opportunity.organization.name,
              slug: s.opportunity.organization.slug,
              logoUrl: s.opportunity.organization.logoUrl,
            }
          : { name: 'Organization', slug: null, logoUrl: null },
      },
    }));

    return { userSignedIn: true, items };
  } catch (err) {
    logDatabaseUnavailable('saved/page', err);
    // Option A: an unreachable DB yields an empty list, never demo rows.
    return { userSignedIn: true, items: [] };
  }
}

type PageProps = { searchParams?: Promise<{ field?: string }> };

export const metadata = {
  title: 'Saved Opportunities · MANTECH Nexus',
  description: 'Review the internship postings you bookmarked on MANTECH Nexus and plan your next applications.',
};

export default async function SavedPage(props: PageProps) {
  const search = await props.searchParams;
  const fieldFilter = search?.field?.toLowerCase() || 'all';

  const { userSignedIn, items } = await getSaved();

  const fieldFilters = [
    { id: 'all', name: 'All fields' },
    ...items
      .flatMap((s) =>
        s.opportunity.fieldId && s.opportunity.field
          ? [{ id: String(s.opportunity.fieldId), name: s.opportunity.field.name }]
          : [],
      )
      .filter((f, index, list) => list.findIndex((other) => other.id === f.id) === index),
  ];

  const filtered =
    fieldFilter === 'all'
      ? items
      : items.filter((s) => s.opportunity.fieldId && String(s.opportunity.fieldId) === String(fieldFilter));

  const byFieldCount = items.reduce<Record<string, number>>((acc, s) => {
    if (s.opportunity.fieldId) {
      const key = String(s.opportunity.fieldId);
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-slate-950 to-fuchsia-900 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="saved-dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" className="text-rose-300" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#saved-dots)" />
          </svg>
        </div>
        <div className="container-mantech relative px-4 sm:px-6 lg:px-8">
          <Link href="/internships" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Browse opportunities
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1 text-xs font-semibold text-rose-100">
              <Heart className="h-3.5 w-3.5" />
              Saved Opportunities
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">
              {userSignedIn ? 'Your Shortlist' : 'Bookmark Your Favorites'}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-200">
              {userSignedIn
                ? `You've saved ${items.length} posting${items.length === 1 ? '' : 's'} — revisit them anytime to compare roles, refine your cover letter, and submit your applications when you're ready.`
                : 'Sign in to save internship postings you love and return to them later. The cards below preview what your saved shortlist will look like with example openings from our catalog.'}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-wider text-rose-200/80">Saved</div>
              <div className="mt-1 flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-rose-200" />
                <div className="text-2xl font-bold">{items.length}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-wider text-rose-200/80">Companies</div>
              <div className="mt-1 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-rose-200" />
                <div className="text-2xl font-bold">
                  {new Set(items.map((s) => s.opportunity.organization.name)).size}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-wider text-rose-200/80">Fields</div>
              <div className="mt-1 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-rose-200" />
                <div className="text-2xl font-bold">
                  {new Set(items.map((s) => s.opportunity.fieldId).filter(Boolean)).size}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-wider text-rose-200/80">Avg. Duration</div>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-200" />
                <div className="text-2xl font-bold">
                  {items.length
                    ? Math.round(
                        items.reduce((sum, s) => sum + (s.opportunity.durationMonths || 6), 0) / items.length,
                      )
                    : 0}{' '}
                  mo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-slate-50 via-white to-rose-50/20 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-fuchsia-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech space-y-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-500" />
            <div className="flex flex-wrap gap-2">
              {fieldFilters.map((f) => {
                const active = (f.id === 'all' && fieldFilter === 'all') || String(fieldFilter) === String(f.id);
                const count = f.id === 'all' ? items.length : byFieldCount[String(f.id)] || 0;
                return (
                  <Link
                    key={f.id}
                    href={f.id === 'all' ? '/saved' : `/saved?field=${encodeURIComponent(f.id)}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-700'
                    }`}
                  >
                    {f.name}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          {!userSignedIn && (
            <Link href="/sign-in">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                Sign in to save postings <Heart className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {!userSignedIn && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-rose-200 p-2">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Example saved postings shown</p>
                  <p className="text-sm text-rose-800/80">
                    Once signed in, tap the heart icon on any internship posting to add it here and keep your
                    shortlist in one place.
                  </p>
                </div>
              </div>
              <Link href="/sign-in">
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Heart className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">No saved opportunities yet.</p>
            <p className="mt-1 text-sm text-slate-500">
              Explore the marketplace and tap the heart icon on any posting to bookmark it here.
            </p>
            <div className="mt-5 justify-center gap-2 sm:flex">
              <Link href="/internships">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                  Browse internships <Search className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((saved) => (
              <article
                key={saved.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ${
                  saved.isExample ? 'border-rose-200/60' : 'border-slate-200'
                }`}
              >
                <div className="absolute right-4 top-4 rounded-full bg-rose-50 p-2 text-rose-500 ring-1 ring-rose-100">
                  <Heart className="h-4 w-4 fill-current" />
                </div>

                <div className="pr-12">
                  <div className="flex flex-wrap items-center gap-2">
                    {saved.opportunity.field && (
                      <Badge variant="secondary" className="text-[11px]">
                        {saved.opportunity.field.name}
                      </Badge>
                    )}
                    {saved.opportunity.workMode && (
                      <Badge variant="outline" className="text-[11px]">
                        {saved.opportunity.workMode.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 leading-tight">
                    <Link
                      href={`/internships/${saved.opportunity.slug}`}
                      className="hover:text-rose-700 line-clamp-2"
                    >
                      {saved.opportunity.title}
                    </Link>
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{saved.opportunity.organization.name}</span>
                    <span className="text-slate-300">·</span>
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{saved.opportunity.city || 'Cameroon'}</span>
                  </div>
                </div>

                {saved.notes && (
                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 italic">
                    &ldquo;{saved.notes}&rdquo;
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="font-medium text-slate-700">Saved on</div>
                    <div>{saved.savedAt.toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="font-medium text-slate-700">Duration</div>
                    <div>{saved.opportunity.durationMonths || 6} months</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    Apply by: {saved.opportunity.deadline?.toLocaleDateString() || 'Rolling'}
                  </span>
                  <div className="flex items-center gap-3">
                    {saved.opportunity.organization.slug && (
                      <Link
                        href={`/companies/${saved.opportunity.organization.slug}`}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                      >
                        Company →
                      </Link>
                    )}
                    <Link
                      href={`/internships/${saved.opportunity.slug}`}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center"
                    >
                      Apply →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-rose-600 via-fuchsia-600 to-slate-900 p-8 text-white sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,auto] lg:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Turn saved postings into offers
              </h2>
              <p className="mt-2 max-w-xl text-fuchsia-100">
                Complete your Intern Passport once and apply to every saved opening in seconds — recruiters from{' '}
                {new Set(items.map((s) => s.opportunity.organization.name)).size}+ verified organizations on
                MANTECH use this flow to find their next cohort.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register/intern">
                <Button size="lg" className="bg-white text-fuchsia-700 hover:bg-fuchsia-50">
                  Complete Your Profile
                </Button>
              </Link>
              <Link href="/mantech-internship">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  About MANTECH Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
