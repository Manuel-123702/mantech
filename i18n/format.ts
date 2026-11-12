import { useMemo } from 'react'
import { useLingui } from '@lingui/react/macro'
import { DEFAULT_CURRENCY, DATE_PRESETS, type DatePreset } from './locales'

export type DateInput = Date | number | string

export type Formatters = {
  money(amount: number, currency?: string): string
  number(value: number, opts?: Intl.NumberFormatOptions): string
  percent(value: number): string
  compact(value: number): string
  unit(value: number, unit: string): string
  date(value: DateInput, preset?: DatePreset): string
  time(value: DateInput): string
  dateTime(value: DateInput): string
  relativeTime(value: DateInput, now?: DateInput): string
  list(items: string[], type?: 'and' | 'or'): string
}

export function formatLocale(uiLocale: string): string {
  return uiLocale
}

const memo = new Map<string, unknown>()

function cached<T>(key: string, create: () => T): T {
  let formatter = memo.get(key) as T | undefined
  if (!formatter) {
    formatter = create()
    memo.set(key, formatter)
  }
  return formatter
}

const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value))

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['second', 1000],
  ['minute', 60_000],
  ['hour', 3_600_000],
  ['day', 86_400_000],
  ['week', 604_800_000],
  ['month', 2_629_746_000],
  ['year', 31_556_952_000],
]

function pickRelativeUnit(deltaMs: number): [Intl.RelativeTimeFormatUnit, number] {
  const abs = Math.abs(deltaMs)
  for (let index = UNITS.length - 1; index >= 0; index--) {
    const [unit, ms] = UNITS[index]
    if (abs >= ms || index === 0) return [unit, Math.round(deltaMs / ms)]
  }
  return ['second', 0]
}

export function createFormatters(uiLocale: string): Formatters {
  const locale = formatLocale(uiLocale)
  const number = (key: string, options: Intl.NumberFormatOptions) =>
    cached(`n:${locale}:${key}`, () => new Intl.NumberFormat(locale, options))
  const date = (key: string, options: Intl.DateTimeFormatOptions) =>
    cached(`d:${locale}:${key}`, () => new Intl.DateTimeFormat(locale, options))

  return {
    money: (amount, currency = DEFAULT_CURRENCY) =>
      number(`currency:${currency}`, { style: 'currency', currency }).format(amount),
    number: (value, options) =>
      options
        ? new Intl.NumberFormat(locale, options).format(value)
        : number('decimal', { style: 'decimal' }).format(value),
    percent: (value) => number('percent', { style: 'percent' }).format(value),
    compact: (value) => number('compact', { notation: 'compact' }).format(value),
    unit: (value, unit) => number(`unit:${unit}`, { style: 'unit', unit }).format(value),
    date: (value, preset = 'medium') =>
      date(`preset:${preset}`, DATE_PRESETS[preset]).format(toDate(value)),
    time: (value) => date('time', { timeStyle: 'short' }).format(toDate(value)),
    dateTime: (value) =>
      date('date-time', { dateStyle: 'medium', timeStyle: 'short' }).format(toDate(value)),
    relativeTime: (value, now) => {
      const from = now === undefined ? Date.now() : toDate(now).getTime()
      const [unit, amount] = pickRelativeUnit(toDate(value).getTime() - from)
      return cached(
        `r:${locale}`,
        () => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
      ).format(amount, unit)
    },
    list: (items, type = 'and') =>
      cached(
        `l:${locale}:${type}`,
        () =>
          new Intl.ListFormat(locale, {
            style: 'long',
            type: type === 'or' ? 'disjunction' : 'conjunction',
          }),
      ).format(items),
  }
}

export function useFormatters(): Formatters {
  const { i18n } = useLingui()
  return useMemo(() => createFormatters(i18n.locale), [i18n.locale])
}

export const getFormatters = createFormatters
