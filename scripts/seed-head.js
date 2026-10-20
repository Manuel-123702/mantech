    specializations: ['Bilingual Translation & Interpretation', 'Broadcast Journalism', 'Public Relations & Corporate Media', 'Audiovisual Production'],
  },
  {
    name: 'Education, Teaching & Academic Research',
    slug: 'education-teaching-research',
    category: 'Education & Academia',
    specializations: ['Secondary School Pedagogy', 'Higher Education Lecturing', 'Educational Administration', 'Scientific Lab Research'],
  },
  {
    name: 'Hospitality, Tourism & Catering Management',
    slug: 'hospitality-tourism-catering',
    category: 'Hospitality & Services',
    specializations: ['Hotel Operations & Front Office', 'Culinary Arts & Food Production', 'Banquet & Event Management', 'Tourism Travel Planning'],
  },
];

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function main() {
  console.log('ðŸš€ Starting MANTECH Nexus Cameroon Master Database Seed...');

  // 1. Seed / Upsert Regions
  console.log('ðŸ“ Seeding 10 Administrative Regions of Cameroon...');
  const regionMap = new Map();
  for (const r of REGIONS) {
    const reg = await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name, capital: r.capital },
      create: { code: r.code, name: r.name, capital: r.capital },
    });
    regionMap.set(norm(r.name), reg.id);
  }
  // Fallback for regions
  regionMap.set('centre', regionMap.get('centre'));
  regionMap.set('littoral', regionMap.get('littoral'));
  regionMap.set('southwest', regionMap.get('southwest'));
  regionMap.set('farnorth', regionMap.get('farnorth'));
  regionMap.set('northwest', regionMap.get('northwest'));

  // 2. Seed / Upsert Career Fields & Specializations
  console.log('ðŸ“š Seeding 15 Career Fields & Specializations...');
  const fieldMap = new Map();
  const existingFields = await prisma.field.findMany();
  for (const f of existingFields) {
    fieldMap.set(norm(f.name), f.id);
