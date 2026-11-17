'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Flame,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrgLogo } from '@/components/shared/org-logo';

export interface UrgentItem {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  logoUrl?: string | null;
  city: string;
  type: string; // 'INTERNSHIP' | 'FULL_TIME' | etc.
  category?: string; // 'internship' | 'job'
  field?: string;
  allowanceOrSalary?: string;
  isFeatured?: boolean;
}

interface UrgentFeaturedShowcaseProps {
  urgentItems: UrgentItem[];
  trendingItems: UrgentItem[];
}

const CATALOG_TABS = [
  { id: 'ALL', label: '🔥 All Trending' },
  { id: 'TECH', label: '💻 Tech & Software' },
  { id: 'FINANCE', label: '🏦 Banking & Finance' },
  { id: 'HEALTH', label: '🏥 Health & Medical' },
  { id: 'CULINARY', label: '🍳 Hospitality & Retail' },
  { id: 'AGRO', label: '🌱 Logistics & Trades' },
];

export function UrgentFeaturedShowcase({ urgentItems, trendingItems }: UrgentFeaturedShowcaseProps) {
  const [selectedCatalog, setSelectedCatalog] = useState('ALL');

  const filteredTrending = trendingItems.filter((item) => {
    if (selectedCatalog === 'ALL') return true;
    const f = (item.field || '').toLowerCase();
    const t = item.title.toLowerCase();
    if (selectedCatalog === 'TECH') return f.includes('tech') || f.includes('software') || f.includes('it') || t.includes('developer');
    if (selectedCatalog === 'FINANCE') return f.includes('finance') || f.includes('bank') || f.includes('account');
    if (selectedCatalog === 'HEALTH') return f.includes('health') || f.includes('medic') || f.includes('nurse');
    if (selectedCatalog === 'CULINARY') return f.includes('culinary') || f.includes('cook') || f.includes('retail') || f.includes('sales');
    if (selectedCatalog === 'AGRO') return f.includes('agro') || f.includes('logist') || f.includes('trade');
    return true;
  });

  return (
    <div className="space-y-16">
      {/* ── 1. URGENT & IMPORTANT GOLD BADGE SECTION (Mixed Jobs & Internships) ── */}
      {urgentItems && urgentItems.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#090e1d] to-slate-950 border-b border-amber-500/20 relative overflow-hidden text-white">
          {/* Glowing amber background aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 shadow-lg shadow-amber-500/10 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Important &amp; Urgent Opportunities · Gold Badge
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                  Priority Enterprise Placements &amp; Active Hiring
                </h2>
                <p className="mt-1 text-slate-400 text-xs sm:text-sm">
                  Verified host companies with urgent recruitment deadlines across Douala, Yaoundé, and Buea.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/post?type=job">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20">
                    <Zap className="w-3.5 h-3.5 mr-1 text-slate-950 fill-slate-950" />
                    Boost Listing with Gold Badge
                  </Button>
                </Link>
              </div>
            </div>

            {/* GOLD BADGE CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {urgentItems.map((item) => {
                const isInternship = item.category === 'internship' || item.type === 'INTERNSHIP';
                const linkHref = isInternship ? `/internships/${item.slug}` : `/jobs/${item.slug}`;

                return (
                  <Link
                    key={item.id}
                    href={linkHref}
                    className="group relative rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 p-5 shadow-xl hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <OrgLogo
                            name={item.companyName}
                            logoUrl={item.logoUrl}
                            size="sm"
                            type="COMPANY"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                              {item.companyName}
                            </p>
                            <p className="text-[11px] text-slate-400">{item.city}, Cameroon</p>
                          </div>
                        </div>

                        {/* Gold Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-amber-500/50 text-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          Featured
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>

                      {/* Field / Department */}
                      <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                        {item.field || 'National Placement'}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 text-[11px]">
                        {item.allowanceOrSalary || (isInternship ? 'Stipend Provided' : 'Competitive XAF')}
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[11px]">
                        Apply Now <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 2. TRENDING OPPORTUNITIES & CURATED SECTOR CATALOGS ── */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80 text-white">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Trending &amp; Sector Catalogs
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Explore Top Openings by Industry Sector
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/jobs" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                All Jobs <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/internships" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                All Internships <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Catalog Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
            {CATALOG_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCatalog(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCatalog === tab.id
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtered Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrending.slice(0, 6).map((item) => {
              const isInternship = item.category === 'internship' || item.type === 'INTERNSHIP';
              const linkHref = isInternship ? `/internships/${item.slug}` : `/jobs/${item.slug}`;

              return (
                <Link
                  key={item.id}
                  href={linkHref}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <OrgLogo
                          name={item.companyName}
                          logoUrl={item.logoUrl}
                          size="sm"
                          type="COMPANY"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                            {item.companyName}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.city}, Cameroon</p>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={`text-[9px] uppercase font-bold shrink-0 ${
                          isInternship
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {isInternship ? 'Stage' : 'Emploi'}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-mono text-emerald-400">
                      {item.allowanceOrSalary || 'Verified Posting'}
                    </span>
                    <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
