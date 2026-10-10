'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function MatchBadge({ score, missing }: { score: number; missing?: string[] }) {
  const [show, setShow] = useState(false);
  const color =
    score >= 80
      ? 'bg-emerald-600 text-white'
      : score >= 60
        ? 'bg-blue-600 text-white'
        : score >= 40
          ? 'bg-amber-500 text-white'
          : 'bg-slate-200 text-slate-700';
  return (
    <span className="relative inline-block">
      <Badge
        className={`${color} cursor-help`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((v) => !v)}
      >
        {score}% match
      </Badge>
      {show && missing && missing.length > 0 && (
        <span className="absolute z-20 mt-1 left-0 w-48 rounded-lg border bg-white p-2 text-[11px] text-slate-600 shadow-lg">
          Missing: {missing.join(', ')}
        </span>
      )}
    </span>
  );
}
