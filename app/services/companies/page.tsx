'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, CheckCircle2, ArrowRight, Sparkles, Send, Globe, ExternalLink } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const companyFeatures = [
  'Internship & Graduate Job creation and instant publication',
  'Candidate pipeline, automated scoring & shortlisting',
  'Integrated interview scheduling & status updates',
  'Intern placement, tripartite convention & onboarding',
  'Weekly intern monitoring, attendance & performance reports',
  'Live recruitment analytics & institutional evaluations',
  'Company trust verification profile with verified badge',
  'Multi-recruiter staff management with role-based access',
];

const methods = [
  {
    title: 'Apply on MANTECH',
    desc: 'Students and graduates complete the MANTECH application directly with their verified Intern Passport, digital CV, and portfolio.',
    icon: Send,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    title: 'Apply on Company Website',
    desc: 'Direct candidates seamlessly to your official career portal with real-time conversion and referral analytics.',
    icon: Globe,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    title: 'Apply Externally',
    desc: 'Support corporate recruitment portals, LinkedIn postings, or university partner placement systems.',
    icon: ExternalLink,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
];

export default function CompanyServicesPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] text-white min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-600/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300">
              <Building2 className="h-4 w-4 text-cyan-400" />
              Enterprise &amp; Host Hub Solutions
            </span>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Recruitment &amp;{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Internship Pipeline
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Post verified internships and permanent jobs, evaluate verified candidates with cryptographically secured Intern Passports, coordinate tripartite agreements, and track talent outcomes across all 10 regions of Cameroon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CORE FEATURES & METHODS ───────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* Left: Features list */}
            <FadeIn className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">End-to-End Suite</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Manage your complete internship &amp; hiring pipeline
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Everything your recruitment team needs to source, verify, and retain Cameroon&apos;s highest-potential interns and graduates.
              </p>

              <ul className="mt-7 space-y-3.5">
                {companyFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                    <span className="text-slate-100 font-medium text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Right: Three Application Methods */}
            <FadeIn delay={0.15} className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Flexible Candidate Pathways
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-white">
                  Three Application Methods
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every published opening can configure one of three structured application channels:
                </p>

                <div className="mt-6 space-y-4">
                  {methods.map((m) => (
                    <div
                      key={m.title}
                      className="rounded-2xl border border-slate-800 bg-slate-800/60 backdrop-blur-md p-4 transition-all duration-200 hover:border-amber-500/40 hover:bg-slate-800/90"
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className={`p-2 rounded-xl border ${m.color}`}>
                          <m.icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed pl-11">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Launch Callout Box */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-6 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  100% Free Launch Access
                </div>
                <h4 className="mt-2 text-base font-bold text-white">
                  Zero automated charges. Zero package limits.
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Post unlimited internships and jobs for your enterprise across all regions of Cameroon at 0 FCFA.
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="mt-14 text-center">
            <Link href="/sign-up">
              <button className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-600/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-cyan-600/40">
                Register Your Company (0 FCFA) <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
