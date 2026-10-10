import { z } from 'zod';

export const candidateSavedItemSchema = z.object({
  id: z.string(),
  internshipId: z.string(),
  internshipTitle: z.string(),
  internshipSlug: z.string(),
  companyName: z.string(),
  companyLogoUrl: z.string().optional(),
  region: z.string(),
  city: z.string(),
  workMode: z.string(),
  isPaid: z.boolean(),
  isFeatured: z.boolean(),
  savedAt: z.string(),
});

export type CandidateSavedItem = z.infer<typeof candidateSavedItemSchema>;

export const candidateSavedListSchema = z.object({
  items: z.array(candidateSavedItemSchema),
  count: z.number(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
});

export type CandidateSavedList = z.infer<typeof candidateSavedListSchema>;

