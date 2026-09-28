'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, FileCheck, ClipboardList, Users, Briefcase, TrendingUp, Award, CheckCircle2, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const steps = [
  { icon: Search, title: 'Discovery', description: 'Students find legitimate IT internships across Cameroon using smart filters by field, region, city, work mode, and duration.' },
  { icon: FileCheck, title: 'Readiness', description: 'Complete profile, education, CV, skills, and documents. The readiness score shows preparation level — never a guarantee of selection.' },
  { icon: ClipboardList, title: 'Application', description: 'Apply through MANTECH, company website, or external platforms. Track status from submitted to completed.' },
  { icon: Users, title: 'Review & Shortlist', description: 'Companies review applications, shortlist candidates, and schedule interviews with structured workflows.' },
  { icon: Briefcase, title: 'Placement & Onboarding', description: 'Selection leads to placement with objectives, supervisor assignment, and pre-internship onboarding checklist.' },
  { icon: TrendingUp, title: 'Active Internship', description: 'Monitor progress with weekly reports, milestones, supervisor reviews, and internship health monitoring.' },
  { icon: Award, title: 'Evaluation', description: 'Structured evaluations from supervisors, companies, and student reflections with permission-controlled visibility.' },
  { icon: CheckCircle2, title: 'Completion & Verification', description: 'Verified completion creates a persistent digital internship history. Career Passport presents the journey.' },
];

export default function HowItWorksPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">How It Works</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">The complete internship lifecycle</h1>
            <p className="mt-4 text-lg text-muted-foreground">MANTECH manages every step from opportunity discovery to verified completion — not just a job board.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border hidden lg:block" />
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <FadeIn key={step.title} delay={idx * 0.05}>
                  <div className={`flex flex-col gap-4 lg:flex-row lg:items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <div className={`rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover ${idx % 2 === 1 ? 'lg:text-right' : ''}`}>
                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-mantech text-white`}><step.icon className="h-6 w-6" /></div>
                        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="hidden lg:flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary text-sm font-bold text-white shadow-card z-10">{idx + 1}</div>
                    <div className="flex-1" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-mantech">
          <SectionHeader eyebrow="Role-Specific Flows" title="How it works for each role" />
          <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StaggerItem>
              <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-mantech text-white"><GraduationCap className="h-6 w-6" /></div>
                <h3 className="mt-4 font-heading text-lg font-semibold">Students</h3>
                <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">{['Register & build profile', 'Search & match internships', 'Apply & track status', 'Complete reports', 'Receive evaluations', 'Get verified completion'].map((s, i) => (<li key={s}><span className="font-medium text-primary">{i + 1}.</span> {s}</li>))}</ol>
                <Link href="/how-it-works/students" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-orange text-white"><Building2 className="h-6 w-6" /></div>
                <h3 className="mt-4 font-heading text-lg font-semibold">Companies</h3>
                <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">{['Register & verify company', 'Create internships', 'Review applications', 'Shortlist & interview', 'Select & place', 'Monitor & evaluate'].map((s, i) => (<li key={s}><span className="font-medium text-accent">{i + 1}.</span> {s}</li>))}</ol>
                <Link href="/how-it-works/companies" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white"><Users className="h-6 w-6" /></div>
                <h3 className="mt-4 font-heading text-lg font-semibold">Universities</h3>
                <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">{['Register & verify institution', 'Add authorized staff', 'Monitor placements', 'Track active internships', 'Coordinate supervisors', 'Access analytics'].map((s, i) => (<li key={s}><span className="font-medium text-green-600">{i + 1}.</span> {s}</li>))}</ol>
                <Link href="/how-it-works/universities" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
