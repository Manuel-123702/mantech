import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';
import { AnalyticsView } from '@/components/dashboard/analytics-view';

export default async function UniversityRecruiterAnalyticsPage() {
  const { organization } = await requireUniversityRecruiterMode();
  if (!organization) return null;

  return (
    <AnalyticsView
      organizationId={organization.id}
      subtitle="Recruitment insights for internships hosted by your institution."
    />
  );
}
