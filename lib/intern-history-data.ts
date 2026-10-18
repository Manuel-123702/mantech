import { prisma } from '@/lib/prisma';
import { buildInternHistory, type HistoryEntry } from '@/lib/intern-history';

/**
 * Loads the intern's journey for a given user id.
 *
 * All queries are scoped by `internProfile.userId`, so an intern can only ever
 * read their own records (SRS §7 privacy, §22 isolation). The passport
 * achievements are included because they are part of the professional story a
 * recruiter sees.
 */
export async function loadInternHistory(userId: string): Promise<HistoryEntry[]> {
  const profile = await prisma.internProfile.findUnique({
    where: { userId },
    select: {
      createdAt: true,
      cvUrl: true,
      passport: {
        select: {
          passportNumber: true,
          achievements: {
            select: {
              id: true,
              title: true,
              category: true,
              issuer: true,
              issueDate: true,
              description: true,
            },
          },
        },
      },
      applications: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          opportunity: {
            select: { title: true, organization: { select: { name: true } } },
          },
          job: {
            select: { title: true, organization: { select: { name: true } } },
          },
          statusHistory: {
            select: { id: true, status: true, createdAt: true },
          },
          interviews: {
            select: { id: true, scheduledAt: true, status: true, type: true },
          },
          placement: {
            select: {
              id: true,
              status: true,
              startDate: true,
              endDate: true,
              department: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // No profile yet — nothing to show, and certainly nothing to invent.
  if (!profile) return [];

  return buildInternHistory({
    applications: profile.applications,
    achievements: profile.passport?.achievements ?? [],
    profileCreatedAt: profile.createdAt,
    hasPassport: Boolean(profile.passport),
    hasCv: Boolean(profile.cvUrl),
    passportNumber: profile.passport?.passportNumber ?? null,
  });
}