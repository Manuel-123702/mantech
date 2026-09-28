'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { initialData } from '@/lib/data-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin,
  Clock,
  Banknote,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Send,
  Calendar,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function OpportunityDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const opportunity = initialData.internships.find((item) => item.slug === slug) || initialData.internships[0];

  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setApplied(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/mantech-internship"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Internship Portal
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Opportunity Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {opportunity.department || 'Technology Division'}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-600">
                      {opportunity.work_mode}
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                    {opportunity.title}
                  </h1>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-xl shrink-0">
                  {opportunity.company?.name ? opportunity.company.name.charAt(0) : 'M'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 py-4 border-y border-slate-100 mb-6">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{opportunity.company?.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{opportunity.city}, {opportunity.region}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{opportunity.duration_months} Months</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Banknote className="w-4 h-4" />
                  <span>{opportunity.is_paid ? `${opportunity.allowance_xaf?.toLocaleString()} XAF / month` : 'Academic Credit'}</span>
                </div>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-2 font-heading">Role Overview</h2>
                  <p>{opportunity.description}</p>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-2 font-heading">Candidate Requirements</h2>
                  <ul className="space-y-2">
                    {opportunity.requirements?.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-2 font-heading">Target Skills & Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 font-medium text-xs border border-blue-200/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-2 font-heading">Academic Level</h2>
                  <p className="text-slate-600">{opportunity.education_level}</p>
                </div>
              </div>
            </div>

            {/* Application Section (Method 1: Apply on MANTECH) */}
            {opportunity.application_method === 'mantech' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                  Submit Application via ManTech Nexus
                </h3>
                <p className="text-xs text-slate-600 mb-6">
                  Your verified student profile, academic records, and CV will be securely transmitted to the host organization.
                </p>

                {applied ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <h4 className="text-base font-bold text-emerald-900">Application Submitted Successfully!</h4>
                    <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                      Your application token has been registered in the database. Track status updates and interview schedules in your Student Dashboard.
                    </p>
                    <Link href="/dashboard/student">
                      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        Open Student Dashboard Timeline
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Statement of Motivation / Cover Letter
                      </label>
                      <Textarea
                        rows={4}
                        placeholder="Explain your relevant coursework, projects, and motivation for this internship..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Profile readiness: 95% (Above benchmark)</span>
                      </div>
                      <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {submitting ? 'Submitting...' : 'Confirm & Apply on MANTECH'}
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Info & Match Reason */}
          <div className="space-y-6">
            {/* Matching Criteria Breakdown */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-3 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Why This Matches You</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Field: {opportunity.specialization?.split(',')[0] || 'Software Engineering'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Location match: {opportunity.city} region</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Target duration: {opportunity.duration_months} months</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified academic credit eligibility met</span>
                </li>
              </ul>
            </div>

            {/* External / Website Application Callout */}
            {opportunity.application_method !== 'mantech' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Official Application Channel</span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  {opportunity.instructions}
                </p>
                <a
                  href={opportunity.application_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5">
                    {opportunity.application_method === 'company_website'
                      ? 'Apply on Company Website'
                      : 'Apply on External Platform'}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            )}

            {/* Key Dates & Safety Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Important Timeline
              </h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Deadline:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {new Date(opportunity.deadline).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Open Positions:</span>
                  <span className="font-semibold text-slate-900">{opportunity.positions_available} slots</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Application Method:</span>
                  <span className="font-semibold capitalize text-slate-900">{opportunity.application_method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
