import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminDashboard } from "@/lib/admin-dashboard";
import { AdminActionButton } from "@/components/admin/admin-action-button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from '@/components/shared/whatsapp-icon';
import { APP_CONFIG } from "@/lib/config";
import { Settings2, Check, X, ExternalLink } from "lucide-react";

type TaxonRow = {
  id: string;
  name: string;
  isActive: boolean;
  count?: number;
};

async function loadTaxonomy() {
  const [fields, skills, industries, qualifications, regions, internProfiles] =
    await Promise.all([
      prisma.field.findMany({
        include: {
          _count: { select: { opportunities: true, internProfiles: true } },
        },
      }),
      prisma.skill.findMany({
        include: { _count: { select: { internSkills: true } } },
      }),
      prisma.industry.findMany({
        include: { _count: { select: { organizations: true } } },
      }),
      prisma.qualification.findMany(),
      prisma.region.findMany({
        include: {
          _count: {
            select: {
              organizations: true,
              internProfiles: true,
              opportunities: true,
            },
          },
        },
      }),
      prisma.internProfile.findMany({ select: { qualification: true } }),
    ]);
  const qualCountMap = new Map<string, number>();
  for (const p of internProfiles) {
    if (p.qualification)
      qualCountMap.set(
        p.qualification,
        (qualCountMap.get(p.qualification) || 0) + 1,
      );
  }
  return {
    fields: fields.map((f) => ({
      id: f.id,
      name: f.name,
      isActive: f.isActive,
      count: f._count.opportunities + f._count.internProfiles,
    })),
    skills: skills.map((s) => ({
      id: s.id,
      name: s.name,
      isActive: s.isActive,
      count: s._count.internSkills,
    })),
    industries: industries.map((i) => ({
      id: i.id,
      name: i.name,
      isActive: i.isActive,
      count: i._count.organizations,
    })),
    qualifications: qualifications.map((q) => ({
      id: q.id,
      name: q.name,
      isActive: q.isActive,
      count: qualCountMap.get(q.name) || 0,
    })),
    regions: regions.map((r) => ({
      id: r.id,
      name: r.name,
      isActive: r.isActive,
      count:
        r._count.organizations +
        r._count.internProfiles +
        r._count.opportunities,
    })),
  };
}

