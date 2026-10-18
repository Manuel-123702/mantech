/**
 * MANTECH Nexus — Automated WhatsApp Notification Engine
 * SRS §16 & Cameroon-First Ecosystem Architecture
 *
 * WhatsApp is the primary communication channel in Cameroon (99% coverage
 * via affordable forfaits WhatsApp). This module handles:
 * 1. Pre-formatted bilingual notification alerts for Shortlists, Interviews,
 *    and Status Updates.
 * 2. Instant recruiter one-tap WhatsApp deep links (wa.me) with pre-filled text.
 * 3. Server-side webhook/gateway dispatch (Meta Cloud API, Twilio, or custom gateway).
 * 4. Application Status query responder for the WhatsApp Concierge Webhook.
 */

import { APP_CONFIG } from '@/lib/config';

export type WhatsAppAlertEvent =
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER_MADE'
  | 'APPLICATION_REJECTED'
  | 'NEW_LISTING_PUBLISHED'
  | 'GENERAL_STATUS_UPDATE';

/**
 * Standardizes Cameroon phone numbers to E.164 without plus signs for wa.me links
 * e.g., "+237 650 921 917" or "650921917" -> "237650921917"
 */
export function normalizeCameroonPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('237') && digits.length >= 12) {
    return digits;
  }
  if (digits.length === 9) {
    return `237${digits}`;
  }
  return digits;
}

/**
 * Formats a clean wa.me deep link with prefilled text
 */
