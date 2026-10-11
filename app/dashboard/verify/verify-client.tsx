'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OTPInput } from 'input-otp';
import { ArrowLeft, Loader2, Mail, ShieldAlert, Building2, GraduationCap } from 'lucide-react';

type Status = 'sending' | 'ready' | 'verifying' | 'success' | 'failed';

function countdownLabel(total: number): string {
  return `0:${String(Math.max(0, total)).padStart(2, '0')}`;
}

const COPY = {
  company: {
    title: 'Verify to open the Company workspace',
    blurb: 'For your security we sent a 6-digit code to your email. Enter it to continue.',
    Icon: Building2,
  },
  university: {
    title: 'Verify to open the University workspace',
    blurb: 'For your security we sent a 6-digit code to your email. Enter it to continue.',
    Icon: GraduationCap,
  },
};

export function VerifyWorkspaceOtpClient({ next, area }: { next: string; area: 'company' | 'university' }) {
  const router = useRouter();
  const copy = COPY[area];
  const [status, setStatus] = useState<Status>('sending');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [masked, setMasked] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const autoSendDone = useRef(false);

  const requestCode = useCallback(async () => {
    setError(null);
    setDevCode(null);
    setStatus('sending');
    try {
      const res = await fetch('/api/auth/workspace-otp/request', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('failed');
        setError(data.error || 'Could not send the code.');
        return;
      }
      setMasked(data.maskedDestination || null);
      setDevCode(data.devCode || null);
      setAttemptsLeft(3);
      setCode('');
      setSecondsLeft(data.expiresInSeconds || 60);
      setStatus('ready');
    } catch {
      setStatus('failed');
      setError('Network error. Check your connection and try again.');
    }
  }, []);

  useEffect(() => {
    if (autoSendDone.current) return;
    autoSendDone.current = true;
    void requestCode();
  }, [requestCode]);

  useEffect(() => {
    if (status !== 'ready' || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, secondsLeft]);

  const verify = useCallback(
    async (value: string) => {
      if (value.length !== 6 || status === 'verifying' || status === 'success') return;
      setStatus('verifying');
      setError(null);
      try {
        const res = await fetch('/api/auth/workspace-otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: value, next }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          setStatus('ready');
          setError(data.error || 'Verification failed.');
          if (typeof data.attemptsLeft === 'number') setAttemptsLeft(data.attemptsLeft);
          if (data.code === 'too_many_attempts' || data.code === 'expired') setCode('');
          return;
        }
        setStatus('success');
        setCode('');
        setTimeout(() => {
          router.replace(data.redirect || next);
          router.refresh();
        }, 500);
      } catch {
        setStatus('ready');
        setError('Network error. Please try again.');
      }
    },
    [next, router, status],
  );

  const resendEnabled = secondsLeft <= 0 || status === 'failed';
  const busy = status === 'sending' || status === 'verifying' || status === 'success';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <copy.Icon className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-5 text-xl font-bold text-slate-900">{copy.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{copy.blurb}</p>
        </div>

        {status === 'sending' ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending your code...
          </div>
        ) : status === 'success' ? (
          <div className="mt-8 flex flex-col items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            Verified - opening your workspace...
          </div>
        ) : (
          <>
            {masked ? (
              <p className="mt-6 text-center text-sm text-slate-600">
                Code sent to <span className="font-semibold text-slate-900">{masked}</span>
              </p>
            ) : null}

            <div className="mt-6 flex justify-center">
              <OTPInput
                value={code}
                onChange={setCode}
                onComplete={verify}
                maxLength={6}
                disabled={busy}
                containerClassName="flex items-center gap-2"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className={`flex h-12 w-10 items-center justify-center rounded-lg border text-lg font-bold text-slate-900 ${
                          slot.isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-300'
                        }`}
                      >
                        {slot.char ?? (slot.hasFakeCaret ? <span className="animate-pulse">|</span> : null)}
                      </div>
                    ))}
                  </>
                )}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs">
              <span className={secondsLeft > 0 ? 'text-slate-500' : 'font-semibold text-amber-600'}>
                {secondsLeft > 0 ? `Expires in ${countdownLabel(secondsLeft)}` : 'Code expired'}
              </span>
              <span className="text-slate-400">-</span>
              <span className="text-slate-500">{attemptsLeft} attempts left</span>
            </div>

            {error ? <p className="mt-4 text-center text-sm font-medium text-red-600">{error}</p> : null}

            <button
              type="button"
              onClick={() => void verify(code)}
              disabled={code.length !== 6 || busy || status !== 'ready'}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === 'verifying' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Verifying...
                </>
              ) : (
                'Verify and continue'
              )}
            </button>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Mail className="h-3.5 w-3.5" aria-hidden /> Email delivery
              </span>
              <button
                type="button"
                onClick={() => void requestCode()}
                disabled={status === 'verifying'}
                className="font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400"
              >
                {status === 'failed' ? 'Try again' : resendEnabled ? 'Send a new code' : `Resend in ${countdownLabel(secondsLeft)}`}
              </button>
            </div>

            {devCode ? (
              <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Development mode</p>
                <p className="mt-1 text-xs text-amber-800">No email gateway configured, so the code is shown here instead:</p>
                <p className="mt-2 text-center font-mono text-3xl font-bold tracking-[0.4em] text-amber-900">{devCode}</p>
              </div>
            ) : null}

            {status === 'failed' && !devCode ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldAlert className="h-4 w-4 text-amber-500" aria-hidden /> Email setup required
                </p>
                <p className="mt-1 text-xs text-slate-500">Add EmailJS to .env so the code can be delivered to your sign-in inbox.</p>
              </div>
            ) : null}
          </>
        )}

        <div className="mt-6 flex items-center justify-center">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-600">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to dashboards
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
