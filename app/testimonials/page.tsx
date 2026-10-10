import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, MessageSquareQuote, Sparkles } from 'lucide-react';
import { TestimonialsClient } from './testimonials-client';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Testimonials — Share your experience | MANTECH Nexus',
  description:
    'Tell the world what you think of MANTECH. Share your experience as an intern, university or organization — no account needed.',
};

export default function TestimonialsPage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 py-16 text-white sm:py-24">
        {/* Soft background shapes, purely decorative. */}
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Stories from our community
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Every word here was sent by a real person
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
            No sample quotes, no invented names. If an experience appears on this page, a
            visitor wrote it and our team read it first.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-6 font-semibold text-blue-700 hover:bg-blue-50"
            >
              <Link href="#share">
                <MessageSquareQuote className="mr-2 h-4 w-4" aria-hidden="true" />
                Share your experience
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-transparent px-6 font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/internships">Browse internships</Link>
            </Button>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-blue-100/80">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            We never publish your email address.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Form first, so the page opens with a way to contribute. */}
        <TestimonialsClient />
      </div>
    </>
  );
}
