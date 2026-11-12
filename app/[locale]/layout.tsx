import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import { msg } from '@lingui/core/macro'
import { setI18n } from '@lingui/react/server'
import { AuthProvider } from '@/lib/clerk'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { LoadingScreen } from '@/components/shared/loading-screen'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import { ScrollToTop } from '@/components/shared/scroll-to-top'
import { PWAInstallPrompt } from '@/components/shared/pwa-install-prompt'
import { LocaleDocumentAttributes } from '@/components/shared/locale-document-attributes'
import { Toaster } from '@/components/ui/sonner'
import { locales } from '@/i18n/locales'
import { getI18nInstance } from '../appRouterI18n'
import { LinguiClientProvider } from '../LinguiClientProvider'
import { translateMetadata } from '@/i18n/metadata'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: {
      absolute: translateMetadata(locale, msg({ message: 'MANTECH Nexus — Internships in Cameroon', comment: 'Default browser title for the MANTECH internship marketplace' })),
    },
    description: translateMetadata(locale, msg({ message: 'Find verified internships in Cameroon — Douala, Yaoundé, Buea. Verified companies, universities, real placements, Intern Passport.', comment: 'Default search description for the MANTECH marketplace' })),
    openGraph: {
      title: translateMetadata(locale, msg({ message: 'MANTECH Nexus — Internships in Cameroon', comment: 'Open Graph title used when the site is shared' })),
      description: translateMetadata(locale, msg({ message: 'Verified internships, companies and universities across Cameroon — Douala, Yaoundé, Buea.', comment: 'Open Graph description used when the site is shared' })),
    },
    twitter: {
      title: translateMetadata(locale, msg({ message: 'MANTECH Nexus — Internships in Cameroon', comment: 'Twitter card title for the MANTECH website' })),
      description: translateMetadata(locale, msg({ message: 'Verified internships & placements across Cameroon.', comment: 'Twitter card description for the MANTECH website' })),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()

  const i18n = getI18nInstance(locale)
  setI18n(i18n)

  return (
    <LinguiClientProvider initialLocale={locale} initialMessages={i18n.messages}>
      <LocaleDocumentAttributes />
      <AuthProvider>
        <LoadingScreen />
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
        <PWAInstallPrompt />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </LinguiClientProvider>
  )
}
