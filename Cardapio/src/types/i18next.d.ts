import 'i18next'

import type { defaultNS, resources } from '@/locales/resources'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['en']
  }
}
