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
 * POST /api/auth/admin-otp/verify
 *
 * Step 2 of the admin two-factor gate. Checks the submitted 6-digit code
 * against the newest outstanding hash with a maximum of 3 attempts (codes
 * expire 60s after issue). On success a signed httpOnly session cookie is
 * minted for 60 minutes, which middleware and requireAdmin* both enforce.
 */
export async function POST(request: Request) {
  try {
    const user = await syncDbUser();
    if (!user) throw new AuthError(401, 'Authentication required');
    if (user.role !== 'ADMIN') throw new AuthError(403, 'Administrative clearance required');
    if (!user.email) throw new AuthError(400, 'Account has no email address on file.');
    const email = normalizeOtpEmail(user.email);

    const body = (await request.json().catch(() => ({}))) as {
      code?: unknown;
      next?: unknown;
    };

    if (!isWellFormedOtpCode(body.code)) {
      return NextResponse.json({ error: 'Enter the 6-digit code.' }, { status: 400 });
    }
    const code = body.code;

    const limit = rateLimit(clientKey(request, `admin-otp:verify:${email}`), {
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
      return NextResponse.json(
        { error: 'No active code. Request a new one.', code: 'not_found' },
        { status: 400 },
      );
    }

    if (pending.expiresAt.getTime() <= now.getTime()) {
      await prisma.adminOtp.update({
        where: { id: pending.id },
        data: { consumedAt: now },
      });
      return NextResponse.json(
        { error: 'Code expired. Request a new one.', code: 'expired' },
        { status: 400 },
      );
    }

    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.adminOtp.update({
        where: { id: pending.id },
        data: { consumedAt: now },
      });
      return NextResponse.json(
        { error: 'Too many attempts. Request a new code.', code: 'too_many_attempts' },
        { status: 400 },
      );
    }

    const matches = await verifyOtpHash({
      storedHash: pending.codeHash,
      email,
      code,
      pepper: getOtpPepper(),
    });

    if (!matches) {
      const attempts = pending.attempts + 1;
      const burned = attempts >= OTP_MAX_ATTEMPTS;
      await prisma.adminOtp.update({
        where: { id: pending.id },
        data: { attempts, ...(burned ? { consumedAt: now } : {}) },
      });
      await writeAudit({
        actorId: user.id,
        actorRole: 'ADMIN',
        action: 'ADMIN_OTP_FAILED',
        entityType: 'AdminOtp',
        entityId: email,
        details: { attempts, burned },
        request,
      }).catch(() => undefined);
      return NextResponse.json(
        {
          error: burned ? 'Too many attempts. Request a new code.' : 'Incorrect code.',
          code: burned ? 'too_many_attempts' : 'incorrect',
          attemptsLeft: Math.max(0, OTP_MAX_ATTEMPTS - attempts),
        },
        { status: 400 },
      );
    }

    // Success: burn every outstanding code, then mint the verified session.
    await prisma.adminOtp.updateMany({
      where: { email, consumedAt: null },
      data: { consumedAt: now },
    });

    const rawNext = typeof body.next === 'string' ? body.next : '';
    const next =
      rawNext.startsWith('/dashboard/admin') && !rawNext.startsWith('//')
        ? rawNext
        : '/dashboard/admin';

    const token = await signAdminOtpSession({ email, secret: getOtpSessionSecret() });

    await writeAudit({
      actorId: user.id,
      actorRole: 'ADMIN',
      action: 'ADMIN_OTP_VERIFIED',
      entityType: 'AdminOtp',
      entityId: email,
      details: { channel: 'whatsapp' },
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
