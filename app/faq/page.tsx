'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SectionHeader } from '@/components/shared/section-animations';

const faqs = [
  { q: 'What is MANTECH Nexus?', a: 'MANTECH Nexus is a secure, enterprise-grade internship management platform connecting students, companies, and universities across Cameroon. It manages the complete internship lifecycle from discovery to verified completion.' },
  { q: 'Is MANTECH free for students?', a: 'Yes, students always have free access to search and apply for internships, track applications, submit reports, and access their Career Passport.' },
  { q: 'How do companies get verified?', a: 'Companies register on MANTECH and submit their profile. MANTECH administrators review and verify companies before they can publish internships. Verification includes checking company identity, description, and contact information.' },
  { q: 'What IT fields does MANTECH support?', a: 'MANTECH supports 80+ IT/ICT fields including Computer Science, Software Engineering, Cybersecurity, Networks, Data Science, AI/ML, Cloud Computing, DevOps, and more. The taxonomy is admin-managed and extensible.' },
  { q: 'How does the application process work?', a: 'Students can apply through three methods: directly on MANTECH, through the company website, or via external platforms like LinkedIn. All applications are tracked with a timeline from submission to completion.' },
  { q: 'What is the Career Passport?', a: 'Career Passport is a separate companion application that presents your verified internship journey — education, experience, skills, achievements, and career development. It is available only to authenticated students, companies, and universities.' },
  { q: 'How does MANTECH ensure security?', a: 'MANTECH uses server-side role-based access control, organization isolation, row-level security at the database level, audit logging, and anti-enumeration measures. We never rely on hiding buttons — the server is the final authority.' },
  { q: 'Does MANTECH process payments online?', a: 'No. MANTECH does not implement online payment processing. All commercial discussions happen through WhatsApp, phone, or email. We display pricing in XAF/FCFA for reference.' },
  { q: 'Can universities track their students?', a: 'Yes. Universities get a dashboard to monitor student placements, track active internships, coordinate supervisors, collect reports, and access institutional analytics. Universities only see their own students — never other institutions\' records.' },
  { q: 'What regions of Cameroon does MANTECH cover?', a: 'MANTECH supports all 10 regions of Cameroon: Littoral, Centre, Southwest, Northwest, West, South, East, Far North, North, and Adamawa. Location data is admin-managed and extensible.' },
];

export default function FAQPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about MANTECH Nexus.</p>
          </motion.div>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech max-w-3xl px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                <AccordionItem key={idx} value={`item-${idx}`} className="rounded-2xl border border-border bg-card px-6 shadow-card">
                  <AccordionTrigger className="text-left font-heading text-base font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
