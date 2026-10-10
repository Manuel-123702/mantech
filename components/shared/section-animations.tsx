'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The site-wide motion language.
 *
 * Every section shares one easing curve — expo-out: a quick start that
 * glides to a gentle stop — and small, disciplined distances. Content
 * fades up out of a slight blur, as if coming into focus, instead of
 * sliding around the viewport. Staggers stay short so grids resolve as
 * one calm, organised wave rather than a busy parade.
 */
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EXPO_OUT }}
          className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/15 shadow-sm"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.07, ease: EXPO_OUT }}
        className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.13, ease: EXPO_OUT }}
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
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EXPO_OUT }}
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
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.07, delayChildren: 0.04 },
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
        hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.65, ease: EXPO_OUT },
        },
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
  /** Headings and prose. Rises gently into focus. */
  rise: {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.68, ease: EXPO_OUT },
    },
  },

  /** Card grids. Glide in softly from the left, one after another. */
  slideLeft: {
    hidden: { opacity: 0, x: -26, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EXPO_OUT },
    },
  },

  /** Alternate cards. Glide in softly from the right edge. */
  slideRight: {
    hidden: { opacity: 0, x: 26, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EXPO_OUT },
    },
  },

  /** Grids that mirror left and right. Fan in from both edges. */
  spread: {
    hidden: { opacity: 0, x: 22, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EXPO_OUT },
    },
  },

  /** Statistics and prices. Settle into place with a soft scale. */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.65, ease: EXPO_OUT },
    },
  },
  /** Step-by-step content. Wipes in as it grows taller. */
  wipe: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    visible: {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 0.8, ease: EXPO_OUT },
    },
  },

  /** Soft spring entrance for interactive badges and cards. */
  pop: {
    hidden: { opacity: 0, scale: 0.9, y: 14 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 230 },
    },
  },

  /** Cinematic blur-to-sharp focus reveal. */
  blurReveal: {
    hidden: { opacity: 0, filter: 'blur(14px)', y: 14 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.75, ease: EXPO_OUT },
    },
  },

  /** Gentle perspective lift for category tiles and cards. */
  flip3D: {
    hidden: { opacity: 0, rotateX: 12, y: 18, transformPerspective: 1100 },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transformPerspective: 1100,
      transition: { duration: 0.75, ease: EXPO_OUT },
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
  stagger = 0.07,
  className,
}: MotionSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-70px' }}
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
      whileHover={{ y: -5, transition: { duration: 0.28, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Barely-there floating for "Live", "Verified", or "New" chips — a slow
 * breath rather than an attention-grabbing bob.
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
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('inline-flex items-center', className)}
    >
      {children}
    </motion.span>
  );
}
