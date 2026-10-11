"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  Banknote,
  Cpu,
  Shield,
  BarChart2,
  DollarSign,
  Megaphone,
  Users,
  Package,
  Cog,
  Heart,
  Scale,
} from "lucide-react";
import type { InternshipOpportunity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaxonomy } from "@/lib/use-taxonomy";
import { regionNameOf } from "@/lib/catalog-shape";

const FIELD_ICONS: Record<string, React.ElementType> = {
  "software-cloud-engineering": Cpu,
  "cybersecurity-networks": Shield,
  "data-science-ai": BarChart2,
  "finance-accounting": DollarSign,
  "marketing-communications": Megaphone,
  "human-resources": Users,
  "supply-chain-logistics": Package,
  "engineering-industrial": Cog,
  "healthcare-biotech": Heart,
  "legal-compliance": Scale,
};

const FIELD_GRADIENTS: Record<string, string> = {
  "software-cloud-engineering": "from-blue-600 to-cyan-600",
  "cybersecurity-networks": "from-red-600 to-rose-600",
  "data-science-ai": "from-violet-600 to-purple-600",
  "finance-accounting": "from-emerald-600 to-teal-600",
  "marketing-communications": "from-orange-500 to-amber-500",
  "human-resources": "from-pink-600 to-rose-500",
  "supply-chain-logistics": "from-slate-600 to-slate-700",
  "engineering-industrial": "from-yellow-600 to-orange-600",
  "healthcare-biotech": "from-green-600 to-emerald-600",
  "legal-compliance": "from-indigo-600 to-blue-700",
};

export default function FieldDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    fields,
    loading: taxonomyLoading,
    error: taxonomyError,
  } = useTaxonomy();
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [opportunityError, setOpportunityError] = useState<string | null>(null);

  const field = fields.find((item) => item.slug === slug);

  useEffect(() => {
    if (!slug) return;
    async function fetch_() {
      try {
        const res = await fetch(
          `/api/internships?field=${encodeURIComponent(slug)}`,
        );
        if (!res.ok)
          throw new Error("Could not load opportunities for this field.");
        const data = await res.json();
        setOpportunities(data.internships || []);
        setOpportunityError(null);
      } catch (error) {
        setOpportunityError(
          error instanceof Error
            ? error.message
            : "Could not load opportunities for this field.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [slug]);

  if (taxonomyError) {
    return (
      <div
        role="alert"
        className="min-h-[50vh] flex items-center justify-center p-8 text-center text-red-700"
      >
        {taxonomyError}
      </div>
    );
  }

  if (!field && !loading && !taxonomyLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <Briefcase className="w-16 h-16 text-slate-600" />
        <h1 className="text-2xl font-bold">Field Not Found</h1>
        <Link href="/fields">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <ChevronLeft className="w-4 h-4 mr-1" /> All Fields
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = slug ? FIELD_ICONS[slug] || Briefcase : Briefcase;
  const gradient = slug
    ? FIELD_GRADIENTS[slug] || "from-blue-600 to-cyan-600"
    : "from-blue-600 to-cyan-600";
  const isLoading = loading || taxonomyLoading;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO ── */}
      <section
        className={`relative py-20 lg:py-28 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/fields"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All Fields
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-5 backdrop-blur-sm">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-3xl lg:text-5xl font-extrabold text-white mb-3">
              {field?.name ?? slug?.replace(/-/g, " ")}
            </h1>
            <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-2xl">
              {field?.category} · {field?.specializations.length}{" "}
              specializations available.
            </p>

            {field?.specializations && (
              <div className="flex flex-wrap gap-2 mt-5">
                {field.specializations.map((spec) => (
                  <span
                    key={spec.id}
                    className="px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium border border-white/20 backdrop-blur-sm"
                  >
                    {spec.name}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── OPPORTUNITIES ── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-blue-50/25 border-b border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Available Positions
              {!isLoading && (
                <span className="text-slate-400 font-normal text-base ml-2">
                  ({opportunities.length})
                </span>
              )}
            </h2>
            <Link
              href="/internships"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : opportunityError ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700"
            >
              {opportunityError}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center shadow-sm">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                No active listings in this field right now.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                New opportunities are posted weekly. Check back soon!
              </p>
              <Link
                href="/internships"
                className="inline-flex mt-5 items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                View all open internships <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 transition-all p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-heading font-bold text-slate-900 text-base leading-snug">
                      {opp.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-xs capitalize shrink-0"
                    >
                      {(opp.work_mode || opp.workMode || "onsite").replace(
                        "-",
                        " ",
                      )}
                    </Badge>
                  </div>

                  <p className="text-xs font-semibold text-blue-600 mb-3">
                    {opp.company_id?.toUpperCase()}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {opp.city},{" "}
                      {regionNameOf(opp as unknown as Record<string, unknown>)}
                    </span>
                    {opp.duration_weeks && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {opp.duration_weeks} weeks
                      </span>
                    )}
                    {(opp.is_paid || opp.isPaid) && opp.stipend_min && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Banknote className="w-3 h-3" />
                        {opp.stipend_min.toLocaleString()} XAF
                      </span>
                    )}
                  </div>

                  {opp.summary && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {opp.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(opp.skills_required || opp.requiredSkills || [])
                      .slice(0, 4)
                      .map((sk: string) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100"
                        >
                          {sk}
                        </span>
                      ))}
                  </div>

                  <Link href={`/internships/${opp.slug}`}>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-1.5"
                    >
                      View & Apply <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
