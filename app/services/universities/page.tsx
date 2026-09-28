'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const universityFeatures = ['Student placement monitoring', 'Active internship tracking', 'Supervisor coordination', 'Report collection & review', 'Completion statistics', 'Institutional analytics', 'Exports (CSV/PDF)', 'Partner company network'];

export default function UniversityServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white"><Users className="h-8 w-8" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">For Universities</h1>
            <p className="mt-4 text-lg text-muted-foreground">Monitor student placements, track active internships, coordinate supervisors, and access institutional analytics.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-mantech">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FadeIn>
              <h2 className="font-heading text-2xl font-bold text-foreground">Institutional management</h2>
              <ul className="mt-6 space-y-3">{universityFeatures.map((f) => (<li key={f} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><span className="text-foreground/80">{f}</span></li>))}</ul>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-border bg-gradient-mantech-light p-8">
                <h3 className="font-heading text-lg font-semibold text-foreground">Organization Isolation</h3>
                <p className="mt-2 text-sm text-muted-foreground">A university must never access unrelated institutions&apos; private records. Data isolation is enforced at the database, API, and dashboard level.</p>
                <div className="mt-4 rounded-lg bg-white p-4">
                  <div className="text-sm font-semibold text-green-600">Enforced</div>
                  <div className="mt-1 text-xs text-muted-foreground">Server-side authorization ensures your institution only sees its own records.</div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="mt-12 text-center"><Link href="/sign-up"><button className="inline-flex items-center gap-2 rounded-lg bg-gradient-mantech px-6 py-3 text-sm font-medium text-white shadow-card hover:shadow-card-hover transition-all">Register your university <ArrowRight className="h-4 w-4" /></button></Link></div>
        </div>
      </section>
    </div>
  );
}
