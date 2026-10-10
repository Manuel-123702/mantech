/**
 * MANTECH Nexus — Candidate ↔ Opportunity matching
 * Pure function, reusable on server + client.
 * Score: skills overlap (50) + field match (20) + city/region (15) + workMode (10) + paid pref (5)
 */

export type MatchProfile = {
  skills?: string[];
  fieldSlug?: string | null;
  fieldName?: string | null;
  city?: string | null;
  regionName?: string | null;
  preferredWorkMode?: string | null;
  wantsPaid?: boolean | null;
};

export type MatchOpportunity = {
  requiredSkills?: string[];
  preferredSkills?: string[];
  fieldSlug?: string | null;
  fieldName?: string | null;
  city?: string | null;
  regionName?: string | null;
  workMode?: string | null;
  isPaid?: boolean | null;
};

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function calculateMatch(profile: MatchProfile, opp: MatchOpportunity): {
  score: number;
  missingSkills: string[];
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  const pSkills = new Set((profile.skills ?? []).map(norm).filter(Boolean));
  const req = (opp.requiredSkills ?? []).map((s) => s).filter(Boolean);
  const pref = (opp.preferredSkills ?? []).map((s) => s).filter(Boolean);
  const allOppSkills = [...req, ...pref];

  if (allOppSkills.length > 0 && pSkills.size > 0) {
    const matched = allOppSkills.filter((s) => pSkills.has(norm(s)));
    const ratio = matched.length / Math.max(1, req.length || allOppSkills.length);
    const pts = Math.round(ratio * 50);
    score += pts;
    if (matched.length > 0) reasons.push(`${matched.length} matching skill${matched.length > 1 ? 's' : ''}`);
  } else if (allOppSkills.length === 0) {
    score += 25;
  }

  const missingSkills = req.filter((s) => !pSkills.has(norm(s))).slice(0, 5);

  if (profile.fieldSlug && opp.fieldSlug && norm(profile.fieldSlug) === norm(opp.fieldSlug)) {
    score += 20;
    reasons.push('Field match');
  } else if (
    profile.fieldName && opp.fieldName &&
    norm(profile.fieldName) === norm(opp.fieldName)
  ) {
    score += 20;
    reasons.push('Field match');
  }

  if (profile.city && opp.city && norm(profile.city) === norm(opp.city)) {
    score += 15;
    reasons.push('Same city');
  } else if (
    profile.regionName && opp.regionName &&
    norm(profile.regionName) === norm(opp.regionName)
  ) {
    score += 8;
    reasons.push('Same region');
  }

  if (profile.preferredWorkMode && opp.workMode && norm(profile.preferredWorkMode) === norm(opp.workMode)) {
    score += 10;
    reasons.push('Work-mode match');
  } else if (!profile.preferredWorkMode && opp.workMode === 'REMOTE') {
    score += 5;
  }

  if (profile.wantsPaid && opp.isPaid) {
    score += 5;
    reasons.push('Paid');
  } else if (!profile.wantsPaid) {
    score += 2;
  }

  return { score: Math.max(0, Math.min(100, score)), missingSkills, reasons };
}

export function matchLabel(score: number): string {
  if (score >= 80) return 'Excellent match';
  if (score >= 60) return 'Good match';
  if (score >= 40) return 'Fair match';
  return 'Explore';
}
