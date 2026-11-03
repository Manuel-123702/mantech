/**
 * Generates 4 abstract SVG-based JPEG wallpapers for the MANTECH Nexus dashboards.
 * Run: node scripts/gen-dashboard-bgs.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT = path.join(__dirname, '..', 'public', 'images');

// Each background is a rich SVG with abstract shapes, gradients, and patterns
// saved as .svg then copied as the reference file

const BACKGROUNDS = [
  {
    filename: 'intern_dash_bg.jpg',
    // Deep space violet-blue: circuits, orbs, stars for intern/career growth
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg0" cx="30%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#0a0520"/>
      <stop offset="60%" stop-color="#060318"/>
      <stop offset="100%" stop-color="#020112"/>
    </radialGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="60"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="blur3"><feGaussianBlur stdDeviation="25"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- Deep dark base -->
  <rect width="1920" height="1080" fill="url(#bg0)"/>
  <!-- Ambient glow blobs -->
  <ellipse cx="320" cy="280" rx="420" ry="380" fill="url(#glow1)" filter="url(#blur1)"/>
  <ellipse cx="1600" cy="800" rx="500" ry="420" fill="url(#glow2)" filter="url(#blur1)"/>
  <ellipse cx="960" cy="540" rx="300" ry="280" fill="url(#glow3)" filter="url(#blur2)"/>
  <!-- Circuit grid lines -->
  ${Array.from({length: 18}, (_, i) => `
    <line x1="${i*120}" y1="0" x2="${i*120}" y2="1080" stroke="#4f46e5" stroke-width="0.4" stroke-opacity="0.15"/>
    <line x1="0" y1="${i*65}" x2="1920" y2="${i*65}" stroke="#7c3aed" stroke-width="0.4" stroke-opacity="0.12"/>
  `).join('')}
  <!-- Flowing light trails -->
  <path d="M0,400 Q480,200 960,450 T1920,300" stroke="#6366f1" stroke-width="1.5" fill="none" stroke-opacity="0.5" filter="url(#glow)"/>
  <path d="M0,600 Q600,350 1100,600 T1920,480" stroke="#a78bfa" stroke-width="1" fill="none" stroke-opacity="0.4" filter="url(#glow)"/>
  <path d="M0,750 Q500,550 960,700 T1920,620" stroke="#38bdf8" stroke-width="0.8" fill="none" stroke-opacity="0.35"/>
  <!-- Circuit nodes -->
  ${[
    [200,180],[450,320],[700,150],[960,280],[1200,200],[1500,310],[1750,180],
    [300,540],[600,460],[850,580],[1150,490],[1400,560],[1680,480],
    [150,800],[500,720],[800,850],[1100,760],[1450,820],[1750,700]
  ].map(([x,y]) => `
    <circle cx="${x}" cy="${y}" r="3" fill="#818cf8" fill-opacity="0.7" filter="url(#glow)"/>
    <circle cx="${x}" cy="${y}" r="8" fill="#818cf8" fill-opacity="0.12"/>
    <circle cx="${x}" cy="${y}" r="18" fill="#818cf8" fill-opacity="0.05"/>
  `).join('')}
  <!-- Geometric fragments -->
  <polygon points="380,100 420,160 340,160" fill="#4f46e5" fill-opacity="0.2" stroke="#6366f1" stroke-width="0.5" stroke-opacity="0.6"/>
  <polygon points="1540,200 1600,280 1480,280" fill="#7c3aed" fill-opacity="0.2" stroke="#a78bfa" stroke-width="0.5" stroke-opacity="0.6"/>
  <polygon points="960,80 1000,140 920,140" fill="#06b6d4" fill-opacity="0.15" stroke="#38bdf8" stroke-width="0.5" stroke-opacity="0.5"/>
  <rect x="100" y="800" width="60" height="60" rx="8" fill="none" stroke="#6366f1" stroke-width="0.6" stroke-opacity="0.4" transform="rotate(30,130,830)"/>
  <rect x="1800" y="900" width="80" height="80" rx="10" fill="none" stroke="#a78bfa" stroke-width="0.6" stroke-opacity="0.4" transform="rotate(-15,1840,940)"/>
  <!-- Subtle stars -->
  ${Array.from({length: 120}, (_, i) => {
    const x = Math.sin(i*137.5) * 960 + 960;
    const y = Math.cos(i*137.5) * 540 + 540;
    const r = 0.5 + (i%3)*0.5;
    const op = 0.3 + (i%5)*0.1;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="white" fill-opacity="${op.toFixed(1)}"/>`;
  }).join('')}
  <!-- Holographic scan line overlay -->
  <rect width="1920" height="1080" fill="url(#bg0)" fill-opacity="0.08"/>
</svg>`,
  },
  {
    filename: 'company_dash_bg.jpg',
    // Corporate emerald-teal: data network nodes for company/recruiter
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg0" cx="70%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#012018"/>
      <stop offset="55%" stop-color="#011510"/>
      <stop offset="100%" stop-color="#000d0a"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0d9488" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#0d9488" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="70"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg0)"/>
  <ellipse cx="1500" cy="250" rx="500" ry="450" fill="url(#g1)" filter="url(#blur1)"/>
  <ellipse cx="300" cy="850" rx="450" ry="400" fill="url(#g2)" filter="url(#blur1)"/>
  <ellipse cx="960" cy="540" rx="350" ry="300" fill="url(#g1)" filter="url(#blur2)" opacity="0.5"/>
  <!-- Hexagonal grid pattern -->
  ${Array.from({length: 12}, (_, row) => Array.from({length: 8}, (_, col) => {
    const cx = col * 240 + (row%2)*120;
    const cy = row * 140;
    const r = 55;
    const pts = Array.from({length:6}, (_,i) => {
      const a = Math.PI/180 * (60*i - 30);
      return `${(cx + r*Math.cos(a)).toFixed(1)},${(cy + r*Math.sin(a)).toFixed(1)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#10b981" stroke-width="0.5" stroke-opacity="0.2"/>`;
  }).join('')).join('')}
  <!-- Data flow lines -->
  <path d="M0,300 Q480,180 960,350 T1920,250" stroke="#10b981" stroke-width="1.5" fill="none" stroke-opacity="0.45" filter="url(#glow)"/>
  <path d="M0,700 Q600,550 1100,680 T1920,600" stroke="#14b8a6" stroke-width="1" fill="none" stroke-opacity="0.4" filter="url(#glow)"/>
  <path d="M100,500 Q500,380 900,520 T1820,440" stroke="#34d399" stroke-width="0.7" fill="none" stroke-opacity="0.3"/>
  <!-- Network nodes -->
  ${[
    [150,200],[400,150],[700,280],[960,180],[1250,250],[1550,160],[1800,300],
    [250,500],[550,420],[820,560],[1100,480],[1400,530],[1700,450],
    [100,820],[430,750],[750,870],[1020,780],[1380,840],[1700,760]
  ].map(([x,y]) => `
    <circle cx="${x}" cy="${y}" r="4" fill="#10b981" fill-opacity="0.8" filter="url(#glow)"/>
    <circle cx="${x}" cy="${y}" r="12" fill="#10b981" fill-opacity="0.1"/>
    <circle cx="${x}" cy="${y}" r="24" fill="#10b981" fill-opacity="0.04"/>
  `).join('')}
  <!-- Network edges (simplified) -->
  <line x1="150" y1="200" x2="400" y2="150" stroke="#10b981" stroke-width="0.5" stroke-opacity="0.3"/>
  <line x1="400" y1="150" x2="700" y2="280" stroke="#14b8a6" stroke-width="0.5" stroke-opacity="0.25"/>
  <line x1="700" y1="280" x2="960" y2="180" stroke="#10b981" stroke-width="0.5" stroke-opacity="0.3"/>
  <line x1="960" y1="180" x2="1250" y2="250" stroke="#14b8a6" stroke-width="0.5" stroke-opacity="0.25"/>
  <line x1="250" y1="500" x2="550" y2="420" stroke="#10b981" stroke-width="0.4" stroke-opacity="0.2"/>
  <line x1="550" y1="420" x2="820" y2="560" stroke="#10b981" stroke-width="0.4" stroke-opacity="0.2"/>
  <!-- Corporate diamond shapes -->
  <polygon points="960,50 1010,120 960,190 910,120" fill="none" stroke="#10b981" stroke-width="0.8" stroke-opacity="0.5"/>
  <polygon points="1820,520 1870,570 1820,620 1770,570" fill="none" stroke="#14b8a6" stroke-width="0.6" stroke-opacity="0.4"/>
</svg>`,
  },
  {
    filename: 'university_dash_bg.jpg',
    // Warm amber-gold: knowledge particles, academic mandala for university
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg0" cx="50%" cy="60%" r="80%">
      <stop offset="0%" stop-color="#110d02"/>
      <stop offset="55%" stop-color="#0c0802"/>
      <stop offset="100%" stop-color="#060401"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d97706" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#b45309" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="80"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="45"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg0)"/>
  <ellipse cx="960" cy="300" rx="600" ry="500" fill="url(#g1)" filter="url(#blur1)"/>
  <ellipse cx="200" cy="900" rx="400" ry="360" fill="url(#g2)" filter="url(#blur2)"/>
  <ellipse cx="1700" cy="700" rx="380" ry="340" fill="url(#g3)" filter="url(#blur2)"/>
  <!-- Mandala ring arcs (academic compass) -->
  ${[120,200,280,360].map((r, i) => `
    <circle cx="960" cy="540" r="${r}" fill="none" stroke="#f59e0b" stroke-width="${0.6-i*0.1}" stroke-opacity="${0.25-i*0.04}" stroke-dasharray="${8+i*4} ${12+i*6}"/>
  `).join('')}
  <!-- Radial spokes -->
  ${Array.from({length:12}, (_,i) => {
    const a = i * 30 * Math.PI/180;
    const x2 = 960 + 380*Math.cos(a);
    const y2 = 540 + 380*Math.sin(a);
    return `<line x1="960" y1="540" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#d97706" stroke-width="0.5" stroke-opacity="0.2"/>`;
  }).join('')}
  <!-- Flowing amber trails -->
  <path d="M0,200 Q480,100 960,300 T1920,180" stroke="#f59e0b" stroke-width="1.5" fill="none" stroke-opacity="0.4" filter="url(#glow)"/>
  <path d="M0,800 Q600,650 1100,780 T1920,700" stroke="#d97706" stroke-width="1" fill="none" stroke-opacity="0.35" filter="url(#glow)"/>
  <!-- Knowledge particles -->
  ${Array.from({length: 80}, (_, i) => {
    const angle = i * 4.71; // golden angle in degrees
    const radius = 30 + i * 6;
    const x = 960 + radius * Math.cos(angle * Math.PI/180);
    const y = 540 + radius * Math.sin(angle * Math.PI/180);
    if(x < 0 || x > 1920 || y < 0 || y > 1080) return '';
    const r = 1 + (i%4)*0.5;
    const op = 0.4 + (i%5)*0.1;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#fbbf24" fill-opacity="${op.toFixed(1)}" filter="url(#glow)"/>`;
  }).join('')}
  <!-- Scattered gold dust -->
  ${Array.from({length: 60}, (_, i) => {
    const x = (i * 317.5) % 1920;
    const y = (i * 227.3) % 1080;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${0.5+(i%3)*0.5}" fill="#fbbf24" fill-opacity="${0.2+(i%4)*0.1}"/>`;
  }).join('')}
  <!-- Academic diamond accent -->
  <polygon points="960,400 990,430 960,460 930,430" fill="url(#g2)" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.7"/>
</svg>`,
  },
  {
    filename: 'admin_dash_bg.jpg',
    // Crimson-red cybersecurity: shield patterns, matrix lines for admin
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg0" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#110202"/>
      <stop offset="55%" stop-color="#0a0101"/>
      <stop offset="100%" stop-color="#050000"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#dc2626" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#9f1239" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#9f1239" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="75"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="45"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg0)"/>
  <ellipse cx="960" cy="540" rx="600" ry="520" fill="url(#g1)" filter="url(#blur1)"/>
  <ellipse cx="200" cy="200" rx="350" ry="320" fill="url(#g2)" filter="url(#blur2)"/>
  <ellipse cx="1700" cy="900" rx="380" ry="340" fill="url(#g1)" filter="url(#blur2)" opacity="0.6"/>
  <!-- Matrix cascading columns -->
  ${Array.from({length: 24}, (_, col) => {
    const x = col * 82;
    return Array.from({length: 12}, (_, row) => {
      const y = row * 95 + (col%3)*30;
      const chars = ['0','1','A','F','7','E','C'];
      const ch = chars[(col*row)%chars.length];
      const op = 0.08 + ((col+row)%5)*0.04;
      return `<text x="${x}" y="${y}" font-family="monospace" font-size="13" fill="#dc2626" fill-opacity="${op.toFixed(2)}">${ch}</text>`;
    }).join('');
  }).join('')}
  <!-- Shield silhouettes (abstract) -->
  <path d="M960,100 L1060,160 L1060,300 Q1060,400 960,440 Q860,400 860,300 L860,160 Z" fill="none" stroke="#dc2626" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M960,130 L1030,178 L1030,295 Q1030,375 960,408 Q890,375 890,295 L890,178 Z" fill="#dc2626" fill-opacity="0.06"/>
  <path d="M1600,600 L1660,640 L1660,730 Q1660,790 1600,815 Q1540,790 1540,730 L1540,640 Z" fill="none" stroke="#9f1239" stroke-width="0.7" stroke-opacity="0.4"/>
  <!-- Alert scan lines -->
  <path d="M0,350 Q480,260 960,380 T1920,300" stroke="#ef4444" stroke-width="1.2" fill="none" stroke-opacity="0.4" filter="url(#glow)"/>
  <path d="M0,750 Q600,620 1100,740 T1920,680" stroke="#dc2626" stroke-width="0.8" fill="none" stroke-opacity="0.3" filter="url(#glow)"/>
  <!-- Security nodes -->
  ${[
    [200,280],[500,200],[800,320],[1100,240],[1400,300],[1700,220],
    [300,600],[650,520],[950,640],[1250,560],[1600,620],
    [150,880],[480,820],[780,920],[1100,860],[1500,900]
  ].map(([x,y]) => `
    <circle cx="${x}" cy="${y}" r="3.5" fill="#ef4444" fill-opacity="0.7" filter="url(#glow)"/>
    <circle cx="${x}" cy="${y}" r="10" fill="#dc2626" fill-opacity="0.1"/>
    <circle cx="${x}" cy="${y}" r="22" fill="#dc2626" fill-opacity="0.04"/>
  `).join('')}
  <!-- Connecting security mesh -->
  <line x1="200" y1="280" x2="500" y2="200" stroke="#ef4444" stroke-width="0.4" stroke-opacity="0.25"/>
  <line x1="500" y1="200" x2="800" y2="320" stroke="#dc2626" stroke-width="0.4" stroke-opacity="0.2"/>
  <line x1="800" y1="320" x2="1100" y2="240" stroke="#ef4444" stroke-width="0.4" stroke-opacity="0.25"/>
  <!-- Hexagons (lock pattern) -->
  <polygon points="960,620 990,637 990,671 960,688 930,671 930,637" fill="none" stroke="#ef4444" stroke-width="0.8" stroke-opacity="0.5"/>
  <polygon points="1820,100 1855,120 1855,160 1820,180 1785,160 1785,120" fill="none" stroke="#dc2626" stroke-width="0.6" stroke-opacity="0.4"/>
</svg>`,
  },
];

// Write SVG files (Next.js can serve these as background-image via CSS trick,
// but we'll also write them as the referenced filenames so CSS can find them)
for (const bg of BACKGROUNDS) {
  const svgPath = path.join(OUT, bg.filename.replace('.jpg', '.svg'));
  fs.writeFileSync(svgPath, bg.svg, 'utf8');
  console.log('Wrote', svgPath);
}

console.log('\nAll 4 SVG backgrounds written. Reference them in CSS as:');
for (const bg of BACKGROUNDS) {
  console.log(`  url('/images/${bg.filename.replace('.jpg','.svg')}')`);
}

