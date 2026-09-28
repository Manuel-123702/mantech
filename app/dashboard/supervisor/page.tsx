'use client';

import React, { useState } from 'react';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Send,
  Star,
  Building2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function SupervisorDashboardPage() {
  const supervisor = initialData.profiles[3]; // Eng. Martin Fon
  const placement = initialData.placement;
  const reports = initialData.reports;

  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [approvedReports, setApprovedReports] = useState<string[]>(['rep_01', 'rep_02', 'rep_03']);

  const handleApprove = (reportId: string) => {
    if (!approvedReports.includes(reportId)) {
      setApprovedReports([...approvedReports, reportId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Supervisor Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-700 font-extrabold text-2xl font-heading">
              {supervisor.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-heading">
                  {supervisor.full_name}
                </h1>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Accredited Industry Supervisor
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {supervisor.sub_role} • Host Organization: CAMTEL / MTN Cameroon Enterprise Division
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 text-xs">
              Health Status: 100% Healthy
            </Badge>
          </div>
        </div>

        {/* Assigned Interns Card (SRS Section 5.4 & 24) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Assigned Interns Under Supervision
            </h2>
            <span className="text-xs text-slate-500">1 of 5 Slots Filled</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">David Kamga</h3>
                <Badge className="bg-blue-100 text-blue-800 text-[10px]">Active</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {placement.internship_title} at {placement.company_name}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span>Academic institution: University of Yaoundé I (ENSPY)</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Sprint 3 Completed</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Logbook Entries ({reports.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Weekly Logbook Reviews (SRS Section 23 & 25) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            Weekly Logbook Review & Supervisor Verification
          </h2>

          <div className="space-y-4">
            {reports.map((rep) => {
              const isApproved = approvedReports.includes(rep.id);
              return (
                <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        Week {rep.week_number} Logbook
                      </Badge>
                      <h4 className="text-sm font-bold text-slate-900">{rep.summary}</h4>
                    </div>
                    {isApproved ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                        Verified & Signed by Eng. Martin Fon
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(rep.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        Approve & Sign
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    {rep.activities}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span>
                      <strong className="text-slate-800">Skills Verified:</strong>{' '}
                      {rep.skills_applied.join(', ')}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Submitted: {new Date(rep.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
