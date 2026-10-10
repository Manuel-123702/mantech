/**
 * Professional portrait avatars for editorial content (success stories and
 * testimonials).
 *
 * These entries are illustrative, not real accounts, so there is no uploaded
 * photo to show. Rather than render name-derived initials — which surface the
 * person's first name through the image and read as a placeholder — we render
 * a deterministic, professional-looking flat portrait.
 *
 * The look is deliberately abstract: no facial features are drawn, so the
 * artwork does not purport to depict the real appearance of a named person.
 * Variety is derived from a stable hash of the id, so a given person always
 * gets the same portrait across renders and builds.
 *
 * Rendered as an inline SVG data URI (no network request, no layout shift),
 * which the CSP `img-src 'self' data: blob: https:` already permits.
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

/**
 * Builds the SVG for a flat "professional headshot" portrait: shoulders, neck,
 * head, and hair. No eyes or mouth are drawn — this is a stylised silhouette,
 * not an attempt at a likeness.
 */
function buildPortrait(seed: string): string {
  const h = hash(seed);
  const tone = TONES[h % TONES.length];
  // Vary the silhouette slightly so a grid of avatars does not look stamped.
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
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${tone.background}"/><stop offset="1" stop-color="${tone.accent}"/>`,
    `</linearGradient>`,
    `<linearGradient id="fig" x1="0" y1="0" x2="0" y2="1">`,
    `<stop offset="0" stop-color="${tone.garment}"/><stop offset="1" stop-color="${tone.background}"/>`,
    `</linearGradient></defs>`,
    // Backdrop
    `<rect width="100" height="100" rx="22" fill="url(#bg)"/>`,
    // Shoulders / torso
    `<path d="M12 100 q0 -${100 - shoulderY} 38 -${100 - shoulderY} 38 0 z" fill="url(#fig)"/>`,
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
};

/**
 * Renders a deterministic professional portrait. The person is not identifiable
 * from the artwork alone; `name` is used only for the alt text.
 */
export function PersonAvatar({ id, name, className }: PersonAvatarProps) {
  const src = buildPortrait(`${id}:${name}`);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI; next/image adds no value here and cannot optimise it
    <img
      src={src}
      alt={`${name} — illustrated portrait`}
      className={className}
      loading="lazy"
      decoding="async"
      width={48}
      height={48}
    />
  );
}
