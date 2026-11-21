'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Laptop,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrgLogo } from '@/components/shared/org-logo';
import { StaggerContainer, StaggerItem } from '@/components/shared/section-animations';
import { getHomepageRotatedPostings } from '@/lib/rotation-engine';

interface OpportunityItem {
  id: string;
  slug: string;
  title: string;
  companyName?: string;
  organization?: {
    name?: string;
    logoUrl?: string | null;
  };
  city?: string;
  type?: string;
  workMode?: string;
  work_mode?: string;
  salaryMinXAF?: number;
  salaryMaxXAF?: number;
  allowanceXAF?: number;
  allowance_xaf?: number;
  isPaid?: boolean;
  is_paid?: boolean;
  description?: string;
  summary?: string;
  requiredSkills?: string[];
  required_skills?: string[];
  skills?: string[];
  durationMonths?: number;
  duration_months?: number;
  field?: string;
  category: 'job' | 'internship';
}

interface FeaturedOpportunitiesHubProps {
  jobs: any[];
  internships: any[];
}

export function FeaturedOpportunitiesHub({ jobs, internships }: FeaturedOpportunitiesHubProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'INTERNSHIPS' | 'JOBS'>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  // Format and tag items
  const formattedJobs: OpportunityItem[] = useMemo(() => {
    return (jobs || [])
      .filter((j) => !j.isVisualFlyerOnly && !j.isLinkOnly)
      .map((j) => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        companyName: j.organization?.name || j.companyName || 'Verified Enterprise',
        organization: j.organization,
        city: j.city || 'Douala',
        type: (j.type || 'FULL_TIME').toUpperCase(),
        workMode: (j.workMode || 'ONSITE').toUpperCase(),
        salaryMinXAF: j.salaryMinXAF,
        salaryMaxXAF: j.salaryMaxXAF,
        description: j.description,
        requiredSkills: j.requiredSkills || [],
        category: 'job',
      }));
  }, [jobs]);

  const formattedInternships: OpportunityItem[] = useMemo(() => {
    return (internships || [])
      .filter((opp) => !opp.isVisualFlyerOnly && !opp.isLinkOnly)
      .map((opp) => ({
        id: opp.id,
        slug: opp.slug,
        title: opp.title,
        companyName: opp.organization?.name || opp.companyName || 'Verified Enterprise',
        organization: opp.organization,
        city: opp.city || 'Douala',
        type: 'INTERNSHIP',
        workMode: (opp.workMode || opp.work_mode || 'ONSITE').toUpperCase(),
        allowanceXAF: opp.allowanceXAF || opp.allowance_xaf,
        isPaid: Boolean(opp.allowanceXAF || opp.allowance_xaf || opp.isPaid || opp.is_paid),
        description: opp.description || opp.summary,
        requiredSkills: opp.requiredSkills || opp.required_skills || opp.skills || [],
        durationMonths: opp.durationMonths || opp.duration_months || 3,
        category: 'internship',
      }));
  }, [internships]);

  // Combined opportunities interleaved (1 job, 1 internship, etc.)
  const combinedList: OpportunityItem[] = useMemo(() => {
    const list: OpportunityItem[] = [];
    const maxLen = Math.max(formattedJobs.length, formattedInternships.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < formattedInternships.length) list.push(formattedInternships[i]);
      if (i < formattedJobs.length) list.push(formattedJobs[i]);
    }
    return list;
  }, [formattedJobs, formattedInternships]);

  // Current display list based on active tab & city with 30-post capacity & hourly rotation loop
  const displayItems = useMemo(() => {
    let base =
      activeTab === 'INTERNSHIPS'
        ? formattedInternships
        : activeTab === 'JOBS'
        ? formattedJobs
        : combinedList;

    if (selectedCity !== 'ALL') {
      base = base.filter((item) =>
        (item.city || '').toLowerCase().includes(selectedCity.toLowerCase())
      );
    }
    // Rotates 10 postings per hour from pool, displaying up to 30 posts on homepage
    return getHomepageRotatedPostings(base as any, 30, 10) as unknown as (OpportunityItem & { isOutdatedGrace?: boolean })[];
  }, [activeTab, selectedCity, formattedInternships, formattedJobs, combinedList]);

  return (
    <section className="py-20 bg-[#070d19] border-b border-slate-800/80 relative overflow-hidden text-white">
      {/* Background radial lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/15 via-emerald-500/15 to-teal-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Verified Opportunities Hub · Equal Jobs &amp; Internships
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Essential Careers &amp; Academic Placements
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
              Curated openings directly from accredited enterprises and technical partners across Cameroon. Zero phantom postings — strictly verified opportunities.
            </p>
          </div>

          {/* Quick Direct Links */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/internships">
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white font-bold text-xs rounded-xl"
              >
                <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                All Internships
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/40 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 hover:text-white font-bold text-xs rounded-xl"
              >
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                All Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab & City Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 mb-8 backdrop-blur-xl">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              All Verified ({combinedList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('INTERNSHIPS')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'INTERNSHIPS'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              Internships ({formattedInternships.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('JOBS')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'JOBS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              Career Jobs ({formattedJobs.length})
            </button>
          </div>

          {/* Regional Pill Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold text-slate-400 px-2 sm:px-0">
            <span className="text-slate-500 mr-1 hidden sm:inline">Region:</span>
            {['ALL', 'Douala', 'Yaoundé', 'Buea'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCity === city
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'hover:text-slate-200'
                }`}
              >
                {city === 'ALL' ? 'Nationwide' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid with Distinct High-Contrast Themes */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.length > 0 ? (
            displayItems.map((item) => {
              const isInternship = item.category === 'internship';
              const linkHref = isInternship ? `/internships/${item.slug}` : `/jobs/${item.slug}`;

              return (
                <StaggerItem key={item.id} className="h-full">
                  <Link
                    href={linkHref}
                    className={`group flex flex-col h-full justify-between rounded-3xl p-6 transition-all duration-300 relative overflow-hidden shadow-xl hover:-translate-y-1.5 ${
                      isInternship
                        ? 'border-2 border-emerald-500/35 bg-gradient-to-br from-emerald-950/45 via-slate-900/95 to-teal-950/30 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/15'
                        : 'border-2 border-blue-500/35 bg-gradient-to-br from-blue-950/45 via-slate-900/95 to-indigo-950/30 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/15'
                    }`}
                  >
                    {/* Top Accent bar */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1 transition-opacity ${
                        isInternship
                          ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-80 group-hover:opacity-100'
                          : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 opacity-80 group-hover:opacity-100'
                      }`}
                    />

                    <div>
                      {/* Employer & Category Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <OrgLogo
                            name={item.companyName || 'Verified Employer'}
                            logoUrl={item.organization?.logoUrl}
                            size="md"
                            type="COMPANY"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                              {item.companyName}
                            </p>
                            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.city}, Cameroon
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-lg ${
                              isInternship
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            }`}
                          >
                            {isInternship ? 'Stage' : item.type?.replace('_', ' ')}
                          </Badge>
                          {item.isOutdatedGrace && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              ⚠️ Expiré (7j restants)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Position Title */}
                      <h3
                        className={`text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:transition-colors line-clamp-2 min-h-[3rem] ${
                          isInternship ? 'group-hover:text-emerald-300' : 'group-hover:text-blue-300'
                        }`}
                      >
                        {item.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
                        {item.description ||
                          'Verified opportunity with real production responsibility and mentor guidance in Cameroon.'}
                      </p>

                      {/* Work Mode & Location Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950/70 text-purple-200 border border-purple-700/50">
                          {item.workMode || 'ONSITE'}
                        </span>
                      </div>

                      {/* Required Skills Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(item.requiredSkills || []).slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                              isInternship
                                ? 'bg-teal-950/70 text-teal-200 border-teal-700/50'
                                : 'bg-cyan-950/70 text-cyan-200 border-cyan-700/50'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        {isInternship ? (
                          <span className="text-amber-400 font-extrabold font-mono text-xs bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                            {item.allowanceXAF
                              ? `${item.allowanceXAF.toLocaleString()} XAF / mo`
                              : item.isPaid
                              ? 'Paid Placement'
                              : 'Convention Stage'}
                          </span>
                        ) : (
                          <span className="text-amber-400 font-extrabold font-mono text-xs bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                            {item.salaryMinXAF
                              ? `${item.salaryMinXAF.toLocaleString()} XAF`
                              : 'Competitive Salary'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-white font-bold text-xs transition-colors">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })
          ) : (
            <div className="col-span-3 py-16 text-center text-slate-400">
              No matching postings in {selectedCity}. Try selecting nationwide or view all catalogs.
            </div>
          )}
        </StaggerContainer>

        {/* Bottom Navigation Actions */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/internships">
            <Button size="lg" className="px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/30">
              <GraduationCap className="w-4 h-4 mr-2" />
              Explore All Cameroon Internships
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" className="px-8 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-900/30">
              <Briefcase className="w-4 h-4 mr-2" />
              Explore All Cameroon Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
