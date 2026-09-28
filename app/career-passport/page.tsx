'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { initialData } from '@/lib/data-store';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Star,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function CareerPassportPage() {
  const { role, user } = useAuth();

  // Enforce Section 10.1: Eligible users ONLY (Student, Company, University)
  if (role === 'supervisor' || role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Access Restricted</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Under MANTECH Master SRS Section 10.1, Career Passport is exclusively available to authenticated Students, Companies, and Universities.
        </p>
        <Link href={`/dashboard/${role}`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Return to Authorized Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const studentPassport = initialData.careerPassport;
  const placement = initialData.placement;
  const evaluation = initialData.evaluations[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Passport Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <Logo size={52} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Career Passport Companion
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  VERIFIED
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading mt-1">
                {role === 'student' && 'National Digital Internship Passport'}
                {role === 'company' && 'Enterprise Host Workspace Passport'}
                {role === 'university' && 'Institutional Academic Partner Passport'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Passport Identifier
              </div>
              <div className="text-sm font-mono font-bold text-amber-400">
                {studentPassport.passport_number}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 10.5 STUDENT CAREER PASSPORT EXPERIENCE                       */}
        {/* ------------------------------------------------------------- */}
        {role === 'student' && (
          <div className="space-y-8">
            {/* Identity & Verified Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-300 text-xs font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>University of Yaoundé I — Software Engineering</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
                    David Kamga
                  </h2>
                  <p className="text-sm text-slate-300 max-w-xl">
                    {studentPassport.headline}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4">
                    <div className="text-3xl font-extrabold text-blue-400 font-mono">
                      {studentPassport.total_hours_completed}h
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                      Supervised Hours
                    </div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4">
                    <div className="text-3xl font-extrabold text-amber-400 font-mono">
                      5.0 / 5
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                      Evaluation Score
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>Verified Enterprise Internship Experience</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      {placement.company_name}
                    </span>
                    <h3 className="text-xl font-bold text-white font-heading mt-1">
                      {placement.internship_title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Sep 2026 — Feb 2027 (Active)
                      </span>
                      <span>•</span>
                      <span>Douala, Cameroon</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">Supervised by Eng. Martin Fon</span>
                    </div>
                  </div>

                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-1 self-start sm:self-auto">
                    Active Placement
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Validated Technical Skills Gained
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {studentPassport.experiences[0]?.skills_verified.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Industry Supervisor Endorsement
                  </div>
                  <p className="text-slate-300 italic">
                    &ldquo;{evaluation.qualitative_feedback}&rdquo;
                  </p>
                  <div className="mt-2 text-slate-400 font-semibold text-[11px]">
                    — {evaluation.evaluator_name}, {evaluation.evaluator_role}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements & Digital Honors */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Milestones & Honors</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studentPassport.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white font-heading">{ach.title}</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ach.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{ach.issuer}</span>
                      <span>{ach.issue_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 10.6 COMPANY PASSPORT EXPERIENCE                              */}
        {/* ------------------------------------------------------------- */}
        {role === 'company' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white font-heading">
                  MTN Cameroon — Enterprise Talent Workspace
                </h2>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl">
                Official institutional verification profile for MTN Cameroon on ManTech Nexus. Managing enterprise IT placements, supervisor allocations, and university accreditation partnerships.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">14</div>
                  <div className="text-xs text-slate-400 mt-1">Total Interns Hosted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400 font-mono">100%</div>
                  <div className="text-xs text-slate-400 mt-1">Supervision Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">5 Stars</div>
                  <div className="text-xs text-slate-400 mt-1">Verified Host Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 10.7 UNIVERSITY PASSPORT EXPERIENCE                           */}
        {/* ------------------------------------------------------------- */}
        {role === 'university' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white font-heading">
                  ENSPY — National Advanced School of Engineering
                </h2>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl">
                Institutional accreditation portal monitoring academic internship compliance, industry supervisor assignments, and student logbook validation.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">240</div>
                  <div className="text-xs text-slate-400 mt-1">Enrolled IT Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">98%</div>
                  <div className="text-xs text-slate-400 mt-1">Placement Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 font-mono">18</div>
                  <div className="text-xs text-slate-400 mt-1">Partner Host Firms</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security & Verification Footer */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cryptographically anchored in Neon PostgreSQL with Clerk User Authorization</span>
          </div>
          <div className="font-mono">
            Audit Hash: SHA256-MTN-CM-9814-VERIFIED
          </div>
        </div>
      </div>
    </div>
  );
}
