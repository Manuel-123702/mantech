'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  Globe,
  Loader2,
  Inbox,
  BadgeCheck,
  Briefcase,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Company } from '@/lib/types';
import { industryNameOf, regionNameOf } from '@/lib/catalog-shape';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
} from '@/components/shared/section-animations';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.companies || []);
        }
      } catch (err) {
        console.error('Failed fetching live companies:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const shape = c as unknown as Record<string, unknown>;
    const needle = search.trim().toLowerCase();

    const haystack = [c.name, industryNameOf(shape), c.city, regionNameOf(shape)]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(' ')
      .toLowerCase();

    const matchesSearch = needle === '' || haystack.includes(needle);
    const matchesRegion =
      selectedRegion === 'all' || regionNameOf(shape) === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="overflow-hidden">
      {/* ───── HERO SECTION WITH BLUR-REVEAL MOTION ───── */}
      <section
        className="relative py-20 lg:py-28 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/company_tech_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/80 backdrop-blur-[2px]" />

        <div className="container-mantech relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 25 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Host Organizations
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Partner Tech Enterprises
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Leading telecommunications operators, software development agencies, and financial institutions actively hosting accredited IT interns across Cameroon.
            </p>

            {/* Live Search and Filter Bar with spring interaction */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by company, tech stack, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-400 h-11 focus:border-blue-400 transition-colors"
                />
              </div>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="h-11 px-3.5 rounded-md bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-blue-400 transition-colors"
              >
                <option value="all">All Regions</option>
                <option value="Littoral">Littoral (Douala)</option>
                <option value="Centre">Centre (Yaoundé)</option>
                <option value="South-West">South-West (Buea)</option>
                <option value="West">West (Bafoussam)</option>
                <option value="North-West">North-West (Bamenda)</option>
              </select>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── COMPANIES GRID WITH SPRING POP ANIMATION ───── */}
      <section className="py-24 bg-[#080d19] border-b border-slate-800/80 relative overflow-hidden min-h-[500px] text-white">
        {/* Backdrop tech image & ambient lighting */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <Image src="/images/company_tech_bg.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d19]/95 via-[#080d19]/90 to-[#080d19] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Accredited Host Organizations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredCompanies.length} live verified enterprise profiles
              </p>
            </div>

            <Link href="/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs shadow-md shadow-blue-600/25">
                Register as Host Company
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Inbox className="h-12 w-12 text-slate-500 mb-3" />
              <h3 className="font-heading text-lg font-semibold text-white">No companies found</h3>
              <p className="mt-1 text-sm text-slate-400 max-w-sm">
                No organizations matched your search. Clear filters or browse all partner institutions.
              </p>
            </motion.div>
          ) : (
            <MotionSection motion="pop" stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => {
                const shape = company as unknown as Record<string, unknown>;
                const city = company.city ?? null;
                const region = regionNameOf(shape);
                const location = [city, region].filter(Boolean).join(', ');

                return (
                  <MotionItem key={company.id} motion="pop">
                    <AnimatedCard className="h-full rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-7 shadow-xl hover:shadow-2xl hover:border-blue-400 hover:bg-slate-800/90 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group text-white">
                      <div>
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform">
                            <Building2 className="h-7 w-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-heading text-lg font-bold text-white truncate">{company.name}</h3>
                              <BadgeCheck className="h-5 w-5 shrink-0 text-blue-400" />
                            </div>
                            {industryNameOf(shape) && (
                              <p className="text-xs text-slate-400 font-medium truncate">{industryNameOf(shape)}</p>
                            )}
                          </div>
                        </div>

                        {company.description && (
                          <p className="mt-4 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                            {company.description}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {location && (
                            <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              <MapPin className="mr-1 h-3 w-3" />
                              {location}
                            </Badge>
                          )}
                          {(company.size ?? company.size_bracket) && (
                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                              {company.size ?? company.size_bracket}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Website</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">Verified Partner</span>
                        )}

                        <Link href={`/mantech-internship?company=${encodeURIComponent(company.name)}`}>
                          <Button size="sm" variant="ghost" className="text-xs text-slate-300 hover:text-white hover:bg-slate-800">
                            <span>View Openings</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </AnimatedCard>
                  </MotionItem>
                );
              })}
            </MotionSection>
          )}
        </div>
      </section>
    </div>
  );
}
