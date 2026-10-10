import { requirePlacementMode } from '@/lib/university-dashboard';
import { SettingsView } from '@/components/dashboard/settings-view';

export default async function UniversitySettingsPage() {
  const { user, organization } = await requirePlacementMode();
  if (!organization) return null;

  return <SettingsView orgType="UNIVERSITY" organization={organization} userId={user.id} />;
}
