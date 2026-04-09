import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { defaultNS, resources, type AppLanguage } from '@/locales/resources'

const LANGUAGE_STORAGE_KEY = 'cardapio.language'

function isAppLanguage(value: string): value is AppLanguage {
  return value === 'ptBr' || value === 'en'
}

function resolveLanguage(language: string): AppLanguage {
  if (language.toLowerCase().startsWith('pt')) {
    return 'ptBr'
  }

  return 'en'
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'ptBr'
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)

  if (storedLanguage && isAppLanguage(storedLanguage)) {
    return storedLanguage
  }

  return resolveLanguage(window.navigator.language)
}

function getHtmlLanguage(language: AppLanguage): string {
  return language === 'ptBr' ? 'pt-BR' : 'en'
}

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS,
  ns: [defaultNS],
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  const resolvedLanguage = resolveLanguage(language)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage)
    window.document.documentElement.lang = getHtmlLanguage(resolvedLanguage)
  }
})

if (typeof window !== 'undefined') {
  const initialLanguage = resolveLanguage(
    i18n.resolvedLanguage ?? i18n.language,
  )
  window.document.documentElement.lang = getHtmlLanguage(initialLanguage)
}

export default i18n
