'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Database, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isDatabaseUnavailable } from '@/lib/db-health';

/**
 * Shown when a page in the intern area cannot be opened.
 *
 * A site that is temporarily down is an expected situation, not a mistake, so
 * we offer a Try again button instead of showing a scary error. Any other
 * problem gets a short, friendly message — we never show technical details to
 * visitors.
 */
export default function InternDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const siteUnreachable = isDatabaseUnavailable(error);

  useEffect(() => {
    if (siteUnreachable) return;
    // Safe to record: this message is already short and free of details.
    console.error('[intern dashboard] could not load this section', error.message);
  }, [siteUnreachable, error]);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
      <Database className="mx-auto h-10 w-10 text-amber-600" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-bold text-slate-900">
        {siteUnreachable
          ? 'We cannot open this just now'
          : 'Something did not load properly'}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {siteUnreachable
          ? 'We could not reach your account right now. This is usually temporary. Please try again in a moment.'
          : 'This part of the page did not load. Please try again, and if it keeps happening let us know and we will help.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="bg-blue-600 text-white hover:bg-blue-700">
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
        <Link href="/internships">
          <Button variant="outline">Browse internships instead</Button>
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
        >
          <LifeBuoy className="h-4 w-4" aria-hidden="true" />
          Contact support
        </Link>
      </div>
    </div>
  );
}