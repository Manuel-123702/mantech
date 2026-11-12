import ApplicationsPage from '@/components/dashboard/applications-page';
import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';

export default async function Page() {
  await requireUniversityRecruiterMode();
  return <ApplicationsPage basePath="/dashboard/university" />;
}
