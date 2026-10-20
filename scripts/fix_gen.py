s = open('c:/mantech_nexus/scripts/gen_seed.py','r').read()
# Replace from "code += '];'" through the end with proper code += string
old = """code += '];'
async function main() {
  let created = 0;
  for (const f of FIELDS) {
    const field = await p.field.upsert({
      where: { id: f.slug },
      update: { name: f.name, category: f.category, slug: f.slug },
      create: { name: f.name, slug: f.slug, category: f.category },
    });
    if (field.id) created++;
    for (const spec of f.specs) {
      await p.specialization.upsert({
        where: { fieldId_name: { fieldId: field.id, name: spec } },
        update: { slug: spec.toLowerCase().replace(/[^a-z0-9]/g, '') },
        create: { name: spec, slug: spec.toLowerCase().replace(/[^a-z0-9]/g, ''), fieldId: field.id },
      });
    }
  }
  console.log('Seeded ' + created + ' fields with specializations');
  await p.$disconnect();
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });
\"\"
\"""
with open('c:/mantech_nexus/scripts/seed-fields.mjs','w',encoding='utf-8') as fh:
    fh.write(code)
print('wrote', len(code), 'bytes')"""

new = """code += '];\\n'
code += '''\async function main() {
  let created = 0;
  for (const f of FIELDS) {
    const field = await p.field.upsert({
      where: { id: f.slug },
      update: { name: f.name, category: f.category, slug: f.slug },
      create: { name: f.name, slug: f.slug, category: f.category },
    });
    if (field.id) created++;
    for (const spec of f.specs) {
      await p.specialization.upsert({
        where: { fieldId_name: { fieldId: field.id, name: spec } },
        update: { slug: spec.toLowerCase().replace(/[^a-z0-9]/g, '') },
        create: { name: spec, slug: spec.toLowerCase().replace(/[^a-z0-9]/g, ''), fieldId: field.id },
      });
    }
  }
  console.log('Seeded ' + created + ' fields with specializations');
  await p.$disconnect();
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });
'''
with open('c:/mantech_nexus/scripts/seed-fields.mjs','w',encoding='utf-8') as fh:
    fh.write(code)
print('wrote', len(code), 'bytes')"""

if old in s:
    s = s.replace(old, new)
    open('c:/mantech_nexus/scripts/gen_seed.py','w').write(s)
    print('replaced successfully')
else:
    print('old text not found')
    # Debug: find where '];' is
    idx = s.find("code += '];'")
    if idx >= 0:
        print('found at', idx)
        print('context:', repr(s[idx:idx+50]))
    idx2 = s.find('"""')
    if idx2 >= 0:
        print('found """ at', idx2)