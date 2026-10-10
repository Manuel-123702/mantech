"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Loader2,
  Inbox,
  ArrowRight,
  Sparkles,
  Banknote,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { InternshipOpportunity } from "@/lib/types";
import { useTaxonomy } from "@/lib/use-taxonomy";
import { useAuth } from "@/lib/auth-context";
import { calculateMatch, matchLabel, type MatchProfile } from "@/lib/matching";
import { fieldNameOf, regionNameOf } from "@/lib/catalog-shape";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Send } from "lucide-react";
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
} from "@/components/shared/section-animations";

export default function InternshipsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [internships, setInternships] = useState<InternshipOpportunity[]>([]);
  const [matchProfile, setMatchProfile] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [field, setField] = useState("all");
  const [workMode, setWorkMode] = useState("all");

  // ── SRS §10 advanced filters ─────────────────────────────────────────────
  const [specialization, setSpecialization] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [city, setCity] = useState("all");
  const [skill, setSkill] = useState("all");
  const [applicationMethod, setApplicationMethod] = useState("all");
  const [paid, setPaid] = useState("all");
  const [maxDuration, setMaxDuration] = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  // "default" keeps the order the API returned (newest first). "match"
  // re-ranks the cards by the signed-in intern's match score, highest first.
  const [sortMode, setSortMode] = useState<"default" | "match">("default");
  // Load the signed-in intern's match profile so each card can show a
  // live "match %" badge. Guests / anyone without a profile get null
  // (badges are simply hidden) — never an error.
  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      setMatchProfile(null);
      return;
    }
    let cancelled = false;
    fetch("/api/me/match-profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setMatchProfile((data?.matchProfile ?? null) as MatchProfile | null);
      })
      .catch(() => {
        if (!cancelled) setMatchProfile(null);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoaded, isSignedIn]);

  // Pre-compute a match score per opportunity so the card render stays cheap.
  const matchScores = useMemo(() => {
    const map = new Map<string, number>();
    if (!matchProfile) return map;
    for (const opp of internships) {
      const { score } = calculateMatch(matchProfile, {
        requiredSkills: (opp.requiredSkills || opp.required_skills || opp.skills || []) as string[],
        preferredSkills: (opp.preferredSkills || opp.preferred_skills || []) as string[],
        fieldSlug: (opp as any).fieldSlug ?? null,
        fieldName: (opp.field as string) ?? null,
        city: opp.city ?? null,
        regionName: (regionNameOf(opp as unknown as Record<string, unknown>) as string) ?? null,
        workMode: (opp.workMode || opp.work_mode || null) as string | null,
        isPaid: opp.isPaid ?? opp.is_paid ?? null,
      });
      map.set(opp.id, score);
    }
    return map;
  }, [matchProfile, internships]);

  // Re-rank the list when the user picks "Best match". Cards with no score
  // (guests, or a profile that could not be loaded) keep the default order —
  // the toggle is disabled in that case so the two never disagree.
  const sortedInternships = useMemo(() => {
    if (sortMode !== "match" || matchScores.size === 0) return internships;
    return [...internships].sort(
      (a, b) => (matchScores.get(b.id) ?? -1) - (matchScores.get(a.id) ?? -1),
    );
  }, [internships, matchScores, sortMode]);

  // If the match profile goes away (sign-out) while "Best match" is selected,
  // fall back to the default order so the toggle never shows a stale state.
  useEffect(() => {
    if (sortMode === "match" && matchScores.size === 0) setSortMode("default");
  }, [sortMode, matchScores]);



  const { fields, regions, industries, skills, loading: taxonomyLoading, error: taxonomyError } = useTaxonomy();

  useEffect(() => {
    async function fetchInternships() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (region !== "all") params.set("region", region);
        if (field !== "all") params.set("field", field);
        if (workMode !== "all") params.set("workMode", workMode);
        if (specialization !== "all") params.set("specialization", specialization);
        if (industry !== "all") params.set("industry", industry);
        if (city !== "all") params.set("city", city);
        if (skill !== "all") params.set("skill", skill);
        if (applicationMethod !== "all") params.set("applicationMethod", applicationMethod);
        if (paid !== "all") params.set("paid", paid);
        if (maxDuration !== "all") params.set("maxDuration", maxDuration);

        const res = await fetch(`/api/internships?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setInternships(data.internships || []);
        }
      } catch (err) {
        console.error("Failed fetching internships:", err);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchInternships, 200);
    return () => clearTimeout(debounce);
  }, [
    search,
    region,
    field,
    workMode,
    specialization,
    industry,
    city,
    skill,
    applicationMethod,
    paid,
    maxDuration,
  ]);

  // Specializations cascade from the selected field (SRS §10).
  const specializationOptions = useMemo(
    () => fields.find((f) => f.name === field)?.specializations ?? [],
    [fields, field],
  );

  // Cities cascade from the selected region (SRS §10 / §24).
  const cityOptions = useMemo(() => {
    const match = regions.find((r) => r.name === region);
    return match?.locations ?? [];
  }, [regions, region]);

  // Changing field invalidates its specializations; changing region
  // invalidates its cities.
  useEffect(() => {
    setSpecialization("all");
  }, [field]);
  useEffect(() => {
    setCity("all");
  }, [region]);

  const activeFilterCount = [
    field,
    region,
    workMode,
    specialization,
    industry,
    city,
    skill,
    applicationMethod,
    paid,
    maxDuration,
  ].filter((value) => value !== "all").length;

  const resetFilters = () => {
    setSearch("");
    setField("all");
    setRegion("all");
    setWorkMode("all");
    setSpecialization("all");
    setIndustry("all");
    setCity("all");
    setSkill("all");
    setApplicationMethod("all");
    setPaid("all");
    setMaxDuration("all");
  };

  const selectClass =
    "h-11 px-3.5 rounded-md bg-slate-800/90 border border-slate-700 text-white text-sm w-full";

  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION WITH BACKGROUND IMAGE ───── */}
      <section
        className="relative py-20 lg:py-28 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/portal_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80 backdrop-blur-[1px]" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              National Cameroon Professional Internship Marketplace
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Verified Professional Internships in Cameroon
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Discover opportunities across Software, Networks, Data & AI,
              Finance, Accounting, Marketing, Human Resources, Engineering, and
              Law across all 10 regions.
            </p>

            {/* Filter controls */}
            <div className="mt-8 bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by role, skills, keywords, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 h-11"
                />
              </div>

              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="h-11 px-3.5 rounded-md bg-slate-800/90 border border-slate-700 text-white text-sm"
              >
                <option value="all">All Professional Fields</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-11 px-3.5 rounded-md bg-slate-800/90 border border-slate-700 text-white text-sm"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.capital})
                  </option>
                ))}
              </select>

              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="h-11 px-3.5 rounded-md bg-slate-800/90 border border-slate-700 text-white text-sm"
              >
                <option value="all">All Modes</option>
                <option value="onsite">On-Site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* ── SRS §10 advanced filters ────────────────────────────── */}
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowAdvanced((open) => !open)}
                  aria-expanded={showAdvanced}
                  aria-controls="advanced-filters"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-700 bg-slate-800/90 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Advanced Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Clear {activeFilterCount} filter
                    {activeFilterCount === 1 ? "" : "s"}
                  </button>
                )}
              </div>

              {showAdvanced && (
                <div
                  id="advanced-filters"
                  className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-4 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3"
                >
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Specialization
                    </span>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      disabled={field === "all"}
                      className={`${selectClass} disabled:opacity-50`}
                    >
                      <option value="all">
                        {field === "all" ? "Pick a field first" : "All Specializations"}
                      </option>
                      {specializationOptions.map((spec) => (
                        <option key={spec.id} value={spec.name}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Industry
                    </span>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All Industries</option>
                      {industries.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      City / Town
                    </span>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={region === "all"}
                      className={`${selectClass} disabled:opacity-50`}
                    >
                      <option value="all">
                        {region === "all" ? "Pick a region first" : "All Cities"}
                      </option>
                      {cityOptions.map((location) => (
                        <option key={location.id} value={location.city}>
                          {location.city}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Skill
                    </span>
                    <select
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">All Skills</option>
                      {skills.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Application Method
                    </span>
                    <select
                      value={applicationMethod}
                      onChange={(e) => setApplicationMethod(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">Any Method</option>
                      <option value="MANTECH">Apply on MANTECH</option>
                      <option value="COMPANY_WEBSITE">Company Website</option>
                      <option value="EXTERNAL">External Portal</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Compensation
                    </span>
                    <select
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">Paid &amp; Unpaid</option>
                      <option value="true">Paid / Stipend</option>
                      <option value="false">Unpaid / Academic</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Max Duration
                    </span>
                    <select
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(e.target.value)}
                      className={selectClass}
                    >
                      <option value="all">Any Duration</option>
                      <option value="3">3 months or less</option>
                      <option value="6">Up to 6 months</option>
                      <option value="12">Up to 12 months</option>
                      <option value="24">Up to 24 months</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
          </motion.div>
          {taxonomyError && <p role="alert" className="mt-3 text-sm text-red-200">{taxonomyError}</p>}
          {taxonomyLoading && <p className="mt-3 text-sm text-slate-300">Loading filters…</p>}
        </div>
      </section>

      {/* ───── INTERNSHIP CARDS GRID ───── */}
      <section className="py-20 bg-slate-50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Available Positions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {internships.length} live verified openings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Cameroon Nationwide
              </span>

              {/* Sort control — "Best match" only works once a match profile
                  has loaded, so it stays disabled (with a hint) for guests. */}
              <div
                className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5"
                role="group"
                aria-label="Sort internships"
              >
                <button
                  type="button"
                  onClick={() => setSortMode("default")}
                  aria-pressed={sortMode === "default"}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    sortMode === "default"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("match")}
                  disabled={matchScores.size === 0}
                  title={
                    matchScores.size === 0
                      ? "Sign in with an intern profile to sort by match"
                      : "Sort by your best matches first"
                  }
                  aria-pressed={sortMode === "match"}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    matchScores.size === 0
                      ? "cursor-not-allowed text-slate-400"
                      : sortMode === "match"
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="mr-1 inline h-3 w-3" aria-hidden="true" />
                  Best match
                </button>
              </div>

              <Badge
                variant="outline"
                className="text-xs font-mono border-slate-300"
              >
                Live Database
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : internships.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">
                No matching internships found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try broadening your search keywords, selecting &apos;All
                Professional Fields&apos;, or resetting regional filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mt-4 text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <MotionSection motion="pop" stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedInternships.map((opp) => {
                const skills = (opp.requiredSkills ||
                  opp.required_skills ||
                  opp.skills ||
                  []) as string[];
                return (
                  <MotionItem key={opp.id} motion="pop">
                    <AnimatedCard className="h-full">
                      <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-semibold uppercase"
                            >
                          {fieldNameOf(opp as unknown as Record<string, unknown>) ||
                            "Professional Field"}
                        </Badge>
                        {(() => {
                          const score = matchScores.get(opp.id);
                          if (score == null || !matchProfile) return null;
                          const label = matchLabel(score);
                          const color =
                            score >= 70
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : score >= 45
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200";
                          return (
                            <span
                              title={`${score}% ${label}`}
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${color}`}
                            >
                              {score}% {label}
                            </span>
                          );
                        })()}
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          {opp.allowanceXAF || opp.allowance_xaf
                            ? `${(opp.allowanceXAF || opp.allowance_xaf || 0).toLocaleString()} FCFA / mo`
                            : opp.isPaid || opp.is_paid
                              ? "Stipend"
                              : "Accredited"}
                        </span>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {(() => {
                          const m = String(
                            opp.applicationMethod ||
                              opp.application_method ||
                              "MANTECH",
                          ).toUpperCase();
                          if (m === "MANTECH")
                            return (
                              <Badge
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-[9px] text-blue-700"
                              >
                                <Send className="w-3 h-3 mr-1" /> MANTECH Apply
                              </Badge>
                            );
                          if (m === "COMPANY_WEBSITE")
                            return (
                              <Badge
                                variant="outline"
                                className="border-slate-200 bg-slate-50 text-[9px] text-slate-700"
                              >
                                <Globe className="w-3 h-3 mr-1" /> Company
                                Website
                              </Badge>
                            );
                          return (
                            <Badge
                              variant="outline"
                              className="border-amber-200 bg-amber-50 text-[9px] text-amber-800"
                            >
                              <Globe className="w-3 h-3 mr-1" /> External
                              Platform
                            </Badge>
                          );
                        })()}
                        {opp.isFeatured ? (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 text-[9px] border border-amber-200"
                          >
                            <Sparkles className="w-3 h-3 mr-1" /> Featured
                          </Badge>
                        ) : null}
                      </div>

                      <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {opp.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {opp.city},{" "}
                          {regionNameOf(opp as unknown as Record<string, unknown>) ||
                            "Cameroon"}
                        </span>
                        <span>•</span>
                        <span className="uppercase font-semibold text-slate-700">
                          {String(opp.workMode || opp.work_mode || "ONSITE")}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {opp.description ||
                          opp.summary ||
                          "Professional internship position with verified mentor supervision."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {skills.slice(0, 3).map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] text-slate-700 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">
                        {opp.durationMonths || opp.duration_months || 3} Months
                        Duration
                      </span>

                      <Link href={`/internships/${opp.slug}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                        </div>
                      </div>
                    </AnimatedCard>
                  </MotionItem>
                );
              })}
            </MotionSection>
          )}
        </div>
      </section>
    </div>
  );
}
