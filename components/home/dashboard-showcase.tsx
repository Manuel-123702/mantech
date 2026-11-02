"use client";

import { useState } from "react";
import Link from "next/link";
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
  label: string;
  badge: string;
  icon: typeof GraduationCap;
  url: string;
  title: string;
  headline: string;
  necessity: string;
  whoUses: string;
  primaryBenefit: string;
  href: string;
  ctaText: string;
  themeColor: string;
  borderColor: string;
  glowColor: string;
  preview: {
    badgeStatus: string;
    avatarInitials: string;
    profileTitle: string;
    profileSub: string;
    stat1: { label: string; val: string };
    stat2: { label: string; val: string };
    stat3: { label: string; val: string };
    extraBadge: string;
    highlights: string[];
  };
}

const DASHBOARDS: DashboardInfo[] = [
  {
    key: "intern",
    label: "Intern & Candidate Portal",
    badge: "Student Career Hub",
    icon: GraduationCap,
    url: "https://app.mantech-nexus.cm/dashboard/intern",
    title: "Intern Career & Verifiable Passport Dashboard",
    headline: "MN Intern profile preview • Ready for Placement",
    necessity:
      "Essential for students and recent graduates in Cameroon to bypass traditional unvetted job boards, build a tamper-proof Intern Passport, showcase validated project competencies, and receive direct interview offers from verified employers.",
    whoUses: "Students, HND/BSc/MSc candidates, engineering graduates across all 10 regions.",
    primaryBenefit: "100% Free permanent digital identity, automated readiness score, and zero-trust contact privacy.",
    href: "/dashboard/intern",
    ctaText: "Open Intern Workspace",
    themeColor: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-500/40",
    glowColor: "bg-blue-500/10",
    preview: {
      badgeStatus: "Privacy controlled",
      avatarInitials: "MN",
      profileTitle: "Intern profile preview",
      profileSub: "BSc Software Engineering • UY1 (Université de Yaoundé I)",
      stat1: { label: "Profile views", val: "32" },
      stat2: { label: "CV access", val: "18" },
      stat3: { label: "Shortlisted", val: "12" },
      extraBadge: "85% Ready • Passport ID: MN-CE-2026-1041",
      highlights: [
        "Cryptographically signed Intern Passport with permanent verification URL",
        "Direct application tracking with real-time status transitions",
        "WhatsApp instant alerts for newly posted opportunities matching your field",
      ],
    },
  },
  {
    key: "company",
    label: "Company Recruiter Workspace",
    badge: "Enterprise Sourcing",
    icon: Building2,
    url: "https://app.mantech-nexus.cm/dashboard/company",
    title: "Host Enterprise & Recruiter Management Workspace",
    headline: "MTN Cameroon • Talent Acquisition Hub",
    necessity:
      "Empowers corporate recruiters and SME hiring leads to post verified jobs and internships across 60 professional domains, eliminate irrelevant CV spam, inspect authentic academic qualifications, and coordinate interviews seamlessly.",
    whoUses: "HR Directors, Talent Acquisition Teams, Engineering Managers, and Founders.",
    primaryBenefit: "0 FCFA launch access, pre-screened candidate pool, and structured candidate contact workflows.",
    href: "/dashboard/company",
    ctaText: "Open Recruiter Workspace",
    themeColor: "from-emerald-600 to-teal-600",
    borderColor: "border-emerald-500/40",
    glowColor: "bg-emerald-500/10",
    preview: {
      badgeStatus: "Accredited Enterprise",
      avatarInitials: "MTN",
      profileTitle: "MTN Cameroon Corporate Workspace",
      profileSub: "Telecommunications & Cloud Services • Douala, Littoral",
      stat1: { label: "Active Roles", val: "14" },
      stat2: { label: "Applicants", val: "124" },
      stat3: { label: "Shortlisted", val: "28" },
      extraBadge: "Zero-Spam Filtered • 60 Professional Domains",
      highlights: [
        "Post full-time jobs, graduate contracts, and specialized internships in minutes",
        "Search pre-screened candidates filtered by exact skills and university",
        "Send verified Contact Requests respecting candidate privacy",
      ],
    },
  },
  {
    key: "university",
    label: "University Placement Portal",
    badge: "Academic Oversight",
    icon: Users,
    url: "https://app.mantech-nexus.cm/dashboard/university",
    title: "University & Higher Institute Placement Directorate",
    headline: "ENSPY Yaoundé • Academic Directorate",
    necessity:
      "Transforms how Cameroon higher education institutions manage student internships: digitizes tripartite academic conventions, assigns faculty supervisors, tracks student placements, and lets universities recruit their own interns.",
    whoUses: "University Deans, Faculty Placement Coordinators, and Department Heads.",
    primaryBenefit: "Tripartite convention digital validation and Dual-Mode (Placement Assistance + Internal Recruiting).",
    href: "/dashboard/university",
    ctaText: "Open University Portal",
    themeColor: "from-amber-600 to-orange-600",
    borderColor: "border-amber-500/40",
    glowColor: "bg-amber-500/10",
    preview: {
      badgeStatus: "Institutional Partner",
      avatarInitials: "ENS",
      profileTitle: "ENSPY Placement Directorate",
      profileSub: "Engineering & Applied Sciences • Yaoundé, Centre",
      stat1: { label: "Students Placed", val: "340" },
      stat2: { label: "Conventions", val: "128" },
      stat3: { label: "Partner Hosts", val: "45" },
      extraBadge: "Dual-Mode: Coordination & Campus Recruitment",
      highlights: [
        "Supervise tripartite conventions without physical paper back-and-forth",
        "Monitor student internship logbooks, faculty supervisor reviews, and completions",
        "Mode B: Recruit student interns directly for campus labs and IT services",
      ],
    },
  },
  {
    key: "admin",
    label: "Central Command Center",
    badge: "Trust & Safety",
    icon: ShieldCheck,
    url: "https://app.mantech-nexus.cm/dashboard/admin",
    title: "MANTECH Nexus Central Security & Governance Console",
    headline: "MANTECH Central Governance Console",
    necessity:
      "Protects the integrity of Cameroon's recruitment ecosystem by validating legal business registrations, moderating published opportunities against scams, auditing access logs, and maintaining taxonomy across 60 professional fields.",
    whoUses: "MANTECH platform moderators, compliance officers, and system administrators.",
    primaryBenefit: "Zero-tolerance scam prevention, audit trail accountability, and national placement telemetry.",
    href: "/dashboard/admin",
    ctaText: "Open Admin Console",
    themeColor: "from-purple-600 to-indigo-600",
    borderColor: "border-purple-500/40",
    glowColor: "bg-purple-500/10",
    preview: {
      badgeStatus: "System Core Verified",
      avatarInitials: "MN",
      profileTitle: "Platform Moderation & Security Console",
      profileSub: "ACID Relational Core • 10 Administrative Regions",
      stat1: { label: "Verified Orgs", val: "180" },
      stat2: { label: "Active Fields", val: "60" },
      stat3: { label: "Live Listings", val: "210" },
      extraBadge: "Enterprise ACID Database • 99.8% Uptime",
      highlights: [
        "Review organization accreditation documents (tax IDs & commercial registry)",
        "Audit trail tracking every profile view, contact request, and status change",
        "Real-time regional telemetry monitoring placements from Maroua to Douala",
      ],
    },
  },
];

