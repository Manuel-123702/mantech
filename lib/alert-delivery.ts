/**
 * MANTECH Nexus — Opportunity-alert delivery (DB + EmailJS)
 *
 * When an internship is published, this finds every intern whose saved alert
 * preferences match it, writes each an in-app Notification (the reliable
 * channel) and best-effort emails them.
 *
 * Email is a progressive enhancement: the in-app notification always lands, and
 * email fully works once a real transactional provider replaces the free-tier
 * EmailJS account (which can only deliver to the account owner).
 *
 * This function NEVER throws to its caller — moderation must not fail because
 * an alert could not be delivered. It returns how many interns were notified.
 */

import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/emailjs';
import { findAlertMatches, matchesAlert, type AlertCriteria } from '@/lib/alert-matching';
import { buildOpportunityAlert, buildOpportunityDigest, type AlertOpportunityCard } from '@/lib/alert-messages';

export type PublishedOpportunityInput = {
  id: string;
  title: string;
  slug: string;
  organizationName?: string | null;
  regionName?: string | null;
  city?: string | null;
  workMode?: string | null;
};

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');

export async function notifyMatchingAlerts(opp: PublishedOpportunityInput): Promise<number> {
  try {
    // 1. Load every saved alert (one per user — the relation is one-to-one).
    const alerts = await prisma.candidateAlert.findMany({
      select: { userId: true, regions: true, cities: true, workModes: true },
    });
    if (alerts.length === 0) return 0;

    // 2. Keep the alerts whose preferences match this opportunity.
    const matchedUserIds = new Set<string>();
    for (const a of alerts) {
      const criteria: AlertCriteria = {
        regions: (a.regions as string[]) ?? [],
        cities: (a.cities as string[]) ?? [],
        workModes: (a.workModes as string[]) ?? [],
      };
      if (matchesAlert(criteria, opp)) matchedUserIds.add(a.userId);
    }
    if (matchedUserIds.size === 0) return 0;

    // 3. Load the active users behind those alerts (email + display name).
    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(matchedUserIds) }, status: 'active' },
      select: { id: true, email: true, fullName: true },
    });
    if (users.length === 0) return 0;

    // 4. Build the message once, reuse for every recipient.
    const card: AlertOpportunityCard = {
      title: opp.title,
      organizationName: opp.organizationName,
      city: opp.city,
      regionName: opp.regionName,
      workMode: opp.workMode,
      url: `${APP_URL}/internships/${opp.slug}`,
    };
    const { subject, message } = buildOpportunityAlert(card);

    // 5. In-app notification (reliable) + best-effort email.
    for (const u of users) {
      await prisma.notification.create({
        data: {
          userId: u.id,
          title: subject,
          message,
          category: 'system',
          link: `/internships/${opp.slug}`,
        },
      });
      if (u.email) {
        void sendEmail(emailTemplates.notification(u.fullName || 'there', u.email, subject, message)).catch(() => {});
      }
    }

    return users.length;
  } catch (error) {
    console.error('[alert-delivery] notifyMatchingAlerts failed:', error);
    return 0;
  }
}

/**
 * Weekly digest (driven by /api/cron/weekly-digest).
 *
 * For every saved alert, collect the opportunities published since `days`
 * ago that match the alert's preferences and send ONE digest message per
 * intern (in-app notification + best-effort email). Alert holders already
 * get a single-alert notification at publish time, so the digest is the
 * safety net for busy weeks and for interns who muted individual alerts.
 *
 * Like notifyMatchingAlerts, this NEVER throws — a digest failure must not
 * take a cron invocation down. Returns how many digests were sent.
 */
export async function sendWeeklyDigests(
  opts?: { days?: number },
): Promise<{ sent: number; opportunities: number }> {
  try {
    const days = opts?.days ?? 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const alerts = await prisma.candidateAlert.findMany({
      select: { userId: true, regions: true, cities: true, workModes: true },
    });
    if (alerts.length === 0) return { sent: 0, opportunities: 0 };

    // Fresh, still-open opportunities from the last `days` days.
    const opportunities = await prisma.internshipOpportunity.findMany({
      where: {
        moderationStatus: 'PUBLISHED',
        deadline: { gte: new Date() },
        createdAt: { gte: since },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        city: true,
        workMode: true,
        region: { select: { name: true } },
        organization: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    if (opportunities.length === 0) return { sent: 0, opportunities: 0 };

    // One query for everyone who will receive something.
    const users = await prisma.user.findMany({
      where: { id: { in: alerts.map((a) => a.userId) }, status: 'active' },
      select: { id: true, email: true, fullName: true },
    });
    const usersById = new Map(users.map((u) => [u.id, u]));

    let sent = 0;
    for (const alert of alerts) {
      const user = usersById.get(alert.userId);
      if (!user) continue;

      const criteria: AlertCriteria = {
        regions: (alert.regions as string[]) ?? [],
        cities: (alert.cities as string[]) ?? [],
        workModes: (alert.workModes as string[]) ?? [],
      };
      const matches = findAlertMatches(criteria, opportunities);
      if (matches.length === 0) continue;

      const cards: AlertOpportunityCard[] = matches.slice(0, 10).map((opp) => ({
        title: opp.title,
        organizationName: opp.organization?.name ?? null,
        city: opp.city,
        regionName: opp.region?.name ?? null,
        workMode: opp.workMode,
        url: `${APP_URL}/internships/${opp.slug}`,
      }));
      const { subject, message } = buildOpportunityDigest(cards);

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: subject,
          message,
          category: 'system',
          link: '/internships',
        },
      });
      if (user.email) {
        void sendEmail(
          emailTemplates.notification(user.fullName || 'there', user.email, subject, message),
        ).catch(() => {});
      }
      sent += 1;
    }

    return { sent, opportunities: opportunities.length };
  } catch (error) {
    console.error('[alert-delivery] sendWeeklyDigests failed:', error);
    return { sent: 0, opportunities: 0 };
  }
}
