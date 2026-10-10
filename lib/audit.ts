import { prisma } from '@/lib/prisma';
import { emailTemplates, sendEmail } from '@/lib/emailjs';
import {
  dispatchWhatsAppNotification,
  formatStatusUpdateWhatsAppAlert,
} from '@/lib/whatsapp-notifications';

export async function writeAudit(opts: {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: unknown;
  request?: Request;
}) {
  const forwarded = opts.request?.headers.get('x-forwarded-for');
  await prisma.auditLog.create({
    data: {
      actorId: opts.actorId || undefined,
      actorRole: opts.actorRole || undefined,
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId,
      details: opts.details ? JSON.stringify(opts.details) : undefined,
      ipAddress: forwarded?.split(',')[0]?.trim() || undefined,
      userAgent: opts.request?.headers.get('user-agent') || undefined,
    },
  });
}

export async function notifyUser(opts: {
  userId: string;
  title: string;
  message: string;
  category: string;
  link?: string;
  // Optional context for WhatsApp rich alerts — pass when status change is known
  whatsApp?: {
    opportunityTitle: string;
    companyName: string;
    newStatus: string;
    note?: string | null;
    applicationId: string;
  };
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: opts.userId,
      title: opts.title,
      message: opts.message,
      category: opts.category,
      link: opts.link,
    },
  });

  const recipient = await prisma.user.findUnique({
    where: { id: opts.userId },
    select: {
      email: true,
      fullName: true,
      internProfile: { select: { phone: true } },
    },
  });

  // ── Email channel ──────────────────────────────────────────────────────────
  if (recipient?.email) {
    await sendEmail(emailTemplates.notification(
      recipient.fullName,
      recipient.email,
      opts.title,
      opts.message,
    ));
  }

  // ── WhatsApp channel (fire-and-forget) ─────────────────────────────────────
  // Only fires when the caller provides rich WhatsApp context and the candidate
  // has a phone number on their intern profile.
  if (opts.whatsApp && recipient?.internProfile?.phone) {
    const waText = formatStatusUpdateWhatsAppAlert({
      candidateName: recipient.fullName,
      opportunityTitle: opts.whatsApp.opportunityTitle,
      companyName: opts.whatsApp.companyName,
      newStatus: opts.whatsApp.newStatus,
      note: opts.whatsApp.note ?? null,
      applicationId: opts.whatsApp.applicationId,
    });

    // Fire-and-forget: do not await so the main API response is never blocked
    dispatchWhatsAppNotification({
      phone: recipient.internProfile.phone,
      text: waText,
      eventType: 'GENERAL_STATUS_UPDATE',
      applicationId: opts.whatsApp.applicationId,
    }).catch((err) => {
      console.warn('[WhatsApp] dispatchWhatsAppNotification failed (non-fatal):', err);
    });
  }

  return notification;
}
