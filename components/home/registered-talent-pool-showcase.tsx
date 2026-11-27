'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  QrCode,
  MapPin,
  Building,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RegisteredTalentPoolShowcaseProps {
  candidates: any[];
}

const TALENT_FILTERS = [
  { id: 'ALL', label: 'All 20 Verified Candidates' },
  { id: 'TECH', label: '💻 Software & Cloud' },
  { id: 'TELECOM', label: '⚡ Telecom & Networks' },
  { id: 'FINANCE', label: '🏦 Finance & Accounting' },
  { id: 'HEALTH', label: '🏥 Health & Pharma' },
  { id: 'AGRO', label: '🌾 Agronomy & Civil' },
];

export function RegisteredTalentPoolShowcase({ candidates }: RegisteredTalentPoolShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (!candidates || candidates.length === 0) return [];
    if (activeFilter === 'ALL') return candidates;

    return candidates.filter((c) => {
      const field = (c.internProfile?.fieldOfStudy?.name || c.internProfile?.targetRole || '').toLowerCase();
      const qual = (c.internProfile?.qualification || '').toLowerCase();
      const combined = `${field} ${qual}`;

      if (activeFilter === 'TECH') return combined.includes('software') || combined.includes('cloud') || combined.includes('dev') || combined.includes('fullstack') || combined.includes('data');
      if (activeFilter === 'TELECOM') return combined.includes('telecom') || combined.includes('network') || combined.includes('rf') || combined.includes('systèmes');
      if (activeFilter === 'FINANCE') return combined.includes('finance') || combined.includes('audit') || combined.includes('comptabilité') || combined.includes('banque');
      if (activeFilter === 'HEALTH') return combined.includes('pharm') || combined.includes('santé') || combined.includes('médic') || combined.includes('bio');
      if (activeFilter === 'AGRO') return combined.includes('agro') || combined.includes('génie civil') || combined.includes('mécanique') || combined.includes('bâtiment');
      return true;
    });
  }, [candidates, activeFilter]);

  const visibleCandidates = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section className="py-24 bg-[#080b18] border-b border-slate-800/80 relative overflow-hidden text-white">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-mantech px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Verified Talent Pool · Live Candidate Passports
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Pre-Screened Job Seekers &amp; Interns
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
              Every candidate holds an accredited profile with verified competencies, academic qualifications, and bilingual ATS CVs ready for direct job and internship placement across Cameroon.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/register/intern">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/20"
              >
                <QrCode className="w-3.5 h-3.5 mr-1.5" />
                Claim Your Talent Passport Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {TALENT_FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveFilter(tab.id);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === tab.id
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic High-Contrast Violet & Indigo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCandidates.map((person) => {
            const profile = person.internProfile || {};
            const passport = profile.passport || {};
            const score = profile.readinessScore || 90;

            return (
              <Link
                key={person.id}
                href={`/intern/${person.id}`}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/45 via-slate-900/95 to-purple-950/35 p-5 shadow-xl hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Top Glowing Violet Accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 opacity-70 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Avatar + Readiness Score Row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative shrink-0 flex-shrink-0">
                      <CandidateAvatar
                        src={person.avatarUrl || '/images/candidates/intern_1.jpg'}
                        name={person.fullName}
                        size={56}
                        className="ring-2 ring-indigo-400/40 group-hover:ring-purple-400 transition-all shadow-md shrink-0"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow z-10" title="Verified Candidate">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Readiness Score Badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-black font-mono shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{score}% Ready</span>
                    </div>
                  </div>

                  {/* Candidate Name & Target Role */}
                  <div className="mb-2">
                    <h3 className="font-bold text-sm sm:text-base text-white truncate group-hover:text-purple-300 transition-colors">
                      {person.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-purple-300 truncate mt-0.5">
                      {profile.targetRole || profile.qualification || 'Intern Candidate'}
                    </p>
                  </div>

                  {/* Institution & City */}
                  <div className="text-[11px] text-slate-300 mb-3 space-y-1">
                    <p className="line-clamp-1 flex items-center gap-1 text-slate-300 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{profile.institution || 'Accredited University'}</span>
                    </p>
                    <p className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{profile.city || 'Cameroon'}</span>
                      {passport.passportNumber && (
                        <span className="font-mono text-indigo-300 ml-auto">
                          {passport.passportNumber}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(profile.skills || []).slice(0, 3).map((s: any, idx: number) => {
                      const skillName = s.skill?.name || s.name || s;
                      return (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-[10px] text-indigo-200 border border-indigo-700/50 font-medium"
                        >
                          {skillName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold text-indigo-300 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all text-xs">
                    View Passport <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All / Toggle Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {filtered.length > 8 && (
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-purple-500/40 bg-purple-950/30 text-purple-300 hover:bg-purple-900/50 hover:text-white font-extrabold text-xs px-6 py-5 rounded-2xl"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1.5" />
                  Show Fewer Candidates
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1.5" />
                  Show All {filtered.length} Verified Candidates
                </>
              )}
            </Button>
          )}

          <Link href="/intern-passports">
            <Button
              size="lg"
              className="px-8 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-xl shadow-purple-900/30"
            >
              <Users className="w-4 h-4 mr-2" />
              Browse All 20 Verified Intern Passports
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
