import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const FIELDS = [
  { name: 'Software & Cloud Engineering', slug: 'software-cloud-engineering', category: 'Technology & ICT', specs: ['Frontend Development', 'Backend Engineering', 'Full-Stack Web', 'Mobile Application (iOS/Android)', 'Cloud & DevOps'] },
  { name: 'Cybersecurity & Network Systems', slug: 'cybersecurity-networks', category: 'Technology & ICT', specs: ['Network Infrastructure & Routing', 'SOC Analysis & Incident Response', 'Information Security Auditing', 'Telecom Systems'] },
  { name: 'Data Science & Artificial Intelligence', slug: 'data-science-ai', category: 'Technology & ICT', specs: ['Machine Learning Engineering', 'Business Intelligence & Analytics', 'Data Engineering & Pipelines', 'Statistical Modeling'] },
  { name: 'Finance, Banking & Accounting', slug: 'finance-accounting', category: 'Business & Finance', specs: ['Corporate Finance & M&A', 'OHADA Accounting & Audit', 'Credit Risk & Retail Banking', 'Microfinance Operations', 'Treasury & Forex'] },
  { name: 'Marketing, Growth & Communications', slug: 'marketing-communications', category: 'Business & Finance', specs: ['Digital Marketing & SEO', 'Brand & Product Marketing', 'Corporate Communications & PR', 'Community Management'] },
  { name: 'Human Resources & Talent Management', slug: 'human-resources', category: 'Business & Finance', specs: ['Talent Acquisition & Recruiting', 'Payroll & Labour Law (Cameroon)', 'Training & People Development', 'HR Operations'] },
  { name: 'Supply Chain, Logistics & Procurement', slug: 'supply-chain-logistics', category: 'Operations & Engineering', specs: ['Port Logistics & Customs Transit (CEMAC)', 'Warehousing & Inventory Control', 'Freight Forwarding & Transport', 'Strategic Procurement'] },
  { name: 'Civil, Mechanical & Electrical Engineering', slug: 'engineering-industrial', category: 'Operations & Engineering', specs: ['Structural & Civil Works (BTP)', 'Electrical Power Systems (Grid & Solar)', 'Mechanical Maintenance & Hydraulics', 'Industrial Automation & PLC'] },
  { name: 'Healthcare, Biotech & Pharmaceuticals', slug: 'healthcare-biotech', category: 'Health & Life Sciences', specs: ['Clinical Medicine & Nursing', 'Pharmacy & Pharmacovigilance', 'Medical Laboratory Biology', 'Public Health & Epidemiology', 'Biomedical Engineering'] },
  { name: 'Corporate Law, Compliance & Governance', slug: 'legal-compliance', category: 'Legal & Policy', specs: ['OHADA Corporate Law', 'Data Protection & Privacy', 'Contracts & Intellectual Property', 'Regulatory Compliance'] },
  { name: 'Agro-Industry, Agriculture & Environment', slug: 'agriculture-environment', category: 'Agriculture & Nature', specs: ['Agronomy & Crop Science', 'Agro-Industrial Food Processing', 'Forestry & Wood Technology', 'Environmental Impact Assessment', 'Livestock & Veterinary'] },
  { name: 'Mining, Petroleum & Chemical Engineering', slug: 'mining-petroleum-chemical', category: 'Energy & Heavy Industry', specs: ['Petroleum Geosciences', 'Drilling & Well Operations', 'Refinery Process Engineering', 'Mining Geology & Extraction', 'Chemical Process Safety'] },
  { name: 'Media, Journalism & Bilingual Communication', slug: 'media-journalism-communication', category: 'Media & Arts', specs: ['Journalism & Investigative Reporting', 'Public Relations & Corporate Comms', 'Bilingual (FR/EN/PT) Copywriting', 'Digital Content & Storytelling'] },
  { name: 'Education, Teaching & Academic Research', slug: 'education-teaching-research', category: 'Education & Academia', specs: ['Secondary School Pedagogy', 'Higher Education Lecturing', 'Educational Administration', 'Scientific Lab Research'] },
  { name: 'Hospitality, Tourism & Catering Management', slug: 'hospitality-tourism-catering', category: 'Hospitality & Services', specs: ['Hotel Operations & Front Office', 'Culinary Arts & Food Production', 'Banquet & Event Management', 'Tourism & Travel Planning'] },
];  { name: 'Software Quality Assurance & Testing', slug: 'qa-testing', category: 'Technology & ICT', specs: ['Manual & Automated Testing', 'Test Automation (Selenium, Cypress)', 'Performance & Security Testing', 'SDET & CI/CD Integration'] },
  { name: 'Cybersecurity Governance & Compliance', slug: 'cyber-compliance', category: 'Legal & Policy', specs: ['Cybersecurity Law', 'Data Protection (GDPR & Cameroonian Law)', 'Tech Policy & Ethics', 'Digital Forensics'] },
  { name: 'Taxation & Audit Compliance', slug: 'taxation-audit', category: 'Business & Finance', specs: ['Corporate Taxation', 'VAT & Indirect Taxes', 'Forensic Audit', 'Tax Strategy & Advisory'] },
  { name: 'Logistics Analytics & Supply Chain Risk', slug: 'logistics-analytics', category: 'Operations & Engineering', specs: ['Logistics Analytics & Forecasting', 'Inventory Optimisation', 'Route Planning & Fleet Efficiency', 'Supply Chain Risk'] },
  { name: 'E-Tourism & Hospitality Technology', slug: 'hoteltech', category: 'Hospitality & Services', specs: ['Hospitality Tech Systems', 'Online Travel & E-Tourism', 'Revenue Management', 'Guest Experience Analytics'] },
  { name: 'Public Policy, Governance & Development', slug: 'public-policy', category: 'Legal & Policy', specs: ['Public Policy Design & Evaluation', 'Decentralisation & Local Governance', 'International Development', 'Security & Conflict Studies'] },
  { name: 'Agri-Fintech & Rural Banking', slug: 'agrifintech', category: 'Business & Finance', specs: ['Agricultural Finance Products', 'Mobile Money & Fintech', 'Rural Banking Operations', 'Value Chain Finance'] },
  { name: 'Telemedicine & Digital Health', slug: 'telemedicine', category: 'Health & Life Sciences', specs: ['Telehealth Services', 'Health Apps & Wearables', 'E-Prescribing & Digital Clinics', 'Health Data Privacy'] },
  { name: 'Climate & Carbon Markets', slug: 'climate-carbon', category: 'Agriculture & Nature', specs: ['Carbon Accounting & Verification', 'Climate Risk Mapping', 'Nature-Based Solutions', 'Blue Carbon & Mangroves'] },
  { name: 'Ecology & Conservation', slug: 'ecology-conservation', category: 'Nature & Environment', specs: ['Biodiversity Mapping', 'Wildlife Protection & Conservation', 'Marine & Coastal Ecosystems', 'Environmental Education'] },
  { name: 'Geotechnical & Structural Engineering', slug: 'geotech', category: 'Operations & Engineering', specs: ['Soil Mechanics & Foundation Design', 'Structural Analysis & Seismic Design', 'Materials Testing', 'Construction Project Management'] },
  { name: 'Trade Finance & Supply Chain Finance', slug: 'trade-finance', category: 'Business & Finance', specs: ['Export/Import Finance', 'Letters of Credit', 'Supply Chain Finance Platforms', 'Commodity Trade Finance'] },
  { name: 'Social Media & Community Management', slug: 'community-mgmt', category: 'Media & Arts', specs: ['Social Media Strategy', 'Community Moderation & Growth', 'Influencer Relations', 'Brand Safety & Ad Verification'] },
  { name: 'Music, Sound & Live Events', slug: 'audio-visual', category: 'Media & Arts', specs: ['Music Production & Sound Engineering', 'Live Event Management', 'Theatre & Stage Design', 'Copyright & Music Publishing'] },
  { name: 'Heritage, Museums & Cultural Management', slug: 'heritage', category: 'Nature & Environment', specs: ['Cultural Heritage Management', 'Museum Curation & Conservation', 'Archaeological Fieldwork', 'Traditional Crafts & Knowledge Preservation'] },
  { name: 'Cloud & DevOps', slug: 'cloud-devops', category: 'Technology & ICT', specs: ['AWS Cloud Architecture', 'Azure DevOps', 'CI/CD Pipelines', 'Infrastructure as Code (Terraform)'] },
  { name: 'Robotics & Industrial Automation', slug: 'robotics-automation', category: 'Operations & Engineering', specs: ['Industrial Robotics Programming', 'Automated Production Lines', 'Computer-Aided Design (CAD)', 'Mechatronics Engineering'] },
  { name: 'Media & Arts', slug: 'media-arts', category: 'Media & Arts', specs: ['Entertainment Industry', 'Music & Audio Production', 'Film & Video Production', 'Digital Arts'] },
  { name: 'Education & Training', slug: 'education-training', category: 'Education & Academia', specs: ['Curriculum Design & Pedagogy', 'E-Learning & EdTech', 'Faculty Management', 'Student Affairs & Admissions'] },
  { name: 'Hospitality & Services', slug: 'hospitality-services', category: 'Hospitality & Services', specs: ['Hospitality Management', 'Tourism Planning & Promotion', 'Event Management', 'Culinary Arts & Food Safety'] },
  { name: 'Environmental & Agricultural Sciences', slug: 'environmental-agriculture', category: 'Agriculture & Nature', specs: ['Agronomy & Crop Science', 'Agro-Industrial Food Processing', 'Forestry & Wood Technology', 'Environmental Impact Assessment'] },
  { name: 'Mental Health & Psychosocial Support', slug: 'mental-health', category: 'Health & Life Sciences', specs: ['Counseling & Psychosocial Support', 'Community Mental Health', 'Trauma-Informed Care', 'Psychological First Aid'] },
  { name: 'Economic & Social Development', slug: 'economic-social-dev', category: 'Legal & Policy', specs: ['Public Budgeting & Treasury', 'Macroeconomic Policy & Planning', 'Taxation & Compliance', 'Development Finance'] },
  { name: 'Construction & Infrastructure', slug: 'construction-infra', category: 'Operations & Engineering', specs: ['Structural & Civil Works (BTP)', 'Electrical Power Systems (Grid & Solar)', 'Mechanical Maintenance & Hydraulics', 'Industrial Automation & PLC'] },
  { name: 'Public Administration & Governance', slug: 'public-admin-governance', category: 'Legal & Policy', specs: ['Public Procurement & Supply Chain', 'Corporate Governance', 'Administrative Management', 'Local Governments & Decentralisation'] },
  { name: 'Bilingual Communication & Translation', slug: 'bilingual-translation', category: 'Media & Arts', specs: ['Bilingual Translation & Interpretation', 'Broadcast Journalism', 'Public Relations & Corporate Media', 'Audiovisual Production'] },
  { name: 'Real Estate & Property Management', slug: 'real-estate', category: 'Business & Finance', specs: ['Property Sales & Leasing', 'Property Management', 'Real Estate Development', 'Facilities Management'] },
  { name: 'Retail & E-Commerce', slug: 'retail-ecommerce', category: 'Business & Finance', specs: ['Store Operations', 'E-Commerce Platform Management', 'Visual Merchandising', 'Customer Experience'] },
  { name: 'Non-Profit & NGO Management', slug: 'non-profit', category: 'Legal & Policy', specs: ['Program Management', 'Grant Writing & Fundraising', 'Volunteer Coordination', 'Advocacy & Policy'] },
  { name: 'Sports Management & Recreation', slug: 'sports-management', category: 'Hospitality & Services', specs: ['Team Management', 'Facility Operations', 'Event Coordination', 'Sports Marketing'] },
  { name: 'Telecommunications & Network Infrastructure', slug: 'telecom-infrastructure', category: 'Technology & ICT', specs: ['Network Planning & Optimization', 'Fiber Optic Deployment', '5G & Wireless Systems', 'Network Operations Center'] },
  { name: 'Automotive & Transportation', slug: 'automotive-transport', category: 'Operations & Engineering', specs: ['Vehicle Maintenance & Repair', 'Fleet Management', 'Logistics & Distribution', 'Transportation Planning'] },
  { name: 'Beauty & Wellness', slug: 'beauty-wellness', category: 'Hospitality & Services', specs: ['Cosmetology & Hair Care', 'Spa & Wellness Therapy', 'Makeup Artistry', 'Nail Care & Esthetics'] },
  { name: 'Security Services & Private Investigation', slug: 'security-services', category: 'Legal & Policy', specs: ['Physical Security & Guarding', 'Private Investigation', 'Event Security', 'Security Systems Installation'] },
  { name: 'Cleaning & Facilities Management', slug: 'cleaning-facilities', category: 'Operations & Engineering', specs: ['Commercial Cleaning', 'Janitorial Services', 'Building Maintenance', 'Pest Control'] },
  { name: 'Wedding & Event Planning', slug: 'wedding-events', category: 'Hospitality & Services', specs: ['Wedding Coordination', 'Corporate Event Planning', 'Party Production', 'Venue Management'] },
  { name: 'Personal Services & Concierge', slug: 'personal-services', category: 'Hospitality & Services', specs: ['Concierge Services', 'Personal Shopping', 'Errand & Delivery', 'Lifestyle Management'] },
  { name: 'Construction Trades & Skilled Labor', slug: 'construction-trades', category: 'Operations & Engineering', specs: ['Carpentry & Joinery', 'Plumbing & Pipefitting', 'Electrical Installation', 'Masonry & Tiling'] },
  { name: 'Interior Design & Home Staging', slug: 'interior-design', category: 'Business & Finance', specs: ['Residential Design', 'Commercial Interior Design', 'Home Staging', 'Color Consulting'] },
  { name: 'Pet Care & Veterinary Services', slug: 'pet-care', category: 'Health & Life Sciences', specs: ['Pet Grooming', 'Dog Training', 'Pet Sitting & Boarding', 'Animal Shelter Management'] },
  { name: 'Laundry & Dry Cleaning', slug: 'laundry-drycleaning', category: 'Hospitality & Services', specs: ['Commercial Laundry', 'Dry Cleaning', 'Linen Services', 'Uniform Management'] },
  { name: 'Fitness & Personal Training', slug: 'fitness-training', category: 'Health & Life Sciences', specs: ['Personal Training', 'Group Fitness Instruction', 'Yoga & Pilates', 'Sports Conditioning'] },
  { name: 'Photography & Videography', slug: 'photo-video', category: 'Media & Arts', specs: ['Portrait Photography', 'Event Videography', 'Commercial Photography', 'Drone Photography'] },
  { name: 'Translation & Localization Services', slug: 'translation-localization', category: 'Media & Arts', specs: ['Document Translation', 'Interpretation Services', 'Website Localization', 'Subtitling & Captioning'] },
  { name: 'Event Security & Crowd Management', slug: 'event-security', category: 'Legal & Policy', specs: ['Crowd Control', 'Access Control', 'Event Risk Assessment', 'Venue Security'] }
];

async function main() {
  let created = 0;
  for (const f of FIELDS) {
    const field = await p.field.upsert({
      where: { id: f.slug },
      update: { name: f.name, category: f.category, slug: f.slug },
      create: { name: f.name, slug: f.slug, category: f.category },
    });
    if (field.id) created++;
    for (const spec of f.specs) {
      await p.specialization.upsert({
        where: { fieldId_name: { fieldId: field.id, name: spec } },
        update: { slug: spec.toLowerCase().replace(/[^a-z0-9]/g, '') },
        create: { name: spec, slug: spec.toLowerCase().replace(/[^a-z0-9]/g, ''), fieldId: field.id },
      });
    }
  }
  console.log('Seeded ' + created + ' fields with specializations');
  await p.$disconnect();
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });
