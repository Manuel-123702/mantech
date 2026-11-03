const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'public', 'images');

// Fields page: cyan-teal tech disciplines wallpaper
const fieldsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#011520"/>
      <stop offset="55%" stop-color="#010d16"/>
      <stop offset="100%" stop-color="#00080e"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0891b2" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0891b2" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0e7490" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0e7490" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="80"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="50"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <ellipse cx="400" cy="300" rx="500" ry="420" fill="url(#g1)" filter="url(#blur1)"/>
  <ellipse cx="1600" cy="780" rx="450" ry="400" fill="url(#g2)" filter="url(#blur1)"/>
  <ellipse cx="960" cy="540" rx="280" ry="260" fill="url(#g1)" filter="url(#blur2)" opacity="0.5"/>
  ${Array.from({length:16}, (_,i)=>`<line x1="${i*130}" y1="0" x2="${i*130}" y2="1080" stroke="#06b6d4" stroke-width="0.4" stroke-opacity="0.12"/>`).join('')}
  ${Array.from({length:12}, (_,i)=>`<line x1="0" y1="${i*95}" x2="1920" y2="${i*95}" stroke="#0891b2" stroke-width="0.3" stroke-opacity="0.1"/>`).join('')}
  <path d="M0,250 Q500,130 960,300 T1920,200" stroke="#22d3ee" stroke-width="1.5" fill="none" stroke-opacity="0.4" filter="url(#glow)"/>
  <path d="M0,800 Q550,650 1050,780 T1920,720" stroke="#06b6d4" stroke-width="1" fill="none" stroke-opacity="0.35" filter="url(#glow)"/>
  ${[
    [180,160],[450,240],[720,140],[980,260],[1240,180],[1500,270],[1780,160],
    [280,520],[560,440],[840,560],[1120,480],[1400,540],[1680,460],
    [140,860],[420,780],[720,900],[1020,820],[1360,870],[1700,800]
  ].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#22d3ee" fill-opacity="0.7" filter="url(#glow)"/><circle cx="${x}" cy="${y}" r="12" fill="#0891b2" fill-opacity="0.1"/>`).join('')}
  ${Array.from({length:80}, (_,i)=>{
    const x=((i*331.7)%1920).toFixed(1);
    const y=((i*219.3)%1080).toFixed(1);
    const r=0.4+(i%3)*0.4;
    const op=(0.15+(i%5)*0.07).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" fill-opacity="${op}"/>`;
  }).join('')}
</svg>`;

// Intern Passports: deep cosmic purple-blue wallpaper
const passportsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg" cx="60%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#0c0520"/>
      <stop offset="55%" stop-color="#070318"/>
      <stop offset="100%" stop-color="#030110"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="80"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="50"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <ellipse cx="1500" cy="200" rx="500" ry="440" fill="url(#g1)" filter="url(#blur1)"/>
  <ellipse cx="250" cy="850" rx="460" ry="400" fill="url(#g2)" filter="url(#blur1)"/>
  <ellipse cx="960" cy="540" rx="350" ry="300" fill="url(#g3)" filter="url(#blur2)"/>
  ${[200,320,440,560].map((r,i)=>`<circle cx="960" cy="540" r="${r}" fill="none" stroke="#8b5cf6" stroke-width="${0.6-i*0.1}" stroke-opacity="${0.2-i*0.04}" stroke-dasharray="${10+i*5} ${15+i*7}"/>`).join('')}
  ${Array.from({length:18}, (_,i)=>`<line x1="${i*115}" y1="0" x2="${i*115}" y2="1080" stroke="#7c3aed" stroke-width="0.35" stroke-opacity="0.12"/>`).join('')}
  ${Array.from({length:12}, (_,i)=>`<line x1="0" y1="${i*92}" x2="1920" y2="${i*92}" stroke="#6366f1" stroke-width="0.3" stroke-opacity="0.1"/>`).join('')}
  <path d="M0,300 Q480,180 960,360 T1920,250" stroke="#a78bfa" stroke-width="1.5" fill="none" stroke-opacity="0.45" filter="url(#glow)"/>
  <path d="M0,750 Q600,580 1100,720 T1920,640" stroke="#818cf8" stroke-width="1" fill="none" stroke-opacity="0.35" filter="url(#glow)"/>
  ${[
    [160,180],[420,280],[700,160],[960,300],[1220,210],[1520,280],[1800,170],
    [260,500],[540,420],[820,560],[1100,470],[1420,540],[1720,460],
    [120,850],[440,770],[760,900],[1060,820],[1420,860],[1740,790]
  ].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#a78bfa" fill-opacity="0.75" filter="url(#glow)"/><circle cx="${x}" cy="${y}" r="14" fill="#7c3aed" fill-opacity="0.1"/>`).join('')}
  ${Array.from({length:90}, (_,i)=>{
    const x=((i*289.5)%1920).toFixed(1);
    const y=((i*231.7)%1080).toFixed(1);
    const r=0.5+(i%3)*0.4;
    const op=(0.2+(i%5)*0.08).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#c4b5fd" fill-opacity="${op}"/>`;
  }).join('')}
</svg>`;

fs.writeFileSync(path.join(OUT, 'fields_dash_bg.svg'), fieldsSvg, 'utf8');
fs.writeFileSync(path.join(OUT, 'passports_dash_bg.svg'), passportsSvg, 'utf8');
console.log('fields_dash_bg.svg written');
console.log('passports_dash_bg.svg written');

