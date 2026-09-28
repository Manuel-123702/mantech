'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Users,
  Building2,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Download,
} from 'lucide-react';

export default function UniversityDashboardPage() {
  const university = initialData.universities[2]; // ENSPY
  const placement = initialData.placement;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* University Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 font-extrabold text-2xl font-heading">
              {university.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-heading">
                  {university.name}
                </h1>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Accredited University Partner
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {university.type} • {university.city}, {university.region} • Dean of Academic Internships: Dr. Paul Tchinda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/career-passport" target="_blank">
              <Button variant="outline" className="text-xs font-semibold border-emerald-600 text-emerald-800 hover:bg-emerald-50">
                University Passport
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Button variant="outline" className="text-xs font-semibold">
              <Download className="w-4 h-4 mr-1.5" />
              Export Placement Audit (CSV)
            </Button>
          </div>
        </div>

        {/* Academic Internship Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled IT Students</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">240</div>
            <div className="text-[11px] text-emerald-600 mt-1">100% Verified Matricules</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Placed in Industry</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">218</div>
            <div className="text-[11px] text-blue-700 mt-1">90.8% Placement rate</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Host Companies</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">18</div>
            <div className="text-[11px] text-slate-500 mt-1">Across 4 Cameroon regions</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Credits</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">100%</div>
            <div className="text-[11px] text-slate-500 mt-1">Standardized MINESUP compliance</div>
          </div>
        </div>

        {/* Placed Students Oversight List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Active Institutional Placements & Compliance
            </h2>
            <Badge className="bg-blue-50 text-blue-700">Academic Year 2026/2027</Badge>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">David Kamga</span>
                <span className="text-slate-400">| Matricule: 22UY0481</span>
              </div>
              <div className="text-slate-600 mt-0.5">
                Host: <span className="font-semibold text-slate-800">{placement.company_name}</span> • Role: {placement.internship_title}
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Supervised by: {placement.supervisor_name}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-emerald-600 font-bold">3 Logbooks Approved</div>
                <div className="text-slate-400 text-[11px]">Academic Credit Eligible</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Inspect Logbook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
