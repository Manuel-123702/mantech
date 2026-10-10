"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Globe,
  BadgeCheck,
  Briefcase,
  Users,
  ArrowRight,
  Clock,
  Banknote,
  ExternalLink,
  Loader2,
  ChevronLeft,
  Mail,
  Phone,
} from "lucide-react";
import type { Company, InternshipOpportunity } from "@/lib/types";
import { industryNameOf, regionNameOf, fieldNameOf } from "@/lib/catalog-shape";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetch_() {
      try {
        const res = await fetch(`/api/companies/${slug}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setCompany(data.company);
        setOpportunities(data.opportunities || []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !company) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <Building2 className="w-16 h-16 text-slate-600" />
        <h1 className="text-2xl font-bold">Company Not Found</h1>
        <p className="text-slate-400">
          This organization profile doesn&apos;t exist or isn&apos;t published
          yet.
        </p>
        <Link href="/companies">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Companies
          </Button>
        </Link>
      </div>
    );
  }

  const isVerified =
    company.verification_status === "verified" ||
    company.verificationStatus === "verified";

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO BANNER ── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2364748b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All Companies
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            {/* Logo */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center shrink-0">
              <Building2 className="w-12 h-12 lg:w-16 lg:h-16 text-blue-600" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-white">
                  {company.name}
                </h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-5">
                {industryNameOf(
                  company as unknown as Record<string, unknown>,
                ) && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />{" "}
                    {industryNameOf(
                      company as unknown as Record<string, unknown>,
                    )}
                  </span>
                )}
                {(company.city ||
                  regionNameOf(
                    company as unknown as Record<string, unknown>,
                  )) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {company.city}
                    {regionNameOf(company as unknown as Record<string, unknown>)
                      ? `, ${regionNameOf(company as unknown as Record<string, unknown>)}`
                      : ""}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Globe className="w-4 h-4" />{" "}
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {company.size && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> {company.size}
                  </span>
                )}
              </div>

              {company.description && (
                <p className="text-slate-300 leading-relaxed max-w-3xl">
                  {company.description}
                </p>
              )}
            </div>

            {/* Stats pill */}
            <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center min-w-[140px]">
              <div className="text-3xl font-extrabold text-cyan-400">
                {opportunities.length}
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                Open Positions
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16">
        <div className="container-mantech px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Open Internship Opportunities{" "}
              <span className="text-slate-400 font-normal text-base ml-1">
                ({opportunities.length})
              </span>
            </h2>

            {opportunities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  No active openings at this time. Check back soon.
                </p>
              </div>
            ) : (
              opportunities.map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
                        {opp.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {opp.city},{" "}
                          {regionNameOf(
                            opp as unknown as Record<string, unknown>,
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opp.duration_weeks || opp.durationMonths}{" "}
                          {opp.duration_weeks ? "Weeks" : "Months"}
                        </span>
                        {(opp.is_paid || opp.isPaid) && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Banknote className="w-3 h-3" />
                            {opp.stipend_min
                              ? `${opp.stipend_min.toLocaleString()} XAF`
                              : "Paid"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {(opp.work_mode || opp.workMode || "onsite").replace(
                          "-",
                          " ",
                        )}
                      </Badge>
                      {(opp.featured || opp.isFeatured) && (
                        <Badge className="text-xs bg-amber-500 text-white border-0">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {opp.summary && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {opp.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(opp.skills_required || opp.requiredSkills || [])
                      .slice(0, 5)
                      .map((sk: string) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                        >
                          {sk}
                        </span>
                      ))}
                  </div>

                  <Link href={`/internships/${opp.slug}`}>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 rounded-xl"
                    >
                      View & Apply <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
                Contact & Details
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {company.email && (
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${company.email}`}
                      className="hover:text-blue-600 break-all transition-colors"
                    >
                      {company.email}
                    </a>
                  </li>
                )}
                {(company as any).contact_phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{(company as any).contact_phone}</span>
                  </li>
                )}
                {company.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{company.address}</span>
                  </li>
                )}
                {company.website && (
                  <li className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors break-all"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Apply CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white text-center shadow-lg">
              <Briefcase className="w-9 h-9 mx-auto mb-3 opacity-90" />
              <h3 className="font-heading font-bold text-base mb-1">
                Ready to Intern Here?
              </h3>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                Browse all open positions and submit your verified Intern
                Passport.
              </p>
              <Link href={`/internships?company=${company.id}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl w-full bg-white text-blue-700 hover:bg-blue-50"
                >
                  Browse Openings
                </Button>
              </Link>
            </div>

            {/* Back to companies */}
            <Link
              href="/companies"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> View All Companies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
