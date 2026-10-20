fields_part3 = [
    ('Special Education & Instructional Design','special-ed','Education & Academia',['Special Needs Education','Instructional Design','Learning Technology','Educational Psychology']),
    ('Automation, Robotics & PLC','robotics','Operations & Engineering',['Industrial Robotics Programming','Automated Production Lines','Computer-Aided Design (CAD)','Mechatronics Engineering']),
    ('Insurance & Risk Management','insurance-risk','Business & Finance',['Life & Non-Life Insurance','Actuarial Science','Risk Management & Mitigation','Claims Handling & Investigation']),
    ('Remote Sensing & Geospatial Analysis','remote-sensing','Operations & Engineering',['Satellite Imagery Analysis','GIS & Spatial Modelling','Drone Surveying & Mapping','Disaster Risk Mapping']),
    ('Aviation & Airport Operations','aviation','Operations & Engineering',['Airport Operations','Aviation Safety & Security','Airline Management','Cargo Handling & Logistics']),
    ('Renewable Energy Project Development','energy-ppp','Energy & Heavy Industry',['Solar PPA & Project Finance','Wind Farm Development','Energy Storage Systems','Independent Power Producer (IPP) Management']),
    ('Urban Planning & Smart Cities','smart-city','Operations & Engineering',['Urban Design & Zoning','Smart City ICT','Sustainable Mobility Planning','Housing Policy & Development']),
    ('Data Journalism & Investigative Reporting','data-journalism','Media & Arts',['Data-Driven Storytelling','Visualization & Infographics','Source Development & Verification','Investigative Methods']),
    ('Game Design & Interactive Media','games','Media & Arts',['Game Mechanics & Systems Design','Unity/Unreal Development','Level Design & UX','Indie Publishing & Marketing']),
]
lines = []
for name, slug, cat, specs in fields_part3:
    lines.append("  { name: " + repr(name) + ", slug: " + repr(slug) + ", category: " + repr(cat) + ", specs: " + repr(specs) + " },")
lines.append("];")
lines.append("")
lines.append("async function main() {")
lines.append("  let created = 0;")
lines.append("  for (const f of FIELDS) {")
lines.append("    const field = await p.field.upsert({")
lines.append("      where: { id: f.slug },")
lines.append("      update: { name: f.name, category: f.category, slug: f.slug },")
lines.append("      create: { name: f.name, slug: f.slug, category: f.category },")
lines.append("    });")
lines.append("    if (field.id) created++;")
lines.append("    for (const spec of f.specs) {")
lines.append("      await p.specialization.upsert({")
lines.append("        where: { fieldId_name: { fieldId: field.id, name: spec } },")
lines.append("        update: { slug: spec.toLowerCase().replace(/[^a-z0-9]/g, '') },")
lines.append("        create: { name: spec, slug: spec.toLowerCase().replace(/[^a-z0-9]/g, ''), fieldId: field.id },")
lines.append("      });")
lines.append("    }")
lines.append("  }")
lines.append("  console.log('Seeded ' + created + ' fields with specializations');")
lines.append("  await p.$disconnect();")
lines.append("}")
lines.append("main().catch(e => { console.error('ERR', e.message); process.exit(1); });")
with open('c:/mantech_nexus/scripts/seed-fields.mjs','a',encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print('appended', len(lines), 'lines (fields 31-45 + main function)')