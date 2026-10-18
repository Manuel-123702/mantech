import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatStatusQueryWhatsAppResponse, normalizeCameroonPhone } from '@/lib/whatsapp-notifications';
import { APP_CONFIG } from '@/lib/config';

/**
 * WhatsApp Cloud API / Webhook Verification Handler (GET)
 * Meta / Cloud Webhook sends hub.mode, hub.challenge, hub.verify_token
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'mantech_nexus_whatsapp_verify_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 });
}

/**
 * Incoming WhatsApp Webhook Handler (POST)
 * Accepts incoming messages from Meta WhatsApp Cloud API, Twilio, or custom gateway.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    // Extract sender and message text from various gateway formats (Meta Cloud API, Twilio, or generic)
    let senderPhone = '';
    let messageText = '';

    // 1. Meta Cloud API format
    const metaMessage = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (metaMessage) {
      senderPhone = metaMessage.from || '';
      messageText = metaMessage.text?.body || '';
    }

    // 2. Twilio / Generic Webhook format
    if (!messageText) {
      senderPhone = body.From || body.from || body.phone || body.sender || '';
      messageText = body.Body || body.body || body.message || body.text || '';
    }

    const trimmed = (messageText || '').trim();
    const cleanSender = normalizeCameroonPhone(senderPhone);

    // If no message or empty, acknowledge webhook receipt
    if (!trimmed) {
      return NextResponse.json({ status: 'ignored_empty' }, { status: 200 });
    }

    const upperText = trimmed.toUpperCase();

    // ── Command 0: STOP / START — WhatsApp alert opt-out / opt-in ─────────
    // Users text STOP to mute new-listing pings (in-app + email continue),
    // START to re-enable them. Matched by phone on User.phone or the intern
    // profile phone. Never errors — an unknown number just gets guidance.
    const isStop = /^(STOP|STOPALERTS|STOP\s*ALERTS|ARRET|UNSUBSCRIBE)\b/.test(upperText);
    const isStart = /^(START|START\s*ALERTS|REPRENDRE|SUBSCRIBE)\b/.test(upperText);
    if (isStop || isStart) {
      const digits = cleanSender.replace(/\D/g, '');
      let matched = 0;
      if (digits.length >= 8) {
        const tail = digits.slice(-8);
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { phone: { contains: tail } },
              { internProfile: { phone: { contains: tail } } },
            ],
          },
          select: { id: true },
        });
        if (users.length > 0) {
          const result = await prisma.candidateAlert.updateMany({
            where: { userId: { in: users.map((u) => u.id) } },
            data: { whatsappOptIn: isStart },
          });
          matched = result.count;
        }
      }
      const reply = isStop
        ? [
            `🔕 *MANTECH Nexus job alerts paused.*`,
            ``,
            matched > 0
              ? `You will no longer receive WhatsApp pings for new postings. Your in-app and email alerts stay on.`
              : `We could not match this number to an account — reply from the number on your MANTECH profile. Your in-app and email alerts are unaffected.`,
            ``,
            `Reply *START* any time to resume WhatsApp alerts.`,
          ].join('\n')
        : [
            `🔔 *MANTECH Nexus job alerts resumed!*`,
            ``,
            matched > 0
              ? `You will now receive instant WhatsApp pings for postings matching your alert preferences.`
              : `We could not match this number to an account — make sure your MANTECH profile phone is up to date, then reply *START* again.`,
            ``,
            `Reply *STOP* any time to pause them.`,
          ].join('\n');
      return NextResponse.json({
        status: isStop ? 'unsubscribed' : 'subscribed',
        reply,
        sender: cleanSender,
        type: 'alert_preference',
      });
    }

    // ── Command 1: STATUS Inquiry (e.g. "STATUS 12345" or "STATUS" or 8-char reference) ──
    const isStatusQuery = upperText.startsWith('STATUS') || upperText.startsWith('STATUT');
    const refMatch = trimmed.match(/[a-f0-9-]{6,36}/i);

    if (isStatusQuery || refMatch) {
      const searchRef = refMatch ? refMatch[0] : trimmed.replace(/^(STATUS|STATUT)\s*/i, '').trim();

      const application = await prisma.application.findFirst({
        where: {
          OR: [
            ...(searchRef ? [{ id: searchRef }, { id: { startsWith: searchRef.toLowerCase() } }] : []),
            ...(cleanSender.length >= 8
              ? [
                  { internProfile: { phone: { contains: cleanSender.slice(-8) } } },
                  { internProfile: { user: { phone: { contains: cleanSender.slice(-8) } } } },
                ]
              : []),
          ],
        },
        include: {
          internProfile: {
            include: { user: { select: { fullName: true } } },
          },
          opportunity: {
            include: { organization: { select: { name: true } } },
          },
          interviews: {
            where: { status: 'scheduled' },
            orderBy: { scheduledAt: 'asc' },
            take: 1,
          },
        },
      });

      if (application && application.opportunity) {
        const nextInterview = application.interviews[0];
        const reply = formatStatusQueryWhatsAppResponse({
          candidateName: application.internProfile.user.fullName,
          opportunityTitle: application.opportunity.title,
          companyName: application.opportunity.organization.name,
          status: application.status,
          updatedAt: application.updatedAt,
          applicationId: application.id,
          hasInterview: Boolean(nextInterview),
          interviewDate: nextInterview?.scheduledAt,
          interviewLink: nextInterview?.meetingLink,
        });

        return NextResponse.json({
          status: 'success',
          reply,
          sender: cleanSender,
          type: 'application_status',
        });
      }

      // No match found
      const notFoundReply = [
        `🎓 *MANTECH Nexus Status Checker*`,
        ``,
        `We could not find an application matching: "${searchRef || cleanSender}".`,
        ``,
        `💡 *How to check:*`,
        `Send: *STATUS <Your_Application_ID>*`,
        `Example: *STATUS ${'A1B2C3D4'}*`,
        ``,
        `You can find your Application ID on your dashboard:`,
        `🔗 ${APP_CONFIG.url}/dashboard/intern/applications`,
        ``,
        `Need help? Send *HELP* to speak with our support desk.`,
      ].join('\n');

      return NextResponse.json({
        status: 'not_found',
        reply: notFoundReply,
        sender: cleanSender,
      });
    }

    // ── Command 2: HELP or General Menu ──
    const helpReply = [
      `👋 *Welcome to MANTECH Nexus WhatsApp Concierge!*`,
      `Cameroon's #1 Professional Internship Infrastructure.`,
      ``,
      `📌 *Available Commands:*`,
      `1️⃣ *STATUS <ID>* — Check your live application & interview status`,
      `2️⃣ *INTERNSHIPS* — Get latest featured IT openings across Cameroon`,
      `3️⃣ *PASSPORT* — Information on verifying your Intern Passport`,
      `4️⃣ *SUPPORT* — Connect with a human recruitment concierge`,
      `5️⃣ *STOP* — Pause instant job-alert pings (*START* to resume)`,
      ``,
      `🌐 Portal: ${APP_CONFIG.url}`,
      `📞 Emergency Support: ${APP_CONFIG.contacts.whatsapp}`,
    ].join('\n');

    return NextResponse.json({
      status: 'success',
      reply: helpReply,
      sender: cleanSender,
      type: 'menu',
    });
  } catch (error) {
    console.error('WhatsApp webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
