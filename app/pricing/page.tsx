"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { MemberPlanSection } from "@/components/pricing/member-plan-section";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  SectionHeader,
  FadeIn,
  MotionSection,
  MotionItem,
} from "@/components/shared/section-animations";
import { APP_CONFIG } from "@/lib/config";
import { z } from "zod";

const WHATSAPP_CTA = APP_CONFIG.support.whatsapp;
const publicPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.enum(["FREE", "PROFESSIONAL", "BUSINESS", "ENTERPRISE"]),
  priceXAF: z.number(),
  opportunityLimit: z.number(),
  candidateSearchLimit: z.number(),
  maxRecruiterAccounts: z.number(),
  featuredOpportunitiesLimit: z.number(),
  isFeaturedBadge: z.boolean(),
  prioritySupport: z.boolean(),
  description: z.string(),
  features: z.array(z.string()),
});
const publicPackagesResponseSchema = z.object({
  packages: z.array(publicPackageSchema),
});
type PublicPackage = z.infer<typeof publicPackageSchema>;

const PACKAGE_ORDER: PublicPackage["code"][] = ["FREE", "PROFESSIONAL", "BUSINESS", "ENTERPRISE"];

function packageWhatsAppLink(pkg: PublicPackage) {
  return `${WHATSAPP_CTA}?text=${encodeURIComponent(
    `Hello MANTECH Nexus, I would like information about the ${pkg.name} package (${pkg.code}).`
  )}`;
}

/**
 * One paid plan, rendered as a card.
 *
 * `isFeaturedBadge` drives the emphasis rather than a hardcoded plan name, so
 * changing the recommended plan in configuration moves the highlight with it.
 * `wide` switches the Institutional Partner card to a two-column layout, since
 * its feature list is longer and the comparison row above it is a 3-up grid.
 */
