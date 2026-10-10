/**
 * MANTECH Nexus — Profile completion calculator
 * Used for the onboarding checklist gamification.
 */

export type CompletionInput = {
  hasPhoto?: boolean;
  hasCv?: boolean;
  skillsCount?: number;
  hasPhone?: boolean;
  hasBio?: boolean;
  hasEducation?: boolean;
  hasField?: boolean;
  hasCity?: boolean;
};

export function profileCompletion(input: CompletionInput): {
  percent: number;
  steps: { key: string; label: string; done: boolean; weight: number }[];
} {
  const steps = [
    { key: 'photo', label: 'Add a photo', done: !!input.hasPhoto, weight: 15 },
    { key: 'cv', label: 'Upload your CV', done: !!input.hasCv, weight: 30 },
    { key: 'skills', label: 'Add 3+ skills', done: (input.skillsCount ?? 0) >= 3, weight: 20 },
    { key: 'phone', label: 'Verify phone', done: !!input.hasPhone, weight: 10 },
    { key: 'bio', label: 'Write a bio', done: !!input.hasBio, weight: 10 },
    { key: 'education', label: 'Add education', done: !!input.hasEducation, weight: 10 },
    { key: 'location', label: 'Set field + city', done: !!(input.hasField && input.hasCity), weight: 5 },
  ];
  const percent = steps.reduce((acc, s) => acc + (s.done ? s.weight : 0), 0);
  return { percent: Math.min(100, percent), steps };
}
