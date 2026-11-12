import { requireCompanyDashboard } from '@/lib/company-dashboard';
import { BillingView } from '@/components/dashboard/billing-view';

export default async function CompanyBillingPage() {
  const { organization } = await requireCompanyDashboard();
  if (!organization) return null;

  return (
    <BillingView
      organization={{
        id: organization.id,
        packageCode: organization.packageCode,
        verificationStatus: organization.verificationStatus,
        members: organization.members.map((member) => ({ id: member.id })),
      }}
    />
  );
}
