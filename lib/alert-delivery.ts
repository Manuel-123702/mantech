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
import { matchesAlert, type AlertCriteria } from '@/lib/alert-matching';
import { buildOpportunityAlert, type AlertOpportunityCard } from '@/lib/alert-messages';

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
