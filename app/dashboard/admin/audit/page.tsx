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
        <h2 className="text-lg font-bold text-white inline-flex items-center gap-2 break-words">
          <ScrollText className="h-4 w-4 text-amber-400 shrink-0" />
          Platform audit trail
        </h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
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
            className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 break-words">
              {item.label}
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Action
        </span>
        {ACTION_GROUPS.map((value) => (
          <Link
            key={value}
            href={buildHref(value, activeEntity)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              activeAction === value
                ? "bg-amber-600 text-white hover:bg-amber-500"
                : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {value === "ALL" ? "All" : value.replace(/_/g, " ").toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Entity
        </span>
        {ENTITY_GROUPS.map((value) => (
          <Link
            key={value}
            href={buildHref(activeAction, value)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              activeEntity === value
                ? "bg-amber-600 text-white hover:bg-amber-500"
                : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {value}
          </Link>
        ))}
        <form
          action="/dashboard/admin/audit"
          className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 mt-2 sm:mt-0"
        >
          <input type="hidden" name="action" value={activeAction} />
          <input type="hidden" name="entity" value={activeEntity} />
          <div className="relative flex-1 sm:flex-initial">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search actor, action or entity id..."
              className="w-full sm:w-64 rounded-xl border border-slate-700 bg-slate-800 py-2 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-500 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">
            No audit events match this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-300">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {log.entityType}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 break-all">
                      {log.entityId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    {log.actor ? (
                      <>
                        <span className="font-semibold text-white break-words">{log.actor.fullName}</span>
                        <Badge className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px]">
                          {log.actor.role}
                        </Badge>
                        <span className="text-[11px] text-slate-400 break-all">{log.actor.email}</span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        system · {log.actorRole || "no actor"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[11px] text-slate-300">{formatDateTime(log.createdAt)}</p>
                  {log.ipAddress && (
                    <p className="font-mono text-[10px] text-slate-400">{log.ipAddress}</p>
                  )}
                </div>
              </div>
              {log.details && (
                <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-slate-700/60 bg-slate-800/70 px-3 py-2 font-mono text-[10px] leading-relaxed text-slate-300">
                  {JSON.stringify(log.details, null, 0)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
