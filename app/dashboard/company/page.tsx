'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const company = initialData.companies[0]; // MTN Cameroon
  const opportunities = initialData.internships.filter((item) => item.company_id === company.id);
  const applications = initialData.applications;

  const [activeTab, setActiveTab] = useState<'pipeline' | 'postings' | 'interns' | 'history'>('pipeline');
  const [pipelineState, setPipelineState] = useState(applications);

  const handleStatusUpdate = (appId: string, newStatus: any) => {
    setPipelineState((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Company Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-extrabold text-2xl font-heading">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-heading">
                  {company.name}
                </h1>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Verified Enterprise Host
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {company.industry} • Headquarters: {company.city}, {company.region} • Recruiter: Brenda Ngu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/career-passport" target="_blank">
              <Button variant="outline" className="text-xs font-semibold border-amber-600 text-amber-800 hover:bg-amber-50">
                Company Passport
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
              <Plus className="w-4 h-4 mr-1.5" />
              Create IT Internship
            </Button>
          </div>
        </div>

        {/* High-Level Enterprise KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Roles</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{opportunities.length}</div>
            <div className="text-[11px] text-emerald-600 mt-1">All verified & active</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applicants</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{pipelineState.length}</div>
            <div className="text-[11px] text-blue-600 mt-1">Average readiness 92%</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Interns</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">1</div>
            <div className="text-[11px] text-slate-500 mt-1">Supervised by Eng. Fon</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Health Index</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">100%</div>
            <div className="text-[11px] text-slate-500 mt-1">No overdue reports</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pipeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Candidate Pipeline ({pipelineState.length})
          </button>
          <button
            onClick={() => setActiveTab('postings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'postings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Internship Postings ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('interns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interns' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active Interns (1)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Company History
          </button>
        </div>

        {/* TAB 1: CANDIDATE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            {pipelineState.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      David Kamga
                    </h3>
                    <Badge className="bg-blue-50 text-blue-700 text-[10px] font-bold">
                      Readiness: {app.readiness_score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    University of Yaoundé I • BSc Software Engineering • Applied: 05 Aug 2026
                  </p>
                  <p className="text-xs text-slate-700 max-w-xl line-clamp-2">
                    {app.cover_letter}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                    className="text-xs"
                  >
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(app.id, 'interview')}
                    className="text-xs"
                  >
                    Schedule Interview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(app.id, 'internship_active')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    Confirm Placement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: POSTINGS */}
        {activeTab === 'postings' && (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 font-heading">{opp.title}</h3>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Published</Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    {opp.city}, {opp.region} • {opp.duration_months} Months • Allowance: {opp.allowance_xaf?.toLocaleString()} XAF
                  </div>
                </div>
                <Link href={`/mantech-internship/opportunities/${opp.slug}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Live Portal Page
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ACTIVE INTERNS */}
        {activeTab === 'interns' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Active Supervised Interns
              </h3>
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">All Healthy</Badge>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">David Kamga</div>
                <div className="text-slate-500">Role: Full-Stack Software Engineering Intern</div>
                <div className="text-blue-700 font-semibold mt-1">Supervisor: Eng. Martin Fon</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">3 Logbooks Approved</div>
                <div className="text-slate-400 text-[11px]">Period: Sep 2026 — Feb 2027</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              Company Operational History
            </h3>
            {initialData.auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-amber-800">{log.action}</span>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
