"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "@/components/shared/section-animations";
import type { InternshipOpportunity } from "@/lib/types";
import { fieldNameOf, regionNameOf } from "@/lib/catalog-shape";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import {
  waAlertSubscribeLink,
  waCompanySalesLink,
  waSupportLink,
} from "@/lib/whatsapp";
import { APP_CONFIG } from "@/lib/config";

interface TaxonomyField {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
}

interface TaxonomyRegion {
  id: string;
  name: string;
  code: string;
  capital: string;
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
}

const TOP_FAQS = [
  {
    q: "Is MANTECH Nexus free for internship seekers?",
    a: "Yes! Intern registration, profile creation, Intern Passport generation, opportunity search, and applications are 100% free for all students and internship seekers across Cameroon.",
  },
  {
    q: "What is the Intern Passport and how is it verified?",
    a: "The Intern Passport is your professional discovery credential on MANTECH Nexus. Each passport receives a unique verification number (e.g. MN-LT-2026-XXXX). Verified host enterprises and universities can view your validated competencies, achievements, and authorized credentials with zero-trust privacy controls.",
  },
  {
    q: "How do verified companies and universities recruit interns?",
    a: "Organizations submit their credentials for platform accreditation. Once verified by MANTECH administrators, they gain access to post opportunities, discover candidates by field and skill, review authorized CVs, schedule interviews, and manage placements.",
  },
  {
    q: "What are the 3 application methods supported?",
    a: "Opportunities support three pathways: (1) Direct application on MANTECH with your Intern Passport, (2) Direct redirection to official company career portals with tracked analytics, and (3) Application via external accredited portals (such as corporate recruitment platforms or university partners).",
  },
  {
    q: "How does payment and billing work for organizations?",
    a: "MANTECH does not use automated online payment gateways. Package subscriptions, upgrades, and institutional contracts are handled transparently with human support directly on WhatsApp or Email, with invoices in XAF (FCFA).",
  },
];

