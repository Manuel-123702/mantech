const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public', 'images', 'logos');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Function to generate clean vector SVGs
function createSvgLogo({ fileName, title, initials, sub, bgGrad, fgColor, iconSvg }) {
  const filePath = path.join(targetDir, fileName);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bg_${fileName.replace(/[^a-zA-Z0-9]/g, '')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgGrad[0]}"/>
      <stop offset="100%" stop-color="${bgGrad[1]}"/>
    </linearGradient>
  </defs>

  <!-- Card Base -->
  <rect width="200" height="200" rx="36" fill="url(#bg_${fileName.replace(/[^a-zA-Z0-9]/g, '')})"/>
  <rect x="4" y="4" width="192" height="192" rx="32" fill="none" stroke="${fgColor}" stroke-width="2" stroke-opacity="0.35"/>
  <circle cx="100" cy="85" r="54" fill="none" stroke="${fgColor}" stroke-width="1" stroke-opacity="0.15"/>

  <!-- Brand Emblem Graphic -->
  <g transform="translate(100, 78)">
    ${iconSvg}
  </g>

  <!-- Brand Initials Badge -->
  <text x="100" y="146" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" fill="${fgColor}" letter-spacing="1.5">
    ${initials}
  </text>

  <!-- Brand Subtitle / Category -->
  <text x="100" y="168" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="${fgColor}" opacity="0.85" letter-spacing="0.5">
    ${sub}
  </text>
</svg>`;

  fs.writeFileSync(filePath, svg);
  console.log(`Generated: ${fileName}`);
}

// ── COMPANIES ──
const companies = [
  {
    fileName: 'bicec.svg',
    title: 'BICEC',
    initials: 'BICEC',
    sub: 'BANQUE COMMERCIALE',
    bgGrad: ['#00875A', '#002B49'],
    fgColor: '#FFFFFF',
    iconSvg: `<path d="M -26 -16 L 0 -34 L 26 -16 L 26 18 L 0 34 L -26 18 Z" fill="none" stroke="#FFFFFF" stroke-width="4.5"/>
              <circle cx="0" cy="0" r="12" fill="#FFFFFF" fill-opacity="0.9"/>
              <path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="#00875A" stroke-width="3"/>`
  },
  {
    fileName: 'chococam.svg',
    title: 'Chococam Tiger Brands',
    initials: 'CHOCOCAM',
    sub: 'TIGER BRANDS',
    bgGrad: ['#78350F', '#451A03'],
    fgColor: '#FBBF24',
    iconSvg: `<ellipse cx="0" cy="0" rx="26" ry="17" transform="rotate(-30)" fill="#D97706" stroke="#FDE68A" stroke-width="3"/>
              <path d="M -18 -8 Q 0 0 18 8" stroke="#FDE68A" stroke-width="2.5" fill="none"/>
              <circle cx="-6" cy="-4" r="3" fill="#FFFFFF"/>
              <circle cx="6" cy="4" r="3" fill="#FFFFFF"/>`
  },
  {
    fileName: 'afriland.svg',
    title: 'Afriland First Bank',
    initials: 'AFRILAND',
    sub: 'FIRST BANK',
    bgGrad: ['#0F3876', '#1E1B4B'],
    fgColor: '#F59E0B',
    iconSvg: `<circle cx="0" cy="0" r="28" fill="none" stroke="#F59E0B" stroke-width="4"/>
              <path d="M -14 12 L 0 -18 L 14 12 Z" fill="#F59E0B"/>
              <circle cx="0" cy="-2" r="5" fill="#0F3876"/>`
  },
  {
    fileName: 'campost.svg',
    title: 'Campost',
    initials: 'CAMPOST',
    sub: 'POSTE & SERVICES',
    bgGrad: ['#EAB308', '#CA8A04'],
    fgColor: '#1E3A8A',
    iconSvg: `<rect x="-24" y="-16" width="48" height="32" rx="4" fill="#1E3A8A"/>
              <path d="M -24 -16 L 0 4 L 24 -16" stroke="#FACC15" stroke-width="3" fill="none"/>
              <circle cx="0" cy="-2" r="4" fill="#FACC15"/>`
  },
  {
    fileName: 'camair.svg',
    title: 'Camair-Co',
    initials: 'CAMAIR-CO',
    sub: 'THE STAR OF CAMEROON',
    bgGrad: ['#047857', '#064E3B'],
    fgColor: '#FBBF24',
    iconSvg: `<path d="M -28 10 Q 0 -24 28 -8 Q 10 16 -28 10 Z" fill="#FBBF24"/>
              <polygon points="0,-16 4,-6 14,-6 6,0 9,10 0,4 -9,10 -6,0 -14,-6 -4,-6" fill="#DC2626"/>`
  },
  {
    fileName: 'crtv.svg',
    title: 'CRTV',
    initials: 'CRTV',
    sub: 'RADIO TÉLÉVISION',
    bgGrad: ['#DC2626', '#991B1B'],
    fgColor: '#FFFFFF',
    iconSvg: `<circle cx="0" cy="0" r="26" fill="none" stroke="#FFFFFF" stroke-width="3.5"/>
              <path d="M -16 6 Q 0 -18 16 6" stroke="#FBBF24" stroke-width="4" fill="none"/>
              <polygon points="0,-8 3,-1 10,-1 4,3 6,10 0,6 -6,10 -4,3 -10,-1 -3,-1" fill="#10B981"/>`
  },
  {
    fileName: 'sonara.svg',
    title: 'SONARA',
    initials: 'SONARA',
    sub: 'RAFFINERIE NATIONALE',
    bgGrad: ['#B45309', '#78350F'],
    fgColor: '#FEF3C7',
    iconSvg: `<path d="M 0 -26 C 14 -10, 20 6, 0 26 C -20 6, -14 -10, 0 -26 Z" fill="#F59E0B" stroke="#FEF3C7" stroke-width="3"/>
              <path d="M 0 -12 C 6 -2, 8 6, 0 16 C -8 6, -6 -2, 0 -12 Z" fill="#DC2626"/>`
  },
  {
    fileName: 'cdc.svg',
    title: 'CDC Cameroon',
    initials: 'CDC',
    sub: 'DEVELOPMENT CORP',
    bgGrad: ['#065F46', '#022C22'],
    fgColor: '#A7F3D0',
    iconSvg: `<path d="M -22 18 C -22 -14, 0 -26, 0 -26 C 0 -26, 22 -14, 22 18 Z" fill="#10B981"/>
              <line x1="0" y1="-24" x2="0" y2="18" stroke="#065F46" stroke-width="3.5"/>
              <path d="M 0 -6 Q 14 -10 16 -2" stroke="#065F46" stroke-width="2.5" fill="none"/>
              <path d="M 0 4 Q -14 0 -16 8" stroke="#065F46" stroke-width="2.5" fill="none"/>`
  },
  {
    fileName: 'pak.svg',
    title: 'Port Autonome de Kribi',
    initials: 'PAK',
    sub: 'PORT DE KRIBI',
    bgGrad: ['#0284C7', '#0C4A6E'],
    fgColor: '#FFFFFF',
    iconSvg: `<circle cx="0" cy="-14" r="8" fill="none" stroke="#FFFFFF" stroke-width="3"/>
              <line x1="0" y1="-6" x2="0" y2="24" stroke="#FFFFFF" stroke-width="4.5"/>
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#FFFFFF" stroke-width="4"/>
              <path d="M -24 10 C -18 26, 18 26, 24 10" stroke="#38BDF8" stroke-width="4.5" fill="none"/>`
  },
  {
    fileName: 'hevecam.svg',
    title: 'Hevecam',
    initials: 'HEVECAM',
    sub: 'HÉVÉA DU CAMEROUN',
    bgGrad: ['#15803D', '#14532D'],
    fgColor: '#FEF08A',
    iconSvg: `<path d="M 0 -26 C 16 -12, 18 10, 0 24 C -18 10, -16 -12, 0 -26 Z" fill="#84CC16"/>
              <line x1="0" y1="-22" x2="0" y2="24" stroke="#14532D" stroke-width="3"/>
              <circle cx="0" cy="10" r="5" fill="#FEF08A"/>`
  },
  {
    fileName: 'cca.svg',
    title: 'CCA-Bank',
    initials: 'CCA-BANK',
    sub: 'BANQUE & FINANCE',
    bgGrad: ['#1E3A8A', '#172554'],
    fgColor: '#F59E0B',
    iconSvg: `<path d="M -24 0 A 24 24 0 1 1 20 16" fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
              <circle cx="0" cy="0" r="8" fill="#FFFFFF"/>`
  },
  {
    fileName: 'uccao.svg',
    title: 'UCCAO',
    initials: 'UCCAO',
    sub: 'CAFÉIERS DE L\'OUEST',
    bgGrad: ['#78350F', '#3B1A04'],
    fgColor: '#FDE68A',
    iconSvg: `<ellipse cx="0" cy="0" rx="24" ry="16" fill="#92400E" stroke="#FDE68A" stroke-width="3"/>
              <path d="M -16 0 Q 0 -8 16 0" stroke="#FDE68A" stroke-width="2.5" fill="none"/>
              <circle cx="0" cy="0" r="5" fill="#10B981"/>`
  },
  {
    fileName: 'nwca.svg',
    title: 'NWCA Ltd',
    initials: 'NWCA',
    sub: 'BAMENDA COFFEE',
    bgGrad: ['#047857', '#064E3B'],
    fgColor: '#FDE047',
    iconSvg: `<circle cx="-10" cy="-6" r="10" fill="#DC2626"/>
              <circle cx="10" cy="-6" r="10" fill="#DC2626"/>
              <circle cx="0" cy="8" r="10" fill="#EAB308"/>
              <path d="M 0 -16 L 0 -26" stroke="#FDE047" stroke-width="3"/>`
  },
  {
    fileName: 'sodecoton.svg',
    title: 'SODECOTON',
    initials: 'SODECOTON',
    sub: 'COTON DU CAMEROUN',
    bgGrad: ['#0284C7', '#0369A1'],
    fgColor: '#FFFFFF',
    iconSvg: `<circle cx="-10" cy="-6" r="12" fill="#FFFFFF"/>
              <circle cx="10" cy="-6" r="12" fill="#FFFFFF"/>
              <circle cx="0" cy="10" r="12" fill="#FFFFFF"/>
              <circle cx="0" cy="0" r="10" fill="#FCD34D"/>
              <path d="M -2 18 L 0 28 L 2 18" stroke="#15803D" stroke-width="3.5" fill="none"/>`
  },
  {
    fileName: 'semry.svg',
    title: 'SEMRY',
    initials: 'SEMRY',
    sub: 'RIZICULTURE YAGOUA',
    bgGrad: ['#CA8A04', '#854D0E'],
    fgColor: '#FEF08A',
    iconSvg: `<path d="M 0 24 C 0 -10, 20 -20, 20 -20 C 20 -20, 10 -4, 0 10" fill="#FEF08A"/>
              <path d="M 0 24 C 0 -10, -20 -20, -20 -20 C -20 -20, -10 -4, 0 10" fill="#FEF08A"/>
              <path d="M -24 20 Q 0 12 24 20" stroke="#38BDF8" stroke-width="3.5" fill="none"/>`
  },
  {
    fileName: 'shs.svg',
    title: 'SHS Ngaoundéré',
    initials: 'SHS',
    sub: 'HUILERIE & SAVONNERIE',
    bgGrad: ['#D97706', '#92400E'],
    fgColor: '#FFFFFF',
    iconSvg: `<path d="M 0 -24 C 14 -10, 18 6, 0 22 C -18 6, -14 -10, 0 -24 Z" fill="#FDE047" stroke="#FFFFFF" stroke-width="3"/>
              <circle cx="0" cy="4" r="6" fill="#D97706"/>`
  },
  {
    fileName: 'pallisco.svg',
    title: 'Pallisco Timber',
    initials: 'PALLISCO',
    sub: 'BOIS DURABLE EST',
    bgGrad: ['#166534', '#14532D'],
    fgColor: '#BBF7D0',
    iconSvg: `<path d="M 0 -26 L 20 0 L 10 0 L 24 22 L -24 22 L -10 0 L -20 0 Z" fill="#22C55E"/>
              <rect x="-4" y="22" width="8" height="10" fill="#78350F"/>`
  },
  {
    fileName: 'maviance.svg',
    title: 'Maviance Smobilpay',
    initials: 'MAVIANCE',
    sub: 'SMOBILPAY FINTECH',
    bgGrad: ['#4F46E5', '#312E81'],
    fgColor: '#22D3EE',
    iconSvg: `<polygon points="2,-26 -16,2 -2,2 -4,26 16,-2 2,-2" fill="#22D3EE"/>
              <circle cx="-18" cy="-14" r="4" fill="#A5B4FC"/>
              <circle cx="18" cy="14" r="4" fill="#A5B4FC"/>`
  },
  {
    fileName: 'guinness.svg',
    title: 'Guinness Castel',
    initials: 'GUINNESS',
    sub: 'CASTEL BREWERY',
    bgGrad: ['#18181B', '#09090B'],
    fgColor: '#F59E0B',
    iconSvg: `<path d="M -16 -20 Q 16 -24 16 0 Q 16 24 -16 20 Z" fill="none" stroke="#F59E0B" stroke-width="4"/>
              <line x1="-12" y1="-14" x2="12" y2="4" stroke="#F59E0B" stroke-width="2"/>
              <line x1="-12" y1="-4" x2="12" y2="10" stroke="#F59E0B" stroke-width="2"/>
              <line x1="-12" y1="6" x2="12" y2="16" stroke="#F59E0B" stroke-width="2"/>`
  },
];

// ── UNIVERSITIES ──
const universities = [
  {
    fileName: 'uy1.svg',
    title: 'Université de Yaoundé I',
    initials: 'UY1',
    sub: 'UNIVERSITÉ DE YAOUNDÉ I',
    bgGrad: ['#1E3A8A', '#0F172A'],
    fgColor: '#93C5FD',
    iconSvg: `<polygon points="0,-24 28,-10 0,4 -28,-10" fill="#93C5FD"/>
              <path d="M -20 -4 L -20 14 C -20 22, 20 22, 20 14 L 20 -4" fill="none" stroke="#93C5FD" stroke-width="3"/>
              <circle cx="0" cy="-10" r="4" fill="#1E3A8A"/>`
  },
  {
    fileName: 'uy2.svg',
    title: 'Université de Yaoundé II Soa',
    initials: 'UY2',
    sub: 'UNIVERSITÉ YAOUNDÉ II SOA',
    bgGrad: ['#581C87', '#3B0764'],
    fgColor: '#E9D5FF',
    iconSvg: `<path d="M 0 -22 L 0 20 M -20 -10 L 20 -10" stroke="#E9D5FF" stroke-width="3.5"/>
              <circle cx="-20" cy="-2" r="7" fill="none" stroke="#E9D5FF" stroke-width="2.5"/>
              <circle cx="20" cy="-2" r="7" fill="none" stroke="#E9D5FF" stroke-width="2.5"/>`
  },
  {
    fileName: 'enspy.svg',
    title: 'ENSPY Polytechnique Yaoundé',
    initials: 'ENSPY',
    sub: 'POLYTECHNIQUE YAOUNDÉ',
    bgGrad: ['#991B1B', '#450A0A'],
    fgColor: '#FCA5A5',
    iconSvg: `<circle cx="0" cy="0" r="14" fill="#DC2626" stroke="#FCA5A5" stroke-width="3"/>
              <circle cx="0" cy="0" r="24" fill="none" stroke="#FCA5A5" stroke-width="3" stroke-dasharray="8 5"/>
              <polygon points="0,-8 3,-2 8,-2 4,2 6,8 0,4 -6,8 -4,2 -8,-2 -3,-2" fill="#FFFFFF"/>`
  },
  {
    fileName: 'ictu.svg',
    title: 'The ICT University',
    initials: 'ICTU',
    sub: 'THE ICT UNIVERSITY',
    bgGrad: ['#0369A1', '#082F49'],
    fgColor: '#7DD3FC',
    iconSvg: `<circle cx="0" cy="0" r="22" fill="none" stroke="#7DD3FC" stroke-width="3"/>
              <line x1="-22" y1="0" x2="22" y2="0" stroke="#7DD3FC" stroke-width="2"/>
              <ellipse cx="0" cy="0" rx="12" ry="22" fill="none" stroke="#7DD3FC" stroke-width="2"/>
              <circle cx="0" cy="0" r="5" fill="#FFFFFF"/>`
  },
  {
    fileName: 'ucac.svg',
    title: 'Université Catholique d\'Afrique Centrale',
    initials: 'UCAC',
    sub: 'UNIVERSITÉ CATHOLIQUE',
    bgGrad: ['#854D0E', '#422006'],
    fgColor: '#FEF08A',
    iconSvg: `<line x1="0" y1="-26" x2="0" y2="24" stroke="#FEF08A" stroke-width="4.5"/>
              <line x1="-16" y1="-10" x2="16" y2="-10" stroke="#FEF08A" stroke-width="4.5"/>
              <circle cx="0" cy="-10" r="6" fill="#DC2626"/>`
  },
  {
    fileName: 'siantou.svg',
    title: 'Institut Supérieur Siantou',
    initials: 'SIANTOU',
    sub: 'INSTITUT SUPÉRIEUR',
    bgGrad: ['#1E40AF', '#172554'],
    fgColor: '#BFDBFE',
    iconSvg: `<path d="M 0 -24 L 6 -12 L 18 -12 L 8 -4 L 12 8 L 0 0 L -12 8 L -8 -4 L -18 -12 L -6 -12 Z" fill="#FBBF24"/>
              <rect x="-14" y="6" width="28" height="16" rx="3" fill="#BFDBFE"/>`
  },
  {
    fileName: 'udla.svg',
    title: 'Université de Douala',
    initials: 'UDLA',
    sub: 'UNIVERSITÉ DE DOUALA',
    bgGrad: ['#0F766E', '#134E4A'],
    fgColor: '#99F6E4',
    iconSvg: `<circle cx="0" cy="-14" r="7" fill="none" stroke="#99F6E4" stroke-width="3"/>
              <line x1="0" y1="-7" x2="0" y2="22" stroke="#99F6E4" stroke-width="4"/>
              <path d="M -20 8 C -14 22, 14 22, 20 8" stroke="#99F6E4" stroke-width="4" fill="none"/>`
  },
  {
    fileName: 'stjerome.svg',
    title: 'Institut Saint Jérôme de Douala',
    initials: 'ST-JÉRÔME',
    sub: 'UNIVERSITAIRE CATHOLIQUE',
    bgGrad: ['#0369A1', '#0F172A'],
    fgColor: '#BAE6FD',
    iconSvg: `<line x1="0" y1="-24" x2="0" y2="20" stroke="#BAE6FD" stroke-width="4"/>
              <line x1="-14" y1="-10" x2="14" y2="-10" stroke="#BAE6FD" stroke-width="4"/>
              <polygon points="0,-24 4,-14 14,-14 6,-6 9,4 0,0 -9,4 -6,-6 -14,-14 -4,-14" fill="#FBBF24"/>`
  },
  {
    fileName: 'ubuea.svg',
    title: 'University of Buea',
    initials: 'UB',
    sub: 'A PLACE TO BE • BUEA',
    bgGrad: ['#065F46', '#022C22'],
    fgColor: '#A7F3D0',
    iconSvg: `<polygon points="0,-22 24,18 -24,18" fill="none" stroke="#A7F3D0" stroke-width="3.5"/>
              <circle cx="0" cy="-6" r="6" fill="#FBBF24"/>
              <line x1="-12" y1="6" x2="12" y2="6" stroke="#A7F3D0" stroke-width="2.5"/>`
  },
  {
    fileName: 'buib.svg',
    title: 'Biaka University Institute of Buea',
    initials: 'BUIB',
    sub: 'HEALTH & MANAGEMENT',
    bgGrad: ['#0284C7', '#075985'],
    fgColor: '#E0F2FE',
    iconSvg: `<rect x="-8" y="-22" width="16" height="44" rx="3" fill="#DC2626"/>
              <rect x="-22" y="-8" width="44" height="16" rx="3" fill="#DC2626"/>
              <circle cx="0" cy="0" r="6" fill="#FFFFFF"/>`
  },
  {
    fileName: 'udschang.svg',
    title: 'Université de Dschang',
    initials: 'UDS',
    sub: 'UNIVERSITÉ DE DSCHANG',
    bgGrad: ['#92400E', '#451A03'],
    fgColor: '#FED7AA',
    iconSvg: `<polygon points="0,-24 26,-8 0,6 -26,-8" fill="#F59E0B"/>
              <path d="M -18 0 L -18 16 C -18 24, 18 24, 18 16 L 18 0" stroke="#FED7AA" stroke-width="3" fill="none"/>`
  },
  {
    fileName: 'pkf.svg',
    title: 'PKFokam Institute of Excellence',
    initials: 'PKF',
    sub: 'INSTITUTE OF EXCELLENCE',
    bgGrad: ['#4C1D95', '#2E1065'],
    fgColor: '#DDD6FE',
    iconSvg: `<polygon points="0,-26 22,-8 14,20 -14,20 -22,-8" fill="none" stroke="#DDD6FE" stroke-width="3.5"/>
              <circle cx="0" cy="-2" r="8" fill="#F59E0B"/>`
  },
  {
    fileName: 'udm.svg',
    title: 'Université des Montagnes Bangangté',
    initials: 'UDM',
    sub: 'SANTÉ & PHARMACIE',
    bgGrad: ['#047857', '#064E3B'],
    fgColor: '#6EE7B7',
    iconSvg: `<path d="M 0 -22 L 0 22" stroke="#6EE7B7" stroke-width="4"/>
              <path d="M -10 -12 Q 0 -6 10 -12 Q 0 -18 -10 -12 Z" fill="#6EE7B7"/>
              <circle cx="0" cy="-24" r="4" fill="#FBBF24"/>`
  },
  {
    fileName: 'iutfv.svg',
    title: 'IUT Fotso Victor de Bandjoun',
    initials: 'IUT-FV',
    sub: 'IUT FOTSO VICTOR',
    bgGrad: ['#C2410C', '#7C2D12'],
    fgColor: '#FFEDD5',
    iconSvg: `<circle cx="0" cy="0" r="16" fill="none" stroke="#FFEDD5" stroke-width="4"/>
              <circle cx="0" cy="0" r="6" fill="#F97316"/>
              <line x1="0" y1="-24" x2="0" y2="24" stroke="#FFEDD5" stroke-width="3.5"/>
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#FFEDD5" stroke-width="3.5"/>`
  },
  {
    fileName: 'uniba.svg',
    title: 'The University of Bamenda',
    initials: 'UBA',
    sub: 'UNIVERSITY OF BAMENDA',
    bgGrad: ['#0D9488', '#115E59'],
    fgColor: '#CCFBF1',
    iconSvg: `<rect x="-18" y="-18" width="36" height="36" rx="6" fill="none" stroke="#CCFBF1" stroke-width="3.5"/>
              <polygon points="0,-12 10,8 -10,8" fill="#FBBF24"/>`
  },
  {
    fileName: 'catuc.svg',
    title: 'Catholic University of Cameroon Bamenda',
    initials: 'CATUC',
    sub: 'CATHOLIC UNIVERSITY',
    bgGrad: ['#1E3A8A', '#1E1B4B'],
    fgColor: '#BFDBFE',
    iconSvg: `<line x1="0" y1="-26" x2="0" y2="22" stroke="#BFDBFE" stroke-width="4"/>
              <line x1="-14" y1="-10" x2="14" y2="-10" stroke="#BFDBFE" stroke-width="4"/>`
  },
  {
    fileName: 'ungaroua.svg',
    title: 'Université de Garoua',
    initials: 'UNIV-GAROUA',
    sub: 'UNIVERSITÉ DE GAROUA',
    bgGrad: ['#CA8A04', '#713F12'],
    fgColor: '#FEF08A',
    iconSvg: `<circle cx="0" cy="0" r="22" fill="none" stroke="#FEF08A" stroke-width="3.5"/>
              <polygon points="0,-16 4,-4 16,-4 6,4 10,16 0,8 -10,16 -6,4 -16,-4 -4,-4" fill="#FACC15"/>`
  },
  {
    fileName: 'umaroua.svg',
    title: 'Université de Maroua',
    initials: 'UNIV-MAROUA',
    sub: 'UNIVERSITÉ DE MAROUA',
    bgGrad: ['#D97706', '#78350F'],
    fgColor: '#FED7AA',
    iconSvg: `<circle cx="0" cy="-6" r="16" fill="#F59E0B"/>
              <path d="M -20 18 Q 0 8 20 18" stroke="#FED7AA" stroke-width="4" fill="none"/>`
  },
  {
    fileName: 'undere.svg',
    title: 'Université de Ngaoundéré',
    initials: 'UNIV-NDÉRÉ',
    sub: 'UNIVERSITÉ DE NGAOUNDÉRÉ',
    bgGrad: ['#4C1D95', '#3B0764'],
    fgColor: '#E9D5FF',
    iconSvg: `<polygon points="0,-24 22,-8 14,20 -14,20 -22,-8" fill="#A855F7"/>
              <circle cx="0" cy="-2" r="7" fill="#FFFFFF"/>`
  },
  {
    fileName: 'ubertoua.svg',
    title: 'Université de Bertoua',
    initials: 'UNIV-BERTOUA',
    sub: 'UNIVERSITÉ DE BERTOUA',
    bgGrad: ['#166534', '#14532D'],
    fgColor: '#BBF7D0',
    iconSvg: `<circle cx="0" cy="0" r="22" fill="none" stroke="#BBF7D0" stroke-width="3.5"/>
              <path d="M -12 12 L 0 -14 L 12 12 Z" fill="#22C55E"/>`
  },
  {
    fileName: 'uebolowa.svg',
    title: 'Université d\'Ebolowa',
    initials: 'UNIV-EBOLOWA',
    sub: 'UNIVERSITÉ D\'EBOLOWA',
    bgGrad: ['#0284C7', '#0C4A6E'],
    fgColor: '#BAE6FD',
    iconSvg: `<circle cx="0" cy="0" r="20" fill="none" stroke="#BAE6FD" stroke-width="3"/>
              <circle cx="0" cy="0" r="8" fill="#F59E0B"/>`
  },
  {
    fileName: 'enstp.svg',
    title: 'ENSTP Travaux Publics',
    initials: 'ENSTP',
    sub: 'TRAVAUX PUBLICS',
    bgGrad: ['#EA580C', '#7C2D12'],
    fgColor: '#FFEDD5',
    iconSvg: `<path d="M -22 18 L -6 -16 L 6 -16 L 22 18 Z" fill="none" stroke="#FFEDD5" stroke-width="3.5"/>
              <line x1="-12" y1="4" x2="12" y2="4" stroke="#FFEDD5" stroke-width="3"/>`
  },
  {
    fileName: 'supptic.svg',
    title: 'SUP\'PTIC Yaoundé',
    initials: 'SUP\'PTIC',
    sub: 'POSTES & TÉLÉCOMS',
    bgGrad: ['#0284C7', '#1E3A8A'],
    fgColor: '#7DD3FC',
    iconSvg: `<path d="M -18 8 A 20 20 0 0 1 18 8" stroke="#7DD3FC" stroke-width="3.5" fill="none"/>
              <path d="M -10 12 A 12 12 0 0 1 10 12" stroke="#7DD3FC" stroke-width="3.5" fill="none"/>
              <circle cx="0" cy="14" r="4" fill="#FBBF24"/>`
  },
  {
    fileName: 'iric.svg',
    title: 'IRIC Yaoundé',
    initials: 'IRIC',
    sub: 'RELATIONS INTERNATIONALES',
    bgGrad: ['#1E3A8A', '#0F172A'],
    fgColor: '#BFDBFE',
    iconSvg: `<circle cx="0" cy="0" r="22" fill="none" stroke="#BFDBFE" stroke-width="3"/>
              <ellipse cx="0" cy="0" rx="10" ry="22" fill="none" stroke="#BFDBFE" stroke-width="2"/>
              <line x1="-22" y1="0" x2="22" y2="0" stroke="#BFDBFE" stroke-width="2"/>`
  },
  {
    fileName: 'essec.svg',
    title: 'ESSEC Douala',
    initials: 'ESSEC',
    sub: 'SCIENCES ÉCONOMIQUES',
    bgGrad: ['#1E293B', '#0F172A'],
    fgColor: '#FDE047',
    iconSvg: `<rect x="-18" y="-18" width="36" height="36" rx="6" fill="#FDE047"/>
              <text x="0" y="8" font-size="18" font-weight="900" fill="#0F172A" text-anchor="middle">E</text>`
  },
  {
    fileName: 'nahpi.svg',
    title: 'NAHPI Bamenda',
    initials: 'NAHPI',
    sub: 'POLYTECHNIC INSTITUTE',
    bgGrad: ['#0F766E', '#115E59'],
    fgColor: '#99F6E4',
    iconSvg: `<circle cx="0" cy="0" r="20" fill="none" stroke="#99F6E4" stroke-width="3"/>
              <polygon points="0,-12 10,8 -10,8" fill="#F59E0B"/>`
  },
  {
    fileName: 'fomic.svg',
    title: 'FOMIC Polytechnic Buea',
    initials: 'FOMIC',
    sub: 'POLYTECHNIC BUEA',
    bgGrad: ['#7C2D12', '#451A03'],
    fgColor: '#FED7AA',
    iconSvg: `<rect x="-16" y="-20" width="32" height="40" rx="4" fill="none" stroke="#FED7AA" stroke-width="3.5"/>
              <polygon points="0,-10 6,4 -6,4" fill="#FBBF24"/>`
  },
  {
    fileName: 'iugg.svg',
    title: 'IUGG Douala',
    initials: 'IUGG',
    sub: 'GRANDES GUINÉES',
    bgGrad: ['#312E81', '#1E1B4B'],
    fgColor: '#C7D2FE',
    iconSvg: `<circle cx="0" cy="0" r="20" fill="none" stroke="#C7D2FE" stroke-width="3"/>
              <text x="0" y="8" font-size="16" font-weight="900" fill="#FBBF24" text-anchor="middle">G</text>`
  },
  {
    fileName: 'enam.svg',
    title: 'ENAM Cameroun',
    initials: 'ENAM',
    sub: 'ADMINISTRATION & MAGISTRATURE',
    bgGrad: ['#991B1B', '#450A0A'],
    fgColor: '#FEE2E2',
    iconSvg: `<path d="M 0 -22 L 0 20 M -18 -8 L 18 -8" stroke="#FEE2E2" stroke-width="4"/>
              <circle cx="-18" cy="2" r="6" fill="#FBBF24"/>
              <circle cx="18" cy="2" r="6" fill="#FBBF24"/>`
  },
];

// Generate all logos
[...companies, ...universities].forEach(createSvgLogo);
console.log('Finished generating all 48 company & university vector logos.');
