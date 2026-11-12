import { Trans } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import { translateMetadata } from '@/i18n/metadata';
import type { Metadata } from 'next';
import { LocaleLink as Link } from '@/components/shared/locale-link';
import { ShieldAlert, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { APP_CONFIG } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: translateMetadata(locale, msg({ message: 'Account suspended | MANTECH Nexus', comment: 'Browser title shown for a suspended account page' })),
    robots: { index: false, follow: false },
  };
}

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <Link href="/" className="inline-block">
          <Logo size={80} />
        </Link>

        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <ShieldAlert className="h-8 w-8 text-red-600" aria-hidden />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900"><Trans comment="page h1 visible text">Your account has been suspended</Trans></h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          <Trans comment="page p visible text">A MANTECH administrator has suspended this account, so you can no longer use your
          dashboard, apply to internships, or post opportunities. This usually happens after a
          review of activity that breaks our community rules.
        </Trans></p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          <Trans comment="page p visible text">If you believe this is a mistake, contact our team and we will review your account.
        </Trans></p>

        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <a
            href={`https://wa.me/${(APP_CONFIG.contacts.whatsapp || '').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> <Trans comment="page a visible text">Contact us on WhatsApp
          </Trans></a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" aria-hidden /> <Trans comment="page Link visible text">Email support
          </Trans></Link>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> <Trans comment="page Link visible text">Back to MANTECH Nexus
          </Trans></Link>
        </div>
      </div>
    </div>
  );
}
