import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { WhatsAppFloat } from '@/components/shared/whatsapp-float';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: {
    default: 'MANTECH Nexus — Enterprise Internship Management System',
    template: '%s | MANTECH Nexus',
  },
  description:
    'MANTECH Nexus is a secure, enterprise-grade internship management platform connecting students, companies, and universities across Cameroon. Manage the complete internship lifecycle from discovery to verified completion.',
  keywords: [
    'MANTECH',
    'internship management',
    'Cameroon internships',
    'IT internships',
    'student internships',
    'enterprise internship platform',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'MANTECH Nexus — Enterprise Internship Management System',
    description:
      'Secure, enterprise-grade internship management connecting students, companies, and universities across Cameroon.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANTECH Nexus',
    description: 'Enterprise Internship Management System for Cameroon and beyond.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LoadingScreen />
          <Navbar />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
