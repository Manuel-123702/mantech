import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AuthError, syncDbUser } from '@/lib/authz';
import {
  ADMIN_OTP_COOKIE,
  getOtpSessionSecret,
  verifyAdminOtpSession,
} from '@/lib/admin-otp';

/**
 * Confirms the signed httpOnly 2FA cookie was minted for THIS admin's email
 * and has not expired. Fails closed (returns false) on any configuration
 * problem so a missing pepper can never open the dashboard.
 */
async function hasVerifiedAdminSession(email: string): Promise<boolean> {
  try {
    const token = (await cookies()).get(ADMIN_OTP_COOKIE)?.value;
    const session = await verifyAdminOtpSession(token, { secret: getOtpSessionSecret() });
    return Boolean(session && session.email === email.trim().toLowerCase());
  } catch {
    return false;
  }
}

export async function requireAdminDashboard() {
  const user = await syncDbUser();
  if (!user) redirect('/sign-in?redirect_url=/dashboard/admin');
  if (user.role !== 'ADMIN') redirect('/dashboard');
  if (!(await hasVerifiedAdminSession(user.email))) redirect('/dashboard/admin-verify');
  return { user };
}

export async function requireAdminUser() {
  const user = await syncDbUser();
  if (!user) throw new AuthError(401, 'Authentication required');
  if (user.role !== 'ADMIN') throw new AuthError(403, 'Administrative clearance required');
  if (!(await hasVerifiedAdminSession(user.email))) {
    throw new AuthError(401, 'Admin two-factor verification required.');
  }
  return user;
}
