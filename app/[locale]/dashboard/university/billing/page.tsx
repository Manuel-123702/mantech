import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';
import { BillingView } from '@/components/dashboard/billing-view';

export default async function UniversityBillingPage() {
  const { organization } = await requireUniversityRecruiterMode();
  if (!organization) return null;

  return <BillingView organization={organization} />;
}
