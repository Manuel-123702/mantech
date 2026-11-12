'use client'

import { useCallback } from 'react'
import { useParams, usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { resolveLocale } from './locales'
import { localePath } from './navigation'

export function useLocale() {
  const params = useParams()
  return resolveLocale(typeof params?.locale === 'string' ? params.locale : null)
}

export function useLocalePath() {
  const locale = useLocale()
  return useCallback((path: string) => localePath(path, locale), [locale])
}

export function usePathname() {
  const pathname = useNextPathname() ?? '/'
  const localePathname = pathname.replace(/^\/(?:en|fr-FR)(?=\/|$)/, '') || '/'
  return localePathname
}

export function useRouter() {
  const router = useNextRouter()
  const locale = useLocale()
  const localized = useCallback((href: string) => localePath(href, locale), [locale])

  return {
    ...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) =>
      router.push(localized(href), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
      router.replace(localized(href), options),
    prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) =>
      router.prefetch(localized(href), options),
  }
}
