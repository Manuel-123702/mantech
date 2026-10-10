import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/authz';
import { AuthError } from '@/lib/authz-policy';
import { dashboardsForRoles, resolveRoles, type PlatformRole } from '@/lib/roles';

export const dynamic = 'force-dynamic';

/**
 * Tells the website who the signed-in person is and what they may open.
 *
 * The browser cannot look at the saved records directly, and the account
 * settings alone cannot answer the question (an owner is recognised by the
 * email list in the .env file). So the dashboard buttons ask the server, which
 * means what the screen shows always matches what the site actually allows.
 */
export async function GET() {
  try {
    const user = await requireUser();
    const role = user.role as PlatformRole;

    // Someone listed as both a company and a university holds two roles, so we
    // ask for every role their email matches and send back the union of those
    // dashboards. The saved role is included so an onboarded account keeps
    // working even when it is not on a list.
    const roles = resolveRoles(user.email, role);

    return NextResponse.json({
      role,
      roleKey: role.toLowerCase(),
      roles: roles.map((entry) => entry.toLowerCase()),
      dashboards: dashboardsForRoles(roles),
      email: user.email,
    });
  } catch (error) {
    // Being signed out is normal while the site is still waking up, so we say
    // "please sign in" instead of showing a scary error in the console.
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[api/me] unexpected error');
    return NextResponse.json(
      { error: 'We could not check your access just now. Please try again.' },
      { status: 500 },
    );
  }
}