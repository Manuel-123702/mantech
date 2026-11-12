'use client';
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';


import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { ShieldCheck, Server, Database, Globe, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

const BOOT_STAGES = [
  { text: msg({ message: 'Initializing Zero-Trust Security Perimeter...', comment: 'Loading screen status while security services initialize' }), icon: ShieldCheck, detail: msg({ message: 'AES-256 GCM Tunnel', comment: 'Technical detail paired with the security initialization status' }) },
  { text: msg({ message: 'Connecting to Cameroon National IT Database...', comment: 'Loading screen status while the platform database connects' }), icon: Database, detail: msg({ message: 'PostgreSQL Relational Core', comment: 'Technical detail paired with the database connection status' }) },
  { text: msg({ message: 'Verifying Role-Based Access Matrices...', comment: 'Loading screen status while access permissions are checked' }), icon: Server, detail: msg({ message: 'Server-Enforced RBAC', comment: 'Technical detail paired with the access verification status' }) },
  { text: msg({ message: 'Synchronizing Enterprise Opportunities...', comment: 'Loading screen status while opportunities synchronize' }), icon: Globe, detail: msg({ message: 'Douala • Yaoundé • Buea', comment: 'Cities named in the loading screen synchronization status' }) },
  { text: msg({ message: 'MANTECH Nexus Online & Protected.', comment: 'Final status shown when the loading sequence completes' }), icon: CheckCircle2, detail: msg({ message: '100% Operational', comment: 'Technical completion status at the end of the loading sequence' }) },
];

export function LoadingScreen({ onComplete, minDuration = 2600 }: LoadingScreenProps) {
  const { t } = useLingui();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Check if user already saw the loader in this session to avoid annoyance
    const hasSeenLoader = sessionStorage.getItem('mantech_seen_loader');
    if (hasSeenLoader) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(pct);

      const nextStage = Math.min(
        Math.floor((pct / 100) * BOOT_STAGES.length),
        BOOT_STAGES.length - 1
      );
      setStageIndex(nextStage);

      if (elapsed >= minDuration) {
        clearInterval(progressInterval);
        sessionStorage.setItem('mantech_seen_loader', 'true');
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 400);
      }
    }, 25);

    return () => clearInterval(progressInterval);
  }, [minDuration, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('mantech_seen_loader', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const currentStage = BOOT_STAGES[stageIndex];
  const StageIcon = currentStage.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-950 text-white overflow-hidden select-none"
      >
        {/* Background Video Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 filter brightness-50 contrast-125"
          >
            <source src="/videos/loading-video.mp4" type="video/mp4" />
          </video>

          {/* Deep dark gradient overlay with cyan/blue accents */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent" />
        </div>

        {/* Top Bar: Telemetry Signals */}
        <div className="relative z-10 w-full max-w-5xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-mono uppercase tracking-wider text-[11px] text-slate-300 font-semibold">
              <Trans comment="loading-screen span visible text">MANTECH Nexus // National Core
            </Trans></span>
          </div>

          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-all backdrop-blur-md flex items-center gap-1.5"
          >
            <span><Trans comment="loading-screen span visible text">Skip to Platform</Trans></span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Brand and Enterprise Boot Experience */}
        <div className="relative z-10 flex flex-col items-center max-w-xl w-full text-center space-y-7">
          {/* Glowing MANTECH Logo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-2xl animate-pulse" />
            <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <Logo size={120} />
            </div>
          </motion.div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
              <Trans comment="loading-screen h1 visible text">MANTECH Nexus
            </Trans></h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal tracking-wide">
              <Trans comment="loading-screen p visible text">Cameroon&apos;s National Enterprise Internship Management Platform
            </Trans></p>
          </div>

          {/* Live System Diagnostics Box */}
          <div className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl text-left space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-cyan-400 font-mono">
                <StageIcon className="w-4 h-4 animate-spin-slow" />
                <span className="font-semibold">{t(currentStage.detail)}</span>
              </div>
              <span className="font-mono text-slate-300 font-bold text-sm">
                {Math.round(progress)}{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"%"}</span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Current Boot Step Text */}
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-mono truncate">{t(currentStage.text)}</span>
              <span className="text-slate-400 shrink-0 ml-2 font-mono">
                <Trans comment="loading-screen span visible text">Stage </Trans>{stageIndex + 1}{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"/"}{BOOT_STAGES.length}
              </span>
            </div>
          </div>

          {/* Live Ecosystem Metric Chips */}
          <div className="grid grid-cols-3 gap-2.5 w-full pt-1">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-bold text-white font-mono">{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"120+"}</div>
              <div className="text-[10px] text-slate-400 font-medium"><Trans comment="loading-screen div visible text">Partner Companies</Trans></div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-bold text-cyan-400 font-mono">{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"40+"}</div>
              <div className="text-[10px] text-slate-400 font-medium"><Trans comment="loading-screen div visible text">Universities</Trans></div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono"><Trans comment="loading-screen div visible text">10 Regions</Trans></div>
              <div className="text-[10px] text-slate-400 font-medium"><Trans comment="loading-screen div visible text">National Coverage</Trans></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Security & Compliance Guarantee */}
        <div className="relative z-10 w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 border-t border-white/10 pt-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span><Trans comment="loading-screen span visible text">Zero-Trust RBAC</Trans></span>
            </span>
            <span className="hidden sm:inline text-slate-600">{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"•"}</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span><Trans comment="loading-screen span visible text">ACID Database Persistence</Trans></span>
            </span>
          </div>

          <div className="text-slate-400 text-[10px]">
            <Trans comment="loading-screen div visible text">Protected by Cameroon Cybersecurity & Data Privacy Standards
          </Trans></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
