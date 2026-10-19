import { prisma } from '@/lib/prisma';
import type { UserRole } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/lib/config';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import SettingsClient, { type SettingsOrgType } from '@/components/dashboard/settings-client';
import {
  Building2,
  Users,
  ShieldCheck,
  Bell,
  Lock,
  History,
  Briefcase,
  Globe,
  Mail,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export type SettingsOrganization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  industryId: string | null;
  regionId: string | null;
  city: string | null;
  address: string | null;
  size: string | null;
  verificationStatus: string;
  verifiedAt: Date | null;
  packageCode: string;
  industry?: { name: string } | null;
  region?: { name: string } | null;
  companyProfile?: { techStack: string[]; perks: string[]; branches: string[] } | null;
  universityProfile?: { universityType: string | null; faculties: string[] } | null;
  members: {
    id: string;
    userId: string;
    jobTitle: string | null;
    isOwner: boolean;
    role: string;
    joinedAt: Date;
    user: { fullName: string; email: string; avatarUrl: string | null; role: string };
  }[];
};

function toSettingsOrgData(organization: SettingsOrganization) {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    description: organization.description,
    website: organization.website,
    email: organization.email,
    phone: organization.phone,
    logoUrl: organization.logoUrl,
    industryId: organization.industryId,
    industryName: organization.industry?.name,
    regionId: organization.regionId,
    regionName: organization.region?.name,
    city: organization.city,
    address: organization.address,
    size: organization.size,
    verificationStatus: organization.verificationStatus,
    verifiedAt: organization.verifiedAt,
    packageCode: organization.packageCode,
    techStack: organization.companyProfile?.techStack || [],
    perks: organization.companyProfile?.perks || [],
    branches: organization.companyProfile?.branches || [],
    universityType: organization.universityProfile?.universityType || null,
    faculties: organization.universityProfile?.faculties || [],
    members: organization.members.map((m) => ({
      id: m.id,
      userId: m.userId,
      jobTitle: m.jobTitle,
      isOwner: m.isOwner,
      role: m.role,
      joinedAt: new Date(m.joinedAt).toISOString(),
      user: {
        fullName: m.user.fullName,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        role: m.user.role,
      },
    })),
  };
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

const COMPANY_ENTITY_TYPES = [
  'InternshipOpportunity',
  'Application',
  'Interview',
  'Placement',
  'SavedCandidate',
  'CandidateContact',
  'CVFileMetadata',
  'OrganizationSubscription',
  'Organization',
];

export async function SettingsView({
  orgType,
  organization,
  userId,
}: {
  orgType: SettingsOrgType;
  organization: SettingsOrganization;
  userId: string;
}) {
  const isUniversity = orgType === 'UNIVERSITY';

  const actorRoles: UserRole[] = isUniversity ? ['UNIVERSITY', 'ADMIN'] : ['COMPANY', 'ADMIN'];

  const recentAudit = await prisma.auditLog
    .findMany({
      where: {
        OR: [
          { actorRole: { in: actorRoles } },
          { entityType: { in: COMPANY_ENTITY_TYPES } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    .catch(() => []);

  const verificationTone =
    organization.verificationStatus === 'VERIFIED'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : organization.verificationStatus === 'REJECTED'
        ? 'bg-red-50 border-red-200 text-red-900'
        : organization.verificationStatus === 'SUSPENDED'
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-amber-50 border-amber-200 text-amber-900';

  const orgData = toSettingsOrgData(organization);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500">
            {isUniversity ? 'Institution profile' : 'Organization profile'}, team members, notifications, security and activity.
          </p>
        </div>
      </div>

      <Card className={verificationTone + ' border'}>
        <CardContent className="pt-6 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {organization.verificationStatus === 'VERIFIED' ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-700 mt-0.5" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-700 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                Verification status: {organization.verificationStatus}
              </p>
              {organization.verificationStatus === 'VERIFIED' ? (
                <p className="text-sm opacity-80">
                  {isUniversity
                    ? 'Your institution is verified. Placement tools and recruiting access are active.'
                    : 'Your organization is verified. Intern Passport discovery and CV access are active.'}
                </p>
              ) : (
                <p className="text-sm opacity-80">
                  Complete verification with MANTECH to unlock Intern Passport search, authorized CV access,
                  and priority visibility.
                </p>
              )}
            </div>
          </div>
          {organization.verificationStatus !== 'VERIFIED' && (
            <a
              href={APP_CONFIG.contacts.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge variant="default" className="cursor-pointer">
                Request verification on WhatsApp
              </Badge>
            </a>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex items-center gap-2">
                {isUniversity ? (
                  <ShieldCheck className="h-5 w-5 text-slate-500" />
                ) : (
                  <Building2 className="h-5 w-5 text-slate-500" />
                )}
                {isUniversity ? 'Institution profile' : 'Organization profile'}
              </CardTitle>
              <CardDescription>
                {isUniversity
                  ? 'Public information about your institution on MANTECH marketplace.'
                  : 'Public information about your company on MANTECH marketplace.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsClient mode="profile" orgType={orgType} organization={orgData} userId={userId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-500" />
                Team members & permissions
              </CardTitle>
              <CardDescription>
                {isUniversity
                  ? 'Invite staff and control who can coordinate placements or recruit on behalf of the institution.'
                  : 'Invite recruiters and control who can manage candidates, interviews and placements.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y rounded-xl border">
                {orgData.members.map((m) => (
                  <div key={m.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                        {initials(m.user.fullName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900 truncate">
                            {m.user.fullName}
                          </p>
                          {m.isOwner && (
                            <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{m.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{m.role}</Badge>
                      {m.jobTitle && (
                        <span className="text-xs text-slate-500 hidden sm:inline">{m.jobTitle}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <SettingsClient mode="members" orgType={orgType} organization={orgData} userId={userId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-500" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose which updates reach you by email and in-platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsClient mode="notifications" orgType={orgType} organization={orgData} userId={userId} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                Privacy & data access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  CV access
                </p>
                <p className="text-slate-600 mt-1">
                  CVs are never exposed publicly. Access is server-authorized, auditable, and
                  only granted to verified organizations.
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Candidate phone privacy
                </p>
                <p className="text-slate-600 mt-1">
                  Phone numbers default to private. Use the &ldquo;Contact&rdquo; action to
                  request access; candidates must approve it.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base inline-flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAudit.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">No recent activity.</p>
              ) : (
                <ol className="space-y-3 border-l border-slate-200 pl-4">
                  {recentAudit.map((entry) => (
                    <li key={entry.id} className="relative text-sm">
                      <span className="absolute -left-[17px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">{entry.action}</p>
                        <span className="text-xs text-slate-500">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {entry.entityType} {entry.entityId ? `· ${entry.entityId.slice(0, 8)}` : ''}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
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
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" title="WhatsApp" />
                  WhatsApp concierge
                </p>
                <p className="text-emerald-800 text-xs">Start a chat with MANTECH</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
