export type EditorialResource = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  content: string;
};

export const EDITORIAL_RESOURCES: EditorialResource[] = [
  {
    id: 'internship-application-checklist',
    title: 'A practical checklist for internship applications',
    slug: 'internship-application-checklist',
    excerpt: 'Prepare a clear, complete application before you apply, and keep track of every opportunity you pursue.',
    category: 'Applications',
    readTime: '4 min read',
    publishedAt: '2026-01-15',
    author: 'MANTECH Editorial Team',
    content: `Before applying, read the opportunity carefully and confirm that your qualification, skills, location and availability match the requirements.\n\nPrepare your professional profile\n- Use your full name and a professional photo.\n- Keep your phone number current so an organization can reach you when your privacy settings permit it.\n- Add your completed qualification, education history, professional field, skills and location.\n- Upload a current PDF CV and review the filename before submitting it.\n\nMake each application relevant\n- Refer to the responsibilities and required skills in the opportunity.\n- Write a concise cover note that explains your interest and relevant experience.\n- Check the deadline and application method. Some organizations receive applications through MANTECH; others direct you to their own website or an external recruitment platform.\n\nAfter applying\n- Track the application status in your dashboard.\n- Check your notifications and email for interview or status updates.\n- Keep your contact details current and respond promptly to recruitment messages.\n\nNever pay an individual who claims to guarantee an internship. Confirm unusual requests with the organization through its official contact channels.`,
  },
  {
    id: 'build-a-professional-intern-passport',
    title: 'Build a useful professional Intern Passport',
    slug: 'professional-intern-passport',
    excerpt: 'Show recruiters the professional details that help them understand your training, strengths and internship goals.',
    category: 'Intern Passport',
    readTime: '5 min read',
    publishedAt: '2026-01-20',
    author: 'MANTECH Editorial Team',
    content: `An Intern Passport is a professional profile for discovery and recruitment. It complements your CV; it is not a CV builder and does not make your documents public.\n\nStart with accurate essentials: your qualification already obtained, education history, field, specialization, skills and current location. Add a concise headline and summary that explain the kind of internship you are seeking. Include real certifications or experience when available, and keep dates and descriptions accurate.\n\nReview your privacy choices. Your phone visibility and profile discoverability are separate settings. Only verified organizations should be able to search discoverable Intern Passports, and CV access is authorized and logged by the platform.\n\nUpdate your profile when your availability, education, skills or internship preferences change. A complete, current profile is easier for recruiters to assess.`,
  },
  {
    id: 'prepare-for-an-internship-interview',
    title: 'How to prepare for an internship interview',
    slug: 'prepare-for-an-internship-interview',
    excerpt: 'Simple ways to prepare, communicate clearly and follow up professionally after an interview.',
    category: 'Interviews',
    readTime: '4 min read',
    publishedAt: '2026-02-02',
    author: 'MANTECH Editorial Team',
    content: `Read the opportunity and organization information again before the interview. Prepare a short introduction covering what you have studied, what you can do and what you hope to learn during the internship.\n\nBring examples. A class, personal or volunteer project can show how you approach a problem, collaborate and learn. Be clear about what you contributed and what you would improve next time.\n\nConfirm the date, time, format and location in advance. For an online meeting, test your connection and join from a quiet place. For an in-person meeting, plan your route and arrive early. If you need to reschedule, let the organization know as soon as possible.\n\nAsk a few relevant questions about the role, supervision, expected tasks and next steps. After the interview, send a brief thank-you message and keep your application status and contact details up to date.`,
  },
  {
    id: 'for-cameroon-employers',
    title: 'A clear recruitment process for internship hosts',
    slug: 'recruitment-process-for-internship-hosts',
    excerpt: 'Help candidates understand the role and make your internship opportunity easier to assess.',
    category: 'For Organizations',
    readTime: '5 min read',
    publishedAt: '2026-02-10',
    author: 'MANTECH Editorial Team',
    content: `Write an opportunity around the work the intern will actually do. State the professional field, practical responsibilities, required skills, qualification, location, work mode, duration, start period and deadline. Explain whether the internship is paid and what support or benefits are included.\n\nChoose the application method that matches your process. MANTECH applications are managed in the organization dashboard. Company-site and external applications direct candidates to the URL you provide; keep that URL official, secure and current.\n\nReview applicants consistently against the published requirements. Record status changes, interview plans and placement decisions in the recruitment workflow. Limit access to candidate information to authorized organization members, and access CVs through the platform's audited download flow.\n\nKeep organization verification details and recruiter membership current. Clear communication and timely status updates help candidates understand what to expect.`,
  },
  {
    id: 'navigating-cameroon-10-regions',
    title: 'Finding internships across Cameroon: a region-by-region guide',
    slug: 'cameroon-regions-internship-guide',
    excerpt: 'The industries, employers and educational hubs that shape internship opportunities in each of the ten Cameroon regions.',
    category: 'Career Advice',
    readTime: '7 min read',
    publishedAt: '2026-02-22',
    author: 'MANTECH Editorial Team',
    content: `Cameroon is a country of ten administrative regions, each with its own economic character, industrial employers and educational institutions. Understanding the geography of opportunity helps you target the right searches.\n\nCentre Region (Yaoundé) is the administrative capital, hosting government ministries, financial-sector headquarters, multinationals and the main university campuses of Yaoundé I, Yaoundé II and ENSP. Business, finance, law, public administration and technology internships are especially concentrated here.\n\nLittoral Region (Douala) is the economic capital. Ports, banking headquarters, manufacturing, FMCG, logistics, telecoms and startup ecosystems (including fintech and SaaS) create a rich internship market. The University of Douala, IUC and many grandes écoles are nearby.\n\nSouth-West Region is home to Buea (University of Buea), Limbe (SONARA refinery, CDC plantations and tourism infrastructure), and Kumba. Energy, agribusiness, healthcare-education and port logistics are strong.\n\nWest Region (Bafoussam, Dschang, Foumban) hosts the University of Dschang, specialized agronomy programs, FMCG distribution hubs and a growing SME ecosystem. Agribusiness, commerce, and SME operations internships are plentiful.\n\nNorth-West Region (Bamenda) hosts the University of Bamenda. Education, health services, NGO programs and small-business operations are characteristic internship sectors.\n\nAdamawa (Ngaoundéré), North (Garoua), Far-North (Maroua), East (Bertoua), and South (Ebolowa, Kribi) each have public universities, agricultural/rural-development programs, energy infrastructure (dams, solar micro-grids), mining and tourism investment zones. Rural electrification, veterinary services, logistics and public-health research all recruit interns locally.\n\nTip on MANTECH: use the Locations explorer (/locations) and Region filters on the internship search page to narrow listings geographically before applying.`,
  },
  {
    id: 'privacy-intern-passport-cv',
    title: 'Understanding Intern Passport privacy and CV access controls',
    slug: 'intern-passport-privacy-cv-access',
    excerpt: 'How MANTECH protects your personal information and keeps CV downloads auditable for verified organizations only.',
    category: 'Privacy & Trust',
    readTime: '4 min read',
    publishedAt: '2026-03-01',
    author: 'MANTECH Editorial Team',
    content: `MANTECH is built around a simple privacy promise: your Intern Passport is discoverable, but your sensitive documents and phone number are never public.\n\nDiscoverability vs. Access\nWhen you register and complete your Intern Passport, verified companies and universities can search and review your professional profile (headline, summary, qualification, field, specialization, skills, education, certifications, experience, location and availability). This lets the right organization find you.\n\nYour phone number is visible only after privacy conditions are met: the organization is verified; a recruiter sends a legitimate contact or shortlist request; and your phone-visibility setting permits it.\n\nCV access is strictly server-authorized. Organizations do not receive a public, permanent link to your CV. When they request the document, MANTECH creates a short-lived, auditable download event recorded in the Audit Log with the actor, timestamp and purpose. This prevents mass scraping, uncontrolled sharing and the CV-distribution problems that affect generic job boards.\n\nYou control your profile privacy settings in Settings. You can toggle CV searchability, set narrower availability windows, or withdraw from discovery temporarily without deleting your account.\n\nReport suspicious contact requests through the built-in report flow. MANTECH reviews flagged activity and can restrict or remove recruiter access when the code of conduct is violated.`,
  },
  {
    id: 'three-application-methods-explained',
    title: 'MANTECH offers three application methods — here is how they work',
    slug: 'three-application-methods-explained',
    excerpt: 'MANTECH-apply, company-website redirect and external-platform apply each have different journeys but are all tracked in your dashboard.',
    category: 'Applications',
    readTime: '4 min read',
    publishedAt: '2026-03-10',
    author: 'MANTECH Editorial Team',
    content: `Every internship opportunity on MANTECH uses one of three configured application methods. The choice is set by the verified organization publishing the role.\n\nMethod 1 — Apply on MANTECH (MANTECH)\nYou fill out the application inside MANTECH: optional cover note, authorized CV reference, readiness-score indicators and any additional documents requested. The application lands directly in the organization dashboard and you can track its status in your own dashboard (Under Review, Shortlisted, Interview, Selected, Rejected, etc.).\n\nMethod 2 — Apply on Company Website (COMPANY_WEBSITE)\nWhen you click Apply, MANTECH first records your interest in its database (for tracking and notifications) and then opens the organization's official careers page or application portal in a new tab. Always complete the form on the official site; keep the confirmation email as a backup.\n\nMethod 3 — Apply Externally (EXTERNAL)\nThe organization is using a third-party recruitment platform (LinkedIn, a university portal, a formal applicant-tracking system, a WhatsApp channel). MANTECH records your interest and redirects you to the exact external URL. The same rules apply: finish the external application promptly and return to MANTECH so that your dashboard reflects your action.\n\nWhy all three? Because Cameroonian enterprises, universities and public institutions use a mix of internal systems. MANTECH adapts to how employers already hire, while still giving you (and your university placement office) ONE dashboard to see the whole picture.\n\nAfter applying via ANY method, monitor Notifications and email for interview invitations or recruiter-initiated contact requests.`,
  },
  {
    id: 'professional-fields-all-disciplines',
    title: 'MANTECH covers every professional discipline — not just tech',
    slug: 'all-professional-fields-not-only-tech',
    excerpt: 'From agronomy to OHADA law, biomedical equipment to civil works: MANTECH is designed for Cameroon\'s entire professional landscape.',
    category: 'Platform News',
    readTime: '4 min read',
    publishedAt: '2026-03-18',
    author: 'MANTECH Editorial Team',
    content: `A common early question is whether MANTECH is only for computer-science and software internships. The answer is emphatically no.\n\nTen professional fields are built into the marketplace taxonomy:\n1. Software & Cloud Engineering\n2. Cybersecurity & Network Systems\n3. Data Science & Artificial Intelligence\n4. Finance, Banking & Accounting\n5. Marketing, Growth & Communications\n6. Human Resources & Talent Management\n7. Supply Chain, Logistics & Procurement\n8. Civil, Mechanical & Electrical Engineering\n9. Healthcare, Biotech & Pharmaceuticals\n10. Corporate Law, Compliance & Governance\n\nEvery field has 4–5 associated specializations (for example, under Engineering: Electrical Power Systems, Civil Construction & BIM, Mechanical Maintenance, Renewable Energy & Solar).\n\nThe catalog of opportunities already spans these disciplines, and the university placement-office module is especially strong outside tech: agronomy internships at CDC, veterinary field research at Ngaoundéré, maritime logistics at the Port of Douala, legal compliance at Deloitte, or concrete-quality testing at CECICAM.\n\nSearch tips: start from the Fields explorer (/fields), then use specialization, qualification, work-mode and location filters together. If you do not yet see postings in your exact field, remember that the marketplace grows weekly and you can set profile searchability to “discoverable” so verified organizations find you instead.`,
  },
  {
    id: 'university-placement-coordination',
    title: 'How university placement offices use MANTECH to coordinate internships',
    slug: 'university-placement-coordination',
    excerpt: 'Dual-mode dashboards help placement coordinators partner with companies while recruiting for the university\'s own departments.',
    category: 'For Universities',
    readTime: '6 min read',
    publishedAt: '2026-03-25',
    author: 'MANTECH Editorial Team',
    content: `The MANTECH University Dashboard is a dual-mode system, reflecting the two jobs every higher-education institution performs in practice.\n\nMode A — Help Find Internships (Placement Coordination)\nAn authorized placement officer can monitor opportunities, build curated lists for each student cohort, and track MANTECH-tracked applications. Data-privacy protections are strict: the university sees only the MANTECH-recorded applications of students whose listed institution matches the university name. It cannot see applications of students from other schools, nor can it access CVs it has no right to view.\n\nMode B — Recruit Interns (Recruiter)\nEvery accredited university also hires interns (research assistants, laboratory technicians, web developers for the institutional portal, clinical-research support, facilities assistants). Mode B is a standard recruiter dashboard, identical to the company dashboard in structure: publish opportunities, review candidates, schedule interviews, run selections and onboard placements.\n\nWhy two modes in one?\nBefore MANTECH, a Cameroonian university typically ran one spreadsheet for placement-coordination follow-up with partner enterprises and a completely separate spreadsheet for recruiting interns into its own labs. Faculty wasted time toggling between documents, email chains, WhatsApp groups and paper-based sign-off files.\n\nBoth modes live in one permission-controlled dashboard. Separate user roles (Placement Coordinator vs. University Recruiter) keep the data properly segregated. MANTECH enterprise-level institutional packages allow fifty or more recruiter accounts, so every faculty and department can run its internship programs without sharing credentials.\n\nIf you are a university administrator and do not yet have the dual-mode dashboard activated, contact MANTECH through the WhatsApp concierge on the pricing page.`,
  },
  {
    id: 'readiness-score-what-it-means',
    title: 'What the MANTECH readiness score means — and how to raise it',
    slug: 'mantech-readiness-score-guide',
    excerpt: 'A simple, transparent scoring model used by both interns and reviewers to quickly compare profile completeness.',
    category: 'Intern Passport',
    readTime: '4 min read',
    publishedAt: '2026-04-02',
    author: 'MANTECH Editorial Team',
    content: `Your MANTECH readiness score (shown on your profile, and included with each application) is a transparent indicator of profile completeness, verification status and professional readiness. It is not an intelligence test or a grade.\n\nWhat it measures:\n- Profile completeness (full name, professional photo, phone, completed CV, education, field, specialization, skills, location, availability, work-mode preferences)\n- Verified status of uploaded documents\n- Privacy settings (CV searchable, correct institution name for university placement linkage, proper consent flags)\n- Recency of updates (last 90 days)\n\nBaseline at registration is 40. A fully completed, verified profile typically reaches 85–100.\n\nWhy does it exist?\nFirst, for you: to nudge you toward completing the registration requirements SRS §6 explicitly mandates (photo, phone, CV, qualification are all mandatory).\n\nSecond, for organizations: when a recruiter reviews dozens of applications for one opening, the readiness score acts as a quick, fair signal of which candidates followed the registration process carefully. An 85+ score tells the recruiter that you have a verified photo, an uploaded CV, a listed phone number, complete education and current availability.\n\nIt does NOT penalize candidates by academic level, school name or age. Nothing in the scoring is subjective.\n\nHow to raise it quickly:\n1. Upload a clear, recent professional photo (no sunglasses, no group pictures, no filters).\n2. Verify your phone number and confirm the email on file.\n3. Add all three most relevant skills plus at least one certification or project, if available.\n4. Ensure your CV is freshly uploaded and properly indexed (PDF file, sensible filename).\n5. Set availability, work-mode preferences and location precisely.\n6. Return once every 60 days and refresh “last updated” by editing even one sentence in your summary.\n\nReadiness scores recalculate automatically within minutes when you save changes in Settings or the Intern Passport page.`,
  },
  {
    id: 'mantech-packages-whatsapp-upgrade',
    title: 'MANTECH packages, pricing and the WhatsApp concierge upgrade flow',
    slug: 'mantech-packages-whatsapp-upgrade',
    excerpt: 'Free, Professional, Business and Institutional tiers — and how upgrades happen through personal concierge, not online payment gateways.',
    category: 'Monetization & Billing',
    readTime: '5 min read',
    publishedAt: '2026-04-12',
    author: 'MANTECH Editorial Team',
    content: `MANTECH is free for internship seekers at launch. Revenue comes from verified organizations (companies, universities, public institutions) through four tiered packages, all upgradable through the WhatsApp concierge. This is intentional: Cameroonian organizations prefer human, trusted commercial onboarding for business-critical software.\n\nPackage tiers\n- Free Starter: verified profile, up to 2 active opportunities, basic candidate discovery (15 candidate views/month), 1 recruiter account.\n- Professional Recruiter (XAF 45 000/month): 10 opportunities, advanced filters + unlimited candidate discovery, 3 recruiter seats, interview scheduling, branded profile.\n- Business Enterprise (XAF 120 000/month): unlimited opportunities, unlimited CV access, 10 recruiter seats, featured/priority visibility, direct-phone reachout permissions, onboarding workflows, dedicated talent-sourcing concierge on WhatsApp.\n- Institutional Partner (XAF 250 000/semester or annual): dual-mode university dashboard, up to 50 recruiter + coordinator accounts, partner-company pipelines, institutional analytics, custom reporting.\n\nHow to upgrade (SRS §16 rule — no Stripe, no online payment gateways)\nFrom the Billing module in your dashboard, or from the Pricing page (/pricing), click the “Upgrade via WhatsApp” button associated with the tier. A pre-filled WhatsApp message opens automatically to the official MANTECH concierge number. Include your organization name, organization slug, the package you want, and the preferred billing period (monthly, quarterly, annual, semester).\n\nA MANTECH commercial consultant replies during working hours (Mon–Fri, 08:00–18:00 WAT) with: the activation invoice in XAF, accepted payment methods (mobile money, bank transfer details for the official MANTECH account), and timelines. Payment is completed outside the platform. Once the finance team confirms receipt, the subscription is activated manually in the Admin dashboard and your organization limits are raised within one business day. All activation events are logged for audit.\n\nThis manual flow is slightly slower than one-click checkout — but it is the right choice for a market where trusted business relationships matter more than frictionless online card payments, and where the SRS explicitly prohibits automated payment gateways (§211, §345).`,
  },
  {
    id: 'manually-avoid-internship-scams',
    title: 'How to recognize and report internship scams on MANTECH',
    slug: 'recognize-report-internship-scams',
    excerpt: 'Red flags, safe behaviors and the reporting channels MANTECH operates to keep the marketplace trustworthy.',
    category: 'Trust & Safety',
    readTime: '4 min read',
    publishedAt: '2026-04-20',
    author: 'MANTECH Editorial Team',
    content: `MANTECH verifies every organization before it can publish opportunities or access Intern Passports. But every marketplace must remain vigilant, and you should always combine platform safeguards with personal judgement.\n\nRed flags (do NOT comply, report immediately):\n- Any recruiter or “agent” asks you to pay money (any amount) for an internship, CV review, visa processing, shortlist confirmation, or an interview slot. Legitimate hosts on MANTECH do not charge candidates.\n- Someone claiming to represent MANTECH contacts you outside the platform (personal WhatsApp, Telegram, Facebook Messenger) with a “guaranteed internship” for a fee.\n- A recruiter requests sensitive identity documents (national ID card scans, birth certificates, bank account numbers) BEFORE a formal offer is made in writing.\n- Communications arrive from public-domain email addresses (Gmail, Yahoo) rather than an @companyname.cm or @university.cm address.\n- The opportunity promises a large salary and a “European placement in 6 months” with minimal requirements. If it sounds too good to be true, it almost always is.\n\nSafe behaviors:\n- Apply exclusively through MANTECH's three authorized methods (MANTECH, COMPANY_WEBSITE, EXTERNAL with clearly identified official URL).\n- Keep all contact inside MANTECH Messages / Notifications until a legitimate recruitment relationship is confirmed through a verified organization.\n- Cross-check unusual recruiter names against the official staff list on the organization's public website, or call the organization's general phone number (found in its MANTECH profile).\n\nReporting channels:\n- Use the built-in Report button on any opportunity, message or contact request.\n- Send a detailed message to MANTECH support through the official WhatsApp concierge.\n- Email the MANTECH trust & safety team from the contact page.\n\nEvery report is triaged within one business day. Verified organizations that breach the code of conduct lose publishing privileges, and repeated or severe cases are fully suspended with an audit trail.`,
  },
];

export function getEditorialResource(slug: string) {
  return EDITORIAL_RESOURCES.find((resource) => resource.slug === slug);
}
