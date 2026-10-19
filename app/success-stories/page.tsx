'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Building2,
  Calendar,
  ChevronRight,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Quote,
  Star,
  X,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaggerContainer, StaggerItem } from '@/components/shared/section-animations';
import { PersonAvatar } from '@/components/shared/person-avatar';

type SuccessStory = {
  id: string;
  internName: string;
  avatarUrl: string;
  institution: string;
  qualification: string;
  region: string;
  hostCompany: string;
  companyLogoText?: string;
  role: string;
  durationMonths: number;
  startYear: number;
  endYear: number;
  outcome: string;
  outcomeCategory: 'Full-time Hire' | 'Contract Extension' | 'Postgraduate Admission' | 'Startup Launch' | 'International Placement';
  field: 'Software & Cloud' | 'Telecom & Networks' | 'FinTech & Banking' | 'Data & AI' | 'Cybersecurity' | 'Engineering & IoT';
  passportId: string;
  keySkills: string[];
  headline: string;
  excerpt: string;
  quote: string;
  story: string[];
  highlights: string[];
  metrics: { label: string; value: string };
};

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'ss_001',
    internName: 'Vanessa Kamga',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Buea',
    qualification: 'BSc Computer Engineering (FET)',
    region: 'South-West',
    hostCompany: 'Orange Cameroun',
    companyLogoText: 'ORANGE',
    role: 'Core Network Operations Engineer',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Telecom & Networks',
    passportId: 'CMR-FET-2024-8841',
    keySkills: ['Cisco Routing', '5G Core', 'TCP/IP', 'SolarWinds', 'Python'],
    headline: 'From University of Buea to Orange Core Network Engineer',
    excerpt: 'Vanessa completed her final-year internship with Orange Cameroun in Douala and was hired as a full-time Core Network Operations Engineer within the Bepanda data-center team.',
    quote: 'MANTECH gave me credibility before I even stepped into the interview room. Having my verified Intern Passport meant Orange knew my engineering skills were real.',
    story: [
      'During her final year in the Faculty of Engineering and Technology (FET) at the University of Buea, Vanessa Kamga joined MANTECH Nexus with a clear goal: to work with Cameroon\'s tier-1 telecom operators and understand how real 4G/5G core networks operate.',
      'Her Readiness Score placed her in the 94th percentile and her Intern Passport was verified within 48 hours after Orange Cameroun\'s verification request was approved by MANTECH.',
      'After a 6-month onsite internship rotating across the Bepanda data center, the NOC, and the 5G pilot teams, Vanessa received a full-time offer as a Core Network Operations Engineer.',
    ],
    highlights: [
      '94th percentile readiness score across Cameroon candidates',
      'Rotated across 3 Orange infrastructure teams in Douala',
      'Hired full-time 3 weeks prior to graduation ceremony',
      'Authored 12 internal Python automation scripts still in active NOC use',
    ],
    metrics: { label: 'NOC Automation', value: '12 scripts in prod' },
  },
  {
    id: 'ss_002',
    internName: 'Armand Njoya',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Yaoundé I',
    qualification: 'MSc Software Engineering',
    region: 'Centre',
    hostCompany: 'MTN Cameroon',
    companyLogoText: 'MTN MOMO',
    role: 'Mobile Financial Services (MFS) Engineer',
    durationMonths: 6,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'FinTech & Banking',
    passportId: 'CMR-UY1-2024-5109',
    keySkills: ['Java Spring Boot', 'Apache Kafka', 'MoMo API', 'Docker', 'Oracle DB'],
    headline: 'MTN MoMo intern → full-time MFS Platform Engineer',
    excerpt: 'Armand joined MTN Cameroon\'s Mobile Money platform team and optimized critical transaction queues, cutting latency by 86%.',
    quote: 'Handling real MoMo transaction volume taught me more in three months than three years of textbook architecture. MANTECH made that bridge possible.',
    story: [
      'Armand joined MANTECH Nexus while writing his MSc thesis at the University of Yaoundé I, listing Spring Boot, Kafka, and Oracle PL/SQL as his technical strengths.',
      'His internship coincided with the regional migration of MoMo services onto a new Kubernetes-based MFS infrastructure. Because of his deep interest in distributed messaging, he was assigned to the Kafka reliability squad.',
      'By month 4, he reduced platform lag in one critical MFS transaction queue from 780ms to 110ms using a partition rebalancing algorithm he designed as his thesis case-study.',
      'Armand now works full-time for MTN Cameroon as an MFS Platform Engineer and continues to supervise MANTECH interns onboarding to the team.',
    ],
    highlights: [
      'Rebalanced Kafka transaction queue — 86% latency reduction',
      'Master thesis case-study productionized before graduation',
      'Mentors 3 new MANTECH incoming interns per intake cohort',
      'Co-authored internal MTN MFS microservices reliability playbook',
    ],
    metrics: { label: 'Transaction Latency', value: '-86% queue lag' },
  },
  {
    id: 'ss_003',
    internName: 'Élodie Tchouante',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    institution: 'UCAC — ICAM Douala',
    qualification: 'Master Ingénieur Généraliste',
    region: 'Littoral',
    hostCompany: 'Canal+ Cameroun',
    companyLogoText: 'CANAL+',
    role: 'Subscriber Analytics & CRM Engineer',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Contract Extension',
    outcomeCategory: 'Contract Extension',
    field: 'Data & AI',
    passportId: 'CMR-UCAC-2024-3321',
    keySkills: ['PostgreSQL', 'Python Pandas', 'Salesforce CRM', 'Power BI', 'ETL Pipelines'],
    headline: 'Canal+ subscriber churn prediction → 12-month engineering extension',
    excerpt: 'Élodie rebuilt subscriber churn analytics, automating 1.5 days of manual weekly reporting down to a 4-minute automated workflow.',
    quote: 'I proved that an intern could automate enterprise-scale reporting. Canal+ extended my placement to lead their new data pipeline initiative.',
    story: [
      'Élodie Tchouante chose Canal+ Cameroun for her engineering placement because she wanted to solve large-scale subscriber retention challenges in Central Africa.',
      'When she arrived, the Subscriber Retention team was producing weekly churn reports manually using exported CSVs — a process that took one analyst 1.5 days per week.',
      'Élodie rebuilt the reporting workflow using SQL views, Python scripts, and automated Power BI dashboards. The churn report is now produced automatically on Monday mornings in 4 minutes.',
      'Canal+ extended her contract for a full year as a Lead Junior Data Analyst to spearhead their regional subscriber predictive analytics.',
    ],
    highlights: [
      'Reporting turnaround: 1.5 days/week → 4 minutes automated',
      'Extended to 12-month contract leading churn data squad',
      'Integrated automated alerts for customer renewal drop-offs',
      'Trained 8 staff members on self-serve SQL dashboarding',
    ],
    metrics: { label: 'Report Time', value: '1.5 days → 4 mins' },
  },
  {
    id: 'ss_004',
    internName: 'Samuel Ngum',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Bamenda (NAHPI)',
    qualification: 'B.Eng Telecommunications Engineering',
    region: 'North-West',
    hostCompany: 'CamTel',
    companyLogoText: 'CAMTEL',
    role: 'FTTH & Optical Fiber Field Specialist',
    durationMonths: 6,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Telecom & Networks',
    passportId: 'CMR-UBa-2024-1904',
    keySkills: ['FTTH Rollout', 'OTDR Testing', 'Fiber Splicing', 'Huawei OLT', 'Optical Budgeting'],
    headline: 'Bamenda graduate → CamTel national fiber rollout engineer',
    excerpt: 'Samuel joined CamTel during the "Fibre pour Tous" expansion and led the fault-clearing sprint for Yaoundé 7 ahead of schedule.',
    quote: 'The practical field experience with CamTel OTDR testing turned theory into muscle memory. MANTECH validated my credentials from day one.',
    story: [
      'Samuel Ngum completed his B.Eng at NAHPI Bamenda with high academic marks. MANTECH\'s verified passport helped him connect directly with CamTel\'s national transmission headquarters.',
      'He joined the CamTel FTTH team in Yaoundé during the national fiber deployment. By month 2, he earned practical certification in precision fiber splicing and OTDR fault-clearing.',
      'When a key residential corridor in Damas was delayed by broken conduit infrastructure, Samuel led an emergency fault-clearing sprint that brought 420 homes online 9 days early.',
      'CamTel\'s Regional Director promoted Samuel into a permanent Field Operations role, where he now coordinates optical deployment across Central Cameroon.',
    ],
    highlights: [
      'Led Damas FTTH corridor sprint — delivered 9 days early',
      'Certified in OTDR fiber fault diagnostics and fusion splicing',
      'Supervises optical deployment covering over 4,000 subscriber ports',
      'Youngest engineer promoted to regional field coordinator in 2024',
    ],
    metrics: { label: 'Fiber Rollout', value: '420 homes 9d early' },
  },
  {
    id: 'ss_005',
    internName: 'Marc-Aurèle Ebanda',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    institution: 'École Polytechnique de Yaoundé (ENSPY)',
    qualification: 'Diplôme d’Ingénieur en Génie Informatique',
    region: 'Centre',
    hostCompany: 'Maviance (Smobilpay)',
    companyLogoText: 'SMOBILPAY',
    role: 'FinTech Backend API Engineer',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'FinTech & Banking',
    passportId: 'CMR-ENSPY-2024-9102',
    keySkills: ['Go (Golang)', 'PostgreSQL', 'Redis', 'ISO 8583', 'Payment Gateways'],
    headline: 'Polytechnique graduate → Maviance Smobilpay core backend team',
    excerpt: 'Marc-Aurèle engineered high-throughput payment settlement workers handling over 120,000 daily utility bill transactions across Central Africa.',
    quote: 'Working on Smobilpay payment rails showed me how vital rock-solid Go concurrency is when people rely on you to pay their lights and water.',
    story: [
      'Graduating top of his class at ENSPY, Marc-Aurèle wanted to work on high-load distributed payment infrastructure rather than standard web apps.',
      'Through MANTECH Nexus, Maviance shortlisted him within 48 hours for their backend infrastructure team.',
      'During his placement, he designed a resilient Go microservice worker with Redis pub/sub to handle idempotent transaction webhooks for Eneo and CamWater payments, slashing failed retry timeouts by 65%.',
      'He signed a full-time contract as a Core FinTech Engineer immediately following his thesis defense.',
    ],
    highlights: [
      'Processed 120,000+ daily utility transactions without race conditions',
      'Cut failed webhook retry latency by 65%',
      'Designed ISO 8583 payment adapter module in Go',
      'Transitioned to full-time staff engineer with senior sponsorship',
    ],
    metrics: { label: 'Daily Volume', value: '120k+ transactions' },
  },
  {
    id: 'ss_006',
    internName: 'Ruth Folefac',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    institution: 'Institut Universitaire de la Côte (IUC)',
    qualification: 'Licence Pro Réseaux & Télécoms',
    region: 'Littoral',
    hostCompany: 'Diool Cameroon',
    companyLogoText: 'DIOOL',
    role: 'Cloud Security & DevOps Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Cybersecurity',
    passportId: 'CMR-IUC-2024-6048',
    keySkills: ['Kubernetes', 'Terraform', 'AWS IAM', 'Linux Hardening', 'CI/CD GitHub Actions'],
    headline: 'IUC Licence Pro → Diool Cloud Infrastructure Engineer',
    excerpt: 'Ruth automated compliance audits and zero-trust IAM policies across Diool\'s multi-cloud infrastructure, earning an immediate permanent offer.',
    quote: 'MANTECH gives female tech students an undeniable voice. My Intern Passport let my practical cloud skills speak louder than assumptions.',
    story: [
      'Ruth joined MANTECH with hands-on labs in Linux administration and Docker containers completed at IUC Douala.',
      'Selected by FinTech startup Diool, she was tasked with hardening cloud infrastructure against OWASP vulnerabilities and configuring PCI-DSS compliance checks.',
      'Her automated Terraform modules unified staging and production security controls, cutting misconfigured ingress rule alerts to zero.',
      'She accepted a permanent role as Cloud Security Operations Engineer at Diool before her cohort finished.',
    ],
    highlights: [
      'Unified cloud security across 18 microservices using Terraform',
      'Achieved zero critical IAM misconfiguration alerts',
      'Implemented automated secret rotation via Vault',
      'Promoted to full-time Cloud Security Operations Engineer',
    ],
    metrics: { label: 'Security Alerts', value: '0 critical misconfigs' },
  },
  {
    id: 'ss_007',
    internName: 'Fabrice Ngankam',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Douala',
    qualification: 'MSc Financial Informatics & Risk',
    region: 'Littoral',
    hostCompany: 'Ecobank Cameroun',
    companyLogoText: 'ECOBANK',
    role: 'Credit Risk & Compliance Modeler',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2025,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'FinTech & Banking',
    passportId: 'CMR-UDo-2024-7719',
    keySkills: ['IFRS 9 Modeling', 'SQL Analytics', 'Python Scikit-Learn', 'AML/KYC', 'Risk Rating'],
    headline: 'Douala MSc → Ecobank Regional Risk Intelligence Specialist',
    excerpt: 'Fabrice built an automated reconciliation model that detected an undetected 0.4% discrepancy in SME loan provisions, saving 42M FCFA.',
    quote: 'The rigor MANTECH requires prepared me for the scrutiny of bank risk committees. They treated me as an analyst on my very first day.',
    story: [
      'Fabrice entered MANTECH Nexus with strong mathematical modeling and SQL querying abilities from University of Douala.',
      'Ecobank\'s Regional Risk Directorate in Bonanjo selected him to assist with IFRS 9 ECL calculations for Central African SME lending.',
      'He developed an automated Python reconciliation script that uncovered an undetected provision calculation error, saving the bank over 42 Million FCFA in capital adjustments.',
      'The Regional Head of Risk personally signed his transition to a permanent Credit Risk Analyst.',
    ],
    highlights: [
      'Identified and corrected 42M FCFA SME loan provisioning divergence',
      'Built automated IFRS 9 risk workbook running across CEMAC zone',
      'Completed international AML/KYC certification during internship',
      'Hired full-time 4 weeks prior to internship conclusion',
    ],
    metrics: { label: 'Capital Saved', value: '42M FCFA reconciled' },
  },
  {
    id: 'ss_008',
    internName: 'Laura Ndzana',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Yaoundé I',
    qualification: 'BSc Computer Science',
    region: 'Centre',
    hostCompany: 'Koree Technologies',
    companyLogoText: 'KOREE',
    role: 'Full-Stack Mobile Engineer (Flutter/Node)',
    durationMonths: 5,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Software & Cloud',
    passportId: 'CMR-UY1-2024-4112',
    keySkills: ['Flutter', 'Dart', 'Node.js', 'PostgreSQL', 'Offline-First Sync'],
    headline: 'From student developer to core engineer at Koree',
    excerpt: 'Laura designed the offline-first spare change cashback synchronization that increased merchant transaction speed by 3.2x in Yaoundé supermarkets.',
    quote: 'Seeing real supermarket cashiers and shoppers using code I wrote was unbelievable. MANTECH connected me to a high-growth tech startup.',
    story: [
      'Laura had built several side projects on GitHub but had no corporate internship experience when she registered on MANTECH Nexus.',
      'Her profile caught the eye of Koree, the Cameroonian fintech startup digitizing small retail change and loyalty.',
      'Laura spearheaded their offline caching protocol for local grocery POS scanners, ensuring cashback credits register even during cellular network dips.',
      'Koree offered her a permanent role as Core Mobile Developer right after her final university defense.',
    ],
    highlights: [
      'Shipped offline-first sync engine used in 80+ retail partner stores',
      'Accelerated cashier transaction checkout time by 3.2x',
      'Represented Koree at Central Africa Tech Week 2024',
      'Now heads intern onboarding and frontend code reviews at Koree',
    ],
    metrics: { label: 'Checkout Speed', value: '3.2x faster sync' },
  },
  {
    id: 'ss_009',
    internName: 'Junior Bekolo',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    institution: 'École Polytechnique de Yaoundé (ENSPY)',
    qualification: 'Master en Intelligence Artificielle',
    region: 'Centre',
    hostCompany: 'Healthlane Cameroon',
    companyLogoText: 'HEALTHLANE',
    role: 'Computer Vision & Health AI Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Startup Launch',
    outcomeCategory: 'Startup Launch',
    field: 'Data & AI',
    passportId: 'CMR-ENSPY-2024-1189',
    keySkills: ['PyTorch', 'FastAPI', 'OpenCV', 'Medical Imaging', 'Docker'],
    headline: 'Health AI intern → Co-founded MedVision Cameroon',
    excerpt: 'Junior built automated malaria cell screening models with Healthlane and subsequently co-founded a diagnostic startup backed by local grants.',
    quote: 'My internship gave me the medical domain confidence and clinical partnerships needed to turn a research algorithm into an actual diagnostic venture.',
    story: [
      'Junior Bekolo completed his ENSPY AI research project focusing on automated microscopic detection of Plasmodium falciparum in blood smears.',
      'Through MANTECH, Healthlane provided clinical access, microscopy data feeds, and laboratory validation across Yaoundé clinics.',
      'His model achieved a 96.4% sensitivity rate in clinical trials. Following his placement, he co-founded MedVision alongside two medical doctors, securing 15M FCFA in pre-seed innovation grants.',
    ],
    highlights: [
      'Achieved 96.4% sensitivity in automated malaria microscopic detection',
      'Secured 15M FCFA seed funding for MedVision diagnostic venture',
      'Deployed pilot testing in 4 community healthcare centres',
      'Published findings in African Health Informatics Journal',
    ],
    metrics: { label: 'Clinical Accuracy', value: '96.4% sensitivity' },
  },
  {
    id: 'ss_010',
    internName: 'Brenda Ewane',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Buea',
    qualification: 'BSc Software Engineering',
    region: 'South-West',
    hostCompany: 'Activa Assurances',
    companyLogoText: 'ACTIVA',
    role: 'Full-Stack Web & Cloud Developer',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Software & Cloud',
    passportId: 'CMR-UB-2024-7492',
    keySkills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    headline: 'Buea Software Grad → Activa Digital Claims Portal Architect',
    excerpt: 'Brenda modernized Activa\'s regional claims portal, lowering digital claim registration time from 3 days to under 15 minutes.',
    quote: 'The speed and clarity of MANTECH gave me the platform to showcase my full-stack skills. Activa hired me before my final graduation list came out.',
    story: [
      'Brenda trained in the Silicon Mountain tech hub in Buea, specializing in TypeScript, modern React, and accessible web systems.',
      'Activa recruited her through MANTECH to modernize their client-facing insurance claims processing interface for policyholders.',
      'Her responsive web application streamlined vehicle accident claim filings with instant photo upload and geolocation tagging, reducing submission back-and-forth by 80%.',
      'She was hired as a full-time Software Engineer in Activa\'s Digital Innovation Department.',
    ],
    highlights: [
      'Reduced claim filing turnaround from 3 days to 15 minutes',
      'Modernized 14 legacy portal forms into accessible React components',
      'Zero production bug reports in first 90 days of launch',
      'Promoted to Lead Frontend Developer for Pan-African insurance portal',
    ],
    metrics: { label: 'Claims Speed', value: '3 days → 15 mins' },
  },
  {
    id: 'ss_011',
    internName: 'Emmanuel Mbarga',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Dschang (IUT FOTSO Victor)',
    qualification: 'DUT Génie Télécommunications',
    region: 'West',
    hostCompany: 'Eneo Cameroon',
    companyLogoText: 'ENEO',
    role: 'SCADA & Industrial IoT Networks Intern',
    durationMonths: 6,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Engineering & IoT',
    passportId: 'CMR-UDs-2024-8114',
    keySkills: ['Modbus TCP', 'Industrial IoT', 'Cisco Industrial', 'Grafana', 'Python'],
    headline: 'FOTSO Victor graduate → Eneo Grid Telemetry Engineer',
    excerpt: 'Emmanuel configured telemetry sensors for 18 regional distribution substations, providing real-time grid fault monitoring in West Cameroon.',
    quote: 'Practical telemetry at Eneo power stations gave me a sense of national purpose. MANTECH bridged the gap from Bandjoun to regional power grids.',
    story: [
      'Emmanuel studied telecommunications and industrial automation at IUT FOTSO Victor in Bandjoun.',
      'Eneo selected him via MANTECH for their regional distribution grid telemetry renewal project.',
      'He installed and programmed IP-based Modbus gateways across 18 medium-voltage electrical substations in Bafoussam, transmitting telemetry into Eneo\'s central SCADA dashboard.',
      'Eneo retained him as an Electrical Networks Telemetry Engineer upon completion.',
    ],
    highlights: [
      'Installed telemetry monitoring across 18 electrical substations',
      'Integrated real-time breaker trips into Grafana alert notifications',
      'Reduced outage diagnosis time from hours to under 90 seconds',
      'Awarded Best Technical Intern 2024 by Eneo West Region',
    ],
    metrics: { label: 'Outage Diagnosis', value: 'Hours → 90 secs' },
  },
  {
    id: 'ss_012',
    internName: 'Noëlla Ayissi',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Yaoundé II (Soa)',
    qualification: 'Master en Droit des Affaires & Conformité',
    region: 'Centre',
    hostCompany: 'Société Générale Cameroun',
    companyLogoText: 'SOCGEN',
    role: 'Banking Regulatory Compliance & Data Privacy Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'FinTech & Banking',
    passportId: 'CMR-UY2-2024-2905',
    keySkills: ['COBAC Regulations', 'Data Privacy (ANTIC)', 'OHADA Compliance', 'Contract Review'],
    headline: 'Soa Master graduate → Société Générale Compliance Officer',
    excerpt: 'Noëlla audited digital banking compliance against COBAC regulatory standards and was hired full-time into the legal oversight squad.',
    quote: 'MANTECH isn\'t only for programmers. For legal and compliance students, having a structured, verified avenue to banks like SocGen is game-changing.',
    story: [
      'Noëlla graduated with high honors in Business Law from University of Yaoundé II, specializing in banking regulation.',
      'She used MANTECH to apply directly to Société Générale\'s Legal and Compliance Division in Douala.',
      'She audited 32 third-party vendor agreements against ANTIC data protection laws and COBAC electronic banking guidelines.',
      'Her exhaustive legal matrices impressed the General Counsel, leading to a direct recruitment as Junior Compliance Officer.',
    ],
    highlights: [
      'Audited 32 vendor tech contracts for COBAC & ANTIC compliance',
      'Authored the 2024 internal Data Privacy Guidelines for retail banking',
      'Represented compliance unit during internal regional audit',
      'Full-time offer formalized within 5 months of start date',
    ],
    metrics: { label: 'Vendor Audits', value: '32 contracts cleared' },
  },
  {
    id: 'ss_013',
    internName: 'Prisca Mvondo',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Ngaoundéré (ENSIR)',
    qualification: 'Ingénieur en Génie Électrique & Énergies Renouvelables',
    region: 'Adamawa',
    hostCompany: 'Agro-Hub Cameroon',
    companyLogoText: 'AGRO-HUB',
    role: 'Solar Microgrid & Cold Storage Systems Engineer',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Contract Extension',
    outcomeCategory: 'Contract Extension',
    field: 'Engineering & IoT',
    passportId: 'CMR-UNg-2024-5219',
    keySkills: ['Solar PV Sizing', 'IoT Telemetry', 'Battery Storage', 'Inverter Systems', 'AutoCAD'],
    headline: 'Ngaoundéré Engineer → Extended lead on agricultural solar grids',
    excerpt: 'Prisca designed off-grid solar cooling systems for cassava farmers in Adamawa, preserving 45 metric tons of produce from spoilage.',
    quote: 'Engineers from northern Cameroon have massive talent to contribute. MANTECH enabled me to connect with impactful projects that solve food security.',
    story: [
      'Prisca completed her engineering degree at ENSIR in Ngaoundéré with a special focus on rural solar electrification.',
      'Agro-Hub hired her through MANTECH to design autonomous solar-powered micro-chilling stations for smallholder farmers.',
      'Her automated temperature monitoring and solar battery balance design kept cooling chambers active through 99.8% of daily solar cycles.',
      'Agro-Hub extended her contract into a project leadership role supervising 6 solar installation sites.',
    ],
    highlights: [
      'Preserved 45 metric tons of perishable produce in pilot season',
      'Engineered solar microgrid maintaining 99.8% uptime',
      'Contract extended to oversee 6 regional solar cooling stations',
      'Mentored 4 local vocational apprentices in solar wiring',
    ],
    metrics: { label: 'Produce Saved', value: '45 tons preserved' },
  },
  {
    id: 'ss_014',
    internName: 'Hervé Menye',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    institution: 'IUT Douala — Université de Douala',
    qualification: 'Licence Pro Génie Logiciel',
    region: 'Littoral',
    hostCompany: 'Port Autonome de Douala (PAD)',
    companyLogoText: 'PAD',
    role: 'Maritime Logistics Software Engineer',
    durationMonths: 6,
    startYear: 2023,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Software & Cloud',
    passportId: 'CMR-UDo-2024-9028',
    keySkills: ['Java Spring', 'Angular', 'Oracle DB', 'EDIFACT Protocols', 'REST APIs'],
    headline: 'IUT Douala graduate → Port of Douala digital logistics engineer',
    excerpt: 'Hervé optimized the container clearance EDI verification pipeline, cutting gate inspection queuing times by 35% in Bonabéri.',
    quote: 'The Port of Douala moves the economy of Central Africa. Working on gate clearance systems showed me how software changes lives.',
    story: [
      'Hervé studied Software Engineering at IUT Douala and built strong command over Java and enterprise databases.',
      'Port Autonome de Douala accepted his MANTECH application for their Terminal Management System modernization.',
      'Hervé wrote automated EDI message parsers that validated customs clearance manifests directly against cargo bay databases.',
      'The port IT directorate offered him a full-time engineering position to support national maritime digitization.',
    ],
    highlights: [
      'Reduced cargo gate inspection wait times by 35%',
      'Handled automated EDI validation for thousands of containers',
      'Direct full-time transition into the Port Information Systems department',
      'Co-authored technical user documentation for maritime agents',
    ],
    metrics: { label: 'Gate Clearance', value: '-35% inspection queue' },
  },
  {
    id: 'ss_015',
    internName: 'Diane Kenfack',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Dschang',
    qualification: 'MSc Applied Statistics & Machine Learning',
    region: 'West',
    hostCompany: 'UBA Cameroon',
    companyLogoText: 'UBA',
    role: 'Fraud Detection & Machine Learning Intern',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Postgraduate Admission',
    outcomeCategory: 'Postgraduate Admission',
    field: 'Data & AI',
    passportId: 'CMR-UDs-2024-3871',
    keySkills: ['Python', 'XGBoost', 'SQL', 'Fraud Analytics', 'FastAPI'],
    headline: 'UBA Fraud Analytics Intern → Secured €45k PhD Scholarship',
    excerpt: 'Diane analyzed suspicious mobile banking transactions at UBA, leading to a fully-funded PhD fellowship in AI at Paris-Saclay.',
    quote: 'MANTECH gave me real-world fraud dataset experience that made my PhD application stand out against candidates from all over the world.',
    story: [
      'Diane studied applied statistics at University of Dschang with a passion for anomaly detection algorithms.',
      'During her 6-month MANTECH placement with UBA Cameroon in Douala, she trained gradient boosted trees on anonymized card and mobile transactions, increasing automated fraud flag accuracy by 22%.',
      'Her published case-study helped her secure a competitive €45,000 doctoral fellowship in Artificial Intelligence at Université Paris-Saclay.',
    ],
    highlights: [
      'Improved automated fraud detection accuracy by 22% at UBA',
      'Awarded €45,000 full doctoral fellowship at Université Paris-Saclay',
      'Presented machine learning paper at African Data Science Summit',
      'Continues research collaboration with Cameroon banking partners',
    ],
    metrics: { label: 'PhD Scholarship', value: '€45,000 fellowship' },
  },
  {
    id: 'ss_016',
    internName: 'Martial Soha',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Buea',
    qualification: 'BSc Computer Science',
    region: 'South-West',
    hostCompany: 'Kemitix Open Source Labs',
    companyLogoText: 'KEMITIX',
    role: 'Distributed Systems & Open-Source Maintainer',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'International Placement',
    outcomeCategory: 'International Placement',
    field: 'Software & Cloud',
    passportId: 'CMR-UB-2024-4401',
    keySkills: ['Rust', 'WebAssembly', 'Distributed Key-Value', 'GitHub CI', 'Docker'],
    headline: 'Buea student → Hired remotely by Berlin-based Cloud Infrastructure Startup',
    excerpt: 'Martial contributed to high-performance open-source Rust runtimes during his placement, leading to an international remote engineering contract.',
    quote: 'With MANTECH\'s structured verification, international startups can see that African software developers write world-class, rigorous code.',
    story: [
      'Martial participated in MANTECH as an open-source engineering intern collaborating with Kemitix labs in Buea.',
      'He focused on memory-safe distributed database runtimes written in Rust, contributing 18 merged pull requests to upstream open-source projects.',
      'A European cloud infrastructure startup reviewed his commits and offered him a competitive full-time remote developer contract paying in Euros.',
    ],
    highlights: [
      '18 merged pull requests into upstream distributed systems repos',
      'Hired as Remote Systems Engineer by Berlin cloud startup',
      'Speaks at Buea Rust Developers community meetups',
      'Runs open-source mentorship sessions for younger MANTECH candidates',
    ],
    metrics: { label: 'Remote Hire', value: 'Berlin tech team' },
  },
  {
    id: 'ss_017',
    internName: 'Reine Bihina',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    institution: 'University of Maroua (ISS)',
    qualification: 'Ingénieur en Télécommunications & Réseaux',
    region: 'Far North',
    hostCompany: 'CamTel Regional Office',
    companyLogoText: 'CAMTEL',
    role: 'Microwave & Satellite Transmission Specialist',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'Full-time Hire',
    outcomeCategory: 'Full-time Hire',
    field: 'Telecom & Networks',
    passportId: 'CMR-UMa-2024-9182',
    keySkills: ['Microwave Links', 'VSAT', 'IP Transmission', 'RF Spectrum Analysis', 'Solar Backup'],
    headline: 'Maroua Engineer → Hired as CamTel Regional Transmission Specialist',
    excerpt: 'Reine secured reliable microwave backhaul connections for 14 rural health centers across the Far North region of Cameroon.',
    quote: 'Connecting hospitals and clinics in the Far North via robust telecom links proved to me that engineering has a profound social responsibility.',
    story: [
      'Reine excelled in telecom propagation theory at Institut Supérieur du Sahel in Maroua.',
      'Through MANTECH, CamTel assigned her to the Northern Transmission Team restoring and upgrading microwave links to rural dispensaries.',
      'Reine calibrated link budgets in harsh Sahel weather conditions, eliminating rain-fade disconnects for 14 clinics.',
      'CamTel offered her a permanent role as Regional Transmission Engineer in Maroua.',
    ],
    highlights: [
      'Stabilized microwave links for 14 rural medical centers',
      'Eliminated seasonal rain-fade attenuation on Maroua-Kousseri corridor',
      'Hired permanently in CamTel Far North regional operations',
      'Role model for young women in STEM across northern Cameroon',
    ],
    metrics: { label: 'Clinic Backhaul', value: '14 centers online' },
  },
  {
    id: 'ss_018',
    internName: 'Bernard Ndongo',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    institution: 'École Polytechnique de Yaoundé (ENSPY)',
    qualification: 'Ingénieur en Génie Électrique',
    region: 'Centre',
    hostCompany: 'African Development Bank (AfDB Placement)',
    companyLogoText: 'AFDB',
    role: 'Infrastructure Energy Transition Analyst',
    durationMonths: 6,
    startYear: 2024,
    endYear: 2024,
    outcome: 'International Placement',
    outcomeCategory: 'International Placement',
    field: 'Engineering & IoT',
    passportId: 'CMR-ENSPY-2024-7091',
    keySkills: ['Power Grid Modeling', 'PVSyst', 'Financial Feasibility', 'Hydroelectric Systems'],
    headline: 'Polytechnique Graduate → Selected for AfDB Regional Energy Program',
    excerpt: 'Bernard modeled regional grid feasibility for cross-border Cameroon-Chad electrical interconnection, earning an AfDB fellowship.',
    quote: 'MANTECH allowed my academic research at ENSPY to transition directly into high-level multilateral development infrastructure.',
    story: [
      'Bernard specialized in high-voltage transmission and power grid stability at ENSPY.',
      'Through MANTECH, he was matched with the Central Africa Regional Power Interconnection project.',
      'His grid synchronization models were incorporated into the technical annex of the 2024 project appraisal report.',
      'He received an international placement contract with the AfDB Regional Office.',
    ],
    highlights: [
      'Simulated stability for Cameroon-Chad 225kV interconnection',
      'Contributed directly to multilateral investment appraisal documents',
      'Awarded AfDB Young Energy Professional placement',
      'Selected for regional clean energy delegation',
    ],
    metrics: { label: 'Grid Modeling', value: '225kV cross-border' },
  },
];

