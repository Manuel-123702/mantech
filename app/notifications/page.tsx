import { requireUser } from '@/lib/authz';
import { NotificationsView } from '@/components/dashboard/notifications-view';

export default async function NotificationsPage() {
  const user = await requireUser();
  return <NotificationsView userId={user.id} />;
}
