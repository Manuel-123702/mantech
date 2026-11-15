import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuickPostClient } from './quick-post-client';

export const metadata: Metadata = {
  title: 'Post a Job or Internship Free — MANTECH Nexus',
  description:
    'Publish a job or internship in Cameroon in seconds. Upload a flyer, paste a WhatsApp forward, or share an external link. 100% Free National Launch Access.',
};

export default function PostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070d18] flex items-center justify-center text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <QuickPostClient />
    </Suspense>
  );
}

