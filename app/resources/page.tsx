'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ArrowRight, FileText, Users, Building2, GraduationCap } from 'lucide-react';
import { SectionHeader, FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/section-animations';

const resources = [
  { icon: FileText, title: 'CV Preparation', description: 'How to prepare a professional CV that stands out to companies hiring IT interns in Cameroon.', category: 'Student' },
  { icon: FileText, title: 'Internship Application Guide', description: 'Best practices for applying to internships through MANTECH and external platforms.', category: 'Student' },
  { icon: Users, title: 'Interview Preparation', description: 'How to prepare for technical and behavioral interviews with host companies.', category: 'Student' },
  { icon: BookOpen, title: 'Professional Behavior', description: 'Understanding workplace expectations, communication, and professional conduct.', category: 'Student' },
  { icon: FileText, title: 'Writing Internship Reports', description: 'How to write effective weekly, monthly, and final internship reports.', category: 'Student' },
  { icon: Building2, title: 'Creating Quality Internships', description: 'How companies can design meaningful internship opportunities for IT students.', category: 'Company' },
  { icon: Users, title: 'Supervising Interns', description: 'Best practices for mentoring and supervising IT interns effectively.', category: 'Company' },
  { icon: GraduationCap, title: 'Internship Coordination', description: 'How universities can coordinate and monitor student placements.', category: 'University' },
];

export default function ResourcesPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Resource Center</h1>
            <p className="mt-4 text-lg text-muted-foreground">Guides and articles for students, companies, and universities.</p>
          </motion.div>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <StaggerItem key={r.title}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><r.icon className="h-6 w-6" /></div>
                  <div className="mt-2"><span className="text-xs font-medium text-accent">{r.category}</span></div>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">Read more <ArrowRight className="h-4 w-4" /></div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
