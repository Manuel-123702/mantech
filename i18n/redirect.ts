import { headers } from 'next/headers'
import { redirect as nextRedirect } from 'next/navigation'
import { resolveLocale } from './locales'
import { localePath } from './navigation'

export async function redirect(path: string): Promise<never> {
  const requestHeaders = await headers()
  const locale = resolveLocale(requestHeaders.get('x-mantech-locale'))
  const currentUrl = requestHeaders.get('x-mantech-url')
  const destination = new URL(localePath(path, locale), 'http://mantech.local')
  if (currentUrl) {
    const source = new URL(currentUrl, 'http://mantech.local')
    for (const [key, value] of source.searchParams) {
      if (!destination.searchParams.has(key)) destination.searchParams.append(key, value)
    }
  }
  nextRedirect(`${destination.pathname}${destination.search}${destination.hash}`)
}
