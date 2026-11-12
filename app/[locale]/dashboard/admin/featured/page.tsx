import { Trans } from '@lingui/react/macro';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default async function AdminFeaturedPage() {
  await requireAdminDashboard();

  const now = new Date();
  const [featuredEntries, featureable] = await Promise.all([
    prisma.featuredOpportunity.findMany({
      where: { isActive: true, endsAt: { gte: now } },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            slug: true,
            moderationStatus: true,
            organization: { select: { name: true, type: true } },
          },
        },
      },
      orderBy: [{ priorityOrder: 'asc' }, { startsAt: 'desc' }],
    }),
    prisma.internshipOpportunity.findMany({
      where: { moderationStatus: 'PUBLISHED', isFeatured: false },
      include: { organization: { select: { name: true, type: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900"><Trans comment="page h2 visible text">Featured opportunities</Trans></h2>
        <p className="mt-1 text-xs text-slate-500">
          <Trans comment="page p visible text">Featured placements receive priority visibility across the marketplace. Feature listings only after moderation
          approval — organizations on paid packages are entitled to featured slots per their package.
        </Trans></p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900"><Trans comment="page h3 visible text">Currently featured (</Trans>{featuredEntries.length}{/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{")"}</h3>
        <div className="mt-3 space-y-2">
          {featuredEntries.length === 0 ? (
            <p className="text-xs text-slate-500"><Trans comment="page p visible text">No active featured opportunities.</Trans></p>
          ) : (
            featuredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-amber-600" />
                    <Link href={`/internships/${entry.opportunity.slug}`} className="text-xs font-bold text-slate-900 hover:text-blue-700">
                      {entry.opportunity.title}
                    </Link>
                    <Badge variant="outline">{entry.opportunity.organization.name}</Badge>
                    <Badge variant="secondary"><Trans comment="page Badge visible text">Priority </Trans>{entry.priorityOrder}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {entry.startsAt.toISOString().slice(0, 10)} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"→ "}{entry.endsAt.toISOString().slice(0, 10)}
                  </p>
                </div>
                <AdminActionButton
                  endpoint={`/api/admin/opportunities/${entry.opportunity.id}/feature`}
                  payload={{ featured: false }}
                  label="Remove from featured"
                  variant="outline"
                  confirmText="Remove this opportunity from the featured list?"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900"><Trans comment="page h3 visible text">Published opportunities available for featuring</Trans></h3>
        <div className="mt-3 space-y-2">
          {featureable.length === 0 ? (
            <p className="text-xs text-slate-500"><Trans comment="page p visible text">No published, non-featured opportunities available.</Trans></p>
          ) : (
            featureable.map((opportunity) => (
              <div
                key={opportunity.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
              >
                <div className="min-w-0">
                  <Link href={`/internships/${opportunity.slug}`} className="text-xs font-bold text-slate-900 hover:text-blue-700">
                    {opportunity.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {opportunity.organization.name} {/* eslint-disable-next-line i18next/no-literal-string -- punctuation or symbol separator cannot be translated */}
{"· "}{opportunity.organization.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminActionButton
                    endpoint={`/api/admin/opportunities/${opportunity.id}/feature`}
                    payload={{ featured: true, days: 30, priorityOrder: 1 }}
                    label="Feature 30 days"
                    className="bg-amber-500 text-white hover:bg-amber-600"
                  />
                  <AdminActionButton
                    endpoint={`/api/admin/opportunities/${opportunity.id}/feature`}
                    payload={{ featured: true, days: 90, priorityOrder: 1 }}
                    label="Feature 90 days"
                    variant="outline"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
