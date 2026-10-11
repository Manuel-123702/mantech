'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const services = [
  { 
    icon: GraduationCap, 
    title: 'For Interns',
    description: 'Discover internships across professional fields, manage applications, and build a private, professional Intern Passport.',
    features: ['Internship search & filters', 'Application status tracking', 'Saved opportunities', 'Interview updates', 'Privacy controls', 'Secure CV access'],
    href: '/how-it-works/students',
    bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=compress&cs=tinysrgb&h=650&w=940'
  },
  { 
    icon: Building2, 
    title: 'For Companies', 
    description: 'Create internships, manage applications, shortlist candidates, conduct interviews, and monitor interns through completion.', 
    features: ['Internship creation & management', 'Candidate pipeline & shortlisting', 'Interview scheduling', 'Placement & onboarding', 'Recruitment history', 'Analytics'],
    href: '/services/companies',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=compress&cs=tinysrgb&h=650&w=940'
  },
  { 
    icon: Users, 
    title: 'For Universities', 
    description: 'Help associated people find internships and recruit interns for your institution when enabled.',
    features: ['Placement coordination', 'Opportunity discovery', 'Partner company management', 'Recruiter mode', 'Interview and placement tracking', 'Institutional analytics'],
    href: '/services/universities',
    bgImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=compress&cs=tinysrgb&h=650&w=940'
  },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="surface-page relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
        <div className="container-mantech relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex rounded-full border border-primary/15 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">Our Services</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Specialized tools for every role</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">MANTECH provides role-specific dashboards, workflows, and tools that support the complete internship lifecycle.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden border-b border-slate-800/60" style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a1220 50%, #070d18 100%)' }}>
        {/* Subtle atmospheric glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10">
          <StaggerContainer className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <Link href={s.href} className="group block h-full">
                  <div className="relative h-full overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500/40">
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${s.bgImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                    </div>
                    <div className="p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <s.icon className="h-7 w-7" />
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-bold text-foreground">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                      <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-sm text-foreground/75">{f}</span></li>
                        ))}
                      </ul>
                      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                        Learn more <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
