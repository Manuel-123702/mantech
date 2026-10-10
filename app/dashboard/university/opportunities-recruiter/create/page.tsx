import OpportunityCreatePage from '@/components/dashboard/opportunity-create-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <OpportunityCreatePage backHref="/dashboard/university/opportunities-recruiter" />;
}
