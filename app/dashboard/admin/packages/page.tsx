import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminDashboard } from "@/lib/admin-dashboard";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { PackageEditButton } from "@/components/admin/package-edit-button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle2,
  ArrowLeftRight,
} from "lucide-react";

function formatXAF(value: number) {
  return new Intl.NumberFormat("en-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(date: Date) {
  return date.toISOString().replace("T", " ").slice(0, 16);
}

const SUBSCRIPTION_FILTERS = [
  "PENDING_PAYMENT",
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
] as const;

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string }>;
}) {
  await requireAdminDashboard();
  const { subscription } = await searchParams;
  const activeSub = (SUBSCRIPTION_FILTERS as readonly string[]).includes(
    subscription || "",
  )
    ? (subscription as string)
    : "PENDING_PAYMENT";

  const [dbPackages, subscriptions, subCounts, activeSubscriptions] =
    await Promise.all([
      prisma.package.findMany({ orderBy: { priceXAF: "asc" } }),
      prisma.organizationSubscription.findMany({
        where: { status: activeSub as never },
        include: {
          package: { select: { name: true, code: true, priceXAF: true } },
          organization: {
            select: {
              id: true,
              name: true,
              type: true,
              verificationStatus: true,
              packageCode: true,
            },
          },
        },
        orderBy: { requestedAt: "asc" },
        take: 40,
      }),
      prisma.organizationSubscription.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.organizationSubscription.count({ where: { status: "ACTIVE" } }),
    ]);

  const countFor = (status: string) =>
    subCounts.find((entry) => entry.status === status)?._count._all ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white break-words">
          Package catalog &amp; billing
        </h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          {activeSubscriptions} organization(s) currently on an active paid
          plan. Package upgrades are handled manually through the MANTECH
          WhatsApp concierge per §16 — never charge a card automatically.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
        <div>
          <h3 className="text-sm font-bold text-white">
            Live package catalog
          </h3>
          <p className="mt-1 text-[11px] text-slate-400 break-words">
            {dbPackages.length} database-managed package(s). Edits apply to
            the billing displays and server-enforced package limits.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dbPackages.map((pkg) => (
            <div
              key={pkg.code}
              className="rounded-xl border border-slate-700/80 bg-slate-800/60 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-amber-950/70 text-amber-300 border border-amber-500/30">
                  {pkg.code}
                </Badge>
                {pkg.isFeaturedBadge ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Recommended
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm font-bold text-white break-words">
                {pkg.name}
              </p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-amber-300">
                {formatXAF(pkg.priceXAF)}
              </p>
              <ul className="mt-2 space-y-0.5 text-[11px] text-slate-300">
                <li>• {pkg.opportunityLimit} active opportunities</li>
                <li>• {pkg.candidateSearchLimit} candidate views/mo</li>
                <li>• {pkg.maxRecruiterAccounts} recruiter seats</li>
                <li>• {pkg.featuredOpportunitiesLimit} featured badges</li>
              </ul>
              <div className="mt-3">
                <PackageEditButton pkg={pkg} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          {SUBSCRIPTION_FILTERS.map((value) => (
            <Link
              key={value}
              href={`/dashboard/admin/packages?subscription=${value}`}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeSub === value
                  ? "bg-amber-600 text-white hover:bg-amber-500"
                  : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {value.replace(/_/g, " ")} ({countFor(value)})
            </Link>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white inline-flex items-center gap-1.5">
            <ArrowLeftRight className="h-4 w-4 text-amber-400 shrink-0" />
            Subscription requests ({subscriptions.length})
          </h3>
          <p className="mt-1 text-[11px] text-slate-400 break-words">
            Organizations trigger these by clicking Upgrade in their dashboard.
            MANTECH reviews the WhatsApp message from the concierge, confirms
            receipt of funds, then activates here. Every action writes to the
            audit trail and notifies the organization members.
          </p>

          {subscriptions.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-sm font-semibold text-slate-400">
                No subscriptions in {activeSub.replace(/_/g, " ").toLowerCase()}{" "}
                state.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={
                          sub.organization.type === "UNIVERSITY"
                            ? "/dashboard/university/billing"
                            : "/dashboard/company/billing"
                        }
                        className="text-xs font-bold text-white hover:text-amber-300 break-words"
                      >
                        {sub.organization.name}
                      </Link>
                      <Badge className="bg-slate-900 text-slate-200 border border-slate-700">{sub.organization.type}</Badge>
                      <Badge className="bg-slate-900 text-slate-200 border border-slate-700">{sub.package.name}</Badge>
                      <Badge
                        className={
                          sub.status === "ACTIVE"
                            ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/30"
                            : sub.status === "PENDING_PAYMENT"
                              ? "bg-amber-950/70 text-amber-300 border border-amber-500/30"
                              : sub.status === "EXPIRED"
                                ? "bg-slate-800 text-slate-300 border border-slate-700"
                                : "bg-rose-950/70 text-rose-300 border border-rose-500/30"
                        }
                      >
                        {sub.status.replace(/_/g, " ")}
                      </Badge>
                      {sub.organization.packageCode !== sub.package.code && (
                        <span className="rounded-full bg-blue-950/70 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-300">
                          upgrade
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-slate-400">
                      <span className="text-slate-200 font-semibold">
                        <CreditCard className="mr-1 inline h-3 w-3 text-amber-400" />{" "}
                        {formatXAF(sub.package.priceXAF)}
                      </span>
                      <span>Requested {formatDateTime(sub.requestedAt)}</span>
                      {sub.activatedAt && (
                        <span>Activated {formatDateTime(sub.activatedAt)}</span>
                      )}
                      {sub.expiresAt && (
                        <span>Expires {formatDateTime(sub.expiresAt)}</span>
                      )}
                      {sub.transactionRef && (
                        <span className="font-mono break-all">
                          ref {sub.transactionRef}
                        </span>
                      )}
                    </div>
                    {(sub as { whatsappMessage?: string }).whatsappMessage && (
                      <p className="max-w-2xl text-[11px] text-slate-300 break-words">
                        Concierge note: {(sub as { whatsappMessage?: string }).whatsappMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {sub.status === "PENDING_PAYMENT" && (
                      <>
                        <AdminActionButton
                          endpoint={`/api/admin/subscriptions/${sub.id}`}
                          payload={{ action: "activate", days: 30 }}
                          label="Activate 30 days"
                          className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                          confirmText="Activate this subscription for 30 days? Organization members will be notified and the prior active plan (if any) is expired."
                        />
                        <AdminActionButton
                          endpoint={`/api/admin/subscriptions/${sub.id}`}
                          payload={{ action: "activate", days: 365 }}
                          label="Activate 1 year"
                          className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                        />
                        <AdminActionButton
                          endpoint={`/api/admin/subscriptions/${sub.id}`}
                          payload={{ action: "cancel" }}
                          label="Cancel request"
                          className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                          confirmText="Cancel this subscription request? The organization will be notified and remain on their current plan."
                        />
                      </>
                    )}
                    {sub.status === "ACTIVE" && (
                      <AdminActionButton
                        endpoint={`/api/admin/subscriptions/${sub.id}`}
                        payload={{ action: "cancel" }}
                        label="Cancel (revert to FREE)"
                        className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white"
                        confirmText="Cancel this active subscription immediately? The organization reverts to FREE if this was their current package."
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
