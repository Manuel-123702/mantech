import { setupI18n, type I18n } from '@lingui/core'
import { messages as englishMessages } from '../locales/en/messages'
import { messages as frenchMessages } from '../locales/fr-FR/messages'

const catalogs = {
  en: englishMessages,
  'fr-FR': frenchMessages,
}

const instances = new Map<string, I18n>()

export function getI18nInstance(locale: string): I18n {
  let instance = instances.get(locale)
  if (!instance) {
    instance = setupI18n()
    instance.load(locale, catalogs[locale as keyof typeof catalogs])
    instance.activate(locale)
    instances.set(locale, instance)
  }
  return instance
}
