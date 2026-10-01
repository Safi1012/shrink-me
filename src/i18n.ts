import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'

export type MessageSchema = typeof en

// Autocompletes the keys passed to `t()` and `$t()`. It doesn't reject unknown ones,
// i18n.spec.ts checks those
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}

const definitions = [
  { code: 'en', name: 'English', plurals: ['one', 'other'] },
  { code: 'de', name: 'Deutsch', plurals: ['one', 'other'] },
  { code: 'es', name: 'Español', plurals: ['one', 'many', 'other'] },
  { code: 'fr', name: 'Français', plurals: ['one', 'many', 'other'] },
  { code: 'pt-BR', name: 'Português', plurals: ['one', 'many', 'other'] },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    plurals: ['zero', 'one', 'two', 'few', 'many', 'other']
  },
  { code: 'hi', name: 'हिन्दी', plurals: ['one', 'other'] },
  { code: 'bn', name: 'বাংলা', plurals: ['one', 'other'] },
  { code: 'zh-Hans', name: '简体中文', plurals: ['other'] }
] as const

export type Locale = (typeof definitions)[number]['code']

/** The languages Shrink Me is translated into, each named in its own language */
export const locales: readonly {
  code: Locale
  name: string
  dir?: 'rtl'
  /** The plural forms its messages list, in this order, separated by `|` */
  plurals: readonly Intl.LDMLPluralRule[]
}[] = definitions

const DEFAULT_LOCALE: Locale = 'en'
const STORAGE_KEY = 'locale'

/**
 * The first supported locale in the user's list of preferred languages. A regional
 * variant falls back to the language we have, e.g. `pt-PT` gets `pt-BR` and `zh-TW`
 * gets `zh-Hans`, which reads better for most people than falling back to English.
 */
export const matchLocale = (requested: readonly string[]): Locale => {
  for (const tag of requested) {
    const lower = tag.toLowerCase()
    const exact = locales.find(({ code }) => code.toLowerCase() === lower)
    if (exact) return exact.code

    const language = lower.split('-')[0]
    const sameLanguage = locales.find(({ code }) => code.toLowerCase().split('-')[0] === language)
    if (sameLanguage) return sameLanguage.code
  }
  return DEFAULT_LOCALE
}

const isLocale = (value: unknown): value is Locale => locales.some(({ code }) => code === value)

// Browser storage can be unavailable (private mode, blocked site data), which only
// means the choice isn't remembered
const storedLocale = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isLocale(value) ? value : undefined
  } catch {
    return undefined
  }
}

/** A language picked in the app wins over the browser languages */
export const detectLocale = (): Locale =>
  storedLocale() ??
  matchLocale(navigator.languages?.length ? navigator.languages : [navigator.language])

// vue-i18n only knows English plurals. The forms are declared per locale instead of read
// from Intl, whose categories can differ between browsers
export const pluralRule = (locale: string, categories: readonly Intl.LDMLPluralRule[]) => {
  const rules = new Intl.PluralRules(locale)

  return (choice: number, choicesLength: number) => {
    const index = categories.indexOf(rules.select(choice))
    return Math.min(index === -1 ? categories.length - 1 : index, choicesLength - 1)
  }
}

const i18n = createI18n<[MessageSchema], Locale, false>({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  // English ships with the app, the other languages are fetched once they are needed
  messages: { en } as Record<Locale, MessageSchema>,
  pluralRules: Object.fromEntries(
    locales.map(({ code, plurals }) => [code, pluralRule(code, plurals)])
  )
})

const loaders = import.meta.glob<{ default: MessageSchema }>([
  './locales/*.json',
  '!./locales/en.json'
])

let latestRequest: Locale | undefined

/** Switches the app to a locale, loading its messages first if needed */
export const setLocale = async (locale: Locale) => {
  latestRequest = locale
  const { global } = i18n

  if (!global.availableLocales.includes(locale)) {
    const messages = await loaders[`./locales/${locale}.json`]!()
    global.setLocaleMessage(locale, messages.default)
  }
  // A quicker switch made while these messages were loading wins
  if (latestRequest !== locale) return

  global.locale.value = locale

  const root = document.documentElement
  root.lang = locale
  root.dir = locales.find(({ code }) => code === locale)?.dir ?? 'ltr'
  document.title = global.t('meta.title')
}

/** Switches the locale and remembers it for the next visit */
export const chooseLocale = async (locale: Locale) => {
  await setLocale(locale)
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Not remembered, see storedLocale()
  }
}

export default i18n
