'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const services = [
  { 
    icon: GraduationCap, 
    title: 'For Students', 
    description: 'Find legitimate IT internships, track applications, build readiness, submit reports, and earn verified completion records.', 
    features: ['Internship search & matching', 'Application tracking timeline', 'Readiness checklist', 'Saved internships & alerts', 'Weekly/monthly reports', 'Career Passport access'], 
    href: '/services/students',
    bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=compress&cs=tinysrgb&h=650&w=940'
  },
  { 
    icon: Building2, 
    title: 'For Companies', 
    description: 'Create internships, manage applications, shortlist candidates, conduct interviews, and monitor interns through completion.', 
    features: ['Internship creation & management', 'Candidate pipeline & shortlisting', 'Interview scheduling', 'Placement & onboarding', 'Intern monitoring & reports', 'Analytics & evaluations'], 
    href: '/services/companies',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=compress&cs=tinysrgb&h=650&w=940'
  },
  { 
    icon: Users, 
    title: 'For Universities', 
    description: 'Monitor student placements, track active internships, coordinate supervisors, and access institutional analytics.', 
    features: ['Student placement monitoring', 'Active internship tracking', 'Supervisor coordination', 'Report collection', 'Completion statistics', 'Institutional analytics'], 
    href: '/services/universities',
    bgImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=compress&cs=tinysrgb&h=650&w=940'
  },
  { 
    icon: Briefcase, 
    title: 'For Supervisors', 
    description: 'Manage assigned interns, track progress, review reports, provide evaluations, and flag concerns.', 
    features: ['Assigned intern management', 'Progress timeline tracking', 'Report review & feedback', 'Structured evaluations', 'Milestone tracking', 'Concern flagging'], 
    href: '/services/supervisors',
    bgImage: 'https://images.unsplash.com/photo-1552664730-30f989096a4e?auto=compress&cs=tinysrgb&h=650&w=940'
  },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-8 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">Our Services</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">Specialized tools for every role</h1>
            <p className="mt-4 text-lg text-white/80">MANTECH provides role-specific dashboards, workflows, and tools that support the complete internship lifecycle.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-mantech">
          <StaggerContainer className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <Link href={s.href} className="group block h-full">
                  <div className="relative h-full rounded-2xl overflow-hidden shadow-card transition-all hover:shadow-card-hover">
                    <div className="absolute inset-0">
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${s.bgImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    </div>
                    <div className="relative p-8 pt-8">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mantech text-white mb-5">
                        <s.icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-white">{s.title}</h3>
                      <p className="mt-3 text-sm text-white/90">{s.description}</p>
                      <ul className="mt-5 space-y-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /><span className="text-sm text-white/80">{f}</span></li>
                        ))}
                      </ul>
                      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:gap-2.5 transition-all">
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
