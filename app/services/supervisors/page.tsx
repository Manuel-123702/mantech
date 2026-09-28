'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const supervisorFeatures = ['Assigned intern management', 'Progress timeline tracking', 'Report review & feedback', 'Structured evaluations', 'Milestone tracking', 'Concern flagging', 'Notifications', 'Account & security settings'];

export default function SupervisorServicesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-20 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white"><Briefcase className="h-8 w-8" /></div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">For Internship Supervisors</h1>
            <p className="mt-4 text-lg text-muted-foreground">Manage assigned interns, track progress, review reports, provide evaluations, and flag concerns.</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-mantech">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FadeIn>
              <h2 className="font-heading text-2xl font-bold text-foreground">Supervision tools</h2>
              <ul className="mt-6 space-y-3">{supervisorFeatures.map((f) => (<li key={f} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><span className="text-foreground/80">{f}</span></li>))}</ul>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-border bg-gradient-mantech-light p-8">
                <h3 className="font-heading text-lg font-semibold text-foreground">Assigned Interns Only</h3>
                <p className="mt-2 text-sm text-muted-foreground">Supervisors only see internships explicitly assigned to them. No access to other supervisors&apos; interns or unrelated company data.</p>
                <div className="mt-4 rounded-lg bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Evaluation Criteria</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Attendance', 'Technical', 'Communication', 'Professionalism', 'Task Completion', 'Learning'].map((c) => (
                      <span key={c} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="mt-12 text-center"><Link href="/sign-up"><button className="inline-flex items-center gap-2 rounded-lg bg-gradient-mantech px-6 py-3 text-sm font-medium text-white shadow-card hover:shadow-card-hover transition-all">Create an account <ArrowRight className="h-4 w-4" /></button></Link></div>
        </div>
      </section>
    </div>
  );
}
