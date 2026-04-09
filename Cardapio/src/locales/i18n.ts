import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { defaultNS, resources } from '@/locales/resources'

void i18n.use(initReactI18next).init({
  resources,
  lng: 'ptBr',
  fallbackLng: 'en',
  defaultNS,
  ns: [defaultNS],
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
