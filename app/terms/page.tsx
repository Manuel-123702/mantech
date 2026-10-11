"use client";

import { motion } from "framer-motion";
import { APP_CONFIG } from "@/lib/config";

export default function TermsPage() {
  const WHATSAPP_LABEL = APP_CONFIG.support.phoneDisplay;
  const EMAIL = APP_CONFIG.support.email;
  return (
    <div className="overflow-hidden">
      <section className="pt-8 pb-12 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Terms of Service
          </motion.h1>
        </div>
      </section>
      <section className="pb-24 pt-6 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 relative overflow-hidden border-b border-slate-200/80">
        <div className="container-mantech max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-7 text-muted-foreground shadow-md sm:p-10">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                1. Acceptance
              </h2>
              <p className="mt-2">
                By using MANTECH Nexus, you agree to these terms. MANTECH is an
                internship marketplace for internship seekers, companies,
                and universities in Cameroon.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                2. User Roles
              </h2>
              <p className="mt-2">
                Users register as interns, companies, universities, or
                administrators. Each role has specific permissions enforced
                server-side. Misrepresenting your role or organization is
                prohibited.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                3. No Online Payments
              </h2>
              <p className="mt-2">
                MANTECH does not process online payments. Commercial discussions
                are conducted through WhatsApp, phone, or email. We never
                request payment credentials.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                4. Content & Data
              </h2>
              <p className="mt-2">
                Users are responsible for the accuracy of information they
                provide. Companies must not post fake opportunities. Students
                must not submit falsified documents. MANTECH reserves the right
                to moderate, suspend, or remove content.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                5. Security
              </h2>
              <p className="mt-2">
                Users must not attempt to access data they are not authorized to
                see, exploit vulnerabilities, or share credentials. All actions
                are audit-logged.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                6. Contact
              </h2>
              <p className="mt-2">
                For questions about these terms, contact {EMAIL} or WhatsApp{" "}
                {WHATSAPP_LABEL}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
