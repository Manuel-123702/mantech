'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading text-4xl font-bold tracking-tight text-foreground">Privacy Policy</motion.h1>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <div><h2 className="font-heading text-xl font-bold text-foreground">1. Data Collection</h2><p className="mt-2">MANTECH collects information necessary for internship management: name, email, role, education, skills, CV, application documents, reports, and evaluations. We never collect payment credentials.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">2. Data Storage</h2><p className="mt-2">Data is stored in PostgreSQL with row-level security. Files are stored securely with ownership and authorization checks. Access requires authentication and authorization.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">3. Data Access</h2><p className="mt-2">Users can only access their own data and data they are authorized to see. Organization isolation ensures companies and universities cannot access other organizations&apos; private records.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">4. Career Passport</h2><p className="mt-2">Career Passport is private by default. It does not expose private phone numbers, emails, CV files, confidential reports, private evaluation comments, or other users&apos; information without explicit authorization.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">5. Data Retention</h2><p className="mt-2">Internship records are retained as persistent digital history. Users may request deactivation of their account. Deactivating a field of study does not destroy historical records.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">6. Contact</h2><p className="mt-2">For privacy questions, contact MANTECH at tessohmanuel@gmail.com or WhatsApp +237 650 921 917.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
