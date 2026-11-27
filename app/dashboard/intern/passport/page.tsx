import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/shared/share-button";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import { CvViewButton } from "@/components/shared/cv-viewer-modal";
import { waSharePassportLink } from "@/lib/whatsapp";
import {
  Edit,
  Eye,
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

export default async function InternPassportDashboardPage() {
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
    if (user.role !== "INTERN") {
      return (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 flex flex-col items-center py-14 px-4 text-center">
          <Briefcase className="mb-3 h-10 w-10 text-slate-500" />
          <h3 className="font-bold text-white text-lg">
            No Candidate Passport on This Account
          </h3>
          <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-300">
            The Candidate Passport is built from a candidate profile. This account
            does not have one, so there is nothing to show here yet.
          </p>
          <Link href="/dashboard" className="mt-5">
            <Button className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-xl font-bold text-xs">
              Back to Your Dashboards
            </Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 flex flex-col items-center py-14 px-4 text-center">
        <FileText className="mb-3 h-10 w-10 text-slate-500" />
        <h3 className="font-bold text-white text-lg">
          Create Your Candidate Passport
        </h3>
        <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-300">
          Complete your profile to generate your professional Candidate Passport
          for verified recruiters on MANTECH.
        </p>
        <Link href="/register/intern" className="mt-5">
          <Button className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-xl font-bold text-xs">
            Complete Profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            My Passport
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 break-words">
            Your verified professional profile shown to employers and recruiters on MANTECH Nexus.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/intern/passport/edit">
            <Button className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white font-bold text-xs rounded-xl shadow-md">
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </Link>
          <ShareButton
            path={`/intern-passports/${profile.id}`}
            title={`${profile.user.fullName} — Candidate Passport`}
            text={`${profile.user.fullName}'s verified Candidate Passport on MANTECH Nexus.`}
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-500 hover:text-white shadow-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Share on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Identity Card */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-slate-900/90 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <CandidateAvatar
              src={profile.user.avatarUrl}
              name={profile.user.fullName || "Candidate"}
              size={84}
              className="border-2 border-blue-400/40 shadow-lg"
              priority
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                  {profile.user.fullName}
                </h2>
                {profile.profileCompleted && (
                  <Badge className="bg-emerald-600 text-white border-0 flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-slate-300 mt-1 text-xs sm:text-sm break-words">
                {profile.passport?.headline ||
                  `${profile.fieldOfStudy?.name || "Professional"} · Job & Internship Seeker`}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-blue-950/80 text-blue-300 border border-blue-500/40 text-[11px]">
                  {profile.fieldOfStudy?.name || "Field not set"}
                </Badge>
                {profile.specialization?.name && (
                  <Badge className="bg-slate-800 text-slate-200 border border-slate-600 text-[11px]">
                    {profile.specialization.name}
                  </Badge>
                )}
                <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px]">
                  Readiness: {profile.readinessScore}%
                </Badge>
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Passport #
            </div>
            <div className="text-lg sm:text-xl font-bold text-blue-400 font-mono">
              {profile.passport?.passportNumber ||
                "MT-" + profile.id.slice(0, 8).toUpperCase()}
            </div>
            <div className="mt-2 flex flex-wrap sm:justify-end gap-2">
              <Badge className="bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1 text-[11px]">
                <Eye className="h-3 w-3 text-blue-400" />
                {profile.passport?.viewCount || 0} views
              </Badge>
            </div>
          </div>
        </div>

        {profile.passport?.summary && (
          <div className="mt-5 pt-5 border-t border-slate-800">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 break-words whitespace-pre-line">
              {profile.passport.summary}
            </p>
          </div>
        )}
      </div>

      {/* Contact & Qualifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-3 text-xs sm:text-sm">
          <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading">
            <Building2 className="h-4 w-4 text-blue-400 shrink-0" />
            Contact &amp; Availability
          </h3>
          <div className="space-y-2.5 text-slate-300">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-all">{profile.user.email}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words">
                {profile.region?.name || "Region not set"},{" "}
                {profile.city || "City not set"}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Eye className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words">
                Phone:{" "}
                {profile.isPhonePublic ? profile.phone : `${profile.phone} (Private to you)`}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Globe className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Work mode: {String(profile.preferredWorkMode).replace("_", " ")}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Availability: {profile.availability || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-3 text-xs sm:text-sm">
          <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading">
            <Award className="h-4 w-4 text-amber-400 shrink-0" />
            Qualifications
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Diploma / Qualification
              </div>
              <p className="text-slate-200 mt-0.5 font-medium break-words">
                {profile.qualification || "Not specified"}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Academic Level
              </div>
              <p className="text-slate-200 mt-0.5 font-medium break-words">
                {profile.academicLevel || "Not specified"}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Institution
              </div>
              <p className="text-slate-200 mt-0.5 font-medium break-words">
                {profile.institution || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5">
        <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading mb-3">
          <Briefcase className="h-4 w-4 text-emerald-400 shrink-0" />
          Skills &amp; Competencies
        </h3>
        {profile.skills.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400">No skills listed yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((sr: any) => (
              <Badge
                key={sr.skillId}
                className="bg-slate-800 text-slate-100 border border-slate-600 px-3 py-1 text-xs"
              >
                {sr.skill.name}
                {sr.proficiency && (
                  <span className="ml-1.5 text-[10px] text-slate-400">
                    · {sr.proficiency}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Education & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5">
          <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading mb-3">
            <GraduationCap className="h-4 w-4 text-blue-400 shrink-0" />
            Education
          </h3>
          {profile.educations.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400">No education records.</p>
          ) : (
            <div className="space-y-4">
              {profile.educations.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-blue-500/50 pl-4">
                  <h4 className="font-semibold text-sm text-white break-words">
                    {edu.qualification}
                  </h4>
                  <p className="text-xs text-slate-300 break-words">
                    {edu.field} · {edu.institution}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 space-y-3 text-xs sm:text-sm">
          <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading">
            <UserCheck className="h-4 w-4 text-purple-400 shrink-0" />
            Privacy Settings
          </h3>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 p-3">
            <div className="min-w-0">
              <p className="font-semibold text-white">Phone Visibility</p>
              <p className="text-xs text-slate-400 break-words">
                {profile.isPhonePublic
                  ? "Visible to verified organizations"
                  : "Hidden on public passport"}
              </p>
            </div>
            <Badge className={profile.isPhonePublic ? "bg-emerald-600 text-white shrink-0" : "bg-slate-700 text-slate-200 shrink-0"}>
              {profile.isPhonePublic ? "Public" : "Private"}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 p-3">
            <div className="min-w-0">
              <p className="font-semibold text-white">
                Passport Discoverability
              </p>
              <p className="text-xs text-slate-400 break-words">
                {profile.isCvSearchable
                  ? "Organizations can find you in search"
                  : "Not in public passport search"}
              </p>
            </div>
            <Badge className={profile.isCvSearchable ? "bg-emerald-600 text-white shrink-0" : "bg-slate-700 text-slate-200 shrink-0"}>
              {profile.isCvSearchable ? "Searchable" : "Private"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Verified Experience */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5">
        <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading mb-3">
          <Building className="h-4 w-4 text-blue-400 shrink-0" />
          Experience
        </h3>
        {(profile.passport?.experiences.length ?? 0) === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400">
            No verified internship or job experience recorded yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {profile.passport?.experiences.map((experience) => (
              <li key={experience.id} className="border-l-2 border-blue-500/50 pl-4">
                <p className="font-semibold text-white break-words">{experience.roleTitle}</p>
                <p className="text-xs sm:text-sm text-slate-300 break-words">{experience.companyName}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {experience.location} · {experience.durationMonths} month
                  {experience.durationMonths === 1 ? "" : "s"}
                </p>
                {experience.skillsVerified.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {experience.skillsVerified.map((skill) => (
                      <Badge key={skill} className="bg-slate-800 text-slate-200 border border-slate-700 text-[11px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                {experience.endorsementComment && (
                  <p className="mt-2 text-xs sm:text-sm italic text-slate-300">
                    “{experience.endorsementComment}”
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Achievements & Certifications */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5">
        <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading mb-3">
          <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
          Achievements &amp; Certifications
        </h3>
        {(profile.passport?.achievements.length ?? 0) === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400">
            No achievements recorded yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {profile.passport?.achievements.map((achievement) => (
              <li
                key={achievement.id}
                className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3.5"
              >
                <p className="text-sm font-semibold text-white break-words">{achievement.title}</p>
                <p className="mt-0.5 text-xs text-slate-300 break-words">
                  {achievement.issuer} ·{" "}
                  {new Date(achievement.issueDate).toLocaleDateString()}
                </p>
                {achievement.description && (
                  <p className="mt-1 text-xs text-slate-300 break-words">{achievement.description}</p>
                )}
                <Badge className="mt-2 bg-amber-900/70 text-amber-200 border border-amber-500/30 text-[10px]">
                  {achievement.category.replace(/_/g, " ")}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CV & Documents (View Only) */}
      <div className="rounded-2xl border border-blue-500/30 bg-slate-900/75 p-5">
        <h3 className="text-base font-bold text-white inline-flex items-center gap-2 font-heading mb-3">
          <Eye className="h-4 w-4 text-blue-400 shrink-0" />
          CV &amp; Documents (Online Preview)
        </h3>
        {profile.cvFiles.length === 0 && !profile.cvUrl ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-400">
              No CV uploaded yet. Upload your CV in Edit Profile.
            </p>
            <Link href="/dashboard/intern/passport/edit">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-xl text-xs font-bold">
                Upload CV
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.cvFiles.length > 0 ? (
              profile.cvFiles.map((cv: any) => (
                <div
                  key={cv.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white break-words">
                      {cv.fileName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(cv.fileSize / 1024).toFixed(1)} KB · Uploaded{" "}
                      {new Date(cv.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <CvViewButton
                    cvUrl={cv.fileUrl || profile.cvUrl}
                    candidateName={profile.user.fullName || "Candidate"}
                    fileName={cv.fileName}
                    label="View CV"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0"
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white break-words">
                    {profile.cvFileName || "Curriculum Vitae.pdf"}
                  </p>
                  <p className="text-xs text-slate-400">Uploaded CV</p>
                </div>
                <CvViewButton
                  cvUrl={profile.cvUrl}
                  candidateName={profile.user.fullName || "Candidate"}
                  fileName={profile.cvFileName || "Curriculum Vitae.pdf"}
                  label="View CV"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
