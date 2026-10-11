'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const universityFeatures = ['Student placement monitoring', 'Active internship tracking', 'Partner company coordination', 'Placement outcome verification', 'Completion statistics', 'Institutional analytics', 'Exports (CSV/PDF)', 'Career Passport issuance'];

export default function UniversityServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="surface-page relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
        <div className="container-mantech relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-card"><Users className="h-7 w-7" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">For Universities</h1>
            <p className="mt-4 text-lg text-muted-foreground">Monitor student placements, track active internships, coordinate partner companies, and access institutional analytics.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding relative overflow-hidden border-b border-slate-800/60" style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a1220 50%, #061713 100%)' }}>
        <div className="absolute top-12 left-10 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-12 right-10 w-80 h-80 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech relative z-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FadeIn className="rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h2 className="font-heading text-2xl font-bold text-foreground">Institutional management</h2>
              <ul className="mt-6 space-y-3">{universityFeatures.map((f) => (<li key={f} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><span className="text-foreground/90 font-medium text-sm leading-relaxed">{f}</span></li>))}</ul>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="rounded-3xl border border-emerald-500/20 bg-slate-800/60 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <h3 className="font-heading text-lg font-semibold text-foreground">Organization Isolation</h3>
                <p className="mt-2 text-sm text-muted-foreground">A university must never access unrelated institutions&apos; private records. Data isolation is enforced at the database, API, and dashboard level.</p>
                <div className="mt-4 rounded-2xl border border-emerald-600/30 bg-slate-800/60 backdrop-blur-sm p-5 shadow-sm">
                  <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cryptographic & Database Enforced</div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">Server-side authorization and tenant scoping ensures your institution strictly inspects its own authenticated cohort records.</div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="mt-12 text-center"><Link href="/sign-up"><button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:bg-emerald-700 hover:scale-[1.02]">Register your university <ArrowRight className="h-4 w-4" /></button></Link></div>
        </div>
      </section>
    </div>
  );
}
