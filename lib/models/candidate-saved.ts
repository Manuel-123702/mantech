import type { CandidateSavedItem } from '@/lib/models/candidate';

export interface SavedOpportunityRow {
  id: string;
  userId: string;
  opportunityId: string;
  savedAt: Date | string;
}

export function toCandidateSavedItem(
  dbRow: SavedOpportunityRow,
  internshipTitle: string,
  internshipSlug: string,
  companyName: string,
  region: string,
  city: string,
  workMode: string,
  isPaid: boolean,
  isFeatured: boolean,
  companyLogoUrl?: string | null,
): CandidateSavedItem {
  return {
    id: dbRow.id,
    internshipId: dbRow.opportunityId,
    internshipTitle,
    internshipSlug,
    companyName,
    companyLogoUrl: companyLogoUrl ?? undefined,
    region,
    city,
    workMode,
    isPaid,
    isFeatured,
    savedAt: dbRow.savedAt instanceof Date ? dbRow.savedAt.toISOString() : dbRow.savedAt,
  };
}

