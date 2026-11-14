'use client';

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from 'framer-motion';
import { ReactNode, useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * MANTECH Nexus — Elite Motion Language v3
 * Spring-physics first. Every reveal feels alive.
 */
const QUART_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SMOOTH: [number, number, number, number] = [0.25, 0.9, 0.3, 1];

/* ═══════════════════════════════════════════════════════════════
   SectionHeader
═══════════════════════════════════════════════════════════════ */

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  variant?: 'default' | 'onDark';
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  variant = 'default',
}: SectionHeaderProps) {
  const eyebrowClasses =
    variant === 'onDark'
      ? 'mb-3 inline-block rounded-full bg-blue-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-200 border border-blue-400/30 shadow-sm'
      : 'mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/15 shadow-sm';
  const titleClasses =
    variant === 'onDark'
      ? 'font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'
      : 'font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl';
  const descriptionClasses =
    variant === 'onDark'
      ? 'mt-4 text-base sm:text-lg text-slate-300 leading-relaxed'
      : 'mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed';

  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 22, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: QUART_OUT }}
          className={eyebrowClasses}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.65, delay: 0.05, ease: QUART_OUT }}
        className={titleClasses}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: QUART_OUT }}
          className={descriptionClasses}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FadeIn
═══════════════════════════════════════════════════════════════ */

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({ children, delay = 0, className, direction = 'up' }: FadeInProps) {
  const axes: Record<string, { x: number; y: number }> = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: -45, y: 0 },
    right: { x: 45, y: 0 },
    none: { x: 0, y: 0 },
  };
  const { x, y } = axes[direction];
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.65, delay, ease: QUART_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   StaggerContainer / StaggerItem (spring-physics upgraded)
═══════════════════════════════════════════════════════════════ */

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export function StaggerContainer({ children, className, stagger = 0.09 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32, scale: 0.94 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            damping: 20,
            stiffness: 260,
            mass: 0.8,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION_MOTION — variant library
═══════════════════════════════════════════════════════════════ */

export const SECTION_MOTION = {
  /** Expressive vertical rise for headings, cards, and sections. */
  rise: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: QUART_OUT },
    },
  },

  /** Left-edge reveal with visible travel. */
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: QUART_OUT },
    },
  },

  /** Right-edge reveal with visible travel. */
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: QUART_OUT },
    },
  },

  /** Dynamic entrance for card grids with scale and rise. */
  spread: {
    hidden: { opacity: 0, y: 42, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: QUART_OUT },
    },
  },

  /** High-impact zoom and rise for stats and pricing. */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.88, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: QUART_OUT },
    },
  },

  /** Bold wipe reveal for step sequences. */
  wipe: {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: QUART_OUT },
    },
  },

  /** Snappy spring pop for badges and cards. */
  pop: {
    hidden: { opacity: 0, scale: 0.82, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 18, stiffness: 280, mass: 0.7 },
    },
  },

  /** Blur-to-sharp focus with subtle scale — upgraded. */
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: QUART_OUT },
    },
  },

  /** Dynamic 3D perspective tilt reveal. */
  flip3D: {
    hidden: { opacity: 0, y: 40, scale: 0.93 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: QUART_OUT },
    },
  },
} as const;

export type SectionMotionName = keyof typeof SECTION_MOTION;

/* ═══════════════════════════════════════════════════════════════
   MotionSection / MotionItem
═══════════════════════════════════════════════════════════════ */

interface MotionSectionProps {
  children: ReactNode;
  motion?: SectionMotionName;
  stagger?: number;
  className?: string;
}

export function MotionSection({
  children,
  motion: style = 'rise',
  stagger = 0.09,
  className,
}: MotionSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MotionItemProps {
  children: ReactNode;
  motion?: SectionMotionName;
  className?: string;
}

export function MotionItem({ children, motion: style = 'rise', className }: MotionItemProps) {
  return (
    <motion.div variants={SECTION_MOTION[style]} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AnimatedCard — upgraded with cyan glow + spring physics
═══════════════════════════════════════════════════════════════ */

export function AnimatedCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: '0 25px 60px rgba(6,182,212,0.18)',
        borderColor: 'rgba(6,182,212,0.4)',
        transition: { type: 'spring', stiffness: 340, damping: 22, mass: 0.7 },
      }}
      whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FloatingBadge
═══════════════════════════════════════════════════════════════ */

export function FloatingBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('inline-flex items-center', className)}
    >
      {children}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RevealOnScroll
═══════════════════════════════════════════════════════════════ */

export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.65, delay, ease: QUART_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   StatReveal
═══════════════════════════════════════════════════════════════ */

export function StatReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6, delay, ease: QUART_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SplitText — per-character 3D Y-axis spring entrance
═══════════════════════════════════════════════════════════════ */

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  splitBy?: 'char' | 'word';
  stagger?: number;
  delay?: number;
}

