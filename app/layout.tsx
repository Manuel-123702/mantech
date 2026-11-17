import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { AuthProvider } from '@/lib/clerk';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { WhatsAppFloat } from '@/components/shared/whatsapp-float';
import { ScrollToTop } from '@/components/shared/scroll-to-top';
import { PWAInstallPrompt } from '@/components/shared/pwa-install-prompt';
import { OfflineDetector } from '@/components/shared/offline-detector';
import { Toaster } from '@/components/ui/sonner';
import { SITE_URL, organizationJsonLd } from '@/lib/seo';

// Self-hosted via next/font — zero Google CDN round-trip, fonts served from
// the same origin as the app. Subsetting to Latin reduces download by ~60%.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  preload: false, // Only needed for headings, defer load
  weight: ['600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MANTECH Nexus — Internships in Cameroon',
    template: '%s | MANTECH Nexus',
  },
  description:
    'Find verified internships in Cameroon — Douala, Yaoundé, Buea. Verified companies, universities, real placements, Intern Passport.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MANTECH Nexus',
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
    title: 'MANTECH Nexus — Internships in Cameroon',
    description:
      'Verified internships, companies and universities across Cameroon — Douala, Yaoundé, Buea.',
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'MANTECH Nexus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANTECH Nexus — Internships in Cameroon',
    description: 'Verified internships & placements across Cameroon.',
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
        <AuthProvider>
          <LoadingScreen />
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <ScrollToTop />
          <PWAInstallPrompt />
          <OfflineDetector />
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
