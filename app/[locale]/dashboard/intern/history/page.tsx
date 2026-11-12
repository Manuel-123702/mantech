import { requireUser } from '@/lib/authz';
import { msg } from '@lingui/core/macro';
import { translateMetadata } from '@/i18n/metadata';
import { loadInternHistory } from '@/lib/intern-history-data';
import { InternHistoryTimeline } from '@/components/intern/intern-history-timeline';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: translateMetadata(locale, msg({ message: 'My Journey | MANTECH Nexus', comment: 'Browser title of an intern’s activity history' })),
    robots: { index: false, follow: false },
  };
}

export default async function InternHistoryPage() {
  const user = await requireUser();

  const entries = await loadInternHistory(user.id);

  return (
    <div className="space-y-5">
      <InternHistoryTimeline entries={entries} />
    </div>
  );
}
