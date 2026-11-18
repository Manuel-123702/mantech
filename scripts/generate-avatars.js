const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(process.cwd(), 'public', 'images', 'avatars');
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

// 20 rich, realistic vector portraits with diverse African hairstyles, skin tones, accessories, and expressions
const portraits = [
  {
    id: 1, // Brenda Mengue - female, afro puff, warm bronze skin, glasses, purple blazer
    skin: '#8D5524',
    bg: '#4F46E5',
    hair: '#1E1B18',
    shirt: '#8B5CF6',
    female: true,
    glasses: true,
    hairStyle: 'afro_puffs',
  },
  {
    id: 2, // Cyrille Fotso - male, fresh fade, deep mahogany skin, blue polo
    skin: '#5C381E',
    bg: '#0284C7',
    hair: '#111827',
    shirt: '#0EA5E9',
    female: false,
    glasses: false,
    hairStyle: 'fade',
  },
  {
    id: 3, // Angèle Nguena - female, braided bun, golden amber skin, emerald dress
    skin: '#A26B3E',
    bg: '#059669',
    hair: '#1A1815',
    shirt: '#10B981',
    female: true,
    glasses: false,
    hairStyle: 'braids_bun',
  },
  {
    id: 4, // Yannick Mbarga - male, buzz cut, rich espresso skin, navy shirt, glasses
    skin: '#4A2E1B',
    bg: '#2563EB',
    hair: '#0F172A',
    shirt: '#1E40AF',
    female: false,
    glasses: true,
    hairStyle: 'buzz',
  },
  {
    id: 5, // Diane Tchuente - female, short natural coils, warm bronze, coral jacket
    skin: '#7C4724',
    bg: '#EA580C',
    hair: '#171717',
    shirt: '#F97316',
    female: true,
    glasses: false,
    hairStyle: 'short_curls',
  },
  {
    id: 6, // Kevin Fonkou - male, high-top fade, dark cocoa skin, teal sweater
    skin: '#563319',
    bg: '#0D9488',
    hair: '#111827',
    shirt: '#14B8A6',
    female: false,
    glasses: false,
    hairStyle: 'hightop',
  },
  {
    id: 7, // Sandra Bih - female, long micro-braids, caramel skin, gold earrings, ruby blouse
    skin: '#966036',
    bg: '#E11D48',
    hair: '#18181B',
    shirt: '#F43F5E',
    female: true,
    glasses: false,
    hairStyle: 'long_braids',
  },
  {
    id: 8, // Christian Abena - male, sharp waves, mahogany skin, charcoal blazer
    skin: '#533118',
    bg: '#475569',
    hair: '#09090B',
    shirt: '#64748B',
    female: false,
    glasses: false,
    hairStyle: 'waves',
  },
  {
    id: 9, // Vanessa Kamga - female, elegant side-part bob, chestnut skin, sapphire top
    skin: '#844D22',
    bg: '#3B82F6',
    hair: '#18181B',
    shirt: '#60A5FA',
    female: true,
    glasses: true,
    hairStyle: 'bob',
  },
  {
    id: 10, // Arnaud Djomo - male, trimmed beard & short fade, bronze skin, amber polo
    skin: '#6E401F',
    bg: '#D97706',
    hair: '#171717',
    shirt: '#F59E0B',
    female: false,
    glasses: false,
    hairStyle: 'beard_fade',
  },
  {
    id: 11, // Esther Ndongo - female, medical scrub look, deep bronze, neat updo
    skin: '#663B1C',
    bg: '#0284C7',
    hair: '#18181B',
    shirt: '#38BDF8',
    female: true,
    glasses: false,
    hairStyle: 'updo',
  },
  {
    id: 12, // Boris Talla - male, modern twist locks, warm caramel, violet hoodie
    skin: '#9E6539',
    bg: '#7C3AED',
    hair: '#18181B',
    shirt: '#8B5CF6',
    female: false,
    glasses: false,
    hairStyle: 'twists',
  },
  {
    id: 13, // Christelle Eyenga - female, braided crown, rich cocoa, magenta jacket
    skin: '#5A341A',
    bg: '#C026D3',
    hair: '#18181B',
    shirt: '#D946EF',
    female: true,
    glasses: false,
    hairStyle: 'braids_crown',
  },
  {
    id: 14, // Franck Nana - male, clean shave, deep espresso, emerald tech polo
    skin: '#462A17',
    bg: '#059669',
    hair: '#09090B',
    shirt: '#10B981',
    female: false,
    glasses: true,
    hairStyle: 'buzz',
  },
  {
    id: 15, // Nadine Mvondo - female, stylish natural afro, dark bronze, royal blue blazer
    skin: '#744321',
    bg: '#1D4ED8',
    hair: '#171717',
    shirt: '#3B82F6',
    female: true,
    glasses: false,
    hairStyle: 'afro_full',
  },
  {
    id: 16, // Patrick Ebongue - male, short dreadlocks, mahogany skin, red polo
    skin: '#5C381E',
    bg: '#DC2626',
    hair: '#111827',
    shirt: '#EF4444',
    female: false,
    glasses: false,
    hairStyle: 'dreads_short',
  },
  {
    id: 17, // Carine Zang - female, sleek low ponytail, warm amber, teal dress
    skin: '#8D5524',
    bg: '#0D9488',
    hair: '#18181B',
    shirt: '#14B8A6',
    female: true,
    glasses: true,
    hairStyle: 'ponytail',
  },
  {
    id: 18, // Alain Manga - male, agronomist hat / cap look, sun-warmed skin, olive vest
    skin: '#704220',
    bg: '#65A30D',
    hair: '#18181B',
    shirt: '#84CC16',
    female: false,
    glasses: false,
    hairStyle: 'cap',
  },
  {
    id: 19, // Solange Bisseck - female, cornrow braids with beads, golden brown, yellow top
    skin: '#9B6337',
    bg: '#CA8A04',
    hair: '#18181B',
    shirt: '#EAB308',
    female: true,
    glasses: false,
    hairStyle: 'cornrows',
  },
  {
    id: 20, // Emmanuel Tabi - male, sharp collegiate cut, deep cocoa, cyan polo
    skin: '#4F2F19',
    bg: '#0891B2',
    hair: '#09090B',
    shirt: '#06B6D4',
    female: false,
    glasses: true,
    hairStyle: 'fade',
  },
];

