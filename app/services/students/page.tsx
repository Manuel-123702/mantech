'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeader, FadeIn } from '@/components/shared/section-animations';

const studentFeatures = ['Internship search & smart matching', 'Application tracking timeline', 'Readiness checklist & score', 'Saved internships & alerts', 'Weekly, monthly & final reports', 'Career Passport access', 'Internship history', 'Notifications & reminders'];
const companyFeatures = ['Internship creation & management', 'Candidate pipeline & shortlisting', 'Interview scheduling', 'Placement & onboarding', 'Intern monitoring & reports', 'Analytics & evaluations', 'Company trust profile', 'Staff management'];
const universityFeatures = ['Student placement monitoring', 'Active internship tracking', 'Supervisor coordination', 'Report collection & review', 'Completion statistics', 'Institutional analytics', 'Exports (CSV/PDF)', 'Partner company network'];
const supervisorFeatures = ['Assigned intern management', 'Progress timeline tracking', 'Report review & feedback', 'Structured evaluations', 'Milestone tracking', 'Concern flagging', 'Notifications', 'Account & security settings'];

export default function StudentServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-mantech text-white"><GraduationCap className="h-8 w-8" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">For Students & Interns</h1>
            <p className="mt-4 text-lg text-muted-foreground">Find legitimate IT internships, manage your applications, build your readiness, and complete your internship with structured reports and evaluations.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-mantech">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FadeIn>
              <h2 className="font-heading text-2xl font-bold text-foreground">Everything you need</h2>
              <ul className="mt-6 space-y-3">{studentFeatures.map((f) => (<li key={f} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><span className="text-foreground/80">{f}</span></li>))}</ul>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-border bg-gradient-mantech-light p-8">
                <h3 className="font-heading text-lg font-semibold text-foreground">The Readiness System</h3>
                <p className="mt-2 text-sm text-muted-foreground">Complete your profile, education, CV, skills, and documents. Your readiness score shows how prepared you are — but it&apos;s never a guarantee of selection.</p>
                <div className="mt-4 space-y-2">
                  {[{ label: 'Profile', done: true }, { label: 'Education', done: true }, { label: 'CV', done: true }, { label: 'Skills', done: true }, { label: 'Documents', done: false }].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5">
                      <span className="text-sm font-medium">{item.label}</span>
                      <CheckCircle2 className={`h-5 w-5 ${item.done ? 'text-green-600' : 'text-muted-foreground/30'}`} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-2xl font-bold text-primary">80% Ready</div>
              </div>
            </FadeIn>
          </div>
          <div className="mt-12 text-center"><Link href="/sign-up"><button className="inline-flex items-center gap-2 rounded-lg bg-gradient-mantech px-6 py-3 text-sm font-medium text-white shadow-card hover:shadow-card-hover transition-all">Create your student account <ArrowRight className="h-4 w-4" /></button></Link></div>
        </div>
      </section>
    </div>
  );
}
