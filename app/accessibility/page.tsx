'use client';

import { motion } from 'framer-motion';
import { Eye, Keyboard, Volume2, Type, MousePointerClick, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/shared/section-animations';

const features = [
  { icon: Keyboard, title: 'Keyboard Navigation', description: 'All interactive elements are accessible via keyboard. Focus states are visible and logical tab order is maintained.' },
  { icon: Eye, title: 'Screen Reader Support', description: 'Semantic HTML, proper ARIA labels, and alt text ensure screen readers can navigate and describe content.' },
  { icon: Type, title: 'Readable Typography', description: 'Sufficient contrast ratios, clear font sizes, and 150% line spacing for body text improve readability.' },
  { icon: MousePointerClick, title: 'Accessible Forms', description: 'All forms have labels, validation messages, and error states that are announced to assistive technology.' },
  { icon: Volume2, title: 'Reduced Motion', description: 'We respect prefers-reduced-motion. Animations are minimized or removed when this setting is active.' },
  { icon: CheckCircle2, title: 'Clear Validation', description: 'Form errors are visible, descriptive, and programmatically associated with their inputs.' },
];

export default function AccessibilityPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading text-4xl font-bold tracking-tight text-foreground">Accessibility</motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">MANTECH Nexus is committed to making internship management accessible to all users across Cameroon.</p>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, idx) => (
              <FadeIn key={f.title} delay={idx * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