function generatePortraitSVG(p) {
  let hairMarkup = '';

  if (p.hairStyle === 'afro_puffs') {
    hairMarkup = `
      <circle cx="56" cy="54" r="22" fill="${p.hair}"/>
      <circle cx="104" cy="54" r="22" fill="${p.hair}"/>
      <path d="M 50 78 Q 80 58 110 78 Q 80 70 50 78 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'fade' || p.hairStyle === 'beard_fade') {
    hairMarkup = `
      <path d="M 52 74 C 52 48, 108 48, 108 74 C 108 70, 104 54, 80 52 C 56 54, 52 70, 52 74 Z" fill="${p.hair}"/>
      ${p.hairStyle === 'beard_fade' ? `<path d="M 64 104 Q 80 120 96 104 Q 80 114 64 104 Z" fill="${p.hair}"/>` : ''}
    `;
  } else if (p.hairStyle === 'braids_bun') {
    hairMarkup = `
      <circle cx="80" cy="44" r="20" fill="${p.hair}"/>
      <path d="M 52 76 C 52 52, 108 52, 108 76 C 96 66, 64 66, 52 76 Z" fill="${p.hair}"/>
      <circle cx="80" cy="44" r="14" fill="none" stroke="#D97706" stroke-width="2"/>
    `;
  } else if (p.hairStyle === 'buzz') {
    hairMarkup = `
      <path d="M 54 75 C 54 52, 106 52, 106 75 C 98 62, 62 62, 54 75 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'short_curls') {
    hairMarkup = `
      <circle cx="62" cy="58" r="14" fill="${p.hair}"/>
      <circle cx="80" cy="52" r="15" fill="${p.hair}"/>
      <circle cx="98" cy="58" r="14" fill="${p.hair}"/>
      <path d="M 52 76 Q 80 62 108 76 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'hightop') {
    hairMarkup = `
      <rect x="56" y="42" width="48" height="30" rx="10" fill="${p.hair}"/>
      <path d="M 52 74 Q 80 66 108 74 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'long_braids') {
    hairMarkup = `
      <path d="M 50 78 C 50 50, 110 50, 110 78 C 108 90, 114 125, 112 140 L 102 140 C 100 120, 104 90, 102 78 Z" fill="${p.hair}"/>
      <path d="M 50 78 C 52 90, 46 125, 48 140 L 58 140 C 60 120, 56 90, 58 78 Z" fill="${p.hair}"/>
      <path d="M 54 72 Q 80 60 106 72 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'waves') {
    hairMarkup = `
      <path d="M 54 74 C 54 52, 106 52, 106 74 Z" fill="${p.hair}"/>
      <path d="M 60 62 Q 80 58 100 62" stroke="#334155" stroke-width="1.5" fill="none"/>
      <path d="M 62 68 Q 80 64 98 68" stroke="#334155" stroke-width="1.5" fill="none"/>
    `;
  } else if (p.hairStyle === 'bob') {
    hairMarkup = `
      <path d="M 48 76 C 48 48, 112 48, 112 76 L 114 105 C 106 108, 102 96, 102 82 C 92 68, 68 68, 58 82 C 58 96, 54 108, 46 105 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'updo') {
    hairMarkup = `
      <circle cx="80" cy="46" r="18" fill="${p.hair}"/>
      <path d="M 52 76 C 52 56, 108 56, 108 76 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'twists') {
    hairMarkup = `
      <rect x="54" y="44" width="52" height="28" rx="8" fill="${p.hair}"/>
      <line x1="62" y1="44" x2="60" y2="72" stroke="#262626" stroke-width="2"/>
      <line x1="72" y1="44" x2="72" y2="70" stroke="#262626" stroke-width="2"/>
      <line x1="82" y1="44" x2="82" y2="70" stroke="#262626" stroke-width="2"/>
      <line x1="92" y1="44" x2="94" y2="72" stroke="#262626" stroke-width="2"/>
    `;
  } else if (p.hairStyle === 'braids_crown') {
    hairMarkup = `
      <ellipse cx="80" cy="58" rx="32" ry="18" fill="${p.hair}"/>
      <path d="M 52 76 Q 80 64 108 76 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'afro_full') {
    hairMarkup = `
      <circle cx="80" cy="68" r="38" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'dreads_short') {
    hairMarkup = `
      <rect x="54" y="46" width="52" height="26" rx="8" fill="${p.hair}"/>
      <line x1="58" y1="52" x2="52" y2="74" stroke="${p.hair}" stroke-width="4" stroke-linecap="round"/>
      <line x1="102" y1="52" x2="108" y2="74" stroke="${p.hair}" stroke-width="4" stroke-linecap="round"/>
      <line x1="70" y1="44" x2="68" y2="66" stroke="${p.hair}" stroke-width="4" stroke-linecap="round"/>
      <line x1="90" y1="44" x2="92" y2="66" stroke="${p.hair}" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (p.hairStyle === 'ponytail') {
    hairMarkup = `
      <path d="M 52 76 C 52 52, 108 52, 108 76 Z" fill="${p.hair}"/>
      <path d="M 106 72 Q 120 85 116 112 Q 110 105 106 82 Z" fill="${p.hair}"/>
    `;
  } else if (p.hairStyle === 'cap') {
    hairMarkup = `
      <ellipse cx="80" cy="60" rx="30" ry="14" fill="#365314"/>
      <path d="M 52 64 Q 80 50 108 64 Q 120 68 112 70 Q 80 66 52 64 Z" fill="#4D7C0F"/>
    `;
  } else if (p.hairStyle === 'cornrows') {
    hairMarkup = `
      <path d="M 52 76 C 52 52, 108 52, 108 76 Z" fill="${p.hair}"/>
      <line x1="60" y1="58" x2="64" y2="74" stroke="#404040" stroke-width="2"/>
      <line x1="72" y1="54" x2="74" y2="74" stroke="#404040" stroke-width="2"/>
      <line x1="84" y1="54" x2="84" y2="74" stroke="#404040" stroke-width="2"/>
      <line x1="96" y1="58" x2="94" y2="74" stroke="#404040" stroke-width="2"/>
      <circle cx="50" cy="98" r="3" fill="#EAB308"/>
      <circle cx="110" cy="98" r="3" fill="#EAB308"/>
    `;
  } else {
    hairMarkup = `<path d="M 52 76 C 52 52, 108 52, 108 76 Z" fill="${p.hair}"/>`;
  }

  const glassesMarkup = p.glasses
    ? `
      <rect x="62" y="78" width="16" height="12" rx="4" fill="none" stroke="#F8FAFC" stroke-width="2"/>
      <rect x="82" y="78" width="16" height="12" rx="4" fill="none" stroke="#F8FAFC" stroke-width="2"/>
      <line x1="78" y1="84" x2="82" y2="84" stroke="#F8FAFC" stroke-width="2"/>
    `
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <defs>
    <linearGradient id="bgGrad${p.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="160" height="160" rx="36" fill="url(#bgGrad${p.id})"/>
  <circle cx="80" cy="80" r="76" fill="none" stroke="${p.bg}" stroke-width="2" stroke-opacity="0.3"/>

  <!-- Neck -->
  <rect x="73" y="104" width="14" height="20" rx="6" fill="${p.skin}"/>

  <!-- Shoulders & Clothing -->
  <path d="M 32 152 C 34 122, 54 118, 73 120 L 80 134 L 87 120 C 106 118, 126 122, 128 152 Z" fill="${p.shirt}"/>
  <!-- Shirt Collar Accent -->
  <path d="M 70 120 L 80 134 L 90 120" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Hair Base (Behind head) -->
  ${hairMarkup}

  <!-- Head / Face -->
  <ellipse cx="80" cy="85" rx="25" ry="29" fill="${p.skin}"/>

  <!-- Ears -->
  <circle cx="55" cy="86" r="6" fill="${p.skin}"/>
  <circle cx="105" cy="86" r="6" fill="${p.skin}"/>
  ${p.female ? `
    <!-- Gold Earrings -->
    <circle cx="54" cy="92" r="2.5" fill="#FBBF24"/>
    <circle cx="106" cy="92" r="2.5" fill="#FBBF24"/>
  ` : ''}

  <!-- Eyebrows -->
  <path d="M 64 76 Q 71 73 76 75" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 84 75 Q 89 73 96 76" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Eyes -->
  <ellipse cx="70" cy="83" rx="3.5" ry="2.5" fill="#FFFFFF"/>
  <circle cx="70" cy="83" r="2" fill="#0F172A"/>
  <ellipse cx="90" cy="83" rx="3.5" ry="2.5" fill="#FFFFFF"/>
  <circle cx="90" cy="83" r="2" fill="#0F172A"/>

  <!-- Glasses -->
  ${glassesMarkup}

  <!-- Nose -->
  <path d="M 78 88 Q 80 94 82 88" stroke="#1F2937" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-opacity="0.6"/>

  <!-- Mouth / Smile -->
  <path d="M 72 99 Q 80 106 88 99" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Verified Green Badge -->
  <circle cx="128" cy="32" r="14" fill="#10B981" stroke="#020617" stroke-width="3"/>
  <path d="M 123 32 L 127 36 L 134 27" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;
}

for (const p of portraits) {
  const filePath = path.join(avatarsDir, `intern_${p.id}.svg`);
  const svg = generatePortraitSVG(p);
  fs.writeFileSync(filePath, svg, 'utf-8');
}

console.log(`Generated all 20 unique portrait avatars in ${avatarsDir}!`);
