const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const orgs = await prisma.organization.count();
    const companies = await prisma.organization.count({ where: { type: 'COMPANY' } });
    const universities = await prisma.organization.count({ where: { type: 'UNIVERSITY' } });
    const opportunities = await prisma.internshipOpportunity.count();
    const jobs = await prisma.job.count();
    console.log(JSON.stringify({ orgs, companies, universities, opportunities, jobs }, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
