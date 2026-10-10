/**
 * Demo marketplace data — organizations and internship opportunities.
 *
 * Run separately from the taxonomy seed:
 *   npm run db:seed:demo
 *
 * WHY THIS EXISTS
 * `prisma/seed.ts` only seeds taxonomy (regions, fields, skills, industries,
 * qualifications, packages). It intentionally creates no business records,
 * because SRS Â§5 forbids hardcoded business data. A fresh install therefore has
 * an empty marketplace, and /internships correctly reports "No matching
 * internships found".
 *
 * These are DEMO records for local development only:
 *   - They link to real taxonomy rows by name, never inventing ids.
 *   - Organizations are created PENDING and opportunities DRAFT, so they are
 *     NOT publicly visible and cannot leak into production stats. Publish them
 *     through the admin dashboard if you want to see them live.
 *
 * Everything is idempotent (upsert by slug), so it is safe to re-run.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(
  process.env.DIRECT_URL ? { datasourceUrl: process.env.DIRECT_URL } : undefined,
);

/** Adds `days` to today so demo deadlines never expire. */
function inDays(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

type DemoOrg = {
  name: string;
  slug: string;
  type: "COMPANY" | "UNIVERSITY";
  industry: string;
  region: string;
  city: string;
  description: string;
  website: string;
  size: string;
};

const ORGANIZATIONS: DemoOrg[] = [
  {
    name: "Mantech Labs Cameroon",
    slug: "mantech-labs-cameroon",
    type: "COMPANY",
    industry: "Technology & Software",
    region: "Centre",
    city: "Yaounde",
    description:
      "Software studio building logistics and workforce platforms for Cameroonian businesses.",
    website: "https://example.com/mantech-labs",
    size: "11-50",
  },
  {
    name: "Douala Digital Services",
    slug: "douala-digital-services",
    type: "COMPANY",
    industry: "Fintech & Financial Services",
    region: "Littoral",
    city: "Douala",
    description:
      "Telecommunications and digital services operator serving businesses across Littoral.",
    website: "https://example.com/douala-digital",
    size: "51-200",
  },
  {
    name: "Bafoussam AgriTech",
    slug: "bafoussam-agritech",
    type: "COMPANY",
    industry: "Agro-Industry & Agribusiness",
    region: "West",
    city: "Bafoussam",
    description:
      "Agricultural technology cooperative modernising cocoa and coffee value chains.",
    website: "https://example.com/bafoussam-agritech",
    size: "11-50",
  },
  {
    name: "University of Buea",
    slug: "university-of-buea",
    type: "UNIVERSITY",
    industry: "Higher Education & Research",
    region: "South-West",
    city: "Buea",
    description:
      "Public university hosting student placements and institutional recruitment.",
    website: "https://example.com/ub",
    size: "201-500",
  },
];

type DemoOpportunity = {
  slug: string;
  orgSlug: string;
  title: string;
  department: string;
  description: string;
  field: string;
  region: string;
  city: string;
  workMode: "ONSITE" | "HYBRID" | "REMOTE";
  durationMonths: number;
  isPaid: boolean;
  allowanceXAF: number;
  positions: number;
  skills: string[];
};

const OPPORTUNITIES: DemoOpportunity[] = [
  {
    slug: "backend-engineering-intern-douala",
    orgSlug: "douala-digital-services",
    title: "Backend Engineering Intern",
    department: "Engineering",
    description:
      "Join the platform team building APIs and internal tooling. You will pair with senior engineers, write tested code, and take part in code review.",
    field: "Software & Cloud Engineering",
    region: "Littoral",
    city: "Douala",
    workMode: "HYBRID",
    durationMonths: 6,
    isPaid: true,
    allowanceXAF: 150000,
    positions: 3,
    skills: ["JavaScript", "SQL", "Git"],
  },
  {
    slug: "frontend-developer-intern-yaounde",
    orgSlug: "mantech-labs-cameroon",
    title: "Frontend Developer Intern",
    department: "Product",
    description:
      "Build accessible user interfaces with React and Tailwind. Strong fit for interns who care about UI quality and performance.",
    field: "Software & Cloud Engineering",
    region: "Centre",
    city: "Yaounde",
    workMode: "REMOTE",
    durationMonths: 3,
    isPaid: false,
    allowanceXAF: 0,
    positions: 2,
    skills: ["JavaScript", "React", "CSS"],
  },
  {
    slug: "data-analyst-intern-yaounde",
    orgSlug: "mantech-labs-cameroon",
    title: "Data Analyst Intern",
    department: "Data",
    description:
      "Turn marketplace data into dashboards and reports. You will write SQL, clean datasets, and present findings to non-technical stakeholders.",
    field: "Data Science & Artificial Intelligence",
    region: "Centre",
    city: "Yaounde",
    workMode: "HYBRID",
    durationMonths: 6,
    isPaid: true,
    allowanceXAF: 120000,
    positions: 1,
    skills: ["SQL", "Excel", "Python"],
  },
  {
    slug: "agriculture-field-intern-bafoussam",
    orgSlug: "bafoussam-agritech",
    title: "Agronomy Field Intern",
    department: "Operations",
    description:
      "Support field trials and farmer training programmes. Ideal for students in agriculture, agroforestry or rural development.",
    field: "Supply Chain, Logistics & Procurement",
    region: "West",
    city: "Bafoussam",
    workMode: "ONSITE",
    durationMonths: 4,
    isPaid: true,
    allowanceXAF: 90000,
    positions: 4,
    skills: ["Communication", "Project Management"],
  },
  {
    slug: "accounting-intern-douala",
    orgSlug: "douala-digital-services",
    title: "Accounting & Finance Intern",
    department: "Finance",
    description:
      "Assist with bookkeeping, invoicing and month-end reporting under the supervision of the finance team.",
    field: "Finance, Banking & Accounting",
    region: "Littoral",
    city: "Douala",
    workMode: "ONSITE",
    durationMonths: 6,
    isPaid: false,
    allowanceXAF: 0,
    positions: 1,
    skills: ["Accounting", "MS Excel"],
  },
  {
    slug: "teaching-assistant-intern-buea",
    orgSlug: "university-of-buea",
    title: "Administrative Assistant Intern",
    department: "Administration",
    description:
      "Support admissions records, student files and front-office duties alongside university administrative staff.",
    field: "Human Resources & Talent Management",
    region: "South-West",
    city: "Buea",
    workMode: "ONSITE",
    durationMonths: 5,
    isPaid: true,
    allowanceXAF: 80000,
    positions: 2,
    skills: ["Training Coordination", "Communication"],
  },
];

async function main() {
  console.log("Seeding demo organizations and opportunities...");

  const regions = await prisma.region.findMany();
  const industries = await prisma.industry.findMany();
  const fields = await prisma.field.findMany();
  const skills = await prisma.skill.findMany();

  // Case-insensitive name lookup so demo rows only ever attach to taxonomy
  // that really exists, instead of storing dangling foreign keys.
  const findByName = (rows: { id: string; name: string }[], name: string) =>
    rows.find((row) => row.name.toLowerCase() === name.toLowerCase());

  const orgIdBySlug = new Map<string, string>();
  for (const org of ORGANIZATIONS) {
    const created = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: {
        name: org.name,
        slug: org.slug,
        type: org.type,
        industryId: findByName(industries, org.industry)?.id ?? null,
        regionId: findByName(regions, org.region)?.id ?? null,
        city: org.city,
        description: org.description,
        website: org.website,
        size: org.size,
        // PENDING on purpose: demo orgs stay out of verified-organization
        // features and public counts until an admin approves them.
        verificationStatus: "PENDING",
      },
    });
    orgIdBySlug.set(org.slug, created.id);
  }
  console.log(`   organizations: ${orgIdBySlug.size}`);

  const skillNames = new Set(skills.map((skill) => skill.name.toLowerCase()));
  let opportunityCount = 0;

  for (const opp of OPPORTUNITIES) {
    const organizationId = orgIdBySlug.get(opp.orgSlug);
    if (!organizationId) continue;

    // Only keep skills that exist, so the opportunity has no orphan strings.
    const requiredSkills = opp.skills.filter((skill) =>
      skillNames.has(skill.toLowerCase()),
    );

    await prisma.internshipOpportunity.upsert({
      where: { slug: opp.slug },
      update: {},
      create: {
        organizationId,
        title: opp.title,
        slug: opp.slug,
        description: opp.description,
        department: opp.department,
        fieldId: findByName(fields, opp.field)?.id ?? null,
        regionId: findByName(regions, opp.region)?.id ?? null,
        city: opp.city,
        workMode: opp.workMode,
        durationMonths: opp.durationMonths,
        deadline: inDays(45),
        isPaid: opp.isPaid,
        allowanceXAF: opp.allowanceXAF,
        positions: opp.positions,
        requiredSkills,
        educationLevel: "Bachelor",
        // DRAFT on purpose: keeps demo records out of the public marketplace
        // until an admin publishes them.
        moderationStatus: "DRAFT",
      },
    });
    opportunityCount += 1;
  }

  console.log(`   opportunities: ${opportunityCount}`);
  console.log("âœ… Demo data seeded (organizations PENDING, opportunities DRAFT).");
  console.log("   Publish them in /dashboard/admin to show them on /internships.");
}

main()
  .catch((e) => {
    console.error("âŒ Demo seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
