import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, MessageSquareQuote, Sparkles } from 'lucide-react';
import { TestimonialsClient } from './testimonials-client';
import { Button } from '@/components/ui/button';
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
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-slate-800/60 py-20 text-white sm:py-32"
        style={{
          backgroundImage: "url('/images/about_tech_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-slate-950/85"
        />

        {/* Ambient blur blobs */}
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[140px] pointer-events-none"
        />

        <MotionSection stagger={0.09} className="relative mx-auto max-w-3xl px-6 text-center">
          <MotionItem>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Stories from our community
            </span>
          </MotionItem>

          <MotionItem>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Every word here was{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                sent by a real person
              </span>
            </h1>
          </MotionItem>

          <MotionItem>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              No sample quotes, no invented names. If an experience appears on this page, a
              visitor wrote it and our team read it first.
            </p>
          </MotionItem>

          <MotionItem>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 bg-gradient-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white shadow-lg shadow-amber-900/30 hover:from-amber-400 hover:to-orange-400"
              >
                <Link href="#share">
                  <MessageSquareQuote className="mr-2 h-4 w-4" aria-hidden="true" />
                  Share Story
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-slate-600 bg-slate-800/60 px-6 font-semibold text-slate-200 backdrop-blur hover:bg-slate-700/60 hover:text-white"
              >
                <Link href="/internships">Browse Internships</Link>
              </Button>
            </div>
          </MotionItem>

          <MotionItem>
            <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              We never publish your email address.
            </p>
          </MotionItem>
        </MotionSection>
      </section>

      <section
        className="py-20 relative overflow-hidden border-b border-slate-800/60"
        style={{ background: 'linear-gradient(180deg, #080d1a 0%, #0a1220 50%, #070d18 100%)' }}
      >
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/8 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl mx-auto">
          {/* Form first, so the page opens with a way to contribute. */}
          <FadeIn>
            <TestimonialsClient />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
