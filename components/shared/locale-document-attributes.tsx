'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getDirection } from '@/i18n/locales'
import { stripLocalePrefix } from '@/i18n/navigation'

export function LocaleDocumentAttributes() {
  const pathname = usePathname() ?? '/'
  const locale = stripLocalePrefix(pathname).locale ?? 'en'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = getDirection(locale)
  }, [locale])

  return null
}
