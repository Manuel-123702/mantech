'use client'

import type { Messages } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { useMemo } from 'react'
import { getI18nInstance } from './appRouterI18n'

export function LinguiClientProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode
  initialLocale: string
  initialMessages: Messages
}) {
  const i18n = useMemo(() => {
    const instance = getI18nInstance(initialLocale)
    instance.load(initialLocale, initialMessages)
    instance.activate(initialLocale)
    return instance
  }, [initialLocale, initialMessages])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
