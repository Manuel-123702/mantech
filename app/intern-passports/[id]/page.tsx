import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Eye,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { CvViewButton } from "@/components/shared/cv-viewer-modal";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { ShareButton } from "@/components/shared/share-button";
import { ReportButton } from "@/components/shared/report-button";
import { waSharePassportLink } from "@/lib/whatsapp";
import type {
  PassportAchievement,
  PassportExperience,
  InternPassport,
  InternProfileSkill,
  Skill,
  Field,
  Region,
} from "@prisma/client";
import { APP_CONFIG } from "@/lib/config";
import { getPackageLimits } from "@/lib/package-limits";
import { reserveCandidateViews } from "@/lib/candidate-usage";
import { notifyUser } from "@/lib/audit";

type SkillRel = InternProfileSkill & { skill: Skill };

export default async function InternPassportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session.userId;
  if (!userId) {
    redirect(`/sign-in?redirect_url=/intern-passports/${id}`);
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      organizationMembers: true,
    },
  });

  if (!user) redirect("/dashboard");

  // Any signed-in member may open a passport — the sign-in gate above
  // (mirrored by the middleware) is the only access requirement.
  // `organization`, `canRecruit` and `isVerified` no longer block the
  // page; they decide which recruiter-only extras this viewer unlocks:
  // CV files, the public phone number, and candidate-view quota accounting.
  const organization = user.role === "ADMIN"
    ? null
    : user.organizationMembers[0]?.organizationId
      ? await prisma.organization.findUnique({
          where: { id: user.organizationMembers[0].organizationId },
          include: { universityProfile: true },
        })
      : null;
  const canRecruit =
    (user.role === "COMPANY" || user.role === "UNIVERSITY") &&
    organization?.verificationStatus === "VERIFIED" &&
    (user.role !== "UNIVERSITY" ||
      Boolean(organization?.universityProfile?.canRecruitInterns));
  const isVerified = user.role === "ADMIN" || canRecruit;

  const internProfile = await prisma.internProfile.findUnique({
    where: { id, isCvSearchable: true, profileCompleted: true },
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
      passport: {
        include: {
          achievements: true,
          experiences: true,
        },
      },
      fieldOfStudy: true,
      specialization: true,
      region: true,
      skills: {
        include: {
          skill: true,
        },
      },
      educations: true,
      cvFiles: {
        select: { id: true, fileName: true, fileSize: true, fileUrl: true, uploadedAt: true },
        orderBy: { uploadedAt: "desc" },
      },
    },
  });

  if (!internProfile) {
    notFound();
  }

  // Monthly candidate-view quota is a recruiter billing feature — it only
  // applies to verified recruiters' organizations, never to interns,
  // admins or unverified accounts just browsing a passport.
  if (canRecruit && organization) {
    const packageLimits = await getPackageLimits(organization.packageCode);
    const usage = await reserveCandidateViews({
      organizationId: organization.id,
      actorId: user.id,
      actorRole: user.role,
      profileIds: [internProfile.id],
      monthlyLimit: packageLimits.monthlyCandidateViews,
    });
    if (!usage.allowedIds.has(internProfile.id)) {
      return (
        <main
          className="min-h-screen bg-cover bg-center bg-fixed relative"
          style={{ backgroundImage: "url('/images/passports_dash_bg.svg')" }}
        >
          <div className="absolute inset-0 bg-slate-950/88" aria-hidden />
          <div className="relative z-10 container-mantech px-4 py-16 flex items-center justify-center min-h-screen">
            <div className="mx-auto max-w-xl rounded-2xl border border-amber-600/40 bg-slate-900/80 backdrop-blur-xl p-8 text-center">
              <CardTitle className="text-amber-300 text-xl font-bold">Monthly candidate-view limit reached</CardTitle>
              <p className="mt-4 text-sm text-slate-300">
                Your package allows {packageLimits.monthlyCandidateViews} candidate views per month.
              </p>
              <Link href="/post" className="mt-4 inline-block">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 bg-slate-800/60 hover:bg-slate-700 hover:text-white"
                >
                  Review packages
                </Button>
              </Link>
            </div>
          </div>
        </main>
      );
    }
  }

  if (isVerified && internProfile.cvFiles.length > 0) {
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: user.role,
        action: "CV_VIEW_REQUEST",
        entityType: "InternProfile",
        entityId: internProfile.id,
        details: JSON.stringify({
          internName: internProfile.user.fullName,
          organizationId: organization?.id,
        }),
      },
    });
  }

  // ── View alert: in-app + email to the passport owner whenever somebody
  // else inspects their public passport. Self-views are excluded so an intern
  // previewing their own passport never notifies themselves, and repeat views
  // by the same viewer are throttled to one alert per 24 hours. Failures are
  // swallowed so notification trouble can never break this page.
  if (user.id !== internProfile.userId) {
    try {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentView = await prisma.auditLog.findFirst({
        where: {
          action: "PASSPORT_VIEW",
          entityType: "InternProfile",
          entityId: internProfile.id,
          actorId: user.id,
          createdAt: { gte: dayAgo },
        },
        select: { id: true },
      });

      if (!recentView) {
        const viewerLabel =
          user.role === "ADMIN"
            ? "A MANTECH administrator"
            : canRecruit
              ? organization?.name || "A verified recruiter"
              : user.fullName || "A MANTECH member";
        await notifyUser({
          userId: internProfile.userId,
          title: "Your Intern Passport was viewed",
          message: `${viewerLabel} viewed your public Intern Passport. Keep your profile and CV up to date to stay visible to verified recruiters.`,
          category: "system",
          link: "/dashboard/intern/passport",
        });
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            actorRole: user.role,
            action: "PASSPORT_VIEW",
            entityType: "InternProfile",
            entityId: internProfile.id,
            details: JSON.stringify({ organizationId: organization?.id ?? null }),
          },
        });
      }
    } catch (reason) {
      console.warn(
        "[intern-passports] view alert failed (non-fatal):",
        reason instanceof Error ? reason.message : reason,
      );
    }
  }

  const passport = internProfile.passport as
    | (InternPassport & {
        achievements: PassportAchievement[];
        experiences: PassportExperience[];
      })
    | null;
  const profileUser = internProfile.user;
  const skills = internProfile.skills as SkillRel[];
  const educations = internProfile.educations;
  const cvFiles = internProfile.cvFiles;
  const fieldOfStudy = internProfile.fieldOfStudy as Field | null;
  const region = internProfile.region as Region | null;
  const internProfileId = internProfile.id;

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/images/passports_dash_bg.svg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/88" aria-hidden />

      {/* Content */}
      <div className="relative z-10 container-mantech px-4 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Back button */}
          <div className="mb-6">
            <Link href="/intern-passports" className="inline-block">
              <Button
                variant="outline"
                className="border-slate-600/60 text-slate-300 bg-slate-800/60 hover:bg-slate-700/80 hover:text-white backdrop-blur-sm gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Intern Passports
              </Button>
            </Link>
          </div>

          {/* Hero identity card */}
          <div className="mb-8 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <CandidateAvatar
                  src={profileUser.avatarUrl}
                  name={profileUser.fullName}
                  size={80}
                  className="rounded-full border-4 border-slate-700/60 shadow-lg"
                  priority
                />
                <div className="min-w-0">
                  <h1 className="text-3xl font-bold text-white">
                    {profileUser.fullName}
                  </h1>
                  <p className="text-slate-300 mt-1">
                    {passport?.headline || "Internship Seeker"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-900/50 text-blue-300 border border-blue-700/40"
                    >
                      {fieldOfStudy?.name || "Not specified"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-900/50 text-emerald-300 border border-emerald-700/40"
                    >
                      Readiness: {internProfile.readinessScore}%
                    </Badge>
                    {internProfile.profileCompleted && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-900/50 text-emerald-300 border border-emerald-700/40 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Profile Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-emerald-400">
                  {passport?.passportNumber || "N/A"}
                </div>
                <div className="text-sm text-slate-400">Passport Number</div>
                <ShareButton
                  path={`/intern-passports/${id}`}
                  title={`${profileUser.fullName} — Intern Passport on MANTECH Nexus`}
                  text={`Meet ${profileUser.fullName} (${fieldOfStudy?.name || "intern"}) — view their verified Intern Passport on MANTECH Nexus.`}
                  label="Share passport"
                  className="mt-3"
                />
                <a
                  href={waSharePassportLink({
                    name: profileUser.fullName,
                    headline: passport?.headline,
                    fieldName: fieldOfStudy?.name,
                    profileId: id,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
                >
                  <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                </a>
                {/* Trust & safety: report someone else's passport (never your own). */}
                {internProfile.userId !== user.id && (
                  <div className="mt-2 flex justify-end">
                    <ReportButton targetType="PASSPORT" targetId={internProfile.id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {passport?.summary && (
            <div className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
              <p className="text-slate-300">{passport.summary}</p>
            </div>
          )}

          {/* Info cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Contact Information */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">
                    Contact the intern through MANTECH to request a conversation.
                  </span>
                </div>
                {internProfile.isPhonePublic && isVerified && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">
                      Phone: {internProfile.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">
                    Location: {region?.name || "Not specified"},{" "}
                    {internProfile.city || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Qualification */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Qualification</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">
                    Diploma: {internProfile.qualification || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">
                    Academic Level:{" "}
                    {internProfile.academicLevel || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">
                    Availability: {internProfile.availability || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skillRelation) => (
                <Badge
                  key={skillRelation.skillId}
                  variant="secondary"
                  className="bg-emerald-900/50 text-emerald-300 border border-emerald-700/40 text-[11px]"
                >
                  {skillRelation.skill.name}
                  {skillRelation.proficiency &&
                    ` (${skillRelation.proficiency})`}
                </Badge>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Education</h2>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="border-l-2 border-emerald-700/50 pl-4">
                  <h4 className="font-semibold text-white">
                    {edu.qualification}
                  </h4>
                  <p className="text-sm text-slate-300">
                    {edu.field} at {edu.institution}
                  </p>
                  <p className="text-xs text-slate-500">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CV Access (Read-Only View for Logged-In Users) */}
          <div className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              CV &amp; Resume (Read-Only Preview)
            </h2>
            {cvFiles.length === 0 && !internProfile.cvUrl ? (
              <p className="text-sm text-slate-400">
                No CV uploaded by this candidate yet.
              </p>
            ) : (
              <div className="space-y-3">
                {cvFiles.length > 0 ? (
                  cvFiles.map((cv) => (
                    <div
                      key={cv.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-700/50 bg-slate-800/50"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white break-words">
                          {cv.fileName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(cv.fileSize / 1024).toFixed(2)} KB • Uploaded{" "}
                          {new Date(cv.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <CvViewButton
                        cvUrl={cv.fileUrl || internProfile.cvUrl}
                        candidateName={profileUser.fullName}
                        fileName={cv.fileName}
                        label="View CV"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="font-medium text-white break-words">
                        {internProfile.cvFileName || "Curriculum Vitae.pdf"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Verified Candidate CV
                      </p>
                    </div>
                    <CvViewButton
                      cvUrl={internProfile.cvUrl}
                      candidateName={profileUser.fullName}
                      fileName={internProfile.cvFileName || "Curriculum Vitae.pdf"}
                      label="View CV"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0"
                    />
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Read-only online preview enabled for all signed-in members. Direct downloads are disabled to protect candidate privacy.
                </p>
              </div>
            )}
          </div>

          {/* Achievements */}
          {passport && passport.achievements.length > 0 && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Passport Achievements</h2>
              <div className="space-y-3">
                {passport.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/30"
                  >
                    <Award className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-slate-300">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Issued by {achievement.issuer} •{" "}
                        {new Date(achievement.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
