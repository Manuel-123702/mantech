/**
 * Profile readiness (SRS §6 — mandatory registration fields, §7 — passport).
 *
 * Registration makes phone, diploma and CV mandatory, so the checklist is
 * derived from real profile state rather than a stored percentage. Each item
 * deep-links to the place the intern can actually fix it, which turns the
 * readiness score from a vanity number into a to-do list.
 */

export type ChecklistTone = 'done' | 'todo';

export type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
  done: boolean;
  /** Where the intern goes to resolve this item. */
  href: string;
};

export type ReadinessProfile = {
  hasCv: boolean;
  hasPhoto: boolean;
  hasPhone: boolean;
  hasQualification: boolean;
  hasField: boolean;
  hasSkills: boolean;
  hasEducation: boolean;
  hasLocation: boolean;
  hasAvailability: boolean;
  hasSummary: boolean;
};

export function buildReadinessChecklist(
  profile: ReadinessProfile,
): ChecklistItem[] {
  const settings = '/dashboard/intern/settings';
  const passport = '/dashboard/intern/passport';

  return [
    {
      id: 'cv',
      label: 'CV uploaded',
      detail: 'Mandatory for every internship application',
      done: profile.hasCv,
      href: passport,
    },
    {
      id: 'photo',
      label: 'Professional photo',
      detail: 'Shown on your Intern Passport',
      done: profile.hasPhoto,
      href: settings,
    },
    {
      id: 'phone',
      label: 'Phone number',
      detail: 'Organizations may call you directly when visible',
      done: profile.hasPhone,
      href: settings,
    },
    {
      id: 'qualification',
      label: 'Diploma / qualification',
      detail: 'The qualification you have already obtained',
      done: profile.hasQualification,
      href: settings,
    },
    {
      id: 'field',
      label: 'Professional field',
      detail: 'Used to match you to relevant opportunities',
      done: profile.hasField,
      href: settings,
    },
    {
      id: 'skills',
      label: 'Skills added',
      detail: 'Improves matching and recruiter search results',
      done: profile.hasSkills,
      href: passport,
    },
    {
      id: 'education',
      label: 'Education history',
      detail: 'School, qualification and years',
      done: profile.hasEducation,
      href: passport,
    },
    {
      id: 'location',
      label: 'Region and city',
      detail: 'Used for on-site opportunity matching',
      done: profile.hasLocation,
      href: settings,
    },
    {
      id: 'availability',
      label: 'Availability',
      detail: 'When you can start an internship',
      done: profile.hasAvailability,
      href: settings,
    },
    {
      id: 'summary',
      label: 'Professional summary',
      detail: 'Your headline introduction on the Passport',
      done: profile.hasSummary,
      href: passport,
    },
  ];
}

/** Percentage of completed checklist items, rounded to a whole number. */
export function readinessPercent(items: ChecklistItem[]): number {
  if (items.length === 0) return 0;
  const done = items.filter((item) => item.done).length;
  return Math.round((done / items.length) * 100);
}

/** The next items the intern should tackle, worst first. */
export function nextActions(items: ChecklistItem[], limit = 3): ChecklistItem[] {
  return items.filter((item) => !item.done).slice(0, limit);
}