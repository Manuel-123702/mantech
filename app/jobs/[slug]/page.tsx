"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Banknote,
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
  Award,
  Zap,
  Image as ImageIcon,
  Maximize2,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrgLogo } from "@/components/shared/org-logo";
import Image from "next/image";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { BoostListingModal } from "@/components/shared/boost-listing-modal";
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
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const company = (job as any)?.companyName || job?.organization?.name || 'MANTECH Nexus';
    const shareTitle = job?.title ? `${job.title} — ${company}` : 'Job opening on MANTECH Nexus';
    const shareText = `Check out this job in Cameroon: ${shareTitle} (${job?.city || 'Cameroon'})\n${url}`;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return; // User closed native share sheet
      }
    }

    const ok = await copyToClipboard(url);
    if (ok) {
      toast.success("Job link copied to clipboard!");
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined" || !job) return;
    const url = window.location.href;
    const company = (job as any)?.companyName || job?.organization?.name || 'MANTECH Nexus';
    const shareText = `Check out this job opportunity in Cameroon: *${job.title}* at *${company}* (${job.city || 'Cameroon'})\n\nView details & apply: ${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
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
  const isFlyer = Boolean((job as any)?.isVisualFlyerOnly || (job as any)?.flyerUrl);
  const flyerUrl = (job as any)?.flyerUrl;
  const isLink = Boolean((job as any)?.isLinkOnly || (job as any)?.externalUrl);
  const externalUrl = (job as any)?.externalUrl;
  const directPhone = (job as any)?.contactPhone;

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
              onClick={() => setShowBoostModal(true)}
              className="border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs gap-1.5 shadow-sm"
              title="Boost this job to top placement"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Boost</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs gap-1.5"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs"
              title="Share via device or copy link"
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
                  <OrgLogo
                    name={org?.name || (job as any)?.organizationName || "Verified Enterprise"}
                    logoUrl={org?.logoUrl}
                    size="sm"
                    type="COMPANY"
                  />
                  <span className="font-semibold text-white">{org?.name || (job as any)?.organizationName || "Verified Enterprise"}</span>
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

            {/* Visual Flyer Announcement (When posted via image flyer) */}
            {isFlyer && flyerUrl && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Affiche de Recrutement Officielle</p>
                      <p className="text-xs text-slate-400">Tous les critères et modalités de candidature sont communiqués directement sur cette affiche.</p>
                    </div>
                  </div>
                  <Button onClick={() => setLightboxOpen(true)} size="sm" variant="outline" className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 shrink-0 gap-1.5">
                    <Maximize2 className="w-4 h-4" /> Agrandir
                  </Button>
                </div>

                <div
                  className="relative rounded-3xl border-2 border-cyan-500/40 bg-slate-950 overflow-hidden shadow-2xl group cursor-pointer text-center p-2"
                  onClick={() => setLightboxOpen(true)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={flyerUrl}
                    alt={job.title}
                    className="w-full h-auto max-h-[750px] object-contain mx-auto rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <a
                      href={flyerUrl}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-white/20 text-white hover:text-cyan-300 transition-colors shadow-lg"
                      title="Télécharger l'affiche"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-white/20 text-white hover:text-cyan-300 transition-colors shadow-lg"
                      title="Zoom Plein Écran"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* External Official Portal Opening (When posted via career link) */}
            {isLink && externalUrl && (
              <div className="rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400">
                  <ExternalLink className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">Portail Officiel de Candidature</h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  Cette offre s&apos;effectue directement sur le portail institutionnel de l&apos;entreprise.
                </p>
                <div className="pt-2">
                  <a
                    href={externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5"
                  >
                    <span>Postuler sur le Portail Officiel</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

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

                  {/* Direct Contact Phone if provided */}
                  {directPhone ? (
                    <a
                      href={`https://wa.me/${directPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Bonjour, je postule à votre offre "${job.title}" vue sur MANTECH Nexus.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30">
                        <WhatsAppIcon className="w-4 h-4 mr-2" />
                        Contacter Recruteur sur WhatsApp
                      </Button>
                    </a>
                  ) : null}

                  {/* Method 2: Apply on Employer Website (external) */}
                  {externalUrl ? (
                    <a href={externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`} target="_blank" rel="noopener noreferrer" className="block w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30">
                        <ExternalLink className="w-3.5 h-3.5 mr-2" />
                        Postuler sur le Portail Officiel
                      </Button>
                    </a>
                  ) : org?.website ? (
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
                <OrgLogo
                  name={org?.name || (job as any)?.organizationName || "Verified Enterprise"}
                  logoUrl={org?.logoUrl}
                  size="md"
                  type="COMPANY"
                />
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

      {job && (
        <BoostListingModal
          isOpen={showBoostModal}
          onClose={() => setShowBoostModal(false)}
          itemId={job.id}
          itemType="job"
          itemTitle={job.title}
          onSuccess={() => {
            setJob((prev) => (prev ? { ...prev, isFeatured: true } : prev));
          }}
        />
      )}

      {/* Fullscreen Lightbox Modal for Flyer */}
      {lightboxOpen && flyerUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] overflow-auto rounded-2xl border border-white/20 bg-slate-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/90 text-white hover:text-rose-400 border border-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flyerUrl}
              alt={job.title}
              className="w-full h-auto object-contain max-h-[85vh] rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
