const fs = require('fs');

// Generate grid lines
const vLines = Array.from({length:20}, (_,i) =>
  `<line x1="${i*100}" y1="0" x2="${i*100}" y2="1080" stroke="white" stroke-width="0.3" stroke-opacity="0.06"/>`
).join('\n  ');

const hLines = Array.from({length:12}, (_,i) =>
  `<line x1="0" y1="${i*100}" x2="1920" y2="${i*100}" stroke="white" stroke-width="0.3" stroke-opacity="0.05"/>`
).join('\n  ');

const stars = Array.from({length:100}, (_,i) => {
  const x = ((i*317.5) % 1920).toFixed(1);
  const y = ((i*207.3) % 1080).toFixed(1);
  const r = 0.5 + (i%3)*0.4;
  const op = (0.2 + (i%5)*0.08).toFixed(2);
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" fill-opacity="${op}"/>`;
}).join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="bg0" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#080614"/>
      <stop offset="60%" stop-color="#050410"/>
      <stop offset="100%" stop-color="#020208"/>
    </radialGradient>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d97706" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#dc2626" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="80"/></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg0)"/>
  <!-- 4 colored quadrant glows -->
  <ellipse cx="300" cy="280" rx="380" ry="340" fill="url(#g1)" filter="url(#blur1)"/>
  <ellipse cx="1620" cy="280" rx="380" ry="340" fill="url(#g2)" filter="url(#blur1)"/>
  <ellipse cx="300" cy="800" rx="380" ry="340" fill="url(#g3)" filter="url(#blur1)"/>
  <ellipse cx="1620" cy="800" rx="380" ry="340" fill="url(#g4)" filter="url(#blur1)"/>
  <!-- Nexus rings -->
  <circle cx="960" cy="540" r="200" fill="none" stroke="white" stroke-width="0.5" stroke-opacity="0.12" stroke-dasharray="8 12"/>
  <circle cx="960" cy="540" r="320" fill="none" stroke="white" stroke-width="0.4" stroke-opacity="0.08" stroke-dasharray="12 16"/>
  <circle cx="960" cy="540" r="440" fill="none" stroke="white" stroke-width="0.3" stroke-opacity="0.06" stroke-dasharray="16 20"/>
  <!-- Grid -->
  ${vLines}
  ${hLines}
  <!-- Stars -->
  ${stars}
</svg>`;

fs.writeFileSync('public/images/portal_dash_bg.svg', svg, 'utf8');
console.log('portal_dash_bg.svg written');

