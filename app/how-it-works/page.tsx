"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  FileCheck,
  ClipboardList,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  SectionHeader,
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
} from "@/components/shared/section-animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "1. Discovery & Intelligent Matching",
    description:
      "Students find legitimate internships across Cameroon using smart filters by professional field, region, city, work mode, and duration.",
    badge: "Step 01",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    icon: FileCheck,
    title: "2. Profile Readiness Audit",
    description:
      "Complete profile, education, CV, skills, and documents. The readiness score shows preparation level — strictly calculated, never synthetic.",
    badge: "Step 02",
    tagColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    icon: ClipboardList,
    title: "3. Direct & Audited Application",
    description:
      "Apply through MANTECH, company career link, or direct host portal. Track every application status in real-time from submission to decision.",
    badge: "Step 03",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    icon: Users,
    title: "4. Host Review & Structured Shortlisting",
    description:
      "Verified companies review authenticated applications, shortlist candidates with role-based privacy, and schedule structured interviews.",
    badge: "Step 04",
    tagColor: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    icon: Briefcase,
    title: "5. Placement & Tripartite Onboarding",
    description:
      "Selection leads to formalized placement with learning objectives, university supervisor coordination, and onboarding checklists.",
    badge: "Step 05",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    icon: TrendingUp,
    title: "6. Active Internship & Health Tracking",
    description:
      "Track placement health, weekly logbook milestones, performance check-ins, and permitted status updates throughout the internship.",
    badge: "Step 06",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    icon: Award,
    title: "7. Outcome & Verified Endorsement",
    description:
      "Structured completion evaluations, verified host organization recommendations, and tamper-resistant digital records.",
    badge: "Step 07",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    icon: CheckCircle2,
    title: "8. Cryptographic Intern Passport",
    description:
      "Your permanent Intern Passport presents your verified profile to future recruiters, with private contact info protected by access tokens.",
    badge: "Step 08",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

const roleFlows = [
  {
    title: "Students & Interns",
    icon: GraduationCap,
    gradient: "from-blue-600 to-cyan-600",
    bgBadge: "bg-blue-100 text-blue-700",
    href: "/how-it-works/students",
    steps: [
      "Register & verify bilingual profile",
      "Search & match accredited internships",
      "Submit applications with live audit status",
      "Attend structured interviews",
      "Complete logged placement milestones",
      "Obtain tamper-evident Intern Passport",
    ],
  },
  {
    title: "Host Companies",
    icon: Building2,
    gradient: "from-cyan-600 to-teal-600",
    bgBadge: "bg-cyan-100 text-cyan-700",
    href: "/how-it-works/companies",
    steps: [
      "Register enterprise & pass business verification",
      "Publish structured internship opportunities",
      "Review candidates with strict PII controls",
      "Conduct scored interviews and shortlists",
      "Confirm placement agreements & supervisors",
      "Track recruitment outcomes and issue endorsements",
    ],
  },
  {
    title: "Universities & Schools",
    icon: Users,
    gradient: "from-violet-600 to-purple-600",
    bgBadge: "bg-violet-100 text-violet-700",
    href: "/how-it-works/universities",
    steps: [
      "Verify educational institution credentials",
      "Authorize academic coordinators & tutors",
      "Monitor student internship conventions",
      "Supervise logbooks & mid-term evaluations",
      "Coordinate with host enterprise mentors",
      "Access real-time placement statistics",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION (BLUR-REVEAL) ───── */}
      <section className="surface-page relative overflow-hidden border-b border-border/70 py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="container-mantech relative px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 24 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                The Complete Lifecycle Architecture
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              End-to-End Internship Governance
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              MANTECH manages every single phase from opportunity discovery to
              verified credential endorsement — delivering an audited ecosystem,
              not an unregulated job board.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───── TIMELINE SECTION WITH ALTERNATING MOTIONS ───── */}
      <section className="py-24 bg-white relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="8-Stage Pathway"
            title="The Lifecycle from Search to Certification"
            description="Every stage is secured by role-based boundaries and permanent records in our central database."
            className="mb-16"
          />

          <div className="relative max-w-5xl mx-auto">
            {/* Center Timeline Spine */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-cyan-400 to-emerald-500 hidden lg:block" />

            <div className="space-y-12">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex flex-col gap-6 lg:flex-row lg:items-center ${
                      isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <AnimatedCard
                        className={`rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-sm hover:shadow-xl transition-all ${
                          isEven ? "lg:text-right" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-3 mb-4 ${
                            isEven ? "lg:justify-end" : ""
                          }`}
                        >
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                            <step.icon className="h-6 w-6" />
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[11px] font-semibold border ${step.tagColor}`}
                          >
                            {step.badge}
                          </Badge>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-slate-900">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </AnimatedCard>
                    </div>

                    {/* Timeline Center Node */}
                    <div className="hidden lg:flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-cyan-600 text-sm font-bold text-white shadow-lg z-10">
                      {idx + 1}
                    </div>

                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───── ROLE-SPECIFIC FLOWS WITH FLIP3D ───── */}
      <section className="py-24 surface-page border-t border-border/70 relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Targeted Workflows"
            title="Tailored Journeys for Every Stakeholder"
            description="Whether applying for an internship, evaluating candidates, or supervising academic compliance, MANTECH provides an optimized portal."
            className="mb-14"
          />

          <MotionSection
            motion="flip3D"
            stagger={0.12}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {roleFlows.map((flow) => {
              const Icon = flow.icon;
              return (
                <MotionItem key={flow.title} motion="flip3D">
                  <AnimatedCard className="h-full rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${flow.gradient} text-white shadow-md`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs font-semibold ${flow.bgBadge}`}
                        >
                          Portal Flow
                        </Badge>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-slate-900 mb-4">
                        {flow.title}
                      </h3>

                      <ol className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                        {flow.steps.map((st, i) => (
                          <li key={st} className="flex items-start gap-2">
                            <span className="font-bold text-blue-600 shrink-0">
                              0{i + 1}.
                            </span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100">
                      <Link
                        href={flow.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:gap-2.5 transition-all"
                      >
                        Explore detailed guide <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </AnimatedCard>
                </MotionItem>
              );
            })}
          </MotionSection>
        </div>
      </section>

      {/* ───── INTEGRITY GUARANTEE WITH SCALE-IN ───── */}
      <section className="py-20 bg-slate-950 text-white relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-4">
              Real Data. Real Security. No Synthetic Placeholders.
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed mb-8">
              Every profile, internship opening, and verified Intern Passport is
              backed by our live PostgreSQL database with audit logging, role-based
              privacy guards, and bilingual support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-up">
                <Button className="h-11 px-7 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/30">
                  Create Your Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="h-11 px-7 border-slate-700 bg-white/5 hover:bg-white/10 text-white text-xs"
                >
                  Contact Concierge
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
