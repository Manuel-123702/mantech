import { getServerT } from '@/i18n/server';
import { Trans } from '@lingui/react/macro';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { redirect } from '@/i18n/redirect';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_CONFIG } from "@/lib/config";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
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
  const t = getServerT();
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.fullName?.charAt?.(0) || user.email?.charAt?.(0) || "I"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                <Trans comment="page h1 visible text">Account Settings
              </Trans></h1>
              <Badge className="bg-blue-100 text-blue-800 capitalize">
                <Trans comment="page Badge visible text">Intern
              </Trans></Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                <Trans comment="page CardTitle visible text">Profile information
              </Trans></CardTitle>
              <CardDescription>
                <Trans comment="page CardDescription visible text">Update your contact details and discoverability preferences.
              </Trans></CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-500" />
                <Trans comment="page CardTitle visible text">Notification preferences
              </Trans></CardTitle>
              <CardDescription>
                <Trans comment="page CardDescription visible text">Control what updates you receive from MANTECH.
              </Trans></CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <Trans comment="page CardTitle visible text">Security &amp; authentication
              </Trans></CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  <Trans comment="page p visible text">Password &amp; sign-in
                </Trans></p>
                <p className="text-slate-600 mt-1">
                  <Trans comment="page p visible text">Managed via Clerk secure authentication. Password resets and
                  2FA are available in your Clerk account.
                </Trans></p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <Trans comment="page p visible text">CV privacy
                </Trans></p>
                <p className="text-slate-600 mt-1">
                  <Trans comment="page p visible text">CVs are never public. Only verified organizations may request
                  access. All access is audit-logged.
                </Trans></p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <Trans comment="page p visible text">Phone visibility
                </Trans></p>
                <p className="text-slate-600 mt-1">
                  {profile?.isPhonePublic
                    ? "Your phone is visible to verified organizations viewing your Passport."
                    : "Your phone number is hidden. Organizations must contact you via MANTECH first."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <Trans comment="page CardTitle visible text">Recent notifications
              </Trans></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-slate-500">
                <Trans comment="page p visible text">Application and interview status changes will appear here. See</Trans>{" "}
                <Link
                  href="/dashboard/intern/notifications"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  <Trans comment="page a visible text">Notifications
                </Trans></Link>{" "}
                <Trans comment="page p visible text">for the full list.
              </Trans></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <Trans comment="page CardTitle visible text">MANTECH support
              </Trans></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <a
                href={APP_CONFIG.contacts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-emerald-50 border border-emerald-200 p-3 hover:bg-emerald-100 transition"
              >
                <p className="font-semibold text-emerald-900 inline-flex items-center gap-1.5">
                  <WhatsAppIcon
                    className="h-4 w-4 text-[#25D366]"
                    title={t({ message: "WhatsApp", comment: "page component title attribute" })}
                  />
                  <Trans comment="page p visible text">WhatsApp concierge
                </Trans></p>
                <p className="text-emerald-800 text-xs">
                  <Trans comment="page p visible text">Get help with your profile or applications
                </Trans></p>
              </a>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
