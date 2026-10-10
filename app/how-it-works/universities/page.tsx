"use client";

import { motion } from "framer-motion";
import { Users, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/shared/section-animations";

const steps = [
  "Register your university account",
  "Complete your institutional profile and get verified",
  "Add authorized staff and coordinators",
  "Monitor student placements",
  "Track active internships in real-time",
  "Coordinate partner company network",
  "Verify placement outcomes",
  "Access completion statistics",
  "View institutional analytics",
  "Export data (CSV/PDF)",
  "Manage partner company relationships",
  "Recruit interns when recruiter mode is enabled",
];

export default function HowItWorksUniversitiesPage() {
  return (
    <div className="overflow-hidden">
      <section className="surface-page relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
        <div className="container-mantech relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary shadow-card">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How it works for universities
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Monitor placements, track active internships, and coordinate
              partner companies — all in one place.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-mantech max-w-4xl">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, idx) => (
              <FadeIn key={step} delay={idx * 0.05}>
                <div className="flex h-full items-start gap-4 rounded-2xl border border-border/80 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div className="flex items-start gap-2 pt-1.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/80">{step}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
