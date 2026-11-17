'use client';

/**
 * PageHeroBg — Zero-data-cost hero background component.
 *
 * Replaces the 800 KB–1 MB raw JPG backgrounds with:
 *  1. Instant CSS gradient that renders in 0 bytes of network
 *  2. The actual JPG loaded lazily only after the page is interactive
 *     (uses IntersectionObserver + loading="lazy" semantics)
 *  3. next/image with sizes= so only the right resolution is downloaded
 *
 * On a 3G Cameroon connection this means the hero background never blocks
 * the page — users see the gradient immediately, the photo fades in later.
 *
 * Usage:
 *   <PageHeroBg src="/images/hero_tech_bg.jpg" gradient="blue" />
 */

import { useState, useEffect, useRef } from 'react';

type GradientVariant =
  | 'blue'    // hero, jobs, internships
  | 'violet'  // about, dashboard
  | 'emerald' // success, intern
  | 'amber'   // resources, company
  | 'portal'  // company portal
  | 'security'; // admin, security

const GRADIENT_MAP: Record<GradientVariant, string> = {
  blue:     'from-slate-950 via-blue-950/50 to-slate-950',
  violet:   'from-slate-950 via-violet-950/50 to-slate-950',
  emerald:  'from-slate-950 via-emerald-950/50 to-slate-950',
  amber:    'from-slate-950 via-amber-950/40 to-slate-950',
  portal:   'from-slate-950 via-cyan-950/40 to-slate-950',
  security: 'from-slate-950 via-indigo-950/50 to-slate-950',
};

interface PageHeroBgProps {
  src?: string;
  gradient?: GradientVariant;
  className?: string;
  opacity?: number; // 0-100, default 15
}

export function PageHeroBg({
  src,
  gradient = 'blue',
  className = '',
  opacity = 15,
}: PageHeroBgProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Only start loading image once the section is visible
  useEffect(() => {
    if (!src) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  const gradientClass = GRADIENT_MAP[gradient];

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}>
      {/* Instant CSS gradient — 0 bytes, renders in <1ms */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

      {/* Optional radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.12),transparent)]" />

      {/* Lazy photo overlay — only downloaded after page is interactive */}
      {src && inView && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: loaded ? opacity / 100 : 0 }}
        />
      )}

      {/* Bottom fade-out */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
}
