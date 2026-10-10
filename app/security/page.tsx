'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Server, Eye, FileCheck, AlertTriangle, KeyRound, Database, ShieldAlert, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const securityFeatures = [
  { icon: KeyRound, title: 'Zero-Trust Authentication', description: 'Cryptographic session tokens with server-side validation on every single request. Never relying on client-side state or hidden UI buttons.' },
  { icon: Server, title: 'Server-Enforced RBAC', description: 'Role-based access control strictly validated at middleware and database levels. If an unauthorized role attempts access to /dashboard/admin, the server denies access immediately.' },
  { icon: Lock, title: 'Multi-Tenant Organization Isolation', description: 'Company A can never query or inspect Company B\'s talent pool. Isolation is enforced at the database query, API, and dashboard layer.' },
  { icon: Database, title: 'ACID Relational Core', description: 'Strict relational data integrity prevents orphaned records or tampering during concurrent status transitions and report approvals.' },
  { icon: FileCheck, title: 'Tamper-Evident Audit Trails', description: 'Every authentication event, report signature, application status mutation, and admin moderation decision is timestamped and logged with IP telemetry.' },
  { icon: AlertTriangle, title: 'Anti-Enumeration Shield', description: 'High-entropy opaque UUIDs prevent enumeration attacks. The system never reveals whether an arbitrary ID or user email exists to unauthorized callers.' },
  { icon: Eye, title: 'Injection & Traversal Armor', description: 'Query strings and payloads undergo pattern inspection to neutralize SQL injection signatures, cross-site scripting (XSS), and path traversal attempts.' },
  { icon: ShieldAlert, title: 'Security Headers & CSP', description: 'Strict-Transport-Security, X-Frame-Options: DENY (anti-clickjacking), X-Content-Type-Options: nosniff, and granular permissions policies active across all routes.' },
];

export default function SecurityPage() {
  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION WITH BACKGROUND IMAGE ───── */}
      <section
        className="relative py-24 lg:py-32 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/security_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80 backdrop-blur-[1px]" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
              Enterprise Defense Architecture
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Security & Hacker Prevention Architecture
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus enforces security on the server, not just in the UI. Built with zero-trust authorization, strict tenant boundaries, and real-time audit protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───── SECURITY SPECIFICATIONS ───── */}
      <section className="py-20 bg-slate-50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-800 uppercase tracking-widest text-[10px] mb-3">
              SRS Sections 7 & 47-50 Compliant
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              Enterprise Safeguards in Depth
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Comprehensive defense mechanisms preventing unauthorized access, data leakage, and system tampering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 border border-blue-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
