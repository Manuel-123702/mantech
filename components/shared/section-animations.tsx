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
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
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
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: QUART_OUT }}
          className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/15 shadow-sm"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05, ease: QUART_OUT }}
        className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: QUART_OUT }}
          className={cn(
            'mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed',
            align === 'center' ? 'mx-auto' : '',
          )}
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
    up: { y: 14, x: 0 },
    down: { y: -14, x: 0 },
    left: { x: -14, y: 0 },
    right: { x: 14, y: 0 },
    none: { x: 0, y: 0 },
  };
  const { x, y } = axes[direction];
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: QUART_OUT }}
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

export function StaggerContainer({ children, className, stagger = 0.07 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: 0.04 },
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
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: QUART_OUT },
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
  /** Gentle vertical rise for headings and prose. */
  rise: {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: QUART_OUT },
    },
  },

  /** Left-edge subtle reveal. */
  slideLeft: {
    hidden: { opacity: 0, x: -14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: QUART_OUT },
    },
  },

  /** Right-edge subtle reveal. */
  slideRight: {
    hidden: { opacity: 0, x: 14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: QUART_OUT },
    },
  },

  /** Gentle entrance for card grids. */
  spread: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: QUART_OUT },
    },
  },

  /** Soft scale-up for stats and pricing cards. */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.45, ease: QUART_OUT },
    },
  },

  /** Clean reveal for step sequences. */
  wipe: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: QUART_OUT },
    },
  },

  /** Controlled spring pop for badges and interactive chips. */
  pop: {
    hidden: { opacity: 0, scale: 0.94, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 22, stiffness: 280, mass: 0.7 },
    },
  },

  /** Subtle blur-to-sharp for feature highlights. */
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(4px)', y: 10 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.5, ease: QUART_OUT },
    },
  },

  /** Refined elevation tilt for category cards. */
  flip3D: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: QUART_OUT },
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
  stagger = 0.08,
  className,
}: MotionSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
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
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
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
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: QUART_OUT }}
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
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: QUART_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}