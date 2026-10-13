import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { AuthProvider } from '@/lib/clerk';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { WhatsAppFloat } from '@/components/shared/whatsapp-float';
import { ScrollToTop } from '@/components/shared/scroll-to-top';
import { Toaster } from '@/components/ui/sonner';
import { SITE_URL, organizationJsonLd } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MANTECH Nexus — Internships in Cameroon',
    template: '%s | MANTECH Nexus',
  },
  description:
    'Find verified internships in Cameroon — Douala, Yaoundé, Buea. Verified companies, universities, real placements, Intern Passport.',
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
      <body className="font-sans antialiased">
        <AuthProvider>
          <LoadingScreen />
          <Navbar />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <ScrollToTop />
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
