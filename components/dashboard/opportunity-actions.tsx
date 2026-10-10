'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
        <Button size="sm" variant="outline">Edit</Button>
      </Link>
      {status === 'DRAFT' && (
        <Button size="sm" disabled={loading} onClick={() => setStatus('PENDING_REVIEW')}>Submit for review</Button>
      )}
      {status !== 'ARCHIVED' && (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => setStatus('ARCHIVED')}>Archive</Button>
      )}
      {status === 'PUBLISHED' && (
        <Button size="sm" variant="ghost" disabled={loading} onClick={() => setStatus('EXPIRED')}>Close</Button>
      )}
    </div>
  );
}
