fields_part2 = [
    ('Software Quality Assurance & Testing','qa-testing','Technology & ICT',['Manual & Automated Testing','Test Automation (Selenium, Cypress)','Performance & Security Testing','SDET & CI/CD Integration']),
    ('Cybersecurity Governance & Compliance','cyber-compliance','Legal & Policy',['Cybersecurity Law','Data Protection (GDPR & Cameroonian Law)','Tech Policy & Ethics','Digital Forensics']),
    ('Taxation & Audit Compliance','taxation-audit','Business & Finance',['Corporate Taxation','VAT & Indirect Taxes','Forensic Audit','Tax Strategy & Advisory']),
    ('Logistics Analytics & Supply Chain Risk','logistics-analytics','Operations & Engineering',['Logistics Analytics & Forecasting','Inventory Optimisation','Route Planning & Fleet Efficiency','Supply Chain Risk']),
    ('E-Tourism & Hospitality Technology','hoteltech','Hospitality & Services',['Hospitality Tech Systems','Online Travel & E-Tourism','Revenue Management','Guest Experience Analytics']),
    ('Public Policy, Governance & Development','public-policy','Legal & Policy',['Public Policy Design & Evaluation','Decentralisation & Local Governance','International Development','Security & Conflict Studies']),
    ('Agri-Fintech & Rural Banking','agrifintech','Business & Finance',['Agricultural Finance Products','Mobile Money & Fintech','Rural Banking Operations','Value Chain Finance']),
    ('Telemedicine & Digital Health','telemedicine','Health & Life Sciences',['Telehealth Services','Health Apps & Wearables','E-Prescribing & Digital Clinics','Health Data Privacy']),
    ('Climate & Carbon Markets','climate-carbon','Agriculture & Nature',['Carbon Accounting & Verification','Climate Risk Mapping','Nature-Based Solutions','Blue Carbon & Mangroves']),
    ('Ecology & Conservation','ecology-conservation','Nature & Environment',['Biodiversity Mapping','Wildlife Protection & Conservation','Marine & Coastal Ecosystems','Environmental Education']),
    ('Geotechnical & Structural Engineering','geotech','Operations & Engineering',['Soil Mechanics & Foundation Design','Structural Analysis & Seismic Design','Materials Testing','Construction Project Management']),
    ('Trade Finance & Supply Chain Finance','trade-finance','Business & Finance',['Export/Import Finance','Letters of Credit','Supply Chain Finance Platforms','Commodity Trade Finance']),
    ('Social Media & Community Management','community-mgmt','Media & Arts',['Social Media Strategy','Community Moderation & Growth','Influencer Relations','Brand Safety & Ad Verification']),
    ('Music, Sound & Live Events','audio-visual','Media & Arts',['Music Production & Sound Engineering','Live Event Management','Theatre & Stage Design','Copyright & Music Publishing']),
    ('Heritage, Museums & Cultural Management','heritage','Nature & Environment',['Cultural Heritage Management','Museum Curation & Conservation','Archaeological Fieldwork','Traditional Crafts & Knowledge Preservation']),
]
lines = []
for name, slug, cat, specs in fields_part2:
    lines.append("  { name: " + repr(name) + ", slug: " + repr(slug) + ", category: " + repr(cat) + ", specs: " + repr(specs) + " },")
with open('c:/mantech_nexus/scripts/seed-fields.mjs','a',encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print('appended', len(lines), 'fields (part 2)')