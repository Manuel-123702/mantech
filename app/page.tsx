'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
  ChevronRight,
  Play,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/shared/section-animations';

const stats = [
  { value: '500+', label: 'IT Internships Listed', icon: Briefcase },
  { value: '120+', label: 'Partner Companies', icon: Building2 },
  { value: '40+', label: 'Universities Partnered', icon: GraduationCap },
  { value: '1,200+', label: 'Students Placed', icon: Users },
];

const services = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Discover IT internships, track applications, submit weekly reports, and receive a verified Career Passport upon completion.',
    features: ['Smart internship search', 'Application tracking timeline', 'Readiness score system', 'Weekly logbook submission'],
    color: 'from-blue-500 to-indigo-600',
    href: '/services/students',
  },
  {
    icon: Building2,
    title: 'Companies',
    description: 'Post internship opportunities, manage your full candidate pipeline, schedule interviews, and monitor intern performance.',
    features: ['Internship posting & management', 'Candidate pipeline & shortlisting', 'Interview scheduling', 'Intern analytics'],
    color: 'from-amber-500 to-orange-600',
    href: '/services/companies',
  },
  {
    icon: Users,
    title: 'Universities',
    description: 'Monitor student placements, coordinate academic supervisors, collect completion reports, and access institutional analytics.',
    features: ['Student placement monitoring', 'Supervisor coordination', 'Report collection', 'Institutional analytics'],
    color: 'from-emerald-500 to-teal-600',
    href: '/services/universities',
  },
  {
    icon: Briefcase,
    title: 'Supervisors',
    description: 'Manage assigned interns, track their progress, review reports, provide structured evaluations, and flag concerns.',
    features: ['Assigned intern management', 'Progress tracking', 'Report review & feedback', 'Structured evaluations'],
    color: 'from-purple-500 to-violet-600',
    href: '/services/supervisors',
  },
];

const highlights = [
  { icon: ShieldCheck, title: 'Enterprise Security', description: 'Server-enforced authorization, Clerk authentication, and encrypted data handling protect every user.' },
  { icon: Sparkles, title: 'Career Passport', description: 'Every verified completion creates a persistent digital internship record presented as a professional Career Passport.' },
  { icon: TrendingUp, title: 'Real-Time Analytics', description: 'Dashboards powered by real database metrics — not fake numbers. Placement rates, report status, and pipeline insights.' },
  { icon: Globe, title: 'Cameroon-First Design', description: 'Built for Cameroon\'s 10 regions, local companies, local universities, and XAF/FCFA pricing. Designed to scale.' },
  { icon: Zap, title: 'Complete Lifecycle', description: 'From internship discovery to verified completion — not just a job board, but a full management system.' },
  { icon: Star, title: 'Verified Ecosystem', description: 'Companies, universities, and supervisors are verified by MANTECH admins, ensuring a trustworthy platform.' },
];

