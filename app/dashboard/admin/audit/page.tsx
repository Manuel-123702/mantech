import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminDashboard } from "@/lib/admin-dashboard";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Search } from "lucide-react";

function formatDateTime(date: Date) {
  return date.toISOString().replace("T", " ").slice(0, 16);
}

const ACTION_GROUPS = [
  "ALL",
  "ORGANIZATION_VERIFIED",
  "ORGANIZATION_REJECTED",
  "ORGANIZATION_SUSPENDED",
  "OPPORTUNITY_MODERATED",
  "PACKAGE_ACTIVATED",
  "PACKAGE_CANCELLED",
  "SYNC_PACKAGE_CATALOG",
  "TAXONOMY_UPDATED",
  "USER_SUSPENDED",
  "USER_REACTIVATED",
  "PASSPORT_VERIFIED",
  "PASSPORT_UNVERIFIED",
] as const;

const ENTITY_GROUPS = [
  "ALL",
  "Organization",
  "InternshipOpportunity",
  "OrganizationSubscription",
  "Package",
  "User",
  "InternPassport",
  "Field",
  "Skill",
  "Industry",
  "Qualification",
  "Region",
  "Application",
] as const;

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; entity?: string; q?: string }>;
}) {
  await requireAdminDashboard();
  const { action, entity, q } = await searchParams;
  const activeAction = (ACTION_GROUPS as readonly string[]).includes(
    action || "",
  )
    ? (action as string)
    : "ALL";
  const activeEntity = (ENTITY_GROUPS as readonly string[]).includes(
    entity || "",
  )
    ? (entity as string)
    : "ALL";
  const query = (q || "").trim();

  const where = {
    ...(activeAction !== "ALL" ? { action: activeAction } : {}),
    ...(activeEntity !== "ALL" ? { entityType: activeEntity } : {}),
    ...(query
      ? {
          OR: [
            { details: { path: [], string_contains: query } as never },
            {
              actor: {
                fullName: { contains: query, mode: "insensitive" as const },
              },
            },
            { action: { contains: query, mode: "insensitive" as const } },
            { entityId: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [entries, total, countsByAction, countsByEntity] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: { select: { fullName: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({
      by: ["action"],
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
      take: 12,
    }),
    prisma.auditLog.groupBy({
      by: ["entityType"],
      _count: { _all: true },
      orderBy: { _count: { entityType: "desc" } },
      take: 12,
    }),
  ]);

  const buildHref = (nextAction: string, nextEntity: string) => {
    const params = new URLSearchParams();
    params.set("action", nextAction);
    params.set("entity", nextEntity);
    if (query) params.set("q", query);
    return `/dashboard/admin/audit?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          <ScrollText className="mr-1.5 inline h-4 w-4 text-slate-500" />
          Platform audit trail
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Immutable record of security-relevant and admin-initiated events.
          Every verification, moderation, package, and taxonomy change is
          captured here alongside the administrator, timestamp, IP address, and
          user agent.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total events (filtered)", value: total },
          { label: "Actions tracked", value: countsByAction.length },
          { label: "Entity types", value: countsByEntity.length },
          { label: "Showing last", value: `${entries.length} events` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Action
        </span>
        {ACTION_GROUPS.map((value) => (
          <Link
            key={value}
            href={buildHref(value, activeEntity)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              activeAction === value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {value === "ALL" ? "All" : value.replace(/_/g, " ").toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Entity
        </span>
        {ENTITY_GROUPS.map((value) => (
          <Link
            key={value}
            href={buildHref(activeAction, value)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              activeEntity === value
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {value}
          </Link>
        ))}
        <form
          action="/dashboard/admin/audit"
          className="ml-auto flex items-center gap-2"
        >
          <input type="hidden" name="action" value={activeAction} />
          <input type="hidden" name="entity" value={activeEntity} />
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search actor, action or entity id..."
              className="w-64 rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white"
          >
            Search
          </button>
        </form>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            No audit events match this filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-slate-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {log.actor ? (
                        <>
                          <p className="font-semibold text-slate-900">
                            {log.actor.fullName}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                            <Badge
                              variant={
                                log.actor.role === "ADMIN"
                                  ? "default"
                                  : "secondary"
                              }
                              className="mr-1"
                            >
                              {log.actor.role}
                            </Badge>
                            {log.actor.email}
                          </div>
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-400">
                          system · {log.actorRole || "no actor"}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-blue-700">
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {log.entityType}
                      </p>
                      <p className="max-w-[180px] truncate font-mono text-[10px] text-slate-500">
                        {log.entityId}
                      </p>
                    </td>
                    <td className="max-w-sm px-4 py-3">
                      {log.details ? (
                        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-slate-600">
                          {JSON.stringify(log.details, null, 0)}
                        </pre>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.ipAddress ? (
                        <p className="font-mono text-[10px] text-slate-500">
                          {log.ipAddress}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400">no IP</p>
                      )}
                      {log.userAgent && (
                        <p
                          className="mt-0.5 max-w-[200px] truncate text-[10px] text-slate-400"
                          title={log.userAgent}
                        >
                          {log.userAgent}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
