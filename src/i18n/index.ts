import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

// Read persisted lang from localStorage before React renders so the first
// paint is already in the correct language — avoids the flash of English.
function getPersistedLang(): string {
  try {
    const raw = localStorage.getItem('recetas-store')
    const lang = raw ? JSON.parse(raw)?.state?.lang : undefined
    return lang === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: getPersistedLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
