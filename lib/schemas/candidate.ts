import { z } from 'zod';

export const candidateProfileSchema = z.object({
  id: z.string(),
  clerkId: z.string().optional(),
  email: z.string().email(),
  fullName: z.string(),
  avatarUrl: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(['intern', 'company', 'university', 'admin']),
  organizationId: z.string().optional(),
  universityId: z.string().optional(),
  status: z.enum(['active', 'suspended', 'pending']),
  passport: z.object({
    id: z.string(),
    internProfileId: z.string(),
    skills: z.array(z.string()).default([]),
    fieldsOfStudy: z.array(z.string()).default([]),
    preferredRegions: z.array(z.string()).default([]),
    preferredCities: z.array(z.string()).default([]),
    preferredWorkModes: z.array(z.string()).default([]),
    created_at: z.string(),
    updated_at: z.string(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;

export const candidateAlertSchema = z.object({
  userId: z.string(),
  categories: z.array(z.enum(['application', 'interview', 'placement', 'shortlist', 'contact', 'verification', 'package', 'system', 'report', 'evaluation', 'business'])).default([]),
  regions: z.array(z.string()).default([]),
  cities: z.array(z.string()).default([]),
  workModes: z.array(z.enum(['onsite', 'on-site', 'hybrid', 'remote'])).default([]),
});

export type CandidateAlertInput = z.infer<typeof candidateAlertSchema>;

export const candidateAlertResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categories: z.array(z.enum(['application', 'interview', 'placement', 'shortlist', 'contact', 'verification', 'package', 'system', 'report', 'evaluation', 'business'])),
  regions: z.array(z.string()),
  cities: z.array(z.string()),
  workModes: z.array(z.enum(['onsite', 'on-site', 'hybrid', 'remote'])),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CandidateAlertResponse = z.infer<typeof candidateAlertResponseSchema>;

