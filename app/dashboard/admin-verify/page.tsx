import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { syncDbUser } from '@/lib/authz';
import { ADMIN_OTP_COOKIE, getOtpSessionSecret, verifyAdminOtpSession } from '@/lib/admin-otp';
import { VerifyAdminOtpClient } from './verify-client';

export const metadata = { title: 'Admin Verification' };

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
