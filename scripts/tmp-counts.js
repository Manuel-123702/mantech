const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const f = await p.field.count();
  const c = await p.companyProfile.count();
  const u = await p.universityProfile.count();
  const all = await p.internshipOpportunity.count();
  const byType = await p.internshipOpportunity.groupBy({ by: ['listingType'], _count: true }).catch(() => []);
  const t = await p.testimonial.count().catch(() => -1);
  console.log(JSON.stringify({ fields: f, companies: c, universities: u, listings: all, byType, testimonials: t }));
  await p.$disconnect();
})().catch((e) => { console.error('ERR', e.message.slice(0, 300)); process.exit(1); });
