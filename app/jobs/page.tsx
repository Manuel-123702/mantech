"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Loader2, Inbox, ArrowRight, Banknote } from "lucide-react";
import type { Job } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MotionSection, MotionItem } from "@/components/shared/section-animations";

interface FilterState {
  search: string; field: string; workMode: string; jobType: string;
  salaryMin: string; salaryMax: string; city: string; skill: string;
}

export default function JobsPage() {
  const { isSignedIn } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "", field: "all", workMode: "all", jobType: "all",
    salaryMin: "", salaryMax: "", city: "all", skill: "all",
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50", page: "1" });
      if (filters.search) params.set("search", filters.search);
      if (filters.field !== "all") params.set("field", filters.field);
      if (filters.workMode !== "all") params.set("workMode", filters.workMode);
      if (filters.jobType !== "all") params.set("jobType", filters.jobType);
      if (filters.city !== "all") params.set("city", filters.city);
      if (filters.skill !== "all") params.set("skill", filters.skill);
      const res = await fetch("/api/jobs?" + params.toString(), { cache: "no-store" });
      if (res.ok) { const data = await res.json(); setJobs(data.jobs || []); }
    } catch (e) { console.error("Failed to fetch jobs:", e); }
    finally { setLoading(false); }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!(
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          job.organization?.name?.toLowerCase().includes(q) ||
          job.city?.toLowerCase().includes(q)
        )) return false;
      }
      if (filters.field !== "all" && filters.field !== (job.field?.slug || "all")) return false;
      if (filters.workMode !== "all" && filters.workMode !== (job.workMode || "all")) return false;
      if (filters.jobType !== "all" && filters.jobType !== (job.type || "all").toUpperCase()) return false;
      if (filters.city !== "all" && filters.city !== job.city) return false;
      if (filters.skill !== "all" && !job.requiredSkills?.includes(filters.skill)) return false;
      return true;
    });
  }, [jobs, filters]);

  const clearFilters = () => setFilters({search:"",field:"all",city:"all",workMode:"all",jobType:"all",salaryMin:"",salaryMax:"",skill:"all"});

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MotionSection className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs font-medium mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            Jobs, Internships &amp; Opportunities
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">Find Your Next Opportunity</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Search 110+ Cameroon enterprises, 30+ universities, and thousands of real jobs, internships and professional opportunities across the country.</p>
        </div>
        <div className="mb-6 relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input placeholder="Search jobs, companies, skills, cities..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} className="bg-slate-900 border-slate-700 text-white pl-12" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16"><Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" /><p className="text-slate-400">No opportunities found.</p><Button variant="outline" onClick={clearFilters}>Clear filters</Button></div>
        ) : (
          <MotionSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <MotionItem key={job.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>{job.type || "FULL_TIME"}</Badge>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">{job.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span>{job.city}, Cameroon</span><span>•</span><span className="uppercase font-semibold text-slate-300">{job.workMode || "ONSITE"}</span></div>
                  <p className="mt-3 text-xs text-slate-400 line-clamp-2">{job.description || job.summary || "Professional opportunity with verified employer."}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">{(job.requiredSkills || []).slice(0,3).map((s,i) => <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-700/60 text-[10px] text-slate-300">{s}</span>)}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">{job.salaryMinXAF && <span className="flex items-center gap-1"><Banknote className="w-3.5 h-3.5" />{job.salaryMinXAF.toLocaleString()} XAF</span>}</div>
                    <Link href={`/opportunities/${job.slug}`}><Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">View Details<ArrowRight className="w-3.5 h-3.5 ml-1" /></Button></Link>
                  </div>
                </div>
              </MotionItem>
            ))}
          </MotionSection>
        )}
      </MotionSection>
    </div>
  );
}