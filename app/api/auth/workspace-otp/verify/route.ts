import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthError, jsonError, syncDbUser } from '@/lib/authz';
import { writeAudit } from '@/lib/audit';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import {
  ADMIN_OTP_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_VERIFY_LIMIT,
  OTP_VERIFY_WINDOW_MS,
  getOtpPepper,
  getOtpSessionSecret,
  isWellFormedOtpCode,
  normalizeOtpEmail,
  signAdminOtpSession,
  verifyOtpHash,
} from '@/lib/admin-otp';

/**
 * POST /api/auth/workspace-otp/verify
 *
 * Step 2 of the Company/University two-factor gate. Same policy as the admin
 * gate (60s TTL, 3 attempts, newest-code-only) but with NO role check — any
 * signed-in user may verify. On success the same signed httpOnly session
 * cookie is minted, which the middleware accepts for the company and
 * university workspaces. `next` is restricted to those two workspaces.
 */
export async function POST(request: Request) {
  try {
    const user = await syncDbUser();
    if (!user) throw new AuthError(401, 'Authentication required');
    if (!user.email) throw new AuthError(400, 'Account has no email address on file.');
    const email = normalizeOtpEmail(user.email);

    const body = (await request.json().catch(() => ({}))) as { code?: unknown; next?: unknown };

    if (!isWellFormedOtpCode(body.code)) {
      return NextResponse.json({ error: 'Enter the 6-digit code.' }, { status: 400 });
    }
    const code = body.code;

    const limit = rateLimit(clientKey(request, `workspace-otp:verify:${email}`), {
      limit: OTP_VERIFY_LIMIT,
      windowMs: OTP_VERIFY_WINDOW_MS,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.resetSeconds) } },
      );
    }

    const now = new Date();
    const pending = await prisma.adminOtp.findFirst({
      where: { email, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!pending) {
      return NextResponse.json({ error: 'No active code. Request a new one.', code: 'not_found' }, { status: 400 });
    }
    if (pending.expiresAt.getTime() <= now.getTime()) {
      await prisma.adminOtp.update({ where: { id: pending.id }, data: { consumedAt: now } });
      return NextResponse.json({ error: 'Code expired. Request a new one.', code: 'expired' }, { status: 400 });
    }
    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.adminOtp.update({ where: { id: pending.id }, data: { consumedAt: now } });
      return NextResponse.json({ error: 'Too many attempts. Request a new code.', code: 'too_many_attempts' }, { status: 400 });
    }

    const matches = await verifyOtpHash({ storedHash: pending.codeHash, email, code, pepper: getOtpPepper() });

    if (!matches) {
      const attempts = pending.attempts + 1;
      const burned = attempts >= OTP_MAX_ATTEMPTS;
      await prisma.adminOtp.update({ where: { id: pending.id }, data: { attempts, ...(burned ? { consumedAt: now } : {}) } });
      await writeAudit({
        actorId: user.id,
        actorRole: user.role,
        action: 'WORKSPACE_OTP_FAILED',
        entityType: 'AdminOtp',
        entityId: email,
        details: { attempts, burned },
        request,
      }).catch(() => undefined);
      return NextResponse.json(
        { error: burned ? 'Too many attempts. Request a new code.' : 'Incorrect code.', code: burned ? 'too_many_attempts' : 'incorrect', attemptsLeft: Math.max(0, OTP_MAX_ATTEMPTS - attempts) },
        { status: 400 },
      );
    }

    await prisma.adminOtp.updateMany({ where: { email, consumedAt: null }, data: { consumedAt: now } });

    const rawNext = typeof body.next === 'string' ? body.next : '';
    const next =
      (rawNext.startsWith('/dashboard/company') || rawNext.startsWith('/dashboard/university')) && !rawNext.startsWith('//')
        ? rawNext
        : '/dashboard';

    const token = await signAdminOtpSession({ email, secret: getOtpSessionSecret() });

    await writeAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'WORKSPACE_OTP_VERIFIED',
      entityType: 'AdminOtp',
      entityId: email,
      details: { channel: 'email' },
      request,
    }).catch(() => undefined);

    const response = NextResponse.json({ ok: true, redirect: next });
    response.cookies.set(ADMIN_OTP_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
      path: '/',
    });
    return response;
  } catch (error) {
    const { body, status } = jsonError(error);
    return NextResponse.json(body, { status });
  }
}
