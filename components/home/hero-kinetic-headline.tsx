'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

interface WordConfig {
  id: string;
  text: string;
  className: string;
  glowColor: string;
  accentColor: string;
  hasSparkle?: boolean;
}

const WORDS: WordConfig[] = [
  {
    id: 'cameroon',
    text: "Cameroon's",
    className:
      'text-white drop-shadow-[0_2px_24px_rgba(255,255,255,0.55)]',
    glowColor: 'rgba(255,255,255,0.8)',
    accentColor: '#ffffff',
    hasSparkle: true,
  },
  {
    id: 'enterprise',
    text: 'Enterprise',
    className:
      'bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.7)]',
    glowColor: 'rgba(6,182,212,0.85)',
    accentColor: '#22d3ee',
  },
  {
    id: 'internship',
    text: 'Internship',
    className:
      'bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.7)]',
    glowColor: 'rgba(245,158,11,0.85)',
    accentColor: '#fbbf24',
  },
  {
    id: 'marketplace',
    text: 'Marketplace',
    className:
      'bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(129,140,248,0.8)]',
    glowColor: 'rgba(129,140,248,0.9)',
    accentColor: '#818cf8',
  },
];

export function HeroKineticHeadline() {
  const [animationCycle, setAnimationCycle] = useState(0);

  const replay = () => {
    setAnimationCycle((prev) => prev + 1);
  };

  // Dedicated letter-by-letter timing for Cameroon's:
  // Starts at 0.15s, paces 110ms per character so each letter visibly lands in rhythm!
  const CAMEROON_LETTERS = Array.from("Cameroon's");
  const CAMEROON_CHAR_INTERVAL = 0.11; // 110ms per letter
  const CAMEROON_START_DELAY = 0.15;
  const CAMEROON_FINISH_TIME = CAMEROON_START_DELAY + CAMEROON_LETTERS.length * CAMEROON_CHAR_INTERVAL; // ~1.25s

  return (
    <div className="relative group inline-block select-none" key={animationCycle}>
      {/* Living Ethereal Laser Light Sweep across the headline */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-150%', opacity: 0 }}
        animate={{
          x: ['-150%', '260%'],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          delay: CAMEROON_FINISH_TIME + 2.2,
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 6,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-y-0 w-36 -skew-x-25 bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent pointer-events-none mix-blend-screen z-20"
      />

      <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.12] tracking-tight flex flex-wrap items-baseline gap-x-3 gap-y-2">
        {/* ── WORD 1: CAMEROON'S (Letter by Letter Kinetic Sequence) ── */}
        <span className="inline-flex items-baseline whitespace-nowrap relative">
          {CAMEROON_LETTERS.map((char, charIdx) => {
            const letterDelay = CAMEROON_START_DELAY + charIdx * CAMEROON_CHAR_INTERVAL;
            const isApostrophe = char === "'";

            return (
              <motion.span
                key={`cameroon-${charIdx}`}
                className="relative inline-block cursor-pointer"
                initial={{
                  opacity: 0,
                  y: -32,
                  scale: 1.45,
                  rotateX: -80,
                  filter: 'blur(8px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  filter: 'blur(0px)',
                }}
                transition={{
                  delay: letterDelay,
                  duration: 0.42,
                  type: 'spring',
                  stiffness: 280,
                  damping: 18,
                }}
                whileHover={{
                  y: -9,
                  scale: 1.28,
                  rotateZ: charIdx % 2 === 0 ? 5 : -5,
                  transition: { type: 'spring', stiffness: 500, damping: 14 },
                }}
              >
                {/* Visual kinetic stamp / spark flash when letter drops into place */}
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.2, 2.2, 2.8],
                  }}
                  transition={{
                    delay: letterDelay + 0.05,
                    duration: 0.38,
                    times: [0, 0.3, 1],
                  }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full pointer-events-none blur-[1.5px] bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-200"
                />

                {/* The actual letter */}
                <span
                  className={`text-white drop-shadow-[0_2px_24px_rgba(255,255,255,0.6)] ${
                    isApostrophe ? 'mx-0.5 text-amber-300 font-serif' : ''
                  }`}
                >
                  {char}
                </span>
              </motion.span>
            );
          })}

          {/* Glowing neon cursor that pulses during typing and fades after completion */}
          <motion.span
            initial={{ opacity: 1 }}
            animate={{
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Math.ceil(CAMEROON_FINISH_TIME / 0.5),
              ease: 'linear',
            }}
            className="inline-block w-1 h-7 sm:h-9 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] ml-1 self-center rounded-sm"
            style={{
              animation: `fade-out 0.3s forwards ${CAMEROON_FINISH_TIME + 0.3}s`,
            }}
          />

          {/* Cameroon Star Emblem pop-in after typing finishes */}
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: CAMEROON_FINISH_TIME + 0.15,
              type: 'spring',
              stiffness: 350,
              damping: 15,
            }}
            className="ml-1.5 inline-flex items-center self-start"
          >
            <motion.span
              animate={{
                rotate: [0, 18, -18, 0],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]"
              title="Cameroon Verified Prestige"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-400/90" />
            </motion.span>
          </motion.span>

          <span className="inline-block w-2 sm:w-3" />
        </span>

        {/* ── WORDS 2, 3, 4: ENTERPRISE, INTERNSHIP, MARKETPLACE ── */}
        {WORDS.slice(1).map((word, wIdx) => {
          // Word reveals cascade right after Cameroon's completes
          const wordBaseDelay = CAMEROON_FINISH_TIME + 0.35 + wIdx * 0.45;
          const letters = Array.from(word.text);

          return (
            <span
              key={word.id}
              className="inline-flex items-baseline whitespace-nowrap relative"
            >
              {letters.map((char, charIdx) => {
                const charDelay = wordBaseDelay + charIdx * 0.035;

                return (
                  <motion.span
                    key={`${word.id}-${charIdx}`}
                    className="relative inline-block cursor-pointer"
                    initial={{
                      opacity: 0,
                      y: 35,
                      rotateX: -90,
                      scale: 0.4,
                      filter: 'blur(8px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      delay: charDelay,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      y: -9,
                      scale: 1.24,
                      rotateZ: charIdx % 2 === 0 ? 5 : -5,
                      transition: { type: 'spring', stiffness: 500, damping: 14 },
                    }}
                  >
                    {/* Micro landing aura */}
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.9, 0],
                        scale: [0.3, 1.8, 2.4],
                      }}
                      transition={{
                        delay: charDelay + 0.1,
                        duration: 0.4,
                        times: [0, 0.3, 1],
                      }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full pointer-events-none blur-[1px]"
                      style={{ backgroundColor: word.accentColor }}
                    />

                    <span className={word.className}>{char}</span>
                  </motion.span>
                );
              })}

              {wIdx < WORDS.slice(1).length - 1 && (
                <span className="inline-block w-2 sm:w-3" />
              )}
            </span>
          );
        })}
      </h1>

      {/* Kinetic Energy Underline Beam that expands once headline is assembled */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          delay: CAMEROON_FINISH_TIME + 1.2,
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="origin-left mt-3.5 h-[2.5px] w-full max-w-xl bg-gradient-to-r from-transparent via-cyan-400 via-amber-400 to-violet-500 rounded-full relative overflow-hidden shadow-[0_0_14px_rgba(6,182,212,0.7)]"
      >
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </motion.div>

      {/* Interactive replay button */}
      <button
        onClick={replay}
        type="button"
        title="Click to replay headline animation"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-cyan-300 cursor-pointer"
      >
        <RefreshCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-500" />
        <span>Replay motion</span>
      </button>
    </div>
  );
}
