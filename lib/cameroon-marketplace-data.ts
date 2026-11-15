/**
/**
 * Authentic, diverse Cameroonian marketplace catalog.
 * Represents true Cameroon economic reality: Healthcare, Culinary/Cooking,
 * Retail/Sales, Domestic Services, Education/Teaching, Technical Trades,
 * Logistics, Agro-industry, and Professional Services across all 10 regions.
 */

export interface MarketplaceJob {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companySlug: string;
  logoUrl?: string | null;
  city: string;
  region: string;
  workMode: 'ONSITE' | 'HYBRID' | 'REMOTE';
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  salaryMinXAF: number;
  salaryMaxXAF: number;
  description: string;
  department: string;
  field: string;
  requiredSkills: string[];
  educationLevel: string;
  isFeatured?: boolean;
}

export const CAMEROON_MARKETPLACE_JOBS: MarketplaceJob[] = [
  // ── Healthcare, Nursing & Medical ──────────────────────────────────────────
  {
    id: 'job-doc-01',
    slug: 'general-practitioner-hopital-central',
    title: 'General Medical Practitioner (Doctor)',
    companyName: 'Hôpital Central de Yaoundé',
    companySlug: 'hopital-central-yaounde',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 450000,
    salaryMaxXAF: 700000,
    description: 'Diagnose and manage patients in outpatient triage and emergency consultations. Coordinate patient care plans and clinical rounds.',
    department: 'General Medicine',
    field: 'Healthcare, Nursing & Medical Sciences',
    requiredSkills: ['Clinical Diagnostics', 'Patient Care', 'Emergency Triage'],
    educationLevel: 'Doctorate',
    isFeatured: true,
  },
  {
    id: 'job-nurse-01',
    slug: 'registered-staff-nurse-clinique-bastos',
    title: 'Registered Staff Nurse (Infirmière Diplômée)',
    companyName: 'Clinique Médico-Chirurgicale de Bastos',
    companySlug: 'clinique-bastos',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 220000,
    salaryMaxXAF: 350000,
    description: 'Administer intravenous medications, patient vitals monitoring, pre/post-operative wound dressing, and bedside patient observation.',
    department: 'Nursing & Inpatient Care',
    field: 'Healthcare, Nursing & Medical Sciences',
    requiredSkills: ['Vital Signs', 'IV Administration', 'Wound Care'],
    educationLevel: 'Bachelor / IDE',
    isFeatured: true,
  },
  {
    id: 'job-midwife-01',
    slug: 'maternity-midwife-hopital-laquintinie',
    title: 'Maternity Midwife & Neonatal Care (Sage-Femme)',
    companyName: 'Hôpital Laquintinie de Douala',
    companySlug: 'hopital-laquintinie',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 200000,
    salaryMaxXAF: 320000,
    description: 'Provide antenatal consultations, supervise labor and safe deliveries, neonatal health assessment, and new mother postpartum care.',
    department: 'Maternity & Obstetrics',
    field: 'Healthcare, Nursing & Medical Sciences',
    requiredSkills: ['Obstetrics', 'Neonatal Care', 'Antenatal Consultation'],
    educationLevel: 'State Certified Midwife',
    isFeatured: false,
  },
  {
    id: 'job-pharm-01',
    slug: 'pharmacy-dispenser-bonanjo',
    title: 'Pharmacy Assistant & Dispenser (Auxiliaire en Pharmacie)',
    companyName: 'Pharmacie du Centre Bonanjo',
    companySlug: 'pharmacie-bonanjo',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'PART_TIME',
    salaryMinXAF: 140000,
    salaryMaxXAF: 200000,
    description: 'Dispense prescribed medicines under pharmacist oversight, manage counter customer advice, inventory stock, and cold-chain compliance.',
    department: 'Retail Pharmacy',
    field: 'Healthcare, Nursing & Medical Sciences',
    requiredSkills: ['Drug Dispensing', 'Stock Keeping', 'Customer Advice'],
    educationLevel: 'BTS / Certification',
    isFeatured: false,
  },

  // ── Culinary, Hospitality & Cooking ─────────────────────────────────────────
  {
    id: 'job-chef-01',
    slug: 'executive-pastry-chef-acropole',
    title: 'Executive Pastry Chef & Baker (Chef Pâtissier-Boulanger)',
    companyName: 'Boulangerie-Pâtisserie Acropole',
    companySlug: 'acropole-yaounde',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 280000,
    salaryMaxXAF: 420000,
    description: 'Design artisan breads, viennoiseries, custom event cakes, and supervise daily bakery line operations and hygiene standards (HACCP).',
    department: 'Bakery & Pastry',
    field: 'Hospitality, Tourism & Culinary Arts',
    requiredSkills: ['French Pastry', 'Artisan Bakery', 'Food Hygiene (HACCP)'],
    educationLevel: 'CAP / Professional Diploma',
    isFeatured: true,
  },
  {
    id: 'job-cook-01',
    slug: 'restaurant-line-cook-la-fourchette',
    title: 'Restaurant Line Cook & Grill Specialist (Cuisinier Grilladin)',
    companyName: 'Restaurant La Fourchette Akwa',
    companySlug: 'la-fourchette-douala',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'PART_TIME',
    salaryMinXAF: 150000,
    salaryMaxXAF: 240000,
    description: 'Prepare Cameroonian specialties (Ndolé, Koki, Poisson braisé) and continental dishes. Fast-paced service station prep and ingredient prep.',
    department: 'Kitchen Operations',
    field: 'Hospitality, Tourism & Culinary Arts',
    requiredSkills: ['African Cuisine', 'Grilling & Roasting', 'Mise en place'],
    educationLevel: 'High School / Vocational',
    isFeatured: false,
  },
  {
    id: 'job-hotel-chef-01',
    slug: 'sous-chef-krystal-palace',
    title: 'Hotel Sous-Chef (Catering & Banqueting)',
    companyName: 'Krystal Palace Douala',
    companySlug: 'krystal-palace',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 380000,
    salaryMaxXAF: 550000,
    description: 'Support the Executive Chef in menu development, kitchen team scheduling, high-volume diplomatic banquet catering, and cost control.',
    department: 'Food & Beverage',
    field: 'Hospitality, Tourism & Culinary Arts',
    requiredSkills: ['Banquet Catering', 'Kitchen Leadership', 'Cost Control'],
    educationLevel: 'Diploma / BTS Hôtellerie',
    isFeatured: true,
  },

  // ── Retail, Quarter Store & Sales ───────────────────────────────────────────
  {
    id: 'job-cashier-01',
    slug: 'supermarket-cashier-playce',
    title: 'Supermarket Cashier & Customer Attendant (Hôtesse de Caisse)',
    companyName: 'Carrefour PlaYce Douala',
    companySlug: 'carrefour-cameroon',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 130000,
    salaryMaxXAF: 180000,
    description: 'Scan items, handle cash/Mobile Money/card receipts, maintain cash drawer reconciliation, and provide welcoming checkout customer service.',
    department: 'Front Checkout',
    field: 'Commercial Sales, Retail & Marketing',
    requiredSkills: ['Cash Register (POS)', 'Mobile Money Settlement', 'Customer Service'],
    educationLevel: 'Baccalauréat / GCE A-Level',
    isFeatured: false,
  },
  {
    id: 'job-storekeeper-01',
    slug: 'storekeeper-santa-lucia',
    title: 'Quarter Storekeeper & Stock Controller (Gestionnaire de Stock)',
    companyName: 'Santa Lucia Supermarché',
    companySlug: 'santa-lucia-yaounde',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 150000,
    salaryMaxXAF: 220000,
    description: 'Receive goods from suppliers, perform physical inventory audits, prevent stock breakage, and maintain merchandise display shelving.',
    department: 'Store Logistics',
    field: 'Commercial Sales, Retail & Marketing',
    requiredSkills: ['Stock Inventory', 'Receiving Inspection', 'Barcode Scanning'],
    educationLevel: 'Bac / BTS',
    isFeatured: false,
  },
  {
    id: 'job-sales-rep-01',
    slug: 'commercial-terrain-distribution-mokolo',
    title: 'Neighborhood Commercial Sales Agent (Commercial Terrain)',
    companyName: 'Marché Central & Mokolo Distributors',
    companySlug: 'distributeurs-cameroun',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FREELANCE',
    salaryMinXAF: 180000,
    salaryMaxXAF: 350000,
    description: 'Grow FMCG retail customer distribution across small neighborhood shops, kiosks, and quarters. Take re-orders and oversee daily deliveries.',
    department: 'Field Sales',
    field: 'Commercial Sales, Retail & Marketing',
    requiredSkills: ['Field Prospecting', 'Client Negotiation', 'Cash Collection'],
    educationLevel: 'High School / Open',
    isFeatured: false,
  },

  // ── Education, Teaching & Academic ──────────────────────────────────────────
  {
    id: 'job-teacher-01',
    slug: 'secondary-maths-teacher-libermann',
    title: 'Secondary School Mathematics Teacher (Enseignant Maths)',
    companyName: 'Collège Libermann',
    companySlug: 'college-libermann',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 260000,
    salaryMaxXAF: 400000,
    description: 'Deliver structured mathematics courses for Secondary cycles (Seconde, Première, Terminale), conduct quizzes, and prepare students for national exams.',
    department: 'Sciences & Pedagogy',
    field: 'Education, Teaching & Academic Research',
    requiredSkills: ['Mathematics Pedagogy', 'Exam Preparation', 'Classroom Leadership'],
    educationLevel: 'Licence / Master / DIPES',
    isFeatured: true,
  },
  {
    id: 'job-teacher-02',
    slug: 'bilingual-primary-tutor-academy',
    title: 'Bilingual Primary School Teacher (Instituteur Bilingue)',
    companyName: 'Bilingual Academy Excellence',
    companySlug: 'bilingual-academy-yaounde',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 180000,
    salaryMaxXAF: 280000,
    description: 'Teach English and French foundational reading, arithmetic, and creative arts for Class 3 to Class 5 in a structured bilingual environment.',
    department: 'Primary Education',
    field: 'Education, Teaching & Academic Research',
    requiredSkills: ['Bilingual Instruction', 'Child Pedagogy', 'Reading Development'],
    educationLevel: 'CAPIEMP / Bachelor',
    isFeatured: false,
  },
  {
    id: 'job-tutor-01',
    slug: 'home-stem-tutor-buea',
    title: 'Private Home STEM Tutor (Physics & Chemistry)',
    companyName: 'South-West Academic Tutors',
    companySlug: 'sw-academic-tutors',
    city: 'Buea',
    region: 'South-West',
    workMode: 'HYBRID',
    type: 'PART_TIME',
    salaryMinXAF: 100000,
    salaryMaxXAF: 180000,
    description: 'Provide personalized tutoring for GCE O/A-Level candidates in Sciences, solving past exam questions and building student confidence.',
    department: 'Private Tutoring',
    field: 'Education, Teaching & Academic Research',
    requiredSkills: ['Physics & Chemistry', 'GCE Prep', 'One-on-One Mentoring'],
    educationLevel: 'University Student / Graduate',
    isFeatured: false,
  },

  // ── Domestic, Housekeeping & Property Management ────────────────────────────
  {
    id: 'job-housekeeper-01',
    slug: 'executive-housekeeper-bonapriso',
    title: 'Executive Housekeeper & Housemaid (Gouvernante de Maison)',
    companyName: 'Bonapriso Residential Services',
    companySlug: 'bonapriso-residences',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 130000,
    salaryMaxXAF: 200000,
    description: 'Manage domestic cleaning, family laundry and ironing, grocery runs, and child assistance in a secure private family residence.',
    department: 'Domestic Staffing',
    field: 'Human Resources & Personal Services',
    requiredSkills: ['Deep Cleaning', 'Ironing & Garment Care', 'Family Cooking'],
    educationLevel: 'High School / Experienced',
    isFeatured: false,
  },
  {
    id: 'job-caretaker-01',
    slug: 'residential-caretaker-bastos',
    title: 'Villa Caretaker & Facilities Custodian (Gardien & Régisseur)',
    companyName: 'Bastos Properties & Estates',
    companySlug: 'bastos-estates',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'CONTRACT',
    salaryMinXAF: 160000,
    salaryMaxXAF: 250000,
    description: 'Oversee property security, generator fuel monitoring, garden maintenance, minor plumbing/electrical repairs, and welcoming visitors.',
    department: 'Estate Maintenance',
    field: 'Civil, Mechanical & Electrical Engineering',
    requiredSkills: ['Facility Custody', 'Generator Maintenance', 'Access Security'],
    educationLevel: 'Experienced Caretaker',
    isFeatured: false,
  },

  // ── Technical Trades & Artisanal ───────────────────────────────────────────
  {
    id: 'job-mechanic-01',
    slug: 'automotive-mechanic-bassa',
    title: 'Automotive Diagnostic Mechanic (Mécanicien Automobile)',
    companyName: 'Ateliers Mécaniques de Douala Bassa',
    companySlug: 'mecanique-bassa',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 240000,
    salaryMaxXAF: 380000,
    description: 'Perform electronic OBD diagnostics, brake and suspension rebuilds, engine tune-ups, and scheduled fleet servicing on European and Japanese vehicles.',
    department: 'Automotive Repairs',
    field: 'Civil, Mechanical & Electrical Engineering',
    requiredSkills: ['OBD Scanning', 'Engine Overhaul', 'Brake Systems'],
    educationLevel: 'CAP / CQP / BT Automobile',
    isFeatured: true,
  },
  {
    id: 'job-solar-01',
    slug: 'solar-energy-installer-camsolar',
    title: 'Solar & Domestic Electrical Installer (Installateur Solaire)',
    companyName: 'CamSolar Technologies',
    companySlug: 'camsolar-yaounde',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'CONTRACT',
    salaryMinXAF: 200000,
    salaryMaxXAF: 320000,
    description: 'Install residential solar panels, lithium/gel battery inverters, circuit breakers, and perform wiring audits for home power backup.',
    department: 'Renewable Installation',
    field: 'Civil, Mechanical & Electrical Engineering',
    requiredSkills: ['Solar Inverters', 'Electrical Wiring', 'Battery Systems'],
    educationLevel: 'BT / BTS Électrotechnique',
    isFeatured: false,
  },

  // ── Logistics, Transport & Delivery ────────────────────────────────────────
  {
    id: 'job-driver-01',
    slug: 'express-delivery-driver-campost',
    title: 'Motorcycle Courier & Parcel Delivery (Coursier Express)',
    companyName: 'Express Cargo Logistics',
    companySlug: 'express-cargo-douala',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 140000,
    salaryMaxXAF: 210000,
    description: 'Collect parcels from central hub and deliver time-sensitive business documents and packages across Douala neighborhoods on assigned rounds.',
    department: 'Last-Mile Delivery',
    field: 'Supply Chain, Logistics & Procurement',
    requiredSkills: ['City Navigation', 'Driving License A', 'Parcel Reconciliation'],
    educationLevel: 'Driving License + Clean Record',
    isFeatured: false,
  },

  // ── Agriculture & Agro-processing ──────────────────────────────────────────
  {
    id: 'job-agri-01',
    slug: 'cocoa-quality-supervisor-limbe',
    title: 'Cocoa & Coffee Quality Supervisor (Contrôleur Qualité Cacao)',
    companyName: 'CDC Agro-Industries',
    companySlug: 'cdc-cameroon',
    city: 'Limbe',
    region: 'South-West',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 260000,
    salaryMaxXAF: 400000,
    description: 'Inspect moisture content, fermentation standards, and export grade compliance for smallholder raw cocoa bean collections.',
    department: 'Agronomy & Export',
    field: 'Agro-Industry, Agriculture & Environment',
    requiredSkills: ['Moisture Testing', 'Export Grading', 'Field Audits'],
    educationLevel: 'BTS / Licence Agronomie',
    isFeatured: false,
  },

  // ── Telecom, Software & Technology ─────────────────────────────────────────
  {
    id: 'job-telco-01',
    slug: 'network-operations-engineer-orange',
    title: 'Telecom Transmission & Network Engineer',
    companyName: 'Orange Cameroun',
    companySlug: 'orange-cameroon',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'HYBRID',
    type: 'FULL_TIME',
    salaryMinXAF: 480000,
    salaryMaxXAF: 750000,
    description: 'Monitor cellular radio access network (4G/5G) transmission links, microwave hops, and optimize regional base transceiver stations.',
    department: 'Network Operations',
    field: 'Cybersecurity & Network Systems',
    requiredSkills: ['Telecom Transmission', 'Radio Access Network', 'Fiber Optics'],
    educationLevel: 'Ingénieur / Master',
    isFeatured: true,
  },
  {
    id: 'job-soft-01',
    slug: 'fullstack-software-engineer-mtn',
    title: 'Fullstack Mobile Money API Developer',
    companyName: 'MTN Cameroon',
    companySlug: 'mtn-cameroon',
    city: 'Douala',
    region: 'Littoral',
    workMode: 'HYBRID',
    type: 'FULL_TIME',
    salaryMinXAF: 550000,
    salaryMaxXAF: 850000,
    description: 'Develop high-throughput fintech APIs and merchant payment settlement portals for the MoMo ecosystem using Node.js, Next.js, and PostgreSQL.',
    department: 'Fintech Engineering',
    field: 'Software & Cloud Engineering',
    requiredSkills: ['Next.js', 'PostgreSQL', 'Fintech APIs'],
    educationLevel: 'Bachelor / Master',
    isFeatured: true,
  },
  {
    id: 'job-intern-soft-01',
    slug: 'junior-intern-web-dev-activ',
    title: 'Web & Digital Platforms Intern (Stage Informatique)',
    companyName: 'Activ Partenaires',
    companySlug: 'activ-partenaires-cameroon',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'HYBRID',
    type: 'INTERNSHIP',
    salaryMinXAF: 90000,
    salaryMaxXAF: 130000,
    description: 'Hands-on internship assisting lead developers in building responsive portals, testing components, and drafting technical documentation.',
    department: 'Digital Solutions',
    field: 'Software & Cloud Engineering',
    requiredSkills: ['HTML/CSS/JS', 'React Basics', 'Git'],
    educationLevel: 'Undergraduate (L2/L3/HND)',
    isFeatured: false,
  },

  // ── Finance, Accounting & Banking ───────────────────────────────────────────
  {
    id: 'job-fin-01',
    slug: 'branch-accountant-bicec-bafoussam',
    title: 'Branch Accountant & Financial Auditor (Comptable d\'Agence)',
    companyName: 'BICEC Cameroun',
    companySlug: 'bicec-cameroon',
    city: 'Bafoussam',
    region: 'West',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 320000,
    salaryMaxXAF: 480000,
    description: 'Maintain general ledger postings, cash vault audit, daily treasury balance, and local tax declaration compliance under OHADA norms.',
    department: 'Branch Finance',
    field: 'Finance, Banking & Accounting',
    requiredSkills: ['OHADA Accounting', 'Cash Vault Audit', 'MS Excel'],
    educationLevel: 'Licence / Master CCA',
    isFeatured: false,
  },
  {
    id: 'job-legal-01',
    slug: 'legal-compliance-officer-afriland',
    title: 'Corporate Legal Counsel (Juriste d\'Entreprise & Conformité)',
    companyName: 'Afriland First Bank',
    companySlug: 'afriland-first-bank',
    city: 'Yaoundé',
    region: 'Centre',
    workMode: 'ONSITE',
    type: 'FULL_TIME',
    salaryMinXAF: 420000,
    salaryMaxXAF: 650000,
    description: 'Review credit guarantee contracts, manage COBAC banking compliance filings, and draft commercial partnership agreements.',
    department: 'Legal & Compliance',
    field: 'Corporate Law, Compliance & Governance',
    requiredSkills: ['OHADA Law', 'Contract Drafting', 'COBAC Compliance'],
    educationLevel: 'Master en Droit des Affaires',
    isFeatured: false,
  },
];

