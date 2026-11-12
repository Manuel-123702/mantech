import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';
import { SettingsView } from '@/components/dashboard/settings-view';

export default async function UniversityRecruiterSettingsPage() {
  const { user, organization } = await requireUniversityRecruiterMode();
  if (!organization) return null;

  return <SettingsView orgType="UNIVERSITY" organization={organization} userId={user.id} />;
}