export function DashboardShowcase() {
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
            <span>Interactive Platform Architecture</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] text-blue-400 font-mono">4 Specialized Workspaces</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Explore Dedicated Dashboards Built for Every Stakeholder
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            MANTECH Nexus isolates each user type into a specialized, secure workspace. Preview each dashboard before entering to understand its necessity and capabilities.
          </p>

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
                  <span>{dash.label}</span>
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
                    {current.badge}
                  </Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white leading-tight">
                  {current.title}
                </h3>
              </div>

              {/* Necessity Callout */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-2.5 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Why this dashboard is necessary</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {current.necessity}
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Core Capabilities &amp; Workflows
                </p>
                <ul className="space-y-2">
                  {current.preview.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Users & CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href={current.href} className="flex-1">
                  <Button className={`w-full bg-gradient-to-r ${current.themeColor} hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-600/20 h-11 rounded-xl gap-2`}>
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-center sm:text-left">
                  <span className="font-semibold text-slate-300">Audience: </span>
                  {current.whoUses}
                </div>
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
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">200 OK</span>
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
                          <span>{current.preview.profileTitle}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {current.preview.profileSub}
                        </div>
                      </div>
                    </div>
                    <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                      {current.preview.badgeStatus}
                    </div>
                  </div>

                  {/* Primary Feature Panel */}
                  <div className={`rounded-2xl border ${current.borderColor} bg-slate-950/70 p-4 sm:p-5 space-y-3 relative overflow-hidden`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                        {current.headline}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {current.preview.extraBadge}
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${current.themeColor}`}
                        style={{ width: "92%" }}
                      />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {current.primaryBenefit}
                    </p>
                  </div>

                  {/* 3 Metric Summary Tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
                        {current.preview.stat1.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {current.preview.stat1.label}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
                        {current.preview.stat2.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {current.preview.stat2.label}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                        {current.preview.stat3.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {current.preview.stat3.label}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Ribbon */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-slate-300 font-mono text-[11px]">Direct Workspace Access Enabled</span>
                    </div>
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <span>Enter {current.label}</span>
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