export function SplitText({
  text,
  className,
  charClassName,
  splitBy = 'char',
  stagger = 0.03,
  delay = 0,
}: SplitTextProps) {
  const tokens = splitBy === 'word' ? text.split(' ') : text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      rotateY: 90,
      y: 24,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      rotateY: 0,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 16,
        stiffness: 220,
        mass: 0.6,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className={cn('inline-flex flex-wrap', className)}
      style={{ perspective: 600 }}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={item}
          className={cn('inline-block', charClassName)}
          style={{ transformOrigin: 'center bottom', display: 'inline-block' }}
        >
          {token === ' ' ? '\u00A0' : token}
          {splitBy === 'word' && i < tokens.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GlowCard — pulsing gradient border + hover lift
═══════════════════════════════════════════════════════════════ */

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(6,182,212,0.5)',
}: GlowCardProps) {
  return (
    <motion.div
      className={cn('relative rounded-2xl', className)}
      whileHover={{
        y: -8,
        transition: { type: 'spring', stiffness: 320, damping: 20, mass: 0.8 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated gradient glow border */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            `0 0 0 1px ${glowColor}, 0 0 20px 0px ${glowColor}`,
            `0 0 0 1px ${glowColor}, 0 0 40px 8px ${glowColor}`,
            `0 0 0 1px ${glowColor}, 0 0 20px 0px ${glowColor}`,
          ],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TypewriterText — hero headline typewriter
═══════════════════════════════════════════════════════════════ */

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  pauseMs?: number;
  cursor?: boolean;
}

export function TypewriterText({
  texts,
  className,
  speed = 60,
  pauseMs = 1800,
  cursor = true,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => {
        setPaused(false);
        setDeleting(true);
      }, pauseMs);
      return () => clearTimeout(t);
    }

    const current = texts[textIndex] ?? '';

    if (!deleting) {
      if (charIndex < current.length) {
        const t = setTimeout(() => {
          setDisplayText(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, speed);
        return () => clearTimeout(t);
      } else {
        setPaused(true);
      }
    } else {
      if (charIndex > 0) {
        const t = setTimeout(() => {
          setDisplayText(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, speed / 2);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      }
    }
  }, [charIndex, deleting, paused, textIndex, texts, speed, pauseMs]);

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      <span>{displayText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          className="ml-0.5 inline-block h-[1em] w-[2px] rounded-full bg-current align-middle"
        />
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MagneticButton — children follow cursor (magnetic effect)
═══════════════════════════════════════════════════════════════ */

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.35 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [x, y, strength],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ParallaxSection — scroll-linked background parallax
═══════════════════════════════════════════════════════════════ */

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  backgroundChildren?: ReactNode;
}

export function ParallaxSection({
  children,
  className,
  speed = 0.4,
  backgroundChildren,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const smoothBgY = useSpring(bgY, { stiffness: 80, damping: 25 });

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {backgroundChildren && (
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: smoothBgY }}
        >
          {backgroundChildren}
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CountUp — animated number counter (triggers when in view)
═══════════════════════════════════════════════════════════════ */

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export function CountUp({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  formatter,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const motionValue = useMotionValue(from);
  const [display, setDisplay] = useState(
    formatter ? formatter(from) : from.toFixed(decimals),
  );

  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    mass: 1,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(to);
    }
  }, [inView, to, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      const val = parseFloat(latest.toFixed(decimals));
      setDisplay(formatter ? formatter(val) : val.toFixed(decimals));
    });
    return unsubscribe;
  }, [springValue, decimals, formatter]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ShimmerText — animated gradient shimmer sweep
═══════════════════════════════════════════════════════════════ */

interface ShimmerTextProps {
  text: string;
  className?: string;
  shimmerColor?: string;
  baseColor?: string;
  speed?: number;
}

export function ShimmerText({
  text,
  className,
  shimmerColor = '#06b6d4',
  baseColor = '#94a3b8',
  speed = 2.2,
}: ShimmerTextProps) {
  return (
    <span className={cn('relative inline-block overflow-hidden', className)}>
      {/* Base text */}
      <span className="relative" style={{ color: baseColor }}>
        {text}
      </span>
      {/* Shimmer overlay */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(105deg, transparent 20%, ${shimmerColor} 50%, transparent 80%)`,
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
        animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 0.6,
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WordReveal & LetterReveal — Kinetic Typography
═══════════════════════════════════════════════════════════════ */

interface KineticTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
}: KineticTextProps) {
  const words = text.split(' ');
  return (
    <motion.span
      className={cn('inline-flex flex-wrap gap-x-[0.28em] gap-y-1', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-0.5">
          <motion.span
            className={cn('inline-block', wordClassName)}
            variants={{
              hidden: { y: '110%', opacity: 0, rotateZ: 3 },
              visible: {
                y: '0%',
                opacity: 1,
                rotateZ: 0,
                transition: {
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function LetterReveal({
  text,
  className,
  delay = 0,
  stagger = 0.02,
}: KineticTextProps) {
  const letters = Array.from(text);
  return (
    <motion.span
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 15, scale: 0.8 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

