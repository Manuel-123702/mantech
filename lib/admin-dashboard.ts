import { redirect } from '@/i18n/redirect';
import { AuthError, syncDbUser } from '@/lib/authz';
import { isAdminEmail } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function requireAdminDashboard() {
  const user = await syncDbUser();
  if (!user) redirect('/sign-in?redirect_url=/dashboard/admin');
  if (user.status === 'suspended') redirect('/suspended');
  if (user.role !== 'ADMIN') {
    if (isAdminEmail(user.email)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      user.role = 'ADMIN';
    } else {
      redirect('/dashboard');
    }
  }
  return { user };
}

export async function requireAdminUser() {
  const user = await syncDbUser();
  if (!user) throw new AuthError(401, 'Authentication required');
  if (user.status === 'suspended') {
    throw new AuthError(403, 'Your account has been suspended.');
  }
  if (user.role !== 'ADMIN') {
    if (isAdminEmail(user.email)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      user.role = 'ADMIN';
    } else {
      throw new AuthError(403, 'Administrative clearance required');
    }
  }
  return user;
}
