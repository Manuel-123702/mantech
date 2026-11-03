import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Award,
  Briefcase,
  Clock,
  SlidersHorizontal,
  XCircle,
  ArrowUpDown,
  UserCheck,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logDatabaseUnavailable } from "@/lib/db-health";

type SearchParams = Promise<{
  q?: string;
  fieldId?: string;
  regionId?: string;
  qualification?: string;
  workMode?: string;
  availability?: string;
  sort?: string;
}>;

type PageProps = { searchParams: SearchParams };

const SORTS = [
  { value: "readiness", label: "Readiness score (high → low)" },
  { value: "created_desc", label: "Recently joined" },
  { value: "name_asc", label: "Name (A → Z)" },
  { value: "field", label: "Field of study" },
];

const WORK_MODES = ["ON_SITE", "HYBRID", "REMOTE", "ANY"];
const AVAILABILITY_OPTIONS = [
  "IMMEDIATELY",
  "WITHIN_1_MONTH",
  "WITHIN_3_MONTHS",
  "SUMMER",
  "PART_TIME",
];

function classNames(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export default async function InternPassportsPage(props: PageProps) {
  const sp = await props.searchParams;
  const session = await auth();
  const userId = session.userId;
  if (!userId) redirect("/sign-in?redirect_url=/intern-passports");

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { organizationMembers: true },
    });
  } catch (err) {
    logDatabaseUnavailable("intern-passports", err);
    return (
      <main
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: "url('/images/hero_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/88" aria-hidden />
        <div className="relative z-10 container-mantech px-4 py-20 flex items-center justify-center min-h-screen">
          <div className="mx-auto max-w-xl rounded-2xl border border-amber-600/40 bg-slate-900/80 backdrop-blur-xl p-8 text-center">
            <Database className="mx-auto h-10 w-10 text-amber-400" />
            <h1 className="mt-4 text-xl font-bold text-white">
              Candidate directory unavailable
            </h1>
            <p className="mt-2 text-sm text-amber-300">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Any signed-in member may browse the directory — the sign-in gate above
  // is the only access requirement. Recruiter-only extras (CV downloads,
  // phone numbers) enforce their own verification checks downstream.
  if (!user) redirect("/dashboard");

  // Build filters. Radix Select forbids empty-string item values, so the
  // "All"/"Any" options submit the sentinel "all" — treat it as "no filter".
  const pick = (v: string | undefined) => (v && v !== "all" ? v : "");
  const keyword = (sp.q || "").trim();
  const fieldId = pick(sp.fieldId);
  const regionId = pick(sp.regionId);
  const qualification = pick(sp.qualification);
  const workMode = pick(sp.workMode);
  const availability = pick(sp.availability);
  const sort = SORTS.find((s) => s.value === sp.sort) ? sp.sort! : "readiness";

  const where: any = { isCvSearchable: true, profileCompleted: true };
  if (fieldId) where.fieldId = fieldId;
  if (regionId) where.regionId = regionId;
  if (qualification) where.qualification = qualification;
  if (workMode && workMode !== "ANY") where.workMode = workMode;
  if (availability)
    where.availability = { contains: availability, mode: "insensitive" };

  const orderBy: any = {};
  if (sort === "readiness") orderBy.readinessScore = "desc";
  else if (sort === "created_desc") orderBy.createdAt = "desc";
  else if (sort === "name_asc") orderBy.user = { fullName: "asc" };
  else if (sort === "field") orderBy.fieldOfStudy = { name: "asc" };

  let interns: any[] = [];
  let total = 0;
  try {
    [interns, total] = await Promise.all([
      prisma.internProfile.findMany({
        where,
        include: {
          user: { select: { fullName: true, avatarUrl: true, email: true } },
          passport: true,
          fieldOfStudy: true,
          specialization: true,
          region: true,
          skills: { include: { skill: true }, take: 6 },
        },
        take: 40,
        orderBy,
      }),
      prisma.internProfile.count({ where }),
    ]);
  } catch (err) {
    console.warn(
      "[intern-passports] query error",
      err instanceof Error ? err.message : err,
    );
    interns = [];
    total = 0;
  }

  // Keyword filter in-app (name, headline, skills) — we still do DB query for count accuracy above
  let list = interns;
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter((i) => {
      const name = (i.user?.fullName || "").toLowerCase();
      const headline = (i.passport?.headline || "").toLowerCase();
      const summary = (i.passport?.summary || "").toLowerCase();
      const skills = (i.skills || [])
        .map((s: any) => s.skill?.name || "")
        .join(" ")
        .toLowerCase();
      const field = (i.fieldOfStudy?.name || "").toLowerCase();
      const spec = (i.specialization?.name || "").toLowerCase();
      return [name, headline, summary, skills, field, spec].some((v) =>
        v.includes(kw),
      );
    });
  }

  // Taxonomy for filters
  const [dbFields, dbRegions, qualificationGroups] = await Promise.all([
    prisma.field
      .findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
      .catch(() => [] as any[]),
    prisma.region
      .findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
      .catch(() => [] as any[]),
    prisma.internProfile
      .groupBy({ by: ["qualification"], _count: { _all: true } })
      .then((rows) =>
        rows
          .filter((r) => r.qualification)
          .map((r) => ({
            value: r.qualification as string,
            count: r._count._all,
          })),
      )
      .catch(() => [] as { value: string; count: number }[]),
  ]);

  // Option A: filter options come from the seeded DB tables only — an
  // unreachable database yields empty filters instead of a stale hardcode.
  const fields = (dbFields ?? []).map((f: any) => ({
    id: f.id,
    name: f.name,
  }));
  const regions = (dbRegions ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
  }));

  const activeFilterCount =
    (keyword ? 1 : 0) +
    (fieldId ? 1 : 0) +
    (regionId ? 1 : 0) +
    (qualification ? 1 : 0) +
    (workMode ? 1 : 0) +
    (availability ? 1 : 0);

  const qsBase = new URLSearchParams();
  if (sp.q) qsBase.set("q", sp.q);
  if (sp.sort) qsBase.set("sort", sp.sort);

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/images/hero_tech_bg.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/88" aria-hidden />

      {/* Hero section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="container-mantech relative px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/70 border border-slate-700/60 backdrop-blur-xl rounded-3xl px-8 py-10 sm:px-12 sm:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
              <UserCheck className="h-3.5 w-3.5" />
              Open to all signed-in members
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold text-white sm:text-5xl">
              Intern Passports
            </h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Discover qualified Cameroonian internship seekers with verified
              professional profiles — readiness scored, skill-tagged, and
              consented to recruiter search. CV downloads remain limited to
              verified recruiters.
            </p>

            {/* Metric cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="bg-slate-800/60 border border-slate-600/40 backdrop-blur-lg rounded-2xl p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  Candidates
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-300" />
                  <div className="text-2xl font-bold text-white">{total}</div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-600/40 backdrop-blur-lg rounded-2xl p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  Showing
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Search className="h-5 w-5 text-emerald-300" />
                  <div className="text-2xl font-bold text-white">{list.length}</div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-600/40 backdrop-blur-lg rounded-2xl p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  Fields
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-300" />
                  <div className="text-2xl font-bold text-white">{fields.length}</div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-600/40 backdrop-blur-lg rounded-2xl p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  Regions
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-300" />
                  <div className="text-2xl font-bold text-white">{regions.length}</div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-600/40 backdrop-blur-lg rounded-2xl p-4">
                <div className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                  Qualifications
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-300" />
                  <div className="text-2xl font-bold text-white">
                    {qualificationGroups.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter + Results section */}
      <section className="relative z-10 pb-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <div className="bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6">
            <form action="/intern-passports" method="get" className="space-y-4">
              <div className="flex flex-wrap items-stretch gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    name="q"
                    defaultValue={keyword}
                    placeholder="Search by name, field, skills, headline…"
                    className="pl-10 h-11 bg-slate-800/60 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/60"
                  />
                </div>
                <Select name="sort" defaultValue={sort}>
                  <SelectTrigger className="w-full sm:w-60 h-11 gap-2 bg-slate-800/60 border-slate-600/50 text-white">
                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                    <SelectValue placeholder="Sort candidates" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {SORTS.map((s) => (
                      <SelectItem key={s.value} value={s.value} className="focus:bg-slate-800 focus:text-white">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Apply search
                </Button>
                {activeFilterCount > 0 && (
                  <Link
                    href="/intern-passports"
                    className="inline-flex h-11 items-center gap-1.5 rounded-md border border-slate-600/50 bg-slate-800/60 px-4 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  >
                    <XCircle className="h-4 w-4" />
                    Clear filters ({activeFilterCount})
                  </Link>
                )}
              </div>

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Advanced filters
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Field of study
                    </label>
                    <Select name="fieldId" defaultValue={fieldId || "all"}>
                      <SelectTrigger className="mt-1 h-10 bg-slate-800/60 border-slate-600/50 text-white">
                        <SelectValue placeholder="Any field" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="all" className="focus:bg-slate-800 focus:text-white">All fields</SelectItem>
                        {fields.map((f: any) => (
                          <SelectItem key={f.id} value={f.id} className="focus:bg-slate-800 focus:text-white">
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Region
                    </label>
                    <Select name="regionId" defaultValue={regionId || "all"}>
                      <SelectTrigger className="mt-1 h-10 bg-slate-800/60 border-slate-600/50 text-white">
                        <SelectValue placeholder="Any region" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="all" className="focus:bg-slate-800 focus:text-white">All regions</SelectItem>
                        {regions.map((r: any) => (
                          <SelectItem key={r.id} value={r.id} className="focus:bg-slate-800 focus:text-white">
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Qualification
                    </label>
                    <Select name="qualification" defaultValue={qualification || "all"}>
                      <SelectTrigger className="mt-1 h-10 bg-slate-800/60 border-slate-600/50 text-white">
                        <SelectValue placeholder="Any qualification" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="all" className="focus:bg-slate-800 focus:text-white">All qualifications</SelectItem>
                        {qualificationGroups.map((q) => (
                          <SelectItem key={q.value} value={q.value} className="focus:bg-slate-800 focus:text-white">
                            {q.value} ({q.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Work mode
                    </label>
                    <Select name="workMode" defaultValue={workMode || "all"}>
                      <SelectTrigger className="mt-1 h-10 bg-slate-800/60 border-slate-600/50 text-white">
                        <SelectValue placeholder="Any mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="all" className="focus:bg-slate-800 focus:text-white">Any</SelectItem>
                        {WORK_MODES.map((m) => (
                          <SelectItem key={m} value={m} className="focus:bg-slate-800 focus:text-white">
                            {m.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Availability
                    </label>
                    <Select name="availability" defaultValue={availability || "all"}>
                      <SelectTrigger className="mt-1 h-10 bg-slate-800/60 border-slate-600/50 text-white">
                        <SelectValue placeholder="Any availability" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="all" className="focus:bg-slate-800 focus:text-white">Any</SelectItem>
                        {AVAILABILITY_OPTIONS.map((a) => (
                          <SelectItem key={a} value={a} className="focus:bg-slate-800 focus:text-white">
                            {a.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Results summary */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">{list.length}</span>{" "}
              of <span className="font-semibold text-white">{total}</span>{" "}
              searchable candidates
              {keyword && (
                <>
                  {" "}
                  matching "<span className="font-semibold text-emerald-300">{keyword}</span>"
                </>
              )}
            </p>
            {user.role === "ADMIN" && (
              <Link
                href="/dashboard/admin/interns"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Open Admin · Interns &amp; Passports →
              </Link>
            )}
          </div>

          {/* Candidate grid / empty state */}
          <div className="mt-4">
            {list.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/60 backdrop-blur-xl py-16 text-center">
                <GraduationCap className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 font-semibold text-white">
                  No candidates match your filters.
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Try removing filters or adjusting the keyword.
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <Link href="/intern-passports">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 bg-slate-800/60 hover:bg-slate-700 hover:text-white"
                    >
                      Reset filters
                    </Button>
                  </Link>
                  <Link href="/dashboard/company/candidates">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Candidate discovery
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {list.map((intern: any) => {
                  const fullName = intern.user?.fullName || "Candidate";
                  const avatar = intern.user?.avatarUrl;
                  const field = intern.fieldOfStudy?.name;
                  const spec = intern.specialization?.name;
                  const region = intern.region?.name;
                  const avail = intern.availability;
                  const wm = intern.workMode;
                  const qual = intern.qualification;
                  const readiness = intern.readinessScore ?? 0;
                  const skills = (intern.skills || []).map((s: any) => s.skill);
                  return (
                    <article
                      key={intern.id}
                      className="group bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-lg hover:shadow-emerald-950/40"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {avatar ? (
                            <Image
                              src={avatar}
                              alt={fullName}
                              width={52}
                              height={52}
                              className="w-13 h-13 rounded-xl object-cover shadow-sm border border-slate-700/60 ring-1 ring-slate-600/40"
                            />
                          ) : (
                            <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                              {fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-bold text-white truncate">
                              {fullName}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">
                              {intern.passport?.headline ||
                                field ||
                                spec ||
                                "Internship seeker"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <div
                            className={classNames(
                              "text-xl font-extrabold font-mono",
                              readiness >= 80
                                ? "text-emerald-400"
                                : readiness >= 60
                                  ? "text-amber-400"
                                  : "text-slate-500",
                            )}
                          >
                            {readiness}%
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">
                            Readiness
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                        {field && (
                          <div className="inline-flex items-center gap-1.5 text-slate-300">
                            <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                            <span className="truncate">{field}</span>
                          </div>
                        )}
                        {region && (
                          <div className="inline-flex items-center gap-1.5 text-slate-300">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            <span className="truncate">{region}</span>
                          </div>
                        )}
                        {qual && (
                          <div className="inline-flex items-center gap-1.5 text-slate-300">
                            <Award className="h-3.5 w-3.5 text-slate-500" />
                            <span className="truncate">{qual}</span>
                          </div>
                        )}
                        {avail && (
                          <div className="inline-flex items-center gap-1.5 text-slate-300">
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                            <span className="truncate">
                              {avail.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {spec && (
                        <p className="mb-3 text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">
                            Specialization:
                          </span>{" "}
                          {spec}
                        </p>
                      )}

                      {skills.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {skills.slice(0, 4).map(
                            (s: any) =>
                              s && (
                                <Badge
                                  key={s.id}
                                  variant="secondary"
                                  className="bg-emerald-900/50 text-emerald-300 border border-emerald-700/40 text-[11px]"
                                >
                                  {s.name}
                                </Badge>
                              ),
                          )}
                          {skills.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-[11px] border-slate-600/50 text-slate-400"
                            >
                              +{skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {wm && (
                        <div className="mb-4 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[11px] border-slate-600/50 text-slate-400"
                          >
                            {wm.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 gap-2">
                        <Link
                          href={`/intern-passports/${intern.id}`}
                          className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                        >
                          View Passport
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA banner */}
          {list.length > 0 && (
            <div className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 p-8 text-white sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[1.2fr,auto] lg:items-center">
                <div>
                  <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                    Need a hand sourcing a cohort?
                  </h2>
                  <p className="mt-2 max-w-2xl text-emerald-100">
                    MANTECH runs managed candidate-sourcing for enterprises and
                    institutions. Tell us your role, field, and start date — our
                    team shortlists 10-30 Passports and coordinates interviews on
                    your behalf.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/dashboard/company/candidates">
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Advanced candidate search
                    </Button>
                  </Link>
                  <a
                    href={
                      process.env.NEXT_PUBLIC_MANTECH_WHATSAPP_LINK ||
                      "https://wa.me/237650921917"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white bg-white/10 hover:bg-white/20"
                    >
                      Contact MANTECH
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
