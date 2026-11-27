import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { APP_CONFIG } from "@/lib/config";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { CandidateAvatar } from "@/components/shared/candidate-avatar";
import {
  User,
  Shield,
  Bell,
  Lock,
  History,
  Briefcase,
  FileText,
  Eye,
} from "lucide-react";
import { InternSettingsClient } from "@/app/settings/intern-settings-client";

export default async function InternSettingsDashboardPage() {
  const userData = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: userData.id },
    include: {
      internProfile: {
        include: {
          passport: true,
          region: true,
          fieldOfStudy: true,
        },
      },
    },
  });

  if (!user) redirect("/sign-in");

  const profile = user.internProfile;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 sm:p-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <CandidateAvatar
            src={user.avatarUrl}
            name={user.fullName || user.email || "Candidate"}
            size="lg"
            priority
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
                Account Settings
              </h1>
              <Badge className="bg-blue-950/70 text-blue-300 border border-blue-500/30 capitalize">
                Candidate
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1 break-all">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 sm:p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white inline-flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400 shrink-0" />
                Profile information
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Update your contact details and discoverability preferences.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 sm:p-5 text-slate-900">
              <InternSettingsClient
                mode="profile"
                user={{
                  id: user.id,
                  fullName: user.fullName,
                  email: user.email,
                  avatarUrl: user.avatarUrl ?? null,
                }}
                profile={
                  profile
                    ? {
                        id: profile.id,
                        avatarUrl: user.avatarUrl ?? null,
                        cvUrl: profile.cvUrl ?? null,
                        cvFileName: profile.cvFileName ?? null,
                        cvFileSize: profile.cvFileSize ?? null,
                        phone: profile.phone,
                        bio: profile.passport?.summary ?? null,
                        availability: profile.availability,
                        workMode: profile.preferredWorkMode as any,
                        isPhonePublic: profile.isPhonePublic,
                        isCvSearchable: profile.isCvSearchable,
                        city: profile.city,
                        regionId: profile.regionId,
                        regionName: profile.region?.name ?? null,
                        fieldName: profile.fieldOfStudy?.name ?? null,
                        qualification: profile.qualification,
                        readinessScore: profile.readinessScore,
                        targetRole: profile.targetRole,
                        targetIndustries: profile.targetIndustries,
                        careerGoals: profile.careerGoals,
                        skillsToImprove: profile.skillsToImprove,
                      }
                    : null
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 sm:p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white inline-flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400 shrink-0" />
                Notification preferences
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Control what updates you receive from MANTECH.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 sm:p-5 text-slate-900">
              <InternSettingsClient
                mode="notifications"
                user={{
                  id: user.id,
                  fullName: user.fullName,
                  email: user.email,
                  avatarUrl: user.avatarUrl ?? null,
                }}
                profile={null}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 shadow-lg">
            <h2 className="text-base font-bold text-white inline-flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-blue-400 shrink-0" />
              Security &amp; authentication
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-3">
                <p className="font-semibold text-white inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  Password &amp; sign-in
                </p>
                <p className="text-slate-300 mt-1 break-words text-xs">
                  Managed via Clerk secure authentication. Password resets and
                  2FA are available in your Clerk account.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-3">
                <p className="font-semibold text-white inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  CV privacy
                </p>
                <p className="text-slate-300 mt-1 break-words text-xs">
                  CVs are view-only for logged-in members and cannot be downloaded directly. All access is audit-logged.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-3">
                <p className="font-semibold text-white inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  Phone visibility
                </p>
                <p className="text-slate-300 mt-1 break-words text-xs">
                  {profile?.isPhonePublic
                    ? "Your phone is visible to verified organizations viewing your Passport."
                    : "Your phone number is hidden. Organizations must contact you via MANTECH first."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 shadow-lg">
            <h2 className="text-base font-bold text-white inline-flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-blue-400 shrink-0" />
              Recent notifications
            </h2>
            <p className="text-xs text-slate-300 break-words">
              Application and interview status changes will appear here. See{" "}
              <a
                href="/dashboard/intern/notifications"
                className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
              >
                Notifications
              </a>{" "}
              for the full list.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-5 shadow-lg">
            <h2 className="text-base font-bold text-white inline-flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-blue-400 shrink-0" />
              MANTECH support
            </h2>
            <a
              href={APP_CONFIG.contacts.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-3.5 hover:bg-emerald-950/80 transition"
            >
              <p className="font-semibold text-emerald-300 inline-flex items-center gap-1.5 text-sm">
                <WhatsAppIcon
                  className="h-4 w-4 text-[#25D366]"
                  title="WhatsApp"
                />
                WhatsApp concierge
              </p>
              <p className="text-emerald-200/80 text-xs mt-1">
                Get help with your profile or applications
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
