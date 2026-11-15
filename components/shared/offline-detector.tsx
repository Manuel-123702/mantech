'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true);
      setWasOffline(true);
    }

    function handleOnline() {
      setIsOffline(false);
      // Auto-hide the "Back online" confirmation after 3.5s
      const timer = setTimeout(() => {
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }

    if (typeof window !== 'undefined') {
      if (!navigator.onLine) {
        setIsOffline(true);
        setWasOffline(true);
      }
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !wasOffline) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw] sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
      {isOffline ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-rose-500/40 text-white shadow-2xl backdrop-blur-xl">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold text-rose-300">You are currently offline</p>
            <p className="text-[11px] text-slate-300 leading-tight">
              Live connection required to fetch jobs & sync applications.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 shadow-xl backdrop-blur-xl">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Wifi className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">Connection restored · MANTECH Nexus is live!</span>
        </div>
      )}
    </div>
  );
}
