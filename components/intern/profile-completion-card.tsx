'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { profileCompletion } from '@/lib/profile-completion';

/**
 * Onboarding checklist — fetches minimal profile state, shows gamified completion bar.
 * Non-blocking: hides itself if profile API unavailable.
 */
export function ProfileCompletionCard() {
  const [data, setData] = useState<null | {
    percent: number;
    steps: { key: string; label: string; done: boolean }[];
  }>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/candidates/me');
        if (!res.ok) return;
        const me = await res.json();
        const p = me?.profile ?? me ?? {};
        const skills: string[] = p.skills ?? p.topSkills ?? [];
        const result = profileCompletion({
          hasPhoto: !!(p.photoUrl || p.avatarUrl || p.imageUrl),
          hasCv: !!(p.cvUrl || p.hasCv || p.cvFileId),
          skillsCount: Array.isArray(skills) ? skills.length : 0,
          hasPhone: !!(p.phone || p.phoneNumber || p.phoneVerified),
          hasBio: !!((p.bio || p.summary || '') as string),
          hasEducation: !!((p.education || p.school || p.university || p.educationLevel) as string),
          hasField: !!(p.fieldSlug || p.fieldName || p.field),
          hasCity: !!(p.city || p.location),
        });
        if (!cancelled && result.percent < 100) setData(result);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <Card className="p-5 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900 text-sm">
            Complete your profile
          </p>
          <p className="text-xs text-slate-600">
            Complete profiles get 3x more responses.
          </p>
        </div>
        <Badge className="bg-blue-600 text-white shrink-0">{data.percent}%</Badge>
      </div>
      <Progress value={data.percent} className="mt-3 h-2" />
      <ul className="mt-3 space-y-1.5">
        {data.steps.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-xs">
            {s.done ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-slate-300" />
            )}
            <span className={s.done ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}>
              {s.label}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/intern/passport"
        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
      >
        Complete now
        <ArrowRight className="h-3 w-3" />
      </Link>
    </Card>
  );
}
