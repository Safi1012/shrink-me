import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Personal details for the legal notice and privacy policy. They are injected at
 * build time (GitHub repository variables in CI, `.env.local` locally), so they
 * never live in the source code.
 */
export const operator = {
  name: import.meta.env.VITE_LEGAL_NAME ?? '',
  street: import.meta.env.VITE_LEGAL_STREET ?? '',
  postalCode: import.meta.env.VITE_LEGAL_POSTAL_CODE ?? '',
  city: import.meta.env.VITE_LEGAL_CITY ?? '',
  country: import.meta.env.VITE_LEGAL_COUNTRY ?? '',
  email: import.meta.env.VITE_LEGAL_EMAIL ?? ''
}

export type LegalLanguage = 'de' | 'en'

/**
 * The legal texts only exist in German (binding) and English, so every other
 * locale falls back to English.
 */
export const useLegalLanguage = () => {
  const { locale } = useI18n()
  return ref<LegalLanguage>(locale.value === 'de' ? 'de' : 'en')
}
