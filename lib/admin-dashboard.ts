import { redirect } from 'next/navigation';
import { AuthError, syncDbUser } from '@/lib/authz';

export async function requireAdminDashboard() {
  const user = await syncDbUser();
  if (!user) redirect('/sign-in?redirect_url=/dashboard/admin');
  if (user.status === 'suspended') redirect('/suspended');
  if (user.role !== 'ADMIN') redirect('/dashboard');
  return { user };
}

export async function requireAdminUser() {
  const user = await syncDbUser();
  if (!user) throw new AuthError(401, 'Authentication required');
  if (user.status === 'suspended') {
    throw new AuthError(403, 'Your account has been suspended.');
  }
  if (user.role !== 'ADMIN') {
    throw new AuthError(403, 'Administrative clearance required');
  }
  return user;
}
