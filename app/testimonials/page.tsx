'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const testimonials = [
  { name: 'Student', role: 'Software Engineering Intern', organization: 'University of Buea', quote: 'MANTECH helped me find a legitimate software engineering internship in Douala. The application tracking and report system kept me organized throughout.' },
  { name: 'Recruiter', role: 'HR Manager', organization: 'Tech Company, Yaoundé', quote: 'We replaced our spreadsheet-based applicant tracking with MANTECH. The candidate pipeline and interview scheduling saved us hours every week.' },
  { name: 'Coordinator', role: 'Internship Coordinator', organization: 'University of Douala', quote: 'For the first time, we can see all our students\' placements in real time. The analytics dashboard gives us insights we never had before.' },
  { name: 'Supervisor', role: 'Technical Supervisor', organization: 'IT Firm, Bafoussam', quote: 'The structured evaluation system and progress tracking make supervision much more systematic. Reports and feedback are all in one place.' },
];

export default function TestimonialsPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Testimonials</h1>
            <p className="mt-4 text-lg text-muted-foreground">Real experiences from the MANTECH community.</p>
          </motion.div>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((t, idx) => (
              <StaggerItem key={idx}>
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-card">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <p className="mt-4 text-foreground/80">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-mantech text-sm font-semibold text-white">{t.name.charAt(0)}</div>
                    <div>
                      <div className="font-semibold text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role} · {t.organization}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
