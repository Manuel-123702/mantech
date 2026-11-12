import InterviewsPage from '@/components/dashboard/interviews-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <InterviewsPage basePath="/dashboard/university" />;
}
