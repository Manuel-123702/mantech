import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthError, jsonError, syncDbUser } from '@/lib/authz';
import { writeAudit } from '@/lib/audit';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import {
  OTP_SEND_LIMIT,
  OTP_SEND_WINDOW_MS,
  OTP_TTL_SECONDS,
  formatAdminOtpWhatsAppMessage,
  generateOtpCode,
  getOtpPepper,
  hashOtpCode,
  maskWhatsAppDestination,
  normalizeOtpEmail,
} from '@/lib/admin-otp';
import { sendWhatsAppDirect } from '@/lib/whatsapp-notifications';

/**
 * POST /api/auth/admin-otp/request
 *
 * Step 1 of the admin two-factor gate. The caller must already be signed in
 * through Clerk AND resolve to the ADMIN role. Generates a fresh 6-digit code
 * (60s TTL), stores only its SHA-256 hash, burns any previous outstanding
 * code, and delivers the code to ADMIN_WHATSAPP through the WhatsApp gateway.
 *
 * In development, when no gateway is configured, the code is echoed back in
 * `devCode` so the flow can be exercised locally. Never in production.
 */
export async function POST(request: Request) {
  try {
    const user = await syncDbUser();
    if (!user) throw new AuthError(401, 'Authentication required');
    if (user.role !== 'ADMIN') throw new AuthError(403, 'Administrative clearance required');
    if (!user.email) throw new AuthError(400, 'Account has no email address on file.');
    const email = normalizeOtpEmail(user.email);

    const limit = rateLimit(clientKey(request, `admin-otp:request:${email}`), {
      limit: OTP_SEND_LIMIT,
      windowMs: OTP_SEND_WINDOW_MS,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many codes requested. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.resetSeconds) } },
      );
    }

    const destination = process.env.ADMIN_WHATSAPP || '';
    if (!destination) {
      return NextResponse.json(
        {
          error: 'WhatsApp delivery is not configured.',
          setupHint:
            'Add ADMIN_WHATSAPP=<your number, e.g. 237650921917> plus a free gateway to .env:\n  CallMeBot: WHATSAPP_API_URL=https://api.callmebot.com/whatsapp.php?apikey=YOUR_KEY\n  Meta:      WHATSAPP_API_URL=https://graph.facebook.com/v21.0/<PHONE_ID>/messages\n  WHATSAPP_API_TOKEN=<YOUR_TOKEN>',
          code: 'gateway_unconfigured',
        },
        { status: 503 },
      );
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const code = generateOtpCode();
    const codeHash = await hashOtpCode({ email, code, pepper: getOtpPepper() });
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

    // Only the newest code can ever verify — burn anything outstanding.
    await prisma.adminOtp.updateMany({
      where: { email, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    await prisma.adminOtp.create({ data: { email, codeHash, expiresAt } });

    const delivery = await sendWhatsAppDirect(destination, formatAdminOtpWhatsAppMessage(code));

    if (!delivery.sent && !isDev) {
      // Production has no silent fallback: burn the undeliverable code and
      // tell the operator exactly what failed.
      await prisma.adminOtp.updateMany({
        where: { email, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      return NextResponse.json(
        { error: 'WhatsApp delivery failed.', detail: delivery.error, code: 'delivery_failed' },
        { status: delivery.provider === 'unconfigured' ? 503 : 502 },
      );
    }

    await writeAudit({
      actorId: user.id,
      actorRole: 'ADMIN',
      action: 'ADMIN_OTP_REQUESTED',
      entityType: 'AdminOtp',
      entityId: email,
      details: { channel: 'whatsapp', provider: delivery.provider, sent: delivery.sent },
      request,
    }).catch(() => undefined); // never fail the flow on an audit hiccup

    return NextResponse.json({
      ok: true,
      maskedDestination: maskWhatsAppDestination(destination),
      expiresInSeconds: OTP_TTL_SECONDS,
      resendAfterSeconds: OTP_TTL_SECONDS,
      gateway: delivery.provider,
      // Development-only convenience when the gateway is not wired up yet.
      ...(isDev ? { devCode: code } : {}),
    });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
