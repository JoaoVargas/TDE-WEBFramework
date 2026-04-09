import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AppButton from '@/components/AppButton/AppButton'
import type { AppLanguage } from '@/locales/resources'

import './LocaleSwitcher.css'

type LocaleOption = {
  value: AppLanguage
  labelKey: 'locale_switcher.pt_br' | 'locale_switcher.en'
  flag: string
}

const localeOptions: LocaleOption[] = [
  { value: 'ptBr', labelKey: 'locale_switcher.pt_br', flag: '🇧🇷' },
  { value: 'en', labelKey: 'locale_switcher.en', flag: '🇺🇸' },
]

function resolveLanguage(language: string): AppLanguage {
  if (language.startsWith('pt')) {
    return 'ptBr'
  }

  return 'en'
}

export default function LocaleSwitcher() {
  const { i18n, t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const activeLanguage = useMemo(
    () => resolveLanguage(i18n.resolvedLanguage ?? i18n.language),
    [i18n.language, i18n.resolvedLanguage],
  )

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleDocumentClick(event: MouseEvent) {
      const targetNode = event.target as Node

      if (!wrapperRef.current?.contains(targetNode)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const currentOption = useMemo(
    () =>
      localeOptions.find((option) => option.value === activeLanguage) ??
      localeOptions[0],
    [activeLanguage],
  )

  async function handleSelectLocale(nextLanguage: AppLanguage) {
    await i18n.changeLanguage(nextLanguage)
    setIsOpen(false)
  }

  return (
    <div className="locale-switcher" ref={wrapperRef}>
      <AppButton
        status="basic"
        size="sm"
        className="locale-switcher__trigger"
        onClick={() => setIsOpen((currentOpen) => !currentOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t('locale_switcher.current_language', {
          language: t(currentOption.labelKey),
        })}
      >
        <span className="locale-switcher__trigger-content">
          <span aria-hidden="true">{currentOption.flag}</span>
          <span className="locale-switcher__chevron" aria-hidden="true">
            ▾
          </span>
        </span>
      </AppButton>

      {isOpen ? (
        <ul
          className="locale-switcher__menu"
          role="menu"
          aria-label={t('locale_switcher.select_language')}
        >
          {localeOptions.map((option) => (
            <li
              key={option.value}
              className="locale-switcher__menu-item"
              role="none"
            >
              <button
                type="button"
                role="menuitemradio"
                aria-checked={option.value === activeLanguage}
                className="locale-switcher__option"
                onClick={() => {
                  void handleSelectLocale(option.value)
                }}
              >
                <span
                  className="locale-switcher__option-flag"
                  aria-hidden="true"
                >
                  {option.flag}
                </span>
                <span>{t(option.labelKey)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
