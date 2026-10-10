/**
 * The choice lists used by the testimonial form.
 *
 * They live in one place and are shared by the form and the API, so the two can
 * never drift apart. Each entry says how the visitor fills it in:
 *
 *  - `choose`  pick one from the list
 *  - `chooseOrType` pick one, or write their own if nothing fits
 *  - `type`    write it in full (no sensible list exists)
 */

/** Every field, how it is filled in, and whether it is required. */
export const TESTIMONIAL_FIELDS = [
  { name: 'name', label: 'Full name', kind: 'type', required: true },
  { name: 'email', label: 'Email address', kind: 'type', required: true },
  { name: 'role', label: 'You are a…', kind: 'chooseOrType', required: true },
  { name: 'company', label: 'Company or school', kind: 'chooseOrType', required: true },
  { name: 'region', label: 'Region', kind: 'choose', required: true },
  { name: 'focus', label: 'What did you use MANTECH for?', kind: 'chooseOrType', required: true },
  { name: 'message', label: 'Short quote', kind: 'type', required: true },
  { name: 'details', label: 'Tell us the full story', kind: 'type', required: true },
  { name: 'rating', label: 'Overall rating', kind: 'choose', required: true },
  { name: 'photoUrl', label: 'Photo', kind: 'type', required: false },
] as const;

/** The ten kinds of person we hear from. */
export const TESTIMONIAL_ROLES = [
  'Intern',
  'Recruiter',
  'HR Manager',
  'University Placement Officer',
  'University Recruiter',
  'Technical Mentor',
  'Campus Ambassador',
  'Senior Engineer',
  'Operations Manager',
  'Faculty Dean',
] as const;

/** What people actually came here to do. */
export const TESTIMONIAL_FOCUSES = [
  'Discovery',
  'Applications Pipeline',
  'Passport & Privacy',
  'University Dual-Mode',
  'Placement Coordination',
  'Verification',
  'Candidate Quality',
  'WhatsApp Support',
] as const;

/** The ten regions of Cameroon. */
export const TESTIMONIAL_REGIONS = [
  'Adamawa',
  'Centre',
  'East',
  'Far-North',
  'Littoral',
  'North',
  'North-West',
  'South-West',
  'West',
] as const;

/** Shown as the free-text escape hatch on any "choose or type" field. */
export const OTHER_OPTION = 'Something else';

/** Longest answers we accept, so one person cannot fill the page. */
export const TESTIMONIAL_LIMITS = {
  name: 80,
  email: 160,
  role: 80,
  company: 120,
  region: 40,
  focus: 80,
  message: 400,
  details: 2000,
} as const;

/** Shortest answers that still tell us something. */
export const TESTIMONIAL_MINIMUMS = {
  name: 2,
  role: 2,
  company: 2,
  focus: 2,
  message: 20,
  details: 40,
} as const;

const roleSet = new Set<string>(TESTIMONIAL_ROLES);
const focusSet = new Set<string>(TESTIMONIAL_FOCUSES);
const regionSet = new Set<string>(TESTIMONIAL_REGIONS);

/**
 * Checks one submitted field.
 *
 * A "choose" field must be one of the exact options. A "choose or type" field
 * may be an option or the visitor's own words. Everything is trimmed first, so
 * a stray space cannot smuggle in a value that would never appear in the list.
 */
export function checkTestimonialField(
  field: string,
  value: unknown,
): { ok: true; value: string } | { ok: false; error: string } {
  const definition = TESTIMONIAL_FIELDS.find((entry) => entry.name === field);
  if (!definition) return { ok: false, error: 'Unknown field.' };

  const label = definition.label;

  // The photo is the one field a visitor may leave out.
  if (!definition.required) return { ok: true, value: '' };

  if (typeof value !== 'string' || value.trim() === '') {
    return { ok: false, error: `${label} is required.` };
  }
  const trimmed = value.trim();

  const limit = TESTIMONIAL_LIMITS[field as keyof typeof TESTIMONIAL_LIMITS];
  if (limit && trimmed.length > limit) {
    return { ok: false, error: `${label} must be under ${limit} characters.` };
  }

  const minimum = TESTIMONIAL_MINIMUMS[field as keyof typeof TESTIMONIAL_MINIMUMS];
  if (minimum && trimmed.length < minimum) {
    return { ok: false, error: `${label} needs a little more detail.` };
  }

  if (definition.kind === 'choose' || definition.kind === 'chooseOrType') {
    const allowed =
      field === 'role'
        ? roleSet
        : field === 'focus'
          ? focusSet
          : field === 'region'
            ? regionSet
            : null;

    // `choose` is strict: only the listed option counts.
    if (allowed && definition.kind === 'choose' && !allowed.has(trimmed)) {
      return { ok: false, error: `Please pick ${label.toLowerCase()} from the list.` };
    }
    // `chooseOrType` accepts the visitor's own words, but never the
    // placeholder for the free-text box, which would look like a real answer.
    if (allowed && trimmed === OTHER_OPTION) {
      return { ok: false, error: `Please type your own answer for "${label}".` };
    }
  }

  return { ok: true, value: trimmed };
}

/** Keeps a rating whole and between 1 and 5. */
export function normaliseRating(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(5, Math.max(1, Math.round(parsed)));
}