import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookmarkCheck,
  Building2,
  MapPin,
  Briefcase,
  Heart,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";

type PageProps = { searchParams?: Promise<{ field?: string }> };

export default async function InternSavedPage(props: PageProps) {
  const user = await requireUser();

  const search = await props.searchParams;
  const fieldFilter = search?.field?.toLowerCase() || "all";

  const saved = await prisma.savedOpportunity.findMany({
    where: { userId: user.id },
    include: {
      opportunity: {
        include: {
          organization: { select: { name: true, slug: true, logoUrl: true } },
          field: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  const fieldFilters = [
    { id: "all", name: "All fields" },
    ...saved
      .flatMap((s) =>
        s.opportunity.fieldId && s.opportunity.field
          ? [{ id: String(s.opportunity.fieldId), name: s.opportunity.field.name }]
          : [],
      )
      .filter((f, index, list) => list.findIndex((other) => other.id === f.id) === index),
  ];

  const filtered =
    fieldFilter === "all"
      ? saved
      : saved.filter(
          (s) =>
            s.opportunity.fieldId &&
            String(s.opportunity.fieldId) === String(fieldFilter),
        );

  const byFieldCount = saved.reduce<Record<string, number>>(
    (acc, s) => {
      if (s.opportunity.fieldId) {
        const key = String(s.opportunity.fieldId);
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const avgDuration = saved.length
    ? Math.round(
        saved.reduce((sum, s) => sum + (s.opportunity.durationMonths || 6), 0) /
          saved.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Saved Opportunities
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 break-words">
            Your shortlisted postings. Revisit them to compare and apply when ready.
          </p>
        </div>
        <Link href="/internships" className="shrink-0">
          <Button className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold shadow-md">
            <Search className="mr-2 h-4 w-4" />
            Discover More
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Saved
          </p>
          <p className="mt-1 flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-white">
            <BookmarkCheck className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{saved.length}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Companies
          </p>
          <p className="mt-1 flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-white">
            <Building2 className="h-5 w-5 text-rose-400 shrink-0" />
            <span>
              {
                new Set(
                  saved
                    .map((s) => s.opportunity.organization?.name)
                    .filter(Boolean),
                ).size
              }
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Fields
          </p>
          <p className="mt-1 flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-white">
            <Briefcase className="h-5 w-5 text-rose-400 shrink-0" />
            <span>
              {
                new Set(saved.map((s) => s.opportunity.fieldId).filter(Boolean))
                  .size
              }
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Avg Duration
          </p>
          <p className="mt-1 flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-white">
            <Calendar className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{avgDuration} mo</span>
          </p>
        </div>
      </div>

      {fieldFilters.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {fieldFilters.map((f) => {
            const active =
              (f.id === "all" && fieldFilter === "all") ||
              String(fieldFilter) === String(f.id);
            const count =
              f.id === "all" ? saved.length : byFieldCount[String(f.id)] || 0;
            return (
              <Link
                key={f.id}
                href={
                  f.id === "all"
                    ? "/dashboard/intern/saved"
                    : `/dashboard/intern/saved?field=${encodeURIComponent(f.id)}`
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "border-rose-500 bg-rose-600 text-white shadow-sm"
                    : "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span>{f.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-950/60 text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 flex flex-col items-center py-14 px-4 text-center">
          <Heart className="mb-3 h-10 w-10 text-slate-500" />
          <h3 className="font-semibold text-white">
            No saved opportunities yet
          </h3>
          <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-400">
            Explore the marketplace and tap the heart icon on any posting to bookmark it here.
          </p>
          <Link href="/internships" className="mt-5">
            <Button className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold">
              Browse Internships &amp; Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl border border-slate-700/70 bg-slate-900/75 p-4 sm:p-5 hover:border-rose-500/40 transition-all"
            >
              <div className="absolute right-4 top-4 rounded-full bg-rose-950/70 p-2 text-rose-400 ring-1 ring-rose-500/30">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <div className="pr-11 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.opportunity.field && (
                    <Badge className="bg-rose-950/60 text-rose-300 border border-rose-500/30 text-[11px]">
                      {item.opportunity.field.name}
                    </Badge>
                  )}
                  {item.opportunity.workMode && (
                    <Badge className="bg-slate-800 text-slate-300 border border-slate-600 text-[11px]">
                      {String(item.opportunity.workMode).replace("_", " ")}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-white leading-snug break-words">
                  <Link
                    href={`/internships/${item.opportunity.slug}`}
                    className="hover:text-rose-400 transition-colors"
                  >
                    {item.opportunity.title}
                  </Link>
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-300">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="break-words">
                    {item.opportunity.organization?.name || "Organization"}
                  </span>
                  <span className="text-slate-600">·</span>
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="break-words">
                    {item.opportunity.city || "Cameroon"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 px-3 py-2">
                  <span className="font-medium text-slate-400 text-[11px]">Saved on</span>
                  <div className="mt-0.5 font-semibold text-white">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 px-3 py-2">
                  <span className="font-medium text-slate-400 text-[11px]">Duration</span>
                  <div className="mt-0.5 font-semibold text-white">
                    {item.opportunity.durationMonths || 6} months
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                <span className="text-xs text-slate-400">
                  Apply by:{" "}
                  {item.opportunity.deadline
                    ? new Date(item.opportunity.deadline).toLocaleDateString()
                    : "Rolling"}
                </span>
                <Link
                  href={`/internships/${item.opportunity.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
