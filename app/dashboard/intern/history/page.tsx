import { requireUser } from '@/lib/authz';
import { loadInternHistory } from '@/lib/intern-history-data';
import { InternHistoryTimeline } from '@/components/intern/intern-history-timeline';

export const metadata = {
  title: 'My Journey | MANTECH Nexus',
  robots: { index: false, follow: false },
};

export default async function InternHistoryPage() {
  const user = await requireUser();

  const entries = await loadInternHistory(user.id);

  return (
    <div className="space-y-5">
      <InternHistoryTimeline entries={entries} />
    </div>
  );
}