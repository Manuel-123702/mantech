const fs = require('fs');
const content = fs.readFileSync('./lib/cameroon-directory.ts', 'utf-8');

// Parse TOP_30_COMPANIES
const compSection = content.split('export const TOP_30_COMPANIES')[1].split('export const TOP_30_UNIVERSITIES')[0];
const compMatches = [...compSection.matchAll(/name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"[\s\S]*?logoUrl:\s*"([^"]*)"/g)];

console.log('--- COMPANIES ---');
compMatches.forEach((m, idx) => {
  console.log(`${idx + 1}. ${m[1]} | slug: ${m[2]} | logoUrl: ${m[3]}`);
});

// Parse TOP_30_UNIVERSITIES
const uniSection = content.split('export const TOP_30_UNIVERSITIES')[1].split('export const VERIFIED_COMMUNITY_STORIES')[0];
const uniMatches = [...uniSection.matchAll(/name:\s*"([^"]+)",\s*shortName:\s*"([^"]+)",\s*slug:\s*"([^"]+)"[\s\S]*?logoUrl:\s*"([^"]*)"/g)];

console.log('--- UNIVERSITIES ---');
uniMatches.forEach((m, idx) => {
  console.log(`${idx + 1}. ${m[1]} (${m[2]}) | slug: ${m[3]} | logoUrl: ${m[4]}`);
});
