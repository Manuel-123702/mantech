import { z } from 'zod';

export const candidateAlertResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categories: z.array(z.enum(['application', 'interview', 'placement', 'shortlist', 'contact', 'verification', 'package', 'system', 'report', 'evaluation', 'business'])),
  regions: z.array(z.string()),
  cities: z.array(z.string()),
  workModes: z.array(z.enum(['onsite', 'on-site', 'hybrid', 'remote'])),
  whatsappOptIn: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CandidateAlertResponse = z.infer<typeof candidateAlertResponseSchema>;

export const candidateAlertListSchema = z.object({
  items: z.array(candidateAlertResponseSchema),
  count: z.number(),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  pages: z.number(),
});

export type CandidateAlertList = z.infer<typeof candidateAlertListSchema>;

