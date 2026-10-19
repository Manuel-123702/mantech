import Link from "next/link";
import { Check, ArrowRight, Sparkles, ShieldCheck, Zap, Users } from "lucide-react";
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
    <section className="section-padding bg-[#061713] border-b border-slate-800/80 relative overflow-hidden text-white">
      {/* Ambient emerald & teal lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="container-mantech relative z-10">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900/90 backdrop-blur-md shadow-2xl">
            {/* Ambient inner glow */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent pointer-events-none"
            />

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
              {/* Left: the promise */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/30">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  For every intern
                </span>

                <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Internships are free.
                  <span className="block text-emerald-400">Always.</span>
                </h2>

                <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300">
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
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-sm">
                        <item.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="mt-2.5 text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/internships"
                    className="inline-flex h-12 items-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition-colors hover:bg-emerald-500"
                  >
                    Browse free internships
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/register/intern"
                    className="inline-flex h-12 items-center rounded-xl border border-slate-700 bg-slate-800/80 px-6 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    Create your free profile
                  </Link>
                </div>
              </div>

              {/* Right: what is included */}
              <div className="rounded-3xl border border-emerald-500/30 bg-slate-950/80 p-7 shadow-xl lg:p-8">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Included with every account
                </span>
                <p className="mt-2 text-sm font-semibold text-white">
                  Everything a student needs to secure an internship in Cameroon:
                </p>

                <ul className="mt-6 space-y-3.5">
                  {[
                    "Search and filter all verified internship listings",
                    "Intern Passport with cryptographic verification ID",
                    "Application tracker with real status updates",
                    "Readiness score and profile checklist",
                    "Interview schedule and placement history",
                    "Direct messaging with recruiters",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/30">
                        <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Answers the obvious question before it is asked. */}
                <div className="mt-7 rounded-xl border border-dashed border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-xs leading-relaxed text-slate-400">
                    <strong className="font-semibold text-white">Who pays?</strong>{" "}
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
      className={`rounded-3xl border border-slate-800 bg-[#080e1c] p-7 sm:p-10 shadow-2xl relative overflow-hidden text-white backdrop-blur-md ${className}`}
    >
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-2xl relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300">
          <Users className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
          Subscription Onboarding
        </span>
        <h3 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-500">
          Three Simple Steps. Zero Automated Card Charges.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Every organization account is verified and activated by our team after confirming your payment. Zero automatic rebilling, zero stored credit card data.
        </p>
      </div>

      <MotionSection
        motion={motion}
        stagger={0.1}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
      >
        {SUBSCRIPTION_STEPS.map((step, index) => (
          <MotionItem key={step.title} motion={motion} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-7 transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:bg-slate-800/90 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent group-hover:via-blue-500 transition-colors" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold shadow-sm ${step.tone === "blue"
                      ? "bg-blue-600 text-white shadow-blue-600/20"
                      : step.tone === "amber"
                        ? "bg-amber-500 text-white shadow-amber-500/20"
                        : "bg-emerald-600 text-white shadow-emerald-600/20"
                      }`}
                  >
                    0{index + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                    Stage 0{index + 1}
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-white">
                  {step.title}
                </h4>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {step.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-orange-400">
                <span>Verified Step</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </MotionItem>
        ))}
      </MotionSection>

      <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md p-6 lg:flex-row lg:items-center lg:justify-between shadow-lg relative z-10">
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-white">
            Need a tailored enterprise or institutional convention?
          </p>
          <p className="text-xs text-slate-400">
            Tell us your recruitment volume or university scope, and our team will prepare a direct quote in XAF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:flex-nowrap lg:shrink-0">
          <a
            href={APP_CONFIG.support.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white shadow-md shadow-green-600/25 transition-colors hover:bg-[#128C7E]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" title="WhatsApp" />
            Message on WhatsApp
          </a>
          <a
            href={APP_CONFIG.support.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white shadow-md shadow-green-600/25 transition-colors hover:bg-[#128C7E]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" title="WhatsApp" />
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-4 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
          >
            Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
