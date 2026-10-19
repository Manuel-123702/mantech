'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, Building2, Users, Briefcase, ArrowRight,
  CheckCircle2, Zap, Star, ShieldCheck, Globe, Clock, MessageCircle,
  TrendingUp, FileText, UserCheck, Award, Database, Search,
} from 'lucide-react';
import { waSupportLink } from '@/lib/whatsapp';

const SERVICES = [
  {
    icon: GraduationCap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    glow: 'bg-cyan-600/15',
    title: 'For Interns & Students',
    badge: 'Free Forever',
    badgeStyle: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    description: 'The complete digital toolkit for Cameroonian students and graduates seeking professional internship placement across all 10 regions.',
    features: [
      'Smart internship search with field, city, work-mode, and duration filters',
      'Live application status tracking — from submission to placement decision',
      'MANTECH Readiness Score — know how competitive your profile is',
      'Intern Passport with privacy-controlled CV, phone, and profile visibility',
      'Interview scheduling with calendar reminders via WhatsApp',
      'Verified placement history and host company endorsements',
      'Academic convention document coordination (MINESUP tripartite)',
      'Resource Center access — 20 expert guides, blueprints, and toolkits',
    ],
    href: '/how-it-works/students',
    img: '/images/amber_tech_bg.jpg',
    imgBlend: 'luminosity',
    statLabel: 'For candidates',
    statValue: '100% Free',
  },
  {
    icon: Building2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    glow: 'bg-emerald-600/15',
    title: 'For Host Enterprises',
    badge: 'Starting at XAF 45,000/mo',
    badgeStyle: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    description: 'End-to-end corporate talent acquisition and internship management tools designed for Cameroon\'s enterprise recruitment workflows.',
    features: [
      'Enterprise verification and official recruiter badge for all published listings',
      'Unlimited internship opportunity publishing (Business tier+)',
      'Intern Passport discovery engine — filter by field, institution, skills, score',
      'Controlled CV access with audit log — see who downloaded what and when',
      'Interview pipeline management — shortlist, schedule, score, reject, place',
      'Multi-seat recruiter accounts with individual access permissions',
      'WhatsApp talent concierge integration for candidate communications',
      'Placement completion evaluations and intern endorsement generation',
      'Recruitment analytics and pipeline funnel reporting',
    ],
    href: '/services/companies',
    img: '/images/emerald_tech_bg.jpg',
    imgBlend: 'luminosity',
    statLabel: 'Packages from',
    statValue: 'XAF 45K/mo',
  },
  {
    icon: Users,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    glow: 'bg-violet-600/15',
    title: 'For Universities & Grandes Écoles',
    badge: 'Institutional Pricing',
    badgeStyle: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
    description: 'A specialized dual-mode dashboard for Cameroonian higher education institutions to coordinate academic placements and manage partner enterprises.',
    features: [
      'Placement coordination mode — monitor student applications from partner enterprises',
      'Recruiter mode — post opportunities (research assistants, lab positions) and recruit interns',
      'Academic convention digital workflow — coordinate MINESUP tripartite placements',
      'Student cohort monitoring — track all registered students from your institution',
      'University supervisor assignment and mid-term evaluation tracking',
      'Enterprise partner directory with placement history analytics',
      '50+ authorized coordinator accounts for large institutions',
      'Bilingual dashboard — French and English interface modes',
    ],
    href: '/services/universities',
    img: '/images/violet_tech_bg.jpg',
    imgBlend: 'luminosity',
    statLabel: 'Semester pricing',
    statValue: 'XAF 250K',
  },
];

