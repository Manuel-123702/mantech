'use client';
import { Trans } from '@lingui/react/macro';


import { motion } from 'framer-motion';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { GraduationCap, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const steps = [
  {
    title: 'Create Your Account & Intern Passport',
    desc: 'Register for free and generate your verified Cameroon Intern ID with encrypted credentials.',
  },
  {
    title: 'Add Education, Qualification & Field',
    desc: 'Select your degree (HND, BSc, BEng, MSc), professional discipline, specialization, and university.',
  },
  {
    title: 'Upload Digital CV & Set Privacy Controls',
    desc: 'Upload your verified PDF CV. Keep your phone private or make your profile searchable to vetted recruiters.',
  },
  {
    title: 'Search Opportunities Across 10 Regions',
    desc: 'Filter verified graduate jobs and internships by professional discipline, city (Douala, Yaoundé, Buea, etc.), and work mode.',
  },
  {
    title: 'Bookmark & Track Applications',
    desc: 'Save top opportunities to your watchlist and track live application status with real-time feedback.',
  },
  {
    title: 'Apply Directly with Intern Passport',
    desc: 'Apply in 1-click on MANTECH or follow official enterprise redirect links with verified referral tokens.',
  },
  {
    title: 'Receive Instant WhatsApp Alerts',
    desc: 'Get immediate notifications on WhatsApp when employers review your CV or schedule interviews.',
  },
  {
    title: 'Attend Interviews & Secure Placement',
    desc: 'Interview with accredited enterprise recruiters and complete tripartite internship conventions.',
  },
  {
    title: 'Digital Logbook & Verified Completion',
    desc: 'Record milestone progress, receive mentor evaluations, and earn your permanent cryptographic completion certificate.',
  },
];

export default function HowItWorksStudentsPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] text-white min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
              <GraduationCap className="h-4 w-4 text-orange-400" />
              <Trans comment="page span visible text">Candidate &amp; Intern Onboarding Guide
            </Trans></span>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              <Trans comment="page h1 visible text">How It Works for</Trans>{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                <Trans comment="page span visible text">Interns &amp; Job Seekers
              </Trans></span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              <Trans comment="page p visible text">From registration and Intern Passport verification to interview scheduling and accredited internship completion — your complete step-by-step roadmap on MANTECH Nexus.
            </Trans></p>
          </motion.div>
        </div>
      </section>

      {/* ── STEP-BY-STEP GRID ─────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="container-mantech max-w-5xl relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <FadeIn key={step.title} delay={idx * 0.05} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/50 hover:bg-slate-850/90 hover:shadow-2xl group relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent group-hover:via-orange-400 transition-colors" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 border border-orange-500/30 text-sm font-extrabold text-orange-400 shadow-inner">
                        {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"0"}{idx + 1}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                        <Trans comment="page span visible text">Step 0</Trans>{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                    <span><Trans comment="page span visible text">100% Free Access</Trans></span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/70 p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
            <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              <Trans comment="page h2 visible text">Ready to Launch Your Career in Cameroon?
            </Trans></h2>
            <p className="mt-2.5 max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
              <Trans comment="page p visible text">Register your free Intern Passport in under 3 minutes. Zero fees, zero hidden card charges, 100% verified opportunities.
            </Trans></p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register/intern">
                <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/40">
                  <Trans comment="page button visible text">Register Your Intern Passport </Trans><ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/internships">
                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all">
                  <Trans comment="page button visible text">Browse Active Internships
                </Trans></button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
