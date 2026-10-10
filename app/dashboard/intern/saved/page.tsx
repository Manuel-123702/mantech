import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Saved Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your shortlisted internship postings. Revisit them to compare and
            apply when you&apos;re ready.
          </p>
        </div>
        <Link href="/internships">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Search className="mr-2 h-4 w-4" />
            Discover more
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Saved
            </p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <BookmarkCheck className="h-5 w-5 text-rose-500" />
              {saved.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Companies
            </p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Building2 className="h-5 w-5 text-rose-500" />
              {
                new Set(
                  saved
                    .map((s) => s.opportunity.organization?.name)
                    .filter(Boolean),
                ).size
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Fields
            </p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Briefcase className="h-5 w-5 text-rose-500" />
              {
                new Set(saved.map((s) => s.opportunity.fieldId).filter(Boolean))
                  .size
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Avg Duration
            </p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Calendar className="h-5 w-5 text-rose-500" />
              {avgDuration} mo
            </p>
          </CardContent>
        </Card>
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
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "border-rose-600 bg-rose-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-700"
                }`}
              >
                {f.name}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
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
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Heart className="mb-3 h-10 w-10 text-slate-300" />
            <h3 className="font-semibold text-slate-900">
              No saved opportunities yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Explore the marketplace and tap the heart icon on any posting to
              bookmark it here.
            </p>
            <Link href="/internships" className="mt-5">
              <Button className="bg-rose-600 hover:bg-rose-700">
                Browse internships
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((saved) => (
            <Card key={saved.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="absolute right-4 top-4 rounded-full bg-rose-50 p-2 text-rose-500 ring-1 ring-rose-100">
                  <Heart className="h-4 w-4 fill-current" />
                </div>
                <div className="pr-12">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {saved.opportunity.field && (
                      <Badge variant="secondary" className="text-[11px]">
                        {saved.opportunity.field.name}
                      </Badge>
                    )}
                    {saved.opportunity.workMode && (
                      <Badge variant="outline" className="text-[11px]">
                        {String(saved.opportunity.workMode).replace("_", " ")}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 leading-tight">
                    <Link
                      href={`/internships/${saved.opportunity.slug}`}
                      className="hover:text-rose-700 line-clamp-2"
                    >
                      {saved.opportunity.title}
                    </Link>
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {saved.opportunity.organization?.name || "Organization"}
                    </span>
                    <span className="text-slate-300">·</span>
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {saved.opportunity.city || "Cameroon"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <span className="font-medium text-slate-700">Saved on</span>
                    <div className="mt-0.5">
                      {new Date(saved.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <span className="font-medium text-slate-700">Duration</span>
                    <div className="mt-0.5">
                      {saved.opportunity.durationMonths || 6} months
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">
                    Apply by:{" "}
                    {saved.opportunity.deadline
                      ? new Date(
                          saved.opportunity.deadline,
                        ).toLocaleDateString()
                      : "Rolling"}
                  </span>
                  <Link
                    href={`/internships/${saved.opportunity.slug}`}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Apply →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
