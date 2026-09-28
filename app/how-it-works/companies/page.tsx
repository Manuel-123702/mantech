'use client';

import { motion } from 'framer-motion';
import { Building2, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const steps = ['Register your company account', 'Complete your company profile and get verified', 'Add staff members and recruiters', 'Create internship opportunities with full details', 'Configure application methods (MANTECH, website, or external)', 'Review incoming applications', 'Shortlist candidates in your pipeline', 'Schedule and conduct interviews', 'Select successful candidates', 'Confirm placements and assign supervisors', 'Complete onboarding checklists', 'Monitor intern progress and collect reports', 'Provide structured evaluations', 'Track completion and analytics'];

export default function HowItWorksCompaniesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-orange text-white"><Building2 className="h-8 w-8" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground">How it works for companies</h1>
            <p className="mt-4 text-lg text-muted-foreground">From registration to intern completion — manage your entire internship pipeline.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-mantech max-w-3xl">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <FadeIn key={step} delay={idx * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-orange text-sm font-bold text-white">{idx + 1}</div>
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
