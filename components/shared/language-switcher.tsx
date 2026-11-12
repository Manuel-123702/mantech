'use client'

import { useLingui } from '@lingui/react/macro'
import { usePathname, useRouter } from 'next/navigation'
import { msg } from '@lingui/core/macro'
import { locales, type Locale } from '@/i18n/locales'
import { stripLocalePrefix, switchLocalePath } from '@/i18n/navigation'
import { useLocale } from '@/i18n/navigation.hooks'

const LOCALE_NAMES: Record<Locale, ReturnType<typeof msg>> = {
  en: msg({ message: 'English', comment: 'Name of English in the language selector' }),
  'fr-FR': msg({ message: 'Français', comment: 'Name of French in the language selector' }),
}

export function LanguageSwitcher() {
  const { t } = useLingui()
  const pathname = usePathname() ?? '/'
  const router = useRouter()
  const localeFromPath = stripLocalePrefix(pathname).locale
  const contextualLocale = useLocale()
  const currentLocale = localeFromPath ?? contextualLocale

  function changeLocale(locale: string) {
    const destination = switchLocalePath(pathname, locale as Locale)
    router.replace(`${destination}${window.location.search}${window.location.hash}`)
  }

  return (
    <label className="fixed right-4 top-[5.25rem] z-[60]">
      <span className="sr-only">{t({ message: 'Language', comment: 'Accessible name for the language selector' })}</span>
      <select
        aria-label={t({ message: 'Language', comment: 'Accessible name for the language selector' })}
        value={currentLocale}
        onChange={(event) => changeLocale(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>{t(LOCALE_NAMES[locale])}</option>
        ))}
      </select>
    </label>
  )
}
