'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Database, Eye, Lock, Trash2, Globe, Bell, ArrowRight, UserCheck, FileText } from 'lucide-react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

const PRIVACY_SECTIONS = [
  {
    id: '01',
    icon: FileText,
    title: 'What We Collect & Why',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    content: [
      'MANTECH Nexus collects only the data essential to delivering its internship marketplace service. For intern candidates: full name, email address, phone number (optional, controlled visibility), academic institution, field of study, specialization, graduation year, CV/resume file, technical skills, certifications, work-mode preference, and availability dates.',
      'For enterprise recruiters: company legal name, registration number, operational address, industry sector, company description, authorized recruiter names and email addresses, and opportunity listings. For university coordinators: institution name, department, authorized coordinator identity.',
      'All data collection is purpose-limited. We do not collect payment credentials, bank account numbers, identification documents (NIC, passport) beyond what is voluntarily shared in CV documents, or location GPS data. MANTECH never monetizes user data by selling or renting it to any third party — the platform\'s revenue model is exclusively subscription-based.',
    ],
  },
  {
    id: '02',
    icon: Database,
    title: 'How We Store Your Data',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    content: [
      'All MANTECH data is stored in PostgreSQL databases with row-level security (RLS) enabled at the storage layer — meaning the database itself enforces access rules, not just the application layer. This means even a compromised application layer cannot read data across organization boundaries.',
      'CV files, profile photos, and application documents are stored in a private, access-controlled cloud storage bucket. These files are not publicly accessible via predictable URLs. Every file access requires a valid, time-limited, cryptographically signed URL generated for the authorized user or recruiter.',
      'All data is transmitted using TLS 1.3 encryption in transit. Data at rest is encrypted using AES-256. MANTECH\'s infrastructure is hosted on a major cloud provider with SOC 2 Type II compliance, ensuring that physical security, logical access, and disaster recovery meet enterprise-grade standards.',
    ],
  },
  {
    id: '03',
    icon: Eye,
    title: 'Who Can See Your Data',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    content: [
      'By default, your Intern Passport is set to undiscoverable. You must explicitly enable discoverable mode for accredited enterprise recruiters to find your profile. Even in discoverable mode, your phone number and CV are never exposed automatically — they require explicit authorization events tracked in the platform\'s audit log.',
      'Organization isolation is enforced throughout: Enterprise A\'s recruiters cannot see Enterprise B\'s application pipeline, candidate evaluations, or intern records. University A\'s coordinators cannot see University B\'s student cohorts or placement records. This isolation is enforced at the database query layer, not just the UI.',
      'MANTECH staff (administrators) have elevated access to moderate content, resolve disputes, and provide support. All administrative access events are logged with the admin\'s identity and timestamp. MANTECH staff cannot export or share candidate personal data outside the platform without explicit legal basis.',
    ],
  },
  {
    id: '04',
    icon: Lock,
    title: 'Intern Passport & CV Privacy',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    content: [
      'The Intern Passport (your public professional profile) is controlled by you. You independently control: (a) whether your profile is discoverable by recruiters, (b) whether your CV is accessible to authorized recruiters, (c) whether your phone number is visible to authorized recruiters, (d) whether your current job title or employer is shown.',
      'When an accredited recruiter downloads your CV, MANTECH logs: the recruiter\'s identity, their organization, the timestamp, and their stated purpose. You can see a record of who has accessed your CV in your Settings > Privacy > CV Access Log. You can revoke CV access permissions at any time.',
      'Confidential evaluation reports, final internship grades, and supervisor comments from completed internships are visible only to you, the enterprise that authored them, and the university that supervised them (if coordinated through MANTECH). These reports are never surfaced to other recruiters.',
    ],
  },
  {
    id: '05',
    icon: Bell,
    title: 'Cookies & Platform Analytics',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    content: [
      'MANTECH uses strictly necessary session cookies (via Clerk) for authentication. These cookies are cryptographically signed, HttpOnly, SameSite=Strict, and cannot be read by client-side JavaScript. They are essential for maintaining your authenticated session and cannot be disabled without losing platform functionality.',
      'MANTECH uses privacy-respecting anonymized analytics (aggregated page views, feature usage patterns, funnel metrics) to improve the platform. No personal identifiers are included in analytics events. IP addresses are anonymized before storage. Analytics data is retained for 12 months in aggregate form only.',
      'MANTECH does not use advertising trackers, Meta Pixel, Google Ads tracking, or any cross-site tracking technology. The Platform\'s Content Security Policy (CSP) explicitly blocks loading of unauthorized third-party scripts.',
    ],
  },
  {
    id: '06',
    icon: Trash2,
    title: 'Data Retention & Deletion',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    content: [
      'Active user data is retained while your account is active. If you request account deletion, your personal profile data, contact information, CV file, and application records are permanently deleted within 72 hours.',
      'Anonymized audit log entries (stripped of all personal identifiers) are retained for 90 days after account deletion for operational security purposes, then purged. Internship completion records where multiple parties are involved (intern, enterprise, university) are retained as anonymized historical records per MINESUP coordination guidelines.',
      'Enterprise opportunity listings are retained for 24 months after expiry for audit and dispute resolution purposes, then archived. Expired listings are never shown to candidates in active discovery.',
    ],
  },
  {
    id: '07',
    icon: Globe,
    title: 'ANTIC Compliance & Data Sovereignty',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    content: [
      'MANTECH Nexus operates in adherence to Cameroonian data protection guidelines issued by ANTIC (Agence Nationale des Technologies de l\'Information et de la Communication). Personal data of Cameroonian citizens processed through MANTECH is handled with the protections required under applicable Cameroonian telecommunications and data protection law.',
      'MANTECH does not transfer personal data internationally in a way that weakens the protections described in this Privacy Policy. Data processed in cloud infrastructure uses providers with contractual Standard Contractual Clauses (SCCs) ensuring equivalent protections.',
    ],
  },
  {
    id: '08',
    icon: UserCheck,
    title: 'Your Rights & How to Exercise Them',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    content: [
      'You have the following rights regarding your data on MANTECH: (1) Access — request a full export of all personal data we hold about you. (2) Correction — update any inaccurate data through your profile settings or by contacting us. (3) Deletion — request complete account deletion and data removal. (4) Portability — receive your profile data in a structured JSON format. (5) Restriction — request that we restrict processing of your data while a dispute is being resolved.',
      `To exercise these rights, log into your MANTECH account and navigate to Settings > Privacy, or contact our data team at ${APP_CONFIG.support.email} with the subject line "Privacy Rights Request". We respond to all privacy rights requests within 5 business days.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url('/images/amber_tech_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#070d18]/95 via-[#0a1422]/90 to-[#070d18]/95" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-600/12 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/12 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4" /> Privacy · ANTIC Cameroon Compliant
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Privacy{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus is built on a privacy-first architecture. Your data belongs to you — we are transparent about exactly what we collect, why we collect it, who can see it, and how you can delete it.
            </p>

            {/* Quick metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
              {[
                { val: 'Never sold', sub: 'Your personal data' },
                { val: 'AES-256', sub: 'Encryption at rest' },
                { val: '72h', sub: 'Data deletion SLA' },
                { val: 'ANTIC', sub: 'Cameroon compliant' },
              ].map((m) => (
                <div key={m.val} className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md p-4 text-center">
                  <div className="text-base font-extrabold text-cyan-300 font-heading">{m.val}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {PRIVACY_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#priv-${s.id}`}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 hover:border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-all"
                >
                  §{s.id} {s.title}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
          {PRIVACY_SECTIONS.map((section, idx) => (
            <motion.div
              key={section.id}
              id={`priv-${section.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/70 overflow-hidden backdrop-blur-md"
            >
              <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-800/60">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${section.bg} ${section.color} shrink-0`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Section {section.id}</div>
                  <h2 className="font-heading text-base font-bold text-white">{section.title}</h2>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                {section.content.map((para, i) => (
                  <p key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed">{para}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <section className="py-12 border-t border-slate-800/80">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>Last updated: January 2025 · MANTECH Nexus Cameroon</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="text-violet-400 hover:underline">Terms of Service</Link>
            <Link href="/security" className="text-emerald-400 hover:underline">Security</Link>
            <a href={`mailto:${APP_CONFIG.support.email}`} className="text-cyan-400 hover:underline">
              {APP_CONFIG.support.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
