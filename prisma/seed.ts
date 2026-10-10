import { PrismaClient } from "@prisma/client";
import { APP_CONFIG } from "@/lib/config";

// Neon separates a pooled runtime endpoint (`-pooler`) from a direct endpoint.
// The pooler recycles idle server connections, which surfaces as P1017
// ("Server has closed the connection") part-way through a long sequential seed.
// Seeding is a short-lived maintenance job, so prefer the direct endpoint when
// DIRECT_URL is configured and fall back to DATABASE_URL otherwise.
const prisma = new PrismaClient(
  process.env.DIRECT_URL ? { datasourceUrl: process.env.DIRECT_URL } : undefined
);

async function main() {
  console.log("🌱 Starting database seed...");

  // Create Regions
  for (const region of APP_CONFIG.cameroonRegions) {
    await prisma.region.upsert({
      where: { name: region.name },
      update: {},
      create: {
        name: region.name,
        code: region.id.toUpperCase(),
        capital: region.capital,
        country: "Cameroon",
      },
    });
  }

  // Create Fields
  for (const field of APP_CONFIG.professionalFields) {
    const createdField = await prisma.field.upsert({
      where: { name: field.name },
      update: {},
      create: {
        name: field.name,
        slug: field.slug,
        category: field.category,
        description: `${field.name} professional field in Cameroon`,
      },
    });

    // Create Specializations
    for (const spec of field.specializations) {
      await prisma.specialization.upsert({
        where: {
          fieldId_name: {
            fieldId: createdField.id,
            name: spec,
          },
        },
        update: {},
        create: {
          fieldId: createdField.id,
          name: spec,
          slug: spec.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: `${spec} specialization in ${field.name}`,
        },
      });
    }
  }

  // Create Skills (all 42 skills matching FALLBACK_SKILLS with categorized grouping)
  const skillsWithCategory: Array<{ name: string; category: string }> = [
    { name: "JavaScript", category: "Technology & Computing" },
    { name: "TypeScript", category: "Technology & Computing" },
    { name: "React", category: "Technology & Computing" },
    { name: "Next.js", category: "Technology & Computing" },
    { name: "Node.js", category: "Technology & Computing" },
    { name: "Python", category: "Technology & Computing" },
    { name: "Java", category: "Technology & Computing" },
    { name: "SQL", category: "Technology & Computing" },
    { name: "PostgreSQL", category: "Technology & Computing" },
    { name: "Docker", category: "Technology & Computing" },
    { name: "AWS", category: "Technology & Computing" },
    { name: "Git", category: "Technology & Computing" },
    { name: "MongoDB", category: "Technology & Computing" },
    { name: "Kubernetes", category: "Technology & Computing" },
    { name: "Linux", category: "Technology & Computing" },
    { name: "MS Excel", category: "Business & Finance" },
    { name: "Accounting", category: "Business & Finance" },
    { name: "Financial Modeling", category: "Business & Finance" },
    { name: "Audit", category: "Business & Finance" },
    { name: "Taxation (OHADA)", category: "Business & Finance" },
    { name: "SAP", category: "Business & Finance" },
    { name: "Financial Analysis", category: "Business & Finance" },
    { name: "Project Management", category: "Business & Finance" },
    { name: "SEO", category: "Marketing & Growth" },
    { name: "Content Writing", category: "Marketing & Growth" },
    { name: "Graphic Design", category: "Marketing & Growth" },
    { name: "Social Media Management", category: "Marketing & Growth" },
    { name: "Community Management", category: "Marketing & Growth" },
    { name: "Digital Marketing", category: "Marketing & Growth" },
    { name: "Recruitment", category: "Human Resources" },
    { name: "HRIS Administration", category: "Human Resources" },
    { name: "Training Coordination", category: "Human Resources" },
    { name: "French (Professional)", category: "Languages" },
    { name: "English (Professional)", category: "Languages" },
    { name: "Communication", category: "Languages" },
    { name: "Teamwork", category: "Languages" },
    { name: "Problem Solving", category: "Languages" },
    { name: "AutoCAD", category: "Engineering" },
    { name: "Microsoft Project", category: "Engineering" },
    { name: "Revit", category: "Engineering" },
    { name: "Data Analysis", category: "Engineering" },
    { name: "Machine Learning", category: "Engineering" },
    { name: "Customer Support", category: "Operations" },
    { name: "Logistics Coordination", category: "Operations" },
    { name: "Procurement", category: "Operations" },
    { name: "Clinical Research", category: "Health & Life Sciences" },
    { name: "Pharmacovigilance", category: "Health & Life Sciences" },
    { name: "Contract Drafting", category: "Legal" },
    { name: "Compliance", category: "Legal" },
    { name: "Data Protection", category: "Legal" },
  ];

  for (const { name, category } of skillsWithCategory) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category,
      },
    });
  }

  // Create Industries (all 12 matching FALLBACK_INDUSTRIES)
  const industries: Array<{ name: string; description: string }> = [
    {
      name: "Technology & Software",
      description: "Software, cloud, telecom and cybersecurity firms.",
    },
    {
      name: "Fintech & Financial Services",
      description: "Banks, MFIs, fintech and payment providers.",
    },
    {
      name: "Healthcare & Pharmaceuticals",
      description: "Hospitals, clinics, pharma and biomedical.",
    },
    {
      name: "Logistics, Ports & Supply Chain",
      description: "Port, maritime, freight and warehousing.",
    },
    {
      name: "Energy, Oil & Gas & Renewable",
      description: "Electricity, solar, hydrocarbons and water.",
    },
    {
      name: "Higher Education & Research",
      description: "Universities, grandes écoles and research.",
    },
    {
      name: "Agro-Industry & Agribusiness",
      description: "Farming, processing, export agriculture.",
    },
    {
      name: "Manufacturing & FMCG",
      description: "Consumer goods, textiles and production.",
    },
    {
      name: "Consulting, Audit & Advisory",
      description: "Management, audit, strategy and tax.",
    },
    {
      name: "Media, Marketing & Communications",
      description: "Advertising agencies, PR and digital.",
    },
    {
      name: "Public Sector & Para-public",
      description: "State institutions, agencies and NGOs.",
    },
    {
      name: "Construction & Real Estate",
      description: "Buildings, BIM and civil works.",
    },
  ];

  for (const { name, description } of industries) {
    await prisma.industry.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
      },
    });
  }

  // Create Qualifications (Cameroon & OHADA academic levels)
  const qualifications: Array<{
    name: string;
    code: string;
    level: string;
    description: string;
  }> = [
    {
      name: "Baccalauréat (BAC)",
      code: "BAC",
      level: "Secondary",
      description:
        "Cameroon General Certificate / Baccalaureat secondary leaving.",
    },
    {
      name: "GCE Advanced Level (2+ A-Levels)",
      code: "GCE_AL",
      level: "Secondary",
      description:
        "Anglophone Cameroon General Certificate of Education Advanced Level.",
    },
    {
      name: "Brevet de Technicien Supérieur (BTS)",
      code: "BTS",
      level: "Undergraduate",
      description: "French-track 2-year Higher National Technician Diploma.",
    },
    {
      name: "Higher National Diploma (HND)",
      code: "HND",
      level: "Undergraduate",
      description: "Anglophone-track 2-year Higher National Diploma.",
    },
    {
      name: "Diplôme Universitaire de Technologie (DUT)",
      code: "DUT",
      level: "Undergraduate",
      description: "2-year University Diploma of Technology.",
    },
    {
      name: "Diplôme de Technicien Supérieur (DTS)",
      code: "DTS",
      level: "Undergraduate",
      description: "Polytechnic 2-year Senior Technician Diploma.",
    },
    {
      name: "Licence 1 / Year 1 Bachelor",
      code: "L1",
      level: "Undergraduate",
      description: "First year of Bachelor (3-year cycle) under LMD reform.",
    },
    {
      name: "Licence 2 / Year 2 Bachelor",
      code: "L2",
      level: "Undergraduate",
      description: "Second year of Bachelor.",
    },
    {
      name: "Licence 3 / Bachelor",
      code: "L3",
      level: "Undergraduate",
      description: "Third-year Bachelor degree (LMD: Licence).",
    },
    {
      name: "Licence Professionnelle / Professional Bachelor's",
      code: "LP",
      level: "Undergraduate",
      description: "Applied professionally oriented Bachelor.",
    },
    {
      name: "Ingénieur Cycle Préparatoire (Cycle 1)",
      code: "ING_CP",
      level: "Undergraduate",
      description: "First 2 years of engineering preparatory classes.",
    },
    {
      name: "Ingénieur Cycle Ingénieur (Cycle 2)",
      code: "ING_CY2",
      level: "Postgraduate",
      description:
        "Engineering Cycle 2 (years 3–5) leading to Ingénieur d'État.",
    },
    {
      name: "Master 1 (M1)",
      code: "M1",
      level: "Postgraduate",
      description: "First year of Master under LMD.",
    },
    {
      name: "Master 2 (M2) / Professional Master",
      code: "M2",
      level: "Postgraduate",
      description: "Second-year LMD Master (research or professional).",
    },
    {
      name: "Doctorat / PhD Year 1+",
      code: "PHD",
      level: "Postgraduate",
      description: "Doctoral studies (PhD / Doctorat / PhD-Cycle).",
    },
  ];

  for (const { name, code, level, description } of qualifications) {
    await prisma.qualification.upsert({
      where: { code },
      update: {},
      create: {
        name,
        code,
        level,
        description,
      },
    });
  }

  for (const pkg of APP_CONFIG.packages) {
    await prisma.package.upsert({
      where: {
        code: pkg.code as "FREE" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE",
      },
      update: {},
      create: {
        name: pkg.name,
        code: pkg.code as "FREE" | "PROFESSIONAL" | "BUSINESS" | "ENTERPRISE",
        priceXAF: pkg.priceXAF,
        opportunityLimit: pkg.limits.activeOpportunities,
        candidateSearchLimit: pkg.limits.monthlyCandidateViews,
        maxRecruiterAccounts: pkg.limits.recruiterAccounts,
        featuredOpportunitiesLimit: pkg.limits.featuredBadges,
        description: pkg.description,
        features: pkg.features,
      },
    });
  }

  console.log("✅ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
