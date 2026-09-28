'use client';

import { motion } from 'framer-motion';
import { Users, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const steps = ['Register your university account', 'Complete your institutional profile and get verified', 'Add authorized staff and coordinators', 'Monitor student placements', 'Track active internships in real-time', 'Coordinate supervisors', 'Collect and review student reports', 'Access completion statistics', 'View institutional analytics', 'Export data (CSV/PDF)', 'Manage partner company relationships', 'Access your university Career Passport'];

export default function HowItWorksUniversitiesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white"><Users className="h-8 w-8" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground">How it works for universities</h1>
            <p className="mt-4 text-lg text-muted-foreground">Monitor placements, track active internships, and coordinate supervisors — all in one place.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-mantech max-w-3xl">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <FadeIn key={step} delay={idx * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-sm font-bold text-white">{idx + 1}</div>
                  <div className="flex items-center gap-2 pt-1.5"><CheckCircle2 className="h-4 w-4 text-green-600" /><span className="text-foreground/80">{step}</span></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
