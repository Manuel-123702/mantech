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
import { CvDownloadButton } from "@/components/cv-download-button";
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
        select: { id: true, fileName: true, fileSize: true, uploadedAt: true },
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
          style={{ backgroundImage: "url('/images/hero_tech_bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-slate-950/88" aria-hidden />
          <div className="relative z-10 container-mantech px-4 py-16 flex items-center justify-center min-h-screen">
            <div className="mx-auto max-w-xl rounded-2xl border border-amber-600/40 bg-slate-900/80 backdrop-blur-xl p-8 text-center">
              <CardTitle className="text-amber-300 text-xl font-bold">Monthly candidate-view limit reached</CardTitle>
              <p className="mt-4 text-sm text-slate-300">
                Your package allows {packageLimits.monthlyCandidateViews} candidate views per month.
              </p>
              <Link href="/dashboard/company/billing" className="mt-4 inline-block">
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
      style={{ backgroundImage: "url('/images/hero_tech_bg.jpg')" }}
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
              <div className="flex items-center gap-5">
                {profileUser.avatarUrl ? (
                  <Image
                    src={profileUser.avatarUrl}
                    alt={profileUser.fullName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-700/60 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-slate-700/60 shadow-lg">
                    {profileUser.fullName.charAt(0)}
                  </div>
                )}
                <div>
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

          {/* CV Access */}
          <div className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-slate-400" />
              CV Access
            </h2>
            {!isVerified ? (
              <div className="rounded-xl border border-amber-600/40 bg-amber-950/30 p-4">
                <p className="text-sm text-amber-300">
                  <strong className="text-amber-200">Recruiters only:</strong> this passport is open to
                  all signed-in members, but CV downloads are limited to
                  verified recruiters. Recruiters: contact MANTECH on WhatsApp
                  to complete your organization verification.
                </p>
              </div>
            ) : cvFiles.length === 0 ? (
              <p className="text-sm text-slate-400">
                No CV uploaded by this intern.
              </p>
            ) : (
              <div className="space-y-3">
                {cvFiles.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-700/50 bg-slate-800/50"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {cv.fileName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(cv.fileSize / 1024).toFixed(2)} KB • Uploaded{" "}
                        {new Date(cv.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <CvDownloadButton
                      cvId={cv.id}
                      internProfileId={internProfileId}
                    />
                  </div>
                ))}
                <p className="text-xs text-slate-500 mt-2">
                  <Eye className="w-3 h-3 inline mr-1" />
                  CV access is logged and audited for security purposes.
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
