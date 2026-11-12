"use client";
import { Trans, useLingui } from '@lingui/react/macro';


import React, { useState, useEffect } from "react";
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation.hooks';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import type { InternshipOpportunity, Organization } from "@/lib/types";
import {
  fieldNameOf,
  regionNameOf,
  specializationNameOf,
} from "@/lib/catalog-shape";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { ReportButton } from "@/components/shared/report-button";
import { ResponseRateBadge } from "@/components/shared/response-rate-badge";
import type { ResponseRateStats } from "@/lib/response-rate";
import { APP_CONFIG } from "@/lib/config";
import { waShareInternshipLink, waApplyLink } from "@/lib/whatsapp";
import { jobPostingJsonLd } from "@/lib/seo";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";
const WHATSAPP_LINK = APP_CONFIG.support.whatsapp;
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
  Lock,
  ExternalLink,
  Globe,
  Share2,
  Bookmark,
  Calendar,
  Briefcase,
  Users,
  Phone,
} from "lucide-react";

export default function InternshipDetailPage() {
  const { t } = useLingui();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, userId } = useAuth();

  const [opportunity, setOpportunity] = useState<InternshipOpportunity | null>(
    null,
  );
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [responseRate, setResponseRate] =
    useState<ResponseRateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOpp() {
      try {
        setLoading(true);
        const res = await fetch(`/api/internships/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setOpportunity(data.opportunity);
          setOrganization(data.company || data.organization || null);
          setResponseRate(data.responseRate ?? null);
        } else {
          // Fallback search in catalog
          const catRes = await fetch("/api/internships");
          if (catRes.ok) {
            const catData = await catRes.json();
            const matched = (
              (catData.internships || []) as InternshipOpportunity[]
            ).find((o) => o.slug === slug || o.id === slug);
            if (matched) {
              setOpportunity(matched);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load opportunity:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadOpp();
    }
  }, [slug]);

  // Hydrate the Save button from the server: without this a saved internship
  // looked unsaved after every reload even though the row exists in the DB.
  useEffect(() => {
    if (!opportunity?.id || !userId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/candidates/saved?opportunityId=${encodeURIComponent(opportunity.id)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setIsSaved(Boolean(data.isSaved));
      } catch {
        // Offline — leave the local state alone.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opportunity?.id, userId]);

  // Inject JobPosting structured data once the opportunity is loaded.
  // This is the SEO money page: Google indexes rich job results from this.
  useEffect(() => {
    if (!opportunity) return;
    const jsonLd = jobPostingJsonLd({
      title: opportunity.title,
      description: opportunity.description || opportunity.summary || '',
      slug: opportunity.slug,
      city: opportunity.city,
      regionName: regionNameOf(
        opportunity as unknown as Record<string, unknown>,
      ),
      companyName: opportunity.companyName || organization?.name,
      companyWebsite: organization?.website,
      workMode: opportunity.workMode || opportunity.work_mode,
      isPaid: opportunity.isPaid ?? opportunity.is_paid,
      stipendXAF:
        opportunity.allowanceXAF ?? opportunity.stipend_max ?? undefined,
      postedAt:
        opportunity.published_at ||
        opportunity.createdAt ||
        opportunity.created_at,
      deadline:
        opportunity.deadline ||
        opportunity.application_deadline ||
        opportunity.expires_at,
      durationMonths: opportunity.durationMonths || opportunity.duration_months,
    });
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.role = 'jobposting-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [opportunity, organization]);

  // Handle Application Submission
  const handleApplyOnMantech = async () => {
    if (!user) {
      router.push(`/sign-in?redirect_url=/internships/${slug}`);
      return;
    }

    if (!opportunity) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          coverLetter: coverNote,
          applicationMethod: "MANTECH",
        }),
      });

      if (res.ok) {
        setApplied(true);
      } else {
        const data = await res.json();
        setErrorMessage(
          data.error ||
            "Failed to submit application. Please verify your profile.",
        );
      }
    } catch (e) {
      setErrorMessage(
        "Network error connecting to MANTECH application service.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Copy the page URL with a fallback chain: the async Clipboard API only
  // exists on secure origins and can be blocked in embedded frames, so a
  // silent rejection used to make this button look dead. execCommand is the
  // legacy escape hatch; if even that fails we tell the user instead of
  // doing nothing.
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const ok = await copyToClipboard(window.location.href);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard.");
    } else {
      toast.error(
        "Copying was blocked — long-press the address bar to copy the link.",
      );
    }
  };

  // WhatsApp-first share: interns forward opportunities to friends & study
  // groups far more than they copy links. This opens WhatsApp with a
  // prefilled, formatted message so one tap forwards the posting.
  const handleWhatsAppShare = () => {
    if (!opportunity) return;
    const url = waShareInternshipLink({
      title: opportunity.title,
      slug: opportunity.slug || slug,
      company: opportunity.companyName || organization?.name,
      city: opportunity.city,
    });
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    // Popup blockers and embedded previews can swallow window.open —
    // navigate this tab instead so the share never silently does nothing.
    if (!opened) window.location.href = url;
  };

  // WhatsApp apply fallback: routes the intern to MANTECH support on WhatsApp
  // with the posting + a slot to paste their Intern Passport link.
  const handleWhatsAppApply = () => {
    if (!opportunity) return;
    const url = waApplyLink({
      title: opportunity.title,
      company: opportunity.companyName || organization?.name,
    });
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  };

  // Persist the save server-side (SavedOpportunity row) so it survives
  // reloads and shows up on the Saved pages. The flip is optimistic and
  // rolled back if the API rejects it.
  const handleSave = async () => {
    if (!opportunity) return;
    if (!user) {
      router.push(`/sign-in?redirect_url=/internships/${slug}`);
      return;
    }

    const next = !isSaved;
    setIsSaved(next);
    setSaving(true);
    try {
      const res = next
        ? await fetch("/api/candidates/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ opportunityId: opportunity.id }),
          })
        : await fetch(
            `/api/candidates/saved?opportunityId=${encodeURIComponent(opportunity.id)}`,
            { method: "DELETE" },
          );

      if (res.ok) {
        toast.success(next ? "Saved to your list." : "Removed from your list.");
        return;
      }
      if (res.status === 409) return; // Already saved — server state is correct.
      if (res.status === 401) {
        router.push(`/sign-in?redirect_url=/internships/${slug}`);
        return;
      }
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || "Could not update your saved list.");
    } catch (err) {
      setIsSaved(!next); // Roll back the optimistic flip.
      toast.error(
        err instanceof Error ? err.message : "Could not update your saved list.",
      );
    } finally {
      setSaving(false);
    }
  };

  const recordExternalRedirect = async () => {
    if (!user || !opportunity) throw new Error('Sign in to record your application interest.');
    const method = String(opportunity.applicationMethod || "").toUpperCase();
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunityId: opportunity.id,
        applicationMethod: method,
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error || 'Could not record your interest. Please try again.');
    }
  };

  const handleApplyExternal = async () => {
    if (!user) {
      router.push(`/sign-in?redirect_url=/internships/${slug}`);
      return;
    }
    const url = opportunity?.applicationUrl || opportunity?.application_url;
    if (!url) {
      setErrorMessage("No application URL was provided for this posting.");
      return;
    }

    let destination: URL;
    try {
      destination = new URL(url);
      if (destination.protocol !== 'https:' && destination.protocol !== 'http:') {
        throw new Error('The application URL must use HTTP or HTTPS.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The application URL is invalid.');
      return;
    }

    const popup = window.open('', '_blank');
    if (!popup) {
      setErrorMessage('Allow pop-ups for this site to continue to the application page.');
      return;
    }
    popup.opener = null;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await recordExternalRedirect();
      popup.location.replace(destination.toString());
      setApplied(true);
    } catch (error) {
      popup.close();
      setErrorMessage(error instanceof Error ? error.message : 'Could not record your application interest.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          <Trans comment="page p visible text">Loading opportunity details...
        </Trans></p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          <Trans comment="page h2 visible text">Opportunity Not Found
        </Trans></h2>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          <Trans comment="page p visible text">The requested internship listing is either expired, pending
          administrative review, or no longer available.
        </Trans></p>
        <Link href="/internships">
          <Button variant="outline"><Trans comment="page Button visible text">Back to All Internships</Trans></Button>
        </Link>
      </div>
    );
  }

  const skillsList = (opportunity.requiredSkills ||
    opportunity.required_skills ||
    opportunity.skills ||
    []) as string[];
  const preferredSkills = (opportunity.preferredSkills ||
    opportunity.preferred_skills ||
    []) as string[];
  const appMethod = String(
    opportunity.applicationMethod ||
      opportunity.application_method ||
      "MANTECH",
  ).toUpperCase();

  // `field`, `specialization` and `region` arrive as nested Prisma relation
  // objects from /api/internships/[id] (flat strings in the fallback catalog).
  // Resolve them to primitives so React never receives an object as a child.
  const oppShape = opportunity as unknown as Record<string, unknown>;
  const fieldLabel = fieldNameOf(oppShape) || "Professional Field";
  const specializationLabel = specializationNameOf(oppShape);
  const regionLabel = regionNameOf(oppShape) || "Cameroon";

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50">
      {/* Top Breadcrumb Nav */}
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span><Trans comment="page span visible text">Back to Opportunities</Trans></span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className={`h-9 px-3 gap-1.5 text-xs ${isSaved ? "text-blue-600 bg-blue-50" : "text-slate-600"}`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleWhatsAppShare}
              className="h-9 px-3 gap-1.5 text-xs bg-[#25D366] hover:bg-[#1ebe57] text-white"
              title={t({ message: "Share this internship on WhatsApp", comment: "page component title attribute" })}
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span><Trans comment="page span visible text">Share</Trans></span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-9 px-3 gap-1.5 text-xs text-slate-600"
              title={t({ message: "Copy link", comment: "page component title attribute" })}
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
            {opportunity?.id && (
              <ReportButton
                targetType="OPPORTUNITY"
                targetId={opportunity.id}
                className="h-9 px-2 gap-1.5 text-xs text-slate-500 hover:text-red-600"
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Opportunity Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {fieldLabel}
                </Badge>
                {specializationLabel && (
                  <Badge
                    variant="outline"
                    className="border-slate-300 text-slate-700"
                  >
                    {specializationLabel}
                  </Badge>
                )}
                {opportunity.isFeatured && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <Trans comment="page Badge visible text">Featured
                  </Trans></Badge>
                )}
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {String(
                    opportunity.workMode || opportunity.work_mode || "ONSITE",
                  ).toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
                {opportunity.title}
              </h1>

              {/* Organization & Location Meta */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>
                    {opportunity.companyName ||
                      organization?.name ||
                      "Verified Host Enterprise"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>
                    {opportunity.city}{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{", "}{regionLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    {opportunity.durationMonths ||
                      opportunity.duration_months ||
                      3}{" "}
                    <Trans comment="page span visible text">Months
                  </Trans></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold font-mono">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>
                    {opportunity.allowanceXAF || opportunity.allowance_xaf
                      ? `${(opportunity.allowanceXAF || opportunity.allowance_xaf || 0).toLocaleString()} FCFA / mo`
                      : opportunity.isPaid || opportunity.is_paid
                        ? "Stipend Provided"
                        : "Accredited Academic"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading mb-3">
                  <Trans comment="page h2 visible text">Role Overview & Responsibilities
                </Trans></h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {opportunity.description ||
                    opportunity.summary ||
                    "Details for this internship position will be communicated by the recruitment department."}
                </div>
              </div>

              {/* Required Technical Skills */}
              {skillsList.length > 0 && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    <Trans comment="page h3 visible text">Required Competencies & Skills
                  </Trans></h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/60 text-xs font-semibold text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Skills */}
              {preferredSkills.length > 0 && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    <Trans comment="page h3 visible text">Preferred / Bonus Assets
                  </Trans></h3>
                  <div className="flex flex-wrap gap-2">
                    {preferredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Opportunity Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-16 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium">
                    <Trans comment="page div visible text">Education Level
                  </Trans></div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {opportunity.educationLevel ||
                      opportunity.education_level ||
                      "HND / BSc / Master"}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium">
                    <Trans comment="page div visible text">Positions Open
                  </Trans></div>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {opportunity.positions ||
                      opportunity.positions_available ||
                      1}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium">
                    <Trans comment="page div visible text">Application Method
                  </Trans></div>
                  <div className="text-sm font-bold text-blue-700 mt-1 uppercase text-xs">
                    {appMethod.replace("_", " ")}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium">
                    <Trans comment="page div visible text">Deadline
                  </Trans></div>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono text-xs">
                    {opportunity.deadline
                      ? new Date(opportunity.deadline).toLocaleDateString(
                          "en-GB",
                        )
                      : "Rolling Intake"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Application Action & Organization Card */}
          <div className="space-y-6">
            {/* Application Action Box (Method 1, 2, or 3 - SRS Section 8) */}
            <div className="bg-white border-2 border-blue-600/30 rounded-3xl p-6 shadow-lg shadow-blue-500/5 space-y-5 sticky top-32">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  <Trans comment="page span visible text">Recruitment Intake
                </Trans></span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {appMethod === "MANTECH" && "Apply with Intern Passport"}
                  {appMethod === "COMPANY_WEBSITE" &&
                    "Company Portal Application"}
                  {appMethod === "EXTERNAL" && "External Application Portal"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {appMethod === "MANTECH" &&
                    "Your verified Intern Passport and uploaded CV will be submitted directly to the recruiter."}
                  {appMethod === "COMPANY_WEBSITE" &&
                    "This host enterprise manages applications on their official corporate recruitment website."}
                  {appMethod === "EXTERNAL" &&
                    "This host enterprise directs candidates to their external hiring system or university partner portal."}
                </p>
              </div>

              {applied ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900 text-sm">
                    <Trans comment="page div visible text">Application Submitted!
                  </Trans></div>
                  <p className="text-xs text-emerald-700">
                    <Trans comment="page p visible text">Your Intern Passport has been received. You can track this
                    in your dashboard.
                  </Trans></p>
                  <Link href="/dashboard/intern" className="inline-block pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-800 text-xs"
                    >
                      <Trans comment="page Button visible text">View My Applications
                    </Trans></Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Method 1: Apply Directly on MANTECH */}
                  {appMethod === "MANTECH" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          <Trans comment="page label visible text">Cover Note / Personal Motivation (Optional)
                        </Trans></label>
                        <Textarea
                          placeholder={t({ message: "Briefly state why your qualifications match this opportunity...", comment: "page component placeholder attribute" })}
                          value={coverNote}
                          onChange={(e) => setCoverNote(e.target.value)}
                          className="text-xs min-h-[90px] border-slate-200"
                        />
                      </div>

                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                          {errorMessage}
                        </div>
                      )}

                      <Button
                        onClick={handleApplyOnMantech}
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 text-sm gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span><Trans comment="page span visible text">Submitting to Recruiter...</Trans></span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span><Trans comment="page span visible text">Submit Application Now</Trans></span>
                          </>
                        )}
                      </Button>

                      {/* WhatsApp fallback: fastest, cheapest channel for Cameroon students */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleWhatsAppApply}
                        className="w-full border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold py-5 text-sm gap-2 hover:bg-emerald-100 hover:border-emerald-300"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span><Trans comment="page span visible text">Apply via WhatsApp instead</Trans></span>
                      </Button>
                      <p className="text-[11px] text-slate-400 text-center -mt-1">
                        <Trans comment="page p visible text">Prefer chat? Send this posting to our team on WhatsApp and
                        we&apos;ll submit your Intern Passport for you.
                      </Trans></p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span><Trans comment="page span visible text">Server-Authorized Zero-Trust Verification</Trans></span>
                      </div>
                    </>
                  )}

                  {/* Method 2: Apply on Company Website */}
                  {appMethod === "COMPANY_WEBSITE" && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                        <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-blue-900 leading-snug">
                          <Trans comment="page p visible text">Redirects to the official company career site. Your
                          visit and interest will be recorded for this
                          recruiter&apos;s pipeline analytics.
                        </Trans></p>
                      </div>
                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                          {errorMessage}
                        </div>
                      )}
                      <Button
                        onClick={handleApplyExternal}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 text-sm gap-2"
                      >
                        <span><Trans comment="page span visible text">Apply on Official Website</Trans></span>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <p className="text-[11px] text-slate-400 text-center">
                        <Trans comment="page p visible text">You will be redirected to the enterprise application
                        system.
                      </Trans></p>
                    </div>
                  )}

                  {/* Method 3: Apply Externally */}
                  {appMethod === "EXTERNAL" && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                        <Globe className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-amber-900 leading-snug">
                          <Trans comment="page p visible text">Redirects to an external partner hiring platform.
                          MANTECH records the hand-off so recruiters can see
                          every interested candidate across all channels.
                        </Trans></p>
                      </div>
                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                          {errorMessage}
                        </div>
                      )}
                      <Button
                        onClick={handleApplyExternal}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-5 text-sm gap-2"
                      >
                        <span><Trans comment="page span visible text">Apply Externally</Trans></span>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <p className="text-[11px] text-slate-400 text-center">
                        <Trans comment="page p visible text">Official platform:</Trans>{" "}
                        {opportunity.externalPlatform || "Enterprise Portal"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Organization Profile Preview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white font-bold flex items-center justify-center text-lg">
                  {(
                    opportunity.companyName ||
                    organization?.name ||
                    "M"
                  ).charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {opportunity.companyName ||
                      organization?.name ||
                      "Host Enterprise"}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span><Trans comment="page span visible text">Verified Organization</Trans></span>
                  </div>
                </div>
              </div>

              <ResponseRateBadge stats={responseRate} surface="light" />

              <p className="text-xs text-slate-600 line-clamp-3">
                {organization?.description ||
                  "Registered and verified enterprise partner providing professional internship opportunities across Cameroon."}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  <Trans comment="page span visible text">Recruitment Hub
                </Trans></span>
                <span className="font-semibold text-slate-800">
                  {opportunity.city || "Douala"}<Trans comment="page span visible text">, Cameroon
                </Trans></span>
              </div>

              {organization?.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline pt-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span><Trans comment="page span visible text">Visit Organization Website</Trans></span>
                </a>
              )}
            </div>

            {/* Need Direct Assistance Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span><Trans comment="page span visible text">MANTECH Talent Support</Trans></span>
              </div>
              <p>
                <Trans comment="page p visible text">Have questions regarding this opportunity or your application
                status? Contact our support team.
              </Trans></p>
              <a
                href={`${WHATSAPP_LINK}?text=Hello%20MANTECH%20Nexus%2C%20I%20have%20an%20inquiry%20about%20the%20opportunity%3A%20${encodeURIComponent(opportunity.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline pt-1"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" title={t({ message: "WhatsApp", comment: "page component title attribute" })} />
                <span><Trans comment="page span visible text">Ask on WhatsApp</Trans></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
