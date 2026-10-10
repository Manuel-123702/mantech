'use client';

import { useEffect } from 'react';

/**
 * Scrolls back to the top of the page whenever `value` changes.
 *
 * Long forms often move to the next question by hiding one block and showing
 * another. The page height stays similar, so the browser keeps the visitor
 * where they were and the new question can appear above the fold, out of
 * sight. This brings them back to the top so the next question is always the
 * first thing they see.
 *
 * The scroll is skipped when the visitor prefers reduced motion, so it never
 * fights an accessibility setting.
 */
export function useScrollToTopOnChange(value: unknown) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [value]);
}