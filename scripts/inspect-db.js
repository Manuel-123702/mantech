const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Use DIRECT_URL with 30s timeout
const base = process.env.DIRECT_URL || process.env.DATABASE_URL;
const directUrl = base.replace(/connect_timeout=\d+/, 'connect_timeout=30');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  for (let i = 1; i <= 5; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Connected to DB');
      break;
    } catch (e) {
      console.log(`Ping ${i} failed, waiting 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  const industries = await prisma.industry.findMany();
  console.log('Industries:', industries.map(i => i.name));
  const fields = await prisma.field.findMany({ select: { name: true, slug: true } });
  console.log('Fields:', fields.map(f => f.name));
  const regions = await prisma.region.findMany({ select: { name: true, code: true } });
  console.log('Regions:', regions.map(r => r.name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
