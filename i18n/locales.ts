export const sourceLocale = 'en'
export const locales = ['en', 'fr-FR'] as const
export type Locale = (typeof locales)[number]

export function resolveLocale(raw: string | undefined | null): Locale {
  if (!raw) return sourceLocale
  if ((locales as readonly string[]).includes(raw)) return raw as Locale
  const base = raw.split('-')[0]
  if ((locales as readonly string[]).includes(base)) return base as Locale
  return locales.find((locale) => locale.split('-')[0] === base) ?? sourceLocale
}

const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi'])

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return RTL_LOCALES.has(locale.split('-')[0]) ? 'rtl' : 'ltr'
}

const displayNames = new Map<string, Intl.DisplayNames>()

export function localeDisplayName(locale: string, displayIn: string = locale): string {
  let names = displayNames.get(displayIn)
  if (!names) {
    names = new Intl.DisplayNames([displayIn], { type: 'language' })
    displayNames.set(displayIn, names)
  }
  return names.of(locale) ?? locale
}

export const DEFAULT_CURRENCY = 'XAF'

export type DatePreset = 'short' | 'medium' | 'long'

export const DATE_PRESETS: Record<DatePreset, Intl.DateTimeFormatOptions> = {
  short: { dateStyle: 'short' },
  medium: { dateStyle: 'medium' },
  long: { dateStyle: 'long' },
}
