const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const base = process.env.DIRECT_URL || process.env.DATABASE_URL;
const directUrl = base ? base.replace(/connect_timeout=\d+/, 'connect_timeout=30') : undefined;

const prisma = new PrismaClient(
  directUrl ? { datasources: { db: { url: directUrl } } } : undefined
);

const CANDIDATES = [
  {
    clerkId: "cand_01",
    email: "boris.tientcheu.talent@mantech.cm",
    fullName: "Boris Tientcheu",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 671 23 45 67",
    qualification: "BSc Software Engineering",
    academicLevel: "BSc",
    institution: "Université de Yaoundé I (UY1)",
    city: "Yaoundé",
    readinessScore: 96,
    targetRole: "Full-Stack Software Engineer",
    passportNumber: "MN-CE-2026-1041",
    headline: "Node.js & Next.js Full Stack Engineer | Distributed Systems Enthusiast",
    summary: "Built real-time auction platforms and REST microservices with PostgreSQL and Docker. Actively seeking junior engineering or pre-employment internship roles.",
    fieldSlug: "software-cloud-engineering"
  },
  {
    clerkId: "cand_02",
    email: "brenda.ndip.talent@mantech.cm",
    fullName: "Brenda Ndip",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 675 89 12 34",
    qualification: "BEng Computer Engineering",
    academicLevel: "Engineering Cycle",
    institution: "University of Buea (FET)",
    city: "Buea",
    readinessScore: 94,
    targetRole: "DevOps & Cloud Specialist",
    passportNumber: "MN-SW-2026-2088",
    headline: "Cloud & Kubernetes Specialist | AWS Certified Cloud Practitioner",
    summary: "Hands-on experience deploying CI/CD pipelines with GitHub Actions, Terraform, and Docker containers across hybrid cloud environments.",
    fieldSlug: "software-cloud-engineering"
  },
  {
    clerkId: "cand_03",
    email: "armel.kamdem.talent@mantech.cm",
    fullName: "Armel Kamdem",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 699 11 22 33",
    qualification: "Diplôme d'Ingénieur de Conception",
    academicLevel: "Engineering Cycle",
    institution: "ENSPY (Polytechnique Yaoundé)",
    city: "Yaoundé",
    readinessScore: 98,
    targetRole: "Embedded Systems & IoT Engineer",
    passportNumber: "MN-CE-2026-3190",
    headline: "Industrial Automation & Microcontroller Design Specialist",
    summary: "Top graduate in Telecommunications & Electronics. Experienced in SCADA protocols, C/C++ embedded firmware, and MQTT telemetric pipelines.",
    fieldSlug: "cybersecurity-networks"
  },
  {
    clerkId: "cand_04",
    email: "daphne.fokam.talent@mantech.cm",
    fullName: "Daphne Fokam",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 677 34 56 78",
    qualification: "Master en Audit et Contrôle de Gestion",
    academicLevel: "MSc",
    institution: "Université Catholique d'Afrique Centrale (UCAC)",
    city: "Yaoundé",
    readinessScore: 92,
    targetRole: "Financial Analyst & Internal Auditor",
    passportNumber: "MN-CE-2026-4421",
    headline: "OHADA Accounting Specialist | Financial Modeling & Statutory Audit",
    summary: "Advanced proficiency in SYSCOHADA revised financial statement preparation, IFRS compliance, and internal corporate controls.",
    fieldSlug: "finance-accounting"
  },
  {
    clerkId: "cand_05",
    email: "cedric.mbopi.talent@mantech.cm",
    fullName: "Cedric Mbopi",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 694 56 78 90",
    qualification: "DUT Génie Mécanique et Productique",
    academicLevel: "HND",
    institution: "IUT de Douala",
    city: "Douala",
    readinessScore: 90,
    targetRole: "Industrial Maintenance Supervisor",
    passportNumber: "MN-LT-2026-5512",
    headline: "Preventive Maintenance & CAD Specialist (SolidWorks & AutoCAD)",
    summary: "Specialized in hydraulic maintenance, rotary machines, and predictive vibration monitoring in heavy manufacturing plants.",
    fieldSlug: "engineering-industrial"
  },
  {
    clerkId: "cand_06",
    email: "aissatou.mohamadou.talent@mantech.cm",
    fullName: "Aissatou Mohamadou",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 670 12 34 56",
    qualification: "Ingénieur de Conception Agroalimentaire",
    academicLevel: "Engineering Cycle",
    institution: "ENSAI (Université de Ngaoundéré)",
    city: "Ngaoundéré",
    readinessScore: 95,
    targetRole: "Food Quality & Process Engineer",
    passportNumber: "MN-AD-2026-6184",
    headline: "HACCP & ISO 22000 Certified Quality Assurance Professional",
    summary: "Expertise in food microbiology, fermentation controls, dairy processing, and industrial sterilization lines.",
    fieldSlug: "agriculture-environment"
  },
  {
    clerkId: "cand_07",
    email: "georges.eyo.talent@mantech.cm",
    fullName: "Georges Eyo",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 691 22 44 66",
    qualification: "Master 2 Droit des Affaires OHADA",
    academicLevel: "MSc",
    institution: "Université de Douala (FSJP)",
    city: "Douala",
    readinessScore: 91,
    targetRole: "Corporate Legal Associate",
    passportNumber: "MN-LT-2026-7299",
    headline: "OHADA Corporate Commercial Law & Maritime Contracts Consultant",
    summary: "Drafting commercial leases, cross-border CEMAC distribution agreements, and compliance reviews for port transit agencies.",
    fieldSlug: "legal-compliance"
  },
  {
    clerkId: "cand_08",
    email: "miriam.enow.talent@mantech.cm",
    fullName: "Miriam Enow",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 674 88 99 00",
    qualification: "BSc Computer Science",
    academicLevel: "BSc",
    institution: "University of Buea",
    city: "Buea",
    readinessScore: 97,
    targetRole: "UI/UX & React Frontend Engineer",
    passportNumber: "MN-SW-2026-8314",
    headline: "Figma to React Production Systems | Accessibility & Design Tokens",
    summary: "Built scalable design systems with Tailwind CSS, TypeScript, and Next.js. Proven portfolio of 8 production web applications.",
    fieldSlug: "software-cloud-engineering"
  },
  {
    clerkId: "cand_09",
    email: "youssoufa.hamadou.talent@mantech.cm",
    fullName: "Youssoufa Hamadou",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 696 55 44 33",
    qualification: "Diplôme d'Ingénieur des Mines et Géologie",
    academicLevel: "Engineering Cycle",
    institution: "Université de Maroua (EMPI)",
    city: "Maroua",
    readinessScore: 93,
    targetRole: "Geotechnical & Petroleum Logging Engineer",
    passportNumber: "MN-FN-2026-9402",
    headline: "GIS Mapping & Subsurface Geological Characterization Specialist",
    summary: "Skilled in QGIS, seismic data interpretation, mineral core logging, and geotechnical soil stability assessments.",
    fieldSlug: "mining-petroleum-chemical"
  },
  {
    clerkId: "cand_10",
    email: "sandra.bilong.talent@mantech.cm",
    fullName: "Sandra Bilong",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 673 21 09 87",
    qualification: "BEng Biomedical Engineering",
    academicLevel: "Engineering Cycle",
    institution: "PKFokam Institute of Excellence",
    city: "Yaoundé",
    readinessScore: 96,
    targetRole: "Biomedical Instrumentation Specialist",
    passportNumber: "MN-CE-2026-1055",
    headline: "Clinical Imaging Maintenance & Diagnostic Sensor Calibrations",
    summary: "Extensive hospital internship experience servicing ultrasound machines, patient monitors, and autoclave systems.",
    fieldSlug: "healthcare-biotech"
  },
  {
    clerkId: "cand_11",
    email: "patrice.ndzengue.talent@mantech.cm",
    fullName: "Patrice Ndzengue",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 693 44 55 66",
    qualification: "Master en Logistique et Transport Maritime",
    academicLevel: "MSc",
    institution: "IUT de Douala",
    city: "Douala",
    readinessScore: 94,
    targetRole: "Port Operations & Customs Clearance Coordinator",
    passportNumber: "MN-LT-2026-1188",
    headline: "Douala Port Autonome (PAD) Logistics & Transit Optimization",
    summary: "Specialized in ASYCUDA customs declarations, bill of lading documentation, and multimodal freight consolidation.",
    fieldSlug: "supply-chain-logistics"
  },
  {
    clerkId: "cand_12",
    email: "grace.abena.talent@mantech.cm",
    fullName: "Grace Abena",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 672 99 88 77",
    qualification: "Licence Professionnelle en Cybersécurité",
    academicLevel: "BSc",
    institution: "Institut Universitaire de la Côte (IUC)",
    city: "Douala",
    readinessScore: 95,
    targetRole: "SOC Analyst & Penetration Tester",
    passportNumber: "MN-LT-2026-1277",
    headline: "Certified Ethical Hacker (CEH) Trainee | SIEM & Threat Hunting",
    summary: "Hands-on experience with Splunk, Wireshark, Metasploit, and incident response runbooks in corporate networks.",
    fieldSlug: "cybersecurity-networks"
  },
  {
    clerkId: "cand_13",
    email: "emmanuel.tataw.talent@mantech.cm",
    fullName: "Emmanuel Tataw",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 678 12 45 78",
    qualification: "BSc Data Science & AI",
    academicLevel: "BSc",
    institution: "University of Bamenda (NAHPI)",
    city: "Bamenda",
    readinessScore: 97,
    targetRole: "Machine Learning Engineer",
    passportNumber: "MN-NW-2026-1392",
    headline: "PyTorch & Computer Vision | NLP for Cameroonian Local Dialects",
    summary: "Built speech-to-text models and automated visual defect detection pipelines for agricultural produce sorting.",
    fieldSlug: "data-science-ai"
  },
  {
    clerkId: "cand_14",
    email: "solange.mballa.talent@mantech.cm",
    fullName: "Solange Mballa",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 690 77 88 99",
    qualification: "Master en Marketing Digital et E-Commerce",
    academicLevel: "MSc",
    institution: "ESSEC Douala",
    city: "Douala",
    readinessScore: 92,
    targetRole: "Growth Marketing & Brand Strategist",
    passportNumber: "MN-LT-2026-1466",
    headline: "Social Media ROI & Conversion Rate Optimization (CRO)",
    summary: "Managed organic and paid ad campaigns for consumer brands generating over 150k monthly engagements across Central Africa.",
    fieldSlug: "marketing-communications"
  },
  {
    clerkId: "cand_15",
    email: "felix.ngando.talent@mantech.cm",
    fullName: "Felix Ngando",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 676 33 22 11",
    qualification: "Diplôme d'Ingénieur de Génie Civil (BTP)",
    academicLevel: "Engineering Cycle",
    institution: "Ecole Nationale Supérieure des Travaux Publics (ENSTP)",
    city: "Yaoundé",
    readinessScore: 96,
    targetRole: "Structural & Road Construction Engineer",
    passportNumber: "MN-CE-2026-1533",
    headline: "Reinforced Concrete Design & Heavy Infrastructure Works",
    summary: "Proficient in Robot Structural Analysis, civil site supervision, bill of quantities (BOQ), and topographic leveling.",
    fieldSlug: "engineering-industrial"
  },
  {
    clerkId: "cand_16",
    email: "carine.kenfack.talent@mantech.cm",
    fullName: "Carine Kenfack",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 697 11 33 55",
    qualification: "Master en Gestion des Ressources Humaines",
    academicLevel: "MSc",
    institution: "Université de Yaoundé II (Soa)",
    city: "Yaoundé",
    readinessScore: 91,
    targetRole: "Talent Acquisition & Employee Relations Officer",
    passportNumber: "MN-CE-2026-1622",
    headline: "Cameroon Labour Code & Competency-Based Recruitment",
    summary: "Specialized in CNPS statutory contributions, payroll administration, employee onboarding, and tripartite internship conventions.",
    fieldSlug: "human-resources"
  },
  {
    clerkId: "cand_17",
    email: "alain.fomekong.talent@mantech.cm",
    fullName: "Alain Fomekong",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 679 00 11 22",
    qualification: "Ingénieur Agronome (FASA)",
    academicLevel: "Engineering Cycle",
    institution: "Université de Dschang (FASA)",
    city: "Dschang",
    readinessScore: 95,
    targetRole: "Agro-Ecological Farm Manager",
    passportNumber: "MN-OU-2026-1744",
    headline: "Tropical Crop Protection & High-Yield Greenhouse Hydroponics",
    summary: "Led experimental cacao and oil palm fertility trials. Experienced in drip irrigation installation and biological pest control.",
    fieldSlug: "agriculture-environment"
  },
  {
    clerkId: "cand_18",
    email: "stephanie.nkoa.talent@mantech.cm",
    fullName: "Stephanie Nkoa",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 692 88 44 22",
    qualification: "Licence en Énergies Renouvelables",
    academicLevel: "BSc",
    institution: "Institut Supérieur du Sahel (ISS Maroua)",
    city: "Maroua",
    readinessScore: 93,
    targetRole: "Solar Photovoltaic Systems Designer",
    passportNumber: "MN-FN-2026-1890",
    headline: "Off-Grid Solar PV & Battery Storage Sizing (PVSyst)",
    summary: "Designed and supervised 15kWp off-grid solar installations for remote northern health clinics and water pumping stations.",
    fieldSlug: "engineering-industrial"
  },
  {
    clerkId: "cand_19",
    email: "jean.paul.ebanga.talent@mantech.cm",
    fullName: "Jean-Paul Ebanga",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 695 66 77 88",
    qualification: "Diplôme de Journalisme et Communication",
    academicLevel: "BSc",
    institution: "ESSTIC (Université de Yaoundé II)",
    city: "Yaoundé",
    readinessScore: 90,
    targetRole: "Bilingual Media Specialist & Corporate Communicator",
    passportNumber: "MN-CE-2026-1915",
    headline: "Investigative Data Journalism & Broadcast Production",
    summary: "Fluent French and English reporter with published investigations on tech adoption and educational policy in Cameroon.",
    fieldSlug: "media-journalism-communication"
  },
  {
    clerkId: "cand_20",
    email: "veronique.atcho.talent@mantech.cm",
    fullName: "Veronique Atcho",
    avatarUrl: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "+237 671 99 00 11",
    qualification: "Licence en Management Hôtelier et Touristique",
    academicLevel: "BSc",
    institution: "Université de Bertoua",
    city: "Bertoua",
    readinessScore: 92,
    targetRole: "Hospitality Operations & Guest Experience Lead",
    passportNumber: "MN-ES-2026-2033",
    headline: "Luxury Eco-Tourism & Conference Event Management",
    summary: "Trained in international hotel PMS systems, banquet logistics, and sustainable ecotourism development in Eastern Cameroon.",
    fieldSlug: "hospitality-tourism-catering"
  }
];

