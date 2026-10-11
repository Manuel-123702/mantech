import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { syncDbUser } from '@/lib/authz';
import { ADMIN_OTP_COOKIE, getOtpSessionSecret, verifyAdminOtpSession } from '@/lib/admin-otp';
import { VerifyWorkspaceOtpClient } from './verify-client';

export const metadata = { title: 'Verify your workspace', robots: { index: false, follow: false } };

/**
 * Two-factor gate for the Company and University workspaces.
 *
 * Any signed-in member may open these dashboards, but must first prove they
 * control their sign-in inbox. The 6-digit code is emailed on mount; on
 * success the same signed cookie the middleware checks is minted and the user
 * is sent to the workspace they asked for. This page lives OUTSIDE the guarded
 * dashboard prefixes so the dashboard layouts cannot lock their own door.
 */
export default async function WorkspaceVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; area?: string }>;
}) {
  const user = await syncDbUser();
  if (!user) {
    redirect('/sign-in?redirect_url=' + encodeURIComponent('/dashboard/verify'));
  }

  const { next, area } = await searchParams;
  const fallback = area === 'university' ? '/dashboard/university' : '/dashboard/company';
  const safeNext =
    next &&
    (next.startsWith('/dashboard/company') || next.startsWith('/dashboard/university')) &&
    !next.startsWith('//')
      ? next
      : fallback;

  // Already verified within the last 60 minutes? Skip straight through.
  let verified = false;
  try {
    const token = (await cookies()).get(ADMIN_OTP_COOKIE)?.value;
    const session = await verifyAdminOtpSession(token, { secret: getOtpSessionSecret() });
    verified = Boolean(session && session.email === user.email?.trim().toLowerCase());
  } catch {
    verified = false;
  }
  if (verified) redirect(safeNext);

  return <VerifyWorkspaceOtpClient next={safeNext} area={area === 'university' ? 'university' : 'company'} />;
}
