import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminDashboard } from "@/lib/admin-dashboard";
import {
  BarChart3,
  Users,
  Briefcase,
  Building2,
  FileText,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Globe,
  Landmark,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function DistributionBars({
  groups,
  color = "bg-amber-500",
}: {
  groups: { label: string; count: number }[];
  color?: string;
}) {
  const total = groups.reduce((sum, g) => sum + g.count, 0) || 1;
  return (
    <div className="space-y-2.5">
      {groups.length === 0 ? (
        <p className="text-xs text-slate-400">No data yet.</p>
      ) : (
        groups.map((g) => (
          <div key={g.label}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-slate-300 break-words">{g.label}</span>
              <span className="font-mono font-semibold text-white shrink-0">
                {g.count}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${Math.max((g.count / total) * 100, 2)}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  await requireAdminDashboard();

  const [
    userCount,
    internCount,
    companyCount,
    universityCount,
    opportunityCount,
    publishedOppCount,
    applicationCount,
    placementCount,
    passportCount,
    featuredActive,
    verifiedOrgs,
    pendingVerifications,
    usersByRole,
    oppsByField,
    oppsByRegion,
    appsByStatus,
    placementsByStatus,
    internsByQualification,
    companiesByIndustry,
    recentSignups,
    recentOpps,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.internProfile.count(),
    prisma.organization.count({ where: { type: "COMPANY" } }),
    prisma.organization.count({ where: { type: "UNIVERSITY" } }),
    prisma.internshipOpportunity.count(),
    prisma.internshipOpportunity.count({
      where: { moderationStatus: "PUBLISHED" },
    }),
    prisma.application.count(),
    prisma.placement.count(),
    prisma.internPassport.count(),
    prisma.featuredOpportunity.count({
      where: { isActive: true, endsAt: { gte: new Date() } },
    }),
    prisma.organization.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.organization.count({ where: { verificationStatus: "PENDING" } }),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.internshipOpportunity
      .groupBy({ by: ["fieldId"], _count: { _all: true } })
      .then(async (rows) => {
        const ids = rows.map((r) => r.fieldId).filter(Boolean);
        const fields = await prisma.field.findMany({
          where: { id: { in: ids as string[] } },
        });
        const map = new Map(fields.map((f) => [f.id, f.name]));
        return rows
          .filter((r) => r.fieldId)
          .map((r) => ({
            label: map.get(r.fieldId as string) || (r.fieldId as string),
            count: r._count._all,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
      }),
    prisma.internshipOpportunity
      .groupBy({ by: ["regionId"], _count: { _all: true } })
      .then(async (rows) => {
        const ids = rows.map((r) => r.regionId).filter(Boolean);
        const regions = await prisma.region.findMany({
          where: { id: { in: ids as string[] } },
        });
        const map = new Map(regions.map((r) => [r.id, r.name]));
        return rows
          .filter((r) => r.regionId)
          .map((r) => ({
            label: map.get(r.regionId as string) || (r.regionId as string),
            count: r._count._all,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
      }),
    prisma.application
      .groupBy({ by: ["status"], _count: { _all: true } })
      .then((rows) =>
        rows.map((r) => ({ label: r.status, count: r._count._all })),
      ),
    prisma.placement
      .groupBy({ by: ["status"], _count: { _all: true } })
      .then((rows) =>
        rows.map((r) => ({ label: r.status, count: r._count._all })),
      ),
    prisma.internProfile
      .groupBy({ by: ["qualification"], _count: { _all: true } })
      .then((rows) =>
        rows
          .filter((r) => r.qualification)
          .map((r) => ({
            label: r.qualification as string,
            count: r._count._all,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6),
      ),
    prisma.organization
      .findMany({
        where: { type: "COMPANY" },
        include: { industry: { select: { name: true } } },
      })
      .then((orgs) => {
        const byIndustry = new Map<string, number>();
        orgs.forEach((o) => {
          const name = o.industry?.name || "Uncategorized";
          byIndustry.set(name, (byIndustry.get(name) || 0) + 1);
        });
        return Array.from(byIndustry.entries())
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
      }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.internshipOpportunity.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        moderationStatus: true,
        createdAt: true,
        organization: { select: { name: true } },
      },
    }),
  ]);

  const roleCountMap = new Map(usersByRole.map((r) => [r.role, r._count._all]));
  const selectedCount =
    appsByStatus.find((s) => s.label === "SELECTED")?.count || 0;
  const conversionRate =
    applicationCount === 0
      ? 0
      : Math.round((selectedCount / applicationCount) * 100);

  const kpis = [
    { label: "Total users", value: userCount, icon: Users, change: "+12%" },
    {
      label: "Candidate profiles",
      value: internCount,
      icon: GraduationCap,
      change: `Passports: ${passportCount}`,
    },
    {
      label: "Organizations",
      value: companyCount + universityCount,
      icon: Building2,
      change: `${verifiedOrgs} verified`,
    },
    {
      label: "Published openings",
      value: publishedOppCount,
      icon: Briefcase,
      change: `${opportunityCount} total`,
    },
    {
      label: "Applications",
      value: applicationCount,
      icon: FileText,
      change: `${conversionRate}% → selected`,
    },
    {
      label: "Placements",
      value: placementCount,
      icon: UserCheck,
      change: `Featured: ${featuredActive}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white inline-flex items-center gap-2 break-words">
            <BarChart3 className="h-4 w-4 text-amber-400 shrink-0" />
            Marketplace analytics
          </h2>
          <p className="mt-1 text-xs text-slate-300 break-words">
            Aggregated platform metrics, conversion signals, and
            geographic/demographic distribution.
          </p>
        </div>
        <Badge className="bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 shrink-0">
          Updated live
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 break-words">
                  {kpi.label}
                </span>
                <Icon className="h-4 w-4 text-amber-400 shrink-0" />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-white">
                {kpi.value.toLocaleString()}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-emerald-400 break-words">
                <TrendingUp className="h-3 w-3 shrink-0" />
                {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-400 shrink-0" />
            User roles
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">
            Account population by platform role
          </p>
          {(["INTERN", "COMPANY", "UNIVERSITY", "ADMIN"] as const).map(
            (role) => {
              const count = roleCountMap.get(role as any) || 0;
              const total =
                usersByRole.reduce((s, r) => s + r._count._all, 0) || 1;
              return (
                <div key={role} className="mb-2.5 last:mb-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 capitalize">
                      {role.toLowerCase()}
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {count}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${Math.max((count / total) * 100, 2)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            },
          )}
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400 shrink-0" />
            Applications by status
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Pipeline conversion snapshot</p>
          <DistributionBars groups={appsByStatus} color="bg-blue-500" />
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            Placements by status
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">
            Active, confirmed, completed cohorts
          </p>
          <DistributionBars
            groups={placementsByStatus}
            color="bg-emerald-500"
          />
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-400 shrink-0" />
            Opportunities by field
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Top fields of study with openings</p>
          <DistributionBars groups={oppsByField} color="bg-indigo-500" />
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <Globe className="h-4 w-4 text-rose-400 shrink-0" />
            Opportunities by region
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Geographic demand across Cameroon</p>
          <DistributionBars groups={oppsByRegion} color="bg-rose-500" />
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <Landmark className="h-4 w-4 text-amber-400 shrink-0" />
            Companies by industry
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">
            Enterprise host sector distribution
          </p>
          <DistributionBars
            groups={companiesByIndustry}
            color="bg-amber-500"
          />
        </div>
      </div>

      {internsByQualification.length > 0 && (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-teal-400 shrink-0" />
            Candidates by qualification
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">
            OHADA / Cameroon academic attainment within the talent pool
          </p>
          <DistributionBars
            groups={internsByQualification}
            color="bg-teal-500"
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent account signups</h3>
              <p className="text-xs text-slate-400">
                Latest users joining the platform
              </p>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              Manage users <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentSignups.map((u) => (
              <div
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white break-words">
                    {u.fullName}
                  </p>
                  <p className="text-[11px] text-slate-400 break-all">
                    {u.email}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className="bg-slate-900 text-slate-200 border border-slate-700 text-[10px]">
                    {u.role.toLowerCase()}
                  </Badge>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentSignups.length === 0 && (
              <p className="text-xs text-slate-400">No recent signups.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Recently posted opportunities
              </h3>
              <p className="text-xs text-slate-400">
                Moderation pipeline incoming volume
              </p>
            </div>
            <Link
              href="/dashboard/admin/moderation"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              Review queue <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentOpps.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white break-words">
                    {o.title}
                  </p>
                  <p className="text-[11px] text-slate-400 break-words">
                    {o.organization.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    className={`text-[10px] border ${
                      o.moderationStatus === "PUBLISHED"
                        ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/30"
                        : o.moderationStatus === "PENDING_REVIEW"
                          ? "bg-amber-950/70 text-amber-300 border-amber-500/30"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {o.moderationStatus.replace("_", " ")}
                  </Badge>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {recentOpps.length === 0 && (
              <p className="text-xs text-slate-400">No recent postings.</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-wrap justify-between gap-3 text-[11px]">
            <div>
              <span className="font-semibold text-slate-200">
                Verification queue:
              </span>{" "}
              <span className="text-slate-400">
                {pendingVerifications} organization
                {pendingVerifications === 1 ? "" : "s"} awaiting review.
              </span>
            </div>
            <Link
              href="/dashboard/admin/verification"
              className="font-semibold text-amber-400 hover:text-amber-300 hover:underline"
            >
              Open verification queue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
