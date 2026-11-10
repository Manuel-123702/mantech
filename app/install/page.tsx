import type { Metadata } from 'next';
import { InstallClient } from './install-client';

export const metadata: Metadata = {
  title: 'Download MANTECH Nexus Mobile App (PWA)',
  description:
    'Download and install the official MANTECH Nexus mobile app on Android, iPhone, Windows, and Mac for fast access to internships and job alerts across Cameroon.',
};

export default function InstallPage() {
  return <InstallClient />;
}

