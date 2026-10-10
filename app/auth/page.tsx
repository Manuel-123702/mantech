import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { APP_CONFIG } from "@/lib/config";
import {
  Briefcase,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    icon: GraduationCap,
    title: "Intern",
    description:
      "Create your Intern Passport, browse verified internships and manage applications.",
    href: "/register/intern",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Building2,
    title: "Company",
    description:
      "Publish opportunities, search Intern Passports and recruit verified talent.",
    href: "/register/company",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Briefcase,
    title: "University",
    description:
      "Place your students or recruit interns for your institution with dual-mode tools.",
    href: "/register/university",
    color: "from-purple-500 to-violet-600",
  },
];

export default function AuthHomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/hero_tech_bg.jpg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                {APP_CONFIG.name}
              </p>
              <p className="text-xs text-slate-400">Enterprise Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white"
              >
                ← Back to homepage
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Secure Clerk authentication · MFA ready</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300/90 sm:text-lg">
              Cameroon&apos;s premier internship marketplace. Choose your role
              below to sign in or create an account.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/50 hover:scale-[1.02]"
                >
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-slate-500/60 bg-white/5 text-white backdrop-blur hover:bg-white/10"
                >
                  Create account
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.title}
                  href={r.href}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40"
                >
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-slate-100">
                    Register as {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300/90">
                    {r.description}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-white">
                    Continue to registration
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </main>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400/90">
          <p>
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <p>
            For assistance,{" "}
            <a
              href={APP_CONFIG.contacts.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              chat with MANTECH on WhatsApp
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
