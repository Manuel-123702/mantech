import { prisma } from '@/lib/prisma';
import type { PackageCode } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/config';
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { getPackageDefinition, getPackageLimits } from '@/lib/package-limits';
import BillingUpgradeClient from '@/components/dashboard/billing-upgrade-client';
import {
  CheckCircle2,
  Crown,
  Star,
  Rocket,
  Building2,
  Lock,
  MessageCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Users,
  FileText,
  Sparkles,
} from 'lucide-react';

type BillingOrganization = {
  id: string;
  packageCode: PackageCode;
  verificationStatus: string;
  members: { id: string }[];
};

export async function BillingView({ organization }: { organization: BillingOrganization }) {
  const [currentPkg, packages, limits] = await Promise.all([
    getPackageDefinition(organization.packageCode),
    prisma.package.findMany({ orderBy: { priceXAF: 'asc' } }),
    getPackageLimits(organization.packageCode),
  ]);

  const [subscriptions, activeOppsCount, savedCount] = await Promise.all([
    prisma.organizationSubscription.findMany({
      where: { organizationId: organization.id },
      include: { package: true },
      orderBy: { requestedAt: 'desc' },
    }),
    prisma.internshipOpportunity.count({
      where: { organizationId: organization.id, moderationStatus: { in: ['PUBLISHED', 'APPROVED', 'PENDING_REVIEW', 'DRAFT'] } },
    }),
    prisma.savedCandidate.count({ where: { organizationId: organization.id } }),
  ]);

  const usage = {
    activeOpportunities: activeOppsCount,
    activeOpportunitiesLimit: limits.activeOpportunities,
    savedCandidates: savedCount,
    recruiters: organization.members.length,
    recruitersLimit: limits.recruiterAccounts,
    featuredRemaining: limits.featuredBadges,
  };

  const usageBars = [
    {
      label: 'Active opportunities',
      used: usage.activeOpportunities,
      limit: limits.activeOpportunities === 999 ? 'Unlimited' : limits.activeOpportunities,
      pct:
        limits.activeOpportunities === 999
          ? 10
          : Math.min(100, (usage.activeOpportunities / limits.activeOpportunities) * 100),
      icon: FileText,
      tone: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Recruiter accounts',
      used: usage.recruiters,
      limit: limits.recruiterAccounts === 9999 ? 'Unlimited' : limits.recruiterAccounts,
      pct:
        limits.recruiterAccounts === 9999
          ? 20
          : Math.min(100, (usage.recruiters / limits.recruiterAccounts) * 100),
      icon: Users,
      tone: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Featured opportunities',
      used: 0,
      limit: limits.featuredBadges === 0 ? 'Upgrade' : limits.featuredBadges,
      pct: limits.featuredBadges === 0 ? 0 : 10,
      icon: Sparkles,
      tone: 'from-amber-500 to-orange-500',
    },
  ];

  const iconFor = (code: PackageCode) => {
    if (code === 'PROFESSIONAL') return Star;
    if (code === 'BUSINESS') return Rocket;
    if (code === 'ENTERPRISE') return Building2;
    return Lock;
  };

  const toneFor = (code: PackageCode) => {
    if (code === 'PROFESSIONAL') return 'from-blue-500 to-indigo-600';
    if (code === 'BUSINESS') return 'from-purple-600 to-fuchsia-600';
    if (code === 'ENTERPRISE') return 'from-amber-500 to-orange-600';
    return 'from-slate-500 to-slate-700';
  };

  const cardToneFor = (code: PackageCode) => {
    if (code === 'PROFESSIONAL') return 'border-blue-200 bg-blue-50/40';
    if (code === 'BUSINESS') return 'border-purple-200 bg-purple-50/40';
    if (code === 'ENTERPRISE') return 'border-amber-200 bg-amber-50/40';
    return 'border-slate-200 bg-white';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Package</h2>
          <p className="text-sm text-slate-500">
            Current subscription, usage limits and package upgrades via MANTECH WhatsApp.
          </p>
        </div>
        <a
          href={APP_CONFIG.contacts.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>
            <WhatsAppIcon className="mr-2 h-4 w-4" title="WhatsApp" />
            Contact billing via WhatsApp
          </Button>
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl bg-gradient-to-br ${toneFor(organization.packageCode)} p-3 text-white shadow-lg`}>
                  {(() => {
                    const Ic = iconFor(organization.packageCode);
                    return <Ic className="h-6 w-6" />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Current package
                    </p>
                    {organization.verificationStatus === 'VERIFIED' && (
                      <Badge variant="outline" className="inline-flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{currentPkg.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{currentPkg.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Pricing
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {currentPkg.priceXAF === 0 ? 'Free' : `${currentPkg.priceXAF.toLocaleString()} XAF`}
                </p>
                <p className="text-xs text-slate-500">
                  {currentPkg.code === 'ENTERPRISE' ? 'Custom agreement' : 'Manual activation'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {usageBars.map((u) => (
                <div key={u.label} className="rounded-xl border bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600 inline-flex items-center gap-1.5">
                      <u.icon className="h-3.5 w-3.5 text-slate-500" />
                      {u.label}
                    </p>
                  </div>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {u.used}
                    <span className="text-sm font-normal text-slate-500"> / {u.limit}</span>
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${u.tone}`}
                      style={{ width: `${u.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {currentPkg.features && currentPkg.features.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Included features
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {currentPkg.features.map((f) => (
                    <li key={f} className="inline-flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Payment method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">WhatsApp concierge</p>
                  <p className="text-xs text-slate-500">Manual activation · MANTECH team</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              MANTECH does not process cards in-app. Upgrades and activations are handled by
              the MANTECH billing team on WhatsApp.
            </p>

            <div className="rounded-lg border bg-white p-3 text-xs text-slate-500 space-y-1">
              <p className="inline-flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Official contact:</span>
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" title="WhatsApp" />
                <span>Use the WhatsApp concierge button</span>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span>{' '}
                {APP_CONFIG.contacts.email}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Working hours:</span>{' '}
                {APP_CONFIG.contacts.workingHours}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 inline-flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" />
          Upgrade plans
        </h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {packages
            .filter((pkg) => pkg.code !== 'FREE')
            .map((pkg) => {
              const Icon = iconFor(pkg.code);
              const isCurrent = pkg.code === organization.packageCode;
              const whatsappLink = `${APP_CONFIG.contacts.whatsappLink}?text=${encodeURIComponent(
                `Hello MANTECH Nexus, ${organization.id} would like to upgrade to the ${pkg.name} package.`
              )}`;
              return (
                <Card
                  key={pkg.id}
                  className={
                    'relative overflow-hidden transition ' +
                    (pkg.isFeaturedBadge ? 'ring-2 ring-blue-500 shadow-lg ' : '') +
                    cardToneFor(pkg.code)
                  }
                >
                  {pkg.isFeaturedBadge && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Crown className="mr-1 h-3 w-3" />
                        Recommended
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl bg-gradient-to-br ${toneFor(pkg.code)} p-2.5 text-white shadow`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-bold text-slate-900">
                        {pkg.priceXAF === 0 ? 'Free' : `${pkg.priceXAF.toLocaleString()} XAF`}
                      </p>
                      <p className="text-sm text-slate-500">
                        {pkg.code === 'ENTERPRISE' ? 'Custom agreement' : 'Manual activation'}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <ul className="space-y-2">
                      {pkg.features.map((f) => (
                        <li key={f} className="inline-flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <BillingUpgradeClient
                      packageCode={pkg.code}
                      packageName={pkg.name}
                      whatsappLink={whatsappLink}
                      currentCode={organization.packageCode}
                      buttonChildren={
                        isCurrent ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Current plan
                          </>
                        ) : (
                          <>
                            Upgrade to {pkg.name}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )
                      }
                      disabled={isCurrent}
                    />
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription requests & billing history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Package</th>
                    <th className="text-left px-4 py-3 font-medium">Price</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Requested</th>
                    <th className="text-left px-4 py-3 font-medium">Activated</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {s.package.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {s.package.priceXAF.toLocaleString()} XAF
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            s.status === 'ACTIVE'
                              ? 'default'
                              : s.status === 'PENDING_PAYMENT'
                                ? 'secondary'
                                : s.status === 'EXPIRED' || s.status === 'CANCELLED'
                                  ? 'destructive'
                                  : 'outline'
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(s.requestedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {s.activatedAt
                          ? new Date(s.activatedAt).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
