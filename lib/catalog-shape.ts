/**
 * Safe accessor helpers for shapes that may come from either:
 *   a) Prisma queries that use include: { field:true, region:true, organization:true }
 *      → nested shape: { id, name, slug, ... }
 *   b) Legacy flat records where `field`/`region`/`industry` are plain strings.
 *
 * Always returns a primitive (string | null) safe to interpolate into React children
 * (prevents "Objects are not valid as a React child" runtime errors).
 */

export function nameOf(input: unknown): string | null {
  if (input == null) return null;
  if (typeof input === "string") return input.length ? input : null;
  if (typeof input !== "object") return String(input);
  const obj = input as Record<string, unknown>;
  if (typeof obj.name === "string" && obj.name.length) return obj.name;
  if (typeof obj.id === "string" && obj.id.length) return obj.id;
  return null;
}

export function fieldNameOf(opp: Record<string, unknown>): string | null {
  return nameOf(opp.field ?? opp.fieldObj);
}

export function regionNameOf(oppOrOrg: Record<string, unknown>): string | null {
  const region = oppOrOrg.region ?? oppOrOrg.regionObj;
  if (typeof region === "string" && region.length) return region;
  return nameOf(region);
}

export function industryNameOf(
  orgOrOpp: Record<string, unknown>,
): string | null {
  const industry = orgOrOpp.industry;
  if (industry == null) return null;
  if (typeof industry === "string") return industry.length ? industry : null;
  if (typeof industry !== "object") return nameOf(industry);
  const obj = industry as Record<string, unknown>;
  if (typeof obj.name === "string" && obj.name.length) return obj.name;
  if (typeof obj.id === "string" && obj.id.length) return obj.id;
  return null;
}

export function specializationNameOf(
  opp: Record<string, unknown>,
): string | null {
  return nameOf(opp.specialization ?? opp.specializationObj);
}

export function organizationNameOf(
  opp: Record<string, unknown>,
): string | null {
  const org = opp.organization ?? opp.company;
  if (org == null) {
    const flat = opp.companyName ?? opp.company_name ?? opp.organizationName;
    return typeof flat === "string" && flat.length ? flat : null;
  }
  if (typeof org === "string") return org.length ? org : null;
  const obj = org as Record<string, unknown>;
  if (typeof obj.name === "string" && obj.name.length) return obj.name;
  return null;
}

export function organizationLogoOf(
  opp: Record<string, unknown>,
): string | null {
  const org = opp.organization ?? opp.company;
  if (org && typeof org === "object") {
    const nested =
      (org as Record<string, unknown>).logoUrl ??
      (org as Record<string, unknown>).logo_url;
    if (typeof nested === "string" && nested.length) return nested;
  }
  const flat = opp.companyLogoUrl ?? opp.company_logo_url;
  return typeof flat === "string" && flat.length ? flat : null;
}
