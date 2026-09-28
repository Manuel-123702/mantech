'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, MessageCircle, ArrowRight, Star } from 'lucide-react';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const plans = [
  { name: 'Basic', price: 'Free', period: 'for students', features: ['Search & apply to internships', 'Application tracking', 'Saved internships', 'Basic profile', 'Notifications'], cta: 'Sign up as student', highlight: false },
  { name: 'Professional', price: 'XAF 50,000', period: 'per month', features: ['Everything in Basic', 'Up to 5 active internships', 'Candidate pipeline', 'Interview scheduling', 'Basic analytics', 'Email support'], cta: 'Contact MANTECH', highlight: false },
  { name: 'Business', price: 'XAF 150,000', period: 'per month', features: ['Everything in Professional', 'Unlimited internships', 'Multiple recruiters', 'Supervisor management', 'Advanced analytics', 'Priority support'], cta: 'Contact MANTECH', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: 'tailored', features: ['Everything in Business', 'Custom workflows', 'Enterprise support', 'Integrations', 'Dedicated manager', 'SLA & reporting'], cta: 'Contact MANTECH', highlight: false },
];

const universityPlans = [
  { name: 'University Package', price: 'XAF 200,000', period: 'per semester', features: ['University dashboard', 'Student monitoring', 'Placement management', 'Supervisor coordination', 'Reports & analytics', 'Exports'], cta: 'Contact MANTECH' },
];

export default function PricingPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">Pricing</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground">MANTECH primarily monetizes organizations. Students always have free access. All prices in XAF/FCFA.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <SectionHeader eyebrow="Company Plans" title="Choose your plan" description="No online payment processing. Contact MANTECH on WhatsApp to discuss your plan." />
          <StaggerContainer className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <div className={`relative h-full rounded-2xl border p-8 shadow-card transition-all hover:shadow-card-hover ${plan.highlight ? 'border-primary bg-gradient-mantech text-white' : 'border-border bg-card'}`}>
                  {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">Most Popular</div>}
                  <h3 className={`font-heading text-lg font-bold ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
                  <div className="mt-4"><span className={`font-heading text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.price}</span><span className={`ml-1 text-sm ${plan.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.period}</span></div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? 'text-white' : 'text-green-600'}`} /><span className={`text-sm ${plan.highlight ? 'text-white/90' : 'text-foreground/80'}`}>{f}</span></li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {plan.cta === 'Sign up as student' ? (
                      <Link href="/sign-up"><button className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${plan.highlight ? 'bg-white text-primary hover:bg-white/90' : 'border border-border text-foreground hover:bg-secondary'}`}>{plan.cta}</button></Link>
                    ) : (
                      <a href="https://wa.me/237650921917" target="_blank" rel="noopener noreferrer"><button className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${plan.highlight ? 'bg-white text-primary hover:bg-white/90' : 'border border-border text-foreground hover:bg-secondary'}`}>{plan.cta}</button></a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-mantech">
          <SectionHeader eyebrow="University Plans" title="Institutional packages" description="Designed for universities and higher education institutions in Cameroon." />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {universityPlans.map((plan) => (
              <FadeIn key={plan.name}>
                <div className="h-full rounded-2xl border border-border bg-white p-8 shadow-card">
                  <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4"><span className="font-heading text-3xl font-bold text-foreground">{plan.price}</span><span className="ml-1 text-sm text-muted-foreground">{plan.period}</span></div>
                  <ul className="mt-6 space-y-3">{plan.features.map((f) => (<li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /><span className="text-sm text-foreground/80">{f}</span></li>))}</ul>
                  <a href="https://wa.me/237650921917" target="_blank" rel="noopener noreferrer" className="mt-8 block"><button className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-all">Contact MANTECH</button></a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <FadeIn>
            <div className="rounded-3xl bg-gradient-mantech p-12 text-center text-white">
              <h2 className="font-heading text-3xl font-bold">Have questions about pricing?</h2>
              <p className="mt-4 text-white/80">We discuss commercial details directly. No online payment processing — just a conversation.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a href="https://wa.me/237650921917" target="_blank" rel="noopener noreferrer"><button className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-white/90 transition-all"><MessageCircle className="h-4 w-4" /> WhatsApp: +237 650 921 917</button></a>
                <Link href="/contact"><button className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-all">Contact form <ArrowRight className="h-4 w-4" /></button></Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
