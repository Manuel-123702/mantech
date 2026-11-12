import { cookies } from 'next/headers';
import { msg } from '@lingui/core/macro';
import { translateMetadata } from '@/i18n/metadata';
import { redirect } from '@/i18n/redirect';
import { syncDbUser } from '@/lib/authz';
import { ADMIN_OTP_COOKIE, getOtpSessionSecret, verifyAdminOtpSession } from '@/lib/admin-otp';
import { VerifyAdminOtpClient } from './verify-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: translateMetadata(locale, msg({ message: 'Admin Verification', comment: 'Browser title of the administrator verification page' })) };
}

/**
 * Second-factor gate for the admin dashboard.
 *
 * The admin signs in normally through Clerk (email + password), then this
 * page collects the 6-digit code delivered to their WhatsApp. Middleware and
 * requireAdminDashboard both refuse /dashboard/admin until the signed cookie
 * minted here exists. The page itself lives OUTSIDE /dashboard/admin/* so the
 * admin layout cannot lock the door behind its own key.
 */
export default async function AdminVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith('/dashboard/admin') && !next.startsWith('//')
      ? next
      : '/dashboard/admin';
  redirect(safeNext);
}
