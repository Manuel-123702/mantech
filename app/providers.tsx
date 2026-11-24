'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/lib/clerk';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { Toaster } from '@/components/ui/sonner';

// Dynamically load client widgets so they don't bloat or block the initial layout chunk
const WhatsAppToastListener = dynamic(
  () => import('@/components/shared/whatsapp-toast-listener').then((mod) => mod.WhatsAppToastListener),
  { ssr: false }
);
const WhatsAppFloat = dynamic(
  () => import('@/components/shared/whatsapp-float').then((mod) => mod.WhatsAppFloat),
  { ssr: false }
);
const ScrollToTop = dynamic(
  () => import('@/components/shared/scroll-to-top').then((mod) => mod.ScrollToTop),
  { ssr: false }
);
const PWAInstallPrompt = dynamic(
  () => import('@/components/shared/pwa-install-prompt').then((mod) => mod.PWAInstallPrompt),
  { ssr: false }
);
const OfflineDetector = dynamic(
  () => import('@/components/shared/offline-detector').then((mod) => mod.OfflineDetector),
  { ssr: false }
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoadingScreen />
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <WhatsAppToastListener />
      <WhatsAppFloat />
      <ScrollToTop />
      <PWAInstallPrompt />
      <OfflineDetector />
      <Toaster position="top-center" richColors closeButton />
    </AuthProvider>
  );
}
