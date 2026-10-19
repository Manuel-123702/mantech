'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowRight, Scale, Shield, Users, CreditCard, Lock, Eye, AlertTriangle, Building2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

const SECTIONS = [
  {
    id: '01',
    icon: Scale,
    title: 'Acceptance of Terms',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    content: [
      'By registering on, accessing, or using MANTECH Nexus ("the Platform"), you agree to be legally bound by these Terms of Service and all policies incorporated by reference, including the Privacy Policy, Security Policy, and Accessibility Policy.',
      'MANTECH Nexus is a professional internship marketplace built exclusively for Cameroon\'s national internship ecosystem. It connects student and graduate interns with accredited enterprises and accredited higher education institutions.',
      'If you do not agree with any part of these Terms, you must immediately stop using the Platform and delete your account. These Terms apply to all users: interns, enterprise recruiters, university coordinators, and platform administrators.',
    ],
  },
  {
    id: '02',
    icon: Users,
    title: 'User Roles & Permissions',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    content: [
      'Users register under one of four roles: (1) Intern Candidate — a student or recent graduate seeking professional placement. (2) Enterprise Recruiter — an authorized representative of an accredited company or organization. (3) University Coordinator — an authorized representative of an accredited higher education institution. (4) Platform Administrator — MANTECH staff with elevated operational access.',
      'Each role carries distinct permissions enforced server-side using PostgreSQL row-level security and Clerk-based role claims. Role permissions cannot be escalated by users. Attempting to access resources outside your authorized role is a violation of these Terms and may result in immediate account suspension and legal referral under Cameroonian cyber law.',
      'Misrepresenting your identity, organization affiliation, academic status, or role during registration is strictly prohibited. MANTECH reserves the right to verify any claim and to immediately terminate accounts found to contain false information.',
    ],
  },
  {
    id: '03',
    icon: Building2,
    title: 'Enterprise & University Obligations',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    content: [
      'Enterprise accounts must pass MANTECH\'s manual verification process before publishing internship opportunities. Verification requires submission of legal registration proof, operational address, and at least one authorized administrator contact. MANTECH reserves the right to revoke verification at any time.',
      'Enterprise users may not publish fraudulent, misleading, or exploitative internship opportunities. Opportunities must accurately describe the role, responsibilities, compensation model (paid, unpaid, or allowance-based), duration, location (onsite, hybrid, remote), and required qualifications.',
      'University accounts must not use their platform access to scrape or export candidate data beyond their authorized placement coordination scope. Batch CSV exports and unauthorized data transfers are strictly prohibited. University administrators are responsible for ensuring all placement coordinators on their account comply with these Terms.',
    ],
  },
  {
    id: '04',
    icon: CreditCard,
    title: 'No Online Payment Processing',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    content: [
      'MANTECH Nexus does not implement any online payment gateway (no Stripe, PayPal, MTN MoMo API integration, or Orange Money API). All commercial subscription transactions are conducted exclusively through MANTECH\'s WhatsApp Concierge (+237 650 921 917) using Cameroonian Mobile Money (MTN MoMo or Orange Money) or bank transfer to MANTECH\'s official account.',
      'Displaying pricing in XAF/FCFA on the Platform is for reference and information purposes only — no transaction is initiated through the platform interface itself. Subscriptions are activated manually by MANTECH staff after payment confirmation.',
      'MANTECH will NEVER ask candidates or interns for any payment, deposit, or fee in exchange for applications, placements, profile upgrades, or candidate-facing features. These services are permanently free for intern candidates. If any party claims to be MANTECH and requests candidate payment, it is fraudulent. Report such incidents immediately.',
    ],
  },
  {
    id: '05',
    icon: Eye,
    title: 'Data, Content & Accuracy',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    content: [
      'Users are solely responsible for the accuracy and completeness of information they submit to the Platform: CV documents, profile information, academic credentials, company descriptions, opportunity listings, and evaluation reports.',
      'MANTECH does not independently verify the academic credentials or professional certifications listed in Intern Passports. Users who misrepresent educational qualifications are liable under applicable Cameroonian law. MANTECH\'s moderation team reviews reported profiles and may request supporting documentation.',
      'MANTECH reserves the right to remove, edit, archive, or flag any content that violates these Terms, applicable Cameroonian law, or MANTECH\'s community guidelines. This includes misleading opportunity listings, harassment in communications, or fraudulent academic credentials.',
    ],
  },
  {
    id: '06',
    icon: Lock,
    title: 'Security & Prohibited Activities',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    content: [
      'Users must not attempt to: (a) access data they are not explicitly authorized to view, (b) probe, scan, or test the vulnerability of any MANTECH system, (c) use automated scripts, bots, or scrapers against the Platform\'s API or UI, (d) circumvent authentication or authorization mechanisms, or (e) share login credentials with unauthorized individuals.',
      'All user actions on the Platform are audit-logged with timestamp, actor identity, and IP telemetry. MANTECH cooperates with competent Cameroonian authorities (ANTIC, cybercrime units) in response to valid legal requests concerning unauthorized access or data misuse.',
      'Rate limiting and honeypot mechanisms are active across all public-facing endpoints. Triggering rate limits repeatedly may result in temporary IP blocks. Persistent automated probing will result in permanent account termination and referral to Cameroonian cybercrime authorities.',
    ],
  },
  {
    id: '07',
    icon: Shield,
    title: 'Limitation of Liability',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    content: [
      'MANTECH Nexus provides the Platform as an internship coordination service and explicitly does not guarantee: (a) successful internship placement for any candidate, (b) specific candidate volume or application conversion for any enterprise, (c) the continued employment, registration, or legal standing of any enterprise or university on the Platform.',
      'MANTECH is not liable for internship disputes, compensation disagreements, or tripartite convention violations between intern candidates and enterprise hosts. These are governed by Cameroonian labour law and the MINESUP internship regulatory framework.',
      'In no event shall MANTECH\'s total liability to any user exceed the total subscription fees paid by that user to MANTECH in the 12 months preceding the claim. For intern candidates (whose access is free), MANTECH\'s liability is expressly limited to correcting or removing erroneous Platform data.',
    ],
  },
  {
    id: '08',
    icon: MessageCircle,
    title: 'Governing Law & Contact',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    content: [
      'These Terms are governed by the laws of the Republic of Cameroon. Any dispute arising from the use of MANTECH Nexus that cannot be resolved through direct conciliation shall be submitted to the competent courts of Douala, Cameroon.',
      `For questions about these Terms, contact the MANTECH legal and compliance team via WhatsApp Concierge at ${APP_CONFIG.support.phoneDisplay}. Response time for formal legal inquiries: within 3 business days.`,
      'MANTECH reserves the right to modify these Terms at any time. Continued use of the Platform after notification of material changes constitutes acceptance. Users who disagree with changes must delete their account within 14 days of notification.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url('/images/violet_tech_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08040f]/95 via-[#0d0518]/90 to-[#070d18]/95" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/12 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/12 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md">
              <Scale className="w-4 h-4" /> Legal · Effective 1 January 2025
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Terms of{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              These Terms govern your use of MANTECH Nexus — Cameroon's national professional internship marketplace. Please read them carefully before creating an account.
            </p>

            {/* Section shortcuts */}
            <div className="mt-8 flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#section-${s.id}`}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 hover:border-slate-600 hover:bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-all"
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
          {SECTIONS.map((section, idx) => (
            <motion.div
              key={section.id}
              id={`section-${section.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
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
          <span>© {new Date().getFullYear()} MANTECH Nexus Cameroon · All Rights Reserved</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>
            <Link href="/security" className="text-emerald-400 hover:underline">Security</Link>
            <Link href="/accessibility" className="text-blue-400 hover:underline">Accessibility</Link>
            <Link href="/contact" className="text-slate-300 hover:underline">Contact</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
