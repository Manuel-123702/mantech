'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Search,
  X,
  Users,
  Building2,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  MapPin,
  FileText,
  Sparkles,
  MessageCircle,
  Award,
  Clock,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { waSupportLink } from '@/lib/whatsapp';

type FAQ = {
  q: string;
  a: string;
  category: string;
};

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'about', label: 'About MANTECH', icon: Sparkles },
  { id: 'interns', label: 'For Interns', icon: GraduationCap },
  { id: 'employers', label: 'For Employers', icon: Building2 },
  { id: 'universities', label: 'For Universities', icon: Award },
  { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
  { id: 'billing', label: 'Pricing & Billing', icon: CreditCard },
  { id: 'regional', label: 'Cameroon Coverage', icon: MapPin },
];

const FAQS: FAQ[] = [
  // About MANTECH
  { category: 'about', q: 'What exactly is MANTECH Nexus?', a: 'MANTECH Nexus is Cameroon\'s national professional internship marketplace. It\'s a full digital pipeline connecting student and graduate interns with accredited enterprise hosts (telecom operators, banks, fintechs, engineering firms) and higher education institutions across all 10 administrative regions of Cameroon. It replaces the old process of scattered emails, WhatsApp chats, and paper tripartite conventions with a structured, verified, ACID-compliant data platform.' },
  { category: 'about', q: 'What makes MANTECH different from a general job board like LinkedIn or Glassdoor?', a: 'MANTECH is purpose-built for Cameroon\'s academic and professional internship ecosystem — not global job listings. It integrates the unique MINESUP tripartite convention requirement, verifies both interns and enterprises through a local compliance process, supports bilingual (French and English) academic frameworks, uses FCFA/XAF currency, and is designed around the real workflows of Cameroonian universities, ministries, telecoms, and banks.' },
  { category: 'about', q: 'Who owns MANTECH Nexus?', a: 'MANTECH Nexus is a privately owned Cameroonian platform. All operational data is managed under Cameroonian law and the platform adheres to MINESUP internship regulations and ANTIC data protection guidelines. Support is available via WhatsApp concierge (+237 650 921 917) and the official email.' },
  { category: 'about', q: 'In which language does MANTECH Nexus operate?', a: 'MANTECH Nexus supports both French and English to serve Cameroon\'s bilingual educational framework. Platform interfaces, academic fields, and institution references are designed to accommodate both francophone grandes écoles (IUT, ENSPY, UCAC, ESSEC) and anglophone universities (University of Buea, University of Bamenda, NAHPI).' },
  { category: 'about', q: 'How does the Intern Passport (InternID) work?', a: 'The Intern Passport is a verified professional profile that includes your academic qualification, institution, field, specialization, technical skills, certifications, and readiness score. It is automatically generated when you complete your profile. Accredited enterprise recruiters can discover your Intern Passport when you set your profile to discoverable. Your CV and phone number remain protected and are only accessed with platform-mediated authorization.' },

  // For Interns
  { category: 'interns', q: 'Is MANTECH Nexus free for students and intern candidates?', a: 'Yes — 100% free for students and graduate candidates at launch. There are no registration fees, no placement fees, and no hidden charges. Creating an Intern Passport, applying to published opportunities, and tracking your applications are all completely free. MANTECH generates revenue exclusively from accredited enterprise packages.' },
  { category: 'interns', q: 'What is the MANTECH Readiness Score and how is it calculated?', a: 'The Readiness Score (0–100) measures how complete, verified, and professional your Intern Passport is. It factors in: photo uploaded, phone number verified, CV uploaded, education details, professional field and specialization selected, skills listed, availability and work-mode set, and whether your profile has been recently updated. A score above 85 signals to recruiters that your profile is well-prepared. The score recalculates automatically when you update your profile.' },
  { category: 'interns', q: 'What professional fields can I find internships in on MANTECH?', a: 'MANTECH covers 10 professional categories: (1) Software & Cloud Engineering, (2) Cybersecurity & Networks, (3) Data Science & Artificial Intelligence, (4) Finance, Banking & Accounting, (5) Marketing & Growth, (6) Human Resources & Talent, (7) Supply Chain & Logistics, (8) Civil, Mechanical & Electrical Engineering, (9) Healthcare, Biotech & Pharmaceuticals, and (10) Corporate Law, Compliance & Governance. Each category has 4–5 deeper specializations.' },
  { category: 'interns', q: 'How does applying for an internship work on MANTECH?', a: 'Each opportunity uses one of three application methods configured by the host enterprise: (1) MANTECH-apply — you fill the application form inside the platform and track status in your dashboard. (2) Company Website — MANTECH records your intent and opens the company\'s official careers portal in a new tab. (3) External Platform — you\'re redirected to a third-party recruitment system (LinkedIn, a university portal, etc.) with the action logged in your MANTECH dashboard.' },
  { category: 'interns', q: 'Can I apply to internships while still a student before graduating?', a: 'Yes. MANTECH is designed for both active students (completing their BTS, Licence, Master, or Engineer programs) and recent graduates. You can set your current availability status and expected graduation date clearly in your Intern Passport. Many enterprises specifically seek final-year students for end-of-study internships leading to full-time positions.' },
  { category: 'interns', q: 'How do I know if an internship posting on MANTECH is legitimate?', a: 'Every enterprise on MANTECH undergoes a manual verification process before publishing opportunities. Verified organizations display a verification badge. Additionally, MANTECH never asks candidates to pay money for applications or placements. If you receive a message requesting fees, report it immediately using the built-in Report button or contact the WhatsApp concierge.' },
  { category: 'interns', q: 'Can international Cameroonian students diaspora use MANTECH?', a: 'Yes. Cameroonian students studying abroad can create an Intern Passport and apply to remote internships or mark their availability for a future return-to-Cameroon placement. Their international experience and qualifications are supported in the education history section.' },

  // For Employers
  { category: 'employers', q: 'How does an enterprise get verified on MANTECH?', a: 'An enterprise submits its company registration details, operational address, official website domain, and at least one authorized recruiter account. The MANTECH compliance team manually reviews the submission — typically within 24 business hours — and grants a verified status badge. Only verified organizations can publish opportunities and access the Intern Passport discovery engine.' },
  { category: 'employers', q: 'What packages are available for enterprises?', a: 'There are 4 tiers: (1) Free Starter — up to 2 opportunities, 15 candidate views/month, 1 recruiter seat. (2) Professional Recruiter (XAF 45,000/month) — 10 opportunities, unlimited discovery, 3 recruiter seats, interview scheduling. (3) Business Enterprise (XAF 120,000/month) — unlimited opportunities, unlimited CV access, 10 recruiter seats, featured listings, WhatsApp talent concierge. (4) Institutional Partner (XAF 250,000/semester) — dual-mode dashboard, 50+ recruiter accounts. All upgrades happen via WhatsApp concierge, never automated gateway.' },
  { category: 'employers', q: 'How does MANTECH protect CV and candidate data from unauthorized access?', a: 'CV access requires platform-mediated authorization. When a recruiter downloads a candidate\'s CV, MANTECH creates a time-limited, cryptographically signed download link and logs an audit event with the recruiter identity, timestamp, and purpose. Candidates can revoke CV searchability at any time through their settings. Candidate phone numbers are only revealed after formal platform-mediated contact authorization.' },
  { category: 'employers', q: 'Can we publish both paid and unpaid internship opportunities?', a: 'Yes. Opportunities can be configured as paid (with a listed stipend in XAF/FCFA), unpaid academic placements, or "indemnity-based" (transport and meal allowance only). MANTECH accurately represents the compensation model for each opportunity so candidates can make informed decisions before applying.' },

  // For Universities
  { category: 'universities', q: 'How does the MANTECH University Dashboard work?', a: 'Universities get a dual-mode dashboard. Mode A (Placement Coordination) — an authorized placement officer can monitor partner enterprise opportunities, curate lists for student cohorts, and track MANTECH-logged applications from registered students of that institution. Mode B (Recruiter) — universities can also post their own internship opportunities (research assistants, lab technicians, etc.) and recruit interns through the standard recruiter workflow. The two modes are permission-separated by role.' },
  { category: 'universities', q: 'Does MANTECH manage the MINESUP tripartite internship convention?', a: 'MANTECH facilitates the tripartite agreement workflow digitally. Enterprise hosts can generate placement confirmation documents, and universities can authenticate completion records through the platform. However, the final paper convention bearing all three signatures (intern, enterprise, academic supervisor) must still be physically signed and stamped per MINESUP regulations. MANTECH provides the digital administrative coordination layer.' },
  { category: 'universities', q: 'Which universities are already partnered with MANTECH?', a: 'MANTECH serves institutions across all 10 regions including University of Buea (FET), ENSPY Yaoundé, University of Yaoundé I & II, University of Douala (IUT), UCAC-ICAM, IUC, University of Bamenda (NAHPI), University of Dschang (FOTSO Victor), University of Ngaoundéré (ENSIR), and University of Maroua (ISS), among others. New academic partnerships are added continuously.' },

  // Security & Privacy
  { category: 'security', q: 'Does MANTECH sell or share user data with third parties?', a: 'No. MANTECH does not sell candidate data, recruiter data, or any platform activity telemetry to third parties. Data sharing is restricted to: (a) the specific recruiter authorized by the candidate through the platform\'s controlled CV access flow, and (b) MANTECH\'s own operational systems for delivering the service. MANTECH is designed in adherence to ANTIC Cameroon data protection guidelines.' },
  { category: 'security', q: 'What authentication and authorization architecture protects the platform?', a: 'MANTECH uses Clerk for cryptographic session management (zero-knowledge on our side), server-side role-based access control enforced at both middleware and PostgreSQL row-level security layers, strict organization tenant isolation, high-entropy UUID anti-enumeration, Content Security Policy headers, and tamper-evident audit logging. There is no client-side security reliance — the server is the final authority on all access decisions.' },
  { category: 'security', q: 'Can I delete my account and have my data removed?', a: 'Yes. Registered users can request account deletion through the Settings section of their dashboard. Upon deletion, personal profile data, CVs, and applications are removed from active records. Anonymized audit log entries are retained for 90 days for operational security purposes, then purged.' },

  // Billing
  { category: 'billing', q: 'Why doesn\'t MANTECH use online payment gateways like PayPal or Stripe?', a: 'Cameroon\'s commercial practices strongly favor human-mediated business relationships for enterprise software subscriptions. Per the MANTECH SRS specification, all commercial upgrades happen through the WhatsApp concierge using Cameroon Mobile Money (MTN MoMo or Orange Money) or bank transfer to MANTECH\'s official account. This eliminates cross-border payment friction and builds trusted relationships with enterprise clients.' },
  { category: 'billing', q: 'How quickly is a subscription activated after payment?', a: 'Once the MANTECH finance team confirms mobile money or bank transfer receipt, the subscription is activated manually in the Admin dashboard — typically within 4 business hours of confirmed payment. You\'ll receive a WhatsApp notification with your updated account limits.' },

  // Regional
  { category: 'regional', q: 'Does MANTECH cover all 10 regions of Cameroon equally?', a: 'MANTECH serves all 10 regions: Centre (Yaoundé), Littoral (Douala), South-West (Buea, Limbe), West (Bafoussam, Dschang), North-West (Bamenda), Adamawa (Ngaoundéré), Far North (Maroua), North (Garoua), East (Bertoua), and South (Ebolowa, Kribi). Enterprise and academic coverage is densest in Douala and Yaoundé, with active expansion into Buea, Bamenda, Dschang, and Ngaoundéré.' },
  { category: 'regional', q: 'Can remote and hybrid internships be posted on MANTECH?', a: 'Yes. Each opportunity specifies its work mode: Onsite, Remote, or Hybrid. Remote internships — especially in software engineering, data science, cybersecurity, and digital marketing — are fully supported. Location filters allow candidates to find remote opportunities regardless of which Cameroon city they\'re in.' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = FAQS.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="overflow-hidden bg-[#070d18] min-h-screen text-slate-100">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "url('/images/amber_tech_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#070d18]/95 via-[#0a1422]/90 to-[#070d18]/95" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/12 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/12 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
              <HelpCircle className="w-4 h-4" /> Knowledge Base · 26 Verified Answers
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mt-2">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Detailed answers for interns, enterprise recruiters, university coordinators, and curious visitors about how MANTECH Nexus works in Cameroon.
            </p>

            {/* Search */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions... (e.g. CV access, pricing, regions)"
                className="w-full h-13 pl-12 pr-4 py-3.5 rounded-2xl border border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all backdrop-blur-md shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="py-16 relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Sidebar Category Nav */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Filter by Topic</p>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setOpenItem(null); }}
                      className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                          : 'border border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {cat.label}
                      <span className="ml-auto text-[10px] opacity-60">
                        {FAQS.filter((f) => cat.id === 'all' ? true : f.category === cat.id).length}
                      </span>
                    </button>
                  );
                })}

                {/* WhatsApp CTA */}
                <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4">
                  <p className="text-xs font-bold text-emerald-300">Still have questions?</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Chat with a MANTECH advisor in under 15 minutes.
                  </p>
                  <a
                    href={waSupportLink('Hello MANTECH, I have a question from the FAQ page.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-bold text-white text-center transition-all"
                  >
                    WhatsApp Concierge →
                  </a>
                </div>
              </div>
            </aside>

            {/* FAQ Accordion Column */}
            <div className="lg:col-span-9">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Showing <strong className="text-white">{filtered.length}</strong> of{' '}
                  <strong className="text-white">{FAQS.length}</strong> questions
                </span>
                {(activeCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); setOpenItem(null); }}
                    className="text-amber-400 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                  <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <h3 className="font-heading text-lg font-bold text-white">No matching questions</h3>
                  <p className="text-xs text-slate-400 mt-1">Try searching with broader keywords.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((faq, idx) => {
                    const isOpen = openItem === idx;
                    const catData = CATEGORIES.find((c) => c.id === faq.category);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: (idx % 8) * 0.03 }}
                      >
                        <div
                          className={`rounded-2xl border overflow-hidden transition-colors ${
                            isOpen
                              ? 'border-amber-500/40 bg-amber-950/20'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenItem(isOpen ? null : idx)}
                            className="w-full text-left flex items-start justify-between gap-4 p-5"
                          >
                            <div className="flex items-start gap-3">
                              {catData && (
                                <catData.icon className={`w-4 h-4 shrink-0 mt-0.5 ${isOpen ? 'text-amber-400' : 'text-slate-400'}`} />
                              )}
                              <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${isOpen ? 'text-amber-200' : 'text-white'}`}>
                                {faq.q}
                              </span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 shrink-0 text-amber-400 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4"
                              >
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 border-t border-slate-800/80">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900/90 via-slate-850/80 to-amber-950/30 p-8 sm:p-12">
            <MessageCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Answer Not Here? Ask Us Directly
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto">
              Our WhatsApp Concierge team answers within 15 minutes during business hours. For formal written inquiries, use our contact form.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={waSupportLink('Hello MANTECH, I have a question that was not in the FAQ.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Concierge
              </a>
              <Link href="/contact">
                <button className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all">
                  Contact Page
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
