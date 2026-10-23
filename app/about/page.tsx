"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Target,
  Eye,
  Users,
  Shield,
  TrendingUp,
  Globe,
  ArrowRight,
  Database,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
  SectionHeader,
} from "@/components/shared/section-animations";

const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "Server-enforced role boundaries protect every record, every application, and every user without relying on client-side state.",
  },
  {
    icon: Users,
    title: "Professional Discovery",
    description:
      "Connect opportunity discovery, applications, recruitment, placement, and verified Intern Passports in a single pipeline.",
  },
  {
    icon: TrendingUp,
    title: "Real Database Telemetry",
    description:
      "Dashboard metrics calculated directly from PostgreSQL production records and ACID-compliant state, eliminating synthetic placeholders.",
  },
  {
    icon: Globe,
    title: "Cameroon-First Infrastructure",
    description:
      "Engineered for Cameroon's 10 regions, bilingual academic frameworks (French & English), local enterprise partners, and FCFA/XAF currency.",
  },
];

const pillars = [
  {
    role: "Candidate Engineers & Students",
    icon: GraduationCap,
    desc: "Direct access to accredited corporate hosts, live application tracking, structured interview scheduling, and verified credential passports.",
    tag: "Talent Portal",
  },
  {
    role: "Enterprises & Tech Hubs",
    icon: Building2,
    desc: "Post structured internships, review verified CVs with audit trails, coordinate interview panels, and issue official digital endorsements.",
    tag: "Host Workflows",
  },
  {
    role: "Higher Education Institutions",
    icon: Database,
    desc: "Supervise accredited internships, review tripartite conventions, manage academic supervisors, and authenticate university completion records.",
    tag: "Academic Network",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION WITH BLUR-REVEAL MOTION ───── */}
      <section
        className="relative py-24 lg:py-32 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/about_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80 backdrop-blur-[2px]" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                About MANTECH Nexus // SRS Specification
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Building Cameroon&apos;s National Internship Infrastructure
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus is an enterprise-grade digital highway that
              centralizes the internship lifecycle normally scattered across
              disparate emails, physical paper letters, WhatsApp chats, and
              untracked spreadsheets.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/mantech-internship">
                <Button className="h-12 px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105">
                  Explore IT Portal
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="h-12 px-7 border-slate-600 bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur-sm transition-transform hover:scale-105"
                >
                  Institutional Inquiries
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── MISSION & VISION DUAL-SLIDE MOTIONS ───── */}
      <section className="py-24 relative overflow-hidden border-b border-slate-800/60" style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a1220 50%, #070d18 100%)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity" style={{ backgroundImage: "url('/images/about_tech_bg.jpg')" }} />
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-orange-400 relative z-10">
          <SectionHeader
            eyebrow="Foundation"
            variant="onDark"
            title="Strategic National Mandate"
            description="Bridging higher education institutions with telecom operators, software agencies, and financial institutions across Cameroon."
            className="mb-14"
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedCard className="h-full rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:border-blue-500/40 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20 mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-7 w-7" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mb-3">
                  Our National Mission
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  To serve as the trusted digital backbone for professional
                  internship management across Cameroon. Providing bilingual
                  verification, tripartite university agreements, structured
                  interview scorecards, and verifiable Intern Passports.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-blue-300 font-medium">
                  <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                    Bilingual (EN / FR)
                  </span>
                  <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                    Audited PII Protection
                  </span>
                  <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                    10 Regions Covered
                  </span>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            >
              <AnimatedCard className="h-full rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:border-cyan-500/40 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md shadow-cyan-600/20 mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="h-7 w-7" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mb-3">
                  Our Pan-African Vision
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  A modern African digital economy where every ambitious student
                  is discovered on merit, and where companies access authentic,
                  pre-screened engineering and professional talent with
                  verifiable skill credentials.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-cyan-300 font-medium">
                  <span className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    Merit-Based Placement
                  </span>
                  <span className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    Host Partner Network
                  </span>
                  <span className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    Cryptographic Records
                  </span>
                </div>
              </AnimatedCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── PILLARS WITH 3D FLIP ANIMATIONS ───── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #070e1a 0%, #0c1828 100%)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.05] mix-blend-luminosity" style={{ backgroundImage: "url('/images/security_tech_bg.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-indigo-900/10 pointer-events-none" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            eyebrow="Three Pillars"
            variant="onDark"
            title="Tripartite Ecosystem Collaboration"
            description="Built to coordinate the three core stakeholders of professional internship governance."
            className="mb-12"
          />

          <MotionSection motion="flip3D" stagger={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <MotionItem key={pillar.role} motion="flip3D">
                  <AnimatedCard className="h-full rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-7 shadow-lg hover:shadow-2xl hover:border-blue-500/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-semibold text-slate-400 border-slate-600">
                        {pillar.tag}
                      </Badge>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white mb-2">
                      {pillar.role}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </AnimatedCard>
                </MotionItem>
              );
            })}
          </MotionSection>
        </div>
      </section>

      {/* ───── CORE VALUES WITH SPRING POP ANIMATIONS ───── */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FloatingBadge>
              <Badge className="bg-blue-500/20 text-cyan-300 border-blue-500/40 uppercase tracking-widest text-[10px] mb-3 px-3 py-1">
                Guiding Principles
              </Badge>
            </FloatingBadge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              The MANTECH Quality Standard
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Engineered for absolute reliability, multi-tenant isolation, and
              real educational transformation across Cameroon.
            </p>
          </div>

          <MotionSection motion="pop" stagger={0.08} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <MotionItem key={i} motion="pop">
                  <AnimatedCard className="h-full rounded-2xl border border-white/10 bg-slate-900/90 p-6 space-y-4 backdrop-blur-sm hover:border-blue-500/50 hover:bg-slate-900 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {v.description}
                    </p>
                  </AnimatedCard>
                </MotionItem>
              );
            })}
          </MotionSection>
        </div>
      </section>
    </div>
  );
}