function TaxonomyTable({
  label,
  description,
  type,
  rows,
}: {
  label: string;
  description: string;
  type: "field" | "skill" | "industry" | "qualification" | "region";
  rows: TaxonRow[];
}) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white break-words">{label}</h3>
          <p className="mt-1 text-[11px] text-slate-400 break-words">{description}</p>
        </div>
        <Badge className="bg-slate-800 text-slate-200 border border-slate-700 shrink-0">{rows.length} entries</Badge>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 p-4 text-center text-xs text-slate-400">
          No {label.toLowerCase()} entries yet. Seed values through the
          database.
        </p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${
                row.isActive
                  ? "border-emerald-500/30 bg-emerald-950/30"
                  : "border-slate-700/80 bg-slate-800/40 opacity-75"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {row.isActive ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-xs font-semibold break-words ${row.isActive ? "text-white" : "text-slate-400"}`}
                  >
                    {row.name}
                  </span>
                </div>
                <p className="mt-0.5 pl-5 text-[10px] text-slate-400">
                  {typeof row.count === "number"
                    ? `${row.count} reference(s)`
                    : "0 references"}
                </p>
              </div>
              <AdminActionButton
                endpoint="/api/admin/taxonomy"
                payload={{ type, id: row.id, isActive: !row.isActive }}
                label={row.isActive ? "Disable" : "Enable"}
                method="PATCH"
                className={
                  row.isActive
                    ? "bg-slate-700 text-white hover:bg-slate-600 hover:text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white"
                }
                size="sm"
                confirmText={`${row.isActive ? "Disable" : "Enable"} "${row.name}" in ${label} taxonomy?`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AdminConfigurationPage() {
  await requireAdminDashboard();

  const taxonomy = await loadTaxonomy();
  const activeCounts = {
    fields: taxonomy.fields.filter((f) => f.isActive).length,
    skills: taxonomy.skills.filter((s) => s.isActive).length,
    industries: taxonomy.industries.filter((i) => i.isActive).length,
    qualifications: taxonomy.qualifications.filter((q) => q.isActive).length,
    regions: taxonomy.regions.filter((r) => r.isActive).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white inline-flex items-center gap-2 break-words">
          <Settings2 className="h-4 w-4 text-amber-400 shrink-0" />
          Platform configuration
        </h2>
        <p className="mt-1 text-xs text-slate-300 break-words">
          Administrators run the marketplace through the application (SRS §14) —
          never edit source code to change operational parameters. Toggle
          taxonomy entries and manage package definitions from here.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Fields active",
            value: `${activeCounts.fields}/${taxonomy.fields.length}`,
          },
          {
            label: "Skills active",
            value: `${activeCounts.skills}/${taxonomy.skills.length}`,
          },
          {
            label: "Industries active",
            value: `${activeCounts.industries}/${taxonomy.industries.length}`,
          },
          {
            label: "Qualifications active",
            value: `${activeCounts.qualifications}/${taxonomy.qualifications.length}`,
          },
          {
            label: "Regions active",
            value: `${activeCounts.regions}/${taxonomy.regions.length}`,
          },
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white">
            Public editorial content
          </h3>
          <p className="mt-1 text-[11px] text-slate-300 break-words">
            Editorial content (blog, case studies, policy pages, testimonials)
            is maintained as reviewed, version-controlled application content.
            Content updates are released with the application; this platform
            does not depend on an external CMS service.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              View published resource guides
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              View public success stories
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-4 sm:p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white">
            Monetization &amp; support channels
          </h3>
          <p className="mt-1 text-[11px] text-slate-300 break-words">
            Per SRS §16, package upgrades are manual. Organizations click{" "}
            <em>Upgrade</em> → contact MANTECH WhatsApp concierge →
            administrator confirms receipt of funds and activates the
            subscription on the{" "}
            <Link
              href="/dashboard/admin/packages"
              className="font-semibold text-amber-400 hover:underline"
            >
              Packages
            </Link>{" "}
            page.
          </p>
          <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
            <li>
              • WhatsApp concierge:{" "}
              <a
                href={APP_CONFIG.support.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
              >
                <WhatsAppIcon className="h-3 w-3 text-[#25D366]" title="WhatsApp" />
                Open chat
              </a>
            </li>
            <li>
              • WhatsApp support:{" "}
              <a
                href={APP_CONFIG.support.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-400 hover:underline"
              >
                {APP_CONFIG.support.phoneDisplay}
              </a>
            </li>
            <li>• Package catalog and usage limits are managed from the Packages page.</li>
          </ul>
        </div>
      </div>

      <TaxonomyTable
        label="Fields of study"
        description="Primary field labels offered to candidates (e.g. Computer Science, Accounting). Disabling a field hides it from the registration wizard and field browsing but preserves existing records."
        type="field"
        rows={taxonomy.fields}
      />
      <TaxonomyTable
        label="Skills"
        description="Granular skill tags that candidates add to their profiles. Used for candidate-match scoring in recruiter dashboards."
        type="skill"
        rows={taxonomy.skills}
      />
      <TaxonomyTable
        label="Industries"
        description="Sectors used to categorize companies (e.g. Fintech, Agribusiness, Public Sector). Used on organization profiles and advanced opportunity filters."
        type="industry"
        rows={taxonomy.industries}
      />
      <TaxonomyTable
        label="Qualifications"
        description="Educational attainment levels (e.g. Bachelor's Degree, HND, GCE A/L). Referenced during Talent Passport issuance and recruiter shortlist criteria."
        type="qualification"
        rows={taxonomy.qualifications}
      />
      <TaxonomyTable
        label="Regions"
        description="Administrative regions of Cameroon plus international locations. Powers location-aware search across opportunities, organizations, and candidates."
        type="region"
        rows={taxonomy.regions}
      />
    </div>
  );
}
