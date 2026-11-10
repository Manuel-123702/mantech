'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Register Service Worker for PWA compliance & offline support
    if (
      'serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    ) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently catch registration errors in dev or restricted environments
      });
    }

    // 1. Check if already installed / running in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // 2. Check if dismissed recently (within 5 days)
    const lastDismissed = localStorage.getItem('mantech_pwa_dismissed');
    if (lastDismissed) {
      const diffDays = (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
      if (diffDays < 5) {
        return;
      }
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isAppleDevice && !/crios|fxios|opios|mercury/.test(userAgent);
    setIsIOS(isSafari);

    // 4. Capture Chrome / Edge / Android install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setDismissed(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If iOS Safari and not standalone, show prompt after 4 seconds
    let iosTimer: NodeJS.Timeout | null = null;
    if (isSafari && !standalone) {
      iosTimer = setTimeout(() => {
        setDismissed(false);
      }, 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('mantech_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:left-auto sm:right-6 sm:w-96"
      >
        <div className="flex items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-md">
            <Image
              src="/icons/icon-192.png"
              alt="MANTECH Nexus Icon"
              width={48}
              height={48}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Official Mobile App
              </span>
              <button
                onClick={handleDismiss}
                className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close install banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h4 className="text-sm font-bold text-white truncate">Install MANTECH Nexus</h4>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
              Faster access to internships, instant WhatsApp alerts & works offline.
            </p>
          </div>
        </div>

        {showIOSGuide ? (
          <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-200">
            <p className="font-semibold flex items-center gap-1.5 mb-1 text-amber-100">
              <Smartphone className="h-3.5 w-3.5" /> To install on iPhone:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>
                Tap the <Share className="inline h-3.5 w-3.5 text-cyan-400" /> Share button in Safari
              </li>
              <li>
                Scroll down and tap <PlusSquare className="inline h-3.5 w-3.5 text-emerald-400" />{' '}
                <strong>Add to Home Screen</strong>
              </li>
            </ol>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Later
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
