import type { LinguiConfig } from '@lingui/conf'
import { locales, sourceLocale } from './i18n/locales'

const config: LinguiConfig = {
  sourceLocale,
  locales: [...locales],
  fallbackLocales: { default: sourceLocale },
  catalogs: [
    {
      path: 'locales/{locale}/messages',
      include: ['app', 'components', 'lib'],
    },
  ],
  macro: { jsxPlaceholderAttribute: '_t' },
}

export default config
