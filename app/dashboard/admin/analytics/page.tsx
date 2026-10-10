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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function DistributionBars({
  groups,
  color = "bg-blue-600",
}: {
  groups: { label: string; count: number }[];
  color?: string;
}) {
  const total = groups.reduce((sum, g) => sum + g.count, 0) || 1;
  return (
    <div className="space-y-2.5">
      {groups.length === 0 ? (
        <p className="text-xs text-slate-500">No data yet.</p>
      ) : (
        groups.map((g) => (
          <div key={g.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">{g.label}</span>
              <span className="font-mono font-semibold text-slate-800">
                {g.count}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
      label: "Intern profiles",
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
        <div>
          <h2 className="text-lg font-bold text-slate-900 inline-flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            Marketplace analytics
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Aggregated platform metrics, conversion signals, and
            geographic/demographic distribution.
          </p>
        </div>
        <Badge variant="outline">Updated live</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {kpi.label}
                  </span>
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-2 font-mono text-2xl font-bold text-slate-900">
                  {kpi.value.toLocaleString()}
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  {kpi.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              User roles
            </CardTitle>
            <CardDescription>
              Account population by platform role
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(["INTERN", "COMPANY", "UNIVERSITY", "ADMIN"] as const).map(
              (role) => {
                const count = roleCountMap.get(role as any) || 0;
                const total =
                  usersByRole.reduce((s, r) => s + r._count._all, 0) || 1;
                return (
                  <div key={role} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 capitalize">
                        {role.toLowerCase()}
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        {count}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-800"
                        style={{
                          width: `${Math.max((count / total) * 100, 2)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              Applications by status
            </CardTitle>
            <CardDescription>Pipeline conversion snapshot</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars groups={appsByStatus} color="bg-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-slate-500" />
              Placements by status
            </CardTitle>
            <CardDescription>
              Active, confirmed, completed cohorts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars
              groups={placementsByStatus}
              color="bg-emerald-600"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-500" />
              Opportunities by field
            </CardTitle>
            <CardDescription>Top fields of study with openings</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars groups={oppsByField} color="bg-indigo-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-500" />
              Opportunities by region
            </CardTitle>
            <CardDescription>Geographic demand across Cameroon</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars groups={oppsByRegion} color="bg-rose-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <Landmark className="h-4 w-4 text-slate-500" />
              Companies by industry
            </CardTitle>
            <CardDescription>
              Enterprise host sector distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars
              groups={companiesByIndustry}
              color="bg-amber-600"
            />
          </CardContent>
        </Card>
      </div>

      {internsByQualification.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-slate-500" />
              Intern candidates by qualification
            </CardTitle>
            <CardDescription>
              OHADA / Cameroon academic attainment within the talent pool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionBars
              groups={internsByQualification}
              color="bg-teal-600"
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Recent account signups</CardTitle>
              <CardDescription>
                Latest users joining the platform
              </CardDescription>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Manage users <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {recentSignups.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {u.fullName}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {u.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <Badge variant="outline" className="text-[10px]">
                      {u.role.toLowerCase()}
                    </Badge>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentSignups.length === 0 && (
                <p className="text-xs text-slate-500">No recent signups.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">
                Recently posted opportunities
              </CardTitle>
              <CardDescription>
                Moderation pipeline incoming volume
              </CardDescription>
            </div>
            <Link
              href="/dashboard/admin/moderation"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Review queue <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {recentOpps.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {o.title}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {o.organization.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        o.moderationStatus === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-700"
                          : o.moderationStatus === "PENDING_REVIEW"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
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
                <p className="text-xs text-slate-500">No recent postings.</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap justify-between gap-3 text-[11px]">
              <div>
                <span className="font-semibold text-slate-700">
                  Verification queue:
                </span>{" "}
                <span className="text-slate-500">
                  {pendingVerifications} organization
                  {pendingVerifications === 1 ? "" : "s"} awaiting review.
                </span>
              </div>
              <Link
                href="/dashboard/admin/verification"
                className="font-semibold text-blue-600 hover:underline"
              >
                Open verification queue →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
