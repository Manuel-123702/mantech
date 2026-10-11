import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthError, jsonError, syncDbUser } from '@/lib/authz';
import { writeAudit } from '@/lib/audit';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import {
  OTP_SEND_LIMIT,
  OTP_SEND_WINDOW_MS,
  OTP_TTL_SECONDS,
  formatAdminOtpEmailMessage,
  formatAdminOtpEmailSubject,
  generateOtpCode,
  getOtpPepper,
  hashOtpCode,
  maskEmailDestination,
  normalizeOtpEmail,
} from '@/lib/admin-otp';
import { emailTemplates, sendEmail } from '@/lib/emailjs';

/**
 * POST /api/auth/workspace-otp/request
 *
 * Two-factor gate for the Company and University workspaces. Unlike the admin
 * gate, there is NO role allowlist: ANY signed-in user may open these
 * dashboards, but must first prove they control their sign-in inbox with a
 * 6-digit code (60s TTL) delivered by email. The admin workspace keeps its own
 * stricter role-email gate on top of the same OTP machinery.
 *
 * The code hash is stored in the same `AdminOtp` table (keyed by email, not
 * role) and the verified session uses the same signed cookie, so a user who
 * verified once is trusted across the workspaces they are allowed to open.
 */
export async function POST(request: Request) {
  try {
    const user = await syncDbUser();
    if (!user) throw new AuthError(401, 'Authentication required');
    if (!user.email) throw new AuthError(400, 'Account has no email address on file.');
    const email = normalizeOtpEmail(user.email);

    const limit = rateLimit(clientKey(request, `workspace-otp:request:${email}`), {
      limit: OTP_SEND_LIMIT,
      windowMs: OTP_SEND_WINDOW_MS,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many codes requested. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.resetSeconds) } },
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

    const sent = await sendEmail(
      emailTemplates.notification(
        user.fullName || 'MANTECH member',
        email,
        formatAdminOtpEmailSubject(),
        formatAdminOtpEmailMessage(code),
      ),
    );
    const delivery = { sent, provider: sent ? 'emailjs' : 'unconfigured' as const };

    if (!delivery.sent && !isDev) {
      await prisma.adminOtp.updateMany({
        where: { email, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      return NextResponse.json(
        { error: 'Email delivery failed. Check your EmailJS service, template and public key, then resend.', code: 'delivery_failed' },
        { status: delivery.provider === 'unconfigured' ? 503 : 502 },
      );
    }

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'WORKSPACE_OTP_REQUESTED',
      entityType: 'AdminOtp',
      entityId: email,
      details: { channel: 'email', provider: delivery.provider, sent: delivery.sent },
      request,
    }).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      maskedDestination: maskEmailDestination(email),
      expiresInSeconds: OTP_TTL_SECONDS,
      resendAfterSeconds: OTP_TTL_SECONDS,
      gateway: delivery.provider,
      ...(isDev ? { devCode: code } : {}),
    });
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
