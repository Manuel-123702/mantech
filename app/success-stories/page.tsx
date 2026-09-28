'use client';

import { motion } from 'framer-motion';
import { Award, TrendingUp, Briefcase, GraduationCap } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const stories = [
  { icon: GraduationCap, title: 'From Student to Software Engineer', description: 'A computer science student from the University of Buea found a software engineering internship in Douala through MANTECH, completed it with excellent evaluations, and was offered a full-time position.' },
  { icon: Briefcase, title: 'Company Builds Talent Pipeline', description: 'A tech company in Yaoundé used MANTECH to manage 15 interns across 3 cohorts, with structured onboarding, weekly reports, and evaluations leading to 4 full-time hires.' },
  { icon: TrendingUp, title: 'University Tracks 200+ Placements', description: 'A university in Douala uses MANTECH to monitor 200+ student placements in real-time, with supervisor coordination and completion statistics at their fingertips.' },
];

export default function SuccessStoriesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Success Stories</h1>
            <p className="mt-4 text-lg text-muted-foreground">Real outcomes from the MANTECH internship ecosystem.</p>
          </motion.div>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {stories.map((story, idx) => (
              <FadeIn key={story.title} delay={idx * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-mantech text-white"><story.icon className="h-7 w-7" /></div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground">{story.title}</h3>
                      <p className="mt-2 text-muted-foreground">{story.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-gradient-mantech-light p-8 text-center">
            <Award className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Success stories are published with appropriate permission. MANTECH never fabricates stories.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
