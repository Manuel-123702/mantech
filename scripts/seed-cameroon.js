/**
 * Full Cameroon Marketplace Database Seeder
 * Seeds:
 * - 10 Regions
 * - 15 Career Fields & Specializations
 * - 127 Cameroon Enterprises (with CompanyProfiles, TechStacks, Perks, Logos & Links)
 * - 30 Cameroon Universities (with UniversityProfiles, Faculties, Logos & Links)
 * - 130 Real Jobs across all sectors in Cameroon (Active & Expired)
 * - 75 Real Internships across all sectors in Cameroon (Active & Expired)
 * - 90 Real Opportunities & Fellowships across Universities & Companies (Active & Expired)
 *
 * Idempotent: uses upsert on unique slugs.
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const base = process.env.DIRECT_URL || process.env.DATABASE_URL;
const directUrl = base ? base.replace(/connect_timeout=\d+/, 'connect_timeout=30') : undefined;

const prisma = new PrismaClient(
  directUrl ? { datasources: { db: { url: directUrl } } } : undefined
);

const { COMPANIES } = require('./data/companies.js');
const { UNIVERSITIES } = require('./data/universities.js');
const { JOBS } = require('./data/jobs.js');
const { INTERNSHIPS } = require('./data/internships.js');
const { OPPORTUNITIES } = require('./data/opportunities.js');

const REGIONS = [
  { code: 'REG_CENTRE', name: 'Centre', capital: 'Yaoundé' },
  { code: 'REG_LITTORAL', name: 'Littoral', capital: 'Douala' },
  { code: 'REG_SOUTH_WEST', name: 'South-West', capital: 'Buea' },
  { code: 'REG_WEST', name: 'West', capital: 'Bafoussam' },
  { code: 'REG_NORTH_WEST', name: 'North-West', capital: 'Bamenda' },
  { code: 'REG_ADAMAWA', name: 'Adamawa', capital: 'Ngaoundéré' },
  { code: 'REG_NORTH', name: 'North', capital: 'Garoua' },
  { code: 'REG_FAR_NORTH', name: 'Far North', capital: 'Maroua' },
  { code: 'REG_SOUTH', name: 'South', capital: 'Ebolowa' },
  { code: 'REG_EAST', name: 'East', capital: 'Bertoua' },
];

const FIELDS_CONFIG = [
  {
    name: 'Software & Cloud Engineering',
    slug: 'software-cloud-engineering',
    category: 'Technology & IT',
    specializations: ['Full-Stack Development', 'Mobile App Development', 'Cloud Architecture & DevOps', 'Embedded Systems & IoT'],
  },
  {
    name: 'Cybersecurity & Network Systems',
    slug: 'cybersecurity-networks',
    category: 'Technology & IT',
    specializations: ['Network Infrastructure & Routing', 'SOC Analysis & Incident Response', 'Information Security Auditing', 'Telecom Systems'],
  },
  {
    name: 'Data Science & Artificial Intelligence',
    slug: 'data-science-ai',
    category: 'Technology & IT',
    specializations: ['Machine Learning Engineering', 'Business Intelligence & Analytics', 'Data Engineering & Pipelines', 'Statistical Modeling'],
  },
  {
    name: 'Finance, Banking & Accounting',
    slug: 'finance-accounting',
    category: 'Business & Finance',
    specializations: ['Corporate Finance & M&A', 'OHADA Accounting & Audit', 'Credit Risk & Retail Banking', 'Microfinance Operations', 'Treasury & Forex'],
  },
  {
    name: 'Marketing, Growth & Communications',
    slug: 'marketing-communications',
    category: 'Business & Finance',
    specializations: ['Digital Marketing & SEO', 'Brand & Product Marketing', 'Corporate Communications & PR', 'Community Management'],
  },
  {
    name: 'Human Resources & Talent Management',
    slug: 'human-resources',
    category: 'Business & Finance',
    specializations: ['Talent Acquisition & Recruiting', 'Payroll & Labor Law (Cameroon)', 'Training & People Development', 'HR Operations'],
  },
  {
    name: 'Supply Chain, Logistics & Procurement',
    slug: 'supply-chain-logistics',
    category: 'Operations & Engineering',
    specializations: ['Port Logistics & Customs Transit (CEMAC)', 'Warehousing & Inventory Control', 'Freight Forwarding & Transport', 'Strategic Procurement'],
  },
  {
    name: 'Civil, Mechanical & Electrical Engineering',
    slug: 'engineering-industrial',
    category: 'Operations & Engineering',
    specializations: ['Structural & Civil Works (BTP)', 'Electrical Power Systems (Grid & Solar)', 'Mechanical Maintenance & Hydraulics', 'Industrial Automation & PLC'],
  },
  {
    name: 'Healthcare, Biotech & Pharmaceuticals',
    slug: 'healthcare-biotech',
    category: 'Health & Science',
    specializations: ['Clinical Medicine & Nursing', 'Pharmacy & Pharmacovigilance', 'Medical Laboratory Biology', 'Public Health & Epidemiology', 'Biomedical Engineering'],
  },
  {
    name: 'Corporate Law, Compliance & Governance',
    slug: 'legal-compliance',
    category: 'Legal & Policy',
    specializations: ['OHADA Corporate Law', 'Data Protection & Privacy', 'Contracts & Intellectual Property', 'Regulatory Compliance'],
  },
  {
    name: 'Agro-Industry, Agriculture & Environment',
    slug: 'agriculture-environment',
    category: 'Agriculture & Nature',
    specializations: ['Agronomy & Crop Science', 'Agro-Industrial Food Processing', 'Forestry & Wood Technology', 'Environmental Impact Assessment', 'Livestock & Veterinary'],
  },
  {
    name: 'Mining, Petroleum & Chemical Engineering',
    slug: 'mining-petroleum-chemical',
    category: 'Energy & Heavy Industry',
    specializations: ['Petroleum Geosciences', 'Drilling & Well Operations', 'Refinery Process Engineering', 'Mining Geology & Extraction', 'Metallurgy'],
  },
  {
    name: 'Media, Journalism & Bilingual Communication',
    slug: 'media-journalism-communication',
    category: 'Media & Arts',
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
  console.log('🚀 Starting MANTECH Nexus Cameroon Master Database Seed...');

  // 1. Seed / Upsert Regions
  console.log('📍 Seeding 10 Administrative Regions of Cameroon...');
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
  console.log('📚 Seeding 15 Career Fields & Specializations...');
  const fieldMap = new Map();
  const existingFields = await prisma.field.findMany();
  for (const f of existingFields) {
    fieldMap.set(norm(f.name), f.id);
    fieldMap.set(f.slug, f.id);
  }

  for (const f of FIELDS_CONFIG) {
    let fieldId = fieldMap.get(f.slug) || fieldMap.get(norm(f.name));
    if (fieldId) {
      await prisma.field.update({
        where: { id: fieldId },
        data: { name: f.name, category: f.category },
      });
    } else {
      const field = await prisma.field.create({
        data: { name: f.name, slug: f.slug, category: f.category },
      });
      fieldId = field.id;
      fieldMap.set(norm(field.name), field.id);
      fieldMap.set(field.slug, field.id);
    }

    // Seed specializations
    for (const specName of f.specializations) {
      const specSlug = norm(specName);
      await prisma.specialization.upsert({
        where: { fieldId_name: { fieldId, name: specName } },
        update: { slug: specSlug },
        create: { name: specName, slug: specSlug, fieldId },
      });
    }
  }

  // Helper to resolve field ID
  const resolveFieldId = (fieldName) => {
    if (!fieldName) return null;
    const n = norm(fieldName);
    for (const [key, id] of fieldMap.entries()) {
      if (n.includes(key) || key.includes(n)) return id;
    }
    // Default fallback to first field
    return fieldMap.get('software-cloud-engineering') || null;
  };

  // Helper to resolve region ID
  const resolveRegionId = (regionName) => {
    if (!regionName) return regionMap.get('centre');
    const n = norm(regionName);
    for (const [key, id] of regionMap.entries()) {
      if (n.includes(key) || key.includes(n)) return id;
    }
    return regionMap.get('centre');
  };

  // 3. Seed / Upsert Industries
  console.log('🏭 Upserting Industries...');
  const industryMap = new Map();
  const existingIndustries = await prisma.industry.findMany();
  for (const ind of existingIndustries) {
    industryMap.set(norm(ind.name), ind.id);
    industryMap.set(norm(ind.slug), ind.id);
  }

  const allIndustryNames = new Set([
    ...COMPANIES.map((c) => c.industry),
    'Technology & Software', 'Fintech & Financial Services', 'Energy, Oil & Gas & Renewable',
    'Agro-Industry & Agribusiness', 'Manufacturing & FMCG', 'Construction & Real Estate',
    'Transport, Logistics & Aviation', 'Healthcare & Pharmaceuticals', 'Professional Services & Consulting',
    'Retail & E-Commerce', 'Education & E-Learning', 'Public Sector & Para-public',
    'Hospitality, Tourism & Catering', 'Creative Arts & Media'
  ]);

  for (const indName of allIndustryNames) {
    if (!indName) continue;
    const n = norm(indName);
    if (industryMap.has(n)) continue;

    const indSlug = norm(indName);
    const existingBySlug = existingIndustries.find((i) => norm(i.slug) === indSlug);
    if (existingBySlug) {
      industryMap.set(n, existingBySlug.id);
      continue;
    }

    const ind = await prisma.industry.create({
      data: { name: indName, slug: indSlug },
    });
    industryMap.set(norm(ind.name), ind.id);
    industryMap.set(norm(ind.slug), ind.id);
  }

  // 4. Seed / Upsert 127 Cameroon Enterprises (Companies)
  console.log(`🏢 Upserting ${COMPANIES.length} Cameroon Enterprises...`);
  const orgIdMap = new Map();

  for (let i = 0; i < COMPANIES.length; i++) {
    const comp = COMPANIES[i];
    if (i % 25 === 0 || i === COMPANIES.length - 1) {
      console.log(`  🏢 [${i + 1}/${COMPANIES.length}] ${comp.name}`);
    }
    const regId = resolveRegionId(comp.region);
    const indId = industryMap.get(norm(comp.industry)) || Array.from(industryMap.values())[0];

    const org = await prisma.organization.upsert({
      where: { slug: comp.slug },
      update: {
        name: comp.name,
        type: 'COMPANY',
        industryId: indId,
        regionId: regId,
        city: comp.city || 'Douala',
        address: comp.address || null,
        description: comp.description || null,
        website: comp.website || null,
        logoUrl: comp.logoUrl || null,
        size: comp.size || '51-200',
        verificationStatus: 'VERIFIED',
      },
      create: {
        name: comp.name,
        slug: comp.slug,
        type: 'COMPANY',
        industryId: indId,
        regionId: regId,
        city: comp.city || 'Douala',
        address: comp.address || null,
        description: comp.description || null,
        website: comp.website || null,
        logoUrl: comp.logoUrl || null,
        size: comp.size || '51-200',
        verificationStatus: 'VERIFIED',
      },
    });

    orgIdMap.set(comp.slug, org.id);

    // Upsert CompanyProfile
    await prisma.companyProfile.upsert({
      where: { organizationId: org.id },
      update: {
        techStack: comp.techStack || [],
        perks: comp.perks || [],
        branches: [comp.city || 'Douala'],
      },
      create: {
        organizationId: org.id,
        techStack: comp.techStack || [],
        perks: comp.perks || [],
        branches: [comp.city || 'Douala'],
      },
    });
  }

  // 5. Seed / Upsert 30 Cameroon Universities
  console.log(`🎓 Upserting ${UNIVERSITIES.length} Cameroon Universities...`);
  const eduIndId = industryMap.get(norm('Education & E-Learning')) || Array.from(industryMap.values())[0];

  for (let i = 0; i < UNIVERSITIES.length; i++) {
    const uni = UNIVERSITIES[i];
    if (i % 10 === 0 || i === UNIVERSITIES.length - 1) {
      console.log(`  🎓 [${i + 1}/${UNIVERSITIES.length}] ${uni.name}`);
    }
    const regId = resolveRegionId(uni.region);

    const org = await prisma.organization.upsert({
      where: { slug: uni.slug },
      update: {
        name: uni.name,
        type: 'UNIVERSITY',
        industryId: eduIndId,
        regionId: regId,
        city: uni.city || 'Yaoundé',
        description: uni.description || null,
        website: uni.website || null,
        logoUrl: uni.logoUrl || null,
        size: uni.size || '500+',
        verificationStatus: 'VERIFIED',
      },
      create: {
        name: uni.name,
        slug: uni.slug,
        type: 'UNIVERSITY',
        industryId: eduIndId,
        regionId: regId,
        city: uni.city || 'Yaoundé',
        description: uni.description || null,
        website: uni.website || null,
        logoUrl: uni.logoUrl || null,
        size: uni.size || '500+',
        verificationStatus: 'VERIFIED',
      },
    });

    orgIdMap.set(uni.slug, org.id);

    // Upsert UniversityProfile
    await prisma.universityProfile.upsert({
      where: { organizationId: org.id },
      update: {
        universityType: uni.universityType || 'Public State University',
        canRecruitInterns: true,
        supportsPlacementCoordination: true,
        faculties: uni.faculties || [],
      },
      create: {
        organizationId: org.id,
        universityType: uni.universityType || 'Public State University',
        canRecruitInterns: true,
        supportsPlacementCoordination: true,
        faculties: uni.faculties || [],
      },
    });
  }

  // 6. Seed / Upsert 130 Real Jobs
  console.log(`💼 Upserting ${JOBS.length} Real Jobs across Cameroon...`);
  let jobSuccess = 0;
  for (let i = 0; i < JOBS.length; i++) {
    const job = JOBS[i];
    if (i % 25 === 0 || i === JOBS.length - 1) {
      console.log(`  💼 [${i + 1}/${JOBS.length}] ${job.title}`);
    }
    const orgId = orgIdMap.get(job.orgSlug);
    if (!orgId) {
      console.warn(`Org not found for job: ${job.slug} (orgSlug: ${job.orgSlug})`);
      continue;
    }

    const fieldId = resolveFieldId(job.field);
    const regId = resolveRegionId(job.region);

    await prisma.job.upsert({
      where: { slug: job.slug },
      update: {
        organizationId: orgId,
        title: job.title,
        department: job.department || null,
        description: job.description,
        fieldId: fieldId,
        regionId: regId,
        city: job.city || 'Douala',
        location: job.location || `${job.city}, Cameroon`,
        workMode: job.workMode || 'ONSITE',
        applicationMethod: job.applicationMethod || 'COMPANY_WEBSITE',
        salaryMinXAF: job.salaryMinXAF || null,
        salaryMaxXAF: job.salaryMaxXAF || null,
        type: job.type || 'FULL_TIME',
        requiredSkills: job.requiredSkills || [],
        preferredSkills: job.preferredSkills || [],
        educationLevel: job.educationLevel || 'Bachelor / Licence',
        postingDate: job.postingDate ? new Date(job.postingDate) : new Date(),
        expiryDate: job.expiryDate ? new Date(job.expiryDate) : new Date(Date.now() + 60 * 86400000),
        moderationStatus: 'PUBLISHED',
      },
      create: {
        slug: job.slug,
        organizationId: orgId,
        title: job.title,
        department: job.department || null,
        description: job.description,
        fieldId: fieldId,
        regionId: regId,
        city: job.city || 'Douala',
        location: job.location || `${job.city}, Cameroon`,
        workMode: job.workMode || 'ONSITE',
        applicationMethod: job.applicationMethod || 'COMPANY_WEBSITE',
        salaryMinXAF: job.salaryMinXAF || null,
        salaryMaxXAF: job.salaryMaxXAF || null,
        type: job.type || 'FULL_TIME',
        requiredSkills: job.requiredSkills || [],
        preferredSkills: job.preferredSkills || [],
        educationLevel: job.educationLevel || 'Bachelor / Licence',
        postingDate: job.postingDate ? new Date(job.postingDate) : new Date(),
        expiryDate: job.expiryDate ? new Date(job.expiryDate) : new Date(Date.now() + 60 * 86400000),
        moderationStatus: 'PUBLISHED',
      },
    });
    jobSuccess++;
  }
  console.log(`✅ Jobs seeded: ${jobSuccess}`);

  // 7. Seed / Upsert 75 Internships
  console.log(`🎯 Upserting ${INTERNSHIPS.length} Internships across Cameroon...`);
  let internSuccess = 0;
  for (let i = 0; i < INTERNSHIPS.length; i++) {
    const intern = INTERNSHIPS[i];
    if (i % 25 === 0 || i === INTERNSHIPS.length - 1) {
      console.log(`  🎯 [${i + 1}/${INTERNSHIPS.length}] ${intern.title}`);
    }
    const orgId = orgIdMap.get(intern.orgSlug);
    if (!orgId) {
      console.warn(`Org not found for internship: ${intern.slug} (orgSlug: ${intern.orgSlug})`);
      continue;
    }

    const fieldId = resolveFieldId(intern.field);
    const regId = resolveRegionId(intern.region);

    await prisma.internshipOpportunity.upsert({
      where: { slug: intern.slug },
      update: {
        organizationId: orgId,
        title: intern.title,
        department: intern.department || null,
        description: intern.description,
        fieldId: fieldId,
        regionId: regId,
        city: intern.city || 'Douala',
        location: `${intern.city}, Cameroon`,
        workMode: intern.workMode || 'ONSITE',
        durationMonths: intern.durationMonths || 3,
        isPaid: !!intern.isPaid,
        allowanceXAF: intern.allowanceXAF || 0,
        positions: intern.positions || 1,
        requiredSkills: intern.requiredSkills || [],
        preferredSkills: intern.preferredSkills || [],
        educationLevel: intern.educationLevel || 'Bachelor / Licence',
        deadline: intern.deadline ? new Date(intern.deadline) : new Date(Date.now() + 45 * 86400000),
        moderationStatus: 'PUBLISHED',
        applicationMethod: intern.applicationMethod || 'COMPANY_WEBSITE',
      },
      create: {
        slug: intern.slug,
        organizationId: orgId,
        title: intern.title,
        department: intern.department || null,
        description: intern.description,
        fieldId: fieldId,
        regionId: regId,
        city: intern.city || 'Douala',
        location: `${intern.city}, Cameroon`,
        workMode: intern.workMode || 'ONSITE',
        durationMonths: intern.durationMonths || 3,
        isPaid: !!intern.isPaid,
        allowanceXAF: intern.allowanceXAF || 0,
        positions: intern.positions || 1,
        requiredSkills: intern.requiredSkills || [],
        preferredSkills: intern.preferredSkills || [],
        educationLevel: intern.educationLevel || 'Bachelor / Licence',
        deadline: intern.deadline ? new Date(intern.deadline) : new Date(Date.now() + 45 * 86400000),
        moderationStatus: 'PUBLISHED',
        applicationMethod: intern.applicationMethod || 'COMPANY_WEBSITE',
      },
    });
    internSuccess++;
  }
  console.log(`✅ Internships seeded: ${internSuccess}`);

  // 8. Seed / Upsert 90 Opportunities & Fellowships
  console.log(`🌟 Upserting ${OPPORTUNITIES.length} Academic & Professional Opportunities...`);
  let oppSuccess = 0;
  for (let i = 0; i < OPPORTUNITIES.length; i++) {
    const opp = OPPORTUNITIES[i];
    if (i % 25 === 0 || i === OPPORTUNITIES.length - 1) {
      console.log(`  🌟 [${i + 1}/${OPPORTUNITIES.length}] ${opp.title}`);
    }
    const orgId = orgIdMap.get(opp.orgSlug);
    if (!orgId) {
      console.warn(`Org not found for opportunity: ${opp.slug} (orgSlug: ${opp.orgSlug})`);
      continue;
    }

    const fieldId = resolveFieldId(opp.field);
    const regId = resolveRegionId(opp.region);
    const oppDeadline = (opp.deadline && !isNaN(new Date(opp.deadline).getTime())) ? new Date(opp.deadline) : new Date(Date.now() + 60 * 86400000);

    await prisma.internshipOpportunity.upsert({
      where: { slug: opp.slug },
      update: {
        organizationId: orgId,
        title: opp.title,
        department: opp.department || null,
        description: opp.description,
        fieldId: fieldId,
        regionId: regId,
        city: opp.city || 'Yaoundé',
        location: `${opp.city}, Cameroon`,
        workMode: opp.workMode || 'ONSITE',
        durationMonths: opp.durationMonths || 6,
        isPaid: !!opp.isPaid,
        allowanceXAF: opp.allowanceXAF || 0,
        positions: opp.positions || 2,
        requiredSkills: opp.requiredSkills || [],
        preferredSkills: opp.preferredSkills || [],
        educationLevel: opp.educationLevel || 'Master / BAC+5',
        deadline: oppDeadline,
        moderationStatus: 'PUBLISHED',
        applicationMethod: opp.applicationMethod || 'COMPANY_WEBSITE',
      },
      create: {
        slug: opp.slug,
        organizationId: orgId,
        title: opp.title,
        department: opp.department || null,
        description: opp.description,
        fieldId: fieldId,
        regionId: regId,
        city: opp.city || 'Yaoundé',
        location: `${opp.city}, Cameroon`,
        workMode: opp.workMode || 'ONSITE',
        durationMonths: opp.durationMonths || 6,
        isPaid: !!opp.isPaid,
        allowanceXAF: opp.allowanceXAF || 0,
        positions: opp.positions || 2,
        requiredSkills: opp.requiredSkills || [],
        preferredSkills: opp.preferredSkills || [],
        educationLevel: opp.educationLevel || 'Master / BAC+5',
        deadline: oppDeadline,
        moderationStatus: 'PUBLISHED',
        applicationMethod: opp.applicationMethod || 'COMPANY_WEBSITE',
      },
    });
    oppSuccess++;
  }
  console.log(`✅ Opportunities seeded: ${oppSuccess}`);

  // Summary counts
  const finalOrgs = await prisma.organization.count();
  const finalCompanies = await prisma.organization.count({ where: { type: 'COMPANY' } });
  const finalUniversities = await prisma.organization.count({ where: { type: 'UNIVERSITY' } });
  const finalJobs = await prisma.job.count();
  const finalOpps = await prisma.internshipOpportunity.count();

  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log(JSON.stringify({
    totalOrganizations: finalOrgs,
    companies: finalCompanies,
    universities: finalUniversities,
    jobs: finalJobs,
    internshipsAndOpportunities: finalOpps,
  }, null, 2));
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
