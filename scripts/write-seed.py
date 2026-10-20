import os
fields = [
    ("Software & Cloud Engineering", "software-cloud-engineering", "Technology & ICT", ["Frontend Development", "Backend Engineering", "Full-Stack Web", "Mobile Application (iOS/Android)", "Cloud & DevOps"]),
    ("Cybersecurity & Network Systems", "cybersecurity-networks", "Technology & ICT", ["Network Infrastructure & Routing", "SOC Analysis & Incident Response", "Information Security Auditing", "Telecom Systems"]),
    ("Data Science & Artificial Intelligence", "data-science-ai", "Technology & ICT", ["Machine Learning Engineering", "Business Intelligence & Analytics", "Data Engineering & Pipelines", "Statistical Modeling"]),
    ("Finance, Banking & Accounting", "finance-accounting", "Business & Finance", ["Corporate Finance & M&A", "OHADA Accounting & Audit", "Credit Risk & Retail Banking", "Microfinance Operations", "Treasury & Forex"]),
    ("Marketing, Growth & Communications", "marketing-communications", "Business & Finance", ["Digital Marketing & SEO", "Brand & Product Marketing", "Corporate Communications & PR", "Community Management"]),
    ("Human Resources & Talent Management", "human-resources", "Business & Finance", ["Talent Acquisition & Recruiting", "Payroll & Labour Law (Cameroon)", "Training & People Development", "HR Operations"]),
    ("Supply Chain, Logistics & Procurement", "supply-chain-logistics", "Operations & Engineering", ["Port Logistics & Customs Transit (CEMAC)", "Warehousing & Inventory Control", "Freight Forwarding & Transport", "Strategic Procurement"]),
    ("Civil, Mechanical & Electrical Engineering", "engineering-industrial", "Operations & Engineering", ["Structural & Civil Works (BTP)", "Electrical Power Systems (Grid & Solar)", "Mechanical Maintenance & Hydraulics", "Industrial Automation & PLC"]),
    ("Healthcare, Biotech & Pharmaceuticals", "healthcare-biotech", "Health & Life Sciences", ["Clinical Medicine & Nursing", "Pharmacy & Pharmacovigilance", "Medical Laboratory Biology", "Public Health & Epidemiology", "Biomedical Engineering"]),
    ("Corporate Law, Compliance & Governance", "legal-compliance", "Legal & Policy", ["OHADA Corporate Law", "Data Protection & Privacy", "Contracts & Intellectual Property", "Regulatory Compliance"]),
    ("Agro-Industry, Agriculture & Environment", "agriculture-environment", "Agriculture & Nature", ["Agronomy & Crop Science", "Agro-Industrial Food Processing", "Forestry & Wood Technology", "Environmental Impact Assessment", "Livestock & Veterinary"]),
    ("Mining, Petroleum & Chemical Engineering", "mining-petroleum-chemical", "Energy & Heavy Industry", ["Petroleum Geosciences", "Drilling & Well Operations", "Refinery Process Engineering", "Mining Geology & Extraction", "Chemical Process Safety"]),
    ("Media, Journalism & Bilingual Communication", "media-journalism-communication", "Media & Arts", ["Journalism & Investigative Reporting", "Public Relations & Corporate Comms", "Bilingual (FR/EN/PT) Copywriting", "Digital Content & Storytelling"]),
    ("Education, Teaching & Academic Research", "education-teaching-research", "Education & Academia", ["Secondary School Pedagogy", "Higher Education Lecturing", "Educational Administration", "Scientific Lab Research"]),
    ("Hospitality, Tourism & Catering Management", "hospitality-tourism-catering", "Hospitality & Services", ["Hotel Operations & Front Office", "Culinary Arts & Food Production", "Banquet & Event Management", "Tourism & Travel Planning"]),
    ("Software Quality Assurance & Testing", "qa-testing", "Technology & ICT", ["Manual & Automated Testing", "Test Automation (Selenium, Cypress)", "Performance & Security Testing", "SDET & CI/CD Integration"]),
    ("Cybersecurity Governance & Compliance", "cyber-compliance", "Legal & Policy", ["Cybersecurity Law", "Data Protection (GDPR & Cameroonian Law)", "Tech Policy & Ethics", "Digital Forensics"]),
    ("Taxation & Audit Compliance", "taxation-audit", "Business & Finance", ["Corporate Taxation", "VAT & Indirect Taxes", "Forensic Audit", "Tax Strategy & Advisory"]),
    ("Logistics Analytics & Supply Chain Risk", "logistics-analytics", "Operations & Engineering", ["Logistics Analytics & Forecasting", "Inventory Optimisation", "Route Planning & Fleet Efficiency", "Supply Chain Risk"]),
    ("E-Tourism & Hospitality Technology", "hoteltech", "Hospitality & Services", ["Hospitality Tech Systems", "Online Travel & E-Tourism", "Revenue Management", "Guest Experience Analytics"]),
    ("Public Policy, Governance & Development", "public-policy", "Legal & Policy", ["Public Policy Design & Evaluation", "Decentralisation & Local Governance", "International Development", "Security & Conflict Studies"]),
    ("Agri-Fintech & Rural Banking", "agrifintech", "Business & Finance", ["Agricultural Finance Products", "Mobile Money & Fintech", "Rural Banking Operations", "Value Chain Finance"]),
    ("Telemedicine & Digital Health", "telemedicine", "Health & Life Sciences", ["Telehealth Services", "Health Apps & Wearables", "E-Prescribing & Digital Clinics", "Health Data Privacy"]),
    ("Climate & Carbon Markets", "climate-carbon", "Agriculture & Nature", ["Carbon Accounting & Verification", "Climate Risk Mapping", "Nature-Based Solutions", "Blue Carbon & Mangroves"]),
    ("Ecology & Conservation", "ecology-conservation", "Nature & Environment", ["Biodiversity Mapping", "Wildlife Protection & Conservation", "Marine & Coastal Ecosystems", "Environmental Education"]),
    ("Geotechnical & Structural Engineering", "geotech", "Operations & Engineering", ["Soil Mechanics & Foundation Design", "Structural Analysis & Seismic Design", "Materials Testing", "Construction Project Management"]),
    ("Trade Finance & Supply Chain Finance", "trade-finance", "Business & Finance", ["Export/Import Finance", "Letters of Credit", "Supply Chain Finance Platforms", "Commodity Trade Finance"]),
    ("Social Media & Community Management", "community-mgmt", "Media & Arts", ["Social Media Strategy", "Community Moderation & Growth", "Influencer Relations", "Brand Safety & Ad Verification"]),
    ("Music, Sound & Live Events", "audio-visual", "Media & Arts", ["Music Production & Sound Engineering", "Live Event Management", "Theatre & Stage Design", "Copyright & Music Publishing"]),
    ("Heritage, Museums & Cultural Management", "heritage", "Nature & Environment", ["Cultural Heritage Management", "Museum Curation & Conservation", "Archaeological Fieldwork", "Traditional Crafts & Knowledge Preservation"]),
    ("Special Education & Instructional Design", "special-ed", "Education & Academia", ["Special Needs Education", "Instructional Design", "Learning Technology", "Educational Psychology"]),
    ("Automation, Robotics & PLC", "robotics", "Operations & Engineering", ["Industrial Robotics Programming", "Automated Production Lines", "Computer-Aided Design (CAD)", "Mechatronics Engineering"]),
    ("Insurance & Risk Management", "insurance-risk", "Business & Finance", ["Life & Non-Life Insurance", "Actuarial Science", "Risk Management & Mitigation", "Claims Handling & Investigation"]),
    ("Remote Sensing & Geospatial Analysis", "remote-sensing", "Operations & Engineering", ["Satellite Imagery Analysis", "GIS & Spatial Modelling", "Drone Surveying & Mapping", "Disaster Risk Mapping"]),
    ("Aviation & Airport Operations", "aviation", "Operations & Engineering", ["Airport Operations", "Aviation Safety & Security", "Airline Management", "Cargo Handling & Logistics"]),
    ("Renewable Energy Project Development", "energy-ppp", "Energy & Heavy Industry", ["Solar PPA & Project Finance", "Wind Farm Development", "Energy Storage Systems", "Independent Power Producer (IPP) Management"]),
    ("Urban Planning & Smart Cities", "smart-city", "Operations & Engineering", ["Urban Design & Zoning", "Smart City ICT", "Sustainable Mobility Planning", "Housing Policy & Development"]),
    ("Data Journalism & Investigative Reporting", "data-journalism", "Media & Arts", ["Data-Driven Storytelling", "Visualization & Infographics", "Source Development & Verification", "Investigative Methods"]),
    ("Game Design & Interactive Media", "games", "Media & Arts", ["Game Mechanics & Systems Design", "Unity/Unreal Development", "Level Design & UX", "Indie Publishing & Marketing"]),
];
$out = "const FIELDS_CONFIG = [";
var i=0;
fields.forEach(function(f){
$out += "\\n  {";
$out += "\\n    name: " + JSON.stringify(f[0]) + ",";
$out += "\\n    slug: " + JSON.stringify(f[1]) + ",";
$out += "\\n    category: " + JSON.stringify(f[2]) + ",";
$out += "\\n    specializations: " + JSON.stringify(f[3]) + ",";
$out += "\\n  }" + (i < fields.length-1 ? "," : "");
i++;
});
$out += "\\n"];
$out += "module.exports = { FIELDS_CONFIG: FIELDS_CONFIG };\\n";
require("fs").writeFileSync("c:/mantech_nexus/scripts/seed-fields.js", $out, "utf8");
console.log("wrote " + fields.length + " fields");
