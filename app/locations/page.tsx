'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTaxonomy } from '@/lib/use-taxonomy';
import {
  MotionSection,
  MotionItem,
  AnimatedCard,
  FloatingBadge,
} from '@/components/shared/section-animations';

type MarketplaceStats = {
  activeInternships: number;
  partnerCompanies: number;
  partnerUniversities: number;
};

export default function LocationsPage() {
  const [search, setSearch] = useState('');
  const { regions, loading: regionsLoading, error: regionsError } = useTaxonomy();
  const [marketStats, setMarketStats] = useState<MarketplaceStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const filtered = regions.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.locations.some((location) => location.city.toLowerCase().includes(search.toLowerCase())) ||
      r.capital.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Marketplace statistics are currently unavailable.');
        const data = (await response.json()) as MarketplaceStats;
        if (!cancelled) {
          setMarketStats(data);
          setStatsError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setStatsError(error instanceof Error ? error.message : 'Marketplace statistics are currently unavailable.');
        }
      }
    }
    void loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const REGION_COLORS = [
    'from-blue-600 to-cyan-600',
    'from-emerald-600 to-teal-600',
    'from-violet-600 to-purple-600',
    'from-orange-500 to-amber-500',
    'from-red-600 to-rose-600',
    'from-pink-600 to-rose-500',
    'from-yellow-600 to-orange-600',
    'from-indigo-600 to-blue-700',
    'from-green-600 to-emerald-600',
    'from-slate-600 to-slate-700',
  ];

  return (
    <div className="bg-[#070d18] min-h-screen overflow-hidden">
      {/* ── HERO WITH BLUR REVEAL ── */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.3'%3E%3Cpolygon fill='%2364748b' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 25 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingBadge className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Cameroon · {regions.length} Administrative Regions
              </span>
            </FloatingBadge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Find Internships by Location
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Explore internship opportunities across Cameroon, with regions and cities sourced from the live marketplace taxonomy.
            </p>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative mt-8 max-w-md mx-auto"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search region or city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15 focus:border-teal-400 backdrop-blur-sm h-11"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── REGIONS GRID WITH SLIDE-LEFT STAGGER ── */}
      <section className="py-24 relative overflow-hidden border-b border-slate-800/60" style={{ background: 'linear-gradient(180deg, #070d18 0%, #0a1220 50%, #070e18 100%)' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity" style={{ backgroundImage: "url('/images/portal_tech_bg.jpg')" }} />
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          {regionsError ? (
            <div role="alert" className="py-16 text-center text-sm text-red-400">{regionsError}</div>
          ) : regionsLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading regions and cities…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No regions found for &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <MotionSection motion="slideLeft" stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((region, idx) => {
                const gradient = REGION_COLORS[idx % REGION_COLORS.length];
                const cities = region.locations.map((location) => location.city);

                return (
                  <MotionItem key={region.id} motion="slideLeft">
                    <AnimatedCard className="h-full">
                      <Link
                        href={`/locations/${encodeURIComponent(region.code.toLowerCase())}`}
                        className="group block h-full bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-lg hover:shadow-2xl hover:border-teal-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Colored header */}
                        <div className={`bg-gradient-to-br ${gradient} p-5 relative overflow-hidden`}>
                          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                          <div className="relative z-10 flex items-start justify-between">
                            <div>
                              <p className="text-xs text-white/70 uppercase tracking-wide mb-0.5 font-semibold">Region</p>
                              <h2 className="font-heading font-bold text-white text-xl">{region.name}</h2>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                              <MapPin className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="text-xs text-white/90 font-medium">
                              Capital: <strong className="text-white">{region.capital}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Cities list */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2.5 font-bold">Key Cities</p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {cities.map((city) => (
                                <span key={city} className="px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300 text-xs font-medium border border-slate-600/50">
                                  {city}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-end pt-3 border-t border-slate-700/50">
                            <span className="text-xs font-semibold text-teal-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                              View Opportunities <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </AnimatedCard>
                  </MotionItem>
                );
              })}
            </MotionSection>
          )}
        </div>
      </section>

      {/* ── STATS BANNER WITH SCALE-IN ── */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #070e18 0%, #080d1c 100%)' }}>
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionSection motion="scaleIn" stagger={0.08} className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Administrative Regions', value: String(regions.length) },
              { label: 'Cities & Towns', value: String(regions.reduce((total, region) => total + region.locations.length, 0)) },
              { label: 'Verified Organizations', value: marketStats ? String(marketStats.partnerCompanies + marketStats.partnerUniversities) : '—' },
              { label: 'Active Opportunities', value: marketStats ? String(marketStats.activeInternships) : '—' },
            ].map((stat) => (
              <MotionItem key={stat.label} motion="scaleIn">
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-teal-500/10 hover:border-teal-500/40 transition-all">
                  <div className="text-3xl font-extrabold text-teal-400 font-heading">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">{stat.label}</div>
                </div>
              </MotionItem>
            ))}
          </MotionSection>
          {statsError && <p role="status" className="mt-4 text-center text-xs text-slate-500">{statsError}</p>}
        </div>
      </section>
    </div>
  );
}
