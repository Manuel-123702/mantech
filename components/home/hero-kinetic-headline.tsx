'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Briefcase } from 'lucide-react';

const CAMEROON_TEXT = "CAMEROON'S";

export function HeroKineticHeadline() {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting' | 'pause'>('typing');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      if (displayedCount < CAMEROON_TEXT.length) {
        timer = setTimeout(() => {
          setDisplayedCount((prev) => prev + 1);
        }, 130);
      } else {
        timer = setTimeout(() => {
          setPhase('hold');
        }, 100);
      }
    } else if (phase === 'hold') {
      timer = setTimeout(() => {
        setPhase('deleting');
      }, 2200);
    } else if (phase === 'deleting') {
      if (displayedCount > 0) {
        timer = setTimeout(() => {
          setDisplayedCount((prev) => prev - 1);
        }, 75);
      } else {
        timer = setTimeout(() => {
          setPhase('pause');
        }, 300);
      }
    } else if (phase === 'pause') {
      timer = setTimeout(() => {
        setPhase('typing');
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [displayedCount, phase]);

  const currentLetters = Array.from(CAMEROON_TEXT.slice(0, displayedCount));
  const isFullWord = displayedCount === CAMEROON_TEXT.length;

  return (
    <div className="relative group inline-block select-none">
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.18] tracking-tight flex flex-wrap items-baseline gap-x-3 gap-y-2">
        {/* ── WORD 1: CAMEROON'S (Snug-Fit Pharmacy Marquee Band) ── */}
        <span className="inline-flex items-center whitespace-nowrap relative px-2 sm:px-2.5 py-0.5 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-emerald-500/35 shadow-[0_0_20px_rgba(16,185,129,0.22)] w-[190px] sm:w-[225px] md:w-[270px] lg:w-[318px] h-[40px] sm:h-[46px] md:h-[54px] lg:h-[62px] shrink-0 overflow-hidden">
          <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 pointer-events-none blur-sm" />

          <span className="relative flex items-center font-mono tracking-tight text-[1.4rem] sm:text-[1.75rem] md:text-[2.2rem] lg:text-[2.65rem] leading-none">
            {currentLetters.map((char, index) => {
              const isLastTyped = index === currentLetters.length - 1;

              return (
                <span
                  key={`cameroon-letter-${index}`}
                  className="relative inline-flex items-center justify-center min-w-[0.58em]"
                >
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: isLastTyped ? [1, 1.35, 1.05] : 1,
                      opacity: isLastTyped ? [0.4, 0.9, 0.4] : 0.25,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute -inset-0.5 rounded-full bg-emerald-400/25 blur-[3px] pointer-events-none"
                  />

                  <motion.span
                    initial={{ y: -4, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 4, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12 }}
                    className={`relative z-10 font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-200 to-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.85)] ${
                      char === "'" ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)]' : ''
                    }`}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}

            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 0.65,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block font-mono font-black text-emerald-400 text-[1.3rem] sm:text-[1.65rem] md:text-[2.1rem] lg:text-[2.5rem] leading-none drop-shadow-[0_0_12px_rgba(52,211,153,1)] select-none ml-0.5"
            >
              |
            </motion.span>

            <AnimatePresence>
              {isFullWord && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="inline-flex items-center text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.95)] ml-1"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </span>

        {/* ── WORD 2: ENTERPRISE (Static, Clean) ── */}
        <span className="whitespace-nowrap bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(6,182,212,0.4)]">
          Enterprise
        </span>

        {/* ── WORD 3: JOBS & INTERNSHIPS (Dynamic Holographic Aurora Shimmer + Pulse Wave Motion) ── */}
        <span className="relative inline-flex items-center whitespace-nowrap group/jobs cursor-pointer">
          {/* Outer Breathing Aurora Halo */}
          <motion.span
            animate={{
              opacity: [0.3, 0.65, 0.3],
              scale: [0.97, 1.02, 0.97],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-yellow-400/20 blur-md pointer-events-none"
          />

          {/* Glowing Badge Capsule Container (Compact & Refined) */}
          <span className="relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-orange-950/70 border border-amber-500/35 shadow-[0_0_18px_rgba(245,158,11,0.2)] overflow-hidden">
            {/* Luminous Laser Sweep Wave */}
            <motion.span
              animate={{
                x: ['-140%', '240%'],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-y-0 w-20 -skew-x-20 bg-gradient-to-r from-transparent via-amber-200/40 via-white/50 to-transparent pointer-events-none mix-blend-overlay z-20"
            />

            {/* Glowing Golden Flame Icon */}
            <motion.span
              animate={{
                scale: [1, 1.18, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-flex items-center text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
            </motion.span>

            {/* Scaled-down text font */}
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #fef08a, #f59e0b, #fbbf24, #f97316, #fef08a)',
                backgroundSize: '250% 100%',
              }}
              className="bg-clip-text text-transparent font-black text-[0.88em] leading-tight drop-shadow-[0_0_16px_rgba(245,158,11,0.55)]"
            >
              Jobs &amp; Internships
            </motion.span>

            {/* Micro Live Sparkle */}
            <motion.span
              animate={{
                opacity: [0, 1, 0],
                scale: [0.6, 1.2, 0.6],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
              className="inline-flex text-yellow-300 drop-shadow-[0_0_8px_rgba(254,240,138,1)]"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-300" />
            </motion.span>
          </span>
        </span>

        {/* ── WORD 4: MARKETPLACE (Static, Clean) ── */}
        <span className="whitespace-nowrap bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(129,140,248,0.5)]">
          Marketplace
        </span>
      </h1>

      {/* Elegant luminous accent line below */}
      <div className="mt-3.5 h-[2px] w-full max-w-xl bg-gradient-to-r from-emerald-400 via-cyan-400 via-amber-400 to-transparent rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
    </div>
  );
}
