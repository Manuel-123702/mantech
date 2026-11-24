import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AppProviders } from './providers';
import { SITE_URL, organizationJsonLd } from '@/lib/seo';

const inter = { variable: 'font-sans' };
const sora = { variable: 'font-heading' };

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MANTECH Nexus — Jobs & Internships in Cameroon',
    template: '%s | MANTECH Nexus',
  },
  description:
    'Find verified jobs and internships in Cameroon — Douala, Yaoundé, Bafoussam, Garoua. Verified recruitment, visual flyers, career links, and talent placement.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MANTECH Nexus',
  },
  keywords: [
    'MANTECH',
    'jobs Cameroon',
    'internship Cameroon',
    'recruitment Cameroon',
    'emplois Cameroun',
    'stages Douala',
    'jobs Yaoundé',
    'IT jobs Cameroon',
    'visual notice board',
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'MANTECH Nexus — Jobs & Internships in Cameroon',
    description:
      'Verified jobs, internships, recruitment flyers and career links across Cameroon — Douala, Yaoundé, Buea, Bafoussam.',
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'MANTECH Nexus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANTECH Nexus — Jobs & Internships in Cameroon',
    description: 'Verified jobs, internships & recruitment across Cameroon.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
