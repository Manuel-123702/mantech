/**
 * MANTECH Nexus — Opportunity-alert message builders (pure, no I/O)
 *
 * Produces the human-readable text that the delivery layer sends by email
 * (and, when a gateway is configured, WhatsApp). Kept pure so wording can be
 * unit-tested and reused for both single-opportunity alerts and weekly digests.
 */

export type AlertOpportunityCard = {
  title: string;
  organizationName?: string | null;
  city?: string | null;
  regionName?: string | null;
  workMode?: string | null;
  url: string;
};

const SITE = 'MANTECH Nexus';

function locationLabel(opp: AlertOpportunityCard): string {
  const parts = [opp.city, opp.regionName].filter((p) => !!p && String(p).trim().length > 0);
  return parts.length > 0 ? parts.join(', ') : 'Cameroon';
}

function modeLabel(opp: AlertOpportunityCard): string {
  const w = (opp.workMode ?? '').toLowerCase();
  if (w === 'remote') return 'Remote';
  if (w === 'hybrid') return 'Hybrid';
  return 'On-site';
}

/** Subject + body for a single newly-matched opportunity. */
export function buildOpportunityAlert(opp: AlertOpportunityCard): { subject: string; message: string } {
  const subject = `New internship matching your alert: ${opp.title}`;
  const lines = [
    `A new internship on ${SITE} matches what you asked to be alerted about.`,
    '',
    `• ${opp.title}${opp.organizationName ? ` — ${opp.organizationName}` : ''}`,
    `  ${locationLabel(opp)} · ${modeLabel(opp)}`,
    '',
    `View it here: ${opp.url}`,
    '',
    `You are receiving this because you set an opportunity alert on ${SITE}.`,
  ];
  return { subject, message: lines.join('\n') };
}

/** Subject + body for a digest of several matched opportunities. */
export function buildOpportunityDigest(
  opps: AlertOpportunityCard[],
  opts?: { heading?: string },
): { subject: string; message: string } {
  const count = opps.length;
  const subject = `${count} new internship${count === 1 ? '' : 's'} matching your alert`;
  const heading = opts?.heading ?? `Here ${count === 1 ? 'is a new internship' : `are ${count} new internships`} that match your alert:`;
  const body: string[] = [heading, ''];
  for (const opp of opps) {
    body.push(
      `• ${opp.title}${opp.organizationName ? ` — ${opp.organizationName}` : ''} · ${locationLabel(opp)} · ${modeLabel(opp)}`,
    );
    body.push(`  ${opp.url}`);
  }
  body.push('', `— ${SITE}`);
  return { subject, message: body.join('\n') };
}

export type ListingKind = 'internship' | 'job';

/**
 * Instant WhatsApp text for a newly published listing.
 *
 * Kept short and plain-text on purpose: WhatsApp gateway payloads (Meta /
 * Twilio / CallMeBot) truncate long messages, and most Cameroonian users read
 * alerts on low-end devices. The in-app notification + email keep the longer
 * formatted version; this is the "tap now" ping.
 */
export function buildListingWhatsAppAlert(opp: AlertOpportunityCard & { kind?: ListingKind }): string {
  const kindLabel = opp.kind === 'job' ? 'New job' : 'New internship';
  const lines = [
    `🎓 *${SITE}* — ${kindLabel} alert!`,
    ``,
    `📌 *${opp.title}*`,
    opp.organizationName ? `🏢 ${opp.organizationName}` : null,
    `📍 ${locationLabel(opp)} · ${modeLabel(opp)}`,
    ``,
    `👉 Apply here: ${opp.url}`,
    ``,
    `— Reply STOP to unsubscribe from these alerts.`,
  ].filter((line): line is string => line !== null);
  return lines.join('\n');
}
