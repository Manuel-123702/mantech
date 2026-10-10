'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CvDownloadButtonProps {
  cvId: string;
  internProfileId: string;
}

export function CvDownloadButton({ cvId }: CvDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const downloadWindow = window.open('', '_blank');
    if (!downloadWindow) {
      setError('Allow pop-ups for this site to open the CV securely.');
      setLoading(false);
      return;
    }
    downloadWindow.opener = null;

    try {
      const res = await fetch(`/api/cv/${cvId}/access`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not access this CV.');
      }
      const url = data.signedUrl || data.url;
      if (!url) throw new Error('The CV access service returned no download URL.');
      downloadWindow.location.replace(url);
    } catch (downloadError) {
      downloadWindow.close();
      setError(downloadError instanceof Error ? downloadError.message : 'Could not access this CV.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {loading ? 'Preparing...' : 'Download CV'}
      </Button>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
