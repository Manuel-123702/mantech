'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, Briefcase, GraduationCap, MapPin, Building2, Calendar, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaggerContainer, StaggerItem } from '@/components/shared/section-animations';
import { PersonAvatar } from '@/components/shared/person-avatar';

type SuccessStory = {
  id: string;
  internName: string;
  institution: string;
  qualification: string;
  region: string;
  hostCompany: string;
  role: string;
  durationMonths: number;
  startYear: number;
  endYear: number;
  outcome: string;
  outcomeCategory: 'Full-time Hire' | 'Contract Extension' | 'Postgraduate Admission' | 'Startup Launch' | 'International Placement';
  keySkills: string[];
  headline: string;
  excerpt: string;
  story: string[];
  highlights: string[];
  photos?: { credit: string; caption: string }[];
};

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'ss_001',
    internName: 'Vanessa Kamga',
    institution: 'University of Buea',
    qualification: 'BSc Computer Engineering',
    region: 'South-West',
    hostCompany: 'Orange Cameroun',
    role: 'Network & Core Infrastructure Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['Cisco Routing', '5G Core', 'TCP/IP', 'SolarWinds', 'Python'],
    headline: 'From final-year student to Orange Core Network Engineer',
    excerpt: 'Vanessa completed her final-year internship with Orange Cameroun in Douala and was hired as a full-time Core Network Operations Engineer within the Bepanda data-center team.',
    story: [
      'During her final year in the Faculty of Engineering and Technology at the University of Buea, Vanessa Kamga joined MANTECH Nexus with a clear goal: to work with Cameroon\'s tier-1 telecom operators and understand how real 4G/5G core networks operate.',
      'Her Readiness Score placed her in the 94th percentile and her Intern Passport was verified within 48 hours after Orange Cameroun\'s verification request was approved by MANTECH.',
      'After a 6-month onsite internship rotating across the Bepanda data center, the NOC, and the 5G pilot teams, Vanessa received a full-time offer as a Core Network Operations Engineer.',
    ],
    highlights: [
      '94th percentile readiness score',
      'Rotated across 3 Orange infrastructure teams',
      'Hired full-time before graduation ceremony',
      'Wrote 12 internal tooling scripts still in NOC use',
    ],
  },
  {
    id: 'ss_002',
    internName: 'Armand Njoya',
    institution: 'University of Yaoundé I',
    qualification: 'MSc Software Engineering',
    region: 'Centre',
    hostCompany: 'MTN Cameroon',
    role: 'Mobile Financial Services Engineer',
    durationMonths: 5,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['Java Spring', 'Kafka', 'MoMo API', 'Docker', 'Oracle DB'],
    headline: 'MTN MoMo intern → full-time MFS Platform Engineer',
    excerpt: 'Armand Njoya, a graduate student from Yaoundé I, joined MTN Cameroon\'s Mobile Money platform team and now maintains critical MFS services.',
    story: [
      'Armand joined MANTECH Nexus while writing his MSc thesis at the University of Yaoundé I, listing Spring Boot, Kafka, and Oracle PL/SQL as his technical strengths.',
      'His internship coincided with the regional migration of MoMo services onto the new MFS Kubernetes platform. Because of his deep interest in distributed messaging, he was assigned to the Kafka reliability squad.',
      'By month 4 he had reduced platform lag in one critical MFS transaction queue from 780ms to 110ms using a rebalancing algorithm he had designed as his thesis case-study.',
      'Armand now works full-time for MTN Cameroon as an MFS Platform Engineer and continues to supervise MANTECH interns onboarding to the platform team.',
    ],
    highlights: [
      'Rebalanced a Kafka queue — 86% latency reduction',
      'Thesis case-study productionized before graduation',
      'Mentors 3 new MANTECH interns per cycle',
      'Co-authored internal MFS reliability playbook',
    ],
  },
  {
    id: 'ss_003',
    internName: 'Élodie Tchouante',
    institution: 'IUT Douala — UCAC',
    qualification: 'BTS Informatique de Gestion',
    region: 'Littoral',
    hostCompany: 'Canal+ Cameroun',
    role: 'Subscriber Data & CRM Intern',
    durationMonths: 4,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Contract Extension',
    outcomeCategory: 'Contract Extension',
    keySkills: ['SQL', 'Salesforce', 'Reporting', 'Excel Power Query', 'French Business Writing'],
    headline: 'Canal+ subscriber reporting → renewed contract',
    excerpt: 'Élodie, a BTS graduate from UCAC IUT Douala, extended her initial 4-month internship contract to 12 months after rebuilding the subscriber retention reporting.',
    story: [
      'Élodie Tchouante chose Canal+ Cameroun for her obligatory BTS internship because she wanted to understand how large-scale subscriber operations function.',
      'When she arrived, the Subscriber Retention team was producing their weekly churn reports manually using exported CSVs — a process that took one analyst 1.5 days per week.',
      'Élodie rebuilt the reporting workflow using SQL views, Salesforce dashboards, and Power Query automation. The churn report is now produced automatically on Monday mornings.',
      'After her 4-month BTS placement, Canal+ extended her contract for 12 months. She now coordinates the intern onboarding program for the entire Douala site.',
    ],
    highlights: [
      'Reporting time: 1.5 days/week → 4 minutes automated',
      'Contract extended from 4 months to 12 months',
      'First BTS graduate ever onboarded to Canal+ CRM team',
    ],
  },
  {
    id: 'ss_004',
    internName: 'Samuel Ngum',
    institution: 'University of Bamenda',
    qualification: 'HND Electronics & Telecom',
    region: 'North-West',
    hostCompany: 'CamTelecom',
    role: 'Fiber & Broadband Field Intern',
    durationMonths: 6,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['FTTH', 'OTDR Testing', 'Fiber Splicing', 'Huawei OLT', 'Safety Protocols'],
    headline: 'HND electronics graduate → CamTelecom FTTH field hire',
    excerpt: 'Samuel, from Bamenda, joined CamTelecom\'s fiber rollout team in Yaoundé during the nationwide FTTH expansion and became one of the youngest field engineers hired.',
    story: [
      'Samuel Ngum arrived in Yaoundé from the University of Bamenda with a strong HND qualification but limited real field experience. MANTECH\'s Readiness Score flagged fiber and RF certifications as key boosters.',
      'He joined the CamTelecom FTTH field team in Yaoundé 7 as an intern during the national "Fibre pour Tous" rollout. By month 2 he was certified in fiber splicing and OTDR fault testing.',
      'When a new FTTH zone in Damas was behind schedule because of a key technician\'s illness, Samuel stepped up and led the fault-clearing sprint. The zone was delivered 9 days early.',
      'CamTelecom\'s Regional FTTH Director retained Samuel as a full-time Field Operations Engineer. He now supervises new intern cohorts arriving via MANTECH.',
    ],
    highlights: [
      'Certified in fiber splicing during internship month 2',
      'Led Damas FTTH sprint — delivered 9 days early',
      'Only intern promoted to full-time Field Op Engineer in that cohort',
    ],
  },
  {
    id: 'ss_005',
    internName: 'Ruth Folefac',
    institution: 'HTTPC Douala',
    qualification: 'Licence 3 — Réseaux Télécom',
    region: 'Littoral',
    hostCompany: 'Nexttel Cameroun',
    role: 'OSS Provisioning Intern',
    durationMonths: 5,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['Ericsson OSS', 'ZTE Provisioning', 'CRM Integration', 'Shell Scripting'],
    headline: 'OSS provisioning intern → Nexttel BSS full-time',
    excerpt: 'Ruth Folefac completed her Licence 3 internship in Nexttel\'s OSS/BSS team in Douala, then stayed on as a Junior Provisioning Specialist.',
    story: [
      'Ruth completed her Licence 3 internship with Nexttel Cameroun through MANTECH Nexus. Originally assigned to the OSS reporting role, her natural curiosity quickly drew her deeper into the BSS layer.',
      'She discovered she could automate repetitive number-provisioning steps for new SIM activations using small shell scripts and ZTE\'s XML northbound API. Her manager encouraged her to submit these changes to the tooling repo.',
      'By the end of her 5-month internship, Nexttel had adopted her automation for 3 of the 4 number-segment migrations scheduled that year. Ruth was invited to stay as a Junior BSS Provisioning Specialist.',
    ],
    highlights: [
      'Automated 3 production number-provisioning migrations',
      'First Licence 3 graduate ever hired into Nexttel BSS',
      'Speaks at Nexttel internal DevOps monthly meetups',
    ],
  },
  {
    id: 'ss_006',
    internName: 'Fabrice Ngankam',
    institution: 'University of Douala',
    qualification: 'MSc Finance & Banking',
    region: 'Littoral',
    hostCompany: 'EcoBank Cameroun',
    role: 'Risk & Compliance Analyst Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2025,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['AML/KYC', 'SQL', 'Excel Modelling', 'IFRS 9', 'Risk Rating'],
    headline: 'Finance MSc → EcoBank Credit Risk Analyst',
    excerpt: 'Fabrice, a graduate student from University of Douala, joined EcoBank through MANTECH Nexus and accepted a full-time Credit Risk offer before the end of his internship.',
    story: [
      'Fabrice Ngankam had already taken and passed the AMMI Compliance course, so when he applied to the EcoBank risk and compliance role through MANTECH, the screening team flagged him as a priority.',
      'He worked on the IFRS 9 ECL model calibration team in EcoBank\'s Regional Risk Office in Douala Bonanjo, performing cohort-level expected credit loss computations for the SME loan book.',
      'Fabrice contributed directly to the Q3 2024 ECL sign-off workbook, building an automated reconciliation tool that caught a previously undetected 0.4% systematic over-statement in one product line. Head of Risk personally requested his retention.',
      'He accepted a full-time Credit Risk Analyst offer at EcoBank Cameroun one month prior to the formal end of his 6-month internship.',
    ],
    highlights: [
      'Detected 0.4% systematic over-statement in SME ECL book',
      'AMMI-certified in AML/KYC prior to application',
      'Full-time offer extended before internship end-date',
    ],
  },
  {
    id: 'ss_007',
    internName: 'Laura Ndzana',
    institution: 'ENSP Yaoundé',
    qualification: 'Ingénieur Génie Logiciel — Cycle 2',
    region: 'Centre',
    hostCompany: 'Yango Cameroun',
    role: 'Backend & Logistics Data Intern',
    durationMonths: 5,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['Python', 'Airflow', 'PostgreSQL', 'GIS', 'Optimisation'],
    headline: 'ENSP Yaoundé → Yango backend full-time in 5 months',
    excerpt: 'Laura Ndzana, ENSP Yaoundé Cycle 2 software engineering student, joined Yango Cameroon and was hired into the backend team before returning for her final academic year.',
    story: [
      'Laura Ndzana of ENSP Yaoundé applied to the Yango logistics data role via MANTECH Nexus in April 2024. Her ENSP transcript showed a perfect A in the numerical optimization class, and the Yango hiring manager instantly scheduled an interview.',
      'Laura joined the Yango Cameroon Backend team and worked on route-optimization tooling for the motorcycle courier segment. She built a driver-batching recommendation module that cut average assignment lag on the Yaoundé Plateau by about 18%.',
      'After 5 months, Yango extended a conditional full-time Backend Engineer offer that Laura deferred only long enough to complete her final ENSP semester. She is now on staff and part of the core logistics engineering rotation.',
    ],
    highlights: [
      '18% average reduction in Plateau driver-assignment lag',
      'Hired on conditional full-time basis mid-internship',
      'First ENSP Yaoundé intern to join Yango Cameroon backend team',
    ],
  },
  {
    id: 'ss_008',
    internName: 'Bernard Ndongo',
    institution: 'Faculty of Medicine, CUSS Yaoundé',
    qualification: 'PharmD — Public Health Option',
    region: 'Centre',
    hostCompany: 'Société Commerciale de Réassurance (SCR)',
    role: 'Health Insurance Data & Claims Intern',
    durationMonths: 6,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Postgraduate Admission',
    outcomeCategory: 'Postgraduate Admission',
    keySkills: ['Healthcare Claims', 'Statistical Analysis', 'French Technical Writing', 'SPSS', 'Excel'],
    headline: 'Health claims internship → McGill Global Health MSc',
    excerpt: 'Bernard used his health insurance internship data and the MANTECH-verified Intern Passport experience section to successfully apply for a McGill Global Health MSc scholarship.',
    story: [
      'Bernard Ndongo is a PharmD graduate from the CUSS Yaoundé Faculty of Medicine with a strong interest in universal health insurance financing in sub-Saharan Africa.',
      'He joined SCR (Société Commerciale de Réassurance) as a health claims intern via MANTECH Nexus, working on a retrospective analysis of the CIMA-compliant outpatient claims book for three regions over a two-year period.',
      'His case report, "Outpatient Claims Density in Cameroon\'s Emerging Private Health Insurance Market," was co-supervised by his SCR mentor and his CUSS thesis advisor. This paper, combined with his MANTECH-verified Intern Passport Experience entries, became a critical part of his successful application for a full MSc scholarship in Global Health at McGill University, Montreal.',
    ],
    highlights: [
      'CIMA-compliant outpatient claims retrospective at SCR',
      'Admitted to McGill Global Health MSc — FULL SCHOLARSHIP',
      'Intern Passport experience section directly cited in admission letter',
    ],
  },
  {
    id: 'ss_009',
    internName: 'Brenda Ewane',
    institution: 'University of Douala',
    qualification: 'L3 — Marketing & Digital Commerce',
    region: 'Littoral',
    hostCompany: 'Union Bank of Cameroon plc (UBC)',
    role: 'Digital Marketing Intern',
    durationMonths: 4,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['Meta Ads', 'Content Marketing', 'CMS', 'WhatsApp Business', 'Brand Copy'],
    headline: 'L3 Marketing graduate → UBC Digital Officer',
    excerpt: 'Brenda completed her 4-month university internship in UBC\'s Digital Marketing unit and returned after graduation as a Junior Digital Banking Officer.',
    story: [
      'Brenda Ewane applied through MANTECH Nexus with a portfolio of student-side brand projects. Union Bank of Cameroon\'s Head of Marketing reviewed her application and was impressed by the quality of her campaign briefs.',
      'During her 4-month internship Brenda restructured UBC\'s customer education content on WhatsApp Business, producing a 21-language content calendar for the bank\'s largest 7 regional markets in Cameroon. Click-through on customer education blasts grew by more than 40% in her tenure.',
      'After graduating L3 Marketing at Douala, she applied back to UBC through MANTECH Nexus and was hired as a Junior Digital Banking Officer — essentially the same team where she had interned.',
    ],
    highlights: [
      'Built multilingual WhatsApp education content calendar',
      'Customer education CTOR up >40% during internship',
      'Re-hired into the same unit after graduation',
    ],
  },
  {
    id: 'ss_010',
    internName: 'Emmanuel Mbarga',
    institution: 'IUT Bandjoun',
    qualification: 'DUT — Génie Civil',
    region: 'West',
    hostCompany: 'CECICAM Ciments du Cameroun',
    role: 'Quality Control & Lab Intern',
    durationMonths: 4,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Contract Extension',
    outcomeCategory: 'Contract Extension',
    keySkills: ['Concrete Testing', 'Lab Norms', 'AutoCAD Reading', 'French Technical Reports'],
    headline: 'IUT Bandjoun → CECICAM contract extended 8 months',
    excerpt: 'Emmanuel Mbarga from IUT Bandjoun joined CECICAM\'s Douala cement laboratory as an intern and had his contract extended by 8 months after an audit improvement.',
    story: [
      'Emmanuel Mbarga arrived at CECICAM from IUT Bandjoun through MANTECH Nexus. His DUT Génie Civil profile perfectly aligned with a concrete laboratory internship CECICAM was hiring for.',
      'During month 2, Emmanuel noticed inconsistencies in how the lab logged slump test results. He reorganized the logging spreadsheet according to CEM IX / Cameroonian Norm NC 12-310, and produced a bilingual procedure.',
      'When a surprise external inspection visited in late August, the improved documentation was singled out for praise in the audit report. CECICAM extended Emmanuel\'s 4-month DUT internship contract by 8 months.',
    ],
    highlights: [
      'Restructured slump-test logs to NC 12-310',
      'Explicitly praised in external audit report',
      'Contract extended by 8 months',
    ],
  },
  {
    id: 'ss_011',
    internName: 'Noëlla Ayissi',
    institution: 'Université des Montagnes Bangangté',
    qualification: 'Licence Informatique Appliquée',
    region: 'West',
    hostCompany: 'Creolink Technology',
    role: 'Full-stack JavaScript Intern',
    durationMonths: 5,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Startup Launch',
    outcomeCategory: 'Startup Launch',
    keySkills: ['React', 'Node', 'Prisma', 'TypeScript', 'UI/UX'],
    headline: 'Full-stack intern → Co-founder of a Buea-based SaaS startup',
    excerpt: 'Noëlla spent 5 months with Creolink Technology honing her full-stack skills, then co-founded a small B2B scheduling SaaS with two classmates back in Bangangté.',
    story: [
      'Noëlla Ayissi, from the Université des Montagnes in Bangangté, came to MANTECH Nexus seeking a practical software internship to complement her L3 Informatique Appliquée.',
      'Creolink Technology took her on as a Full-stack JS intern in their Douala studio. She worked on three client products, most notably contributing to the shipment scheduling component for a Douala-based logistics client.',
      'After returning to Bangangté to write her L3 thesis, Noëlla co-founded SchoolDesk, a small scheduling SaaS for private secondary schools in the West Region, using the exact Next.js + Prisma patterns she had learned at Creolink. As of early 2026, SchoolDesk has paying installations in 11 schools.',
    ],
    highlights: [
      '3 Creolink client projects shipped during internship',
      'Co-founded SchoolDesk scheduling SaaS after internship',
      '11 paying schools in West Region (as of early 2026)',
    ],
  },
  {
    id: 'ss_012',
    internName: 'Prisca Mvondo',
    institution: 'ESSEC Business School Douala',
    qualification: 'BBA — Marketing',
    region: 'Littoral',
    hostCompany: 'Union Brasseries de Cameroun (UBC)',
    role: 'Trade Marketing Internship — FMCG',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['POS Material Design', 'Promo Tracking', 'POSM Rollout', 'French Reporting'],
    headline: 'ESSEC Douala → UBC Trade Marketing Officer',
    excerpt: 'Prisca Mvondo, ESSEC BBA Marketing, interned at UBC FMCG and was hired as a full-time Trade Marketing Officer for the South Region.',
    story: [
      'Prisca\'s ESSEC BBA program required a 6-month immersion. She joined MANTECH Nexus in early 2024 and was matched with Union Brasseries de Cameroun\'s Trade Marketing team in Douala.',
      'She shadowed the South Region team across 4 major city activations (Douala-Bonanjo, Douala-Bepanda, Douala-Akwa, Douala-Lendi) and tracked the impact of the new POSM rollout on retail visibility.',
      'By mid-July, Prisca had restructured the weekly retail visibility report, which had previously been produced in scattered local files. Her consolidated dashboard is now the standard output reviewed in weekly trade marketing meetings.',
      'At the end of her BBA internship, UBC offered Prisca a full-time Trade Marketing Officer position covering the South Region.',
    ],
    highlights: [
      'South Region retail visibility dashboard standardized',
      '4 city activations covered — 282 POS audited',
      'Full-time offer before BBA final defense',
    ],
  },
  {
    id: 'ss_013',
    internName: 'Junior Bekolo',
    institution: 'University of Ngaoundéré',
    qualification: 'MSc Veterinary & Animal Health',
    region: 'Adamawa',
    hostCompany: 'University of Ngaoundéré Veterinary Teaching Hospital',
    role: 'Ruminant Health Research Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Postgraduate Admission',
    outcomeCategory: 'Postgraduate Admission',
    keySkills: ['Epidemiology', 'Lab Norms', 'Data Collection', 'French Scientific Writing'],
    headline: 'Veterinary MSc → DAAD-funded PhD in Tropical Animal Health',
    excerpt: 'Junior Bekolo leveraged MANTECH Nexus to formalize his veterinary teaching hospital internship and was admitted to a DAAD-funded PhD program in Tropical Animal Health.',
    story: [
      'Junior Bekolo was working on his MSc thesis in Veterinary & Animal Health at the University of Ngaoundéré, but his advisor wanted the fieldwork component to have a formally logged internship record.',
      'Through MANTECH Nexus\' dual-mode university placement coordination, Junior\'s MSc fieldwork in the Veterinary Teaching Hospital in Ngaoundéré was formally registered as a governed internship, with weekly logs in the MANTECH Placement Monitor.',
      'The resulting Intern Passport entry — fully verified by the hospital head of service, the university placement coordinator, and MANTECH\'s verification team — became a core component of his successful application for a DAAD-funded PhD in Tropical Animal Health.',
    ],
    highlights: [
      'First Ngaoundéré Vet student whose MSc fieldwork was formally tracked via MANTECH University Dual Mode',
      'DAAD PhD in Tropical Animal Health — Full Funding',
      'Passport verification by all three signatories required by DAAD',
    ],
  },
  {
    id: 'ss_014',
    internName: 'Diane Kenfack',
    institution: 'University of Dschang',
    qualification: 'MSc Agricultural & Applied Economics',
    region: 'West',
    hostCompany: 'CDC (Cameroon Development Corporation)',
    role: 'Agricultural Economics & Agronomy Intern',
    durationMonths: 5,
    startYear: 2024,
    endYear: 2024,
    outcome: 'International Placement',
    outcomeCategory: 'International Placement',
    keySkills: ['Farm Data Analysis', 'French Reports', 'Palm Oil Value Chain', 'Cost-Benefit Analysis'],
    headline: 'CDC agronomy intern → IITA regional research placement',
    excerpt: 'Diane completed her CDC internship on the smallholder palm-oil value chain and accepted a 2-year IITA Research Associate role in Cameroon.',
    story: [
      'Diane Kenfack, MSc Agricultural & Applied Economics from Dschang, applied for the CDC Agrarian Economics internship via MANTECH Nexus.',
      'She spent 5 months on a mixed-method study of the smallholder palm-oil value chain across two CDC estates in the South-West Region, producing a bilingual final report that CDC submitted to the Ministry of Agriculture.',
      'IITA recruiters reviewing MANTECH\'s verified Passport pool for a regional research associate role shortlisted Diane within 72 hours of her passport verification. She accepted a 2-year IITA Research Associate placement based in Cameroon.',
    ],
    highlights: [
      '5-month CDC palm-oil field study — bilingual report',
      'Report submitted to MINADER by CDC',
      'Hired within 72 hours for 2-year IITA Regional Research Associate',
    ],
  },
  {
    id: 'ss_015',
    internName: 'Hervé Menye',
    institution: 'Polytechnique de Maroua',
    qualification: 'Ingénieur — Énergie et Électromécanique',
    region: 'Far-North',
    hostCompany: 'CEET Est Cameroun',
    role: 'Solar Microgrid Design Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['PV Sizing', 'LiFePO4 Battery Banks', 'AutoCAD Electrical', 'French Technical Reports'],
    headline: 'Polytechnique Maroua → CEET East full-time Microgrid Engineer',
    excerpt: 'Hervé Menye interned with CEET Est Cameroun on their regional solar rural electrification program and was hired full-time after commissioning a 64 kWp microgrid.',
    story: [
      'Hervé Menye applied through MANTECH Nexus as a senior energy student at Polytechnique de Maroua. His final-year design project, a hybrid solar-palm-husk off-grid system, caught the eye of the CEET Est recruitment team.',
      'He was placed with the CEET Est Solar Microgrid team and worked across four rural electrification sites in the East Region of Cameroon (Kette, Bétaré-Oya, Garoua-Boulaï, and Batouri). Hervé was personally responsible for the PV string sizing documentation on the 64 kWp Batouri community microgrid.',
      'The Batouri microgrid successfully passed commissioning tests in November 2024. Two weeks later, Hervé accepted a full-time offer as a Microgrid Project Engineer at CEET Est Cameroun.',
    ],
    highlights: [
      '4 East Region microgrid sites covered',
      'PV string-sizing on 64 kWp Batouri site — passed commissioning',
      'Full-time Microgrid Engineer offer within 2 weeks of commissioning',
    ],
  },
  {
    id: 'ss_016',
    internName: 'Reine Bihina',
    institution: 'University of Garoua',
    qualification: 'Licence Droit des Affaires — OHADA',
    region: 'North',
    hostCompany: 'Air Inter Cameroun',
    role: 'Legal & Compliance Intern',
    durationMonths: 5,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    keySkills: ['OHADA Uniform Acts', 'Contract Review', 'French Legal Drafting', 'Compliance Checklists'],
    headline: 'Garoua OHADA law student → Air Inter Cameroun Legal Officer',
    excerpt: 'Reine Bihina of the University of Garoua Faculty of Law was hired as a Junior Legal Officer at Air Inter Cameroun after her compliance internship.',
    story: [
      'Reine Bihina was writing her final OHADA business law thesis at the University of Garoua when she applied through MANTECH Nexus. Air Inter Cameroun was hiring a compliance intern to review interlining and ground-handling contracts in advance of their West Coast expansion.',
      'Reine\'s OHADA knowledge, combined with flawless French drafting, made her immediately valuable to the in-house counsel team.',
      'By month 4, she had red-lined 47 ground-handling and interlining contracts, creating a standardized 3-page OHADA alignment checklist that Air Inter now uses for every new commercial agreement. The company hired her as a Junior Legal Officer before her official internship end date.',
    ],
    highlights: [
      '47 interlining / GH contracts red-lined',
      'Air Inter\'s standard OHADA alignment checklist created',
      'Full-time Legal Officer offer — extended early',
    ],
  },
  {
    id: 'ss_017',
    internName: 'Martial Soha',
    institution: 'University of Ebolowa',
    qualification: 'Licence Foresterie — Gestion des Ressources Naturelles',
    region: 'South',
    hostCompany: 'CDC Rubber Estates Division',
    role: 'Agroforestry & Sustainability Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Contract Extension',
    outcomeCategory: 'Contract Extension',
    keySkills: ['Forest Inventory', 'Carbon Accounting', 'French Technical Writing', 'GIS Mapping'],
    headline: 'Ebolowa Forestry graduate → 12-month CDC agroforestry extension',
    excerpt: 'Martial Soha completed his 6-month CDC internship in the Rubber Estates Division and had his contract extended by a year for carbon accounting work.',
    story: [
      'Martial Soha is a graduate of the University of Ebolowa Faculty of Agronomy and Forestry. He applied for a CDC agroforestry internship via MANTECH Nexus, with a clear focus on rubber estate sustainability.',
      'Martial proposed and implemented a simplified carbon-accounting grid for a 420-hectare replanting sector of the CDC Tiko Rubber Estate. The resulting data was used by CDC\'s Sustainability Office in their 2024 Voluntary Carbon Standard (VCS) project documentation.',
      'The 6-month internship was extended to 18 months, with Martial formally managing the carbon data collection workstream across 4 estates in the South-West and South Regions.',
    ],
    highlights: [
      '420 ha replant carbon grid — first of its kind at CDC Tiko',
      'Data used in VCS project documentation',
      'Extended from 6 months to 18 months',
    ],
  },
];

