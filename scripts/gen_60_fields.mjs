// Generates 60 comprehensive, authentic professional fields across all key economic sectors
// in Cameroon, covering SND30 priorities and university grand-écoles curricula.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIELDS_60 = [
  // ── 1. Technology & Computing ──
  {
    name: "Information Technology & Software Engineering",
    category: "Technology & Computing",
    specs: [
      "Full-Stack Web Development",
      "Mobile Application Engineering (iOS/Android/Flutter)",
      "Cloud Architecture & DevOps",
      "Backend API & Microservices",
      "Embedded Systems & IoT",
      "QA Engineering & Automated Testing",
      "ERP Solutions (SAP/Odoo)"
    ]
  },
  {
    name: "Telecommunications & Network Infrastructure",
    category: "Technology & Computing",
    specs: [
      "Fibre Optic Transmission & DWDM",
      "Radio Access Networks (4G/5G LTE)",
      "Network Operations Center (NOC)",
      "Cisco & Huawei Enterprise Routing",
      "VoIP & Unified Communications",
      "Satellite & Microwave Transmission"
    ]
  },
  {
    name: "Cybersecurity & Information Assurance",
    category: "Technology & Computing",
    specs: [
      "Penetration Testing & Vulnerability Assessment",
      "Security Operations Center (SOC) Analysis",
      "Incident Response & Digital Forensics",
      "Identity & Access Management (IAM)",
      "ISO 27001 & ANTIC Compliance",
      "Cloud Security & Zero-Trust Architecture"
    ]
  },
  {
    name: "Data Science, Analytics & Artificial Intelligence",
    category: "Technology & Computing",
    specs: [
      "Machine Learning & Deep Learning",
      "Business Intelligence & Power BI/Tableau",
      "Big Data Engineering (Spark/Kafka)",
      "Predictive Analytics & Statistical Modeling",
      "Natural Language Processing (NLP)",
      "Data Governance & ETL Pipelines"
    ]
  },
  {
    name: "Fintech, Mobile Money & Digital Banking Systems",
    category: "Technology & Computing",
    specs: [
      "Mobile Money API Integration (MoMo/Orange Money)",
      "Payment Gateway Engineering",
      "Core Banking Systems (Amphora/Delta/Temenos)",
      "Fraud Detection & Transaction Monitoring",
      "Blockchain & Smart Contracts",
      "Regulatory Reporting Automation"
    ]
  },

  // ── 2. Business, Banking & Finance ──
  {
    name: "Banking & Commercial Credit",
    category: "Business & Finance",
    specs: [
      "Corporate Credit Risk Assessment",
      "Retail & SME Lending",
      "Treasury Operations & FX Management",
      "Trade Finance & Letters of Credit",
      "Compliance & AML/CFT Monitoring",
      "Branch Operations Management"
    ]
  },
  {
    name: "Accounting, Audit & Corporate Taxation",
    category: "Business & Finance",
    specs: [
      "OHADA Accounting Standards",
      "Internal & Statutory Audit",
      "Corporate Tax Compliance & DGI Filings",
      "Financial Reporting & Consolidation",
      "Management Control & Cost Accounting",
      "Payroll Accounting & CNPS Declarations"
    ]
  },
  {
    name: "Microfinance & Community Banking",
    category: "Business & Finance",
    specs: [
      "EMF Category 1 & 2 Operations",
      "Agricultural & Rural Microcredit",
      "Micro-Savings Mobilization",
      "Credit Recovery & Debt Restructuring",
      "COBAC Regulatory Compliance",
      "Group Lending Methodologies"
    ]
  },
  {
    name: "Insurance, Risk Management & Actuarial Science",
    category: "Business & Finance",
    specs: [
      "CIMA Code Regulatory Compliance",
      "Life & Health Insurance Underwriting",
      "Automobile & Casualty Claims",
      "Reinsurance & Risk Assessment",
      "Actuarial Valuation & Tariffing",
      "Insurance Brokerage & Commercial Advisory"
    ]
  },
  {
    name: "Corporate Finance, Investment & Valuation",
    category: "Business & Finance",
    specs: [
      "Financial Modeling & Business Valuation",
      "Mergers & Acquisitions (M&A)",
      "Project Finance & Capital Raising",
      "Portfolio Management (BVMAC Exchange)",
      "Feasibility Studies & Investment Due Diligence",
      "Working Capital Optimization"
    ]
  },

  // ── 3. Engineering & Construction ──
  {
    name: "Civil Engineering & Structural Works (BTP)",
    category: "Engineering & Construction",
    specs: [
      "Reinforced Concrete & Steel Structures",
      "Roads, Highways & Bridges (Travaux Publics)",
      "Topography & Geotechnical Investigation",
      "BIM Modeling (AutoCAD/Revit)",
      "Construction Site Supervision",
      "Cost Estimation & Quantity Surveying"
    ]
  },
  {
    name: "Electrical Power Systems & High-Voltage Transmission",
    category: "Engineering & Construction",
    specs: [
      "HV/MV Grid Distribution & Substations",
      "Industrial Electrical Installations",
      "Protection Relays & Switchgear Systems",
      "Smart Metering & Billing Systems",
      "Power Quality Analysis",
      "Electrical Safety & Earthing Systems"
    ]
  },
  {
    name: "Renewable Energy & Solar Installations",
    category: "Engineering & Construction",
    specs: [
      "Photovoltaic (PV) Solar Plant Design",
      "Mini-Grid & Rural Electrification",
      "Hydroelectric Micro-Turbine Systems",
      "Biomass & Biogas Generation",
      "Energy Storage (BESS) Systems",
      "Energy Efficiency Auditing"
    ]
  },
  {
    name: "Mechanical Engineering & Heavy Equipment Maintenance",
    category: "Engineering & Construction",
    specs: [
      "Industrial Hydraulics & Pneumatics",
      "Heavy Machinery & Earthmoving Equipment",
      "Turbines, Boilers & Pumps",
      "Preventive & Predictive Maintenance",
      "Computer-Aided Mechanical Design (SolidWorks)",
      "Welding, Fabrication & NDT Testing"
    ]
  },
  {
    name: "Industrial Automation, Mechatronics & PLC Systems",
    category: "Engineering & Construction",
    specs: [
      "Siemens & Schneider PLC Programming",
      "SCADA & HMI Supervisory Control",
      "Instrumentation & Sensor Calibration",
      "Industrial Robotics & Servo Systems",
      "Variable Frequency Drives (VFD)",
      "Industrial Network Protocols (Modbus/Profibus)"
    ]
  },

  // ── 4. Energy, Petroleum & Mining ──
  {
    name: "Petroleum & Gas Engineering (Upstream & Downstream)",
    category: "Energy & Extractive Industries",
    specs: [
      "Offshore Drilling & Well Operations",
      "Reservoir Engineering & Simulation",
      "Oil & Gas Pipeline Maintenance",
      "Refinery Operations & Quality Control",
      "LPG & Natural Gas Distribution",
      "SNH & Hydrocarbon Regulatory Compliance"
    ]
  },
  {
    name: "Mining Engineering & Mineral Extraction",
    category: "Energy & Extractive Industries",
    specs: [
      "Open-Pit & Underground Mine Planning",
      "Mineral Exploration & Core Sampling",
      "Ore Processing & Beneficiation (Iron, Bauxite, Gold)",
      "Mine Safety & Ventilation",
      "Tailings Management & Environmental Remediation",
      "Geographic Information Systems (GIS) for Mining"
    ]
  },
  {
    name: "Geology, Geophysics & Hydrology",
    category: "Energy & Extractive Industries",
    specs: [
      "Hydrogeological Surveys & Well Drilling",
      "Geophysical Logging (Resistivity & Seismic)",
      "Stratigraphy & Sedimentology",
      "Soil Mechanics & Foundation Testing",
      "Groundwater Resource Management",
      "Geological Hazard Assessment"
    ]
  },

  // ── 5. Agriculture, Food & Forestry ──
  {
    name: "Agronomy, Crop Science & Plant Protection",
    category: "Agriculture & Agro-Industry",
    specs: [
      "Cash Crop Cultivation (Cacao, Coffee, Palm, Banana)",
      "Cereal & Tuber Production (Maize, Cassava, Rice)",
      "Integrated Pest & Weed Management",
      "Soil Fertility & Fertilizer Formulations",
      "Greenhouse Farming & Drip Irrigation",
      "Seed Multiplication & Plant Breeding"
    ]
  },
  {
    name: "Agro-Industrial Processing & Food Technology",
    category: "Agriculture & Agro-Industry",
    specs: [
      "Beverage & Brewery Production (Brasseries)",
      "Palm Oil & Vegetable Oil Refining",
      "Flour Milling & Bakery Formulations",
      "Dairy & Livestock Processing",
      "HACCP & ISO 22000 Food Safety Standards",
      "Packaging & Shelf-Life Extension"
    ]
  },
  {
    name: "Animal Science, Livestock & Veterinary Practice",
    category: "Agriculture & Agro-Industry",
    specs: [
      "Poultry & Egg Production Management",
      "Cattle Rearing & Dairy Farming",
      "Pig Farming & Meat Processing",
      "Veterinary Medicine & Vaccination Programs",
      "Animal Nutrition & Feed Formulation",
      "Aquaculture & Fish Farm Management"
    ]
  },
  {
    name: "Forestry, Wood Processing & Wildlife Conservation",
    category: "Agriculture & Agro-Industry",
    specs: [
      "Sustainable Forest Management (FSC Certification)",
      "Timber Logging & Log Tracking",
      "Sawmill Operations & Wood Drying",
      "Wood Chemistry & Furniture Manufacturing",
      "National Parks & Wildlife Protection",
      "Carbon Sequestration & REDD+ Initiatives"
    ]
  },

  // ── 6. Healthcare, Pharmacy & Life Sciences ──
  {
    name: "General Medicine & Hospital Clinical Care",
    category: "Healthcare & Life Sciences",
    specs: [
      "Emergency & Intensive Care Medicine",
      "Internal Medicine & Infectious Diseases",
      "Pediatrics & Child Health",
      "Obstetrics & Gynecology",
      "General & Laparoscopic Surgery",
      "Hospital Ward & Clinical Workflow"
    ]
  },
  {
    name: "Nursing Science & Patient Healthcare",
    category: "Healthcare & Life Sciences",
    specs: [
      "Critical Care & ICU Nursing",
      "Operating Theatre Nursing",
      "Maternal & Neonatal Care",
      "Community & Rural Healthcare Outreach",
      "Geriatric & Palliative Nursing",
      "Infection Prevention & Hospital Hygiene"
    ]
  },
  {
    name: "Pharmacy & Industrial Pharmacology",
    category: "Healthcare & Life Sciences",
    specs: [
      "Retail Pharmacy Dispensing & Counseling",
      "Hospital Drug Supply Chain & Stock Management",
      "Pharmaceutical Manufacturing & Galenic Formulations",
      "Quality Control & Pharmacovigilance",
      "Therapeutic Drug Monitoring",
      "Traditional Pharmacopeia Integration"
    ]
  },
  {
    name: "Medical Laboratory Technology & Clinical Diagnostics",
    category: "Healthcare & Life Sciences",
    specs: [
      "Clinical Biochemistry & Immunoassays",
      "Medical Hematology & Blood Transfusion",
      "Diagnostic Microbiology & Parasitology",
      "Molecular Biology & PCR Testing",
      "Anatomic Pathology & Histology",
      "Laboratory Quality Assurance (ISO 15189)"
    ]
  },
  {
    name: "Public Health & Epidemiology",
    category: "Healthcare & Life Sciences",
    specs: [
      "Epidemiological Surveillance (Malaria, Cholera)",
      "Vaccine Cold Chain Management",
      "Health Program Monitoring & Evaluation",
      "Health Education & Community Sensitization",
      "Maternal-Child Health Policy",
      "Biostatistics for Medical Research"
    ]
  },
  {
    name: "Biomedical Engineering & Medical Equipment",
    category: "Healthcare & Life Sciences",
    specs: [
      "Radiology & Ultrasound Equipment Maintenance",
      "Dialysis & Patient Monitor Calibration",
      "Sterilization & Autoclave Systems",
      "Hospital Medical Gas Systems (Oxygen Plants)",
      "Medical Device Procurement & Safety",
      "Clinical Software Integration (PACS/HIS)"
    ]
  },

  // ── 7. Supply Chain, Transport & Logistics ──
  {
    name: "Supply Chain, Warehousing & Inventory Control",
    category: "Supply Chain & Logistics",
    specs: [
      "Warehouse Management Systems (WMS)",
      "Inventory Optimization & Demand Forecasting",
      "Cold Chain Logistics for Food & Pharma",
      "Cross-Docking & Distribution Centers",
      "Vendor Sourcing & Supplier Performance",
      "Reverse Logistics & Waste Recycling"
    ]
  },
  {
    name: "Maritime Shipping, Port Operations & Customs",
    category: "Supply Chain & Logistics",
    specs: [
      "Port de Douala & Kribi Container Handling",
      "Customs Clearance & Single Window (GUCE)",
      "Freight Forwarding & Bill of Lading (Incoterms)",
      "Vessel Husbandry & Stevedoring",
      "Transit Transit Cargo to Chad & CAR",
      "Dangerous Goods Transport (IMDG Code)"
    ]
  },
  {
    name: "Fleet Management & Overland Transport",
    category: "Supply Chain & Logistics",
    specs: [
      "GPS Fleet Tracking & Fuel Optimization",
      "Road Freight Safety & Driver Compliance",
      "Heavy Truck Maintenance Management",
      "Interurban Passenger Transport Logistics",
      "Railway Operations (Camrail)",
      "Route Planning & Toll Management"
    ]
  },
  {
    name: "Aviation Operations & Airport Ground Handling",
    category: "Supply Chain & Logistics",
    specs: [
      "Passenger Check-in & Baggage Logistics",
      "Air Cargo Ramp & Aircraft Marshalling",
      "Aviation Safety & ICAO Regulations",
      "Flight Dispatch & Operations Control",
      "Airport Terminal Customer Services",
      "Aircraft Refueling Logistics"
    ]
  },

  // ── 8. Marketing, Media & Communication ──
  {
    name: "Marketing Strategy, Brand Management & Sales",
    category: "Marketing & Media",
    specs: [
      "B2B Commercial Account Management",
      "Fast-Moving Consumer Goods (FMCG) Field Sales",
      "Brand Strategy & Trade Marketing",
      "Market Research & Consumer Insights",
      "Retail Merchandising & Point of Sale",
      "Customer Relationship Management (CRM)"
    ]
  },
  {
    name: "Digital Marketing, SEO & Growth Hacking",
    category: "Marketing & Media",
    specs: [
      "Social Media Management (Facebook/LinkedIn/TikTok)",
      "Search Engine Optimization (SEO) & Google Ads",
      "Email Marketing & Audience Automation",
      "Influencer Campaigns & Content Marketing",
      "Performance Analytics & Conversion Rate Optimization",
      "Mobile App User Acquisition"
    ]
  },
  {
    name: "Public Relations, Corporate Comms & Crisis Management",
    category: "Marketing & Media",
    specs: [
      "Media Relations & Press Releases",
      "Internal Communication & Culture",
      "Crisis Communication & Reputation Defense",
      "CSR & Sustainable Development Reporting",
      "Executive Speechwriting & Thought Leadership",
      "Event Spokesperson & Institutional Liaisons"
    ]
  },
  {
    name: "Journalism, Mass Communication & Broadcasting",
    category: "Marketing & Media",
    specs: [
      "Television & Radio Broadcast Production",
      "Investigative Print & Web Journalism",
      "Photojournalism & Field Reporting",
      "News Editing & Fact-Checking",
      "Podcast Production & Digital Storytelling",
      "Bilingual News Anchoring"
    ]
  },
  {
    name: "Graphic Design, UI/UX & Visual Arts",
    category: "Marketing & Media",
    specs: [
      "Corporate Identity & Brand Guidelines",
      "UI/UX Product Design (Figma)",
      "Packaging Design & Print Production",
      "Motion Graphics & After Effects",
      "3D Modeling & Rendering",
      "Typography & Editorial Layout"
    ]
  },
  {
    name: "Film, Video Editing & Audiovisual Production",
    category: "Marketing & Media",
    specs: [
      "Cinematography & Camera Operations",
      "Video Post-Production (Premiere/DaVinci)",
      "Sound Engineering & Foley",
      "Commercial & Corporate Video Directing",
      "Drone Aerial Videography",
      "Color Grading & Visual Effects (VFX)"
    ]
  },

  // ── 9. Legal, Policy & Governance ──
  {
    name: "Corporate Law, Business Contracts & OHADA",
    category: "Legal & Public Policy",
    specs: [
      "Commercial Contract Drafting & Review",
      "Corporate Governance & Board Support",
      "OHADA Uniform Acts Compliance",
      "Labor Law & Employment Disputes",
      "Intellectual Property & OAPI Trademarks",
      "Debt Recovery & Judicial Litigation"
    ]
  },
  {
    name: "Tax Law, Customs & International Trade Regulations",
    category: "Legal & Public Policy",
    specs: [
      "Cameroon General Tax Code (CGI)",
      "CEMAC Customs Code & Tariff Schedules",
      "AfCFTA Intra-African Trade Compliance",
      "Transfer Pricing & Cross-Border Taxation",
      "Tax Audit Defense & Litigation",
      "Double Taxation Treaties Advisory"
    ]
  },
  {
    name: "Public Administration & Decentralization",
    category: "Legal & Public Policy",
    specs: [
      "Local Councils & Regional Assembly Management",
      "Public Procurement (Passation des Marchés)",
      "Public Treasury & State Budgeting",
      "Municipal Services & Civil Registry",
      "Decentralized Cooperation & Projects",
      "Administrative Law & Public Ethics"
    ]
  },
  {
    name: "Diplomacy, International Relations & NGO Management",
    category: "Legal & Public Policy",
    specs: [
      "Humanitarian Project Lifecycle Management",
      "Grant Proposal Writing & Donor Reporting",
      "Bilateral & Multilateral Cooperation",
      "Monitoring, Evaluation & Learning (MEL)",
      "Refugee & IDP Humanitarian Coordination",
      "Diplomatic Protocol & Consular Services"
    ]
  },

  // ── 10. Human Resources & Workplace ──
  {
    name: "Human Resources Management & Talent Acquisition",
    category: "Human Resources & Organization",
    specs: [
      "End-to-End Talent Recruitment",
      "Onboarding & Career Progression Paths",
      "Performance Appraisal & KPIs",
      "HR Information Systems (HRIS)",
      "Compensation & Benefits Benchmarking",
      "Diversity, Equity & Inclusion Policies"
    ]
  },
  {
    name: "Industrial Relations & Labor Compliance",
    category: "Human Resources & Organization",
    specs: [
      "Trade Union Negotiations & Social Dialogue",
      "Staff Representative Elections (Délégués du Personnel)",
      "Disciplinary Procedures & Dismissal Compliance",
      "Internal Company Rules (Règlement Intérieur)",
      "Labor Inspectorate Inspections Defense",
      "Workplace Conflict Mediation"
    ]
  },
  {
    name: "Occupational Health, Safety & Environment (QHSE)",
    category: "Human Resources & Organization",
    specs: [
      "Workplace Hazard Identification & Risk Assessment",
      "ISO 45001 & ISO 14001 Implementation",
      "Accident Investigation & Root Cause Analysis",
      "Fire Safety & Emergency Response Plans",
      "PPE Compliance & Ergonomics",
      "Industrial Waste & Hazardous Chemical Management"
    ]
  },

  // ── 11. Architecture, Real Estate & Urban Planning ──
  {
    name: "Architecture & Sustainable Building Design",
    category: "Architecture & Environment",
    specs: [
      "Residential & Commercial Architectural Design",
      "Bioclimatic & Tropical Architecture",
      "Building Permit Dossier Preparation",
      "Interior Architecture & Space Planning",
      "Architectural Rendering & 3D Walkthroughs",
      "Historical Heritage Conservation"
    ]
  },
  {
    name: "Urban Planning & Land Surveying (Cadastre)",
    category: "Architecture & Environment",
    specs: [
      "Cadastral Demarcation & Title Registration",
      "Urban Master Plans (PDU/POS)",
      "GIS Cartography & Drone Mapping",
      "Subdivision & Land Development Projects",
      "Public Space & Transportation Urban Design",
      "Slum Upgrading & Urban Drainage"
    ]
  },
  {
    name: "Real Estate Property Management & Valuation",
    category: "Architecture & Environment",
    specs: [
      "Commercial & Residential Asset Leasing",
      "Property Valuation & Appraisal",
      "Facilities & Utilities Management",
      "Tenant Relationship & Rent Collection",
      "Real Estate Investment Trusts & Syndication",
      "Building Maintenance Coordination"
    ]
  },
  {
    name: "Environmental Science & Climate Resilience",
    category: "Architecture & Environment",
    specs: [
      "Environmental & Social Impact Assessment (ESIA)",
      "Carbon Auditing & Climate Adaptation Plans",
      "Biodiversity Conservation & Ecology",
      "Reforestation & Mangrove Restoration",
      "Solid Waste Recycling & Circular Economy",
      "Environmental Compliance Monitoring"
    ]
  },
  {
    name: "Water Engineering & Urban Sanitation",
    category: "Architecture & Environment",
    specs: [
      "Potable Water Treatment & Pumping Stations",
      "Urban Water Distribution Networks (Camwater)",
      "Wastewater & Industrial Effluent Treatment",
      "Stormwater Drainage & Flood Control",
      "Hydraulic Modeling (Epanet/WaterCAD)",
      "Rural Water Points & Borehole Drilling"
    ]
  },

  // ── 12. Education, Languages & Social Sciences ──
  {
    name: "Bilingual Translation & Conference Interpretation",
    category: "Languages & Humanities",
    specs: [
      "English to French Technical Translation",
      "French to English Legal & Financial Translation",
      "Simultaneous Conference Interpretation",
      "Subtitling, Dubbing & Media Localization",
      "Terminology Management & CAT Tools (Trados)",
      "Sworn Court & Notary Translation"
    ]
  },
  {
    name: "Higher Education, Pedagogy & E-Learning",
    category: "Languages & Humanities",
    specs: [
      "Instructional Design & E-Learning Modules",
      "Learning Management Systems (Moodle/Canvas)",
      "University Curriculum Development",
      "Academic Assessment & Examination Systems",
      "Technical & Vocational Education (TVET/MINFOP)",
      "Student Academic Counseling"
    ]
  },
  {
    name: "Clinical Psychology & Mental Health Support",
    category: "Languages & Humanities",
    specs: [
      "Individual & Group Psychotherapy",
      "Psychosocial Support in Conflict Zones",
      "Workplace Stress & Burnout Management",
      "Child & Adolescent Psychological Evaluation",
      "Addiction & Substance Abuse Rehabilitation",
      "Trauma-Informed Counseling"
    ]
  },
  {
    name: "Social Work & Community Development",
    category: "Languages & Humanities",
    specs: [
      "Child Protection & Vulnerable Persons Care",
      "Community Sensitization & Empowerment",
      "Gender-Based Violence (GBV) Case Management",
      "Micro-Project Cooperative Supervision",
      "Reintegration of Incarcerated Individuals",
      "Social Survey Design & Fieldwork"
    ]
  },

  // ── 13. Hospitality, Tourism & Creative Arts ──
  {
    name: "Hospitality Management & Hotel Operations",
    category: "Hospitality & Services",
    specs: [
      "Front Office & Concierge Management",
      "Housekeeping & Facilities Standards",
      "Food & Beverage (F&B) Management",
      "Hotel Revenue Management & Pricing",
      "Hospitality ERP (Opera/Protel)",
      "Guest Experience & VIP Protocol"
    ]
  },
  {
    name: "Tourism Planning, Ecotourism & Travel Services",
    category: "Hospitality & Services",
    specs: [
      "Tour Packaging & Itinerary Design",
      "Ecotourism in National Parks (Waza, Korup)",
      "Amadeus & Sabre GDS Airline Ticketing",
      "Cultural & Heritage Tourism Promotion",
      "Travel Agency Operations & Customer Relations",
      "Tourism Marketing for Cameroon Destination"
    ]
  },
  {
    name: "Culinary Arts, Gastronomy & Catering Operations",
    category: "Hospitality & Services",
    specs: [
      "Professional Kitchen Production (Hot/Cold)",
      "Traditional Cameroonian Fine Gastronomy",
      "Pastry, Bakery & Confectionery",
      "Industrial & Corporate Catering Operations",
      "Menu Engineering & Food Cost Control",
      "Kitchen Hygiene & Food Safety Audits"
    ]
  },
  {
    name: "Event Planning, Protocol & Conference Management",
    category: "Hospitality & Services",
    specs: [
      "International Conferences & Summits Logistics",
      "Corporate Gala & Product Launch Production",
      "Official State Protocol & VIP Escorts",
      "Audio-Visual & Stage Rigging Management",
      "Exhibition & Trade Fair Booth Coordination",
      "Event Risk Management & Crowd Control"
    ]
  },
  {
    name: "Sports Management, Fitness & Physical Coaching",
    category: "Hospitality & Services",
    specs: [
      "Football & Sports Club Administration",
      "Athletic Conditioning & Performance Coaching",
      "Gym & Fitness Center Operations",
      "Sports Marketing & Sponsorship Acquisition",
      "Youth Sports Academy Training",
      "Sports Event Operations & Stadium Security"
    ]
  },
  {
    name: "Fashion Design, Textile Technology & Garment Production",
    category: "Hospitality & Services",
    specs: [
      "Haute Couture & Traditional African Wear",
      "Pattern Making & Industrial Cutting",
      "Textile Sourcing & Quality Assessment",
      "Garment Factory Line Management",
      "Fashion Merchandising & Showroom Sales",
      "Accessory Design & Leather Crafting"
    ]
  }
];

console.log(`Total fields prepared: ${FIELDS_60.length}`);

// Split into 6 files of 10 fields each in scripts/data/
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

for (let i = 0; i < 6; i++) {
  const chunk = FIELDS_60.slice(i * 10, (i + 1) * 10);
  const filePath = path.join(dataDir, `fields-${i + 1}.json`);
  fs.writeFileSync(filePath, JSON.stringify(chunk, null, 2), 'utf8');
  console.log(`Wrote ${chunk.length} fields to ${filePath}`);
}

// Also save complete fields-all.json
fs.writeFileSync(path.join(dataDir, 'fields-all.json'), JSON.stringify(FIELDS_60, null, 2), 'utf8');
console.log('Saved fields-all.json successfully.');
