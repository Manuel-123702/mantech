'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Star,
  Sparkles,
  Send,
  History,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const profile = initialData.profiles[0];
  const placement = initialData.placement;
  const reports = initialData.reports;
  const evaluations = initialData.evaluations;
  const applications = initialData.applications;

  const [activeTab, setActiveTab] = useState<'overview' | 'logbook' | 'applications' | 'history'>('overview');
  const [newLogSummary, setNewLogSummary] = useState('');
  const [newLogActivities, setNewLogActivities] = useState('');
  const [submittedReports, setSubmittedReports] = useState(reports);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogSummary || !newLogActivities) return;

    const newReport = {
      id: `rep_${Date.now()}`,
      placement_id: placement.id,
      report_type: 'weekly' as const,
      week_number: submittedReports.length + 1,
      period_start: new Date().toISOString().split('T')[0],
      period_end: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      summary: newLogSummary,
      activities: newLogActivities,
      challenges: 'None reported.',
      skills_applied: ['Next.js', 'Prisma', 'TypeScript'],
      status: 'submitted',
      feedback: 'Pending supervisor review.',
      supervisor_signature: 'Pending',
      submitted_at: new Date().toISOString(),
    };

    setSubmittedReports([...submittedReports, newReport]);
    setNewLogSummary('');
    setNewLogActivities('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Student Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold font-heading shadow-md">
              {profile.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-heading">
                  {profile.full_name}
                </h1>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-medium">
                  Verified Intern
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                University of Yaoundé I • BSc Software Engineering (Matricule: 22UY0481)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/career-passport" target="_blank">
              <Button variant="outline" className="text-xs font-semibold border-blue-600 text-blue-700 hover:bg-blue-50">
                Open Career Passport
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/mantech-internship">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                Explore IT Internships
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview & Placement
          </button>
          <button
            onClick={() => setActiveTab('logbook')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'logbook'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Weekly Logbook ({submittedReports.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Activity & History
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PLACEMENT */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Active Placement Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Active Supervised Placement
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 font-heading mt-1">
                      {placement.internship_title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">{placement.company_name}</span>
                      <span>•</span>
                      <span>Douala Tech Center</span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2.5 py-1">
                    Healthy Status
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {placement.objectives}
                </p>

                {/* Supervisor & Onboarding summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Assigned Industry Supervisor</div>
                    <div className="font-bold text-slate-900 mt-0.5">{placement.supervisor_name}</div>
                    <div className="text-slate-500 text-[11px]">Senior Architect (CAMTEL / MTN)</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Academic Supervisor</div>
                    <div className="font-bold text-slate-900 mt-0.5">Dr. Paul Tchinda</div>
                    <div className="text-slate-500 text-[11px]">ENSPY / Univ Yaoundé I</div>
                  </div>
                </div>

                {/* Onboarding Checklist */}
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Onboarding Verification Checklist
                  </h3>
                  <div className="space-y-2">
                    {placement.onboarding_checklist.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                        <span className="text-slate-700">{item.title}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest Supervisor Evaluation Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Supervisor Evaluation & Commendation
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-slate-900">{evaluations[0].overall_score}.0 / 5.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase">Technical</div>
                    <div className="font-bold text-slate-900 text-sm">{evaluations[0].technical_score}/5</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase">Communication</div>
                    <div className="font-bold text-slate-900 text-sm">{evaluations[0].communication_score}/5</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase">Punctuality</div>
                    <div className="font-bold text-slate-900 text-sm">{evaluations[0].punctuality_score}/5</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] text-slate-500 uppercase">Initiative</div>
                    <div className="font-bold text-slate-900 text-sm">{evaluations[0].initiative_score}/5</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  &ldquo;{evaluations[0].qualitative_feedback}&rdquo;
                </p>
                <div className="text-[11px] text-slate-500 mt-2 text-right">
                  Evaluated by {evaluations[0].evaluator_name}
                </div>
              </div>
            </div>

            {/* Sidebar: Readiness System (SRS Section 17) */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Student Readiness
                  </h3>
                  <span className="text-sm font-extrabold text-blue-600">95%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '95%' }} />
                </div>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Identity & Matricule</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IT Curriculum & Field</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Curriculum Vitae (PDF)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verified Git & Project Repos</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Official University Endorsement</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Digital Passport Status</span>
                </div>
                <h4 className="text-base font-bold font-heading mb-1">
                  Active & Supervised
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Your internship hours and supervisor signatures are dynamically added to your Career Passport.
                </p>
                <Link href="/career-passport" target="_blank">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">
                    View Verified Passport
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOGBOOK & WEEKLY REPORTS (SRS Section 23 & 25) */}
        {activeTab === 'logbook' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">
                Submit Weekly Internship Logbook
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Record your engineering achievements, technical challenges, and sprint progress for review by Eng. Martin Fon.
              </p>

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Week Summary / Objective Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Week 4: Cloud infrastructure hardening and Docker deployments"
                    value={newLogSummary}
                    onChange={(e) => setNewLogSummary(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Detailed Tasks & Technical Work Conducted
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Specify code written, services configured, tests run, or meetings held..."
                    value={newLogActivities}
                    onChange={(e) => setNewLogActivities(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  Submit Logbook Entry
                  <Send className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Submitted Logbook Records ({submittedReports.length})
              </h3>
              <div className="space-y-4">
                {submittedReports.map((rep) => (
                  <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          Week {rep.week_number}
                        </Badge>
                        <h4 className="text-sm font-bold text-slate-900">{rep.summary}</h4>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        {rep.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {rep.activities}
                    </p>
                    {rep.feedback && (
                      <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 border border-slate-100 flex items-start gap-2">
                        <span className="font-bold text-blue-700 shrink-0">Supervisor Feedback:</span>
                        <span>{rep.feedback}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS TIMELINE (SRS Section 15 & 16) */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Application ID: {app.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">
                      {app.internship_id === 'int_01'
                        ? 'Full-Stack Software Engineering Intern — MTN Cameroon'
                        : 'Cybersecurity & Threat Detection Intern — Orange Cameroun'}
                    </h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-3 py-1 font-semibold self-start sm:self-auto capitalize">
                    {app.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="relative pl-6 space-y-6 border-l-2 border-blue-200 ml-2">
                  {app.timelines?.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="text-[11px] font-bold text-slate-400">{item.date}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{item.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ACTIVITY & HISTORY (SRS Section 10.8) */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              Student Activity & Operational Log
            </h3>
            <div className="space-y-3">
              {initialData.auditLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-blue-600">{log.action}</span>
                    <p className="text-slate-600 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
