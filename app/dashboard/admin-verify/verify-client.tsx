'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OTPInput } from 'input-otp';
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

type Status = 'sending' | 'ready' | 'verifying' | 'success' | 'failed';

function countdownLabel(total: number): string {
  const seconds = Math.max(0, total);
  return `0:${String(seconds).padStart(2, '0')}`;
}

/**
 * Branded second-factor screen: auto-sends a fresh 6-digit code on mount,
 * shows a live 60-second expiry countdown, enforces the 3-attempt budget
 * (server-side), and lands the admin in the dashboard on success.
 */
export function VerifyAdminOtpClient({ next }: { next: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('sending');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [masked, setMasked] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const autoSendDone = useRef(false);

  const requestCode = useCallback(async () => {
    setError(null);
    setDevCode(null);
    setHint(null);
    setStatus('sending');
    try {
      const res = await fetch('/api/auth/admin-otp/request', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        setupHint?: string;
        maskedDestination?: string;
        expiresInSeconds?: number;
        devCode?: string;
      };
      if (!res.ok) {
        setStatus('failed');
        setError(data.error || 'Could not send the code.');
        setHint(data.setupHint || null);
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

  // 1-second countdown while a code is live.
  useEffect(() => {
    if (status !== 'ready' || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, secondsLeft]);

  const verify = useCallback(
    async (value: string) => {
      if (value.length !== 6 || status === 'verifying' || status === 'success') return;
      setStatus('verifying');
      setError(null);
      try {
        const res = await fetch('/api/auth/admin-otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: value, next }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          redirect?: string;
          error?: string;
          code?: string;
          attemptsLeft?: number;
        };
        if (res.ok && data.ok) {
          setStatus('success');
          setTimeout(() => router.replace(data.redirect || next), 700);
          return;
        }
        setStatus('ready');
        setError(data.error || 'Verification failed.');
        if (typeof data.attemptsLeft === 'number') setAttemptsLeft(data.attemptsLeft);
        if (
          data.code === 'expired' ||
          data.code === 'not_found' ||
          data.code === 'too_many_attempts'
        ) {
          setSecondsLeft(0); // allow an immediate resend
        }
        setCode('');
        setShakeKey((key) => key + 1);
      } catch {
        setStatus('ready');
        setError('Network error. Please try again.');
        setShakeKey((key) => key + 1);
      }
    },
    [next, router, status],
  );

  const resendEnabled = status === 'ready' && secondsLeft <= 0;
  const busy = status === 'sending' || status === 'verifying';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)]"
        >
          {/* Brand mark */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
              <ShieldCheck className="h-7 w-7" aria-hidden />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              MANTECH Nexus · Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Two-factor verification
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the 6-digit code we sent
              {masked ? (
                <>
                  {' '}
                  to WhatsApp <span className="font-semibold text-slate-700">{masked}</span>
                </>
              ) : (
                ' to your WhatsApp'
              )}
              .
            </p>
          </div>

          {/* Status pills */}
          <div className="mb-6 flex items-center justify-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${
                secondsLeft > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <RefreshCw className="h-3 w-3" aria-hidden />
              {secondsLeft > 0 ? `Expires in ${countdownLabel(secondsLeft)}` : 'Code expired'}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
                attemptsLeft > 1 ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} left
            </span>
          </div>

          {/* OTP input */}
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [0, -10, 10, -8, 8, 0] } : undefined}
            transition={{ duration: 0.4 }}
            className={busy || status !== 'ready' ? 'opacity-70' : undefined}
          >
            <OTPInput
              maxLength={6}
              value={code}
              onChange={(value: string) => {
                setCode(value);
                if (error) setError(null);
              }}
              onComplete={(value: string) => void verify(value)}
              disabled={busy || status !== 'ready'}
              containerClassName="flex items-center justify-center"
              render={({ slots }) => (
                <div className="flex items-center justify-center gap-2">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex h-12 w-11 items-center justify-center rounded-xl border-2 text-xl font-semibold text-slate-900 transition ${
                        slot.isActive
                          ? 'border-blue-500 bg-white shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      {slot.char ?? ''}
                      {slot.hasFakeCaret ? (
                        <span
                          className="ml-px h-5 w-px animate-pulse bg-blue-500"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            />
          </motion.div>

          {/* Error / hint */}
          {error ? (
            <p className="mt-4 text-center text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {status === 'sending' ? (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending the code to your WhatsApp…
            </p>
          ) : null}

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-emerald-800">
                Verified — opening your dashboard…
              </p>
            </motion.div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void verify(code)}
                disabled={code.length !== 6 || busy || status !== 'ready'}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'verifying' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Verifying…
                  </>
                ) : (
                  'Verify and continue'
                )}
              </button>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden /> WhatsApp delivery
                </span>
                <button
                  type="button"
                  onClick={() => void requestCode()}
                  disabled={status === 'sending' || (!resendEnabled && status !== 'failed')}
                  className="font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400"
                >
                  {status === 'failed'
                    ? 'Try again'
                    : resendEnabled
                      ? 'Send a new code'
                      : `Resend in ${countdownLabel(secondsLeft)}`}
                </button>
              </div>
            </>
          )}

          {/* Development shortcut when no WhatsApp gateway is wired up yet */}
          {devCode && status !== 'success' ? (
            <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Development mode
              </p>
              <p className="mt-1 text-xs text-amber-800">
                No WhatsApp gateway is configured, so the code is shown here instead:
              </p>
              <p className="mt-2 text-center font-mono text-3xl font-bold tracking-[0.4em] text-amber-900">
                {devCode}
              </p>
            </div>
          ) : null}

          {/* Operator guidance when delivery cannot be configured at all */}
          {hint ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldAlert className="h-4 w-4 text-amber-500" aria-hidden /> Gateway setup
                required
              </p>
              <p className="mt-1 text-xs text-slate-500">{hint}</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-emerald-300">
{`# Options - add ADMIN_WHATSAPP=<number> to .env too\n  1. Free, instant, no Meta approval:\n     WHATSAPP_API_URL=https://api.callmebot.com/whatsapp.php?apikey=YOUR_KEY\n  2. Official Meta Cloud API:\n     WHATSAPP_API_URL=https://graph.facebook.com/v21.0/<PHONE_ID>/messages\n     WHATSAPP_API_TOKEN=your_meta_token`}
              </pre>
            </div>
          ) : null}
        </motion.div>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to MANTECH Nexus
          </Link>
        </div>
      </div>
    </div>
  );
}

