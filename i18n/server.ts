import { getI18n } from '@lingui/react/server'

export function getServerT() {
  const context = getI18n()
  if (!context) throw new Error()
  return context._
}
