import { requireUniversityRecruiterMode } from '@/lib/university-dashboard';
import { msg } from '@lingui/core/macro';
import { AnalyticsView } from '@/components/dashboard/analytics-view';

export default async function UniversityRecruiterAnalyticsPage() {
  const { organization } = await requireUniversityRecruiterMode();
  if (!organization) return null;

  return (
    <AnalyticsView
      organizationId={organization.id}
      subtitle={msg({ message: 'Recruitment insights for internships hosted by your institution.', comment: 'Subtitle on the university recruiter analytics dashboard' })}
    />
  );
}
