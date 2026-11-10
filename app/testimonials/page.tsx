import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, MessageSquareQuote, Sparkles, Star } from 'lucide-react';
import { TestimonialsClient } from './testimonials-client';
import {
  MotionSection,
  MotionItem,
  FadeIn,
} from '@/components/shared/section-animations';

export const metadata: Metadata = {
  title: 'Testimonials — Share your experience | MANTECH Nexus',
  description:
    'Tell the world what you think of MANTECH. Share your experience as an intern, university or organization — no account needed.',
};

export default function TestimonialsPage() {
  return (
    <>
      {/* ── Hero — dark image-backed with reduced opacity ────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800/60 py-20 text-white sm:py-28 bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('/images/about_tech_bg.jpg')" }}
        />
        {/* Primary dark overlay */}
        <div className="absolute inset-0 bg-slate-950/85" />

        {/* Ambient glow blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/8 blur-[140px]"
        />

        <MotionSection stagger={0.09} className="relative mx-auto max-w-3xl px-6 text-center">
          <MotionItem>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Stories from our community
            </span>
          </MotionItem>

          <MotionItem>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Every word here was sent by a{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                real person
              </span>
            </h1>
          </MotionItem>

          <MotionItem>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              No sample quotes, no invented names. If an experience appears on this page, a
              visitor wrote it and our team read it first.
            </p>
          </MotionItem>

          {/* Quick social proof stats */}
          <MotionItem>
            <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4">
              {[
                { label: 'Verified stories', value: '100+' },
                { label: 'Avg. rating', value: '4.8 ★' },
                { label: 'Regions covered', value: '10' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-700/60 bg-slate-900/70 px-5 py-3 backdrop-blur-xl"
                >
                  <div className="text-lg font-extrabold text-amber-400">{stat.value}</div>
                  <div className="text-[11px] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </MotionItem>

          <MotionItem>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {/* "Share Story" scrolls to the form — compact text only */}
              <a
                href="#share"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 font-bold text-white shadow-lg shadow-amber-900/30 transition-all hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-900/50"
              >
                <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
                Share Story
              </a>
              <Link
                href="/internships"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-900/70 px-6 font-semibold text-slate-200 backdrop-blur-sm transition-colors hover:border-slate-500 hover:bg-slate-800/80 hover:text-white"
              >
                Browse Internships
              </Link>
            </div>
          </MotionItem>

          <MotionItem>
            <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              We never publish your email address.
            </p>
          </MotionItem>
        </MotionSection>
      </section>

      {/* ── Form + Cards section ─ dark, no white anywhere ─────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden border-b border-slate-800/60 py-20"
        style={{ background: 'linear-gradient(180deg, #07090f 0%, #080c18 50%, #060810 100%)' }}
      >
        {/* Decorative ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-indigo-500/8 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-20 left-10 h-80 w-80 rounded-full bg-amber-500/8 blur-[120px]"
        />

        <div className="container-mantech relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <TestimonialsClient />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
