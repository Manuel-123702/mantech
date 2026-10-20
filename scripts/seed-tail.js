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
