'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/shared/logo';
import { APP_CONFIG } from '@/lib/config';

/**
 * Premium app-level loading boundary (SRS §17).
 * - Video background with MANTECH branding
 * - Optimized: muted / autoPlay / loop / playsInline / preload
 * - Graceful image + gradient fallback (shows instantly even if video errors)
 * - Non-blocking: renders UI immediately regardless of video load state
 */
export default function Loading() {
  const [videoError, setVideoError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      aria-label="Loading MANTECH Nexus"
      role="status"
      aria-live="polite"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-white"
    >
      {/* ───── Background layer stack ───── */}
      {/* Instant gradient fallback (always visible behind video) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
      />
      {/* Tech grid pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      {/* Soft radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(30,64,175,0.18) 0%, rgba(2,6,23,0) 65%)',
        }}
      />

      {/* Video background (SRS §17), with fallback skip on any error */}
      {!videoError && (
        <video
          key="mantech-loading-video"
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero_tech_bg.jpg"
          onError={() => setVideoError(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        >
          <source src="/videos/loading-video.mp4" type="video/mp4" />
        </video>
      )}
      {/* Darken overlay to ensure logo contrast */}
      <div aria-hidden className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* ───── Foreground brand content ───── */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center">
        {/* Logo with animated concentric rings */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {/* Outer slow ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-blue-400/20 transition-opacity duration-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              animation: 'mantech-loading-pulse-outer 2.4s ease-in-out infinite',
            }}
          />
          {/* Mid ring */}
          <div
            className={`absolute inset-3 rounded-full border border-cyan-400/25 transition-opacity duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              animation: 'mantech-loading-spin 8s linear infinite',
              borderTopColor: 'rgba(34,211,238,0.7)',
              borderRightColor: 'rgba(34,211,238,0.2)',
              borderBottomColor: 'rgba(59,130,246,0.5)',
            }}
          />
          {/* Inner fast ring */}
          <div
            className={`absolute inset-6 rounded-full border border-indigo-400/25 transition-opacity duration-900 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              animation: 'mantech-loading-spin 4s linear infinite reverse',
              borderTopColor: 'rgba(129,140,248,0.85)',
            }}
          />
          <Logo size={68} className="drop-shadow-[0_0_22px_rgba(59,130,246,0.55)]" />
        </div>

        {/* Brand text */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </span>
          </h2>
          <p className="text-sm text-slate-300/90 sm:text-base">{APP_CONFIG.tagline}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 pt-1">
          <div className="relative flex h-2 w-44 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"
              style={{
                animation: 'mantech-loading-progress 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            />
          </div>
          <span className="text-xs font-medium text-slate-300/80">Loading…</span>
        </div>
      </div>

      {/* Keyframe animations (inline style tag — zero JS deps) */}
      <style jsx>{`
        @keyframes mantech-loading-pulse-outer {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.08); opacity: 0.18; }
        }
        @keyframes mantech-loading-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes mantech-loading-progress {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
