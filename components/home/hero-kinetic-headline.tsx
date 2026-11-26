'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CAMEROON_TEXT = "CAMEROON'S";

export function HeroKineticHeadline() {
  // Pharmacy marquee loop:
  // Phase 'typing': letters reveal one by one with glowing light
  // Phase 'hold': full word displayed with blinking cursor '|'
  // Phase 'deleting': letters retract one by one
  // Phase 'pause': brief pause before looping again
  const [displayedCount, setDisplayedCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting' | 'pause'>('typing');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      if (displayedCount < CAMEROON_TEXT.length) {
        timer = setTimeout(() => {
          setDisplayedCount((prev) => prev + 1);
        }, 130); // 130ms per letter typing
      } else {
        // Full word typed out: hold for 2.2 seconds with blinking '|'
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
        }, 75); // 75ms per letter retracting
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
        {/* ── WORD 1: CAMEROON'S (Fixed-Width Pharmacy Marquee Band) ── */}
        {/* Fixed min-width and width reservation prevents "Enterprise" or any following word from shifting! */}
        <span className="inline-flex items-center justify-between whitespace-nowrap relative py-1 px-2.5 rounded-2xl bg-slate-900/85 border border-emerald-500/35 shadow-[0_0_22px_rgba(16,185,129,0.2)] w-[215px] sm:w-[245px] md:w-[285px] lg:w-[325px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] shrink-0 overflow-hidden">
          {/* Subtle neon ambient under-glow */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 pointer-events-none blur-sm" />

          {/* Letter container with slightly smaller, compact font size */}
          <span className="relative flex items-center font-mono tracking-wider text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {currentLetters.map((char, index) => {
              const isLastTyped = index === currentLetters.length - 1;

              return (
                <span
                  key={`cameroon-letter-${index}`}
                  className="relative inline-flex items-center justify-center min-w-[0.62em]"
                >
                  {/* Glowing light halo rounding around each letter */}
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: isLastTyped ? [1, 1.4, 1.1] : 1,
                      opacity: isLastTyped ? [0.4, 0.9, 0.4] : 0.25,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute -inset-1 rounded-full bg-emerald-400/25 blur-[3px] pointer-events-none"
                  />

                  {/* Individual letter with LED luminous glow */}
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

            {/* Glowing vertical cursor "|" that blinks continuously */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 0.65,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block font-mono font-black text-emerald-400 text-2xl sm:text-3xl md:text-4xl ml-1 leading-none drop-shadow-[0_0_12px_rgba(52,211,153,1)] select-none"
            >
              |
            </motion.span>
          </span>

          {/* Sparkle emblem that shines when full word is displayed */}
          <span className="w-5 h-5 flex items-center justify-center shrink-0">
            <AnimatePresence>
              {isFullWord && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="inline-flex items-center text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.95)]"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </span>

        {/* ── REMAINING TITLE WORDS (100% Fixed in Place, Never Shifted) ── */}
        <span className="whitespace-nowrap bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(6,182,212,0.4)]">
          Enterprise
        </span>

        <span className="whitespace-nowrap bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(245,158,11,0.4)]">
          Jobs &amp; Internships
        </span>

        <span className="whitespace-nowrap bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(129,140,248,0.5)]">
          Marketplace
        </span>
      </h1>

      {/* Elegant luminous accent line below */}
      <div className="mt-3.5 h-[2px] w-full max-w-xl bg-gradient-to-r from-emerald-400 via-cyan-400 via-amber-400 to-transparent rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
    </div>
  );
}
