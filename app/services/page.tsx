'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const services = [
  { icon: GraduationCap, title: 'For Students', description: 'Find legitimate IT internships, track applications, build readiness, submit reports, and earn verified completion records.', features: ['Internship search & matching', 'Application tracking timeline', 'Readiness checklist', 'Saved internships & alerts', 'Weekly/monthly reports', 'Career Passport access'], href: '/services/students' },
  { icon: Building2, title: 'For Companies', description: 'Create internships, manage applications, shortlist candidates, conduct interviews, and monitor interns through completion.', features: ['Internship creation & management', 'Candidate pipeline & shortlisting', 'Interview scheduling', 'Placement & onboarding', 'Intern monitoring & reports', 'Analytics & evaluations'], href: '/services/companies' },
  { icon: Users, title: 'For Universities', description: 'Monitor student placements, track active internships, coordinate supervisors, and access institutional analytics.', features: ['Student placement monitoring', 'Active internship tracking', 'Supervisor coordination', 'Report collection', 'Completion statistics', 'Institutional analytics'], href: '/services/universities' },
  { icon: Briefcase, title: 'For Supervisors', description: 'Manage assigned interns, track progress, review reports, provide evaluations, and flag concerns.', features: ['Assigned intern management', 'Progress timeline tracking', 'Report review & feedback', 'Structured evaluations', 'Milestone tracking', 'Concern flagging'], href: '/services/supervisors' },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">Our Services</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Specialized tools for every role</h1>
            <p className="mt-4 text-lg text-muted-foreground">MANTECH provides role-specific dashboards, workflows, and tools that support the complete internship lifecycle.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <StaggerContainer className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-card-hover">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mantech text-white"><s.icon className="h-7 w-7" /></div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                  <ul className="mt-5 space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /><span className="text-sm text-foreground/80">{f}</span></li>
                    ))}
                  </ul>
                  <Link href={s.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">Learn more <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
