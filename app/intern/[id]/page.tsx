import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Link as LinkIcon,
  Users,
  Award,
  Clock,
} from "lucide-react";

export default async function InternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = await prisma.user.findUnique({
    where: { id, role: "INTERN", status: "active" },
    include: {
      internProfile: {
        include: {
          skills: {
            include: { skill: { select: { name: true } } },
            take: 10,
          },
          educations: {
            take: 5,
          },
          region: true,
        },
      },
    },
  });

  if (!person) {
    notFound();
  }

  const skills = person.internProfile?.skills.map((s) => s.skill.name) ?? [];
  const educations = person.internProfile?.educations ?? [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="font-bold text-xl tracking-tight">MANTECH</span>
            </Link>
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container-mantech px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 overflow-hidden shadow-2xl shadow-blue-900/30">
              {person.avatarUrl ? (
                <Image
                  src={person.avatarUrl}
                  alt={person.fullName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                  {person.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {person.fullName}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {person.internProfile?.qualification || "Candidate"} • {
                  person.internProfile?.city || "Cameroon"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={person.internProfile?.profileCompleted ? "default" : "secondary"}>
              {person.internProfile?.profileCompleted
                ? "Profile Complete"
                : "Building Profile"}
            </Badge>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-400 border border-slate-700">
              Ready {person.internProfile?.readinessScore ?? 0}%
            </span>
          </div>
        </div>
        {/* Quick Contact Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {person.phone ? (
            <a
              href={`tel:${person.phone}`}
              className="flex items-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors group"
            >
              <Phone className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
              <span className="text-xs font-medium text-white group-hover:text-slate-300">Call</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
              <Phone className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-500">No phone</span>
            </div>
          )}
          {person.email ? (
            <a
              href={`mailto:${person.email}`}
              className="flex items-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors group"
            >
              <Mail className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
              <span className="text-xs font-medium text-white group-hover:text-slate-300">Email</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
              <Mail className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-500">No email</span>
            </div>
          )}
          <a
            href={person.internProfile?.cvUrl || "#"}
            target={person.internProfile?.cvUrl ? "_blank" : "_self"}
            rel={person.internProfile?.cvUrl ? "noopener noreferrer" : undefined}
            className="flex items-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
          >
            <Users className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
            <span className="text-xs font-medium text-white group-hover:text-slate-300">
              {person.internProfile?.cvUrl ? "View CV" : "No CV"}
            </span>
          </a>
          <Link
            href="/sign-in/[[...sign-in]]"
            className="flex items-center gap-2 p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 transition-colors"
          >
            <LinkIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Connect</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                About
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                      Qualification
                    </p>
                    <p className="text-sm text-white">
                      {person.internProfile?.qualification || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                      Location
                    </p>
                    <p className="text-sm text-white">
                      {person.internProfile?.city && person.internProfile?.region
                        ? `${person.internProfile.city}, ${person.internProfile.region.name}`
                        : person.internProfile?.city ||
                          person.internProfile?.region?.name ||
                          "Cameroon"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                      Availability
                    </p>
                    <p className="text-sm text-white">
                      {person.internProfile?.availability || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                      Work Mode
                    </p>
                    <p className="text-sm text-white">
                      {String(person.internProfile?.preferredWorkMode || "ONSITE")}
                    </p>
                  </div>
                </div>
                {person.internProfile?.targetRole && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                        Target Role
                      </p>
                      <p className="text-sm text-white">
                        {person.internProfile.targetRole}
                      </p>
                    </div>
                  </div>
                )}
                {person.bio && (
                  <div className="pt-4 border-t border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2">
                      Bio
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {person.bio}
                    </p>
                  </div>
                )}
                {person.internProfile?.careerGoals && (
                  <div className="pt-4 border-t border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2">
                      Career Goals
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {person.internProfile.careerGoals}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            {skills.length > 0 && (
              <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  Education
                </h2>
                <div className="space-y-4">
                  {educations.map((edu, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-slate-400">
                          {edu.field} • {edu.qualification}
                        </p>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-xs font-medium text-slate-300">
                          {edu.startYear}{" - "}
                          {edu.endYear || "Present"}
                        </p>
                        {edu.grade && (
                          <p className="text-[10px] text-slate-500">
                            Grade: {edu.grade}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">Profile Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Readiness
                  </div>
                  <div className="text-xl font-bold text-white">
                    {person.internProfile?.readinessScore ?? 0}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Skills Listed
                  </div>
                  <div className="text-xl font-bold text-white">
                    {skills.length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Education
                  </div>
                  <div className="text-xl font-bold text-white">
                    {educations.length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Member Since
                  </div>
                  <div className="text-sm font-bold text-white">
                    {new Date(person.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">Available for Hire</h2>
              <p className="text-sm text-slate-400 mb-6">
                This candidate is registered in the MANTECH talent pool and
                ready for placement opportunities across Cameroon.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/20"
                asChild
              >
                <Link href="/sign-in/[[...sign-in]]">Contact This Candidate</Link>
              </Button>
              <p className="mt-4 text-[10px] text-slate-500 text-center">
                Sign in to view full contact details and send a message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";