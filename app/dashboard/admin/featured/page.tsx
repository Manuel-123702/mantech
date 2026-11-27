import Link from 'next/link';
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
        <h2 className="text-lg font-bold text-white break-words">Featured opportunities</h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          Featured placements receive priority visibility across the marketplace. Feature listings only after moderation
          approval — organizations on paid packages are entitled to featured slots per their package.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white">Currently featured ({featuredEntries.length})</h3>
        <div className="mt-3 space-y-2.5">
          {featuredEntries.length === 0 ? (
            <p className="text-xs text-slate-400">No active featured opportunities.</p>
          ) : (
            featuredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <Link href={`/internships/${entry.opportunity.slug}`} className="text-xs font-bold text-white hover:text-amber-300 break-words">
                      {entry.opportunity.title}
                    </Link>
                    <Badge className="bg-slate-800 text-slate-200 border border-slate-700">{entry.opportunity.organization.name}</Badge>
                    <Badge className="bg-amber-950/70 text-amber-300 border border-amber-500/30">Priority {entry.priorityOrder}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {entry.startsAt.toISOString().slice(0, 10)} → {entry.endsAt.toISOString().slice(0, 10)}
                  </p>
                </div>
                <AdminActionButton
                  endpoint={`/api/admin/opportunities/${entry.opportunity.id}/feature`}
                  payload={{ featured: false }}
                  label="Remove from featured"
                  className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white shrink-0"
                  confirmText="Remove this opportunity from the featured list?"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white">Published opportunities available for featuring</h3>
        <div className="mt-3 space-y-2.5">
          {featureable.length === 0 ? (
            <p className="text-xs text-slate-400">No published, non-featured opportunities available.</p>
          ) : (
            featureable.map((opportunity) => (
              <div
                key={opportunity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <Link href={`/internships/${opportunity.slug}`} className="text-xs font-bold text-white hover:text-amber-300 break-words">
                    {opportunity.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-slate-400 break-words">
                    {opportunity.organization.name} · {opportunity.organization.type}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <AdminActionButton
                    endpoint={`/api/admin/opportunities/${opportunity.id}/feature`}
                    payload={{ featured: true, days: 30, priorityOrder: 1 }}
                    label="Feature 30 days"
                    className="bg-amber-600 text-white hover:bg-amber-500 hover:text-white"
                  />
                  <AdminActionButton
                    endpoint={`/api/admin/opportunities/${opportunity.id}/feature`}
                    payload={{ featured: true, days: 90, priorityOrder: 1 }}
                    label="Feature 90 days"
                    className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
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
