import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { SettingsView } from '@/components/dashboard/settings-view';

export default async function CompanyOrganizationPage() {
  const { user, organization } = await requireCompanyDashboard();
  if (!organization) return null;

  return <SettingsView orgType="COMPANY" organization={organization} userId={user.id} />;
}
