import type { Metadata } from 'next';
import { msg } from '@lingui/core/macro';
import { translateMetadata } from '@/i18n/metadata';
import { InstallClient } from './install-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: translateMetadata(locale, msg({ message: 'Download MANTECH Nexus Mobile App (PWA)', comment: 'Browser title of the mobile app installation page' })),
    description: translateMetadata(locale, msg({ message: 'Download and install the official MANTECH Nexus mobile app on Android, iPhone, Windows, and Mac for fast access to internships and job alerts across Cameroon.', comment: 'Search description of the mobile app installation page' })),
  };
}

export default function InstallPage() {
  return <InstallClient />;
}
