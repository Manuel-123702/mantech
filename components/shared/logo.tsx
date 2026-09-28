import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * ManTech Nexus Official Brand Emblem
 * An enterprise-grade, high-tech geometric image logo featuring
 * an interlocking isometric prism with dual 'M'-'N' nexus nodes,
 * deep cobalt gradients, and an energized core nexus pulse.
 * Standalone image mark with no adjacent text.
 */
export function Logo({ className, size = 44 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none transition-transform duration-300 hover:scale-105', className)}
      role="img"
      aria-label="ManTech Nexus Emblem"
    >
      <defs>
        {/* Deep tech foundation gradient */}
        <linearGradient id="mtn-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="50%" stopColor="#1C2541" />
          <stop offset="100%" stopColor="#0A1128" />
        </linearGradient>

        {/* Primary Sapphire Blue to Electric Cyan */}
        <linearGradient id="mtn-electric" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="45%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Secondary Indigo to Cobalt */}
        <linearGradient id="mtn-indigo" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Dynamic Nexus Energy Pulse (Amber to Gold) */}
        <linearGradient id="mtn-core" x1="24" y1="24" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="mtn-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hexagonal Shield Frame */}
      <path
        d="M32 3L57 17.5V46.5L32 61L7 46.5V17.5L32 3Z"
        fill="url(#mtn-bg)"
        stroke="url(#mtn-electric)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Subtle Inner Isometric Guideline Grid */}
      <path
        d="M32 3V32M57 17.5L32 32M7 17.5L32 32M57 46.5L32 32M7 46.5L32 32M32 61V32"
        stroke="white"
        strokeOpacity="0.06"
        strokeWidth="1"
      />

      {/* The 'M' Geometric Wing (Left Pillar) */}
      <path
        d="M15 44V23L24 30.5L32 23L40 30.5L49 23V44"
        stroke="url(#mtn-electric)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The 'N' Geometric Nexus Interlock */}
      <path
        d="M20 44V26L36 38V20"
        stroke="white"
        strokeOpacity="0.92"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Nexus Core Node (Energized Hex-Gem) */}
      <g filter="url(#mtn-glow)">
        <polygon
          points="32,27 36.5,29.5 36.5,34.5 32,37 27.5,34.5 27.5,29.5"
          fill="url(#mtn-core)"
        />
        <circle cx="32" cy="32" r="2.2" fill="#FFFFFF" />
      </g>

      {/* Connected Satellite Nodes - Representing Student, University, Company, Supervisor */}
      <circle cx="15" cy="23" r="2.5" fill="#38BDF8" />
      <circle cx="49" cy="23" r="2.5" fill="#38BDF8" />
      <circle cx="15" cy="44" r="2.5" fill="#818CF8" />
      <circle cx="49" cy="44" r="2.5" fill="#818CF8" />

      {/* Top Peak Beacon */}
      <circle cx="32" cy="8" r="1.8" fill="#F59E0B" />
    </svg>
  );
}

/**
 * Image-only full logo component (per requirement: no text logo near it).
 */
export function LogoFull({ className, size = 44 }: LogoProps) {
  return <Logo className={className} size={size} />;
}