async function seedCandidates() {
  console.log('🌟 Seeding 20 Authentic Cameroon Candidate Profiles & Intern Passports...');
  let seeded = 0;

  for (const c of CANDIDATES) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        fullName: c.fullName,
        avatarUrl: c.avatarUrl,
        phone: c.phone,
        status: "active",
        role: "INTERN"
      },
      create: {
        clerkId: c.clerkId,
        email: c.email,
        fullName: c.fullName,
        avatarUrl: c.avatarUrl,
        phone: c.phone,
        status: "active",
        role: "INTERN"
      }
    });

    const field = await prisma.field.findUnique({
      where: { slug: c.fieldSlug }
    });

    const profile = await prisma.internProfile.upsert({
      where: { userId: user.id },
      update: {
        phone: c.phone,
        qualification: c.qualification,
        academicLevel: c.academicLevel,
        institution: c.institution,
        city: c.city,
        fieldOfStudyId: field ? field.id : undefined,
        readinessScore: c.readinessScore,
        targetRole: c.targetRole,
        profileCompleted: true,
        cvUrl: "/documents/sample-cv.pdf",
        isCvSearchable: true
      },
      create: {
        userId: user.id,
        phone: c.phone,
        qualification: c.qualification,
        academicLevel: c.academicLevel,
        institution: c.institution,
        city: c.city,
        fieldOfStudyId: field ? field.id : undefined,
        readinessScore: c.readinessScore,
        targetRole: c.targetRole,
        profileCompleted: true,
        cvUrl: "/documents/sample-cv.pdf",
        isCvSearchable: true
      }
    });

    await prisma.internPassport.upsert({
      where: { internProfileId: profile.id },
      update: {
        passportNumber: c.passportNumber,
        headline: c.headline,
        summary: c.summary,
        isVerified: true,
        totalHoursCompleted: 240
      },
      create: {
        internProfileId: profile.id,
        passportNumber: c.passportNumber,
        headline: c.headline,
        summary: c.summary,
        isVerified: true,
        totalHoursCompleted: 240
      }
    });

    // Seed education
    const existingEdu = await prisma.education.findFirst({
      where: { internProfileId: profile.id, institution: c.institution }
    });
    if (!existingEdu) {
      await prisma.education.create({
        data: {
          internProfileId: profile.id,
          institution: c.institution,
          qualification: c.qualification,
          field: c.targetRole,
          startYear: 2022,
          endYear: 2025,
          isCurrent: false,
          grade: "Honours / Mention Très Bien"
        }
      });
    }

    seeded++;
  }

  console.log(`✅ Successfully seeded/updated ${seeded} candidates with Intern Passports.`);
  await prisma.$disconnect();
}

seedCandidates().catch(err => {
  console.error('Error seeding candidates:', err);
  process.exit(1);
});
