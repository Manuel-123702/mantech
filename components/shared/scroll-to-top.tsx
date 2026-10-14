'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Floating "back to top" control — a real computer-mouse illustration.
 * Sits at the bottom-left, stacked just above the WhatsApp concierge float.
 * The little scroll-wheel dot slides up and down (slow, gentle). Clicking
 * jumps straight to the top of the page.
 */
function ScrollMouseIcon() {
  return (
    <span className="relative flex h-8 w-5 items-start justify-center rounded-full border-2 border-current pt-1.5">
      <motion.span
        animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="h-1.5 w-1 rounded-full bg-current"
      />
    </span>
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-10 right-6 z-40 flex h-14 w-12 items-center justify-center rounded-2xl border border-blue-950/10 bg-orange-500/20 text-orange-400 shadow-lg backdrop-blur-md transition-colors hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        >
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <ScrollMouseIcon />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

