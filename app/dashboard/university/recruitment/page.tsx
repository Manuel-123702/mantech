import RecruitmentPage from '@/components/dashboard/recruitment-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <RecruitmentPage basePath="/dashboard/university" />;
}
