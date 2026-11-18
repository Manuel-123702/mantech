const fs = require('fs');
const filePath = 'app/success-stories/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all unsplash avatar URLs with local intern SVG avatars, cycling through 1-20
let counter = 0;
content = content.replace(
  /avatarUrl:\s*'https:\/\/images\.unsplash\.com\/[^']+'/g,
  () => {
    counter++;
    const idx = ((counter - 1) % 20) + 1;
    return `avatarUrl: '/images/avatars/intern_${idx}.svg'`;
  }
);

fs.writeFileSync(filePath, content);
console.log(`Replaced ${counter} Unsplash avatarUrl values with local SVG paths.`);
