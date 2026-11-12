import ApplicationDetailPage from '@/components/dashboard/application-detail-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <ApplicationDetailPage basePath="/dashboard/university" />;
}
