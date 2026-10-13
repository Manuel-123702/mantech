/**
 * MANTECH Nexus — Opportunity-Alert matching (pure, no DB, no I/O)
 *
 * Interns save alert preferences (regions, cities, work modes). This module
 * answers one question: "does this newly published opportunity match what this
 * intern asked to be alerted about?"
 *
 * Design rules (kept deliberately simple so it is easy to test and extend):
 *  - An empty preference list means "no constraint" → matches anything.
 *  - Every NON-EMPTY preference must be satisfied (logical AND).
 *  - Matching is case-insensitive and trims whitespace.
 *  - Work-mode variants ("onsite" / "on-site" / "on site") are treated as equal.
 */

export type AlertCriteria = {
  regions: string[];
  cities: string[];
  workModes: string[];
};

/** The only fields of an opportunity the alert engine cares about. */
export type AlertOpportunity = {
  id?: string;
  regionName?: string | null;
  city?: string | null;
  workMode?: string | null;
};

function norm(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

/** Collapse work-mode spelling variants so "onsite" and "on-site" are equal. */
export function normalizeWorkMode(value: string | null | undefined): string {
  const v = norm(value);
  if (v === 'on-site' || v === 'on site') return 'onsite';
  return v;
}

/** True when the alert imposes no filters at all (matches every opportunity). */
export function isBroadAlert(criteria: AlertCriteria): boolean {
  return (
    criteria.regions.length === 0 &&
    criteria.cities.length === 0 &&
    criteria.workModes.length === 0
  );
}

/**
 * Does an opportunity satisfy an alert's preferences?
 * Every non-empty preference list must contain the opportunity's value.
 */
export function matchesAlert(criteria: AlertCriteria, opp: AlertOpportunity): boolean {
  if (criteria.regions.length > 0) {
    const regionOk = criteria.regions.some((r) => norm(r) === norm(opp.regionName));
    if (!regionOk) return false;
  }

  if (criteria.cities.length > 0) {
    const cityOk = criteria.cities.some((c) => norm(c) === norm(opp.city));
    if (!cityOk) return false;
  }

  if (criteria.workModes.length > 0) {
    const oppMode = normalizeWorkMode(opp.workMode);
    const modeOk = criteria.workModes.some((w) => normalizeWorkMode(w) === oppMode);
    if (!modeOk) return false;
  }

  return true;
}

/** Convenience: keep only the opportunities that satisfy the alert. */
export function findAlertMatches<T extends AlertOpportunity>(
  criteria: AlertCriteria,
  opportunities: readonly T[],
): T[] {
  return opportunities.filter((opp) => matchesAlert(criteria, opp));
}
