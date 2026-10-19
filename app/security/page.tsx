'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Server, Eye, FileCheck, AlertTriangle,
  KeyRound, Database, ShieldAlert, Cpu, CheckCircle2, ArrowRight,
  Fingerprint, Globe, Zap, Clock, FileSearch,
} from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

const securityFeatures = [
  {
    icon: KeyRound,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Zero-Trust Authentication',
    description: 'Cryptographic session tokens (via Clerk) with server-side validation on every single request. We never rely on client-side state, hidden UI buttons, or obscured routes for access control.',
  },
  {
    icon: Server,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Server-Enforced RBAC',
    description: 'Role-based access control strictly validated at both Next.js middleware and PostgreSQL row-level security layers. Unauthorized roles attempting to access restricted dashboards are denied at the server — not just hidden in the UI.',
  },
  {
    icon: Lock,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Multi-Tenant Organization Isolation',
    description: 'Enterprise A\'s recruiter can never query or inspect Enterprise B\'s talent pool, application pipeline, or intern records. Isolation is enforced simultaneously at the database query layer, API route handler, and dashboard rendering layer.',
  },
  {
    icon: Database,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'ACID Relational Integrity',
    description: 'All critical state transitions (application status changes, report approvals, contract activations) run inside atomic PostgreSQL transactions. This prevents orphaned records, partial updates, and data corruption during concurrent access.',
  },
  {
    icon: FileCheck,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Tamper-Evident Audit Trails',
    description: 'Every authentication event, CV download, report signature, application status mutation, and admin moderation action is timestamped and logged with actor identity, IP telemetry, and device fingerprint.',
  },
  {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Anti-Enumeration Shield',
    description: 'All resource identifiers use high-entropy UUIDs. The system never reveals whether an arbitrary user email, company ID, or application reference exists to unauthorized callers — preventing brute-force discovery attacks.',
  },
  {
    icon: Eye,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Injection & Traversal Protection',
    description: 'All query parameters and POST body payloads are validated through Zod schema parsing before reaching any database layer. SQL injection patterns, XSS payloads, and path traversal sequences are neutralized at input boundary.',
  },
  {
    icon: ShieldAlert,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Security Headers & CSP',
    description: 'Strict-Transport-Security (HSTS), X-Frame-Options: DENY (anti-clickjacking), X-Content-Type-Options: nosniff, Referrer-Policy, and granular Content Security Policy are enforced across all routes and API endpoints.',
  },
  {
    icon: Fingerprint,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'CV Access Authorization',
    description: 'CV downloads are never exposed as static public links. Each download creates a short-lived, cryptographically signed URL tied to the authorized recruiter\'s session. All CV access events are logged in an immutable audit trail.',
  },
  {
    icon: Clock,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Rate Limiting & Abuse Prevention',
    description: 'All public endpoints (contact form, authentication, search, application submit) are guarded by IP-based sliding-window rate limiters. The contact form uses an invisible honeypot field to silently discard bot submissions.',
  },
];

const COMPLIANCE_METRICS = [
  { label: 'SRS Sections Compliant', value: '47–50', sub: 'Security Architecture' },
  { label: 'Audit Events Logged', value: '100%', sub: 'All sensitive actions' },
  { label: 'Data Encryption', value: 'AES-256', sub: 'At rest & in transit' },
  { label: 'Session Management', value: 'Clerk / JWT', sub: 'Zero-knowledge tokens' },
];

export default function SecurityPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO: EMERALD SECURITY AESTHETIC ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-24 lg:py-32">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: "url('/images/emerald_tech_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030d0a]/95 via-[#05120e]/90 to-[#070d18]/95" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-600/15 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Enterprise Defense Architecture · SRS §47–50 Compliant
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Platform{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Security Architecture
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus enforces security on the server — not just hidden buttons in the UI. Built with zero-trust authorization, strict multi-tenant boundaries, ACID transaction isolation, and real-time tamper-evident audit logging across all 10 regions of Cameroon.
            </p>

            {/* Compliance metrics */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {COMPLIANCE_METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md p-4 text-center"
                >
                  <div className="text-2xl font-extrabold text-emerald-400 font-heading">{m.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">{m.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECURITY FEATURES GRID ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/8 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Defense Layers</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
              10 Security Pillars Protecting Every Interaction
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-2xl mx-auto">
              From candidate data to recruiter CV access, every data flow on MANTECH runs through multiple defense layers — no single point of failure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.06 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${feature.bg} ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DATA RIGHTS ── */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-[#070d18] to-[#0a1220]">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-8 sm:p-12">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mb-5" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Your Data Rights on MANTECH
            </h2>
            <div className="mt-6 space-y-4">
              {[
                'Request a full export of your personal data at any time through Settings.',
                'Delete your account — active personal data is removed immediately; anonymized audit logs are purged after 90 days.',
                'Control CV searchability independently of profile discoverability.',
                'Revoke phone visibility to recruiters without removing your profile from discovery.',
                'Report any suspicious message, contact request, or recruiter behavior using the in-platform Report flow.',
              ].map((right, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{right}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/privacy">
                <button className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-all flex items-center gap-2">
                  Privacy Policy <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all">
                  Report a Security Concern
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
