/**
 * MANTECH Nexus — Centralized Enterprise Configuration
 * Grounded in SRS Specifications:
 * - Single source of truth for platform contacts (WhatsApp concierge, official email)
 * - Monetization package tiers & limits
 * - Cameroon geographical regions & cities
 * - Professional taxonomy & application modes
 */

const whatsappContact = process.env.NEXT_PUBLIC_MANTECH_WHATSAPP || process.env.MANTECH_WHATSAPP || '+237 650 921 917';
const whatsappDigits = whatsappContact.replace(/\D/g, '');
const whatsappLink = `https://wa.me/${whatsappDigits}`;
const contactEmail = process.env.NEXT_PUBLIC_MANTECH_EMAIL || process.env.MANTECH_EMAIL || 'tessohmanuel@gmail.com';

export const APP_CONFIG = {
  name: 'MANTECH Nexus',
  tagline: 'Cameroon Premier Professional Internship Marketplace & Recruitment Platform',
  version: '2.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Official Centralized Communication (Section 16 & 26)
  contacts: {
    whatsapp: whatsappContact,
    whatsappFormatted: whatsappContact,
    whatsappLink,
    email: contactEmail,
    location: 'Douala & Yaoundé, Cameroon',
    workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM (WAT)',
  },

  // Support alias (convenience accessor shared across public pages and billing modules)
  support: {
    whatsapp: whatsappLink,
    phoneDisplay: whatsappContact,
    email: contactEmail,
    location: 'Douala & Yaoundé, Cameroon',
    workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM (WAT)',
  },

  socials: {
    whatsapp: whatsappLink,
    linkedin: 'https://linkedin.com/company/mantech-nexus',
    facebook: 'https://facebook.com/mantechnexus',
    instagram: 'https://instagram.com/mantechnexus',
    youtube: 'https://youtube.com/@mantechnexus',
    github: 'https://github.com/mantech-nexus',
  },

  // Cameroon 10 Administrative Regions & Core Commercial / Educational Hubs
  cameroonRegions: [
    { id: 'reg_centre', name: 'Centre', capital: 'Yaoundé', cities: ['Yaoundé', 'Mbalmayo', 'Bafia'] },
    { id: 'reg_littoral', name: 'Littoral', capital: 'Douala', cities: ['Douala', 'Edéa', 'Nkongsamba'] },
    { id: 'reg_south_west', name: 'South-West', capital: 'Buea', cities: ['Buea', 'Limbe', 'Kumba'] },
    { id: 'reg_west', name: 'West', capital: 'Bafoussam', cities: ['Bafoussam', 'Dschang', 'Foumban'] },
    { id: 'reg_north_west', name: 'North-West', capital: 'Bamenda', cities: ['Bamenda', 'Kumbo', 'Wum'] },
    { id: 'reg_adamawa', name: 'Adamawa', capital: 'Ngaoundéré', cities: ['Ngaoundéré', 'Meiganga', 'Tibati'] },
    { id: 'reg_north', name: 'North', capital: 'Garoua', cities: ['Garoua', 'Guider', 'Pitoa'] },
    { id: 'reg_far_north', name: 'Far North', capital: 'Maroua', cities: ['Maroua', 'Kousséri', 'Mora'] },
    { id: 'reg_south', name: 'South', capital: 'Ebolowa', cities: ['Ebolowa', 'Kribi', 'Sangmélima'] },
    { id: 'reg_east', name: 'East', capital: 'Bertoua', cities: ['Bertoua', 'Batouri', 'Abong-Mbang'] },
  ],

  // Professional Sectors (All Professional Fields - Section 1, 2 & 10)
  professionalFields: [
    {
      id: 'field_swe',
      name: 'Software & Cloud Engineering',
      slug: 'software-cloud-engineering',
      category: 'Technology & Computing',
      specializations: ['Frontend Development', 'Backend Engineering', 'Full-Stack Web', 'Mobile Application (iOS/Android)', 'Cloud & DevOps'],
    },
    {
      id: 'field_cyber',
      name: 'Cybersecurity & Network Systems',
      slug: 'cybersecurity-networks',
      category: 'Technology & Computing',
      specializations: ['Penetration Testing', 'Security Operations (SOC)', 'Network Administration', 'Telecom & VoIP Infrastructure'],
    },
    {
      id: 'field_data',
      name: 'Data Science & Artificial Intelligence',
      slug: 'data-science-ai',
      category: 'Technology & Computing',
      specializations: ['Machine Learning Engineering', 'Data Analytics & BI', 'Big Data Engineering', 'AI Model Integration'],
    },
    {
      id: 'field_fin',
      name: 'Finance, Banking & Accounting',
      slug: 'finance-accounting',
      category: 'Business & Finance',
      specializations: ['Corporate Accounting', 'Financial Analysis', 'Auditing & Taxation', 'Microfinance Operations', 'Fintech Systems'],
    },
    {
      id: 'field_mkt',
      name: 'Marketing, Growth & Communications',
      slug: 'marketing-communications',
      category: 'Business & Commercial',
      specializations: ['Digital Marketing & SEO', 'Brand Strategy', 'Public Relations', 'B2B Sales & Growth', 'Content Creation'],
    },
    {
      id: 'field_hr',
      name: 'Human Resources & Talent Management',
      slug: 'human-resources',
      category: 'Business Operations',
      specializations: ['Talent Acquisition', 'Employee Relations', 'HR Analytics & Systems', 'Training & Organizational Development'],
    },
    {
      id: 'field_log',
      name: 'Supply Chain, Logistics & Procurement',
      slug: 'supply-chain-logistics',
      category: 'Operations & Engineering',
      specializations: ['Maritime & Port Logistics', 'Inventory Management', 'Freight & Customs Clearance', 'Procurement Strategy'],
    },
    {
      id: 'field_eng',
      name: 'Civil, Mechanical & Electrical Engineering',
      slug: 'engineering-industrial',
      category: 'Engineering & Industrial',
      specializations: ['Electrical Power Systems', 'Civil Construction & BIM', 'Mechanical Maintenance', 'Renewable Energy & Solar'],
    },
    {
      id: 'field_health',
      name: 'Healthcare, Biotech & Pharmaceuticals',
      slug: 'healthcare-biotech',
      category: 'Medical & Life Sciences',
      specializations: ['Health Informatics', 'Biomedical Equipment', 'Pharmaceutical Sales', 'Clinical Research Assistance'],
    },
    {
      id: 'field_legal',
      name: 'Corporate Law, Compliance & Governance',
      slug: 'legal-compliance',
      category: 'Legal & Policy',
      specializations: ['OHADA Corporate Law', 'Data Protection & Privacy', 'Contracts & Intellectual Property', 'Regulatory Compliance'],
    },
  ],

  // Monetization Packages (Section 16 - Payment via WhatsApp direct concierge)
  packages: [
    {
      id: 'pkg_free',
      name: 'Free Starter',
      code: 'FREE',
      target: 'Company & Institutions',
      priceXAF: 0,
      period: 'Forever Free',
      description: 'Essential presence for organizations beginning their recruitment on MANTECH.',
      features: [
        'Verified organization profile',
        'Post up to 2 active internship opportunities',
        'Basic applicant intake management',
        'Direct email notifications',
        'Standard candidate view limit',
      ],
      limits: {
        activeOpportunities: 2,
        monthlyCandidateViews: 15,
        recruiterAccounts: 1,
        featuredBadges: 0,
      },
      ctaText: 'Get Started Free',
      ctaUrl: '/sign-up?role=company',
      badge: 'Starter',
      recommended: false,
    },
    {
      id: 'pkg_professional',
      name: 'Professional Recruiter',
      code: 'PROFESSIONAL',
      target: 'Growing Companies & SMEs',
      priceXAF: 75000,
      period: 'per month',
      description: 'Expanded search and pipeline management for companies actively hiring qualified interns.',
      features: [
        'Post up to 10 active opportunities',
        'Advanced Intern Passport candidate search & filters',
        'Unlimited candidate profile discovery',
        'Server-authorized CV viewing with audit history',
        'Interview scheduling & status management',
        'Branded organization profile badge',
      ],
      limits: {
        activeOpportunities: 10,
        monthlyCandidateViews: 200,
        recruiterAccounts: 3,
        featuredBadges: 2,
      },
      ctaText: 'Upgrade via WhatsApp',
      ctaUrl: 'https://wa.me/237650921917?text=Hello%20MANTECH%20Nexus%2C%20I%20would%20like%20to%20subscribe%20to%20the%20Professional%20Recruiter%20Package.',
      badge: 'Most Popular',
      recommended: true,
    },
    {
      id: 'pkg_business',
      name: 'Business Enterprise',
      code: 'BUSINESS',
      target: 'High-Volume Employers & Large Firms',
      priceXAF: 120000,
      period: 'per month',
      description: 'Full-featured recruitment platform with priority visibility, unlimited talent search, and multi-recruiter team support.',
      features: [
        'Unlimited active internship opportunities',
        'Unlimited Intern Passport discovery & CV downloads',
        'Multiple recruiter seats (up to 10 team members)',
        'Featured opportunities with priority marketplace ranking',
        'Direct phone candidate reachout permissions',
        'Placement tracking & onboarding milestone workflows',
        'Dedicated talent sourcing assistant on WhatsApp',
      ],
      limits: {
        activeOpportunities: 999,
        monthlyCandidateViews: 9999,
        recruiterAccounts: 10,
        featuredBadges: 5,
      },
      ctaText: 'Upgrade via WhatsApp',
      ctaUrl: 'https://wa.me/237650921917?text=Hello%20MANTECH%20Nexus%2C%20I%20would%20like%20to%20subscribe%20to%20the%20Business%20Enterprise%20Package.',
      badge: 'Full Power',
      recommended: false,
    },
    {
      id: 'pkg_institution',
      name: 'Institutional Partner',
      code: 'ENTERPRISE',
      target: 'State Universities & Higher Institutes',
      priceXAF: 250000,
      period: 'per semester / annual',
      description: 'Dual-mode platform for universities: coordinate student opportunities while recruiting interns for university departments.',
      features: [
        'Dual-Mode Academic Dashboard: Help Students & Recruit Interns',
        'Unlimited institutional recruiter & faculty coordinator accounts',
        'Direct pipeline to verified partner enterprises',
        'Institutional marketplace placement telemetry & statistics',
        'Custom department & branch structuring',
        'Dedicated institutional account manager',
      ],
      limits: {
        activeOpportunities: 999,
        monthlyCandidateViews: 9999,
        recruiterAccounts: 50,
        featuredBadges: 10,
      },
      ctaText: 'Contact Academic Relations',
      ctaUrl: 'https://wa.me/237650921917?text=Hello%20MANTECH%20Nexus%2C%20our%20University%20%2F%20Institution%20would%20like%20to%20discuss%20an%20Institutional%20Partnership.',
      badge: 'Universities',
      recommended: false,
    },
  ],

  // Security & RBAC Roles
  roles: {
    INTERN: 'intern',
    COMPANY: 'company',
    UNIVERSITY: 'university',
    ADMIN: 'admin',
  },

  // Storage and Upload Limits
  uploadLimits: {
    maxCvSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedCvMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxPhotoSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedPhotoMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};