export default function HomePage() {
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
  const [loading, setLoading] = useState(true);

  // Hero search form state
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [heroSelectedField, setHeroSelectedField] = useState("all");
  const [heroSelectedRegion, setHeroSelectedRegion] = useState("all");

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
        ] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/internships"),
          fetch("/api/taxonomy"),
          fetch("/api/companies"),
          fetch("/api/testimonials"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (opportunitiesRes.ok) {
          const opportunitiesData = await opportunitiesRes.json();
          setFeaturedInternships(
            (opportunitiesData.internships || []).slice(0, 3),
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
          setCompanies(
            (compData.companies || []).slice(0, 6) as VerifiedOrganization[],
          );
        }

        if (testimonialsRes.ok) {
          const testData = await testimonialsRes.json();
          setTestimonials(
            (testData.testimonials || []).slice(0, 3) as TestimonialItem[],
          );
        }
      } catch (e) {
        console.error("Failed loading live homepage data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const statsList = [
    {
      value: stats.activeInternships.toLocaleString(),
      label: "Live Opportunities",
      icon: Briefcase,
    },
    {
      value: stats.partnerCompanies.toLocaleString(),
      label: "Verified Enterprises",
      icon: Building2,
    },
    {
      value: stats.partnerUniversities.toLocaleString(),
      label: "Verified Institutions",
      icon: GraduationCap,
    },
    {
      value: stats.studentsPlaced.toLocaleString(),
      label: "Placed Interns",
      icon: Users,
    },
  ];

  const lifecycleSteps = [
    {
      num: "01",
      title: "Discovery & Match",
      desc: "Curated professional opportunities tailored to Cameroon curriculum with algorithmic readiness scoring and field-aware matching.",
    },
    {
      num: "02",
      title: "Verified Application",
      desc: "Cryptographically secured applications submitted directly or through tracked redirects to enterprise hiring portals.",
    },
    {
      num: "03",
      title: "Review & Interview",
      desc: "Enterprise interview scheduling, multi-stage status tracking, and candidate shortlisting with instant applicant notifications.",
    },
    {
      num: "04",
      title: "Selection & Placement",
      desc: "Tripartite alignment between Student, Company, and University with structured onboarding objectives and milestones.",
    },
    {
      num: "05",
      title: "Active Follow-Up",
      desc: "Placement health monitoring, structured check-ins, recruitment analytics, and permitted status updates throughout the internship.",
    },
    {
      num: "06",
      title: "Intern Passport",
      desc: "Tamper-proof verifiable digital credentials showcasing validated competencies, placements, and verified organization endorsements.",
    },
  ];

  const services = [
    {
      icon: GraduationCap,
      title: "Interns & Internship Seekers",
      description:
        "Discover verified internships across every professional field, manage applications and interviews, and earn a cryptographically verified Intern Passport.",
      features: [
        "Curated search across 10 Cameroon regions",
        "Automated readiness score calculator",
        "Application pipeline & interview tracking",
        "Permanent verifiable Intern Passport",
      ],
      color: "from-blue-600 to-indigo-700",
      href: "/internships",
    },
    {
      icon: Building2,
      title: "Host Enterprises",
      description:
        "Post openings, manage applicant stages with precision, conduct structured technical reviews, and track recruitment pipeline effortlessly.",
      features: [
        "Targeted talent sourcing by field & skill",
        "Candidate review & shortlisting pipeline",
        "Interview scheduling & placement tracking",
        "Multi-tenant organizational security",
      ],
      color: "from-amber-600 to-orange-700",
      href: "/companies",
    },
    {
      icon: Users,
      title: "Universities & Institutions",
      description:
        "Support internship placement coordination and recruit interns through a separate, permission-controlled recruiter mode.",
      features: [
        "Placement cohort tracking & outcomes",
        "Partner company network coordination",
        "Private, professional Intern Passport",
        "Accredited university verification badge",
      ],
      color: "from-emerald-600 to-teal-700",
      href: "/universities",
    },
    {
      icon: Award,
      title: "MANTECH Talent Services",
      description:
        "Dedicated marketplace support, priority assistance for verified organizations, package concierge, and featured recruitment promotions.",
      features: [
        "Priority placement support",
        "Featured opportunity promotions",
        "WhatsApp concierge for packages",
        "Full-platform audit & analytics",
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
          { id: "f1", name: "Software & Web Development", slug: "software-development", category: "Technology" },
          { id: "f2", name: "Networks & Cybersecurity", slug: "network-systems", category: "Technology" },
          { id: "f3", name: "Accounting & Finance", slug: "accounting-finance", category: "Business" },
          { id: "f4", name: "Digital Marketing & Sales", slug: "marketing", category: "Business" },
          { id: "f5", name: "Data Science & AI", slug: "data-ai", category: "Technology" },
          { id: "f6", name: "Civil & Industrial Engineering", slug: "engineering", category: "Engineering" },
          { id: "f7", name: "Law & Business Compliance", slug: "law", category: "Law" },
          { id: "f8", name: "Healthcare & Biomedical", slug: "health", category: "Healthcare" },
        ];

  // Fallback regions for explorer
  const displayRegions =
    regions.length > 0
      ? regions.slice(0, 6)
      : [
          { id: "r1", name: "Littoral", code: "CM-LT", capital: "Douala" },
          { id: "r2", name: "Centre", code: "CM-CE", capital: "Yaoundé" },
          { id: "r3", name: "South-West", code: "CM-SW", capital: "Buea" },
          { id: "r4", name: "West", code: "CM-OU", capital: "Bafoussam" },
          { id: "r5", name: "North-West", code: "CM-NW", capital: "Bamenda" },
          { id: "r6", name: "North", code: "CM-NO", capital: "Garoua" },
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
                Live Cameroon Professional Internship Ecosystem
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
                Cameroon&apos;s{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Enterprise
                </span>{" "}
                Internship Marketplace
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl">
                Connecting students, institutions, and verified enterprises across
                all 10 regions. Empowering talent discovery with our verifiable
                digital <strong>Intern Passport</strong>.
              </p>

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
                      placeholder="Role, skill, keywords..."
                      value={heroSearchQuery}
                      onChange={(e) => setHeroSearchQuery(e.target.value)}
                      className="pl-9 h-10 bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 text-xs"
                    />
                  </div>

                  <select
                    value={heroSelectedField}
                    onChange={(e) => setHeroSelectedField(e.target.value)}
                    className="h-10 px-3 rounded-md bg-slate-800/90 border border-slate-700 text-white text-xs w-full"
                    aria-label="Select Professional Field"
                  >
                    <option value="all">All Fields</option>
                    {displayFields.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={heroSelectedRegion}
                    onChange={(e) => setHeroSelectedRegion(e.target.value)}
                    className="h-10 px-3 rounded-md bg-slate-800/90 border border-slate-700 text-white text-xs w-full"
                    aria-label="Select Region"
                  >
                    <option value="all">All Regions</option>
                    {displayRegions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} ({r.capital})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Explore across IT, Engineering, Finance, Law & Healthcare
                  </span>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 ml-auto"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Internships</span>
                  </Button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/internships">
                  <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]">
                    Browse All Openings
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <a
                  href={waAlertSubscribeLink({})}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02]">
                    <WhatsAppIcon className="mr-2 h-4 w-4 text-white" />
                    WhatsApp Job Alerts
                  </Button>
                </a>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="h-11 px-6 border-slate-600 text-slate-200 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-slate-400 font-medium text-xs"
                  >
                    <Play className="mr-2 h-3.5 w-3.5 text-cyan-400" />
                    Enter Portal
                  </Button>
                </Link>
              </div>

              {/* WhatsApp-primary helper line */}
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300/90">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Receive live alerts directly on WhatsApp — fast, convenient, and free.
                </span>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-300/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Zero-Trust Identity Shield</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span>ACID Relational Core</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-400" />
                  <span>All 10 Cameroon Regions</span>
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
                    https://app.mantech-nexus.cm/dashboard/intern
                  </div>
                </div>

                {/* Dashboard inner */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        MN
                      </div>
                      <div>
                        <div className="text-xs text-white font-semibold">
                          Intern profile preview
                        </div>
                        <div className="text-[10px] text-slate-400">
                          BSc Software Engineering • UY1
                        </div>
                      </div>
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Privacy controlled
                    </div>
                  </div>

                  {/* Placement card */}
                  <div className="rounded-xl bg-blue-600/15 border border-blue-500/30 p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">
                        Professional Profile
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        Profile visibility: verified
                      </span>
                    </div>
                    <div className="text-xs text-white font-bold">
                      Qualification, field, and skills
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Location and internship preferences
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>CV access is separately authorized</span>
                      <span className="font-mono text-cyan-300">
                        85% Ready
                      </span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                      <div className="text-base font-extrabold text-white font-mono">
                        32
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Profile views
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                      <div className="text-base font-extrabold text-amber-400 font-mono">
                        18
                      </div>
                      <div className="text-[9px] text-slate-400">CV access</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-center">
                      <div className="text-base font-extrabold text-emerald-400 font-mono">
                        12
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Shortlisted
                      </div>
                    </div>
                  </div>

                  {/* Intern Passport CTA */}
                  <Link href="/dashboard/intern/passport" className="block">
                    <div className="rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-amber-500/40 p-3 flex items-center justify-between hover:bg-amber-500/25 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="text-xs text-amber-300 font-bold">
                            Intern Passport
                          </div>
                          <div className="text-[10px] text-slate-300">
                            Permanent verifiable credential
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                        View Passport
                      </span>
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
                className="absolute -top-5 -right-5 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 px-4 py-2.5 flex items-center gap-2.5 z-20"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold">
                    Verified organization access
                  </div>
                  <div className="text-[9px] text-slate-500">
                    MANTECH Support • Live Sync
                  </div>
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
                        {s.label}
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
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Trusted Partners
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
                Verified Host Enterprises & Institutions
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Accredited organizations actively evaluating candidates and hosting professional internships.
              </p>
            </div>
            <Link href="/companies">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold"
              >
                Explore All Organizations
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.length > 0
              ? companies.map((org) => (
                  <Link
                    key={org.id}
                    href={`/companies/${org.slug || org.id}`}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md hover:border-blue-300 transition-all text-center group flex flex-col justify-between"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition-transform">
                      {org.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {org.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600 mt-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                      {org.city || org.region?.name || "Cameroon"}
                    </span>
                  </Link>
                ))
              : [
                  "Orange Cameroun",
                  "MTN Cameroon",
                  "Camtel",
                  "UBA Cameroon",
                  "Afriland First Bank",
                  "Université de Yaoundé I",
                ].map((name, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                      {name.charAt(0)}
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {name}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600 mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Accredited</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* --- THE COMPLETE INTERNSHIP LIFECYCLE (SRS Section 1, 2, 3) --- */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <MotionSection motion="rise" stagger={0.12}>
            <MotionItem className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 uppercase tracking-widest text-[10px] mb-3">
                The MANTECH Differentiator
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                Complete End-to-End Internship Lifecycle
              </h2>
              <p className="mt-4 text-slate-400 text-base">
                Interns can discover opportunities and track applications while
                organizations recruit, interview, and coordinate placements.
              </p>
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
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </MotionItem>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>

      {/* --- LIVE IT INTERNSHIPS (Dynamic from Database) --- */}
      <section className="py-24 bg-slate-100 relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Live Database
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
                Featured IT Internship Opportunities
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Directly synchronized with partner enterprise technical labs across Douala, Yaoundé, and Buea.
              </p>
            </div>
            <Link href="/internships">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 font-medium text-sm"
              >
                View All Opportunities
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <MotionSection motion="slideLeft" stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredInternships.map((opp) => (
                <MotionItem key={opp.id} motion="slideLeft" className="h-full">
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold uppercase"
                        >
                          {fieldNameOf(
                            opp as unknown as Record<string, unknown>,
                          ) || "Professional Field"}
                        </Badge>
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          {opp.allowanceXAF || opp.allowance_xaf
                            ? `${(opp.allowanceXAF || opp.allowance_xaf || 0).toLocaleString()} FCFA / mo`
                            : opp.isPaid || opp.is_paid
                              ? "Paid Internship"
                              : "Accredited Experience"}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {opp.city || "Douala"},{" "}
                        {regionNameOf(
                          opp as unknown as Record<string, unknown>,
                        ) || "Littoral"}{" "}
                        •{" "}
                        {String(
                          opp.workMode || opp.work_mode || "ONSITE",
                        ).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {opp.description ||
                          opp.summary ||
                          "Professional internship opportunity with verified mentor guidance."}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(
                          (opp.requiredSkills ||
                            opp.required_skills ||
                            opp.skills ||
                            []) as string[]
                        )
                          .slice(0, 4)
                          .map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {opp.durationMonths || opp.duration_months || 3} Months
                        Duration
                      </span>
                      <Link href={`/internships/${opp.slug}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          View Opportunity
                        </Button>
                      </Link>
                    </div>
                  </div>
                </MotionItem>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>

      {/* --- SRS §20: DEDICATED INTERN PASSPORT SPOTLIGHT SECTION --- */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 uppercase tracking-widest text-[10px]">
                SRS Core Feature
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
                The Intern Passport
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Not a generic CV builder. The <strong>Intern Passport</strong> is your canonical,
                permanent discovery profile inside MANTECH. It showcases your real academic diplomas,
                verified skill endorsements, and past completed placements.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verifiable Identity</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unique passport serial number (e.g. MN-CM-2026-XXXX) recognized across institutions and enterprise recruiters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Zero-Trust Privacy</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Phone numbers and CVs are hidden from anonymous web crawlers. Only accredited, verified organizations can view authorized contacts.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/register/intern">
                  <Button className="h-12 px-7 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20">
                    Get Your Intern Passport Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard/intern/passport">
                  <Button
                    variant="outline"
                    className="h-12 px-7 border-slate-600 text-slate-200 bg-white/5 hover:bg-white/10 text-sm font-medium"
                  >
                    Passport Preview
                  </Button>
                </Link>
              </div>
            </div>

            {/* Passport Credential Mockup */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border-2 border-amber-400/40 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative space-y-6">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                      REPUBLIC OF CAMEROON // MANTECH
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-heading mt-0.5">
                      INTERN PASSPORT
                    </h3>
                  </div>
                  <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 font-mono text-[10px]">
                    VERIFIED
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white/20">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      Jean-Daniel Ndongo
                    </h4>
                    <p className="text-xs text-slate-300">
                      BSc Software Engineering • Douala
                    </p>
                    <span className="text-[10px] font-mono text-cyan-400">
                      ID: MN-LT-2026-8941
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Field:</span>
                    <span className="font-semibold text-white">Software Engineering</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Academic Level:</span>
                    <span className="font-semibold text-white">Undergraduate (BSc)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Completed Placements:</span>
                    <span className="font-semibold text-emerald-400">1 Verified (3 Months)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Readiness Score:</span>
                    <span className="font-semibold text-cyan-400 font-mono">92% Complete</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Cryptographic QR Validation</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SRS §20: PROFESSIONAL FIELDS EXPLORER --- */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Specializations
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
                Explore Professional Fields
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                MANTECH supports all disciplines in Cameroon, from IT and Engineering to Business, Law, and Health.
              </p>
            </div>
            <Link href="/fields">
              <Button variant="outline" className="text-xs font-semibold">
                Browse All Fields
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFields.map((field) => (
              <Link
                key={field.id}
                href={`/fields/${field.slug}`}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase mb-2">
                    {field.category || "Professional Field"}
                  </Badge>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base font-heading">
                    {field.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {field.description ||
                      "Browse verified opportunities, partner enterprises, and curriculum alignment."}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>View opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SRS §20: CAMEROON REGIONAL HUBS EXPLORER --- */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Territory Coverage
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
                Internships Across All 10 Regions
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Discover local on-site, hybrid, and remote opportunities across Cameroon economic centers.
              </p>
            </div>
            <Link href="/locations">
              <Button variant="outline" className="text-xs font-semibold">
                All Cameroon Locations
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayRegions.map((region) => (
              <Link
                key={region.id}
                href={`/locations/${region.code.toLowerCase()}`}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {region.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {region.capital}
                </p>
                <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                  {region.code}
                </span>
              </Link>
            ))}
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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 uppercase tracking-widest text-[10px] mb-3">
              Multi-Tenant Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Built for Cameroon&apos;s Entire Professional Ecosystem
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Dedicated interfaces tailored to the distinct workflows of every
              stakeholder in the national internship pipeline.
            </p>
          </div>

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
                          {svc.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          {svc.description}
                        </p>

                        <ul className="space-y-2 mb-6">
                          {svc.features.map((feat, fIdx) => (
                            <li
                              key={fIdx}
                              className="flex items-start gap-2 text-[11px] text-slate-400"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link href={svc.href}>
                        <Button
                          variant="outline"
                          className="w-full text-xs border-white/20 text-black hover:bg-white/10"
                        >
                          Explore Portal
                        </Button>
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
                  Security and privacy
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                  Server-Side Access Controls
                </h2>
                <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  Protected routes verify user roles and organization access on
                  the server. Sensitive CV access is authorized and audited.
                </p>
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
                        Server-Enforced RBAC
                      </h3>
                      <p className="text-xs text-slate-400">
                        Zero client-side reliance
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Every request verifies cryptographically signed session tokens
                    and strict role boundaries at the middleware and database
                    level. Students cannot inspect administrative endpoints.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Organizational Tenant Isolation
                      </h3>
                      <p className="text-xs text-slate-400">
                        Strict organizational boundaries
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Organization data requests are scoped to the signed-in
                    organization and checked by server-side authorization.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Injection & Traversal Armor
                      </h3>
                      <p className="text-xs text-slate-400">
                        Signature detection & rate limiting
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automated inspection blocks path traversal patterns (..),
                    script tags, and union-select signatures before requests ever
                    reach application logic.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Audited Activity
                      </h3>
                      <p className="text-xs text-slate-400">
                        Access and administrative event history
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sensitive CV access and platform administration actions are
                    recorded with actor and event details for review.
                  </p>
                </div>
              </div>
            </MotionSection>
          </div>
        </div>
      </section>

      {/* --- PLANS FOR COMPANIES AND UNIVERSITIES --- */}
      <section id="plans" className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Zap className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Plans
            </Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
              Internships are free for members
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Searching for internships, applying and building your Intern Passport never
              costs anything. If you run a company or a university and want to post
              internships and reach candidates, pick a plan below.
            </p>
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
                        className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                          isRecommended
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-slate-200"
                        }`}
                      >
                        {isRecommended && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow">
                            Most popular
                          </span>
                        )}

                        <h3 className="text-lg font-bold text-slate-900">
                          {plan.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {plan.description}
                        </p>

                        <p className="mt-4">
                          {isFree ? (
                            <span className="text-3xl font-extrabold text-slate-900">
                              Free
                            </span>
                          ) : (
                            <>
                              <span className="text-3xl font-extrabold text-slate-900">
                                {plan.priceXAF.toLocaleString()}
                              </span>
                              <span className="text-sm font-medium text-slate-500">
                                {" "}
                                XAF / month
                              </span>
                            </>
                          )}
                        </p>
                        {plan.features.length > 0 && (
                          <ul className="mt-5 flex-1 space-y-2 text-sm">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2">
                                <CheckCircle2
                                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                                  aria-hidden="true"
                                />
                                <span className="text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Link
                          href={isFree ? "/sign-up" : "/pricing"}
                          className="mt-6 block"
                        >
                          <Button
                            className={`w-full font-semibold ${
                              isRecommended
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            }`}
                          >
                            {isFree ? "Create free account" : "Choose this plan"}
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </Button>
                        </Link>
                      </div>
                    </MotionItem>
                  );
                })}
              </div>
            </MotionSection>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm text-slate-600">
                Our plans are being prepared. Please check back shortly.
              </p>
              <Link href="/pricing" className="mt-4 inline-block">
                <Button variant="outline">See all plans</Button>
              </Link>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-slate-600">
            Not sure which plan fits?{" "}
            <Link
              href="/contact"
              className="font-semibold text-blue-700 underline-offset-4 hover:underline"
            >
              Message our team
            </Link>{" "}
            and we will help you choose.
          </p>
        </div>
      </section>

      {/* --- SRS §20: EDITORIAL TESTIMONIALS SPOTLIGHT --- */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                Community Voices
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
                Experiences from Cameroon Interns & Recruiters
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Real feedback from candidates placed and organizations that hired through MANTECH Nexus.
              </p>
            </div>
            <Link href="/testimonials">
              <Button variant="outline" className="text-xs font-semibold">
                Read All Stories
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap text-slate-800 font-medium">
                      &ldquo;{t.message}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/80">
                    <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {t.role} • {t.company || t.region}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap text-slate-800 font-medium">
                      &ldquo;With my Intern Passport, an engineering enterprise in Douala shortlisted me within 4 days. The process was direct and transparent.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/80">
                    <h4 className="font-bold text-xs text-slate-900">Arlette M.</h4>
                    <p className="text-[11px] text-slate-500">
                      Software Intern • Douala, Littoral
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap text-slate-800 font-medium">
                      &ldquo;Filtering candidates by specific competencies and viewing authorized Intern Passports saved our recruitment team weeks of manual screening.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/80">
                    <h4 className="font-bold text-xs text-slate-900">Patrick E.</h4>
                    <p className="text-[11px] text-slate-500">
                      Talent Lead • Enterprise Partner, Yaoundé
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap text-slate-800 font-medium">
                      &ldquo;Our university faculty now has live visibility over student placements across host companies without administrative paperwork.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/80">
                    <h4 className="font-bold text-xs text-slate-900">Dr. Samuel B.</h4>
                    <p className="text-[11px] text-slate-500">
                      Placement Coordinator • Higher Institute, Buea
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- SRS §20: FREQUENTLY ASKED QUESTIONS ACCORDION --- */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="container-mantech max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              Common Questions
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
              Clear answers on how MANTECH Nexus operates for candidates, companies, and universities.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {TOP_FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="rounded-2xl border border-slate-200 bg-white px-6 shadow-sm data-[state=open]:border-blue-400"
              >
                <AccordionTrigger className="text-left font-heading text-sm sm:text-base font-bold text-slate-900 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center text-xs text-slate-500">
            Have more questions? Visit our full{" "}
            <Link href="/faq" className="text-blue-600 font-semibold underline">
              FAQ Knowledge Base
            </Link>{" "}
            or{" "}
            <a
              href={waSupportLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-semibold underline"
            >
              ask our team on WhatsApp
            </a>
            .
          </div>
        </div>
      </section>

      {/* --- HIGH IMPACT FINAL CTA BANNER --- */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white relative">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-6">
          <Badge className="bg-white/20 text-white border-white/30 uppercase tracking-widest text-[10px]">
            National Cameroon Network
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Ready to Take Your Next Professional Step?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Whether you are looking for your first verified internship or recruiting the next generation of Cameroon talent, MANTECH Nexus is ready.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/register/intern">
              <Button className="h-12 px-7 bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm shadow-xl">
                Get Your Intern Passport Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href={waCompanySalesLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="h-12 px-7 border-white/40 text-black hover:bg-white/10 font-bold text-sm gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <span>Talk with Recruitment Team</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
