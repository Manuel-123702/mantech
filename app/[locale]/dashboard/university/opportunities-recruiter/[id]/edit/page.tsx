import OpportunityEditPage from '@/components/dashboard/opportunity-edit-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <OpportunityEditPage backHref="/dashboard/university/opportunities-recruiter" />;
}
