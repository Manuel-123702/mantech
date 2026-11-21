'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { playWhatsAppChime, NewOpportunityNotification } from '@/lib/notification-sound';

export function WhatsAppToastListener() {
  const [activeAlert, setActiveAlert] = useState<NewOpportunityNotification | null>(null);

  useEffect(() => {
    // Request notification permission smoothly on first user interaction
    const requestPerm = () => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
      window.removeEventListener('click', requestPerm);
    };
    window.addEventListener('click', requestPerm, { once: true });

    // Handle in-app custom event
    const handleNewOpp = (e: Event) => {
      const customEvent = e as CustomEvent<NewOpportunityNotification>;
      if (customEvent.detail) {
        setActiveAlert(customEvent.detail);
        setTimeout(() => setActiveAlert(null), 8000);
      }
    };
    window.addEventListener('mantech:new-opportunity', handleNewOpp);

    // Handle cross-tab BroadcastChannel
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('mantech_notifications');
        bc.onmessage = (event) => {
          if (event.data) {
            playWhatsAppChime();
            setActiveAlert(event.data);
            setTimeout(() => setActiveAlert(null), 8000);
          }
        };
      } catch {}
    }

    // Handle storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mantech_recent_post_broadcast' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          playWhatsAppChime();
          setActiveAlert(parsed);
          setTimeout(() => setActiveAlert(null), 8000);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('mantech:new-opportunity', handleNewOpp);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  if (!activeAlert) return null;

  const targetUrl = `/${activeAlert.type === 'internship' ? 'internships' : 'jobs'}/${activeAlert.slug}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-md"
      >
        <div className="rounded-2xl border border-emerald-500/50 bg-[#0b1b17]/95 p-3.5 shadow-2xl backdrop-blur-xl text-white flex items-start gap-3 shadow-emerald-950/80 ring-1 ring-emerald-500/30">
          {/* WhatsApp Brand Icon & Pulsing Dot */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          {/* Notification Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                MANTECH Alert • {activeAlert.type === 'internship' ? 'Stage' : 'Emploi'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">À l&apos;instant</span>
            </div>

            <p className="text-xs font-bold text-white truncate mt-0.5">
              {activeAlert.companyName}
            </p>
            <p className="text-[11px] text-slate-200 line-clamp-1">
              {activeAlert.title} — {activeAlert.city}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Link
                href={targetUrl}
                onClick={() => setActiveAlert(null)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition-colors bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg"
              >
                <span>Ouvrir l&apos;offre</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
