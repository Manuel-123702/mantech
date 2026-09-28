'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Server, Eye, FileCheck, AlertTriangle, KeyRound, Database } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const securityFeatures = [
  { icon: KeyRound, title: 'Authentication', description: 'Secure email/password authentication with session management. MFA for sensitive roles. Session validation on every request.' },
  { icon: Server, title: 'Server-Side Authorization', description: 'Role-based access control enforced on the server. If a student enters /dashboard/admin, the server denies access — not just the UI.' },
  { icon: Lock, title: 'Organization Isolation', description: 'Company A can never access Company B\'s data. Isolation is enforced at the database query, API, server action, and dashboard level.' },
  { icon: Database, title: 'Row-Level Security', description: 'Database-level RLS policies ensure users can only access rows they own or are authorized to see, even if API checks are bypassed.' },
  { icon: FileCheck, title: 'Audit Logging', description: 'Sensitive actions are logged: role changes, member additions, internship publications, application status changes, and more.' },
  { icon: AlertTriangle, title: 'Anti-Enumeration', description: 'High-entropy IDs prevent guessing. The system never reveals whether arbitrary private IDs are valid.' },
  { icon: Eye, title: 'Input Validation', description: 'All user input is validated with Zod schemas on both client and server. URLs are validated to prevent JavaScript injection or unsafe redirects.' },
  { icon: Shield, title: 'Secure Error Handling', description: 'Internal stack traces and secrets are never exposed. Error messages are professional and do not leak implementation details.' },
];

export default function SecurityPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-mantech text-white"><Shield className="h-8 w-8" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground">Security at MANTECH</h1>
            <p className="mt-4 text-lg text-muted-foreground">Security is enforced on the server, not just in the UI. We never rely on hiding buttons.</p>
          </motion.div>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {securityFeatures.map((f, idx) => (
              <FadeIn key={f.title} delay={idx * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
