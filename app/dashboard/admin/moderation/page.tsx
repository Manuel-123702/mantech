import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminDashboard } from '@/lib/admin-dashboard';
import { AdminActionButton } from '@/components/admin/admin-action-button';
import { Badge } from '@/components/ui/badge';
import { Star, Image as ImageIcon, FileText, Globe, Trash2, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { getExpressPostings } from '@/lib/cameroon-marketplace-data';

const STATUSES = ['ALL', 'PENDING_REVIEW', 'PUBLISHED', 'SUSPENDED', 'REJECTED'] as const;
const METHODS = [
  { id: 'ALL', label: 'All 3 Posting Methods' },
  { id: 'FLYER', label: '🖼️ Method 1: Visual Flyers' },
  { id: 'FORM', label: '📝 Method 2: Detailed Forms' },
  { id: 'LINK', label: '🔗 Method 3: Career Links' },
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

  // 1. Fetch DB opportunities
  const where: any = {};
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

  // 2. Fetch Express Postings from resilient memory/file storage
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

  // Combine and de-duplicate by slug/id
  const seenIds = new Set(dbOpportunities.map((o) => o.id));
  const combined = [...dbOpportunities];
  for (const exp of expressMapped) {
    if (!seenIds.has(exp.id)) {
      combined.push(exp as any);
      seenIds.add(exp.id);
    }
  }

  // Filter by posting method
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Incoming Postings Moderation &amp; Quality Control
          </h2>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Review, verify or purge submissions from the 3 posting channels (Flyers, Detailed Forms, Career Links). Take instant actions against spam or inappropriate content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1">
            {filteredOpportunities.length} Postings Visible
          </Badge>
        </div>
      </div>

      {/* Method Pills: Idea A */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 px-2 uppercase tracking-wide">Channels:</span>
        {METHODS.map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/admin/moderation?method=${m.id}&status=${activeStatus}`}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeMethod === m.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {m.label}
          </Link>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/moderation?status=${value}&method=${activeMethod}`}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeStatus === value
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {value.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {/* Postings Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No opportunities match the selected method and status.</p>
          <Link
            href="/dashboard/admin/moderation"
            className="mt-3 inline-block text-xs font-bold text-blue-600 hover:underline"
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
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Method Tag & Title */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isFlyer && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-extrabold uppercase">
                          <ImageIcon className="w-3 h-3 text-purple-600" /> Method 1: Flyer
                        </span>
                      )}
                      {isForm && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold uppercase">
                          <FileText className="w-3 h-3 text-emerald-600" /> Method 2: Announcement Form
                        </span>
                      )}
                      {isLink && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px] font-extrabold uppercase">
                          <Globe className="w-3 h-3 text-cyan-600" /> Method 3: Career Link
                        </span>
                      )}

                      <Link
                        href={`/internships/${opportunity.slug}`}
                        target="_blank"
                        className="text-base font-bold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1"
                      >
                        {opportunity.title}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>

                      {opportunity.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                          <Star className="h-3 w-3 fill-amber-500" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Organization & Location Meta */}
                    <p className="text-xs text-slate-600 font-medium">
                      <span className="font-bold text-slate-900">{opportunity.organization.name}</span> · {opportunity.city}
                      {opportunity.region?.name ? `, ${opportunity.region.name}` : ''}
                    </p>

                    {/* Flyer Visual Preview Thumbnail */}
                    {isFlyer && opportunity.flyerUrl && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-slate-500 mb-1">Attached Visual Poster:</p>
                        <a href={opportunity.flyerUrl} target="_blank" rel="noreferrer" className="inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={opportunity.flyerUrl}
                            alt="Flyer Preview"
                            className="h-28 max-w-[200px] object-cover rounded-xl border border-slate-300 shadow-sm hover:opacity-90"
                          />
                        </a>
                      </div>
                    )}

                    {/* External Link Preview */}
                    {isLink && opportunity.externalUrl && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Target Portal URL:</span>
                        <a
                          href={opportunity.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-blue-600 hover:underline break-all"
                        >
                          {opportunity.externalUrl}
                        </a>
                      </div>
                    )}

                    {/* Details / Description */}
                    <p className="text-xs text-slate-700 line-clamp-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      {opportunity.description}
                    </p>
                  </div>

                  {/* Actions Column (Approve, Suspend, Delete) */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
                    {opportunity.moderationStatus !== 'PUBLISHED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                        payload={{ action: 'publish' }}
                        label="Approve & Publish"
                        className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold"
                      />
                    )}

                    {opportunity.moderationStatus === 'PUBLISHED' && (
                      <AdminActionButton
                        endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                        payload={{ action: 'suspend' }}
                        label="Suspend"
                        variant="outline"
                        reasonLabel="Suspension reason"
                        reasonField="reason"
                      />
                    )}

                    {/* Delete action for fast cleanup */}
                    <AdminActionButton
                      endpoint={`/api/admin/opportunities/${opportunity.id}/moderate`}
                      payload={{ action: 'delete' }}
                      label="Delete Posting"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
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
