'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
        className
      )}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/15 shadow-sm"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Varied, extraordinary entrance animations for distinct page sections:
 * - rise: gentle vertical reveal for headlines and text
 * - slideLeft: fluid slide-in from the left edge
 * - slideRight: fluid slide-in from the right edge
 * - spread: outwards horizontal stagger
 * - scaleIn: soft growth and elevation for pricing, stats, numbers
 * - wipe: cinematic clip-path reveal for lifecycle sequences
 * - pop: bouncy 3D spring entrance for badges, highlights, and cards
 * - blurReveal: high-end blur-to-sharp focus entrance
 * - flip3D: subtle perspective flip for feature and category cards
 */
export const SECTION_MOTION = {
  /** Headings and prose. Rises gently. */
  rise: {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Card grids. Fan in from the left, one after another. */
  slideLeft: {
    hidden: { opacity: 0, x: -44 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Alternate cards. Fan in from the right edge. */
  slideRight: {
    hidden: { opacity: 0, x: 44 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Grids that mirror left and right. Fan in from both edges. */
  spread: {
    hidden: { opacity: 0, x: 44 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Statistics and prices. Settle into place with a soft scale. */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.88, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Step-by-step content. Wipes in as it grows taller. */
  wipe: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    visible: {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },

  /** Bouncy spring entrance for interactive badges and cards. */
  pop: {
    hidden: { opacity: 0, scale: 0.82, y: 22 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 16, stiffness: 260 },
    },
  },

  /** Modern blur-to-sharp high-definition reveal. */
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 24 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  },

  /** 3D perspective flip for category tiles and cards. */
  flip3D: {
    hidden: { opacity: 0, rotateX: 20, y: 32 },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  },
} as const;

export type SectionMotionName = keyof typeof SECTION_MOTION;

interface MotionSectionProps {
  children: ReactNode;
  /** Which entrance style to use. Defaults to a gentle rise. */
  motion?: SectionMotionName;
  /** Seconds between each child animating. */
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
      viewport={{ once: true, margin: '-80px' }}
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
  /** Must match the style passed to the wrapping MotionSection. */
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

/**
 * Interactive card with subtle lift and glow micro-animation on hover.
 */
export function AnimatedCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Continuous subtle floating badge for "Live", "Verified", or "New".
 */
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
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('inline-flex items-center', className)}
    >
      {children}
    </motion.span>
  );
}
