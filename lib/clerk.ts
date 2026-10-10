'use client';

import * as React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

type Props = {
  children: React.ReactNode;
};

/**
 * Thin client boundary around Clerk's own provider.
 *
 * This file MUST carry 'use client'. ClerkProvider is a client component that
 * depends on React context; rendering it from a server component breaks Clerk's
 * server render, so mounted components like <SignIn /> emit no markup during SSR
 * and only appear after hydration — which React reports as a hydration mismatch.
 *
 * React.createElement is used instead of JSX because this file is a .ts module
 * (JSX is only permitted in .tsx).
 */
export function AuthProvider({ children }: Props) {
  return React.createElement(ClerkProvider, null, children);
}