const PLATFORM_PILLARS = [
  { icon: ShieldCheck, title: 'Zero-Trust Security', desc: 'Server-enforced RBAC with PostgreSQL row-level security. Your data is isolated — no cross-organization leaks.' },
  { icon: Globe, title: 'All 10 Cameroon Regions', desc: 'From Douala and Yaoundé to Buea, Bamenda, Dschang, Ngaoundéré, Maroua, and Bertoua.' },
  { icon: Database, title: 'ACID Data Integrity', desc: 'All state transitions run inside atomic database transactions. No partial updates, no orphaned records.' },
  { icon: Clock, title: 'Real-Time Status Updates', desc: 'WhatsApp notifications and in-platform alerts for every application status change and interview decision.' },
  { icon: FileText, title: 'Tamper-Evident Audit Log', desc: 'Every authentication, CV download, application decision, and admin action is timestamped and logged.' },
  { icon: MessageCircle, title: 'WhatsApp Concierge', desc: 'Every subscription upgrade, enterprise verification, and support request is handled through human-first WhatsApp.' },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "url('/images/emerald_tech_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#070d18]/95 via-[#0a1422]/90 to-[#070d18]/95" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/12 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-600/12 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
              <Zap className="w-4 h-4" /> Platform Services
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Purpose-Built Tools for{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Every Stakeholder
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus provides specialized dashboards, workflows, and tools designed for the three stakeholders in Cameroon's internship ecosystem: intern candidates, host enterprises, and universities.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto">
              {[
                { val: 'Free', sub: 'For candidates' },
                { val: '4 tiers', sub: 'Enterprise pricing' },
                { val: 'XAF 250K', sub: 'University/semester' },
              ].map((m) => (
                <div key={m.val} className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md p-3 text-center">
                  <div className="text-base font-extrabold text-emerald-300 font-heading">{m.val}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="py-16 lg:py-20 relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          {SERVICES.map((svc, idx) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className={`rounded-3xl border border-slate-800/80 bg-slate-900/70 overflow-hidden flex flex-col lg:flex-row ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''} shadow-2xl hover:border-slate-700 transition-all duration-300`}
            >
              {/* Image Panel */}
              <div className="relative lg:w-2/5 h-56 lg:h-auto overflow-hidden shrink-0">
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${svc.img}')`,
                    mixBlendMode: svc.imgBlend as any,
                    opacity: 0.35,
                  }}
                />
                <div className={`absolute inset-0 ${svc.glow} blur-[60px]`} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#070d18]/60 to-[#070d18]/40" />
                {/* Large icon in panel */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-3xl border ${svc.bg} ${svc.color} shadow-2xl backdrop-blur-md`}>
                    <svc.icon className="h-10 w-10" />
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="flex-1 p-7 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-heading text-2xl font-bold text-white">{svc.title}</h2>
                    <span className={`text-[11px] font-bold uppercase tracking-wider rounded-full border px-3 py-1 ${svc.badgeStyle}`}>
                      {svc.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">{svc.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {svc.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${svc.color}`} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 pt-5 border-t border-slate-800/60">
                  <div className="mr-auto">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{svc.statLabel}</span>
                    <div className={`text-lg font-extrabold font-heading ${svc.color}`}>{svc.statValue}</div>
                  </div>
                  <Link href={svc.href}>
                    <button className={`rounded-xl border ${svc.bg} ${svc.color} px-4 py-2.5 text-xs font-bold transition-all hover:brightness-125 flex items-center gap-2`}>
                      Explore Guide <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM PILLARS ── */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-[#070d18] to-[#060c17]">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Why MANTECH</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
              6 Platform Guarantees Across Every Service
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              These architectural principles underpin every feature across all three stakeholder portals — interns, enterprises, and universities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_PILLARS.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.06 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 hover:border-teal-500/30 transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400 mb-4">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 border-t border-slate-800/80">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/30 p-8 sm:p-12">
            <Star className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Ready to Join Cameroon's Premier Internship Platform?
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto">
              Interns join free. Enterprises get a 14-day exploration period on the Free Starter tier before any subscription decision.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/sign-up">
                <button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all">
                  Create Free Account
                </button>
              </Link>
              <a
                href={waSupportLink('Hello MANTECH, I would like to learn more about your enterprise services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-200 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
