"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Loader2,
  Inbox,
  ArrowRight,
  Banknote,
  ShieldCheck,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2,
  Plus,
} from "lucide-react";
import type { Job } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { OrgLogo } from "@/components/shared/org-logo";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MotionSection, MotionItem } from "@/components/shared/section-animations";
import Loading from "@/app/loading";

interface FilterState {
  search: string;
  field: string;
  workMode: string;
  jobType: string;
  city: string;
  availability: "all" | "active" | "expired";
}

const CAMEROON_CITIES = [
  "all",
  "Douala",
  "Yaoundé",
  "Buea",
  "Limbe",
  "Bafoussam",
  "Bamenda",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Kribi",
  "Bertoua",
  "Ebolowa"
];

export default function JobsPage() {
  const { isSignedIn } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    field: "all",
    workMode: "all",
    jobType: "all",
    city: "all",
    availability: "all"
  });

  useEffect(() => {
    let cancelled = false;
    const loadJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "100", page: "1" });
        const res = await fetch("/api/jobs?" + params.toString(), { cache: "no-store" });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadJobs();
    return () => { cancelled = true; };
  }, []);

  const counts = useMemo(() => {
    const now = new Date();
    const active = jobs.filter((j) => !j.expiryDate || new Date(j.expiryDate) >= now).length;
    const expired = jobs.filter((j) => j.expiryDate && new Date(j.expiryDate) < now).length;
    return { total: jobs.length, active, expired };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const now = new Date();
    return jobs.filter((job) => {
      // Representation as card is ONLY for detailed forms and WhatsApp group broadcasts
      // Pure image flyers and external links have their own dedicated visual galleries/directories
      if ((job as any).isVisualFlyerOnly || (job as any).isLinkOnly) return false;

      // Availability filter
      const isJobExpired = job.expiryDate ? new Date(job.expiryDate) < now : false;
      if (filters.availability === "active" && isJobExpired) return false;
      if (filters.availability === "expired" && !isJobExpired) return false;

      // Text search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(q);
        const matchesDesc = job.description?.toLowerCase().includes(q);
        const matchesOrg = job.organization?.name?.toLowerCase().includes(q);
        const matchesCity = job.city?.toLowerCase().includes(q);
        const matchesSkills = (job.requiredSkills || []).some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesOrg && !matchesCity && !matchesSkills) {
          return false;
        }
      }

      // Dropdown filters
      if (filters.field !== "all" && filters.field !== (job.field?.slug || "all")) return false;
      if (filters.workMode !== "all" && filters.workMode !== (job.workMode || "all")) return false;
      if (filters.jobType !== "all" && filters.jobType !== (job.type || "all").toUpperCase()) return false;
      if (filters.city !== "all" && filters.city !== job.city) return false;

      return true;
    }).sort((a, b) => {
      // Rule §2: Featured enterprise opportunities are pinned to the very top!
      if (Boolean(a.isFeatured) && !Boolean(b.isFeatured)) return -1;
      if (!Boolean(a.isFeatured) && Boolean(b.isFeatured)) return 1;
      return 0;
    });
  }, [jobs, filters]);

  const clearFilters = () =>
    setFilters({
      search: "",
      field: "all",
      city: "all",
      workMode: "all",
      jobType: "all",
      availability: "all"
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>National Cameroon Career Marketplace</span>
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Explore Professional Jobs in Cameroon
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-6">
            Real vacancies from 110+ verified enterprises, public corporations, financial institutions, and universities across all 10 national regions.
          </p>

          {/* Method Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-8">
            <Link
              href="/jobs"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/25"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Structured Vacancies (Cards)</span>
            </Link>
            <Link
              href="/jobs/flyers"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <span>🖼️ Visual Posters &amp; Flyers</span>
            </Link>
            <Link
              href="/jobs/links"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <span>🔗 Official Career Links</span>
            </Link>
            <Link
              href="/post?type=job"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-opacity ml-1"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Job Free</span>
            </Link>
          </div>

          {/* Main Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search by job title, enterprise, skill, or town..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="bg-slate-900/90 border-slate-700/80 text-white pl-12 h-12 text-sm rounded-2xl shadow-xl focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          {/* Availability Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setFilters({ ...filters, availability: "all" })}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${filters.availability === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
                }`}
            >
              All Postings ({counts.total})
            </button>
            <button
              onClick={() => setFilters({ ...filters, availability: "active" })}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${filters.availability === "active"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active ({counts.active})
            </button>
            <button
              onClick={() => setFilters({ ...filters, availability: "expired" })}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${filters.availability === "expired"
                ? "bg-rose-600/80 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
                }`}
            >
              Past / Expired ({counts.expired})
            </button>
          </div>

          {/* Quick Filters: City & WorkMode */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* City Selector */}
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Cities</option>
              {CAMEROON_CITIES.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Work Mode */}
            <select
              value={filters.workMode}
              onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
              className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Work Modes</option>
              <option value="ONSITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>

            {(filters.search || filters.city !== "all" || filters.workMode !== "all" || filters.availability !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-blue-400 hover:text-blue-300 h-8"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="pt-4 pb-6 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredJobs.length}</strong> matching vacancies
          </span>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
            <p className="text-xs text-slate-400">Loading verified Cameroon job listings...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 max-w-md mx-auto">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-blue-500 text-base mb-1">No vacancies found</h3>
            <p className="text-slate-400 text-xs mb-5">
              Try adjusting your search keywords or switching availability to view past/expired positions.
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs bg-white/50 border-slate-700">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <MotionSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => {
              const isExpired = job.expiryDate ? new Date(job.expiryDate) < new Date() : false;
              const org = job.organization;

              return (
                <MotionItem
                  key={job.id}
                  className={`${
                    job.isFeatured
                      ? 'border-2 border-amber-500/60 shadow-xl shadow-amber-500/10'
                      : 'border border-slate-800/80 hover:border-slate-700'
                  } bg-slate-900/90 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group relative overflow-hidden`}
                >
                  <div>
                    {/* Top Status & Type Strip */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {job.isFeatured && (
                          <Badge className="bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Featured Enterprise
                          </Badge>
                        )}
                        {isExpired ? (
                          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px] px-2 py-0.5">
                            Expired
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </Badge>
                        )}
                        <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] uppercase font-mono">
                          {job.workMode || "ONSITE"}
                        </Badge>
                      </div>

                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${(job.type || 'FULL_TIME').toUpperCase() === 'PART_TIME'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : (job.type || 'FULL_TIME').toUpperCase() === 'CONTRACT'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : (job.type || 'FULL_TIME').toUpperCase() === 'INTERNSHIP'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : (job.type || 'FULL_TIME').toUpperCase() === 'FREELANCE'
                              ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        }`}>
                        {(job.type || "FULL_TIME").replace('_', ' ')}
                      </span>
                    </div>

                    {/* Enterprise Row with Logo */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <OrgLogo
                        name={org?.name || (job as any).organizationName || "Verified Enterprise"}
                        logoUrl={org?.logoUrl || (job as any).organizationLogoUrl}
                        size="sm"
                        type="COMPANY"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                            {org?.name || (job as any).organizationName || "Verified Enterprise"}
                          </p>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span>{job.city}, Cameroon</span>
                        </div>
                      </div>
                    </div>

                    {/* Job Title */}
                    <Link href={`/jobs/${job.slug}`}>
                      <h3 className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 break-words min-h-[3rem] mb-2">
                        {job.title}
                      </h3>
                    </Link>

                    {/* Description excerpt */}
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3.5 leading-relaxed">
                      {job.description || "Exciting career opportunity with verified employer."}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(job.requiredSkills || []).slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {(job.requiredSkills || []).length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{(job.requiredSkills || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Salary & CTA */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                    <div className="text-xs">
                      {job.salaryMinXAF ? (
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <Banknote className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {job.salaryMinXAF.toLocaleString()}
                          {job.salaryMaxXAF ? ` - ${job.salaryMaxXAF.toLocaleString()}` : ""} XAF
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Competitive salary</span>
                      )}
                    </div>

                    <Link href={`/jobs/${job.slug}`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-3 rounded-xl font-semibold shadow-sm"
                      >
                        Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </MotionItem>
              );
            })}
          </MotionSection>
        )}
      </div>
    </div>
  );
}