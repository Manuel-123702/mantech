'use client';

import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const steps = ['Create your account and complete your Intern Passport', 'Add your qualification, education, professional field, skills and location', 'Upload your CV securely and choose your privacy settings', 'Search opportunities across professional fields and Cameroon locations', 'Save opportunities that match your goals', 'Apply on MANTECH or follow the organization’s official application link', 'Track your application status and updates', 'Attend interviews when invited', 'Confirm your placement and complete onboarding'];

export default function HowItWorksStudentsPage() {
  return (
    <div className="overflow-hidden">
      <section className="surface-page relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
        <div className="container-mantech relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-card"><GraduationCap className="h-7 w-7" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">How it works for interns</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">From registration to verified completion — your complete internship journey on MANTECH.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding relative overflow-hidden border-b border-slate-800/60" style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a1220 50%, #070d18 100%)' }}>
        <div className="absolute top-12 left-10 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-12 right-10 w-80 h-80 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech max-w-4xl relative z-10">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, idx) => (
              <FadeIn key={step} delay={idx * 0.05}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary shadow-inner">{idx + 1}</div>
                  <div className="flex items-start gap-2 pt-1.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-foreground/90 font-medium text-sm leading-relaxed">{step}</span></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
