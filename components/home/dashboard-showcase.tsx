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

type DashboardKey = "intern" | "post" | "admin";

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
    label: "Candidate & Talent Portal",
    badge: "Job Seekers & Interns",
    icon: GraduationCap,
    url: "https://app.mantech-nexus.cm/dashboard/intern",
    title: "Job Seeker & Intern Career Passport Dashboard",
    headline: "Candidate Talent Profile • Ready for Placement & Hiring",
    necessity:
      "Essential for job seekers, recent graduates, and students across Cameroon to track applications, manage verified Talent Passports, showcase validated skills, and receive direct recruiter contact via WhatsApp and email.",
    whoUses: "Job seekers, professionals, HND/BSc/MSc candidates, engineering graduates across all 10 regions.",
    primaryBenefit: "100% Free digital career identity, WhatsApp direct hiring alerts, and verified skill badges.",
    href: "/dashboard/intern",
    ctaText: "Open Candidate Workspace",
    themeColor: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-500/40",
    glowColor: "bg-blue-500/10",
    preview: {
      badgeStatus: "Active Candidate",
      avatarInitials: "MN",
      profileTitle: "Candidate Talent Profile",
      profileSub: "Software Engineer / Data Analyst • Douala, Cameroon",
      stat1: { label: "Profile views", val: "48" },
      stat2: { label: "CV Downloads", val: "22" },
      stat3: { label: "Interviews", val: "5" },
      extraBadge: "90% Ready • Passport ID: MN-CM-2026-1041",
      highlights: [
        "Cryptographically signed Talent Passport with permanent verification link",
        "Track job and internship applications with instant status updates",
        "WhatsApp instant alerts for newly posted opportunities matching your field",
      ],
    },
  },
  {
    key: "post",
    label: "Instant Opportunity Publisher",
    badge: "0-Registration Posting",
    icon: Sparkles,
    url: "https://app.mantech-nexus.cm/post",
    title: "Instant Recruiter & Employer Posting Engine",
    headline: "Post in 30 Seconds • No Account Required",
    necessity:
      "No tedious account creation or multi-page forms. Recruiters, shop owners, and HR teams can immediately post opportunities using Visual Flyers, Career Portal Links, or Quick Announcement text with direct WhatsApp apply.",
    whoUses: "Enterprises, SMEs, startups, shops, HR leads, and recruiters across Cameroon.",
    primaryBenefit: "Instant live publication, direct WhatsApp applicants, and multi-channel notice board reach.",
    href: "/post",
    ctaText: "Post an Opportunity Now",
    themeColor: "from-emerald-600 to-teal-600",
    borderColor: "border-emerald-500/40",
    glowColor: "bg-emerald-500/10",
    preview: {
      badgeStatus: "Frictionless Posting",
      avatarInitials: "HR",
      profileTitle: "Instant Recruitment Publisher",
      profileSub: "Flyer • WhatsApp Broadcast • Career Portal Link",
      stat1: { label: "Post Modes", val: "3" },
      stat2: { label: "Time to Post", val: "30s" },
      stat3: { label: "Live Reach", val: "10 Reg." },
      extraBadge: "Zero Login Required • Direct WhatsApp Contact",
      highlights: [
        "Upload high-res visual recruitment posters and flyers",
        "Paste WhatsApp group broadcasts with auto-extracted details",
        "Share company careers portal links with full descriptive context",
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
      "Protects the integrity of Cameroon's recruitment ecosystem by moderating published opportunities against scams, auditing access logs, and maintaining taxonomy across 60 professional fields.",
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
      stat1: { label: "Verified Posts", val: "240" },
      stat2: { label: "Active Fields", val: "60" },
      stat3: { label: "Live Listings", val: "210" },
      extraBadge: "Enterprise ACID Database • 99.8% Uptime",
      highlights: [
        "Scam detection and compliance moderation for all incoming postings",
        "Audit trail tracking every opportunity and application transition",
        "Real-time national telemetry monitoring jobs and internships across Cameroon",
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
            <span>Unified Platform Ecosystem</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] text-blue-400 font-mono">Dedicated Candidate & Recruiter Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Streamlined Portals for Candidates, Recruiters & Governance
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            MANTECH Nexus pairs an intelligent candidate portal with instant frictionless recruiter posting and central governance. Direct access, zero friction.
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

              {/* CTA Button */}
              <div className="pt-2">
                <Link href={current.href}>
                  <Button className={`w-full bg-gradient-to-r ${current.themeColor} hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-600/20 h-11 rounded-xl gap-2`}>
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {/* Audience note — separated below the button */}
              <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-500">
                <span className="shrink-0 font-bold text-slate-400 uppercase tracking-wide">For:</span>
                <span className="leading-relaxed">{current.whoUses}</span>
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
