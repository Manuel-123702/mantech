import { locales, type Locale } from './locales'

export function stripLocalePrefix(pathname: string): { locale: Locale | null; pathname: string } {
  const suffixIndex = pathname.search(/[?#]/)
  const pathOnly = suffixIndex < 0 ? pathname : pathname.slice(0, suffixIndex)
  const suffix = suffixIndex < 0 ? '' : pathname.slice(suffixIndex)
  const segments = pathOnly.split('/')
  const first = segments[1]
  if (first && (locales as readonly string[]).includes(first)) {
    const rest = `/${segments.slice(2).join('/')}`
    return {
      locale: first as Locale,
      pathname: `${rest === '/' ? '/' : rest.replace(/\/$/, '')}${suffix}`,
    }
  }
  return { locale: null, pathname }
}

export function localePath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const { pathname, locale: existingLocale } = stripLocalePrefix(path)
  const pathOnly = pathname.split(/[?#]/, 1)[0] || '/'
  const suffix = pathname.slice(pathOnly.length)
  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  const prefix = `/${locale}${normalized === '/' ? '' : normalized}`
  return `${prefix}${suffix}`
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const stripped = stripLocalePrefix(pathname).pathname
  const pathOnly = stripped.split(/[?#]/, 1)[0] || '/'
  const suffix = stripped.slice(pathOnly.length)
  return `${localePath(pathOnly, targetLocale)}${suffix}`
}

export function getActiveLocale(pathname: string): Locale {
  return stripLocalePrefix(pathname).locale ?? sourceLocale
}
