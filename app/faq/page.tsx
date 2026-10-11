'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SectionHeader } from '@/components/shared/section-animations';

const faqs = [
  { q: 'What is MANTECH Nexus?', a: 'MANTECH Nexus connects internship seekers, companies, and universities across Cameroon for opportunity discovery, applications, recruitment, and placement coordination.' },
  { q: 'Is MANTECH free for interns?', a: 'Intern access is free at launch. Interns can create a profile, discover opportunities, and manage applications.' },
  { q: 'How do companies get verified?', a: 'Companies register on MANTECH and submit their profile. MANTECH administrators review and verify companies before they can publish internships. Verification includes checking company identity, description, and contact information.' },
  { q: 'What professional fields does MANTECH support?', a: 'MANTECH supports professional fields managed through the platform taxonomy, including technology, engineering, business, and other disciplines.' },
  { q: 'How does the application process work?', a: 'Organizations choose applications through MANTECH, a company website, or an official external application URL. Each opportunity displays its application method.' },
  { q: 'What is the Intern Passport?', a: 'The Intern Passport is a professional discovery profile for authenticated users. Verified organizations can access permitted profile details; CV access is separately authorized and audited.' },
  { q: 'How does MANTECH ensure security?', a: 'MANTECH uses server-side role-based access control, organization isolation, row-level security at the database level, audit logging, and anti-enumeration measures. We never rely on hiding buttons — the server is the final authority.' },
  { q: 'Does MANTECH process payments online?', a: 'No. MANTECH does not implement online payment processing. All commercial discussions happen through WhatsApp, phone, or email. We display pricing in XAF/FCFA for reference.' },
  { q: 'What can universities do on MANTECH?', a: 'Universities can coordinate permitted placement activity and, when recruiter mode is enabled, manage opportunities and recruit interns. Organization data is isolated.' },
  { q: 'What regions of Cameroon does MANTECH cover?', a: 'MANTECH supports all 10 regions of Cameroon: Littoral, Centre, Southwest, Northwest, West, South, East, Far North, North, and Adamawa. Location data is admin-managed and extensible.' },
];

export default function FAQPage() {
  return (
    <div className="overflow-hidden">
      <section className="surface-page relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-500 to-blue-50/25 border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
        <div className="container-mantech relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <span className="mb-5 inline-flex rounded-full border border-primary/15 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">Support</span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Frequently Asked Questions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-orange-600 text-lg leading-relaxed text-muted-foreground">Everything you need to know about MANTECH Nexus.</p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-slate-50 via-blue-500 to-blue-50/25 relative overflow-hidden border-b border-slate-200/80">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.04 }}>
                <AccordionItem key={idx} value={`item-${idx}`} className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-sm px-6 py-1 shadow-sm hover:shadow-md hover:border-blue-400 transition-all data-[state=open]:border-blue-500/40 data-[state=open]:shadow-md">
                  <AccordionTrigger className="text-left font-heading text-base font-semibold text-foreground hover:no-underline hover:text-blue-600 transition-colors py-5">{faq.q}</AccordionTrigger>
                  <AccordionContent className="max-w-3xl text-sm leading-relaxed text-muted-foreground pb-5 pt-1">{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
