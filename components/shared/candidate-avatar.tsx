'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CandidateAvatarProps {
  src?: string | null;
  name: string;
  size?: number | string;
  className?: string;
  priority?: boolean;
}

/**
 * High-reliability candidate avatar that NEVER collapses or clips on mobile.
 * Uses exact aspect-ratio, shrink-0, min-w, and graceful fallback to initials
 * or default candidate avatar if an image URL fails to load.
 */
export function CandidateAvatar({
  src,
  name,
  size = 56,
  className = '',
  priority = false,
}: CandidateAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = (name || 'C')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const numSize = typeof size === 'number' ? size : parseInt(size, 10) || 56;
  const sizePx = `${numSize}px`;

  // Determine fallback image based on hash of name
  const hash = (name || 'intern')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackIndex = (hash % 10) + 1;
  const localCandidateFallback = `/images/candidates/intern_${fallbackIndex}.jpg`;

  if (!src || hasError) {
    return (
      <div
        className={`relative shrink-0 flex-shrink-0 aspect-square rounded-2xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-white/20 select-none overflow-hidden ${className}`}
        style={{
          width: sizePx,
          height: sizePx,
          minWidth: sizePx,
          minHeight: sizePx,
        }}
      >
        <span style={{ fontSize: `${Math.max(12, Math.floor(numSize * 0.38))}px` }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 flex-shrink-0 aspect-square rounded-2xl overflow-hidden select-none bg-slate-800 shadow-md ${className}`}
      style={{
        width: sizePx,
        height: sizePx,
        minWidth: sizePx,
        minHeight: sizePx,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name || 'Candidate portrait'}
        width={numSize}
        height={numSize}
        className="w-full h-full object-cover rounded-2xl"
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