const CAT_COLORS: Record<SuccessStory['outcomeCategory'], string> = {
  'Full-time Hire': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Contract Extension': 'bg-blue-100 text-blue-700 border-blue-200',
  'Postgraduate Admission': 'bg-amber-100 text-amber-700 border-amber-200',
  'Startup Launch': 'bg-purple-100 text-purple-700 border-purple-200',
  'International Placement': 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function SuccessStoriesPage() {
  return (
    <div className="overflow-hidden bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.3'%3E%3Cpolygon fill='%23a78bfa' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="container-mantech relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-4xl text-center text-white">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
              <Award className="w-3.5 h-3.5" />
              Verified Journeys · Cameroon
            </span>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Intern Success Stories
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {SUCCESS_STORIES.length} verified internship journeys of Cameroonian interns across telecoms, banking, engineering, FMCG, health, agriculture, and law. All stories are published with explicit written permission and MANTECH Passport verification.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
              {['Full-time Hire', 'Contract Extension', 'Postgraduate Admission', 'Startup Launch', 'International Placement'].map((c) => (
                <div key={c} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-sm">
                  <div className="text-2xl font-extrabold font-heading text-amber-300">
                    {SUCCESS_STORIES.filter((s) => s.outcomeCategory === c).length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider mt-1 text-slate-400">{c}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-7">
            {SUCCESS_STORIES.map((story, idx) => (
              <StaggerItem key={story.id}>
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.5 }}
                  className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          id={story.id}
                          name={story.internName}
                          className="h-12 w-12 shrink-0 rounded-xl shadow-md ring-1 ring-slate-900/5"
                        />
                        <div>
                          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-blue-700">
                            {story.internName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {story.institution} · {story.qualification}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`shrink-0 border ${CAT_COLORS[story.outcomeCategory]}`}>
                        {story.outcomeCategory}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate">{story.hostCompany}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{story.region} Region</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">{story.role}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span>{story.durationMonths} months · {story.startYear}-{story.endYear}</span>
                      </div>
                    </div>
                  </header>

                  <div className="px-6 py-5">
                    <h4 className="font-semibold text-base leading-snug text-slate-900">
                      {story.headline}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {story.excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {story.keySkills.map((s) => (
                        <span key={s} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>

                    <ul className="mt-4 space-y-1.5">
                      {story.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-700">
                          <ChevronRight className="mt-0.5 w-3.5 h-3.5 shrink-0 text-blue-600" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-6 py-10 text-center shadow-card sm:px-10 sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <Award className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-heading text-xl font-semibold text-slate-900 sm:text-2xl">
              Share your own MANTECH Journey
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              If you completed an internship via MANTECH Nexus and would like to share your story (with your explicit consent and after verification), contact MANTECH on WhatsApp. We only publish journeys that are fully documented in the verified Intern Passport.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/sign-up">
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30">
                  Create your profile <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/mantech-internship">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
                  Browse IT internships
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