// ── Persistent Express Postings Store ──────────────────────────────────────────
let inMemoryExpressPostings: MarketplaceJob[] = [];

if (typeof window === 'undefined') {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', 'express-postings.json');
    if (fs.existsSync(filePath)) {
      const saved = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(saved) && saved.length > 0) {
        inMemoryExpressPostings = saved;
        for (const s of saved) {
          if (!CAMEROON_MARKETPLACE_JOBS.some((j) => j.slug === s.slug)) {
            CAMEROON_MARKETPLACE_JOBS.unshift(s);
          }
        }
      }
    }
  } catch {}
}

export function getExpressPostings(): MarketplaceJob[] {
  return inMemoryExpressPostings;
}

export function saveExpressPosting(job: any): void {
  const normalized: MarketplaceJob = {
    id: job.id || `job-exp-${Date.now()}`,
    slug: job.slug || `job-${Date.now()}`,
    title: job.title,
    companyName: job.companyName || job.organization?.name || 'Verified Enterprise',
    companySlug: job.companySlug || 'verified-enterprise',
    logoUrl: job.logoUrl || job.organization?.logoUrl || job.flyerUrl || null,
    city: job.city || 'Douala',
    region: job.region || 'Littoral',
    workMode: job.workMode || 'ONSITE',
    type: job.type || 'FULL_TIME',
    salaryMinXAF: job.salaryMinXAF ? Number(job.salaryMinXAF) : 0,
    salaryMaxXAF: job.salaryMaxXAF ? Number(job.salaryMaxXAF) : 0,
    description: job.description || '',
    department: job.department || 'General',
    field: job.field || 'General Business & Technology',
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    educationLevel: job.educationLevel || 'All levels welcome',
    isFeatured: Boolean(job.isFeatured),
  };

  const existingIdx = CAMEROON_MARKETPLACE_JOBS.findIndex((j) => j.slug === normalized.slug);
  if (existingIdx >= 0) {
    CAMEROON_MARKETPLACE_JOBS[existingIdx] = normalized;
  } else {
    CAMEROON_MARKETPLACE_JOBS.unshift(normalized);
  }

  inMemoryExpressPostings = [normalized, ...inMemoryExpressPostings.filter((j) => j.slug !== normalized.slug)];

  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const dir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, 'express-postings.json');
      fs.writeFileSync(filePath, JSON.stringify(inMemoryExpressPostings, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[marketplace] Error persisting express posting to file:', err);
    }
  }
}


