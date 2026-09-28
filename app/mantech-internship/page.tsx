'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Clock,
  Banknote,
  Building2,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function MantechInternshipPortalPage() {
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const tracks = [
    { id: 'all', label: 'All IT Tracks' },
    { id: 'fld_se', label: 'Software Engineering' },
    { id: 'fld_cyber', label: 'Cybersecurity' },
    { id: 'fld_cloud', label: 'Cloud & DevOps' },
    { id: 'fld_mobile', label: 'Mobile Apps' },
    { id: 'fld_ai', label: 'AI & Data Science' },
  ];

  const filteredOpportunities = initialData.internships.filter((item) => {
    const matchesTrack = selectedTrack === 'all' || item.field_of_study_id === selectedTrack;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.city?.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Specialized Cameroon IT/ICT Internship Portal</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
                Discover Verified Technology Internships in Cameroon
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300">
                Connect with leading technology employers across Douala, Yaoundé, Buea, and all 10 regions.
                From opportunity discovery to verified completion, ManTech Nexus orchestrates the complete lifecycle.
              </p>

              {/* Search Bar */}
              <div className="mt-8 flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-300 absolute left-3.5 top-3" />
                  <Input
                    placeholder="Search role, skills, or city (Douala, Buea, Yaoundé)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-11 bg-white text-slate-900 placeholder:text-slate-500 border-none h-11"
                  />
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-11 px-6">
                  Search Roles
                </Button>
              </div>
            </div>

            {/* Student Readiness Callout Banner */}
            <div className="w-full lg:w-96 bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Preparation Checklist
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Readiness: 95%
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Student Readiness System</h3>
              <p className="text-xs text-slate-300 mb-4">
                Enhance your placement likelihood with our transparent readiness criteria before applying to top firms.
              </p>
              <div className="space-y-2 text-xs text-slate-200 mb-5">
                <div className="flex items-center justify-between">
                  <span>Profile & Academic Verification</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Verified IT Skills & Projects</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span>HND / University Matricule</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <Link href="/dashboard/student">
                <Button variant="outline" className="w-full bg-white text-blue-950 hover:bg-slate-100 font-semibold text-xs border-none">
                  Open Readiness Checklist
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-blue-800/60 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1">Verified IT Organizations</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">150,000 XAF</div>
              <div className="text-xs text-slate-400 mt-1">Top Monthly Allowance</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">10 Regions</div>
              <div className="text-xs text-slate-400 mt-1">Nationwide Coverage</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">3 Methods</div>
              <div className="text-xs text-slate-400 mt-1">Direct, Website & External</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Track Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTrack === track.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Opportunity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => {
            const isSaved = savedIds.includes(opp.id);
            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {opp.company?.name ? opp.company.name.charAt(0) : 'M'}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {opp.company?.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{opp.city}, {opp.region}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                      }`}
                      aria-label="Save opportunity"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <Link href={`/mantech-internship/opportunities/${opp.slug}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2 font-heading">
                      {opp.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                    {opp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.skills?.slice(0, 4).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-3 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.duration_months} Months</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>{opp.is_paid ? `${opp.allowance_xaf?.toLocaleString()} XAF / mo` : 'Academic Credit'}</span>
                    </div>
                  </div>

                  {/* Application Method CTA */}
                  {opp.application_method === 'mantech' && (
                    <Link href={`/mantech-internship/opportunities/${opp.slug}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2">
                        Apply on MANTECH
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  )}
                  {opp.application_method === 'company_website' && (
                    <a href={opp.application_url || '#'} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium text-xs py-2">
                        Apply on Company Website
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
                  )}
                  {opp.application_method === 'external' && (
                    <a href={opp.application_url || '#'} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs py-2">
                        Apply Externally
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
