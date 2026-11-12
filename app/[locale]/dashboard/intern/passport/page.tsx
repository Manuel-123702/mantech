import { Trans } from '@lingui/react/macro';
import { ph } from '@lingui/core/macro';
import { getServerT } from '@/i18n/server';
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/shared/share-button";
import { waSharePassportLink } from "@/lib/whatsapp";
import {
  Download,
  Edit,
  Eye,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  CheckCircle,
  Building2,
  Briefcase,
  Clock,
  Globe,
  FileText,
  UserCheck,
  Trophy,
  Building,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

export default async function InternPassportDashboardPage() {
  const t = getServerT();
  const user = await requireUser();

  const profile = await prisma.internProfile.findUnique({
    where: { userId: user.id },
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
          // SRS §7 — the Passport carries experience, certifications and
          // achievements, not just contact details and skills.
          experiences: { orderBy: { verifiedAt: "desc" } },
          achievements: { orderBy: { issueDate: "desc" } },
        },
      },
      fieldOfStudy: true,
      specialization: true,
      region: true,
      skills: {
        include: { skill: true },
      },
      educations: true,
      cvFiles: true,
    },
  });

  if (!profile) {
    // Non-intern members (admins, companies, universities) cannot create an
    // intern profile, so the registration call-to-action would be a dead end
    // for them — show a neutral notice instead.
    if (user.role !== "INTERN") {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <Briefcase className="mb-3 h-10 w-10 text-slate-300" />
              <h3 className="font-semibold text-slate-900">
                <Trans comment="page h3 visible text">No Intern Passport on This Account
              </Trans></h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                <Trans comment="page p visible text">The Intern Passport is built from an intern profile. This account
                does not have one, so there is nothing to show here yet.
              </Trans></p>
              <Link href="/dashboard" className="mt-5">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Trans comment="page Button visible text">Back to Your Dashboards
                </Trans></Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FileText className="mb-3 h-10 w-10 text-slate-300" />
            <h3 className="font-semibold text-slate-900">
              <Trans comment="page h3 visible text">Create Your Intern Passport
            </Trans></h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              <Trans comment="page p visible text">Complete your profile to generate your professional Intern
              Passport for verified recruiters on MANTECH.
            </Trans></p>
            <Link href="/register/intern" className="mt-5">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Trans comment="page Button visible text">Complete Profile
              </Trans></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = (profile.user.fullName || "I").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            <Trans comment="page h1 visible text">My Intern Passport
          </Trans></h1>
          <p className="mt-1 text-sm text-slate-500">
            <Trans comment="page p visible text">Your verified professional profile shown to verified organizations
            recruiting on MANTECH Nexus.
          </Trans></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/intern/settings">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              <Trans comment="page Button visible text">Edit Profile
            </Trans></Button>
          </Link>
          <ShareButton
            path={`/intern-passports/${profile.id}`}
                  title={t({ message: '{name} — Intern Passport', values: { name: profile.user.fullName }, comment: 'Tooltip for the intern’s verified passport card' })}
            text={`${profile.user.fullName}'s verified Intern Passport on MANTECH Nexus.`}
          />
          <a
            href={waSharePassportLink({
              name: profile.user.fullName,
              headline: profile.passport?.headline,
              fieldName: profile.fieldOfStudy?.name,
              profileId: profile.id,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" />
            <Trans comment="page a visible text">Share on WhatsApp
          </Trans></a>
        </div>
      </div>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-white">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="flex items-start gap-4">
              {profile.user.avatarUrl ? (
                <Image
                  src={profile.user.avatarUrl}
                  alt={profile.user.fullName}
                  width={88}
                  height={88}
                  className="rounded-2xl object-cover border-4 border-white shadow-lg"
                  style={{ width: "88px", height: "88px" }}
                />
              ) : (
                <div
                  className="rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-3xl border-4 border-white shadow-lg"
                  style={{ width: "88px", height: "88px" }}
                >
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {profile.user.fullName}
                  </h2>
                  {profile.profileCompleted && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <Trans comment="page Badge visible text">Verified
                    </Trans></Badge>
                  )}
                </div>
                <p className="text-slate-600 mt-1">
                  {profile.passport?.headline ||
                    `${profile.fieldOfStudy?.name || "Professional"} · Internship Seeker`}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {profile.fieldOfStudy?.name || "Field not set"}
                  </Badge>
                  {profile.specialization?.name && (
                    <Badge
                      variant="outline"
                      className="border-slate-200 text-slate-700"
                    >
                      {profile.specialization.name}
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700"
                  >
                    <Trans comment="page Badge visible text">Readiness: </Trans>{profile.readinessScore}{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{"%"}</Badge>
                </div>
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Trans comment="Label introducing the intern’s unique passport identifier">Passport {ph({ numberSymbol: '#' })}
              </Trans></div>
              <div className="text-xl font-bold text-blue-600">
                {profile.passport?.passportNumber ||
                  "MT-" + profile.id.slice(0, 8).toUpperCase()}
              </div>
              <div className="mt-2 flex flex-wrap sm:justify-end gap-2">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-[11px]"
                >
                  <Eye className="h-3 w-3" />
                  {profile.passport?.viewCount || 0} <Trans comment="page Badge visible text">views
                </Trans></Badge>
              </div>
            </div>
          </div>

          {profile.passport?.summary && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm leading-relaxed text-slate-700">
                {profile.passport.summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              <Trans comment="page CardTitle visible text">Contact Information
            </Trans></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700">{profile.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700">
                {profile.region?.name || "Region not set"}{/* eslint-disable-next-line i18next/no-literal-string -- numeric value is data, not translation copy */}
{","}{" "}
                {profile.city || "City not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700">
                <Trans comment="page span visible text">Phone:</Trans>{" "}
                {profile.isPhonePublic ? profile.phone : "Hidden (privacy)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700">
                <Trans comment="page span visible text">Work mode: </Trans>{String(profile.preferredWorkMode).replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700">
                <Trans comment="page span visible text">Availability: </Trans>{profile.availability || "Not specified"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <Award className="h-4 w-4 text-slate-500" />
              <Trans comment="page CardTitle visible text">Qualifications
            </Trans></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                <Trans comment="page div visible text">Diploma
              </Trans></div>
              <p className="text-slate-700 mt-0.5">
                {profile.qualification || "Not specified"}
              </p>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                <Trans comment="page div visible text">Academic Level
              </Trans></div>
              <p className="text-slate-700 mt-0.5">
                {profile.academicLevel || "Not specified"}
              </p>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                <Trans comment="page div visible text">Institution
              </Trans></div>
              <p className="text-slate-700 mt-0.5">
                {profile.institution || "Seeking internship opportunities"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-500" />
            <Trans comment="page CardTitle visible text">Skills
          </Trans></CardTitle>
        </CardHeader>
        <CardContent>
          {profile.skills.length === 0 ? (
            <p className="text-sm text-slate-500"><Trans comment="page p visible text">No skills listed yet.</Trans></p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((sr: any) => (
                <Badge
                  key={sr.skillId}
                  variant="secondary"
                  className="px-3 py-1"
                >
                  {sr.skill.name}
                  {sr.proficiency && (
                    <span className="ml-1.5 text-[10px] opacity-70">
                      {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"· "}{sr.proficiency}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-slate-500" />
              <Trans comment="page CardTitle visible text">Education
            </Trans></CardTitle>
          </CardHeader>
          <CardContent>
            {profile.educations.length === 0 ? (
              <p className="text-sm text-slate-500"><Trans comment="page p visible text">No education records.</Trans></p>
            ) : (
              <div className="space-y-4">
                {profile.educations.map((edu: any) => (
                  <div key={edu.id} className="border-l-2 border-blue-200 pl-4">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {edu.qualification}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {edu.field} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"· "}{edu.institution}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {edu.startYear} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"- "}{edu.endYear || "Present"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-slate-500" />
              <Trans comment="page CardTitle visible text">Privacy Settings
            </Trans></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900"><Trans comment="page p visible text">Phone Visibility</Trans></p>
                <p className="text-xs text-slate-500">
                  {profile.isPhonePublic
                    ? "Visible to verified organizations"
                    : "Only MANTECH & applications"}
                </p>
              </div>
              <Badge variant={profile.isPhonePublic ? "default" : "secondary"}>
                {profile.isPhonePublic ? "Public" : "Private"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  <Trans comment="page p visible text">Passport Discoverability
                </Trans></p>
                <p className="text-xs text-slate-500">
                  {profile.isCvSearchable
                    ? "Organizations can find you in search"
                    : "Not in public passport search"}
                </p>
              </div>
              <Badge variant={profile.isCvSearchable ? "default" : "secondary"}>
                {profile.isCvSearchable ? "Searchable" : "Private"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verified experience (SRS §7) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base inline-flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-500" />
            <Trans comment="page CardTitle visible text">Experience
          </Trans></CardTitle>
        </CardHeader>
        <CardContent>
          {(profile.passport?.experiences.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-500">
              <Trans comment="page p visible text">No verified internship experience recorded yet. Completed placements and
              internships appear here once an organization verifies them.
            </Trans></p>
          ) : (
            <ul className="space-y-4">
              {profile.passport?.experiences.map((experience) => (
                <li key={experience.id} className="border-l-2 border-blue-200 pl-4">
                  <p className="font-semibold text-slate-900">{experience.roleTitle}</p>
                  <p className="text-sm text-slate-700">{experience.companyName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {experience.location} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"· "}{experience.durationMonths} <Trans comment="page p visible text">month
                    </Trans>{experience.durationMonths === 1 ? "" : "s"}
                  </p>
                  {experience.skillsVerified.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {experience.skillsVerified.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[11px]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {experience.endorsementComment && (
                    <p className="mt-2 text-sm italic text-slate-600">
                      {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"“"}{experience.endorsementComment}{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"”"}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Achievements and certifications (SRS §7) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-slate-500" />
            <Trans comment="page CardTitle visible text">Achievements &amp; Certifications
          </Trans></CardTitle>
        </CardHeader>
        <CardContent>
          {(profile.passport?.achievements.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-500">
              <Trans comment="page p visible text">No achievements recorded yet. Verified internships, qualifications and
              certifications are listed here.
            </Trans></p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.passport?.achievements.map((achievement) => (
                <li
                  key={achievement.id}
                  className="rounded-lg border border-amber-200 bg-amber-50/50 p-3"
                >
                  <p className="text-sm font-semibold text-slate-900">{achievement.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {achievement.issuer} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"·"}{" "}
                    {new Date(achievement.issueDate).toLocaleDateString()}
                  </p>
                  {achievement.description && (
                    <p className="mt-1 text-xs text-slate-600">{achievement.description}</p>
                  )}
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-amber-100 text-[10px] text-amber-800"
                  >
                    {achievement.category.replace(/_/g, " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-base inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            <Trans comment="page CardTitle visible text">CV &amp; Documents
          </Trans></CardTitle>
        </CardHeader>
        <CardContent>
          {profile.cvFiles.length === 0 ? (
            <p className="text-sm text-slate-500">
              <Trans comment="page p visible text">No CV uploaded yet. Upload from Settings.
            </Trans></p>
          ) : (
            <div className="space-y-2">
              {profile.cvFiles.map((cv: any) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-900">
                      {cv.fileName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(cv.fileSize / 1024).toFixed(1)} <Trans comment="page p visible text">KB · Uploaded</Trans>{" "}
                      {new Date(cv.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/api/cv/${cv.id}/access`} target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      <Trans comment="page Link visible text">Download
                    </Trans></Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
