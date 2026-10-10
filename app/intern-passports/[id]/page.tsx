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
} from "lucide-react";
import { CvDownloadButton } from "@/components/cv-download-button";
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
        <div className="container-mantech px-4 py-16">
          <Card className="mx-auto max-w-xl border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-950">Monthly candidate-view limit reached</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-amber-900">
              <p>Your package allows {packageLimits.monthlyCandidateViews} candidate views per month.</p>
              <Link href="/dashboard/company/billing">
                <Button variant="outline">Review packages</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
    <div className="container-mantech px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/intern-passports" className="inline-block mb-4">
            <Button variant="ghost">← Back to Intern Passports</Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {profileUser.avatarUrl ? (
                <Image
                  src={profileUser.avatarUrl}
                  alt={profileUser.fullName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-white shadow-lg">
                  {profileUser.fullName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {profileUser.fullName}
                </h1>
                <p className="text-slate-600 mt-1">
                  {passport?.headline || "Internship Seeker"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {fieldOfStudy?.name || "Not specified"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    Readiness: {internProfile.readinessScore}%
                  </Badge>
                  {internProfile.profileCompleted && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Profile Complete
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {passport?.passportNumber || "N/A"}
              </div>
              <div className="text-sm text-slate-500">Passport Number</div>
            </div>
          </div>
        </div>

        {passport?.summary && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-slate-700">{passport.summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  Contact the intern through MANTECH to request a conversation.
                </span>
              </div>
              {internProfile.isPhonePublic && isVerified && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600">
                    Phone: {internProfile.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  Location: {region?.name || "Not specified"},{" "}
                  {internProfile.city || "Not specified"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qualification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Award className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  Diploma: {internProfile.qualification || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  Academic Level:{" "}
                  {internProfile.academicLevel || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  Availability: {internProfile.availability || "Not specified"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skillRelation) => (
                <Badge key={skillRelation.skillId} variant="secondary">
                  {skillRelation.skill.name}
                  {skillRelation.proficiency &&
                    ` (${skillRelation.proficiency})`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-semibold text-slate-900">
                    {edu.qualification}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {edu.field} at {edu.institution}
                  </p>
                  <p className="text-xs text-slate-500">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              CV Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isVerified ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Recruiters only:</strong> this passport is open to
                  all signed-in members, but CV downloads are limited to
                  verified recruiters. Recruiters: contact MANTECH on WhatsApp
                  to complete your organization verification.
                </p>
              </div>
            ) : cvFiles.length === 0 ? (
              <p className="text-sm text-slate-600">
                No CV uploaded by this intern.
              </p>
            ) : (
              <div className="space-y-3">
                {cvFiles.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {cv.fileName}
                      </p>
                      <p className="text-xs text-slate-500">
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
          </CardContent>
        </Card>

        {passport && passport.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passport Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {passport.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-slate-600">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
