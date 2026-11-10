'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, GraduationCap, School } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const universityFeatures = [
  'Centralized student internship placement monitoring across all faculties',
  'Real-time tracking of active host company internships and tripartite conventions',
  'Accredited enterprise partner coordination and verified supervisor assignment',
  'MINESUP compliant internship completion attestations & digital logbook reviews',
  'Institutional cohort completion statistics and national employment outcomes',
  'Automated institutional analytics and exportable compliance reports (CSV / PDF)',
  'Cryptographic Career Passport validation and student readiness endorsement',
  'Multi-faculty coordinator accounts with department-level isolation',
];

export default function UniversityServicesPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] text-white min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-600/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <School className="h-4 w-4 text-emerald-400" />
              Academic &amp; Higher Education Partnership
            </span>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Institutional Supervision &amp;{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Placement Coordination
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Equip your academic departments, career centers, and faculty mentors with digital tools to oversee student internships, authenticate conventions, and verify placement records across Cameroon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES & DATA ISOLATION ────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* Left: Features list */}
            <FadeIn className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Academic Portal</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Institutional placement &amp; convention oversight
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect your enrolled students to over 30 verified national enterprises while maintaining institutional oversight.
              </p>

              <ul className="mt-7 space-y-3.5">
                {universityFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <span className="text-slate-100 font-medium text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Right: Organization Isolation & Free Launch */}
            <FadeIn delay={0.15} className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-1">
                  Security &amp; Compliance Architecture
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-white">
                  Multi-Tenant Institutional Isolation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A university must never access unrelated institutions&apos; private academic records. Tenant isolation is enforced at every layer:
                </p>

                <div className="mt-5 space-y-3.5">
                  <div className="rounded-2xl border border-emerald-500/30 bg-slate-800/60 p-4 backdrop-blur-md">
                    <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Cryptographic &amp; Database Scoping
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      Server-side role authorization ensures your placement office strictly inspects authenticated cohort records from your own faculties.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 backdrop-blur-md">
                    <div className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      Dual-Mode Compatibility
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      Mode A allows direct student onboarding; Mode B supports official faculty-managed cohort uploads with pre-verified convention credentials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Free Academic Access Callout */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-6 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Free Higher Education Partnership
                </div>
                <h4 className="mt-2 text-base font-bold text-white">
                  0 FCFA for all Cameroonian Universities
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Public universities, state institutes, and accredited private institutions receive full institutional access at zero charge.
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="mt-14 text-center">
            <Link href="/sign-up">
              <button className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-emerald-600/40">
                Register Your University (0 FCFA) <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
