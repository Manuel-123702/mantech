'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="overflow-hidden">
      <section className="pt-32 pb-12 bg-gradient-mantech-light">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading text-4xl font-bold tracking-tight text-foreground">Terms of Service</motion.h1>
        </div>
      </section>
      <section className="pb-20 bg-white">
        <div className="container-mantech max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-muted-foreground">
            <div><h2 className="font-heading text-xl font-bold text-foreground">1. Acceptance</h2><p className="mt-2">By using MANTECH Nexus, you agree to these terms. MANTECH is an internship management platform for IT/ICT students, companies, and universities in Cameroon.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">2. User Roles</h2><p className="mt-2">Users register as students, companies, universities, or supervisors. Each role has specific permissions enforced server-side. Misrepresenting your role or organization is prohibited.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">3. No Online Payments</h2><p className="mt-2">MANTECH does not process online payments. Commercial discussions are conducted through WhatsApp, phone, or email. We never request payment credentials.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">4. Content & Data</h2><p className="mt-2">Users are responsible for the accuracy of information they provide. Companies must not post fake opportunities. Students must not submit falsified documents. MANTECH reserves the right to moderate, suspend, or remove content.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">5. Security</h2><p className="mt-2">Users must not attempt to access data they are not authorized to see, exploit vulnerabilities, or share credentials. All actions are audit-logged.</p></div>
            <div><h2 className="font-heading text-xl font-bold text-foreground">6. Contact</h2><p className="mt-2">For questions about these terms, contact tessohmanuel@gmail.com or WhatsApp +237 650 921 917.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