const testimonials = [
  {
    name: 'David Kamga',
    role: 'BSc Software Engineering Student',
    university: 'University of Yaoundé I',
    quote: 'MANTECH transformed my internship search. I found a Full-Stack Engineering position at MTN Cameroon in under two weeks. The weekly logbook system kept me organized and professional.',
    rating: 5,
  },
  {
    name: 'Brenda Ngu',
    role: 'HR & Talent Acquisition Lead',
    company: 'MTN Cameroon',
    quote: 'As a large enterprise, managing intern applications was chaotic before MANTECH. Now our pipeline is structured, candidates are pre-vetted, and our admin time has dropped by 70%.',
    rating: 5,
  },
  {
    name: 'Dr. Paul Tchinda',
    role: 'Director of Academic Internships',
    university: 'ENSPY, Yaoundé',
    quote: 'MANTECH gives our faculty real-time visibility into where each student is placed, how they are performing, and when they have completed their internship. Essential for modern universities.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION ───── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900" />
          <div className="absolute inset-0 bg-black/60" />
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[90px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right, #4f6cff 1px, transparent 1px), linear-gradient(to bottom, #4f6cff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Now Live Across Cameroon
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
                Cameroon's{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Enterprise
                </span>{' '}
                Internship Platform
              </h1>
              <p className="mt-6 text-lg text-slate-300/80 leading-relaxed max-w-xl">
                MANTECH Nexus connects students, companies, universities, and supervisors in a single secure ecosystem — managing the complete IT internship lifecycle from discovery to verified completion.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/mantech-internship">
                  <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]">
                    Browse Internships
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="h-12 px-8 border-slate-600 text-slate-200 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-slate-400 font-medium text-sm"
                  >
                    <Play className="mr-2 h-4 w-4 text-blue-400" />
                    View Live Demo
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Clerk Auth Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span>Enterprise Grade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-amber-400" />
                  <span>10 Cameroon Regions</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Animated Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-1 shadow-2xl shadow-blue-900/40">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 flex-1 h-4 rounded-md bg-white/10 text-[10px] text-slate-400 flex items-center px-2">
                    app.mantech-nexus.cm/dashboard/student
                  </div>
                </div>
                {/* Dashboard inner */}
                <div className="p-4 space-y-3">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">D</div>
                      <div>
                        <div className="text-[10px] text-white font-semibold">David Kamga</div>
                        <div className="text-[9px] text-slate-400">BSc Software Engineering • UY1</div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">Verified Intern</div>
                  </div>

                  {/* Placement card */}
                  <div className="rounded-xl bg-blue-600/20 border border-blue-500/30 p-3">
                    <div className="text-[9px] text-blue-300 uppercase font-bold tracking-wider mb-1">Active Placement</div>
                    <div className="text-[11px] text-white font-bold">Full-Stack Software Engineer</div>
                    <div className="text-[9px] text-slate-300 mt-0.5">MTN Cameroon • Douala Tech Center</div>
                    <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '65%' }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>Week 6 of 8</span>
                      <span>65%</span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                      <div className="text-[14px] font-extrabold text-white">6</div>
                      <div className="text-[8px] text-slate-400">Reports</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                      <div className="text-[14px] font-extrabold text-amber-400">4.8</div>
                      <div className="text-[8px] text-slate-400">Rating</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                      <div className="text-[14px] font-extrabold text-emerald-400">95%</div>
                      <div className="text-[8px] text-slate-400">Readiness</div>
                    </div>
                  </div>

                  {/* Career Passport CTA */}
                  <div className="rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-amber-300 font-bold">Career Passport</div>
                      <div className="text-[8px] text-slate-400">Active & Supervised</div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 text-[8px] font-bold">View</div>
                  </div>
                </div>
              </div>

              {/* Floating notification cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Report Approved</div>
                  <div className="text-[10px] text-slate-500">Week 6 — Supervisor signed</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">New Interview</div>
                  <div className="text-[10px] text-slate-500">Orange Cameroun — Thu 2pm</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 64L1440 64L1440 0C1200 48 800 60 720 40C640 20 240 60 0 0V64Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ───── STATS SECTION ───── */}
      <section className="py-16 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center group">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ───── SERVICES SECTION ───── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              Specialized for Every Role
            </span>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              One platform, four specialized portals
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              MANTECH provides role-specific dashboards, workflows, and tools that support every stakeholder in the internship lifecycle.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <Link href={s.href} className="group block h-full">
                  <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                      <s.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-bold text-foreground">For {s.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    <ul className="mt-5 space-y-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      Learn more <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-24 bg-[#050d1f] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]" />
        </div>
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-4">
              The Complete Lifecycle
            </span>
            <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              From discovery to verified completion
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              MANTECH manages every step — not just a job board, but a complete internship management system.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Discover', desc: 'Students search verified IT internships by field, region, duration, and work mode.' },
              { step: '02', title: 'Apply', desc: 'Submit applications through MANTECH. Track status from submitted to interview to offer.' },
              { step: '03', title: 'Manage', desc: 'Companies manage candidate pipelines; universities monitor placements; supervisors guide interns.' },
              { step: '04', title: 'Verify', desc: 'Completion creates a persistent Career Passport with supervisor signatures and evaluation scores.' },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors">
                  <div className="font-heading text-4xl font-extrabold text-blue-500/50 mb-3">{item.step}</div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-12 text-center">
            <Link href="/how-it-works">
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                See Full Lifecycle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ───── PLATFORM HIGHLIGHTS ───── */}
      <section className="py-24 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              Why MANTECH
            </span>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Enterprise-grade from day one
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for the realities of Cameroon's IT ecosystem — secure, scalable, and trustworthy.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/20 p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-mantech text-white mb-4 shadow-md">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              Testimonials
            </span>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Trusted by real stakeholders
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="h-full rounded-2xl border border-border bg-white p-8 shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-mantech text-white text-sm font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                      <div className="text-xs text-primary font-medium">{t.university || t.company}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ───── CTA SECTION ───── */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/15 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-indigo-600/15 blur-[80px]" />
        </div>
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <Logo size={56} className="mx-auto mb-6" />
            <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Ready to join Cameroon's leading internship platform?
            </h2>
            <p className="text-lg text-slate-300/80 mb-10 max-w-xl mx-auto">
              Whether you're a student seeking an IT internship, a company building the next generation of tech talent, or a university partnering with industry — MANTECH is your platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-up">
                <Button className="h-12 px-10 bg-white text-blue-900 hover:bg-blue-50 font-semibold text-sm shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-12 px-10 border-white/30 text-white bg-white/10 hover:bg-white/20 font-medium text-sm">
                  Talk to Sales
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Students always free. Companies contact MANTECH via WhatsApp: +237 650 921 917
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
