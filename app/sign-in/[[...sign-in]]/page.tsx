'use client';

import { useState, useEffect, Suspense } from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { ShieldCheck } from 'lucide-react';

export default function SignInPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/security_tech_bg.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex justify-center mb-5">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
            <Logo size={110} />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
          Enterprise Portal Sign In
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Authenticated, role-enforced access to Cameroon&apos;s National IT Internship Ecosystem
        </p>
      </div>

      <div className="mt-7 relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 py-8 px-5 sm:px-8 shadow-2xl rounded-3xl border border-slate-700/80 backdrop-blur-xl text-white">
          {mounted ? (
            <Suspense fallback={<div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">Loading your account...</div>}>
              <SignIn
                appearance={{
                  elements: {
                    rootBox: 'mx-auto',
                    card: 'bg-transparent shadow-none border-0',
                    headerTitle: 'text-white text-2xl font-bold',
                    headerSubtitle: 'text-slate-400 text-sm',
                    formFieldLabel: 'text-slate-300 text-xs font-semibold uppercase tracking-wider',
                    formFieldInput: 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30',
                    footerActionLink: 'text-cyan-400 hover:text-cyan-300 font-bold',
                  },
                }}
                fallbackRedirectUrl="/"
              />
            </Suspense>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-[11px] text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading secure sign-in portal...</span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Trust Enterprise Authentication & Session Protection</span>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/sign-up" className="font-bold text-cyan-400 hover:text-cyan-300">
              Register New Organization or Intern
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
