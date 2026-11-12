"use client";
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import type { MessageDescriptor } from '@lingui/core';
import { useFormatters } from '@/i18n/format';


import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LocaleLink as Link } from '@/components/shared/locale-link';
import Image from "next/image";
import { useRouter } from '@/i18n/navigation.hooks';
import {
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
  Play,
  Plus,
  Zap,
  Lock,
  FileCheck2,
  Clock,
  Compass,
  Award,
  ChevronRight,
  Search,
  MapPin,
  QrCode,
  HelpCircle,
  Quote,
  Building,
  Check,
  SlidersHorizontal,
  Laptop,
  Cpu,
  Code2,
  Shield,
  Network,
  Database,
  LineChart,
  Smartphone,
  Layers,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MotionSection,
  MotionItem,
  FadeIn,
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  StatReveal,
} from "@/components/shared/section-animations";
import type { InternshipOpportunity } from "@/lib/types";
import { fieldNameOf, regionNameOf } from "@/lib/catalog-shape";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  waAlertSubscribeLink,
  waCompanySalesLink,
  waSupportLink,
} from "@/lib/whatsapp";
import { DashboardShowcase } from "@/components/home/dashboard-showcase";
import { TestimonialSubmissionModal } from "@/components/home/testimonial-submission-modal";
import { OrgLogo } from "@/components/shared/org-logo";
import { TOP_30_COMPANIES, TOP_30_UNIVERSITIES, VERIFIED_COMMUNITY_STORIES } from "@/lib/cameroon-directory";
import { APP_CONFIG } from "@/lib/config";

interface TaxonomyField {
  id: string;
  name: string | MessageDescriptor;
  slug: string;
  category?: string;
  description?: string | MessageDescriptor;
}

interface TaxonomyRegion {
  id: string;
  name: string | MessageDescriptor;
  code: string;
  capital: string | MessageDescriptor;
  fallbackKey?: string;
}

interface VerifiedOrganization {
  id: string;
  name: string;
  slug: string;
  type: string;
  city?: string;
  region?: { name: string };
  industry?: { name: string };
  description?: string;
  logoUrl?: string;
  website?: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  region: string;
  focus: string;
  message: string;
  details: string;
  rating: number;
  photoUrl?: string | null;
}

export interface FaqItem {
  id: string;
  category: "all" | "interns" | "recruiters" | "universities" | "trust";
  categoryName: MessageDescriptor;
  badge: MessageDescriptor;
  q: MessageDescriptor;
  a: MessageDescriptor;
  takeaway: MessageDescriptor;
}

const FAQ_CATEGORIES = [
  { id: "all", label: msg({ message: "All Questions", comment: 'Category filter label above the homepage FAQ list' }), count: 16 },
  { id: "interns", label: msg({ message: "Students & Interns", comment: 'Category filter label above the homepage FAQ list' }), count: 5 },
  { id: "recruiters", label: msg({ message: "Companies & Hosts", comment: 'Category filter label above the homepage FAQ list' }), count: 4 },
  { id: "universities", label: msg({ message: "Universities & Conventions", comment: 'Category filter label above the homepage FAQ list' }), count: 3 },
  { id: "trust", label: msg({ message: "Security & Free Access", comment: 'Category filter label above the homepage FAQ list' }), count: 4 },
] as const;

