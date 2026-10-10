import Link from "next/link";
import { Check, ArrowRight, Sparkles, ShieldCheck, Zap, Users, Mail } from "lucide-react";
import { FadeIn, MotionSection, MotionItem } from "@/components/shared/section-animations";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { APP_CONFIG } from "@/lib/config";

/**
 * The Member plan.
 *
 * Internships are free for everyone who is looking for one, and this panel says
 * so plainly. It sits above the paid organization plans on purpose: a visitor
 * should learn that finding a job costs them nothing before they ever read a
 * price.
 */
export function MemberPlanSection() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-mantech">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-card">
            {/* Soft colour behind the panel, purely decorative. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-100/70 via-sky-50/40 to-transparent"
            />

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
              {/* Left: the promise */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  For every intern
                </span>

                <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Internships are free.
                  <span className="block text-emerald-600">Always.</span>
                </h2>

                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                  Searching listings, applying and tracking every stage of your
                  application cost you nothing. MANTECH earns from the organizations
                  who hire, so a student is never the one paying.
                </p>

                {/* Reassurance points */}
                <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Sparkles,
                      title: "No fees, ever",
                      text: "No subscription, no listing fee, no hidden charge.",
                    },
                    {
                      icon: Zap,
                      title: "Apply in minutes",
                      text: "One profile, one CV, apply to any listing instantly.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "You stay in control",
                      text: "Your phone number is never shared without your say-so.",
                    },
                  ].map((item) => (
                    <li
                      key={item.title}
                      className="rounded-2xl border border-border/70 bg-slate-50/70 p-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                        <item.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="mt-2.5 text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/internships"
                    className="inline-flex h-12 items-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                  >
                    Browse free internships
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/register/intern"
                    className="inline-flex h-12 items-center rounded-xl border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    Create your free profile
                  </Link>
                </div>
              </div>
              {/* Right: what is included */}
              <div className="rounded-2xl border border-border/80 bg-white p-7 shadow-sm lg:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Member plan
                  </h3>
                  <p className="text-right">
                    <span className="block font-heading text-4xl font-extrabold leading-none text-emerald-600">
                      Free
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      for the whole internship
                    </span>
                  </p>
                </div>

                <ul className="mt-7 space-y-3.5">
                  {[
                    "Every internship listing, unfiltered",
                    "Unlimited applications and saved jobs",
                    "Intern Passport with verified documents",
                    "Application tracker with real status updates",
                    "Readiness score and profile checklist",
                    "Interview schedule and placement history",
                    "Direct messaging with recruiters",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Answers the obvious question before it is asked. */}
                <div className="mt-7 rounded-xl border border-dashed border-border bg-slate-50 p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">Who pays?</strong>{" "}
                    Companies and universities pay for recruiter tools and visibility.
                    That is the only money MANTECH takes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

const SUBSCRIPTION_STEPS = [
  {
    title: "Choose your plan",
    text: "Tell us what you need: how many vacancies you have, the roles you hire for, and how many people will use the account. You can change or stop at any time.",
    tone: "blue",
  },
  {
    title: "Email us or message on WhatsApp",
    text: "Write to us with the plan you want. We reply with the steps to pay. No card details are ever stored on this site.",
    tone: "amber",
  },
  {
    title: "We switch it on",
    text: "Once we confirm your payment, a member of our team activates your plan and your team can start posting the same day.",
    tone: "emerald",
  },
] as const;

/**
 * How an organization actually gets subscribed.
 *
 * This sits beside the plan cards because "how do I pay?" is the real hesitation
 * behind every price list, and answering it next to the prices is what turns a
 * list of numbers into a decision. Email leads, WhatsApp sits beside it as an
 * equal option.
 */
export function SubscriptionProcess({
  className = "",
  motion = "wipe",
}: {
  className?: string;
  motion?: "wipe" | "slideLeft";
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9 ${className}`}
    >
      <div className="max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 ring-1 ring-blue-200">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          How subscription works
        </span>
        <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-900">
          Three steps. No card details on this site.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Every plan is activated by our team after we confirm your payment.
          Nothing is charged automatically, and nothing is stored.
        </p>
      </div>

      <MotionSection
        motion={motion}
        stagger={0.14}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SUBSCRIPTION_STEPS.map((step, index) => (
          <MotionItem key={step.title} motion={motion} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition-colors hover:border-slate-300 hover:bg-white">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    step.tone === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : step.tone === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {index + 1}
                </span>
                {/* A rule that fades out to the right, so the steps read as a
                    left-to-right sequence without a literal arrow. Decorative. */}
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"
                />
              </div>

              <h4 className="mt-4 font-heading text-base font-bold text-slate-900">
                {step.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          </MotionItem>
        ))}
      </MotionSection>

      {/* Email and WhatsApp with equal weight. Email is the written record we
          can confirm a subscription against; WhatsApp is faster for a live
          question. The contact form stays as a third option for anyone who
          prefers not to open another app. */}
      <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Not sure which plan fits?</span>{" "}
          Tell us what you are hiring for and we will recommend one.
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row lg:shrink-0">
          <a
            href={`mailto:${APP_CONFIG.support.email}?subject=${encodeURIComponent(
              "MANTECH Nexus subscription enquiry"
            )}&body=${encodeURIComponent(
              "Hello MANTECH Nexus,\n\nI would like to subscribe to a plan. Here is what I need:\n\nOrganization:\nRole(s) to fill:\nNumber of interns:\n\nThank you."
            )}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email us
          </a>
          <a
            href={APP_CONFIG.support.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#128C7E]"
          >
            <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Contact form
          </Link>
        </div>
      </div>
    </div>
  );
}
