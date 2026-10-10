import type { InternPassport, NotificationCategory } from '@/lib/types';

export interface CandidateProfile {
  id: string;
  clerkId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  phone?: string | null;
  bio?: string | null;
  role: 'intern' | 'company' | 'university' | 'admin';
  organizationId?: string | null;
  universityId?: string | null;
  status: 'active' | 'suspended' | 'pending';
  passport?: Partial<InternPassport>;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateSavedItem {
  id: string;
  internshipId: string;
  internshipTitle: string;
  internshipSlug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  region: string;
  city: string;
  workMode: string;
  isPaid: boolean;
  isFeatured: boolean;
  savedAt: string;
}

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

export function isCandidateProfile(candidate: unknown): candidate is CandidateProfile {
  if (!candidate || typeof candidate !== 'object') return false;
  const c = candidate as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.email === 'string' &&
    typeof c.fullName === 'string' &&
    typeof c.role === 'string' &&
    (c.status === 'active' || c.status === 'suspended' || c.status === 'pending')
  );
}

