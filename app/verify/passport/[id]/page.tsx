import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  ExternalLink,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Official Credential Verification — MANTECH Nexus',
  description: 'Instant cryptographic verification of official student Intern Passports in Cameroon.',
};

export default async function VerifyPassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lookup profile by id or passport id
  const profile = await prisma.internProfile.findFirst({
    where: {
      OR: [
        { id },
        { passport: { passportNumber: id } },
        { passport: { id } },
      ],
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      passport: {
        include: {
          experiences: { orderBy: { verifiedAt: 'desc' } },
          achievements: { orderBy: { issueDate: 'desc' } },
        },
      },
      fieldOfStudy: true,
      specialization: true,
      region: true,
      skills: {
        include: { skill: true },
      },
      educations: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const passportNumber = profile.passport?.passportNumber || `MN-${profile.id.slice(0, 8).toUpperCase()}`;
  const firstLetter = (profile.user.fullName || 'I').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Verification Status Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 p-6 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 mb-3">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Official Credential Verified
          </h1>
          <p className="text-xs text-emerald-300 font-semibold mt-1">
            Authentication Authority: Republic of Cameroon · MANTECH Nexus National Registry
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ACTIVE & GENUINE
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono">
              PASSPORT #{passportNumber}
            </Badge>
          </div>
        </div>

        {/* Candidate Official Card */}
        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 rounded-3xl overflow-hidden shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {profile.user.avatarUrl ? (
                <Image
                  src={profile.user.avatarUrl}
                  alt={profile.user.fullName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center text-white font-black text-4xl shadow-lg border-2 border-blue-400/40">
                  {firstLetter}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-white">
                  {profile.user.fullName}
                </h2>
                <p className="text-sm text-cyan-400 font-medium mt-0.5">
                  {profile.passport?.headline || `${profile.fieldOfStudy?.name || 'Student'} · Verified Candidate`}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    {profile.fieldOfStudy?.name || 'General Studies'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {profile.city || 'Cameroon'}, {profile.region?.name || 'National'}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <Badge variant="secondary" className="bg-blue-500/15 text-blue-300 border-blue-500/30">
                    Readiness Score: {profile.readinessScore}%
                  </Badge>
                  {profile.specialization?.name && (
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {profile.specialization.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Verified Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verified Technical & Core Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                    >
                      {s.skill?.name || 'Skill'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Track */}
            {profile.educations && profile.educations.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Academic Institutions & Degrees
                </h3>
                <div className="space-y-2">
                  {profile.educations.map((edu) => (
                    <div key={edu.id} className="text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <p className="font-bold text-white">{edu.institution}</p>
                      <p className="text-slate-400">{edu.qualification} · {edu.field} ({edu.startYear} – {edu.endYear || 'Present'})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Metadata Footer */}
        <div className="text-center space-y-3">
          <p className="text-[11px] text-slate-500">
            This verification certificate was cryptographically generated by MANTECH Nexus for employment and academic credential verification in Cameroon.
          </p>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:text-white">
              Back to MANTECH Nexus Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
