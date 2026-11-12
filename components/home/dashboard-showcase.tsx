"use client";
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import type { MessageDescriptor } from '@lingui/core';


import { useState } from "react";
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Users,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileCheck2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DashboardKey = "intern" | "company" | "university" | "admin";

interface DashboardInfo {
  key: DashboardKey;
  label: MessageDescriptor;
  badge: MessageDescriptor;
  icon: typeof GraduationCap;
  url: string;
  title: MessageDescriptor;
  headline: MessageDescriptor;
  necessity: MessageDescriptor;
  whoUses: MessageDescriptor;
  primaryBenefit: MessageDescriptor;
  href: string;
  ctaText: MessageDescriptor;
  themeColor: string;
  borderColor: string;
  glowColor: string;
  preview: {
    badgeStatus: MessageDescriptor;
    avatarInitials: string;
    profileTitle: MessageDescriptor;
    profileSub: MessageDescriptor;
    stat1: { label: MessageDescriptor; val: string };
    stat2: { label: MessageDescriptor; val: string };
    stat3: { label: MessageDescriptor; val: string };
    extraBadge: MessageDescriptor;
    highlights: MessageDescriptor[];
  };
}

const DASHBOARDS: DashboardInfo[] = [
  {
    key: "intern",
    label: msg({ message: "Intern & Candidate Portal", comment: "Dashboard showcase label copy" }),
    badge: msg({ message: "Student Career Hub", comment: "Dashboard showcase badge copy" }),
    icon: GraduationCap,
    url: "https://app.mantech-nexus.cm/dashboard/intern",
    title: msg({ message: "Intern Career & Verifiable Passport Dashboard", comment: "Dashboard showcase title copy" }),
    headline: msg({ message: "MN Intern profile preview • Ready for Placement", comment: "Dashboard showcase headline copy" }),
    necessity:
      msg({ message: "Essential for students and recent graduates in Cameroon to bypass traditional unvetted job boards, build a tamper-proof Intern Passport, showcase validated project competencies, and receive direct interview offers from verified employers.", comment: "Dashboard showcase necessity copy" }),
    whoUses: msg({ message: "Students, HND/BSc/MSc candidates, engineering graduates across all 10 regions.", comment: "Dashboard showcase whoUses copy" }),
    primaryBenefit: msg({ message: "100% Free permanent digital identity, automated readiness score, and zero-trust contact privacy.", comment: "Dashboard showcase primaryBenefit copy" }),
    href: "/dashboard/intern",
    ctaText: msg({ message: "Open Intern Workspace", comment: "Dashboard showcase ctaText copy" }),
    themeColor: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-500/40",
    glowColor: "bg-blue-500/10",
    preview: {
      badgeStatus: msg({ message: "Privacy controlled", comment: "Dashboard showcase badgeStatus copy" }),
      avatarInitials: "MN",
      profileTitle: msg({ message: "Intern profile preview", comment: "Dashboard showcase profileTitle copy" }),
      profileSub: msg({ message: "BSc Software Engineering • UY1 (Université de Yaoundé I)", comment: "Dashboard showcase profileSub copy" }),
      stat1: { label: msg({ message: "Profile views", comment: "Dashboard showcase label copy" }), val: "32" },
      stat2: { label: msg({ message: "CV access", comment: "Dashboard showcase label copy" }), val: "18" },
      stat3: { label: msg({ message: "Shortlisted", comment: "Dashboard showcase label copy" }), val: "12" },
      extraBadge: msg({ message: "85% Ready • Passport ID: MN-CE-2026-1041", comment: "Dashboard showcase extraBadge copy" }),
      highlights: [
        msg({ message: "Cryptographically signed Intern Passport with permanent verification URL", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Direct application tracking with real-time status transitions", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "WhatsApp instant alerts for newly posted opportunities matching your field", comment: 'Feature shown in the dashboard showcase preview' }),
      ],
    },
  },
  {
    key: "company",
    label: msg({ message: "Company Recruiter Workspace", comment: "Dashboard showcase label copy" }),
    badge: msg({ message: "Enterprise Sourcing", comment: "Dashboard showcase badge copy" }),
    icon: Building2,
    url: "https://app.mantech-nexus.cm/dashboard/company",
    title: msg({ message: "Host Enterprise & Recruiter Management Workspace", comment: "Dashboard showcase title copy" }),
    headline: msg({ message: "MTN Cameroon • Talent Acquisition Hub", comment: "Dashboard showcase headline copy" }),
    necessity:
      msg({ message: "Empowers corporate recruiters and SME hiring leads to post verified jobs and internships across 60 professional domains, eliminate irrelevant CV spam, inspect authentic academic qualifications, and coordinate interviews seamlessly.", comment: "Dashboard showcase necessity copy" }),
    whoUses: msg({ message: "HR Directors, Talent Acquisition Teams, Engineering Managers, and Founders.", comment: "Dashboard showcase whoUses copy" }),
    primaryBenefit: msg({ message: "0 FCFA launch access, pre-screened candidate pool, and structured candidate contact workflows.", comment: "Dashboard showcase primaryBenefit copy" }),
    href: "/dashboard/company",
    ctaText: msg({ message: "Open Recruiter Workspace", comment: "Dashboard showcase ctaText copy" }),
    themeColor: "from-emerald-600 to-teal-600",
    borderColor: "border-emerald-500/40",
    glowColor: "bg-emerald-500/10",
    preview: {
      badgeStatus: msg({ message: "Accredited Enterprise", comment: "Dashboard showcase badgeStatus copy" }),
      avatarInitials: "MTN",
      profileTitle: msg({ message: "MTN Cameroon Corporate Workspace", comment: "Dashboard showcase profileTitle copy" }),
      profileSub: msg({ message: "Telecommunications & Cloud Services • Douala, Littoral", comment: "Dashboard showcase profileSub copy" }),
      stat1: { label: msg({ message: "Active Roles", comment: "Dashboard showcase label copy" }), val: "14" },
      stat2: { label: msg({ message: "Applicants", comment: "Dashboard showcase label copy" }), val: "124" },
      stat3: { label: msg({ message: "Shortlisted", comment: "Dashboard showcase label copy" }), val: "28" },
      extraBadge: msg({ message: "Zero-Spam Filtered • 60 Professional Domains", comment: "Dashboard showcase extraBadge copy" }),
      highlights: [
        msg({ message: "Post full-time jobs, graduate contracts, and specialized internships in minutes", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Search pre-screened candidates filtered by exact skills and university", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Send verified Contact Requests respecting candidate privacy", comment: 'Feature shown in the dashboard showcase preview' }),
      ],
    },
  },
  {
    key: "university",
    label: msg({ message: "University Placement Portal", comment: "Dashboard showcase label copy" }),
    badge: msg({ message: "Academic Oversight", comment: "Dashboard showcase badge copy" }),
    icon: Users,
    url: "https://app.mantech-nexus.cm/dashboard/university",
    title: msg({ message: "University & Higher Institute Placement Directorate", comment: "Dashboard showcase title copy" }),
    headline: msg({ message: "ENSPY Yaoundé • Academic Directorate", comment: "Dashboard showcase headline copy" }),
    necessity:
      msg({ message: "Transforms how Cameroon higher education institutions manage student internships: digitizes tripartite academic conventions, assigns faculty supervisors, tracks student placements, and lets universities recruit their own interns.", comment: "Dashboard showcase necessity copy" }),
    whoUses: msg({ message: "University Deans, Faculty Placement Coordinators, and Department Heads.", comment: "Dashboard showcase whoUses copy" }),
    primaryBenefit: msg({ message: "Tripartite convention digital validation and Dual-Mode (Placement Assistance + Internal Recruiting).", comment: "Dashboard showcase primaryBenefit copy" }),
    href: "/dashboard/university",
    ctaText: msg({ message: "Open University Portal", comment: "Dashboard showcase ctaText copy" }),
    themeColor: "from-amber-600 to-orange-600",
    borderColor: "border-amber-500/40",
    glowColor: "bg-amber-500/10",
    preview: {
      badgeStatus: msg({ message: "Institutional Partner", comment: "Dashboard showcase badgeStatus copy" }),
      avatarInitials: "ENS",
      profileTitle: msg({ message: "ENSPY Placement Directorate", comment: "Dashboard showcase profileTitle copy" }),
      profileSub: msg({ message: "Engineering & Applied Sciences • Yaoundé, Centre", comment: "Dashboard showcase profileSub copy" }),
      stat1: { label: msg({ message: "Students Placed", comment: "Dashboard showcase label copy" }), val: "340" },
      stat2: { label: msg({ message: "Conventions", comment: "Dashboard showcase label copy" }), val: "128" },
      stat3: { label: msg({ message: "Partner Hosts", comment: "Dashboard showcase label copy" }), val: "45" },
      extraBadge: msg({ message: "Dual-Mode: Coordination & Campus Recruitment", comment: "Dashboard showcase extraBadge copy" }),
      highlights: [
        msg({ message: "Supervise tripartite conventions without physical paper back-and-forth", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Monitor student internship logbooks, faculty supervisor reviews, and completions", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Mode B: Recruit student interns directly for campus labs and IT services", comment: 'Feature shown in the dashboard showcase preview' }),
      ],
    },
  },
  {
    key: "admin",
    label: msg({ message: "Central Command Center", comment: "Dashboard showcase label copy" }),
    badge: msg({ message: "Trust & Safety", comment: "Dashboard showcase badge copy" }),
    icon: ShieldCheck,
    url: "https://app.mantech-nexus.cm/dashboard/admin",
    title: msg({ message: "MANTECH Nexus Central Security & Governance Console", comment: "Dashboard showcase title copy" }),
    headline: msg({ message: "MANTECH Central Governance Console", comment: "Dashboard showcase headline copy" }),
    necessity:
      msg({ message: "Protects the integrity of Cameroon's recruitment ecosystem by validating legal business registrations, moderating published opportunities against scams, auditing access logs, and maintaining taxonomy across 60 professional fields.", comment: "Dashboard showcase necessity copy" }),
    whoUses: msg({ message: "MANTECH platform moderators, compliance officers, and system administrators.", comment: "Dashboard showcase whoUses copy" }),
    primaryBenefit: msg({ message: "Zero-tolerance scam prevention, audit trail accountability, and national placement telemetry.", comment: "Dashboard showcase primaryBenefit copy" }),
    href: "/dashboard/admin",
    ctaText: msg({ message: "Open Admin Console", comment: "Dashboard showcase ctaText copy" }),
    themeColor: "from-purple-600 to-indigo-600",
    borderColor: "border-purple-500/40",
    glowColor: "bg-purple-500/10",
    preview: {
      badgeStatus: msg({ message: "System Core Verified", comment: "Dashboard showcase badgeStatus copy" }),
      avatarInitials: "MN",
      profileTitle: msg({ message: "Platform Moderation & Security Console", comment: "Dashboard showcase profileTitle copy" }),
      profileSub: msg({ message: "ACID Relational Core • 10 Administrative Regions", comment: "Dashboard showcase profileSub copy" }),
      stat1: { label: msg({ message: "Verified Orgs", comment: "Dashboard showcase label copy" }), val: "180" },
      stat2: { label: msg({ message: "Active Fields", comment: "Dashboard showcase label copy" }), val: "60" },
      stat3: { label: msg({ message: "Live Listings", comment: "Dashboard showcase label copy" }), val: "210" },
      extraBadge: msg({ message: "Enterprise ACID Database • 99.8% Uptime", comment: "Dashboard showcase extraBadge copy" }),
      highlights: [
        msg({ message: "Review organization accreditation documents (tax IDs & commercial registry)", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Audit trail tracking every profile view, contact request, and status change", comment: 'Feature shown in the dashboard showcase preview' }),
        msg({ message: "Real-time regional telemetry monitoring placements from Maroua to Douala", comment: 'Feature shown in the dashboard showcase preview' }),
      ],
    },
  },
];

export function DashboardShowcase() {
  const { t } = useLingui();
  const [activeKey, setActiveKey] = useState<DashboardKey>("intern");
  const current = DASHBOARDS.find((d) => d.key === activeKey) || DASHBOARDS[0];

  return (
    <section className="py-24 bg-[#070b16] border-b border-slate-800/80 relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-300 tracking-wide mb-3">
            <Laptop className="w-3.5 h-3.5 text-blue-400" />
            <span><Trans comment="dashboard-showcase span visible text">Interactive Platform Architecture</Trans></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] text-blue-400 font-mono"><Trans comment="dashboard-showcase span visible text">4 Specialized Workspaces</Trans></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            <Trans comment="dashboard-showcase h2 visible text">Explore Dedicated Dashboards Built for Every Stakeholder
          </Trans></h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            <Trans comment="dashboard-showcase p visible text">MANTECH Nexus isolates each user type into a specialized, secure workspace. Preview each dashboard before entering to understand its necessity and capabilities.
          </Trans></p>

          {/* Interactive Tab Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md max-w-2xl mx-auto shadow-xl">
            {DASHBOARDS.map((dash) => {
              const Icon = dash.icon;
              const isActive = dash.key === activeKey;
              return (
                <button
                  key={dash.key}
                  onClick={() => setActiveKey(dash.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r " + dash.themeColor + " text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(dash.label)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Preview Presentation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left 5 cols: Explanation & Necessity */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 mb-3">
                  <Badge variant="outline" className="border-0 p-0 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                    {t(current.badge)}
                  </Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white leading-tight">
                  {t(current.title)}
                </h3>
              </div>

              {/* Necessity Callout */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-2.5 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span><Trans comment="dashboard-showcase span visible text">Why this dashboard is necessary</Trans></span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {t(current.necessity)}
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Trans comment="dashboard-showcase p visible text">Core Capabilities &amp; Workflows
                </Trans></p>
                <ul className="space-y-2">
                  {current.preview.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t(h)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link href={current.href}>
                  <Button className={`w-full bg-gradient-to-r ${current.themeColor} hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-600/20 h-11 rounded-xl gap-2`}>
                    <span>{t(current.ctaText)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {/* Audience note — separated below the button */}
              <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-500">
                <span className="shrink-0 font-bold text-slate-400 uppercase tracking-wide"><Trans comment="dashboard-showcase span visible text">For:</Trans></span>
                <span className="leading-relaxed">{t(current.whoUses)}</span>
              </div>
            </div>

            {/* Right 7 cols: Authentic Browser Mockup */}
            <div className="lg:col-span-7">
              <div className={`rounded-3xl border ${current.borderColor} bg-slate-900/90 backdrop-blur-2xl p-2 sm:p-2.5 shadow-2xl shadow-blue-950/80 transition-all duration-300`}>
                {/* Browser Chrome Header */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10 bg-slate-950/70 rounded-t-2xl">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="ml-2 flex-1 h-6 rounded-lg bg-white/10 text-[11px] text-slate-300 flex items-center px-3 font-mono truncate">
                    <Lock className="w-3 h-3 text-emerald-400 mr-1.5 shrink-0" />
                    <span className="truncate">{current.url}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline"><Trans comment="dashboard-showcase span visible text">200 OK</Trans></span>
                </div>

                {/* Dashboard Inner Display */}
                <div className="p-5 sm:p-7 space-y-5">
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${current.themeColor} text-white font-bold text-base flex items-center justify-center shadow-lg shrink-0`}>
                        {current.preview.avatarInitials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{t(current.preview.profileTitle)}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {t(current.preview.profileSub)}
                        </div>
                      </div>
                    </div>
                    <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                      {t(current.preview.badgeStatus)}
                    </div>
                  </div>

                  {/* Primary Feature Panel */}
                  <div className={`rounded-2xl border ${current.borderColor} bg-slate-950/70 p-4 sm:p-5 space-y-3 relative overflow-hidden`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                        {t(current.headline)}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {t(current.preview.extraBadge)}
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${current.themeColor}`}
                        style={{ width: "92%" }}
                      />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {t(current.primaryBenefit)}
                    </p>
                  </div>

                  {/* 3 Metric Summary Tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
                        {current.preview.stat1.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {t(current.preview.stat1.label)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
                        {current.preview.stat2.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {t(current.preview.stat2.label)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                        {current.preview.stat3.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {t(current.preview.stat3.label)}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Ribbon */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-slate-300 font-mono text-[11px]"><Trans comment="dashboard-showcase span visible text">Direct Workspace Access Enabled</Trans></span>
                    </div>
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <span><Trans comment="dashboard-showcase span visible text">Enter </Trans>{t(current.label)}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
