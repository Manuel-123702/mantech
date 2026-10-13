'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * Floating "back to top" control. Sits at the bottom-left, stacked just above
 * the WhatsApp concierge float. Only appears once the visitor has scrolled down,
 * and gently bobs up-and-down (slow, not too fast) so it draws the eye without
 * being distracting. Clicking jumps straight to the top of the page.
 */
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
          className="fixed bottom-24 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-blue-950/10 bg-white/80 text-blue-800 shadow-lg backdrop-blur-md transition-colors hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        >
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
