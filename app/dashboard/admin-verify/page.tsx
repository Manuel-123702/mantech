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
  const user = await syncDbUser();
  if (!user) {
    redirect('/sign-in?redirect_url=' + encodeURIComponent('/dashboard/admin-verify'));
  }
  if (user.role !== 'ADMIN') redirect('/dashboard');

  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith('/dashboard/admin') && !next.startsWith('//')
      ? next
      : '/dashboard/admin';

  // Already verified within the last 60 minutes? Skip straight through.
  let verified = false;
  try {
    const token = (await cookies()).get(ADMIN_OTP_COOKIE)?.value;
    const session = await verifyAdminOtpSession(token, { secret: getOtpSessionSecret() });
    verified = Boolean(session && session.email === user.email.trim().toLowerCase());
  } catch {
    verified = false;
  }
  if (verified) redirect(safeNext);

  return <VerifyAdminOtpClient next={safeNext} />;
}
