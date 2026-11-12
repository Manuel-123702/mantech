import CandidatesPage from '@/components/dashboard/candidates-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <CandidatesPage />;
}
