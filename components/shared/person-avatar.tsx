'use client';

import { useState, useEffect } from 'react';

/**
 * Professional portrait avatars for editorial content (success stories and
 * testimonials).
 */

type AvatarTone = {
  background: string;
  accent: string;
  skin: string;
  hair: string;
  garment: string;
};

/** Muted, brand-adjacent gradients — no saturated "rainbow avatar" look. */
const TONES: AvatarTone[] = [
  { background: '#1e3a8a', accent: '#3b82f6', skin: '#8d5524', hair: '#1c1917', garment: '#0f172a' },
  { background: '#065f46', accent: '#10b981', skin: '#a9714b', hair: '#241a12', garment: '#052e26' },
  { background: '#4c1d95', accent: '#8b5cf6', skin: '#6b4226', hair: '#120d0b', garment: '#2e1065' },
  { background: '#7c2d12', accent: '#f97316', skin: '#c68642', hair: '#2b1b12', garment: '#431407' },
  { background: '#0c4a6e', accent: '#0ea5e9', skin: '#7a4a2b', hair: '#1a1410', garment: '#082f49' },
  { background: '#831843', accent: '#ec4899', skin: '#5c3319', hair: '#0f0b08', garment: '#500724' },
  { background: '#1e293b', accent: '#64748b', skin: '#b07d52', hair: '#33261c', garment: '#0f172a' },
  { background: '#3f3f06', accent: '#a3a316', skin: '#946b45', hair: '#1f1a12', garment: '#1c1c07' },
];

/** FNV-1a — stable across runs, unlike a random call. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'MN';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Builds the SVG for a flat "professional headshot" portrait: shoulders, neck,
 * head, and hair. Unique gradient IDs prevent collision across multiple cards.
 */
function buildPortrait(seed: string, name: string): string {
  const h = hash(seed);
  const tone = TONES[h % TONES.length];
  const bgId = `bg_${h}`;
  const figId = `fig_${h}`;
  const hairStyle = (h >>> 3) % 3;
  const shoulderY = 78 + ((h >>> 6) % 5);
  const headR = 15 + ((h >>> 9) % 2);

  const hair =
    hairStyle === 0
      ? // Short, close-cut
        `<path d="M50 ${50 - headR - 1} a${headR} ${headR} 0 0 1 ${headR * 2} 0 q-4 -5 -${headR} -5 t-${headR * 2} 0 z" fill="${tone.hair}" />`
      : hairStyle === 1
        ? // Swept side part
          `<path d="M50 ${50 - headR - 2} a${headR + 1} ${headR + 1} 0 0 1 ${headR + 1} ${headR} q-2 -9 -${headR + 3} -9 t-${headR * 2 + 6} 4 z" fill="${tone.hair}" />`
        : // Volume / tied-back
          `<path d="M50 ${50 - headR - 3} a${headR + 2} ${headR + 2} 0 0 1 ${headR + 2} ${headR + 2} q-2 -11 -${headR + 4} -11 t-${headR * 2 + 8} 11 z" fill="${tone.hair}" />`;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">`,
    `<defs><linearGradient id="${bgId}" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${tone.background}"/><stop offset="1" stop-color="${tone.accent}"/>`,
    `</linearGradient>`,
    `<linearGradient id="${figId}" x1="0" y1="0" x2="0" y2="1">`,
    `<stop offset="0" stop-color="${tone.garment}"/><stop offset="1" stop-color="${tone.background}"/>`,
    `</linearGradient></defs>`,
    // Backdrop
    `<rect width="100" height="100" rx="20" fill="url(#${bgId})"/>`,
    // Shoulders / torso
    `<path d="M12 100 q0 -${100 - shoulderY} 38 -${100 - shoulderY} 38 0 z" fill="url(#${figId})"/>`,
    // Collar accent
    `<path d="M38 ${100 - (100 - shoulderY)} L50 88 L62 ${100 - (100 - shoulderY)} z" fill="${tone.accent}" opacity="0.85"/>`,
    // Neck
    `<rect x="45" y="60" width="10" height="16" rx="5" fill="${tone.skin}" opacity="0.92"/>`,
    // Head
    `<circle cx="50" cy="46" r="${headR}" fill="${tone.skin}"/>`,
    // Hair
    hair,
    // Soft rim light on the head for depth
    `<circle cx="50" cy="46" r="${headR}" fill="none" stroke="${tone.accent}" stroke-width="0.75" opacity="0.35"/>`,
    `</svg>`,
  ].join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export type PersonAvatarProps = {
  /** Stable identifier (e.g. `t_001`) that seeds the deterministic portrait. */
  id: string;
  /** Accessible label; the name is appropriate here because it is shown adjacent. */
  name: string;
  className?: string;
  /** Optional URL of a real profile photo */
  imageUrl?: string;
};

/**
 * Renders a professional portrait.
 * Includes an instant initials gradient base, referrerPolicy="no-referrer",
 * and smooth fallback so profile portraits never display as broken or empty boxes.
 */
export function PersonAvatar({ id, name, className = '', imageUrl }: PersonAvatarProps) {
  const fallbackSrc = buildPortrait(`${id}:${name}`, name);
  const [imgSrc, setImgSrc] = useState<string>(imageUrl || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(imageUrl || fallbackSrc);
    setIsLoaded(false);
    setHasError(false);
  }, [imageUrl, fallbackSrc]);

  const initials = getInitials(name);
  const h = hash(`${id}:${name}`);
  const tone = TONES[h % TONES.length];

  return (
    <div
      className={`relative shrink-0 overflow-hidden select-none ${className}`}
      style={{
        backgroundColor: tone.background,
      }}
    >
      {/* Background initials that always exist so avatar is NEVER empty or blank */}
      <div
        className="absolute inset-0 flex items-center justify-center font-bold text-white/90 text-sm tracking-wider"
        style={{
          background: `linear-gradient(135deg, ${tone.background}, ${tone.accent})`,
        }}
      >
        <span>{initials}</span>
      </div>

      {/* Actual photo / fallback SVG portrait */}
      <img
        src={hasError ? fallbackSrc : imgSrc}
        alt={`${name} — profile portrait`}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded || hasError ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          }
        }}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