function PlanCard({ plan, wide = false }: { plan: PublicPackage; wide?: boolean }) {
  const recommended = plan.isFeaturedBadge;

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${
        recommended
          ? "border-blue-500/80 bg-slate-900/95 ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10 text-white"
          : "border-slate-800 bg-slate-900/85 text-white shadow-lg backdrop-blur-md"
      }`}
    >
      {recommended && (
        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
          Most popular
        </span>
      )}

      <h3 className="font-heading text-lg font-bold text-white">{plan.name}</h3>
      {/* Fixed height so prices align across the row even when descriptions
          differ in length. */}
      <p className="mt-2 min-h-10 text-sm text-slate-300 leading-relaxed">{plan.description}</p>

      {/* Every plan is free right now — package data (priceXAF) is kept in
          the database for later, but the public display says Free. */}
      <p className="mt-5 font-heading text-3xl font-extrabold text-white">
        Free
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-400">
        {plan.code === "ENTERPRISE" ? "unlimited access" : "all features included"}
      </p>

      {wide && (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs sm:grid-cols-4">
          {[
            { label: "Active roles", value: plan.opportunityLimit },
            { label: "Candidate views", value: plan.candidateSearchLimit },
            { label: "Recruiter seats", value: plan.maxRecruiterAccounts },
            { label: "Featured slots", value: plan.featuredOpportunitiesLimit },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-slate-400">{stat.label}</dt>
              <dd className="mt-0.5 font-semibold text-white">
                {stat.value >= 999 ? "Unlimited" : stat.value}
              </dd>
            </div>
          ))}
        </div>
      )}

      <ul className={`${wide ? "sm:grid sm:grid-cols-2 sm:gap-x-8" : ""} mt-6 flex-1 space-y-3`}>
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span className="text-sm text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* WhatsApp is the primary subscribe route; the contact form is the fallback. */}
      <div className="mt-8 space-y-2.5 text-center">
        <a
          href={WHATSAPP_CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/25 transition-all hover:bg-[#128C7E]"
>
          <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
          Subscribe on WhatsApp
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
>
          Contact us
        </Link>
      </div>

export default function PricingPage() {
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadPackages() {
      try {
        const response = await fetch("/api/packages");
        const body: unknown = await response.json();
        if (!response.ok) {
          const message = z.object({ error: z.string() }).safeParse(body);
          throw new Error(message.success ? message.data.error : "Could not load current packages.");
        }
        const parsed = publicPackagesResponseSchema.safeParse(body);
        if (!parsed.success) throw new Error("The package response was invalid.");
        if (!cancelled) {
          setPackages(parsed.data.packages);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load current packages.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  // Preserve the configured order so the ladder always reads cheapest first,
  // regardless of what order the API happens to return.
  const orderedPackages = PACKAGE_ORDER
    .map((code) => packages.find((pkg) => pkg.code === code))
    .filter((pkg): pkg is PublicPackage => Boolean(pkg));

  // The three commercial plans sit in the comparison grid. Institutional
  // Partner is separated out because universities buy a semester agreement with
  // a different buyer, not a monthly seat.
  const commercialPackages = orderedPackages.filter((pkg) => pkg.code !== "ENTERPRISE");
  const universityPlan = orderedPackages.find((pkg) => pkg.code === "ENTERPRISE");

  return (
    <div className="overflow-hidden bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-br from-slate-950 via-[#0a1222] to-slate-950 py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
        <div className="container-mantech relative px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 shadow-sm">
              Pricing Catalogue
            </span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              MANTECH primarily monetizes organizations. Interns always have
              free access. All prices in XAF/FCFA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Member plan first: an intern should learn the price is zero before
          they ever see an organization's prices. */}
      <MemberPlanSection />

      <section className="section-padding bg-[#070d18] relative overflow-hidden border-b border-slate-800/80 text-white">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10">
          <SectionHeader
            eyebrow="For organizations"
            title="Plans for companies and universities"
            description="Internships are free for everyone looking for one. These plans are for the organizations that post them and reach candidates."
          />
          {error && (
            <p role="alert" className="mt-8 text-center text-sm text-destructive">{error}</p>
          )}
          {loading ? (
            <p className="mt-12 text-center text-slate-400" role="status">Loading current packages...</p>
          ) : (
          <>
          {/* The three commercial plans, side by side. */}
          <MotionSection motion="rise" stagger={0.12}>
            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {commercialPackages.map((plan) => (
                <MotionItem key={plan.code} motion="spread" className="h-full">
                  <PlanCard plan={plan} />
                </MotionItem>
              ))}
            </div>
          </MotionSection>

          {/* Universities get a full-width panel below, because a semester
              contract and a dual-mode dashboard do not belong in the same
              three-way comparison. */}
          {universityPlan && (
            <MotionSection motion="spread" stagger={0.1}>
              <MotionItem motion="spread" className="mt-6">
                <PlanCard plan={universityPlan} wide />
              </MotionItem>
            </MotionSection>
          )}

          </>
          )}
        </div>
      </section>

      {/* Questions block: WhatsApp first, contact form as fallback. */}
      <section className="section-padding bg-slate-950 relative overflow-hidden border-b border-slate-900 text-white">
        <div className="container-mantech">
          <FadeIn>
            <div className="rounded-3xl border border-slate-800 bg-[#0c1424] p-8 text-center sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 right-1/4 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
              <h2 className="font-heading text-3xl font-bold text-white relative z-10">
                Have questions about pricing?
              </h2>
              <p className="mt-4 text-slate-300 max-w-xl mx-auto relative z-10">
                We discuss commercial details directly. No online payment
                processing - just a direct conversation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center relative z-10">
                {/* WhatsApp is the primary contact channel. */}
                <a
                  href={WHATSAPP_CTA}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-600/25 transition-all hover:bg-[#128C7E]">
                    <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
                    Chat on WhatsApp
                  </button>
                </a>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white">
                    Contact form <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
