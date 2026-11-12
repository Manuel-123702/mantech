import './globals.css';
import type { Metadata, Viewport } from 'next';
import { SITE_URL, organizationJsonLd } from '@/lib/seo';
import { getDirection, resolveLocale, sourceLocale } from '@/i18n/locales';
import { getI18nInstance } from './appRouterI18n';
import { setI18n } from '@lingui/react/server';
import { headers } from 'next/headers';
import { LinguiClientProvider } from './LinguiClientProvider';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { msg } from '@lingui/core/macro';

const inter = { variable: 'font-sans' };
const sora = { variable: 'font-heading' };
const sourceI18n = getI18nInstance(sourceLocale);

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: sourceI18n._(msg({ message: 'MANTECH Nexus — Internships in Cameroon', comment: 'Default browser title for the MANTECH internship marketplace' })),
    template: sourceI18n._(msg({ message: '{page} | MANTECH Nexus', comment: 'Browser title pattern; page is replaced by the current page title' }), { page: '%s' }),
  },
  description: sourceI18n._(msg({ message: 'Find verified internships in Cameroon — Douala, Yaoundé, Buea. Verified companies, universities, real placements, Intern Passport.', comment: 'Default search description for the MANTECH marketplace' })),
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: sourceI18n._(msg({ message: 'MANTECH Nexus', comment: 'Installed app name shown by the operating system' })),
  },
  keywords: [
    'MANTECH',
    'internship Cameroon',
    'internship Douala',
    'internship Yaoundé',
    'IT internships',
    'student internships',
    'enterprise internship platform',
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: sourceI18n._(msg({ message: 'MANTECH Nexus — Internships in Cameroon', comment: 'Open Graph title used when the site is shared' })),
    description: sourceI18n._(msg({ message: 'Verified internships, companies and universities across Cameroon — Douala, Yaoundé, Buea.', comment: 'Open Graph description used when the site is shared' })),
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: sourceI18n._(msg({ message: 'MANTECH Nexus', comment: 'Site name attached to shared links' })),
  },
  twitter: {
    card: 'summary_large_image',
    title: sourceI18n._(msg({ message: 'MANTECH Nexus — Internships in Cameroon', comment: 'Twitter card title for the MANTECH website' })),
    description: sourceI18n._(msg({ message: 'Verified internships & placements across Cameroon.', comment: 'Twitter card description for the MANTECH website' })),
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const locale = resolveLocale(requestHeaders.get('x-mantech-locale'));
  const i18n = getI18nInstance(locale);
  setI18n(i18n);

  return (
    <html lang={locale} dir={getDirection(locale)} className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-foreground">
        <LinguiClientProvider initialLocale={locale} initialMessages={i18n.messages}>
          <LanguageSwitcher />
          {children}
        </LinguiClientProvider>
      </body>
    </html>
  );
}
