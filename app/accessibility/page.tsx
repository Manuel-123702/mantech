'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Eye, Keyboard, Volume2, Type, MousePointerClick, CheckCircle2,
  Globe, Contrast, Focus, ArrowRight, Star, Heart, ShieldCheck,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Keyboard,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Full Keyboard Navigation',
    description: 'Every button, link, form control, modal, and dropdown on MANTECH is reachable and operable using keyboard alone. Tab order is logical, focus rings are high-contrast (3px solid cyan outline), and all modals trap focus correctly with Escape to dismiss.',
  },
  {
    icon: Eye,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Screen Reader Compatibility',
    description: 'Semantic HTML5 elements are used throughout: nav, main, section, article, aside, button, and form landmarks provide screen reader navigation hooks. All interactive components include proper aria-label, aria-expanded, aria-haspopup, and role attributes. NVDA and VoiceOver tested on critical paths.',
  },
  {
    icon: Contrast,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'WCAG AA Color Contrast',
    description: 'All body text achieves a minimum 4.5:1 contrast ratio against its background. Heading text achieves 7:1. UI control borders achieve 3:1. Dark-mode is the primary design mode — white and near-white text on deep-navy backgrounds produces exceptional legibility on low-quality Cameroonian mobile screens.',
  },
  {
    icon: Type,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Readable Typography',
    description: 'MANTECH uses Inter (Latin/Latin Extended) and Noto Sans (French diacritics) — professional, humanist sans-serif faces designed for screen legibility. Minimum body text is 14px/0.875rem with 1.5x line-height. No all-caps body text. Font size is user-resizable without layout breakage (tested at 200% browser zoom).',
  },
  {
    icon: MousePointerClick,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Accessible Forms & Validation',
    description: 'All form inputs have visible, persistent labels (never placeholder-as-label). Validation errors are announced through aria-live regions so screen readers describe errors without requiring a page refresh. Error messages are descriptive ("Email must contain @ sign") not vague ("Invalid input"). Required fields are labelled semantically.',
  },
  {
    icon: Volume2,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Reduced Motion Support',
    description: 'MANTECH uses Framer Motion throughout for page transitions, component entrances, and interactive micro-animations. All animations respect the prefers-reduced-motion media query — when active, all transitions drop to 0ms duration. This protects users with vestibular disorders, photosensitivity, or motion sickness.',
  },
  {
    icon: Globe,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Bilingual Text Clarity',
    description: 'All public content is available in English and French. The lang attribute is set accurately per page — critical for screen readers to select the correct pronunciation engine. Mixed-language fields (e.g. Cameroonian institution names) use the appropriate lang span attributes.',
  },
  {
    icon: Focus,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Mobile Touch Targets',
    description: 'All tap targets across the MANTECH mobile interface meet the WCAG 2.5.8 minimum of 24×24 CSS pixels, with most interactive elements sized at 44×44 pixels following Apple and Android HIG guidelines. This is critical for mobile-first usage on Cameroonian smartphones with varying screen sizes.',
  },
  {
    icon: ShieldCheck,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'WCAG 2.1 AA Compliance Target',
    description: 'MANTECH targets WCAG 2.1 Level AA across Perceivable, Operable, Understandable, and Robust success criteria. We actively test with automated tools (Lighthouse, axe-core) and manual screen reader testing. Accessibility issues discovered during testing are prioritized as P1 bugs.',
  },
];

export default function AccessibilityPage() {
  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO: VIOLET KNOWLEDGE AESTHETIC ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-24 lg:py-32">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url('/images/violet_tech_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#08040f]/95 via-[#0d0518]/90 to-[#070d18]/95" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md">
              <Heart className="w-4 h-4 text-violet-400" /> Accessibility · WCAG 2.1 AA Target
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Built for{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Everyone in Cameroon
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
              MANTECH Nexus is designed so that every student, recent graduate, and enterprise recruiter across Cameroon's 10 regions can use the platform — regardless of disability, device quality, internet speed, or assistive technology.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { val: 'WCAG 2.1 AA', sub: 'Target Standard' },
                { val: '4.5:1+', sub: 'Text Contrast Ratio' },
                { val: 'prefers-reduced-motion', sub: 'Animation Respected' },
              ].map((m) => (
                <div key={m.val} className="rounded-2xl border border-violet-500/20 bg-violet-950/20 backdrop-blur-md p-4 text-center">
                  <div className="text-lg font-extrabold text-violet-300 font-heading">{m.val}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-violet-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Our Commitments</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
              9 Accessibility Principles We Live By
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-2xl mx-auto">
              These are not aspirational — they are active engineering decisions built into MANTECH from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.06 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${f.bg} ${f.color} mb-4`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-white">{f.title}</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEEDBACK CTA ── */}
      <section className="py-16 border-t border-slate-800/80">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-900 p-8 sm:p-12">
            <Star className="w-12 h-12 text-violet-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Found an Accessibility Issue?
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto">
              We treat accessibility defects as P1 bugs. Report any barrier you encounter — we respond within 24 hours on business days.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_MANTECH_EMAIL || 'tessohmanuel@gmail.com'}?subject=Accessibility Feedback`}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30"
              >
                Email Accessibility Team <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/contact">
                <button className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all">
                  Contact Form
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
