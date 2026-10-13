'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
} from '@/lib/referral-codes';

/**
 * Invisible helper for the sign-up page: when someone arrives with a
 * /sign-up?ref=CODE link, remember the code in a first-party cookie so the
 * server can attribute the new account to the referrer the first time the
 * user record is created (see lib/authz.ts syncDbUser). Rendered inside a
 * Suspense boundary because useSearchParams() requires one.
 */
export function ReferralCapture() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    const code = ref?.trim();
    if (!code) return;
    document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(
      code,
    )}; max-age=${REFERRAL_COOKIE_MAX_AGE}; path=/; samesite=lax`;
  }, [ref]);

  return null;
}