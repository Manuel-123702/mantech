'use client';

import React, { useState } from 'react';
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
      'text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.45)] hover:text-white',
    glowColor: 'rgba(255,255,255,0.7)',
    accentColor: '#ffffff',
    hasSparkle: true,
  },
  {
    id: 'enterprise',
    text: 'Enterprise',
    className:
      'bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.65)]',
    glowColor: 'rgba(6,182,212,0.8)',
    accentColor: '#22d3ee',
  },
  {
    id: 'internship',
    text: 'Internship',
    className:
      'bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.65)]',
    glowColor: 'rgba(245,158,11,0.8)',
    accentColor: '#fbbf24',
  },
  {
    id: 'marketplace',
    text: 'Marketplace',
    className:
      'bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(129,140,248,0.75)]',
    glowColor: 'rgba(129,140,248,0.85)',
    accentColor: '#818cf8',
  },
];

export function HeroKineticHeadline() {
  const [animationCycle, setAnimationCycle] = useState(0);

  // Compute total global letter index across words for unified sequential staggering
  let runningIndex = 0;
  const wordData = WORDS.map((word) => {
    const letters = Array.from(word.text).map((char, charIdx) => {
      const idx = runningIndex++;
      return { char, charIdx, globalIdx: idx };
    });
    return { ...word, letters };
  });

  const replay = () => {
    setAnimationCycle((prev) => prev + 1);
  };

  return (
    <div className="relative group inline-block select-none" key={animationCycle}>
      {/* Laser light sweep across all 4 words periodically */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-150%', opacity: 0 }}
        animate={{
          x: ['-150%', '250%'],
          opacity: [0, 0.45, 0],
        }}
        transition={{
          delay: 2.4,
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 6.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-y-0 w-32 -skew-x-25 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent pointer-events-none mix-blend-screen z-20"
      />

      <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.12] tracking-tight flex flex-wrap items-baseline gap-x-3 gap-y-2">
        {wordData.map((word, wIdx) => (
          <span
            key={word.id}
            className="inline-flex items-baseline whitespace-nowrap relative"
          >
            {word.letters.map(({ char, globalIdx }) => {
              const isSpecial = char === "'";
              return (
                <motion.span
                  key={globalIdx}
                  className="relative inline-block cursor-pointer"
                  initial={{
                    opacity: 0,
                    y: 42,
                    rotateX: -95,
                    scale: 0.35,
                    filter: 'blur(10px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    delay: 0.08 + globalIdx * 0.038,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -9,
                    scale: 1.25,
                    rotateZ: globalIdx % 2 === 0 ? 5 : -5,
                    transition: { type: 'spring', stiffness: 500, damping: 14 },
                  }}
                >
                  {/* Micro quantum landing flash effect */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.9, 0],
                      scale: [0.3, 1.8, 2.4],
                    }}
                    transition={{
                      delay: 0.08 + globalIdx * 0.038 + 0.15,
                      duration: 0.45,
                      times: [0, 0.3, 1],
                    }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full pointer-events-none blur-[1.5px]"
                    style={{ backgroundColor: word.accentColor }}
                  />

                  {/* The actual letter with word styling */}
                  <span
                    className={`${word.className} ${
                      isSpecial ? 'mx-0.5 text-amber-300 font-serif' : ''
                    }`}
                  >
                    {char}
                  </span>
                </motion.span>
              );
            })}

            {/* Sparkle emblem on Cameroon's */}
            {word.hasSparkle && (
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.6,
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                }}
                className="ml-1.5 inline-flex items-center self-start"
              >
                <motion.span
                  animate={{
                    rotate: [0, 18, -18, 0],
                    scale: [1, 1.22, 1],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="inline-block text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                  title="Cameroon Verified Prestige"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-400/80" />
                </motion.span>
              </motion.span>
            )}

            {/* Trailing space between words */}
            {wIdx < WORDS.length - 1 && (
              <span className="inline-block w-2 sm:w-3" />
            )}
          </span>
        ))}
      </h1>

      {/* Futuristic kinetic energy underline beam that pulses alive once assembled */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          delay: 1.7,
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="origin-left mt-3.5 h-[2px] w-full max-w-xl bg-gradient-to-r from-transparent via-cyan-400 via-amber-400 to-violet-500 rounded-full relative overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.6)]"
      >
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </motion.div>

      {/* Interactive replay trigger on hover or click */}
      <button
        onClick={replay}
        type="button"
        title="Click to replay headline animation"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-cyan-300 cursor-pointer"
      >
        <RefreshCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-500" />
        <span>Replay motion</span>
      </button>
    </div>
  );
}