const EXPANDED_FAQS: FaqItem[] = [
  {
    id: "faq-free",
    category: "interns",
    categoryName: msg({ message: "Candidate Access", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "100% Free Forever", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Is MANTECH Nexus free for internship and job seekers?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Yes, absolutely! Intern registration, profile creation, Intern Passport generation, opportunity search, and applications are 100% free for all students, graduates, and internship seekers across Cameroon. No subscription fees, listing fees, or application charges are ever billed to candidates.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Students never pay a single Franc CFA — all features and placement tools are 100% free.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-passport",
    category: "interns",
    categoryName: msg({ message: "Credential Verification", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Verifiable Credential", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "What is the Intern Passport and how is it verified?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "The Intern Passport is your cryptographically identifiable professional discovery credential on MANTECH Nexus. Each passport receives a unique verification identifier (e.g. MN-LT-2026-XXXX). Verified host enterprises and universities can inspect validated competencies, academic achievements, and authorized credentials with strict zero-trust privacy controls.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Your phone number and private contact details remain protected until you authorize disclosure.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-methods",
    category: "interns",
    categoryName: msg({ message: "Application Pathways", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "3 Pathways", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "What are the 3 application methods supported on the platform?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Opportunities support three structured pathways: (1) Direct Application on MANTECH Nexus with your Intern Passport, (2) Direct redirection to official company career portals with tracked analytics, and (3) Accredited external portals (such as corporate recruitment portals or university partner hubs).", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Every application status is tracked in real time from submission to interview decision.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-readiness",
    category: "interns",
    categoryName: msg({ message: "Profile Readiness", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Algorithmic Score", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "How does the profile readiness score work and how do I reach 100%?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "The readiness score algorithm measures completeness across five core pillars: primary contact verification, validated academic degree, structured CV upload, declared target professional role, and selected skills across 60 professional domains. Completing these milestones elevates your profile to top recruiter rankings.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Profiles above 85% readiness receive 4x more interview invitations from verified hosts.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-whatsapp-alerts",
    category: "interns",
    categoryName: msg({ message: "Real-Time Alerts", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "WhatsApp Priority", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "How do instant WhatsApp job and internship alerts work?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Because WhatsApp is the primary communication network in Cameroon, MANTECH Nexus integrates direct WhatsApp alert broadcasts. Once subscribed, you receive instant mobile pings when an opportunity in your discipline or region is approved, allowing you to be among the first applicants.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Direct mobile pings ensure you never miss time-sensitive corporate application deadlines.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-recruiters",
    category: "recruiters",
    categoryName: msg({ message: "Recruitment Workflow", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Vetted Host Hub", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "How do verified companies and host enterprises recruit on MANTECH?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Organizations submit legal business credentials for accreditation. Once verified by our moderation team, recruiters can post openings across 60 professional fields, search candidate portfolios, inspect authorized academic credentials, coordinate interview rounds, and issue digital offers with zero spam.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Eliminates unvetted inbox spam and delivers pre-screened, authentic Cameroonian talent.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-free-packages",
    category: "recruiters",
    categoryName: msg({ message: "100% Free Launch", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "0 FCFA Access", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Are company and university recruitment packages really 100% free right now?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Yes! During this open launch phase, all organizational plans (including Enterprise and Institutional access) are 0 FCFA. Companies and universities enjoy unlimited job and internship postings, unrestricted talent searches, and full team access without any payment barriers.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Zero financial friction: start recruiting top students and graduates today at zero cost.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-jobs-equality",
    category: "recruiters",
    categoryName: msg({ message: "Jobs & Internships", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Full Parity", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Can employers post full-time permanent jobs as well as internships?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Yes, absolutely! Jobs and internships enjoy complete parity on MANTECH Nexus. Recruiters can publish full-time positions, entry-level contracts, apprenticeships, and specialized internships with dedicated salary ranges and work mode options (onsite, hybrid, remote).", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "One centralized hub for both academic student internships and graduate employment.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-candidate-privacy",
    category: "recruiters",
    categoryName: msg({ message: "Privacy & Compliance", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Zero-Trust Privacy", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "How does the platform safeguard candidate privacy during talent discovery?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Candidates' private phone numbers and personal emails are hidden by default. Recruiters review authenticated qualifications, universities, and readiness metrics, then initiate a formal Contact Request. Direct contact information is released only when the candidate accepts.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Respects candidate confidentiality while ensuring only verified employers initiate contact.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-universities",
    category: "universities",
    categoryName: msg({ message: "Academic Partnerships", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Tripartite Oversight", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Can universities supervise and track student internships digitally?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Yes! Academic departments and university placement coordinators have a dedicated portal to supervise tripartite internship conventions, assign faculty mentors, review student progress logbooks, and authenticate institutional completion attestations.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Eliminates physical paperwork and provides full academic oversight across every cohort.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-dual-mode",
    category: "universities",
    categoryName: msg({ message: "University Dual-Mode", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Mode A & Mode B", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "What is the university dual-mode operational capability?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Universities operate in two distinct modes: Mode A (Placement Assistance) helps students secure external corporate internships with partner enterprises; Mode B (Direct Campus Recruiting) allows internal university faculties, research labs, and IT divisions to recruit student interns directly.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Flexibility for higher education institutions to act as placement facilitators and internal employers.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-regions",
    category: "universities",
    categoryName: msg({ message: "National Coverage", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "All 10 Regions", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Are institutions across all 10 regions of Cameroon represented?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Yes. From state universities (UY1, UY2, Douala, Buea, Bamenda, Dschang, Ngaoundéré, Maroua, Bertoua, Ebolowa) to prestigious Grandes Écoles (ENSPY, NAHPI, IUTs, ENS) and accredited private universities (UCAC, IUC, Siantou, Saint Jérôme, PKFokam), our network covers the entire nation.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Equal digital access to opportunities for students in every region from the Far North to the South.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-data-security",
    category: "trust",
    categoryName: msg({ message: "Platform Security", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "ACID Security", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "How is user and organizational data protected on MANTECH Nexus?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "The system is built on an enterprise ACID relational architecture with encrypted database storage, HTTPS/TLS 1.3 protocol enforcement, zero stored credit card numbers, and strict role-based access controls adhering to national and international data privacy best practices.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Bank-grade data isolation ensuring candidate records and corporate postings remain confidential.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-whatsapp-primary",
    category: "trust",
    categoryName: msg({ message: "Communication Channel", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "WhatsApp-First", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Why does MANTECH Nexus prioritize WhatsApp over traditional email?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "In Cameroon, mobile internet and WhatsApp have over 98% daily active usage compared to email check-in frequencies. WhatsApp communication ensures instant notification of interviews, application updates, and direct coordination with our support concierge.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Guarantees rapid response times and eliminates lost emails or ignored spam folders.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-moderation",
    category: "trust",
    categoryName: msg({ message: "Scam Prevention", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "100% Vetted Listings", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "How does MANTECH prevent fake job postings and recruitment scams?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Every single opportunity and host enterprise undergoes manual verification by MANTECH administrators before appearing on the public marketplace. We verify company tax numbers, physical premises, and official domains to ensure students are completely protected.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Strict zero-tolerance policy against fake recruiters, application fees, or unaccredited listings.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
  {
    id: "faq-feedback",
    category: "trust",
    categoryName: msg({ message: "Community Voice", comment: 'Category label on a homepage FAQ answer' }),
    badge: msg({ message: "Open Reviews", comment: 'Short badge on a homepage FAQ answer' }),
    q: msg({ message: "Can students, recruiters, and academic coordinators submit feedback and testimonials?", comment: 'Question in the homepage frequently asked questions' }),
    a: msg({ message: "Yes! Any visitor, student, or recruiter can share their placement story directly through the community testimonial submission form on the homepage and `/testimonials` page. Approved reviews appear publicly to inspire future cohorts.", comment: 'Answer in the homepage frequently asked questions' }),
    takeaway: msg({ message: "Transparent community reviews that celebrate authentic placement outcomes across Cameroon.", comment: 'Key takeaway below a homepage FAQ answer' }),
  },
];

export default function HomePage() {
  const { t } = useLingui();
  const f = useFormatters();
  const router = useRouter();

  const [stats, setStats] = useState({
    activeInternships: 0,
    partnerCompanies: 0,
    partnerUniversities: 0,
    studentsPlaced: 0,
  });

  const [featuredInternships, setFeaturedInternships] = useState<
    InternshipOpportunity[]
  >([]);
  const [packages, setPackages] = useState<
    {
      name: string;
      code: string;
      priceXAF: number;
      description: string;
      features: string[];
    }[]
  >([]);
  const [fields, setFields] = useState<TaxonomyField[]>([]);
  const [regions, setRegions] = useState<TaxonomyRegion[]>([]);
  const [companies, setCompanies] = useState<VerifiedOrganization[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const fallbackTestimonials = useCallback(() => VERIFIED_COMMUNITY_STORIES.map((story) => ({
    ...story,
    role: t(story.role),
    focus: t(story.focus),
    message: t(story.message),
    details: t(story.details),
  })), [t]);

  // Hero search form state
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [heroSelectedField, setHeroSelectedField] = useState("all");
  const [heroSelectedRegion, setHeroSelectedRegion] = useState("all");

  // FAQ section interactive state
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearch, setFaqSearch] = useState<string>("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearchQuery.trim()) params.set("search", heroSearchQuery.trim());
    if (heroSelectedField !== "all") params.set("field", heroSelectedField);
    if (heroSelectedRegion !== "all") params.set("region", heroSelectedRegion);
    router.push(`/internships?${params.toString()}`);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [
          statsRes,
          opportunitiesRes,
          taxonomyRes,
          companiesRes,
          testimonialsRes,
          jobsRes,
          universitiesRes,
          peopleRes,
        ] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/internships?limit=40"),
          fetch("/api/taxonomy"),
          fetch("/api/companies?limit=30"),
          fetch("/api/testimonials"),
          fetch("/api/jobs?limit=30"),
          fetch("/api/universities?limit=30"),
          fetch("/api/people?limit=30"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (opportunitiesRes.ok) {
          const opportunitiesData = await opportunitiesRes.json();
          setFeaturedInternships(
            (opportunitiesData.internships || []).slice(0, 20),
          );
        }

        if (taxonomyRes.ok) {
          const taxonomyData = await taxonomyRes.json();
          setPackages(
            (taxonomyData.packages || []).map((p: Record<string, unknown>) => ({
              name: String(p.name),
              code: String(p.code),
              priceXAF: Number(p.priceXAF) || 0,
              description: String(p.description || ""),
              features: Array.isArray(p.features)
                ? (p.features as string[])
                : [],
            })),
          );
          if (Array.isArray(taxonomyData.fields)) {
            setFields(taxonomyData.fields);
          }
          if (Array.isArray(taxonomyData.regions)) {
            setRegions(taxonomyData.regions);
          }
        }

        if (companiesRes.ok) {
          const compData = await companiesRes.json();
          const list = (compData.companies || []);
          setCompanies(
            (list.length >= 30 ? list.slice(0, 30) : [...list, ...TOP_30_COMPANIES.slice(list.length)].slice(0, 30)) as unknown as VerifiedOrganization[],
          );
        } else {
          setCompanies(TOP_30_COMPANIES as unknown as VerifiedOrganization[]);
        }

        if (testimonialsRes.ok) {
          const testData = await testimonialsRes.json();
          const list = (testData.testimonials || []);
          setTestimonials(
            (list.length > 0 ? list : fallbackTestimonials()) as unknown as TestimonialItem[],
          );
        } else {
          setTestimonials(fallbackTestimonials() as unknown as TestimonialItem[]);
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setFeaturedJobs((jobsData.jobs || []).slice(0, 30));
        }

        if (universitiesRes.ok) {
          const uniData = await universitiesRes.json();
          const list = (uniData.universities || []);
          setUniversities(
            (list.length >= 30 ? list.slice(0, 30) : [...list, ...TOP_30_UNIVERSITIES.slice(list.length)].slice(0, 30)),
          );
        } else {
          setUniversities(TOP_30_UNIVERSITIES);
        }

        if (peopleRes.ok) {
          const peopleData = await peopleRes.json();
          setPeople((peopleData.people || []).slice(0, 30));
        }
      } catch (e) {
        console.error("Failed loading live homepage data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [fallbackTestimonials]);

  const statsList = [
    {
      value: f.number(stats.activeInternships),
      label: msg({ message: "Live Opportunities", comment: 'Label for a live homepage marketplace statistic' }),
      icon: Briefcase,
    },
    {
      value: f.number(stats.partnerCompanies),
      label: msg({ message: "Verified Enterprises", comment: 'Label for a live homepage marketplace statistic' }),
      icon: Building2,
    },
    {
      value: f.number(stats.partnerUniversities),
      label: msg({ message: "Verified Institutions", comment: 'Label for a live homepage marketplace statistic' }),
      icon: GraduationCap,
    },
    {
      value: f.number(stats.studentsPlaced),
      label: msg({ message: "Placed Interns", comment: 'Label for a live homepage marketplace statistic' }),
      icon: Users,
    },
  ];

  const lifecycleSteps = [
    {
      num: "01",
      title: msg({ message: "Discovery & Match", comment: 'Homepage internship journey or service card heading' }),
      desc: msg({ message: "Curated professional opportunities tailored to Cameroon curriculum with algorithmic readiness scoring and field-aware matching.", comment: 'Description of a homepage internship journey step' }),
    },
    {
      num: "02",
      title: msg({ message: "Verified Application", comment: 'Homepage internship journey or service card heading' }),
      desc: msg({ message: "Cryptographically secured applications submitted directly or through tracked redirects to enterprise hiring portals.", comment: 'Description of a homepage internship journey step' }),
    },
    {
      num: "03",
      title: msg({ message: "Review & Interview", comment: 'Homepage internship journey or service card heading' }),
      desc: msg({ message: "Enterprise interview scheduling, multi-stage status tracking, and candidate shortlisting with instant applicant notifications.", comment: 'Description of a homepage internship journey step' }),
    },
    {
      num: "04",
      title: msg({ message: "Selection & Placement", comment: 'Homepage internship journey or service card heading' }),
      desc: msg({ message: "Tripartite alignment between Student, Company, and University with structured onboarding objectives and milestones.", comment: 'Description of a homepage internship journey step' }),
    },
    {
      num: "05",
      title: msg({ message: "Active Follow-Up", comment: 'Homepage internship journey or service card heading' }),
      desc: msg({ message: "Placement health monitoring, structured check-ins, recruitment analytics, and permitted status updates throughout the internship.", comment: 'Description of a homepage internship journey step' }),
    },
    {
      num: "06",
      title: msg({ message: "Intern Passport", comment: 'Homepage internship journey or service card heading' }),
      desc: msg({ message: "Tamper-proof verifiable digital credentials showcasing validated competencies, placements, and verified organization endorsements.", comment: 'Description of a homepage internship journey step' }),
    },
  ];

  const services = [
    {
      icon: GraduationCap,
      title: msg({ message: "Interns & Internship Seekers", comment: 'Homepage internship journey or service card heading' }),
      description: msg({ message: "Discover verified internships across every professional field, manage applications and interviews, and earn a cryptographically verified Intern Passport.", comment: 'Description of a service card on the homepage' }),
      features: [
        msg({ message: "Curated search across 10 Cameroon regions", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Automated readiness score calculator", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Application pipeline & interview tracking", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Permanent verifiable Intern Passport", comment: 'Feature listed on a homepage service card' }),
      ],
      color: "from-blue-600 to-indigo-700",
      href: "/internships",
    },
    {
      icon: Building2,
      title: msg({ message: "Host Enterprises", comment: 'Homepage internship journey or service card heading' }),
      description: msg({ message: "Post openings, manage applicant stages with precision, conduct structured technical reviews, and track recruitment pipeline effortlessly.", comment: 'Description of a service card on the homepage' }),
      features: [
        msg({ message: "Targeted talent sourcing by field & skill", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Candidate review & shortlisting pipeline", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Interview scheduling & placement tracking", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Multi-tenant organizational security", comment: 'Feature listed on a homepage service card' }),
      ],
      color: "from-amber-600 to-orange-700",
      href: "/companies",
    },
    {
      icon: Users,
      title: msg({ message: "Universities & Institutions", comment: 'Homepage internship journey or service card heading' }),
      description: msg({ message: "Support internship placement coordination and recruit interns through a separate, permission-controlled recruiter mode.", comment: 'Description of a service card on the homepage' }),
      features: [
        msg({ message: "Placement cohort tracking & outcomes", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Partner company network coordination", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Private, professional Intern Passport", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Accredited university verification badge", comment: 'Feature listed on a homepage service card' }),
      ],
      color: "from-emerald-600 to-teal-700",
      href: "/universities",
    },
    {
      icon: Award,
      title: msg({ message: "MANTECH Talent Services", comment: 'Homepage internship journey or service card heading' }),
      description: msg({ message: "Dedicated marketplace support, priority assistance for verified organizations, package concierge, and featured recruitment promotions.", comment: 'Description of a service card on the homepage' }),
      features: [
        msg({ message: "Priority placement support", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Featured opportunity promotions", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "WhatsApp concierge for packages", comment: 'Feature listed on a homepage service card' }),
        msg({ message: "Full-platform audit & analytics", comment: 'Feature listed on a homepage service card' }),
      ],
      color: "from-purple-600 to-violet-700",
      href: "/pricing",
    },
  ];

  // Fallback fields if database is cold
  const displayFields =
    fields.length > 0
      ? fields.slice(0, 8)
      : [
        { id: "f1", name: msg({ message: "Software & Web Development", comment: "Fallback professional field shown on the homepage" }), slug: "software-development" },
        { id: "f2", name: msg({ message: "Networks & Cybersecurity", comment: "Fallback professional field shown on the homepage" }), slug: "network-systems" },
        { id: "f3", name: msg({ message: "Accounting & Finance", comment: "Fallback professional field shown on the homepage" }), slug: "accounting-finance" },
        { id: "f4", name: msg({ message: "Digital Marketing & Sales", comment: "Fallback professional field shown on the homepage" }), slug: "marketing" },
        { id: "f5", name: msg({ message: "Data Science & AI", comment: "Fallback professional field shown on the homepage" }), slug: "data-ai" },
        { id: "f6", name: msg({ message: "Civil & Industrial Engineering", comment: "Fallback professional field shown on the homepage" }), slug: "engineering" },
        { id: "f7", name: msg({ message: "Law & Business Compliance", comment: "Fallback professional field shown on the homepage" }), slug: "law" },
        { id: "f8", name: msg({ message: "Healthcare & Biomedical", comment: "Fallback professional field shown on the homepage" }), slug: "health" },
      ];

  // Fallback regions for explorer
  const displayRegions =
    regions.length > 0
      ? regions.slice(0, 6)
      : [
        { id: "r1", name: msg({ message: "Littoral", comment: "Fallback Cameroon region name in the homepage explorer" }), fallbackKey: "Littoral", code: "CM-LT", capital: msg({ message: "Douala", comment: "Capital city shown under the fallback Littoral region" }) },
        { id: "r2", name: msg({ message: "Centre", comment: "Fallback Cameroon region name in the homepage explorer" }), fallbackKey: "Centre", code: "CM-CE", capital: msg({ message: "Yaoundé", comment: "Capital city shown under the fallback Centre region" }) },
        { id: "r3", name: msg({ message: "South-West", comment: "Fallback Cameroon region name in the homepage explorer" }), fallbackKey: "South-West", code: "CM-SW", capital: msg({ message: "Buea", comment: "Capital city shown under the fallback South-West region" }) },
        { id: "r4", name: msg({ message: "West", comment: "Fallback Cameroon region name in the homepage explorer" }), fallbackKey: "West", code: "CM-OU", capital: msg({ message: "Bafoussam", comment: "Capital city shown under the fallback West region" }) },
        { id: "r5", name: msg({ message: "North-West", comment: "Fallback Cameroon region name in the homepage explorer" }), fallbackKey: "North-West", code: "CM-NW", capital: msg({ message: "Bamenda", comment: "Capital city shown under the fallback North-West region" }) },
        { id: "r6", name: msg({ message: "North", comment: "Fallback Cameroon region name in the homepage explorer" }), fallbackKey: "North", code: "CM-NO", capital: msg({ message: "Garoua", comment: "Capital city shown under the fallback North region" }) },
      ];

  return (
    <div className="overflow-hidden">
      {/* --- HERO SECTION (With background image + live search + mini preview) --- */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Professional Background Image with dark enterprise overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_tech_bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/85" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          {/* Subtle tech grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #4f6cff 1px, transparent 1px), linear-gradient(to bottom, #4f6cff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Headline, Live Search & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <Trans comment="page div visible text">Live Cameroon Professional Internship Ecosystem
              </Trans></div>

              <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
                <Trans comment="page h1 visible text">Cameroon&apos;s</Trans>{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  <Trans comment="page span visible text">Enterprise
                </Trans></span>{" "}
                <Trans comment="page h1 visible text">Internship Marketplace
              </Trans></h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl">
                <Trans comment="page p visible text">Connecting students, institutions, and verified enterprises across
                all 10 regions. Empowering talent discovery with our verifiable
                digital </Trans><strong><Trans comment="page strong visible text">Intern Passport</Trans></strong>{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"."}</p>

              {/* SRS §20: Internship Search Inside Hero */}
              <form
                onSubmit={handleHeroSearch}
                className="mt-8 rounded-2xl bg-slate-900/90 p-3 sm:p-4 border border-slate-700/80 backdrop-blur-xl shadow-2xl space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="relative sm:col-span-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <Input
                      type="text"
                      placeholder={t({ message: "Role, skill, keywords...", comment: "page component placeholder attribute" })}
                      value={heroSearchQuery}
                      onChange={(e) => setHeroSearchQuery(e.target.value)}
                      className="pl-9 h-10 bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 text-xs"
                    />
                  </div>

                  <select
                    value={heroSelectedField}
                    onChange={(e) => setHeroSelectedField(e.target.value)}
                    className="h-10 px-3 rounded-md bg-slate-800/90 border border-slate-700 text-white text-xs w-full"
                    aria-label={t({ message: "Select Professional Field", comment: "page component aria-label attribute" })}
                  >
                    <option value="all"><Trans comment="page option visible text">All Fields</Trans></option>
                    {displayFields.map((f) => (
                      <option key={f.id} value={typeof f.name === 'string' ? f.name : t(f.name)}>
                        {typeof f.name === 'string' ? f.name : t(f.name)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={heroSelectedRegion}
                    onChange={(e) => setHeroSelectedRegion(e.target.value)}
                    className="h-10 px-3 rounded-md bg-slate-800/90 border border-slate-700 text-white text-xs w-full"
                    aria-label={t({ message: "Select Region", comment: "page component aria-label attribute" })}
                  >
                    <option value="all"><Trans comment="page option visible text">All Regions</Trans></option>
                    {displayRegions.map((r) => (
                      <option key={r.id} value={typeof r.name === 'string' ? r.name : t(r.name)}>
                        {typeof r.name === 'string' ? r.name : t(r.name)} ({typeof r.capital === 'string' ? r.capital : t(r.capital)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    <Trans comment="page span visible text">Explore across IT, Engineering, Finance, Law & Healthcare
                  </Trans></span>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 ml-auto"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span><Trans comment="page span visible text">Search Internships</Trans></span>
                  </Button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/internships">
                  <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]">
                    <Trans comment="page Button visible text">Browse All Openings
                    </Trans><ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <a
                  href={waAlertSubscribeLink({})}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02]">
                    <WhatsAppIcon className="mr-2 h-4 w-4 text-white" />
                    <Trans comment="page Button visible text">WhatsApp Job Alerts
                  </Trans></Button>
                </a>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="h-11 px-6 border-slate-600 text-slate-200 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-slate-400 font-medium text-xs"
                  >
                    <Play className="mr-2 h-3.5 w-3.5 text-cyan-400" />
                    <Trans comment="page Button visible text">Enter Portal
                  </Trans></Button>
                </Link>
              </div>

              {/* WhatsApp-primary helper line */}
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300/90">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  <Trans comment="page span visible text">Receive live alerts directly on WhatsApp — fast, convenient, and free.
                </Trans></span>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-300/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span><Trans comment="page span visible text">Zero-Trust Identity Shield</Trans></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span><Trans comment="page span visible text">ACID Relational Core</Trans></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-400" />
                  <span><Trans comment="page span visible text">All 10 Cameroon Regions</Trans></span>
                </div>
              </div>
            </motion.div>

            {/* Right: Preserved Mini Representative Website Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-white/15 bg-slate-900/80 backdrop-blur-xl p-1.5 shadow-2xl shadow-blue-950/80">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <div className="ml-3 flex-1 h-5 rounded-md bg-white/10 text-[10px] text-slate-300 flex items-center px-2.5 font-mono">
                    <Trans comment="page div visible text">https://app.mantech-nexus.cm/dashboard/intern
                  </Trans></div>
                </div>

                {/* Dashboard inner */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        <Trans comment="page div visible text">MN
                      </Trans></div>
                      <div>
                        <div className="text-xs text-white font-semibold">
                          <Trans comment="page div visible text">Intern profile preview
                        </Trans></div>
                        <div className="text-[10px] text-slate-400">
                          <Trans comment="page div visible text">BSc Software Engineering • UY1
                        </Trans></div>
                      </div>
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      <Trans comment="page div visible text">Privacy controlled
                    </Trans></div>
                  </div>

                  {/* Placement card */}
                  <div className="rounded-xl bg-blue-600/15 border border-blue-500/30 p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">
                        <Trans comment="page span visible text">Professional Profile
                      </Trans></span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        <Trans comment="page span visible text">Profile visibility: verified
                      </Trans></span>
                    </div>
                    <div className="text-xs text-white font-bold">
                      <Trans comment="page div visible text">Qualification, field, and skills
                    </Trans></div>
                    <div className="text-[10px] text-slate-300">
                      <Trans comment="page div visible text">Location and internship preferences
                    </Trans></div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span><Trans comment="page span visible text">CV access is separately authorized</Trans></span>
                      <span className="font-mono text-cyan-300">
                        <Trans comment="page span visible text">85% Ready
                      </Trans></span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                      <div className="text-base font-extrabold text-white font-mono">
                        {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"32"}</div>
                      <div className="text-[9px] text-slate-400">
                        <Trans comment="page div visible text">Profile views
                      </Trans></div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                      <div className="text-base font-extrabold text-amber-400 font-mono">
                        {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"18"}</div>
                      <div className="text-[9px] text-slate-400"><Trans comment="page div visible text">CV access</Trans></div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                      <div className="text-base font-extrabold text-emerald-400 font-mono">
                        {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"12"}</div>
                      <div className="text-[9px] text-slate-400">
                        <Trans comment="page div visible text">Shortlisted
                      </Trans></div>
                    </div>
                  </div>

                  {/* Intern Passport CTA */}
                  <Link href="/dashboard/intern/passport" className="block">
                    <div className="rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-amber-500/40 p-3 flex items-center justify-between hover:bg-amber-500/25 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="text-xs text-amber-300 font-bold">
                            <Trans comment="page div visible text">Intern Passport
                          </Trans></div>
                          <div className="text-[10px] text-slate-300">
                            <Trans comment="page div visible text">Permanent verifiable credential
                          </Trans></div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                        <Trans comment="page span visible text">View Passport
                      </Trans></span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Floating notification cards */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-12 -right-5 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 px-4 py-2.5 flex items-center gap-2.5 z-20"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold">
                    <Trans comment="page div visible text">Verified organization access
                  </Trans></div>
                  <div className="text-[9px] text-slate-500">
                    <Trans comment="page div visible text">MANTECH Support • Live Sync
                  </Trans></div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Real Live Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-white/10 pt-10">
            {statsList.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                        {s.value}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {t(s.label)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SRS §20: FEATURED VERIFIED ORGANIZATIONS FROM DATABASE --- */}
      <section className="py-24 bg-[#080d1a] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Subtle background image & atmospheric lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/company_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/95 via-[#080d1a]/90 to-[#080d1a] pointer-events-none" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-300 tracking-wide mb-3">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span><Trans comment="page span visible text">Accredited Employer Network</Trans></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-blue-300 uppercase"><Trans comment="page span visible text">MINESUP & MINPOSTEL Aligned</Trans></span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                <Trans comment="page h2 visible text">Verified Host Enterprises & Academic Partners
              </Trans></h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                <Trans comment="page p visible text">Accredited institutions actively screening technical competencies, evaluating candidates through verified Intern Passports, and hosting placements across Cameroon.
              </Trans></p>
            </div>
            <Link href="/companies">
              <Button
                variant="outline"
                className="text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-sm transition-all hover:border-blue-400 gap-1.5"
              >
                <Trans comment="page Button visible text">Explore All Organizations
                </Trans><ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </FadeIn>

          {/* Trust Telemetry Ribbon */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Active Host Organizations", val: "240+", icon: Building2 },
              { label: "Manual Vetting Standard", val: "100%", icon: ShieldCheck },
              { label: "Placement Regions", val: "10 Regions", icon: MapPin },
              { label: "Ghost Listings Permitted", val: "0 Policy", icon: Lock },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-md">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-heading">{stat.val}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.length > 0
              ? companies.map((org, idx) => {
                const gradients = [
                  "from-blue-600 to-indigo-600",
                  "from-indigo-600 to-violet-600",
                  "from-cyan-600 to-blue-600",
                  "from-emerald-600 to-teal-600",
                  "from-purple-600 to-pink-600",
                  "from-amber-600 to-orange-600",
                ];
                const grad = gradients[idx % gradients.length];
                return (
                  <StaggerItem key={org.id}>
                    <Link
                      href={`/companies/${org.slug || org.id}`}
                      className="p-5 rounded-3xl border border-slate-800 bg-slate-900/85 backdrop-blur-md hover:bg-slate-800/95 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 text-center group flex flex-col justify-between h-full shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-400 transition-colors" />
                      <div>
                        <OrgLogo
                          name={org.name}
                          logoUrl={org.logoUrl}
                          website={org.website}
                          size="lg"
                          className="mx-auto mb-3.5 group-hover:scale-105 transition-transform"
                        />
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {org.name}
                        </h3>
                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full mt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span><Trans comment="page span visible text">Verified Host</Trans></span>
                        </div>
                      </div>
                      <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{org.city || org.region?.name || "Cameroon"}</span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })
              : [
                { name: "Orange Cameroun", city: "Douala", sector: "Telecom" },
                { name: "MTN Cameroon", city: "Douala", sector: "Telecom" },
                { name: "Camtel", city: "Yaoundé", sector: "Telecom" },
                { name: "UBA Cameroon", city: "Douala", sector: "Fintech" },
                { name: "Afriland First Bank", city: "Yaoundé", sector: "Banking" },
                { name: "Université de Yaoundé I", city: "Yaoundé", sector: "Academic" },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/85 backdrop-blur-md text-center shadow-lg flex flex-col justify-between h-full">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-blue-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white truncate">
                        {item.name}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full mt-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span><Trans comment="page span visible text">Accredited</Trans></span>
                      </div>
                    </div>
                    <div className="mt-3.5 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                      {item.city}
                    </div>
                  </div>
                </StaggerItem>
              ))}
          </StaggerContainer>
        </div>
      </section>


      {/* --- THE COMPLETE INTERNSHIP LIFECYCLE (SRS Section 1, 2, 3) --- */}

      {/* --- LATEST JOBS FROM THE MARKETPLACE --- */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                <Trans comment="page h2 visible text">Latest Job Openings
              </Trans></h2>
              <p className="mt-2 text-slate-400 text-sm">
                <Trans comment="page p visible text">Freshly posted positions from verified employers across Cameroon.
              </Trans></p>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              <Trans comment="page Link visible text">View All Jobs </Trans><ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-blue-500/50 hover:bg-slate-800/90 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-900/50 flex items-center justify-center text-blue-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white truncate">{job.organization?.name || t({ message: 'Verified Employer', comment: 'Fallback organization name on a homepage job card' })}</p>
                        <p className="text-[10px] text-slate-500">{job.city}<Trans comment="page p visible text">, Cameroon</Trans></p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{job.type}</Badge>
                  </div>
                  <Link href={`/jobs/${job.slug}`}>
                    <h3 className="text-base font-bold text-white mb-2 hover:text-blue-400 transition-colors line-clamp-1">{job.title}</h3>
                  </Link>
                   <p className="text-sm text-slate-400 line-clamp-2 mb-4">{job.description || t({ message: 'Exciting career opportunity with a verified employer in Cameroon.', comment: 'Fallback description when a homepage job has no description' })}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(job.requiredSkills || []).slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700/60">{skill}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs">
                     <span className="text-emerald-400 font-bold">{job.salaryMinXAF ? `${f.number(job.salaryMinXAF)} XAF` : t({ message: 'Competitive', comment: 'Salary label shown when an employer does not provide a range' })}</span>
                    <span className="text-slate-500">{job.workMode}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center text-slate-500">
                <Trans comment="page div visible text">No jobs posted yet. Be the first to </Trans><Link href="/dashboard/company/jobs/create" className="text-blue-400 hover:underline"><Trans comment="page Link visible text">post a job</Trans></Link>{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"."}</div>
            )}
          </div>
        </div>
      </section>

      {/* --- POST AN OPPORTUNITY (EMPLOYERS & HOSTS) --- */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-900/20 via-slate-900 to-indigo-900/80 p-8 sm:p-12 text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" /> <Trans comment="page div visible text">For Employers &amp; Hosts
              </Trans></div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                <Trans comment="page h2 visible text">Ready to post your first opportunity?
              </Trans></h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                <Trans comment="page p visible text">Publish a job or internship opportunity and start attracting verified
                talent from across Cameroon&apos;s 10 regions. Listings go through a
                quick moderation review before appearing on the marketplace.
              </Trans></p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/dashboard/company/jobs/create">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20">
                    <Plus className="w-5 h-5 mr-2" />
                    <Trans comment="page Button visible text">Post a Job
                  </Trans></Button>
                </Link>
                <Link href="/dashboard/company/opportunities/create">
                  <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 border border-transparent">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <Trans comment="page Button visible text">Create Internship Opportunity
                  </Trans></Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-400">
                <Trans comment="page p visible text">Already have an account?</Trans>{' '}
                <Link href="/dashboard/company" className="text-blue-400 hover:underline font-medium">
                  <Trans comment="page Link visible text">Go to your dashboard
                </Trans></Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- VERIFIED UNIVERSITIES & ACADEMIC PARTNERS --- */}
      <section className="py-20 bg-[#080d1a] border-b border-slate-800/80">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                <Trans comment="page h2 visible text">University Partners
              </Trans></h2>
              <p className="mt-2 text-slate-400 text-sm">
                <Trans comment="page p visible text">Accredited institutions hosting internships and placements across Cameroon&apos;s 10 regions.
              </Trans></p>
            </div>
            <Link href="/universities" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              <Trans comment="page Link visible text">View All Universities </Trans><ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {universities.length > 0 ? (
              universities.map((uni) => (
                <div key={uni.id} className="rounded-3xl border border-slate-800 bg-slate-900/85 backdrop-blur-md p-4 text-center hover:border-emerald-500/50 hover:bg-slate-800/90 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group shadow-lg">
                  <div>
                    <OrgLogo
                      name={uni.name}
                      logoUrl={uni.logoUrl}
                      website={uni.website}
                      type="UNIVERSITY"
                      size="lg"
                      className="mx-auto mb-3 group-hover:scale-105 transition-transform"
                    />
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1 truncate" title={uni.name}>{uni.name}</h4>
                    <p className="text-[10px] text-slate-400 mb-2 truncate">{uni.city || uni.region?.name || "Cameroon"}</p>
                    <div className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full mb-3">
                      <span>{uni.universityProfile?.universityType || "Academic Partner"}</span>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-1 text-[10px]">
                    {uni.website ? (
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                        title={t({ message: "Visit official portal", comment: "page component title attribute" })}
                      >
                        <Globe className="w-3 h-3" />
                        <span><Trans comment="page span visible text">Portal</Trans></span>
                      </a>
                    ) : (
                      <span className="text-slate-500"><Trans comment="page span visible text">Verified</Trans></span>
                    )}
                    <Link href={`/universities/${uni.slug || uni.id}`} className="inline-flex items-center gap-0.5 font-bold text-blue-400 hover:text-blue-300">
                      <Trans comment="page Link visible text">Explore </Trans><ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 py-16 text-center text-slate-500">
                <Trans comment="page div visible text">No university partners listed yet.
              </Trans></div>
            )}
          </div>
        </div>
      </section>

      {/* --- REGISTERED TALENT / INTERN COMMUNITY --- */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                <Trans comment="page h2 visible text">Registered Talent Pool
              </Trans></h2>
              <p className="mt-2 text-slate-400 text-sm">
                <Trans comment="page p visible text">Verified interns and candidates ready for placement across Cameroon.
              </Trans></p>
            </div>
            <Link href="/dashboard/intern" className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              <Trans comment="page Link visible text">View All Talent </Trans><ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {people.length > 0 ? (
              people.map((person) => (
                <Link key={person.id} href={`/intern/${person.id}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-blue-500/50 hover:bg-slate-850/90 transition-all duration-200 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 overflow-hidden shrink-0">
                        {person.avatarUrl ? (
                          <Image src={person.avatarUrl} alt="" width={44} height={44} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-gradient-to-tr from-blue-700 to-indigo-700 text-white">
                            {person.fullName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{person.fullName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{person.internProfile?.qualification || "Intern Candidate"}</p>
                      </div>
                    </div>
                    {person.internProfile?.city && (
                      <p className="text-[10px] text-slate-400 mb-3">{person.internProfile.city}<Trans comment="page p visible text">, Cameroon</Trans></p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(person.internProfile?.skills || []).slice(0, 3).map((s: { skill: { name: string } }) => (
                        <span key={s.skill.name} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60">{s.skill.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 text-[11px] font-semibold">{person.internProfile?.profileCompleted ? "Profile Complete" : "Building Profile"}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-blue-400 group-hover:text-blue-300 text-xs">
                      <Trans comment="page span visible text">View Passport </Trans><ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 px-6 rounded-3xl border border-dashed border-slate-800 bg-slate-900/60 text-center max-w-xl mx-auto">
                <GraduationCap className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1"><Trans comment="page h4 visible text">Be Among the First Verified Candidates</Trans></h4>
                <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                  <Trans comment="page p visible text">Create your free Intern Passport, calculate your readiness score, and get discovered by top enterprises across Cameroon.
                </Trans></p>
                <Link
                  href="/register/intern"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 transition-all shadow-lg shadow-emerald-900/30"
                >
                  <span><Trans comment="page span visible text">Register Intern Passport</Trans></span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- DASHBOARD SHOWCASE (all 4 dashboards explained visually) --- */}
      <DashboardShowcase />

      <section className="py-24 bg-slate-900 text-white relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <MotionSection motion="rise" stagger={0.12}>
            <MotionItem className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 uppercase tracking-widest text-[10px] mb-3">
                <Trans comment="page Badge visible text">The MANTECH Differentiator
              </Trans></Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                <Trans comment="page h2 visible text">Complete End-to-End Internship Lifecycle
              </Trans></h2>
              <p className="mt-4 text-slate-400 text-base">
                <Trans comment="page p visible text">Interns can discover opportunities and track applications while
                organizations recruit, interview, and coordinate placements.
              </Trans></p>
            </MotionItem>
          </MotionSection>

          <MotionSection motion="wipe" stagger={0.12}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifecycleSteps.map((step) => (
                <MotionItem key={step.num} motion="wipe" className="h-full">
                  <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all hover:-translate-y-1">
                    <div className="font-mono text-2xl font-bold text-cyan-400 mb-3">
                      {step.num}
                    </div>
                    <h3 className="text-lg font-bold text-white font-heading mb-2">
                      {t(step.title)}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t(step.desc)}
                    </p>
                  </div>
                </MotionItem>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>

      {/* --- LIVE IT INTERNSHIPS (Dynamic from Database) --- */}
      <section className="py-24 bg-[#070e1b] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Backdrop tech image & ambient lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/portal_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070e1b]/95 via-[#070e1b]/90 to-[#070e1b] pointer-events-none" />
        <div className="absolute top-12 left-10 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-12 right-10 w-80 h-80 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300 tracking-wide mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-1.5 h-1.5 -ml-3.5 rounded-full bg-emerald-400" />
                <span><Trans comment="page span visible text">Live Technical Lab Synchronized</Trans></span>
                <span className="text-[10px] text-emerald-400/80 font-mono"><Trans comment="page span visible text">· 0 Ghost Postings Policy</Trans></span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                <Trans comment="page h2 visible text">Featured IT Internship Opportunities
              </Trans></h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                <Trans comment="page p visible text">Directly synchronized with partner enterprise technical labs across Douala, Yaoundé, Buea, and Bafoussam. Verified stipends and mentor oversight.
              </Trans></p>
            </div>
            <Link href="/internships">
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-800/90 text-white hover:bg-slate-700 hover:border-emerald-400 font-semibold text-sm shadow-xs gap-1.5"
              >
                <Trans comment="page Button visible text">View All Opportunities
                </Trans><ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <MotionSection motion="slideLeft" stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredInternships.map((opp) => {
                const workModeStr = String(opp.workMode || opp.work_mode || "ONSITE").toUpperCase();
                const isPaid = opp.allowanceXAF || opp.allowance_xaf || opp.isPaid || opp.is_paid;
                return (
                  <MotionItem key={opp.id} motion="slideLeft" className="h-full">
                    <div className="group flex h-full flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-7 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 hover:bg-slate-800/90 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                      <div>
                        {/* Header metadata */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                            <Cpu className="w-3 h-3 text-blue-400" />
                            {fieldNameOf(opp as unknown as Record<string, unknown>) || t({ message: 'Technical Track', comment: 'Fallback category shown when an opportunity has no professional field name' })}
                          </span>

                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${isPaid
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}>
                            {opp.allowanceXAF || opp.allowance_xaf
                               ? `${f.number(opp.allowanceXAF || opp.allowance_xaf || 0)} FCFA / mo`
                              : isPaid
                                ? "Paid Placement"
                                : "Accredited Experience"}
                          </span>
                        </div>

                        {/* Opportunity Title */}
                        <h3 className="font-heading text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {opp.title}
                        </h3>

                        {/* Location and Mode row */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2.5 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {opp.city || "Douala"}{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{", "}{regionNameOf(opp as unknown as Record<string, unknown>) || t({ message: 'Littoral', comment: 'Fallback region name shown when an opportunity has no region' })}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                            {workModeStr === "REMOTE" ? (
                              <Globe className="w-3 h-3 text-blue-400" />
                            ) : workModeStr === "HYBRID" ? (
                              <Laptop className="w-3 h-3 text-indigo-400" />
                            ) : (
                              <Building2 className="w-3 h-3 text-amber-400" />
                            )}
                            {workModeStr}
                          </span>
                        </div>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-slate-300 mt-3.5 line-clamp-2 leading-relaxed">
                          {opp.description || opp.summary || "Professional internship opportunity with verified mentor guidance and real production exposure."}
                        </p>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {(((opp.requiredSkills || opp.required_skills || opp.skills || []) as string[])).slice(0, 4).map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 font-medium border border-slate-700/60"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {opp.durationMonths || opp.duration_months || 3} <Trans comment="page span visible text">Mos Placement
                        </Trans></span>
                        <Link href={`/internships/${opp.slug}`}>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/25 gap-1"
                          >
                            <span><Trans comment="page span visible text">Inspect & Apply</Trans></span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </MotionItem>
                );
              })}
            </div>
          </MotionSection>
        </div>
      </section>

      {/* --- SRS §20: DEDICATED INTERN PASSPORT SPOTLIGHT SECTION --- */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <FadeIn direction="left" className="lg:col-span-7 space-y-6">
              <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 uppercase tracking-widest text-[10px]">
                <Trans comment="page Badge visible text">SRS Core Feature
              </Trans></Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
                <Trans comment="page h2 visible text">The Intern Passport
              </Trans></h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                <Trans comment="page p visible text">Not a generic CV builder. The </Trans><strong><Trans comment="page strong visible text">Intern Passport</Trans></strong> <Trans comment="page p visible text">is your canonical,
                permanent discovery profile inside MANTECH. It showcases your real academic diplomas,
                verified skill endorsements, and past completed placements.
              </Trans></p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span><Trans comment="page span visible text">Verifiable Identity</Trans></span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <Trans comment="page p visible text">Unique passport serial number (e.g. MN-CM-2026-XXXX) recognized across institutions and enterprise recruiters.
                  </Trans></p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <Lock className="w-4 h-4" />
                    <span><Trans comment="page span visible text">Zero-Trust Privacy</Trans></span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <Trans comment="page p visible text">Phone numbers and CVs are hidden from anonymous web crawlers. Only accredited, verified organizations can view authorized contacts.
                  </Trans></p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/register/intern">
                  <Button className="h-12 px-7 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20">
                    <Trans comment="page Button visible text">Get Your Intern Passport Free
                    </Trans><ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard/intern/passport">
                  <Button
                    variant="outline"
                    className="h-12 px-7 border-slate-600 text-slate-200 bg-white/5 hover:bg-white/10 text-sm font-medium"
                  >
                    <Trans comment="page Button visible text">Passport Preview
                  </Trans></Button>
                </Link>
              </div>
            </FadeIn>

            {/* Passport Credential Mockup */}
            <FadeIn direction="right" className="lg:col-span-5">
              <div className="rounded-3xl border-2 border-amber-400/40 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative space-y-6">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                      <Trans comment="page span visible text">REPUBLIC OF CAMEROON // MANTECH
                    </Trans></span>
                    <h3 className="text-xl font-extrabold text-white font-heading mt-0.5">
                      <Trans comment="page h3 visible text">INTERN PASSPORT
                    </Trans></h3>
                  </div>
                  <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 font-mono text-[10px]">
                    <Trans comment="page Badge visible text">VERIFIED
                  </Trans></Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white/20">
                    <Trans comment="page div visible text">JD
                  </Trans></div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      <Trans comment="page h4 visible text">Jean-Daniel Ndongo
                    </Trans></h4>
                    <p className="text-xs text-slate-300">
                      <Trans comment="page p visible text">BSc Software Engineering • Douala
                    </Trans></p>
                    <span className="text-[10px] font-mono text-cyan-400">
                      <Trans comment="page span visible text">ID: MN-LT-2026-8941
                    </Trans></span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400"><Trans comment="page span visible text">Field:</Trans></span>
                    <span className="font-semibold text-white"><Trans comment="page span visible text">Software Engineering</Trans></span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400"><Trans comment="page span visible text">Academic Level:</Trans></span>
                    <span className="font-semibold text-white"><Trans comment="page span visible text">Undergraduate (BSc)</Trans></span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400"><Trans comment="page span visible text">Completed Placements:</Trans></span>
                    <span className="font-semibold text-emerald-400"><Trans comment="page span visible text">1 Verified (3 Months)</Trans></span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400"><Trans comment="page span visible text">Readiness Score:</Trans></span>
                    <span className="font-semibold text-cyan-400 font-mono"><Trans comment="page span visible text">92% Complete</Trans></span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span><Trans comment="page span visible text">Cryptographic QR Validation</Trans></span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold"><Trans comment="page span visible text">Active</Trans></span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- SRS §20: PROFESSIONAL FIELDS EXPLORER --- */}
      <section className="py-24 bg-[#0a0f1d] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Backdrop tech image & ambient lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/about_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/95 via-[#0a0f1d]/90 to-[#0a0f1d] pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-blue-500/15 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-300 tracking-wide mb-3">
                <Compass className="w-4 h-4 text-blue-400" />
                <span><Trans comment="page span visible text">MINESUP Framework Aligned</Trans></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] text-blue-300 font-mono"><Trans comment="page span visible text">8 Accredited Disciplines</Trans></span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                <Trans comment="page h2 visible text">Curriculum Alignment & Professional Fields
              </Trans></h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                <Trans comment="page p visible text">Engineered to bridge Cameroon higher education diplomas (BTS, HND, DSEP, B.Eng) with real-world enterprise engineering labs, banking systems, and cloud infrastructure.
              </Trans></p>
            </div>
            <Link href="/fields">
              <Button variant="outline" className="text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-sm transition-all hover:border-blue-400 gap-1.5">
                <Trans comment="page Button visible text">Browse All Fields
                </Trans><ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFields.map((field) => {
              const iconMap: Record<string, { icon: React.ComponentType<{ className?: string }>; grad: string; level: string }> = {
                "software-engineering": { icon: Code2, grad: "from-blue-600 to-indigo-600", level: "BTS · HND · B.Eng" },
                "cybersecurity": { icon: Shield, grad: "from-rose-600 to-red-600", level: "MINPOSTEL Standard" },
                "cloud-computing": { icon: Network, grad: "from-cyan-600 to-blue-600", level: "AWS / Azure / GCP" },
                "data-science": { icon: Database, grad: "from-amber-600 to-orange-600", level: "Data & ML Pipelines" },
                "telecommunications": { icon: Radio, grad: "from-emerald-600 to-teal-600", level: "Core 4G/5G & RF" },
                "business-it": { icon: LineChart, grad: "from-indigo-600 to-slate-700", level: "ERP & Governance" },
                "mobile-development": { icon: Smartphone, grad: "from-purple-600 to-fuchsia-600", level: "Android & iOS" },
                "devops-infrastructure": { icon: Layers, grad: "from-teal-600 to-cyan-700", level: "CI/CD & Kubernetes" },
              };
              const theme = iconMap[field.slug] || { icon: Compass, grad: "from-blue-600 to-indigo-600", level: "Technical Track" };
              const Icon = theme.icon;

              return (
                <StaggerItem key={field.id}>
                  <Link
                    href={`/fields/${field.slug}`}
                    className="p-7 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md hover:border-blue-400 hover:bg-slate-800/90 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-full shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-400 transition-colors" />
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${theme.grad} text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                          {theme.level}
                        </span>
                      </div>

                      <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors text-lg font-heading">
                        {typeof field.name === 'string' ? field.name : t(field.name)}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {field.description
                          ? (typeof field.description === 'string' ? field.description : t(field.description))
                          : t({ message: 'Browse verified opportunities, partner enterprises, and curriculum alignment.', comment: 'Fallback description shown on homepage field cards' })}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-orange-300">
                      <span><Trans comment="page span visible text">Curriculum & Openings</Trans></span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* --- SRS §20: CAMEROON REGIONAL HUBS EXPLORER --- */}
      <section className="py-24 bg-[#061713] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Backdrop tech image & ambient lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/security_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#061713]/95 via-[#061713]/90 to-[#061713] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300 tracking-wide mb-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span><Trans comment="page span visible text">Cameroon Geographic Grid</Trans></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-mono"><Trans comment="page span visible text">10/10 Regions Active</Trans></span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                <Trans comment="page h2 visible text">Internships Across All 10 Regions
              </Trans></h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                <Trans comment="page p visible text">From the commercial tech corridors of Littoral to Silicon Mountain in South West and polytechnics in Centre — discover local on-site, hybrid, and remote opportunities.
              </Trans></p>
            </div>
            <Link href="/locations">
              <Button variant="outline" className="text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-sm transition-all hover:border-emerald-400 gap-1.5">
                <Trans comment="page Button visible text">All Cameroon Locations
                </Trans><ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayRegions.map((region) => {
              // Professional per-region presentation. Keyed by region NAME (the
              // DB `code` values look like "REG_ADAMAWA" which is not fit to show
              // to users), so each card gets a clean 2-letter badge + its own hue.
              const regionMeta: Record<string, { short: string; grad: string }> = {
                "Littoral": { short: "LT", grad: "from-blue-600 to-cyan-600" },
                "Centre": { short: "CE", grad: "from-emerald-600 to-teal-600" },
                "Adamawa": { short: "AD", grad: "from-purple-600 to-indigo-600" },
                "East": { short: "ES", grad: "from-orange-600 to-amber-600" },
                "Far North": { short: "FN", grad: "from-rose-600 to-red-600" },
                "North": { short: "NO", grad: "from-teal-600 to-emerald-600" },
                "North-West": { short: "NW", grad: "from-sky-600 to-blue-600" },
                "South": { short: "SU", grad: "from-lime-600 to-emerald-600" },
                "South-West": { short: "SW", grad: "from-indigo-600 to-violet-600" },
                "West": { short: "OU", grad: "from-amber-600 to-orange-600" },
              };
              const meta =
                regionMeta[region.fallbackKey ?? (typeof region.name === 'string' ? region.name : '')] || {
                  short: typeof region.name === 'string' ? region.name.slice(0, 2).toUpperCase() : region.code.slice(0, 2),
                  grad: "from-slate-700 to-slate-900",
                };

              return (
                <StaggerItem key={region.id}>
                  <Link
                    href={`/locations/${region.code.toLowerCase()}`}
                    className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 hover:border-emerald-400 hover:bg-slate-800/90 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group text-center block shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent group-hover:via-emerald-400 transition-colors" />
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${meta.grad} text-white flex items-center justify-center mx-auto mb-3.5 shadow-md group-hover:scale-105 transition-transform font-bold text-sm`}>
                      {meta.short}
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {typeof region.name === 'string' ? region.name : t(region.name)}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">
                      {typeof region.capital === 'string' ? region.capital : t(region.capital)}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span><Trans comment="page span visible text">Live Hub</Trans></span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Territory Telemetry Banner */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white"><Trans comment="page div visible text">National Placement Telemetry: 10/10 Administrative Regions Active</Trans></div>
                <div className="text-[11px] text-slate-400"><Trans comment="page div visible text">Verified physical supervisor visits and institutional academic coordination nationwide.</Trans></div>
              </div>
            </div>
            <Link href="/locations">
              <Button size="sm" variant="outline" className="text-xs font-semibold shrink-0 gap-1.5 border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:border-emerald-400">
                <Trans comment="page Button visible text">Inspect All Hubs </Trans><ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- ECOSYSTEM ROLES & SERVICES (With Background Image Styling) --- */}
      <section
        className="py-24 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/company_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-[2px]" />
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 uppercase tracking-widest text-[10px] mb-3">
              <Trans comment="page Badge visible text">Multi-Tenant Architecture
            </Trans></Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              <Trans comment="page h2 visible text">Built for Cameroon&apos;s Entire Professional Ecosystem
            </Trans></h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              <Trans comment="page p visible text">Dedicated interfaces tailored to the distinct workflows of every
              stakeholder in the national internship pipeline.
            </Trans></p>
          </RevealOnScroll>

          <MotionSection motion="scaleIn" stagger={0.09}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc, idx) => {
                const Icon = svc.icon;
                return (
                  <MotionItem key={idx} motion="scaleIn" className="h-full">
                    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-md transition-all hover:border-white/25">
                      <div>
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-white mb-5 shadow-lg`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-heading mb-2">
                          {t(svc.title)}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          {t(svc.description)}
                        </p>

                        <ul className="space-y-2 mb-6">
                          {svc.features.map((feat, fIdx) => (
                            <li
                              key={fIdx}
                              className="flex items-start gap-2 text-[11px] text-slate-400"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{t(feat)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link href={svc.href}>
                        <Button
                          variant="outline"
                          className="w-full text-xs border-white/20 text-black hover:bg-white/10"
                        >
                          <Trans comment="page Button visible text">Explore Portal
                        </Trans></Button>
                      </Link>
                    </div>
                  </MotionItem>
                );
              })}
            </div>
          </MotionSection>
        </div>
      </section>

      {/* --- ENTERPRISE SECURITY & HACKER SHIELD (SRS Section 7 & 47-50) --- */}
      <section
        className="py-24 relative bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/security_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/94 backdrop-blur-[1px]" />
        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <MotionSection motion="rise" stagger={0.1}>
              <MotionItem className="text-center mb-16">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 uppercase tracking-widest text-[10px] mb-3">
                  <Trans comment="page Badge visible text">Security and privacy
                </Trans></Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                  <Trans comment="page h2 visible text">Server-Side Access Controls
                </Trans></h2>
                <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <Trans comment="page p visible text">Protected routes verify user roles and organization access on
                  the server. Sensitive CV access is authorized and audited.
                </Trans></p>
              </MotionItem>
            </MotionSection>

            <MotionSection motion="spread" stagger={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        <Trans comment="page h3 visible text">Server-Enforced RBAC
                      </Trans></h3>
                      <p className="text-xs text-slate-400">
                        <Trans comment="page p visible text">Zero client-side reliance
                      </Trans></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <Trans comment="page p visible text">Every request verifies cryptographically signed session tokens
                    and strict role boundaries at the middleware and database
                    level. Students cannot inspect administrative endpoints.
                  </Trans></p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        <Trans comment="page h3 visible text">Organizational Tenant Isolation
                      </Trans></h3>
                      <p className="text-xs text-slate-400">
                        <Trans comment="page p visible text">Strict organizational boundaries
                      </Trans></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <Trans comment="page p visible text">Organization data requests are scoped to the signed-in
                    organization and checked by server-side authorization.
                  </Trans></p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        <Trans comment="page h3 visible text">Injection & Traversal Armor
                      </Trans></h3>
                      <p className="text-xs text-slate-400">
                        <Trans comment="page p visible text">Signature detection & rate limiting
                      </Trans></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <Trans comment="page p visible text">Automated inspection blocks path traversal patterns (..),
                    script tags, and union-select signatures before requests ever
                    reach application logic.
                  </Trans></p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        <Trans comment="page h3 visible text">Audited Activity
                      </Trans></h3>
                      <p className="text-xs text-slate-400">
                        <Trans comment="page p visible text">Access and administrative event history
                      </Trans></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <Trans comment="page p visible text">Sensitive CV access and platform administration actions are
                    recorded with actor and event details for review.
                  </Trans></p>
                </div>
              </div>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* --- PLANS FOR COMPANIES AND UNIVERSITIES --- */}
      <section id="plans" className="py-24 bg-[#080d1a] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Backdrop tech image & ambient lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/hero_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/95 via-[#080d1a]/90 to-[#080d1a] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-blue-500/15 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-300 tracking-wide mb-3">
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              <span><Trans comment="page span visible text">Transparent XAF Invoicing</Trans></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] text-blue-300 font-mono"><Trans comment="page span visible text">Zero Automated Card Charges</Trans></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              <Trans comment="page h2 visible text">Internships are 100% Free for Candidates
            </Trans></h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              <Trans comment="page p visible text">Searching for openings, building your verified Intern Passport, and receiving placement offers never costs anything. Host enterprises and institutions subscribe to transparent, non-recurring XAF plans.
            </Trans></p>
          </RevealOnScroll>

          {/* Dual Pathway Quick Comparison */}
          <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-4 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400"><Trans comment="page div visible text">For Interns & Students</Trans></div>
                <div className="text-sm font-bold text-white mt-0.5"><Trans comment="page div visible text">Always Free · 0 FCFA Lifetime</Trans></div>
                <div className="text-xs text-slate-300 mt-0.5"><Trans comment="page div visible text">Free Intern Passport, direct applications, and verified certificate.</Trans></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-4 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400"><Trans comment="page div visible text">For Employers & Faculties</Trans></div>
                <div className="text-sm font-bold text-white mt-0.5"><Trans comment="page div visible text">Manual XAF Tiers · Pay per term</Trans></div>
                <div className="text-xs text-slate-300 mt-0.5"><Trans comment="page div visible text">MTN MoMo, Orange Money, or Bank Transfer with official tax receipt.</Trans></div>
              </div>
            </div>
          </div>

          {packages.length > 0 ? (
            <MotionSection motion="scaleIn" stagger={0.1}>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {packages.map((plan) => {
                  const isFree = plan.code === "FREE";
                  const isRecommended = plan.code === "BUSINESS";
                  return (
                    <MotionItem key={plan.code} motion="spread" className="h-full">
                      <div
                        className={`relative flex h-full flex-col justify-between rounded-3xl border bg-slate-900/90 backdrop-blur-md p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ${isRecommended
                          ? "border-blue-500/80 ring-2 ring-blue-500/20 shadow-blue-500/10"
                          : isFree
                            ? "border-emerald-500/40"
                            : "border-slate-800"
                          }`}
                      >
                        {isRecommended && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-[11px] font-bold text-white shadow-md">
                            <Trans comment="page span visible text">Most Popular for Labs
                          </Trans></span>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white font-heading">
                              {plan.name}
                            </h3>
                            {isFree && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                <Trans comment="page span visible text">Intern Tier
                              </Trans></span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs text-slate-300 min-h-[36px] leading-relaxed">
                            {plan.description}
                          </p>

                          <div className="mt-5 pb-5 border-b border-slate-800">
                            {isFree ? (
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white font-heading">
                                  {/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"0"}</span>
                                <span className="text-sm font-bold text-slate-300">
                                  <Trans comment="page span visible text">XAF / forever
                                </Trans></span>
                              </div>
                            ) : (
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                                  {f.number(plan.priceXAF)}
                                </span>
                                <span className="text-xs font-semibold text-slate-400">
                                  <Trans comment="page span visible text">XAF / mo
                                </Trans></span>
                              </div>
                            )}
                            <div className="text-[11px] text-slate-400 mt-1"><Trans comment="page div visible text">Manual non-recurring settlement</Trans></div>
                          </div>

                          {plan.features.length > 0 && (
                            <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                              {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2">
                                  <CheckCircle2
                                    className={`mt-0.5 h-4 w-4 shrink-0 ${isFree ? "text-emerald-400" : "text-blue-400"
                                      }`}
                                  />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <Link
                          href={isFree ? "/sign-up" : "/pricing"}
                          className="mt-8 block"
                        >
                          <Button
                            className={`w-full font-semibold rounded-xl text-xs h-11 ${isRecommended
                              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/25"
                              : isFree
                                ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                                : "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                              }`}
                          >
                            {isFree ? "Create Free Candidate Account" : "Select Organization Tier"}
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </MotionItem>
                  );
                })}
              </div>
            </MotionSection>
          ) : (
            <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center text-white">
              <p className="text-sm text-slate-300">
                <Trans comment="page p visible text">Our plans are currently being configured. Please browse our pricing catalogue.
              </Trans></p>
              <Link href="/pricing" className="mt-4 inline-block">
                <Button variant="outline" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"><Trans comment="page Button visible text">See all plans</Trans></Button>
              </Link>
            </div>
          )}

          <div className="mt-10 text-center text-xs sm:text-sm text-slate-400">
            <Trans comment="page div visible text">Need a tailored enterprise or multi-campus university convention?</Trans>{" "}
            <Link
              href="/contact"
              className="font-bold text-blue-400 underline-offset-4 hover:underline"
            >
              <Trans comment="page Link visible text">Contact our Cameroon Advisory Desk
            </Trans></Link>{" "}
            <Trans comment="page div visible text">for immediate assistance.
          </Trans></div>
        </div>
      </section>

      {/* --- SRS §20: EDITORIAL TESTIMONIALS SPOTLIGHT --- */}
      <section className="py-24 bg-[#080d19] border-b border-slate-800/80 relative overflow-hidden text-white">
        {/* Backdrop tech image & ambient lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/about_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d19]/95 via-[#080d19]/90 to-[#080d19] pointer-events-none" />
        <div className="absolute top-1/4 -right-10 w-96 h-96 bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-300 tracking-wide mb-3">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span><Trans comment="page span visible text">Verified Placement Outcomes</Trans></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] text-blue-300 font-mono"><Trans comment="page span visible text">Community Testimonials</Trans></span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                <Trans comment="page h2 visible text">Experiences from Cameroon Interns & Recruiters
              </Trans></h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                <Trans comment="page p visible text">Direct feedback from students discovered on merit, and accredited enterprise supervisors who streamlined technical recruitment through MANTECH Nexus.
              </Trans></p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTestimonialModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold py-2.5 px-4 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                title={t({ message: "Share your placement story", comment: "page component title attribute" })}
              >
                <Plus className="w-4 h-4" />
                <Trans comment="page button visible text">Share Story
              </Trans></button>
              <Link href="/testimonials">
                <Button variant="outline" className="text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 shadow-sm transition-all hover:border-amber-400 gap-1.5">
                  <Trans comment="page Button visible text">Read All Stories
                  </Trans><ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <StaggerItem key={t.id}>
                  <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col justify-between h-full hover:shadow-2xl hover:border-amber-400/50 hover:bg-slate-800/90 hover:-translate-y-1.5 transition-all duration-300 shadow-xl relative overflow-hidden group text-white">
                    <Quote className="absolute right-5 top-5 w-14 h-14 text-slate-800/60 group-hover:text-amber-500/10 transition-colors pointer-events-none" />
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span><Trans comment="page span visible text">Verified Placement</Trans></span>
                        </span>
                      </div>
                      <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap text-slate-200 font-medium relative z-10">
                        {/* eslint-disable-next-line i18next/no-literal-string -- quotation mark punctuation around testimonial copy */}
                        {'“'}{t.message}{/* eslint-disable-next-line i18next/no-literal-string -- quotation mark punctuation around testimonial copy */}{'”'}
                      </p>
                      {t.details && (
                        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                          {t.details}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3.5">
                      {t.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.photoUrl}
                          alt={t.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-amber-400/40 shadow-md"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">{t.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {t.role} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"• "}{t.company || t.region}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))
            ) : (
              <>
                {VERIFIED_COMMUNITY_STORIES.slice(0, 3).map((story) => (
                  <StaggerItem key={story.id}>
                    <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col justify-between h-full hover:shadow-2xl hover:border-amber-400/50 hover:bg-slate-800/90 hover:-translate-y-1.5 transition-all duration-300 shadow-xl relative overflow-hidden group text-white">
                      <Quote className="absolute right-5 top-5 w-14 h-14 text-slate-800/60 group-hover:text-amber-500/10 transition-colors pointer-events-none" />
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(story.rating || 5)].map((_, idx) => (
                              <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span><Trans comment="page span visible text">Verified Placement</Trans></span>
                          </span>
                        </div>
                        <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap text-slate-200 font-medium relative z-10">
                          {/* eslint-disable-next-line i18next/no-literal-string -- quotation mark punctuation around testimonial copy */}
                          {'“'}{t(story.message)}{/* eslint-disable-next-line i18next/no-literal-string -- quotation mark punctuation around testimonial copy */}{'”'}
                        </p>
                        {story.details && (
                          <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                            {t(story.details)}
                          </p>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3.5">
                        {story.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={story.photoUrl}
                            alt={story.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-amber-400/40 shadow-md"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                            {story.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{story.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {t(story.role)} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"• "}{story.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* --- SRS §20: FREQUENTLY ASKED QUESTIONS — REDESIGNED & IMAGINATIVE UI --- */}
      <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <RevealOnScroll className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4 backdrop-blur-sm">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <Trans comment="page span visible text">Frequently Asked Questions
            </Trans></span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
              <Trans comment="page h2 visible text">Got Questions? We Have Answers.
            </Trans></h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
              <Trans comment="page p visible text">Transparent, verified insights on how students get discovered, host enterprises recruit, and universities supervise accredited internships across Cameroon.
            </Trans></p>
          </RevealOnScroll>

          {/* Interactive Category Tabs & Search Bar */}
          <div className="max-w-5xl mx-auto mb-10 space-y-4">
            {/* Category Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = faqCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFaqCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400 scale-[1.02]"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10"
                      }`}
                  >
                    <span>{t(cat.label)}</span>
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-400"
                        }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Keyword Search Filter */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={t({ message: "Search questions (e.g. passport, free, billing, universities)...", comment: "page component placeholder attribute" })}
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="pl-11 pr-4 h-11 bg-slate-900/90 border-white/10 text-slate-200 placeholder:text-slate-500 rounded-xl focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  <Trans comment="page button visible text">Clear
                </Trans></button>
              )}
            </div>
          </div>

          {/* Main FAQ Content Architecture: 2-Column Responsive Question Grid */}
          <div className="max-w-6xl mx-auto space-y-10">
            {(() => {
              const filtered = EXPANDED_FAQS.filter((faq) => {
                const matchesCategory =
                  faqCategory === "all" || faq.category === faqCategory;
                const matchesSearch =
                  !faqSearch.trim() ||
                  (faq.q.message ?? "").toLowerCase().includes(faqSearch.toLowerCase()) ||
                  (faq.a.message ?? "").toLowerCase().includes(faqSearch.toLowerCase()) ||
                  (faq.categoryName.message ?? "").toLowerCase().includes(faqSearch.toLowerCase());
                return matchesCategory && matchesSearch;
              });

              if (filtered.length === 0) {
                return (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center space-y-3">
                    <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">
                      <Trans comment="page p visible text">No questions matched your search.
                    </Trans></p>
                    <p className="text-xs text-slate-400">
                      <Trans comment="page p visible text">Try a different keyword or reset the category filter.
                    </Trans></p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFaqCategory("all");
                        setFaqSearch("");
                      }}
                      className="text-xs border-white/20 text-slate-300 hover:text-white mt-2"
                    >
                      <Trans comment="page Button visible text">Reset filters
                    </Trans></Button>
                  </div>
                );
              }

              const col1 = filtered.filter((_, i) => i % 2 === 0);
              const col2 = filtered.filter((_, i) => i % 2 !== 0);

              const renderFaqItem = (faq: typeof filtered[0], originalIdx: number) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-blue-500/30 hover:bg-slate-900/90 shadow-sm"
                >
                  <AccordionTrigger className="px-5 py-4 sm:px-6 sm:py-5 text-left font-semibold text-sm text-white hover:no-underline hover:text-cyan-300 transition-colors [&>svg]:text-cyan-400 [&>svg]:shrink-0">
                    <div className="flex items-start gap-3.5 pr-2">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400 text-xs font-bold mt-0.5 border border-blue-500/30">
                        {originalIdx + 1 < 10 ? `0${originalIdx + 1}` : originalIdx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-blue-300 border border-white/10">
                            {t(faq.categoryName)}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-400">
                            {t(faq.badge)}
                          </span>
                        </div>
                        <span className="block leading-snug">{t(faq.q)}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 sm:px-6 sm:pb-6 pl-[3.75rem] space-y-4">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {t(faq.a)}
                    </p>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-emerald-200 leading-relaxed font-medium">
                        <span className="font-bold text-emerald-300"><Trans comment="page span visible text">Key Takeaway: </Trans></span>
                        {t(faq.takeaway)}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Accordion type="single" collapsible className="space-y-4">
                    {col1.map((faq, i) => renderFaqItem(faq, i * 2))}
                  </Accordion>
                  <Accordion type="single" collapsible className="space-y-4">
                    {col2.map((faq, i) => renderFaqItem(faq, i * 2 + 1))}
                  </Accordion>
                </div>
              );
            })()}

            {/* Quick Assistance 3-Column Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {/* WhatsApp Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/90 p-5 space-y-3 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <Trans comment="page span visible text">Live WhatsApp Desk
                  </Trans></span>
                  <span className="text-[10px] text-slate-400"><Trans comment="page span visible text">&lt; 15 min reply</Trans></span>
                </div>
                <h4 className="text-sm font-bold text-white"><Trans comment="page h4 visible text">Have a specific question?</Trans></h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <Trans comment="page p visible text">Chat directly with our admissions and enterprise team for fast answers.
                </Trans></p>
                <a
                  href={waSupportLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 transition-colors shadow-md"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <Trans comment="page a visible text">Chat on WhatsApp
                </Trans></a>
              </div>

              {/* 100% Free Launch Card */}
              <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/80 to-slate-900/90 p-5 space-y-3 backdrop-blur-md shadow-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <Trans comment="page span visible text">Free Launch Access
                </Trans></span>
                <h4 className="text-sm font-bold text-white"><Trans comment="page h4 visible text">Zero Fees Across Cameroon</Trans></h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <Trans comment="page p visible text">All candidate registrations, job postings, and university dashboards are 100% free with 0 FCFA fees.
                </Trans></p>
                <Link
                  href="/register/intern"
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-3 transition-colors shadow-md"
                >
                  <Trans comment="page Link visible text">Register Free Passport </Trans><ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Convention Assistance Card */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900/90 p-5 space-y-3 backdrop-blur-md shadow-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <Trans comment="page span visible text">MINESUP Convention
                </Trans></span>
                <h4 className="text-sm font-bold text-white"><Trans comment="page h4 visible text">Tripartite Agreements</Trans></h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <Trans comment="page p visible text">Digital supervision connects students, academic mentors, and verified employers in real time.
                </Trans></p>
                <Link
                  href="/services/universities"
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold py-2.5 px-3 transition-colors"
                >
                  <Trans comment="page Link visible text">University Details </Trans><ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRE-FOOTER SECTION: DUAL-PATHWAY HIGH-IMPACT CTA BANNER --- */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden border-t border-blue-900/30">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <Trans comment="page span visible text">National Cameroon Internship Infrastructure
            </Trans></span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading leading-tight tracking-tight">
              <Trans comment="page h2 visible text">Ready to Take Your Next
              </Trans><span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                <Trans comment="page span visible text">Professional Step?
              </Trans></span>
            </h2>
            <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
              <Trans comment="page p visible text">Join thousands of aspiring professionals, accredited enterprises, and higher education faculties collaborating across Cameroon&apos;s verified internship highway.
            </Trans></p>
          </RevealOnScroll>

          {/* Dual Pathway Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pathway 1: For Interns & Students */}
            <div className="group relative rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-blue-950/60 p-8 sm:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/60 hover:shadow-cyan-900/20 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    <Trans comment="page span visible text">For Students & Seekers
                  </Trans></span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-heading text-white">
                    <Trans comment="page h3 visible text">Get Your Free Intern Passport
                  </Trans></h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    <Trans comment="page p visible text">Build your verifiable digital credential, showcase validated technical skills, and apply directly to vetted host enterprises across Cameroon.
                  </Trans></p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><Trans comment="page span visible text">100% Free forever — zero application or listing fees</Trans></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><Trans comment="page span visible text">Zero-trust privacy protects your phone number & CV</Trans></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><Trans comment="page span visible text">Live status tracking on all active applications</Trans></span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link href="/register/intern" className="block">
                  <Button className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all">
                    <Trans comment="page Button visible text">Register as Intern Free
                    </Trans><ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pathway 2: For Host Companies & Universities */}
            <div className="group relative rounded-3xl border border-blue-500/30 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-indigo-950/60 p-8 sm:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-blue-400/60 hover:shadow-blue-900/20 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    <Trans comment="page span visible text">For Hosts & Faculties
                  </Trans></span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-heading text-white">
                    <Trans comment="page h3 visible text">Recruit & Supervise Talent
                  </Trans></h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    <Trans comment="page p visible text">Post vetted opportunities, access pre-screened candidate pipelines, schedule structured interviews, and coordinate tripartite conventions.
                  </Trans></p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><Trans comment="page span visible text">Pre-screened candidates sorted by skill & region</Trans></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><Trans comment="page span visible text">Transparent pricing with human-assisted invoicing in XAF</Trans></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><Trans comment="page span visible text">Dedicated WhatsApp support & tripartite convention oversight</Trans></span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <a
                  href={waCompanySalesLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 gap-2 transition-all">
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                    <span><Trans comment="page span visible text">Recruiter Concierge</Trans></span>
                  </Button>
                </a>
                <Link href="/pricing" className="shrink-0">
                  <Button
                    variant="outline"
                    className="h-12 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-5"
                  >
                    <Trans comment="page Button visible text">View Plans
                  </Trans></Button>
                </Link>
              </div>
            </div>
          </div>

          {/* National Trust & Telemetry Strip */}
          <div className="mt-16 pt-8 border-t border-white/10 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span><Trans comment="page span visible text">100% Free For All Candidates</Trans></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span><Trans comment="page span visible text">Zero-Trust Privacy Standard</Trans></span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span><Trans comment="page span visible text">10 Regions Across Cameroon</Trans></span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span><Trans comment="page span visible text">Audited PII & ACID Security</Trans></span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Submission Modal */}
      <TestimonialSubmissionModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
      />
    </div>
  );
}
