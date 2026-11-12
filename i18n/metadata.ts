import type { MessageDescriptor } from '@lingui/core'
import { getI18nInstance } from '@/app/appRouterI18n'
import { resolveLocale } from './locales'

export function translateMetadata(
  locale: string,
  message: MessageDescriptor,
  values?: Record<string, unknown>,
): string {
  return getI18nInstance(resolveLocale(locale))._(message, values)
}
