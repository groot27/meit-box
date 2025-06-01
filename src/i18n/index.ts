import { createI18n } from 'vue-i18n'
import en from './locales/en'
import de from './locales/de'

// Get the saved language or default to 'en'
const savedLanguage = localStorage.getItem('selectedLanguage')
const defaultLocale = savedLanguage && ['en', 'de'].includes(savedLanguage) ? savedLanguage : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    de
  }
})