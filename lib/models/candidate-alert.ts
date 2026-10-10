import type { NotificationCategory } from '@/lib/types';

export type { NotificationCategory };

export interface CandidateAlert {
  id: string;
  userId: string;
  categories: NotificationCategory[];
  regions: string[];
  cities: string[];
  workModes: string[];
  createdAt: string;
  updatedAt: string;
}

export function toCandidateAlert(dbRow: Record<string, unknown>): CandidateAlert {
  const toIso = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v instanceof Date) return v.toISOString();
    return '';
  };
  return {
    id: typeof dbRow.id === 'string' ? dbRow.id : '',
    userId: typeof dbRow.userId === 'string' ? dbRow.userId : '',
    categories: Array.isArray(dbRow.categories) ? (dbRow.categories as NotificationCategory[]) : [],
    regions: Array.isArray(dbRow.regions) ? (dbRow.regions as string[]) : [],
    cities: Array.isArray(dbRow.cities) ? (dbRow.cities as string[]) : [],
    workModes: Array.isArray(dbRow.workModes) ? (dbRow.workModes as string[]) : [],
    createdAt: toIso(dbRow.createdAt),
    updatedAt: toIso(dbRow.updatedAt),
  };
}

