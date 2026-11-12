'use client';
import { Trans, useLingui } from '@lingui/react/macro';


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
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { OrgLogo } from '@/components/shared/org-logo';
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
} from '@/components/shared/section-animations';

export default function CompaniesPage() {
  const { t } = useLingui();
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
                <Trans comment="page span visible text">Verified Host Organizations
              </Trans></span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              <Trans comment="page h1 visible text">Partner Tech Enterprises
            </Trans></h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              <Trans comment="page p visible text">Leading telecommunications operators, software development agencies, and financial institutions actively hosting accredited IT interns across Cameroon.
            </Trans></p>

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
                  placeholder={t({ message: "Search by company, tech stack, or city...", comment: "page component placeholder attribute" })}
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
                <option value="all"><Trans comment="page option visible text">All Regions</Trans></option>
                <option value="Littoral"><Trans comment="page option visible text">Littoral (Douala)</Trans></option>
                <option value="Centre"><Trans comment="page option visible text">Centre (Yaoundé)</Trans></option>
                <option value="South-West"><Trans comment="page option visible text">South-West (Buea)</Trans></option>
                <option value="West"><Trans comment="page option visible text">West (Bafoussam)</Trans></option>
                <option value="North-West"><Trans comment="page option visible text">North-West (Bamenda)</Trans></option>
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
                <Trans comment="page h2 visible text">Accredited Host Organizations
              </Trans></h2>
              <p className="text-xs text-slate-400 mt-0.5">
                <Trans comment="page p visible text">Showing </Trans>{filteredCompanies.length} <Trans comment="page p visible text">live verified enterprise profiles
              </Trans></p>
            </div>

            <Link href="/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs shadow-md shadow-blue-600/25">
                <Trans comment="page Button visible text">Register as Host Company
              </Trans></Button>
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
              <h3 className="font-heading text-lg font-semibold text-white"><Trans comment="page h3 visible text">No companies found</Trans></h3>
              <p className="mt-1 text-sm text-slate-400 max-w-sm">
                <Trans comment="page p visible text">No organizations matched your search. Clear filters or browse all partner institutions.
              </Trans></p>
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
                          <OrgLogo
                            name={company.name}
                            logoUrl={company.logoUrl}
                            website={company.website}
                            size="lg"
                            className="group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Link href={`/companies/${company.slug || company.id}`} className="hover:underline">
                                <h3 className="font-heading text-lg font-bold text-white truncate">{company.name}</h3>
                              </Link>
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

                      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {company.website ? (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span><Trans comment="page span visible text">Website</Trans></span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500"><Trans comment="page span visible text">Verified Partner</Trans></span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/jobs?company=${encodeURIComponent(company.name)}`}>
                            <Button size="sm" variant="outline" className="h-8 px-2.5 text-[11px] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600">
                              <Briefcase className="w-3 h-3 mr-1 text-cyan-400" />
                              <span><Trans comment="page span visible text">Jobs</Trans></span>
                            </Button>
                          </Link>
                          <Link href={`/internships?company=${encodeURIComponent(company.name)}`}>
                            <Button size="sm" variant="outline" className="h-8 px-2.5 text-[11px] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600">
                              <Building2 className="w-3 h-3 mr-1 text-emerald-400" />
                              <span><Trans comment="page span visible text">Internships</Trans></span>
                            </Button>
                          </Link>
                          <Link href={`/companies/${company.slug || company.id}`}>
                            <Button size="sm" className="h-8 px-2.5 text-[11px] bg-blue-600 hover:bg-blue-500 text-white">
                              <span><Trans comment="page span visible text">Profile</Trans></span>
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
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
