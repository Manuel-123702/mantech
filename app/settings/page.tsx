import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
  Key,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  Globe,
  Eye,
  EyeOff,
  History,
  Briefcase,
  Building2,
  FileText,
  CheckCheck,
} from "lucide-react";
import { InternSettingsClient } from "./intern-settings-client";
import { logDatabaseUnavailable } from "@/lib/db-health";
import { Database } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session.userId;
  if (!userId) redirect("/sign-in?redirect_url=/settings");

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
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
  } catch (err) {
    logDatabaseUnavailable("settings", err);
    return (
      <div className="min-h-screen bg-slate-50 pb-20 pt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <Database className="mx-auto h-10 w-10 text-amber-600" />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Settings temporarily unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please try again in a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) redirect("/sign-in");

  if (user.role === "COMPANY") redirect("/dashboard/company/settings");
  if (user.role === "UNIVERSITY") redirect("/dashboard/university/settings");
  if (user.role === "ADMIN") redirect("/dashboard/admin/configuration");

  const profile = (user as any).internProfile;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.fullName?.charAt?.(0) || user.email?.charAt?.(0) || "I"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Account Settings
                </h1>
                <Badge className="bg-blue-100 text-blue-800 capitalize">
                  Intern
                </Badge>
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
                  Profile information
                </CardTitle>
                <CardDescription>
                  Information on your Intern Profile. Update your contact
                  details and discoverability preferences.
                </CardDescription>
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
                          bio:
                            profile.passport?.summary ??
                            profile.objectives ??
                            null,
                          availability: profile.availability,
                          workMode: profile.workMode,
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
                  Notification preferences
                </CardTitle>
                <CardDescription>
                  Control what updates you receive from MANTECH.
                </CardDescription>
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
                  Security &amp; authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Password &amp; sign-in
                  </p>
                  <p className="text-slate-600 mt-1">
                    Managed via Clerk secure authentication. Password resets and
                    2FA are available in your Clerk account.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    CV privacy
                  </p>
                  <p className="text-slate-600 mt-1">
                    CVs are never public. Only verified organizations may
                    request access. All access is audit-logged.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    Phone visibility
                  </p>
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
                  Recent notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-slate-500">
                  Application and interview status changes will appear here. See{" "}
                  <a
                    href="/notifications"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Notifications
                  </a>{" "}
                  for the full list.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  MANTECH support
                </CardTitle>
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
                      title="WhatsApp"
                    />
                    WhatsApp concierge
                  </p>
                  <p className="text-emerald-800 text-xs">
                    Get help with your profile or applications
                  </p>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
