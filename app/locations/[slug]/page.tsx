import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { logDatabaseUnavailable } from "@/lib/db-health";

type PageProps = { params: Promise<{ slug: string }> };

type ShapeForList = {
  id: string;
  slug: string;
  title: string;
  workMode: string;
  city: string;
  durationMonths: number;
  deadline: Date;
  field?: { name: string } | null;
  specialization?: { name: string } | null;
  organization: { name: string; slug?: string | null };
};

/** Region shape rendered by this page, identical for the Prisma and fallback paths. */
type RegionForPage = {
  id: string;
  name: string;
  code: string;
  capital: string;
  country: string;
  locations: { id: string; city: string }[];
};

async function getRegion(slug: string) {
  // Raw Prisma row (carries the related `opportunities` / `_count` aggregates).
  // It is normalized into `RegionForPage` before being returned.
  type DbOpportunity = {
    id: string;
    slug: string;
    title: string;
    workMode: string | null;
    city: string;
    durationMonths: number | null;
    deadline: Date;
    organization: { name: string; slug: string } | null;
    field: { name: string } | null;
    specialization: { name: string } | null;
  };
  type DbRegion = {
    id: string;
    name: string;
    code: string;
    capital: string;
    locations: { id: string; city: string }[];
    opportunities: DbOpportunity[];
    _count: { organizations: number };
  };
  let dbRegion: DbRegion | null = null;
  let verifiedOrgs = 0;
  try {
    dbRegion = await prisma.region.findFirst({
      where: { code: { equals: slug, mode: "insensitive" }, isActive: true },
      include: {
        locations: { where: { isActive: true }, orderBy: { city: "asc" } },
        opportunities: {
          where: {
            moderationStatus: "PUBLISHED",
            deadline: { gte: new Date() },
          },
          include: {
            organization: { select: { name: true, slug: true } },
            field: { select: { name: true } },
            specialization: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        _count: {
          select: {
            organizations: { where: { verificationStatus: "VERIFIED" } },
          },
        },
      },
    });
    verifiedOrgs = dbRegion?._count?.organizations ?? 0;
  } catch (err) {
    logDatabaseUnavailable("locations/[slug]", err);
  }

  if (!dbRegion) {
    // Option A: locations are seeded DB reference data — never substituted
    // from a hardcode. Outage or unknown slug both resolve to not-found.
    return { notFound: true as const, opportunities: [], verifiedOrgs: 0 };
  }

  const opps: ShapeForList[] = dbRegion.opportunities.map((o) => ({
    id: o.id,
    slug: o.slug,
    title: o.title,
    workMode: o.workMode ?? "ONSITE",
    city: o.city,
    durationMonths: o.durationMonths ?? 6,
    deadline: o.deadline,
    field: o.field ? { name: o.field.name } : null,
    specialization: o.specialization ? { name: o.specialization.name } : null,
    organization: o.organization
      ? { name: o.organization.name, slug: o.organization.slug }
      : { name: "Organization", slug: null },
  }));

  return {
    notFound: false as const,
    region: {
      id: dbRegion.id,
      name: dbRegion.name,
      code: dbRegion.code,
      capital: dbRegion.capital,
      country: "Cameroon",
      locations: dbRegion.locations.map((l) => ({ id: l.id, city: l.city })),
    },
    opportunities: opps,
    verifiedOrgs,
    usesFallback: false,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getRegion(slug);
  if (result.notFound) return { title: "Location Not Found" };
  const name = result.region.name;
  return {
    title: `Internships in ${name}, Cameroon`,
    description: `Explore current internship opportunities in ${name}, Cameroon. Browse roles by professional field and apply through MANTECH Nexus.`,
    openGraph: {
      title: `Internships in ${name}, Cameroon`,
      description: `Browse live internship opportunities in ${name}.`,
    },
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getRegion(slug);
  if (result.notFound) notFound();
  const regionData = result.region;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 py-16 text-white sm:py-20">
        <div className="container-mantech px-4 sm:px-6 lg:px-8">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All locations
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-100">
              <MapPin className="h-3.5 w-3.5" />
              {regionData.country}
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">
              Internships in {regionData.name}
            </h1>
            <p className="mt-4 text-slate-200">
              Explore professional opportunities around {regionData.capital} and{" "}
              {regionData.locations.length} listed{" "}
              {regionData.locations.length === 1 ? "city" : "cities"} in this
              region.
            </p>
          </div>
        </div>
      </section>

      <section className="container-mantech space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {regionData.locations.map((location) => (
            <Link
              key={location.id}
              href={`/internships?region=${encodeURIComponent(regionData.name)}&city=${encodeURIComponent(location.city)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              {location.city}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Current opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {result.opportunities.length} currently published ·{" "}
              {result.verifiedOrgs} verified organizations
            </p>
          </div>
          <Link
            href={`/internships?region=${encodeURIComponent(regionData.name)}`}
          >
            <Button variant="outline">
              Browse all opportunities <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {result.opportunities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-800">
              No current opportunities in this region.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Check back later or explore opportunities across Cameroon.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {result.opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {opportunity.field && (
                    <Badge variant="secondary">{opportunity.field.name}</Badge>
                  )}
                  <Badge variant="outline">
                    {opportunity.workMode.replace("_", " ")}
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  <Link
                    href={`/internships/${opportunity.slug}`}
                    className="hover:text-blue-700"
                  >
                    {opportunity.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {opportunity.organization.name} · {opportunity.city}
                </p>
                {opportunity.specialization && (
                  <p className="mt-2 text-xs text-slate-500">
                    {opportunity.specialization.name}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{opportunity.durationMonths} months</span>
                  <span>
                    Deadline {opportunity.deadline.toLocaleDateString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
