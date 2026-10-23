'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Refined site-wide motion language — v2.
 * Small disciplined distances (8-20px), smooth QUART_OUT easing,
 * no jarring blurs. Stagger stays tight for calm, organised reveals.
 */
const QUART_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SMOOTH: [number, number, number, number] = [0.25, 0.9, 0.3, 1];

/* ─────────────── SectionHeader ─────────────── */

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

/* ─────────────── FadeIn ─────────────── */

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

/* ─────────────── StaggerContainer / StaggerItem ─────────────── */

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
        hidden: { opacity: 0, y: 35, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: QUART_OUT },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── SECTION_MOTION ─────────────── */

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

  /** Blur-to-sharp focus for highlights. */
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 35 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
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

/* ─────────────── MotionSection / MotionItem ─────────────── */

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

/* ─────────────── AnimatedCard ─────────────── */

export function AnimatedCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── FloatingBadge ─────────────── */

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

/* ─────────────── RevealOnScroll ─────────────── */

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

/* ─────────────── StatReveal ─────────────── */

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