export function createWhatsAppDeepLink(phone: string, text: string): string {
  const cleanPhone = normalizeCameroonPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE BUILDERS (Bilingual Cameroon Context)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Alert template when a candidate is shortlisted
 */
export function formatShortlistWhatsAppAlert(opts: {
  candidateName: string;
  opportunityTitle: string;
  companyName: string;
  applicationId: string;
}): string {
  const portalUrl = `${APP_CONFIG.url}/dashboard/intern/applications`;
  return [
    `🎓 *MANTECH Nexus Alert* — Application Shortlisted!`,
    ``,
    `Hello ${opts.candidateName} 👋,`,
    `Great news! Your application has been *SHORTLISTED* by *${opts.companyName}*.`,
    ``,
    `📌 *Position:* ${opts.opportunityTitle}`,
    `🏢 *Host:* ${opts.companyName}`,
    `🆔 *Application Ref:* ${opts.applicationId.slice(0, 8).toUpperCase()}`,
    ``,
    `👉 *Next Step:* The hiring team will schedule your interview soon. Keep your phone and WhatsApp reachable.`,
    ``,
    `🔗 View status on portal: ${portalUrl}`,
    `— MANTECH Nexus Notification Service`,
  ].join('\n');
}

/**
 * Alert template when an interview is scheduled
 */
export function formatInterviewWhatsAppAlert(opts: {
  candidateName: string;
  opportunityTitle: string;
  companyName: string;
  scheduledAt: Date | string;
  durationMinutes?: number;
  type?: string;
  meetingLink?: string | null;
  locationAddress?: string | null;
  interviewerName?: string | null;
  applicationId: string;
}): string {
  const dateObj = new Date(opts.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' (WAT / Cameroon Time)';

  const mode = (opts.type || 'online').toUpperCase();
  const portalUrl = `${APP_CONFIG.url}/dashboard/intern/applications`;

  const lines = [
    `📅 *MANTECH Nexus* — Interview Scheduled!`,
    ``,
    `Hello ${opts.candidateName} 👋,`,
    `*${opts.companyName}* has invited you to an official internship interview:`,
    ``,
    `📌 *Position:* ${opts.opportunityTitle}`,
    `📆 *Date:* ${formattedDate}`,
    `⏰ *Time:* ${formattedTime}`,
    `⏱️ *Duration:* ${opts.durationMinutes || 45} mins`,
    `📍 *Format:* ${mode}`,
  ];

  if (mode === 'ONLINE' && opts.meetingLink) {
    lines.push(`💻 *Meeting Link:* ${opts.meetingLink}`);
  } else if (mode === 'ONSITE' && opts.locationAddress) {
    lines.push(`🏢 *Interview Location:* ${opts.locationAddress}`);
  }

  if (opts.interviewerName) {
    lines.push(`👤 *Interviewer / Panel:* ${opts.interviewerName}`);
  }

  lines.push(
    ``,
    `🆔 *Ref:* ${opts.applicationId.slice(0, 8).toUpperCase()}`,
    `🔗 Access your preparation dashboard: ${portalUrl}`,
    ``,
    `_Tip: Please be ready 10 minutes before the scheduled time._`,
    `— MANTECH Nexus Notification System`,
  );

  return lines.join('\n');
}

/**
 * Alert template when application status changes (e.g. Selected, Placed, Under Review)
 */
export function formatStatusUpdateWhatsAppAlert(opts: {
  candidateName: string;
  opportunityTitle: string;
  companyName: string;
  newStatus: string;
  note?: string | null;
  applicationId: string;
}): string {
  const readableStatus = opts.newStatus.replace(/_/g, ' ').toUpperCase();
  const portalUrl = `${APP_CONFIG.url}/dashboard/intern/applications`;

  const lines = [
    `🔔 *MANTECH Nexus* — Application Status Update`,
    ``,
    `Hello ${opts.candidateName} 👋,`,
    `Your application for *${opts.opportunityTitle}* at *${opts.companyName}* has been updated to:`,
    `👉 *${readableStatus}*`,
    ``,
    `🆔 *Ref:* ${opts.applicationId.slice(0, 8).toUpperCase()}`,
  ];

  if (opts.note) {
    lines.push(`💬 *Recruiter Note:* "${opts.note}"`);
  }

  lines.push(
    ``,
    `🔗 Check full details & next steps: ${portalUrl}`,
    `— MANTECH Nexus`,
  );

  return lines.join('\n');
}

/**
 * Formats a message response for incoming student WhatsApp status inquiries
 */
export function formatStatusQueryWhatsAppResponse(opts: {
  candidateName: string;
  opportunityTitle: string;
  companyName: string;
  status: string;
  updatedAt: Date | string;
  applicationId: string;
  hasInterview?: boolean;
  interviewDate?: Date | string | null;
  interviewLink?: string | null;
}): string {
  const readableStatus = opts.status.replace(/_/g, ' ').toUpperCase();
  const dateStr = new Date(opts.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lines = [
    `🎓 *MANTECH Nexus — Application Status Inquiry*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Candidate:* ${opts.candidateName}`,
    `📌 *Position:* ${opts.opportunityTitle}`,
    `🏢 *Company:* ${opts.companyName}`,
    `📊 *Current Status:* *${readableStatus}*`,
    `📅 *Last Updated:* ${dateStr}`,
    `🆔 *Application Ref:* ${opts.applicationId.slice(0, 8).toUpperCase()}`,
    `━━━━━━━━━━━━━━━━━━━━━`,
  ];

  if (opts.hasInterview && opts.interviewDate) {
    const interviewTime = new Date(opts.interviewDate).toLocaleString('en-GB');
    lines.push(
      `⏰ *Interview Scheduled:* ${interviewTime} (WAT)`,
      opts.interviewLink ? `🔗 *Meeting:* ${opts.interviewLink}` : '',
      `━━━━━━━━━━━━━━━━━━━━━`,
    );
  }

  if (opts.status === 'SHORTLISTED') {
    lines.push(`💡 *Status Note:* You are shortlisted! Expect an interview invitation soon.`);
  } else if (opts.status === 'SELECTED' || opts.status === 'PLACED') {
    lines.push(`🎉 *Congratulations!* Your placement agreement is ready for processing.`);
  } else if (opts.status === 'SUBMITTED' || opts.status === 'UNDER_REVIEW') {
    lines.push(`⏳ *Status Note:* Your profile is currently under review by the hiring manager.`);
  }

  lines.push(
    ``,
    `🔗 Manage your profile: ${APP_CONFIG.url}/dashboard/intern`,
    `💬 Need help? Reply *HELP* or message our human concierge at ${APP_CONFIG.contacts.whatsapp}`,
  );

  return lines.filter(Boolean).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCH ENGINE (Cloud API / Gateway / wa.me link generation)
// ─────────────────────────────────────────────────────────────────────────────

export type WhatsAppDispatchResult = {
  success: boolean;
  channel: 'api_gateway' | 'wa_link';
  deepLink?: string;
  messageId?: string;
  error?: string;
};

/**
 * Dispatches a WhatsApp notification.
 * If external WhatsApp gateway environment variables are defined (e.g. Meta Cloud API, Twilio, or Evolution API),
 * sends via HTTP API; otherwise provides the prefilled wa.me deep link for immediate recruiter/agent dispatch.
 */
export async function dispatchWhatsAppNotification(opts: {
  phone: string;
  text: string;
  eventType: WhatsAppAlertEvent;
  applicationId?: string;
}): Promise<WhatsAppDispatchResult> {
  const cleanPhone = normalizeCameroonPhone(opts.phone);
  const deepLink = createWhatsAppDeepLink(cleanPhone, opts.text);

  if (!cleanPhone) {
    return {
      success: false,
      channel: 'wa_link',
      error: 'Invalid or missing phone number.',
    };
  }

  const gatewayUrl = process.env.WHATSAPP_API_URL;
  const gatewayToken = process.env.WHATSAPP_API_TOKEN;

  // If external gateway configured, attempt automated REST dispatch
  if (gatewayUrl && gatewayToken) {
    try {
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${gatewayToken}`,
        },
        body: JSON.stringify({
          to: cleanPhone,
          message: opts.text,
          metadata: {
            eventType: opts.eventType,
            applicationId: opts.applicationId,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          success: true,
          channel: 'api_gateway',
          messageId: data.id || data.messageId || 'gateway_sent',
          deepLink,
        };
      }
    } catch (err) {
      console.warn('WhatsApp API Gateway dispatch failed, falling back to wa_link:', err);
    }
  }

  // Standard production fallback in Cameroon: return verified deepLink
  return {
    success: true,
    channel: 'wa_link',
    deepLink,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DIRECT SERVER → USER DELIVERY (admin OTP / security codes)
// ─────────────────────────────────────────────────────────────────────────────

export type WhatsAppDirectResult = {
  sent: boolean;
  provider: 'meta' | 'generic' | 'unconfigured' | 'error';
  messageId?: string;
  error?: string;
};

/**
 * Best-effort server-to-user WhatsApp send (used for admin OTP delivery).
 *
 * Unlike dispatchWhatsAppNotification this NEVER falls back to a wa.me deep
 * link — a deep link cannot deliver a secret code, so callers must treat
 * `sent: false` as a hard failure and surface it.
 *
 * Configure with:
 *   WHATSAPP_API_URL  — Meta Cloud API: https://graph.facebook.com/v21.0/<PHONE_NUMBER_ID>/messages
 *                       or any generic gateway accepting { to, message }
 *   WHATSAPP_API_TOKEN — Bearer token for the gateway
 */
export async function sendWhatsAppDirect(
  phone: string,
  text: string,
): Promise<WhatsAppDirectResult> {
  const to = normalizeCameroonPhone(phone);
  if (!to) {
    return { sent: false, provider: 'error', error: 'Invalid or missing WhatsApp number.' };
  }

  const url = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_API_TOKEN;
  if (!url || !token) {
    return {
      sent: false,
      provider: 'unconfigured',
      error: 'WhatsApp gateway not configured (WHATSAPP_API_URL / WHATSAPP_API_TOKEN).',
    };
  }

  const isMeta = url.includes('graph.facebook.com');
  const isCallMeBot = url.includes('callmebot.com');

  // CallMeBot (free, personal-number gateway) uses a GET endpoint where the
  // API key lives in the URL and the payload travels as query parameters.
  if (isCallMeBot) {
    const separator = url.includes('?') ? '&' : '?';
    const keyParam =
      token && !url.includes('apikey=')
        ? `${separator}apikey=${encodeURIComponent(token)}`
        : '';
    const endpoint =
      `${url}${keyParam}${keyParam ? '&' : separator}` +
      `phone=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        console.error('CallMeBot rejected message.', response.status, detail.slice(0, 200));
        return {
          sent: false,
          provider: 'generic',
          error: `CallMeBot responded ${response.status}.`,
        };
      }
      return { sent: true, provider: 'generic', messageId: 'callmebot_sent' };
    } catch (error) {
      console.error('CallMeBot delivery failed.', error);
      return { sent: false, provider: 'generic', error: 'Network error contacting CallMeBot.' };
    }
  }

  const body = isMeta
    ? {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: false, body: text },
      }
    : { to, message: text };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('WhatsApp gateway rejected message.', response.status, detail.slice(0, 300));
      return {
        sent: false,
        provider: isMeta ? 'meta' : 'generic',
        error: `WhatsApp gateway responded ${response.status}.`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as {
      messages?: { id?: string }[];
      id?: string;
    };
    const messageId = data.messages?.[0]?.id || data.id || undefined;
    return { sent: true, provider: isMeta ? 'meta' : 'generic', messageId };
  } catch (error) {
    console.error('WhatsApp gateway delivery failed.', error);
    return {
      sent: false,
      provider: isMeta ? 'meta' : 'generic',
      error: 'Network error contacting the WhatsApp gateway.',
    };
  }
}