const CAT_COLORS: Record<SuccessStory['outcomeCategory'], { badge: string; border: string; glow: string }> = {
  'Full-time Hire': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    border: 'hover:border-emerald-500/40',
    glow: 'from-emerald-500/10',
  },
  'Contract Extension': {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    border: 'hover:border-blue-500/40',
    glow: 'from-blue-500/10',
  },
  'Postgraduate Admission': {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    border: 'hover:border-amber-500/40',
    glow: 'from-amber-500/10',
  },
  'Startup Launch': {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    border: 'hover:border-purple-500/40',
    glow: 'from-purple-500/10',
  },
  'International Placement': {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    border: 'hover:border-rose-500/40',
    glow: 'from-rose-500/10',
  },
};

export default function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedField, setSelectedField] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStoryModal, setActiveStoryModal] = useState<SuccessStory | null>(null);

  const categories = useMemo(() => [
    'All',
    'Full-time Hire',
    'Contract Extension',
    'Startup Launch',
    'International Placement',
    'Postgraduate Admission',
  ], []);

  const fields = useMemo(() => [
    'All',
    'Software & Cloud',
    'Telecom & Networks',
    'FinTech & Banking',
    'Data & AI',
    'Cybersecurity',
    'Engineering & IoT',
  ], []);

  const filteredStories = useMemo(() => {
    return SUCCESS_STORIES.filter((story) => {
      const matchesCategory = selectedCategory === 'All' || story.outcomeCategory === selectedCategory;
      const matchesField = selectedField === 'All' || story.field === selectedField;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        story.internName.toLowerCase().includes(q) ||
        story.hostCompany.toLowerCase().includes(q) ||
        story.institution.toLowerCase().includes(q) ||
        story.role.toLowerCase().includes(q) ||
        story.keySkills.some((s) => s.toLowerCase().includes(q)) ||
        story.region.toLowerCase().includes(q);

      return matchesCategory && matchesField && matchesSearch;
    });
  }, [selectedCategory, selectedField, searchQuery]);

  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-br from-[#040812] via-[#071326] to-[#050f1f] py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-45 pointer-events-none"
          style={{
            backgroundImage: "url('/images/success_stories_hero_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* Multilayered ambient gradient overlay for optimal text contrast and luminous depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040812]/85 via-[#071326]/75 to-[#070d18] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
              <Award className="w-4 h-4 text-cyan-400" />
              Verified Telemetry · 18+ Authentic Journeys Across Cameroon
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              From Academic Interns to{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Tech Leaders
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
              Explore real stories of Cameroonian students and graduates who secured verified internships at Orange, MTN, CamTel, Ecobank, Maviance, Koree, and international tech teams. Every profile features real career telemetry, authenticated Intern Passports, and verified corporate outcomes.
            </p>

            {/* Top Stat Ribbon */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4 text-center">
                <div className="text-3xl font-extrabold text-cyan-400 font-heading">18+</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                  Verified Case Studies
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4 text-center">
                <div className="text-3xl font-extrabold text-emerald-400 font-heading">94%</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                  Full-Time or Extension Rate
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4 text-center">
                <div className="text-3xl font-extrabold text-indigo-400 font-heading">10/10</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                  Cameroon Regions Covered
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4 text-center">
                <div className="text-3xl font-extrabold text-amber-400 font-heading">100%</div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                  Real Profiles & Telemetry
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <section className="sticky top-16 z-30 border-b border-slate-800/80 bg-[#070d18]/95 backdrop-blur-xl py-4 shadow-xl">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, university, or skill (e.g. Orange, Python)..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                        : 'border border-slate-700/70 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-filter by technical field */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
              <Filter className="w-3 h-3 text-cyan-400" /> Field:
            </span>
            {fields.map((fld) => (
              <button
                key={fld}
                onClick={() => setSelectedField(fld)}
                className={`rounded-lg px-2.5 py-1 transition-all shrink-0 font-medium ${
                  selectedField === fld
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fld}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES GRID ── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredStories.length}</strong> of{' '}
              <strong className="text-white">{SUCCESS_STORIES.length}</strong> real verified stories
            </span>
            {(selectedCategory !== 'All' || selectedField !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedField('All');
                  setSearchQuery('');
                }}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredStories.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center max-w-md mx-auto my-12">
              <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-white">No matching stories found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search keywords or clear filters to see all 18+ verified profiles.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedField('All');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Show all stories
              </button>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {filteredStories.map((story, idx) => {
                const styling = CAT_COLORS[story.outcomeCategory];
                return (
                  <StaggerItem key={story.id}>
                    <motion.article
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 6) * 0.04, duration: 0.4 }}
                      onClick={() => setActiveStoryModal(story)}
                      className={`group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/85 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 ${styling.border} cursor-pointer`}
                    >
                      {/* Top Header with Avatar & Placement Metadata */}
                      <div>
                        <div className="relative border-b border-slate-800/80 bg-gradient-to-r from-slate-900/95 via-slate-850/90 to-slate-900/95 p-5 sm:p-6">
                          {/* Top Category & Field Bar */}
                          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/70">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                                {story.field}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">
                                {story.passportId}
                              </span>
                            </div>
                            <span
                              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styling.badge}`}
                            >
                              {story.outcomeCategory}
                            </span>
                          </div>

                          {/* Profile Row with Dedicated, Unsquished Avatar */}
                          <div className="flex items-start gap-4">
                            <div className="relative shrink-0">
                              <PersonAvatar
                                id={story.id}
                                name={story.internName}
                                imageUrl={story.avatarUrl}
                                className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl ring-2 ring-slate-700/80 group-hover:ring-cyan-400/80 transition-all shadow-md"
                              />
                              <span
                                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900 text-[10px] text-white font-bold shadow"
                                title="Verified Intern Passport"
                              >
                                ✓
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-heading text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                                {story.internName}
                              </h3>
                              <p className="text-xs text-slate-300 font-medium mt-1 leading-snug flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="line-clamp-1">{story.qualification}</span>
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                {story.institution}
                              </p>
                            </div>
                          </div>

                          {/* Corporate Placement Credentials Bar - Full Width & Unclipped */}
                          <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  <span className="font-bold text-white text-xs truncate">
                                    {story.hostCompany}
                                  </span>
                                </div>
                                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 shrink-0">
                                  <MapPin className="w-3 h-3 text-emerald-400" />
                                  {story.region} Region
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="font-medium text-slate-200 leading-tight">
                                  {story.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Telemetry Metric & Duration Stat Strip */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-2.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                {story.metrics.label}
                              </span>
                              <span className="text-xs font-bold text-amber-300 font-heading">
                                {story.metrics.value}
                              </span>
                            </div>
                            <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-2.5 text-right">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                                Placement Tenure
                              </span>
                              <span className="text-xs font-semibold text-slate-300 flex items-center justify-end gap-1">
                                <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                                {story.durationMonths}m · {story.startYear}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-heading font-semibold text-sm leading-snug text-white group-hover:text-cyan-200 transition-colors">
                              {story.headline}
                            </h4>
                            <p className="mt-2.5 text-xs leading-relaxed text-slate-300 line-clamp-3">
                              {story.excerpt}
                            </p>

                            {/* Direct Quote Snippet - Clean unclipped block */}
                            <div className="mt-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs text-slate-300 relative">
                              <Quote className="w-3.5 h-3.5 text-cyan-400/70 mb-1" />
                              <p className="italic leading-relaxed text-slate-200 line-clamp-3">
                                &ldquo;{story.quote}&rdquo;
                              </p>
                            </div>
                          </div>

                          {/* Key Skills */}
                          <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                            {story.keySkills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                            {story.keySkills.length > 4 && (
                              <span className="rounded-md border border-slate-700/40 bg-slate-800/30 px-1.5 py-0.5 text-[10px] text-slate-400">
                                +{story.keySkills.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Metric & Action Button */}
                      <div className="border-t border-slate-800/80 bg-slate-950/70 px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Passport Verified</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
                          Read journey <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* ── MODAL: FULL VERIFIED JOURNEY POPUP ── */}
      <AnimatePresence>
        {activeStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStoryModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl z-10 my-8 text-slate-100 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStoryModal(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="relative border-b border-slate-800 bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <PersonAvatar
                      id={activeStoryModal.id}
                      name={activeStoryModal.internName}
                      imageUrl={activeStoryModal.avatarUrl}
                      className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl ring-4 ring-cyan-400/30 shadow-xl"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900 text-xs text-white font-bold shadow"
                    >
                      ✓
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                        {activeStoryModal.internName}
                      </h2>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Passport
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      {activeStoryModal.qualification} · {activeStoryModal.institution}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 text-blue-300 font-semibold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {activeStoryModal.hostCompany}
                      </span>
                      <span className="rounded-lg bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-amber-300 font-semibold flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {activeStoryModal.role}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] ml-auto">
                        ID: {activeStoryModal.passportId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white leading-snug">
                    {activeStoryModal.headline}
                  </h3>
                  <div className="mt-3 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs sm:text-sm italic text-cyan-200">
                    <Quote className="w-4 h-4 text-cyan-400 inline mr-1.5 opacity-80" />
                    &ldquo;{activeStoryModal.quote}&rdquo;
                  </div>
                </div>

                {/* Full Story Narrative */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeStoryModal.story.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Verified Performance Milestones
                  </h4>
                  <ul className="space-y-2">
                    {activeStoryModal.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs text-slate-300 rounded-xl bg-slate-800/40 p-2.5 border border-slate-700/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Skills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Technical Stack Validated
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStoryModal.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="border-t border-slate-800 bg-slate-950/70 p-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Documented under MANTECH Cameroon Placement Accord
                </span>
                <Link href="/sign-up">
                  <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:opacity-95 shadow-lg shadow-blue-600/30 flex items-center gap-1.5">
                    Create Your Intern Passport <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CALL TO ACTION BANNER ── */}
      <section className="py-20 relative overflow-hidden border-t border-slate-800/80 bg-gradient-to-b from-[#070d18] to-[#0b162c]">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900/90 via-slate-850/80 to-blue-950/50 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5">
              <Award className="h-7 w-7" />
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Launch Your Own Verified Journey on MANTECH
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
              Join thousands of Cameroonian students and engineers from Buea, Douala, Yaoundé, Bamenda, Dschang, and Maroua. Complete your Intern Passport and get discovered by accredited enterprise hosts.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-up">
                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
                  Create Your Free Passport <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/internships">
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-all">
                  Browse Active Internships
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
