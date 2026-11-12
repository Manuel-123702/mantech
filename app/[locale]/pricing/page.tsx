'use client';
import { Trans } from '@lingui/react/macro';


import { motion } from 'framer-motion';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building2, GraduationCap, School, HeartHandshake } from 'lucide-react';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { APP_CONFIG } from '@/lib/config';
import { FadeIn, MotionSection, MotionItem } from '@/components/shared/section-animations';

const WHATSAPP_CTA = APP_CONFIG.support.whatsapp;

const FREE_PILLARS = [
  {
    role: 'Interns & Students',
    badge: '0 FCFA Forever',
    title: 'Candidates & Job Seekers',
    icon: GraduationCap,
    color: 'from-orange-500 to-amber-500',
    borderColor: 'border-orange-500/30',
    iconBg: 'bg-orange-500/15 text-orange-400',
    desc: 'Create your verifiable digital Intern Passport, upload your encrypted CV, and apply directly to verified host enterprises across all 10 regions of Cameroon with zero application fees.',
    features: [
      'Digital Intern Passport issuance & verification',
      'Encrypted CV upload & privacy controls',
      'Direct 1-click applications to verified listings',
      'Instant WhatsApp job & internship alerts',
      'Official tripartite internship convention support',
      'Permanent completion certificate issuance',
    ],
    ctaText: 'Register Free Passport',
    ctaLink: '/register/intern',
  },
  {
    role: 'Enterprises & Recruiters',
    badge: '100% Free Launch',
    title: 'Companies & Host Employers',
    icon: Building2,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    desc: 'Publish unlimited internship opportunities and full-time graduate jobs, access Cameroon’s top talent pool, and run structured candidate shortlisting with zero package charges.',
    features: [
      'Unlimited internship & job postings',
      'Full candidate pipeline & algorithmic scoring',
      'Candidate CV search & contact discovery',
      'Direct external portal application redirects',
      'Multi-recruiter team collaboration accounts',
      'Verified Enterprise Host trust badge',
    ],
    ctaText: 'Register Company Account',
    ctaLink: '/sign-up',
  },
  {
    role: 'Academic Institutions',
    badge: 'Institutional Free Partnership',
    title: 'Universities & Polytechs',
    icon: School,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    desc: 'Supervise enrolled cohort placements, track tripartite agreements, verify partner host companies, and export institutional accreditation metrics with zero software licensing costs.',
    features: [
      'Faculty placement coordinator dashboards',
      'Real-time student internship convention tracking',
      'Digital logbook supervision & evaluation reviews',
      'Cohort analytics & employment outcome metrics',
      'Dedicated institutional isolation & privacy',
      'Direct MINESUP compliance data exports',
    ],
    ctaText: 'Partner as University',
    ctaLink: '/sign-up',
  },
];

export default function PricingPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] text-white min-h-screen">
      {/* ── HERO BANNER ───────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <Trans comment="page span visible text">National Launch Initiative · 100% Free
            </Trans></span>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              <Trans comment="page h1 visible text">0 FCFA. Zero Packages.</Trans>{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                <Trans comment="page span visible text">Completely Free for Everyone.
              </Trans></span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              <Trans comment="page p visible text">MANTECH Nexus operates as Cameroon&apos;s open national internship marketplace. We have removed all paid package tiers — every tool, listing, candidate search, and university portal is available at zero cost.
            </Trans></p>
          </motion.div>
        </div>
      </section>

      {/* ── 3 FREE PILLARS ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <MotionSection stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FREE_PILLARS.map((pillar) => (
              <MotionItem key={pillar.title} className="h-full">
                <div className={`flex h-full flex-col justify-between rounded-3xl border ${pillar.borderColor} bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden group`}>
                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${pillar.color}`} />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`p-3 rounded-2xl ${pillar.iconBg}`}>
                        <pillar.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                        {pillar.badge}
                      </span>
                    </div>

                    <h2 className="font-heading text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {pillar.title}
                    </h2>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {pillar.desc}
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-800">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        <Trans comment="page p visible text">Included at 0 FCFA:
                      </Trans></p>
                      <ul className="space-y-2.5">
                        {pillar.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-200">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-800">
                    <Link href={pillar.ctaLink} className="block">
                      <button className={`w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r ${pillar.color} font-bold text-xs sm:text-sm text-white shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2`}>
                        <span>{pillar.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </MotionItem>
            ))}
          </MotionSection>

          {/* Institutional Trust & WhatsApp Concierge Strip */}
          <div className="mt-14 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span><Trans comment="page span visible text">Zero Commercial Friction</Trans></span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                <Trans comment="page h3 visible text">No credit cards. No automated rebilling. No surprises.
              </Trans></h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <Trans comment="page p visible text">Have specific institutional convention requirements or high-volume enterprise onboarding needs? Our national team is directly reachable via WhatsApp.
              </Trans></p>
            </div>

            <a
              href={WHATSAPP_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-[#25D366] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#25D366]/25 transition-all hover:scale-105 hover:brightness-110 shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span><Trans comment="page span visible text">Contact WhatsApp Support</Trans></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
