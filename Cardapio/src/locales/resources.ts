import commonEn from '@/locales/en/common'
import commonPtBr from '@/locales/ptBr/common'

export const defaultNS = 'common'

export const resources = {
  en: {
    common: commonEn,
  },
  ptBr: {
    common: commonPtBr,
  },
} as const

export type AppLanguage = keyof typeof resources
