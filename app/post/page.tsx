import type { Metadata } from 'next';
import { QuickPostClient } from './quick-post-client';

export const metadata: Metadata = {
  title: 'Post a Job or Internship Free — MANTECH Nexus',
  description:
    'Publish a job or internship in Cameroon in seconds. Upload a flyer, paste a WhatsApp forward, or share an external link. 100% Free National Launch Access.',
};

export default function PostPage() {
  return <QuickPostClient />;
}

