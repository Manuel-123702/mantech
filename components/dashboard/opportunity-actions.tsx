'use client';
import { Trans } from '@lingui/react/macro';


import { useState } from 'react';
import { useRouter } from '@/i18n/navigation.hooks';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { Button } from '@/components/ui/button';

export function OpportunityActions({
  id,
  status,
  opportunitiesBase,
}: {
  id: string;
  status: string;
  opportunitiesBase: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(moderationStatus: string) {
    setLoading(true);
    await fetch(`/api/opportunities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moderationStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`${opportunitiesBase}/${id}/edit`}>
        <Button size="sm" variant="outline"><Trans comment="opportunity-actions Button visible text">Edit</Trans></Button>
      </Link>
      {status === 'DRAFT' && (
        <Button size="sm" disabled={loading} onClick={() => setStatus('PENDING_REVIEW')}><Trans comment="opportunity-actions Button visible text">Submit for review</Trans></Button>
      )}
      {status !== 'ARCHIVED' && (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => setStatus('ARCHIVED')}><Trans comment="opportunity-actions Button visible text">Archive</Trans></Button>
      )}
      {status === 'PUBLISHED' && (
        <Button size="sm" variant="ghost" disabled={loading} onClick={() => setStatus('EXPIRED')}><Trans comment="opportunity-actions Button visible text">Close</Trans></Button>
      )}
    </div>
  );
}
