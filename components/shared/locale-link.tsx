'use client'

import NextLink from 'next/link'
import { forwardRef } from 'react'
import type { ComponentProps } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { resolveLocale } from '@/i18n/locales'
import { localePath, stripLocalePrefix } from '@/i18n/navigation'

type Props = ComponentProps<typeof NextLink>

export const LocaleLink = forwardRef<HTMLAnchorElement, Props>(function LocaleLink(
  { href, ...props },
  ref,
) {
  const params = useParams()
  const pathname = usePathname() ?? '/'
  const locale = resolveLocale(
    typeof params?.locale === 'string' ? params.locale : stripLocalePrefix(pathname).locale,
  )
  const localizedHref = typeof href === 'string'
    ? localePath(href, locale)
    : { ...href, pathname: localePath(href.pathname ?? '/', locale) }

  return <NextLink ref={ref} href={localizedHref} {...props} />
})
