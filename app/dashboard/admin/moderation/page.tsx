import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Star, Image as ImageIcon, FileText, Globe, ExternalLink } from 'lucide-react';
import { getExpressPostings } from '@/lib/cameroon-marketplace-data';

const STATUSES = ['ALL', 'PENDING_REVIEW', 'PUBLISHED', 'SUSPENDED', 'REJECTED'] as const;
const METHODS = [
  { id: 'ALL', label: 'All 3 Posting Methods' },
  { id: 'FLYER', label: 'Method 1: Visual Flyers' },
  { id: 'FORM', label: 'Method 2: Detailed Forms' },
  { id: 'LINK', label: 'Method 3: Career Links' },
] as const;

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; method?: string }>;
}) {
  await requireAdminDashboard();
  const { status, method } = await searchParams;
  const activeStatus = status || 'ALL';
  const activeMethod = method || 'ALL';

  const where: Record<string, unknown> = {};
  if (activeStatus !== 'ALL') {
    where.moderationStatus = activeStatus;
  }

  let dbOpportunities: any[] = [];
  try {
    dbOpportunities = await prisma.internshipOpportunity.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true, type: true, verificationStatus: true, logoUrl: true } },
        field: { select: { name: true } },
        region: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (err) {
    console.warn('[admin-moderation] DB findMany skipped or offline:', err);
  }

  const expressPostings = getExpressPostings();
  const expressMapped = expressPostings.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    moderationStatus: p.moderationStatus || 'PUBLISHED',
    isFeatured: Boolean(p.isFeatured),
    applicationMethod: p.isLinkOnly ? 'EXTERNAL' : p.isVisualFlyerOnly ? 'FLYER' : 'MANTECH',
    flyerUrl: p.flyerUrl || null,
    externalUrl: p.externalUrl || p.applicationUrl || null,
    city: p.city || 'Douala',
    organization: {
      name: p.companyName || p.organization?.name || 'Verified Enterprise',
      type: 'ENTERPRISE',
      verificationStatus: 'PENDING',
      logoUrl: p.organization?.logoUrl || null,
    },
    field: { name: p.field || p.department || 'General' },
    region: { name: p.region || 'Littoral' },
    createdAt: p.postingDate ? new Date(p.postingDate) : new Date(),
    _count: { applications: 0 },
    isExpressFile: true,
  }));

  const seenIds = new Set(dbOpportunities.map((o) => o.id));
  const combined = [...dbOpportunities];
  for (const exp of expressMapped) {
    if (!seenIds.has(exp.id)) {
      combined.push(exp as any);
      seenIds.add(exp.id);
    }
  }

  const filteredOpportunities = combined.filter((item) => {
    const isFlyer = Boolean(item.flyerUrl || item.isVisualFlyerOnly || item.applicationMethod === 'FLYER');
    const isLink = Boolean(item.isLinkOnly || item.externalUrl || item.applicationMethod === 'EXTERNAL' || item.applicationMethod === 'COMPANY_WEBSITE');
    const isForm = !isFlyer && !isLink;

    if (activeMethod === 'FLYER') return isFlyer;
    if (activeMethod === 'LINK') return isLink;
    if (activeMethod === 'FORM') return isForm;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading break-words">
            Incoming Postings Moderation &amp; Quality Control
          </h2>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl break-words">
            Review, verify or purge submissions from the 3 posting channels (Flyers, Detailed Forms, Career Links). Take instant actions against spam or inappropriate content.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1">
            {filteredOpportunities.length} Postings Visible
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/80">
        <span className="text-xs font-bold text-slate-300 px-2 uppercase tracking-wide">Channels:</span>
        {METHODS.map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/admin/moderation?method=${m.id}&status=${activeStatus}`}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeMethod === m.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 hover:bg-amber-500'
                : 'bg-slate-900 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {m.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/moderation?status=${value}&method=${activeMethod}`}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {value.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-10 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-300">No opportunities match the selected method and status.</p>
          <Link
            href="/dashboard/admin/moderation"
            className="mt-3 inline-block text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((opportunity) => {
            const isFlyer = Boolean(opportunity.flyerUrl || opportunity.isVisualFlyerOnly || opportunity.applicationMethod === 'FLYER');
            const isLink = Boolean(opportunity.isLinkOnly || opportunity.externalUrl || opportunity.applicationMethod === 'EXTERNAL' || opportunity.applicationMethod === 'COMPANY_WEBSITE');
            const isForm = !isFlyer && !isLink;

            return (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg hover:border-slate-600 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {isFlyer && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30 text-[11px] font-extrabold uppercase">
                          <ImageIcon className="w-3 h-3 text-purple-400" /> Method 1: Flyer
                        </span>
                      )}
                      {isForm && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold uppercase">
                          <FileText className="w-3 h-3 text-emerald-400" /> Method 2: Announcement Form
                        </span>
                      )}
                      {isLink && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 text-[11px] font-extrabold uppercase">
                          <Globe className="w-3 h-3 text-cyan-400" /> Method 3: Career Link
                        </span>
                      )}

                      <Link
                        href={`/internships/${opportunity.slug}`}
                        target="_blank"
                        className="text-base font-bold text-white hover:text-amber-300 inline-flex items-center gap-1 break-words"
                      >
                        {opportunity.title}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </Link>

                      {opportunity.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                          <Star className="h-3 w-3 fill-amber-400" /> Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-medium break-words">
                      <span className="font-bold text-white">{opportunity.organization.name}</span> · {opportunity.city}
                      {opportunity.region?.name ? `, ${opportunity.region.name}` : ''}
                    </p>

                    {isFlyer && opportunity.flyerUrl && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-slate-400 mb-1">Attached Visual Poster:</p>
                        <a href={opportunity.flyerUrl} target="_blank" rel="noreferrer" className="inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={opportunity.flyerUrl}
                            alt="Flyer Preview"
                            className="h-28 max-w-[200px] object-cover rounded-xl border border-slate-700 shadow-sm hover:opacity-90"
                          />
                        </a>
                      </div>
                    )}

                    {isLink && opportunity.externalUrl && (
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Target Portal URL:</span>
                        <a
                          href={opportunity.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-amber-300 hover:underline break-all"
                        >
                          {opportunity.externalUrl}
                        </a>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 break-words whitespace-pre-line">
                      {opportunity.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
                    {opportunity.moderationStatus !== 'PUBLISHED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                        payload={{ action: 'publish' }}
                        label="Approve & Publish"
                        className="bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white text-xs font-bold"
                      />
                    )}

                    {opportunity.moderationStatus === 'PUBLISHED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                        payload={{ action: 'suspend' }}
                        label="Suspend"
                        className="bg-amber-600 text-white hover:bg-amber-500 hover:text-white text-xs font-bold"
                        reasonLabel="Suspension reason"
                        reasonField="reason"
                      />
                    )}

                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'delete' }}
                      label="Delete Posting"
                      className="bg-rose-600 text-white hover:bg-rose-500 hover:text-white text-xs font-bold"
                      confirmText="Are you sure you want to permanently delete this posting?"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
