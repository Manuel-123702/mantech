'use client';

import React, { useState } from 'react';
import {
  Download,
  FileText,
  Printer,
  QrCode,
  Globe2,
  CheckCircle2,
  ShieldCheck,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface InternPassportActionsProps {
  profile: {
    id: string;
    city?: string | null;
    phone?: string | null;
    readinessScore?: number;
    user: {
      fullName: string;
      email: string;
      avatarUrl?: string | null;
    };
    fieldOfStudy?: { name: string } | null;
    specialization?: { name: string } | null;
    region?: { name: string } | null;
    passport?: {
      passportNumber: string;
      headline?: string | null;
      summary?: string | null;
      experiences?: Array<{
        id: string;
        title: string;
        organization: string;
        period: string;
        description?: string | null;
      }>;
      achievements?: Array<{
        id: string;
        title: string;
        issuer: string;
        issueDate: string;
      }>;
    } | null;
    skills?: Array<{
      id: string;
      skill: { name: string };
    }>;
    educations?: Array<{
      id: string;
      institutionName: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string | null;
    }>;
  };
  qrDataUrl: string;
}

export function InternPassportActions({ profile, qrDataUrl }: InternPassportActionsProps) {
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeLang, setResumeLang] = useState<'EN' | 'FR' | 'BI'>('BI');

  const passportNumber =
    profile.passport?.passportNumber || `MN-${profile.id.slice(0, 8).toUpperCase()}`;
  const firstLetter = (profile.user.fullName || 'I').charAt(0).toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Button 1: Download PDF Passport */}
        <Button
          onClick={() => setShowPassportModal(true)}
          className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:opacity-95 text-white font-bold shadow-lg shadow-cyan-600/20 text-xs sm:text-sm"
        >
          <QrCode className="mr-2 h-4 w-4" />
          Download PDF Passport
        </Button>

        {/* Button 2: Export ATS Resume */}
        <Button
          onClick={() => setShowResumeModal(true)}
          variant="outline"
          className="border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm"
        >
          <FileText className="mr-2 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          Export ATS Resume (PDF)
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 1. PDF INTERN PASSPORT PRINT/DOWNLOAD MODAL                               */}
      {/* ========================================================================= */}
      {showPassportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
            {/* Modal Controls - Hidden during print */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="font-extrabold text-sm text-slate-800">
                  Official Verifiable Intern Passport
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  Print / Save as PDF
                </Button>
                <button
                  onClick={() => setShowPassportModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE PASSPORT CARD */}
            <div className="border-2 border-slate-800 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden shadow-inner">
              {/* Cameroon Flag Header Strip */}
              <div className="flex h-2.5 w-full rounded-t-lg overflow-hidden mb-5">
                <div className="flex-1 bg-[#007a5e]" />
                <div className="flex-1 bg-[#ce1126] flex items-center justify-center text-[7px] text-[#fcd116]">★</div>
                <div className="flex-1 bg-[#fcd116]" />
              </div>

              {/* Passport Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-blue-700 block">
                    REPUBLIC OF CAMEROON · NATIONAL TALENT REGISTRY
                  </span>
                  <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                    Official Intern Passport
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    MANTECH Nexus Verified Credential · ID: {passportNumber}
                  </p>
                </div>

                {/* Permanent QR Code */}
                <div className="text-center shrink-0">
                  {qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="Verification QR Code"
                      className="w-20 h-20 border border-slate-300 rounded-lg p-1 bg-white shadow-sm"
                    />
                  )}
                  <span className="text-[9px] font-bold text-slate-500 block mt-1">
                    Scan to Verify
                  </span>
                </div>
              </div>

              {/* Passport Body */}
              <div className="grid grid-cols-3 gap-5 mt-5">
                {/* Photo / Avatar */}
                <div className="col-span-1 flex flex-col items-center text-center">
                  {profile.user.avatarUrl ? (
                    <Image
                      src={profile.user.avatarUrl}
                      alt={profile.user.fullName}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-600 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center text-white font-black text-4xl shadow-md border-2 border-blue-400">
                      {firstLetter}
                    </div>
                  )}
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Student Details */}
                <div className="col-span-2 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Candidate Name</span>
                    <p className="font-extrabold text-base text-slate-900 leading-tight">
                      {profile.user.fullName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Field of Study</span>
                      <p className="font-bold text-slate-800">
                        {profile.fieldOfStudy?.name || 'General Engineering'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Specialization</span>
                      <p className="font-bold text-slate-800">
                        {profile.specialization?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Location / Region</span>
                      <p className="font-bold text-slate-800">
                        {profile.city || 'Douala'}, {profile.region?.name || 'Littoral'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Readiness Score</span>
                      <p className="font-bold text-emerald-700">
                        {profile.readinessScore || 85}% Ready
                      </p>
                    </div>
                  </div>
                  {profile.user.email && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</span>
                      <p className="font-mono text-slate-700">{profile.user.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Competencies */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Verified Competencies & Core Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 10).map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded-md bg-slate-200/80 text-[10px] font-bold text-slate-800"
                      >
                        {s.skill?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Passport Official Watermark & Seal */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
                <span>MANTECH Nexus Cameroon · Verifiable Digital Standard</span>
                <span className="font-mono">ISSUE DATE: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ATS RESUME EXPORT MODAL (Bilingual EN / FR)                            */}
      {/* ========================================================================= */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
            {/* Modal Controls - Hidden during print */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-cyan-600" />
                <span className="font-extrabold text-sm text-slate-800">
                  Cameroon ATS-Compliant Resume (PDF)
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setResumeLang('EN')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    resumeLang === 'EN' ? 'bg-cyan-600 text-white shadow' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setResumeLang('FR')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    resumeLang === 'FR' ? 'bg-cyan-600 text-white shadow' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Français
                </button>
                <button
                  type="button"
                  onClick={() => setResumeLang('BI')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    resumeLang === 'BI' ? 'bg-cyan-600 text-white shadow' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  Bilingual (EN/FR)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  <Printer className="w-4 h-4 mr-1.5" />
                  Print / Save ATS PDF
                </Button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ATS FORMATTED RESUME CONTAINER */}
            <div className="max-w-2xl mx-auto p-4 sm:p-6 font-sans text-slate-800 leading-normal text-xs">
              {/* Top Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                    {profile.user.fullName}
                  </h1>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">
                    {profile.passport?.headline || profile.fieldOfStudy?.name || 'Internship Candidate'}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">
                    {profile.city || 'Douala'}, {profile.region?.name || 'Cameroon'} • {profile.user.email}
                    {profile.phone ? ` • ${profile.phone}` : ''}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    MANTECH Verified Passport #{passportNumber}
                  </p>
                </div>

                {/* Verification QR Code in ATS Resume */}
                {qrDataUrl && (
                  <div className="text-right shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="Verify Passport"
                      className="w-16 h-16 border border-slate-300 rounded p-0.5 ml-auto"
                    />
                    <span className="text-[8px] font-bold text-slate-500 block mt-0.5">
                      Verify Online
                    </span>
                  </div>
                )}
              </div>

              {/* Professional Summary */}
              {profile.passport?.summary && (
                <div className="mb-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                    {resumeLang === 'FR'
                      ? 'Profil Professionnel & Objectif'
                      : resumeLang === 'EN'
                        ? 'Professional Summary & Objective'
                        : 'Professional Profile / Profil Professionnel'}
                  </h2>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {profile.passport.summary}
                  </p>
                </div>
              )}

              {/* Education */}
              <div className="mb-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                  {resumeLang === 'FR'
                    ? 'Formation Académique'
                    : resumeLang === 'EN'
                      ? 'Academic Education'
                      : 'Education / Formation'}
                </h2>
                {profile.educations && profile.educations.length > 0 ? (
                  profile.educations.map((edu) => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.institutionName}</span>
                        <span className="text-slate-600 font-normal">
                          {edu.startDate} – {edu.endDate || 'Present'}
                        </span>
                      </div>
                      <div className="text-slate-700 italic">
                        {edu.degree} in {edu.fieldOfStudy}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="font-bold text-slate-900">
                      {profile.fieldOfStudy?.name || 'Higher Education Student'}
                    </div>
                    <div className="text-slate-600">
                      {profile.specialization?.name ? `Specialization: ${profile.specialization.name}` : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                    {resumeLang === 'FR'
                      ? 'Compétences Techniques & Clés'
                      : resumeLang === 'EN'
                        ? 'Key Skills & Core Competencies'
                        : 'Core Competencies / Compétences'}
                  </h2>
                  <p className="text-slate-800 font-medium">
                    {profile.skills.map((s) => s.skill?.name).filter(Boolean).join(' • ')}
                  </p>
                </div>
              )}

              {/* Experience / Projects */}
              {profile.passport?.experiences && profile.passport.experiences.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                    {resumeLang === 'FR'
                      ? 'Expérience & Stages'
                      : resumeLang === 'EN'
                        ? 'Internships & Experience'
                        : 'Experience / Stages & Projets'}
                  </h2>
                  {profile.passport.experiences.map((exp) => (
                    <div key={exp.id} className="mb-2.5">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.title} — {exp.organization}</span>
                        <span className="text-slate-600 font-normal">{exp.period}</span>
                      </div>
                      {exp.description && (
                        <p className="text-slate-700 mt-0.5">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Achievements & Certifications */}
              {profile.passport?.achievements && profile.passport.achievements.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                    {resumeLang === 'FR'
                      ? 'Distinctions & Certifications'
                      : resumeLang === 'EN'
                        ? 'Achievements & Honors'
                        : 'Achievements / Distinctions'}
                  </h2>
                  {profile.passport.achievements.map((ach) => (
                    <div key={ach.id} className="flex justify-between text-slate-800 mb-1">
                      <span className="font-semibold">{ach.title} ({ach.issuer})</span>
                      <span className="text-slate-500">{ach.issueDate}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ATS Footnote */}
              <div className="pt-3 border-t border-slate-200 text-[9px] text-slate-400 flex justify-between">
                <span>Verified via MANTECH Nexus Cameroon National Internship Network</span>
                <span className="font-mono">ID: {passportNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
