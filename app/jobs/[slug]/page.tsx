"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Banknote,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  ExternalLink,
  Globe,
  Share2,
  Calendar,
  Briefcase,
  Users,
  GraduationCap,
  Layers,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { APP_CONFIG } from "@/lib/config";
import type { Job } from "@/lib/types";
import Loading from "@/app/loading";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs?limit=100&page=1`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const found = (data.jobs || []).find((j: Job) => j.slug === slug);
          if (!cancelled) {
            if (found) {
              setJob(found);
            } else {
              setError("Job posting not found.");
            }
          }
        } else {
          if (!cancelled) setError("Failed to fetch job details.");
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "An error occurred.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (slug) fetchJob();
    return () => { cancelled = true; };
  }, [slug]);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      await copyToClipboard(url);
      toast.success("Job link copied to clipboard!");
    }
  };

  // Internal MANTECH application for jobs — creates an Application record
  // linked to the job and notifies the organization's recruiters.
  const handleApplyOnMantech = async () => {
    if (!job) return;
    setSubmitting(true);
    setApplyError(null);

    try {
      const res = await fetch("/api/jobs/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter: coverLetter || undefined,
          applicationMethod: "MANTECH",
        }),
      });

      if (res.ok) {
        setApplied(true);
        toast.success("Application submitted to MANTECH!");
      } else {
        const data = await res.json();
        setApplyError(data.error || "Failed to submit application.");
      }
    } catch (e) {
      setApplyError("Network error connecting to MANTECH application service.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Posting Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            The job listing you are looking for may have been archived or removed.
          </p>
          <Link href="/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Cameroon Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = job.expiryDate ? new Date(job.expiryDate) < new Date() : false;
  const org = job.organization;
  const companyProfile = org?.companyProfile;
  const universityProfile = org?.universityProfile;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 pt-28">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Jobs
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {isExpired ? (
                  <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-xs px-2.5 py-0.5 font-semibold">
                    Expired • Applications Closed
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Vacancy
                  </Badge>
                )}

                <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs">
                  {job.type || "FULL_TIME"}
                </Badge>

                <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs uppercase font-medium">
                  {job.workMode || "ONSITE"}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {job.title}
              </h1>

              {/* Employer Info Strip */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pt-2 border-t border-slate-800/60 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold overflow-hidden">
                    {org?.logoUrl ? (
                      <Image src={org.logoUrl} alt={org.name} width={32} height={32} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-semibold text-white">{org?.name || "Verified Enterprise"}</span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.city}, Cameroon</span>
                </div>

                {job.department && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.department}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                  Salary (XAF)
                </span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                  <Banknote className="w-4 h-4 shrink-0" />
                  <span>
                    {job.salaryMinXAF
                      ? `${job.salaryMinXAF.toLocaleString()}${job.salaryMaxXAF ? ` - ${job.salaryMaxXAF.toLocaleString()}` : ""} XAF`
                      : "Competitive"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                  Education Level
                </span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">{job.educationLevel || "Bachelor / Licence"}</span>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                  Posted Date
                </span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {job.postingDate
                      ? new Date(job.postingDate).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })
                      : "Recently"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                  Application Deadline
                </span>
                <div className={`flex items-center gap-1.5 text-sm font-bold ${isExpired ? "text-rose-400" : "text-amber-400"}`}>
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    {job.expiryDate
                      ? new Date(job.expiryDate).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })
                      : "Open until filled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Responsibilities */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Role Description &amp; Scope
                </h2>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.description || "Detailed professional job opening at this organization in Cameroon."}
                </div>
              </div>

              {/* Required Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Required Competencies &amp; Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Skills */}
              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Preferred / Additional Assets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Organization Profile & Application Box */}
          <div className="space-y-6">
            {/* Application Action Card */}
            <div className="bg-gradient-to-b from-blue-900/30 to-slate-900 border border-blue-800/40 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-base font-bold text-white mb-2">Apply for this Position</h3>
              <p className="text-xs text-slate-400 mb-5">
                {isExpired
                  ? "This recruitment window has passed. Check other active job openings or subscribe for alerts."
                  : "Submit your candidature directly or connect via MANTECH Concierge for instant recruiter routing."}
              </p>

              {isExpired ? (
                <div className="space-y-3">
                  <Button disabled className="w-full bg-slate-800 text-slate-500 text-xs cursor-not-allowed">
                    Application Expired
                  </Button>
                  <Link href="/jobs" className="block w-full">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-200 text-xs hover:bg-slate-800">
                      View Active Vacancies
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Cover letter (optional) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly state why you are a good fit for this role…"
                      className="w-full min-h-[80px] rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 p-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {applyError && (
                    <div className="p-2 rounded-xl bg-red-900/20 border border-red-800/50 text-[10px] text-red-400">
                      {applyError}
                    </div>
                  )}

                  {/* Method 1: Apply on MANTECH (internal) */}
                  <Button
                    onClick={handleApplyOnMantech}
                    disabled={submitting || applied}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Submitting…
                      </>
                    ) : applied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-400" />
                        Application Submitted
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-2" />
                        Apply on MANTECH
                      </>
                    )}
                  </Button>

                  {/* Method 2: Apply on Employer Website (external) */}
                  {org?.website ? (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="block w-full">
                      <Button className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200 font-bold text-xs">
                        Apply on Employer Website
                        <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </a>
                  ) : null}

                  <a
                    href={`https://wa.me/237650921917?text=${encodeURIComponent(
                      `Hello MANTECH Team, I am interested in applying for the job position: ${job.title} at ${org?.name} (ref: ${job.slug}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs"
                    >
                      <WhatsAppIcon className="w-4 h-4 mr-2 text-[#25D366]" />
                      Apply via WhatsApp Concierge
                    </Button>
                  </a>
                </div>
              )}
            </div>

            {/* About the Employer Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {org?.logoUrl ? (
                    <Image src={org.logoUrl} alt={org.name} width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{org?.name}</h4>
                  <p className="text-xs text-slate-400">{org?.city}, Cameroon</p>
                  {org?.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 mt-1 font-medium"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{org.website.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {org?.description && (
                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                  {org.description}
                </p>
              )}

              {/* Tech Stack Chips if available */}
              {companyProfile?.techStack && companyProfile.techStack.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Technologies &amp; Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {companyProfile.techStack.map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Perks if available */}
              {companyProfile?.perks && companyProfile.perks.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Company Benefits &amp; Culture
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {companyProfile.perks.map((perk: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/30 text-[10px] text-emerald-300">
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculties if university */}
              {universityProfile?.faculties && universityProfile.faculties.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Key Faculties &amp; Institutes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {universityProfile.faculties.slice(0, 4).map((fac: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/30 text-[10px] text-blue-300">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
