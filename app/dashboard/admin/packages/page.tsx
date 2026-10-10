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
        <h2 className="text-lg font-bold text-slate-900">
          Package catalog &amp; billing
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {activeSubscriptions} organization(s) currently on an active paid
          plan. Package upgrades are handled manually through the MANTECH
          WhatsApp concierge per §16 — never charge a card automatically.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Live package catalog
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">
              {dbPackages.length} database-managed package(s). Edits apply to
              the billing displays and server-enforced package limits.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {dbPackages.map((pkg) => (
              <div
                key={pkg.code}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={pkg.isFeaturedBadge ? "default" : "secondary"}>
                    {pkg.code}
                  </Badge>
                  {pkg.isFeaturedBadge ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {pkg.name}
                </p>
                <p className="mt-0.5 font-mono text-xs font-semibold text-slate-700">
                  {formatXAF(pkg.priceXAF)}
                </p>
                <ul className="mt-2 space-y-0.5 text-[10px] text-slate-600">
                  <li>
                    • {pkg.opportunityLimit} active opportunities
                  </li>
                  <li>
                    • {pkg.candidateSearchLimit} candidate views/mo
                  </li>
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
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {value.replace(/_/g, " ")} ({countFor(value)})
            </Link>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">
            <ArrowLeftRight className="mr-1.5 inline h-4 w-4 text-slate-500" />
            Subscription requests ({subscriptions.length})
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Organizations trigger these by clicking Upgrade in their dashboard.
            MANTECH reviews the WhatsApp message from the concierge, confirms
            receipt of funds, then activates here. Every action writes to the
            audit trail and notifies the organization members.
          </p>

          {subscriptions.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm font-semibold text-slate-600">
                No subscriptions in {activeSub.replace(/_/g, " ").toLowerCase()}{" "}
                state.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={
                          sub.organization.type === "UNIVERSITY"
                            ? "/dashboard/university/billing"
                            : "/dashboard/company/billing"
                        }
                        className="text-xs font-bold text-slate-900 hover:text-blue-700"
                      >
                        {sub.organization.name}
                      </Link>
                      <Badge variant="outline">{sub.organization.type}</Badge>
                      <Badge variant="secondary">{sub.package.name}</Badge>
                      <Badge
                        variant={
                          sub.status === "ACTIVE"
                            ? "default"
                            : sub.status === "PENDING_PAYMENT"
                              ? "secondary"
                              : sub.status === "EXPIRED"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {sub.status.replace(/_/g, " ")}
                      </Badge>
                      {sub.organization.packageCode !== sub.package.code && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-800">
                          upgrade
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-slate-500">
                      <span>
                        <CreditCard className="mr-1 inline h-3 w-3" />{" "}
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
                        <span className="font-mono">
                          ref {sub.transactionRef}
                        </span>
                      )}
                    </div>
                    {(sub as { whatsappMessage?: string }).whatsappMessage && (
                      <p className="max-w-2xl text-[11px] text-slate-600 line-clamp-2">
                        Concierge note: {(sub as { whatsappMessage?: string }).whatsappMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {sub.status === "PENDING_PAYMENT" && (
                      <>
                        <AdminActionButton
                          endpoint={`/api/admin/subscriptions/${sub.id}`}
                          payload={{ action: "activate", days: 30 }}
                          label="Activate 30 days"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          confirmText="Activate this subscription for 30 days? Organization members will be notified and the prior active plan (if any) is expired."
                        />
                        <AdminActionButton
                          endpoint={`/api/admin/subscriptions/${sub.id}`}
                          payload={{ action: "activate", days: 365 }}
                          label="Activate 1 year"
                          variant="outline"
                        />
                        <AdminActionButton
                          endpoint={`/api/admin/subscriptions/${sub.id}`}
                          payload={{ action: "cancel" }}
                          label="Cancel request"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          confirmText="Cancel this subscription request? The organization will be notified and remain on their current plan."
                        />
                      </>
                    )}
                    {sub.status === "ACTIVE" && (
                      <AdminActionButton
                        endpoint={`/api/admin/subscriptions/${sub.id}`}
                        payload={{ action: "cancel" }}
                        label="Cancel (revert to FREE)"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
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
