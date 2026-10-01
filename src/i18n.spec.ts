import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { detectLocale, locales, matchLocale, pluralRule } from './i18n'

type Messages = { [key: string]: string | Messages }

const srcDir = import.meta.dirname
const localesDir = path.join(srcDir, 'locales')

// Read as plain JSON, since the Vite plugin compiles imported messages into functions
const readMessages = (file: string): Messages =>
  JSON.parse(readFileSync(path.join(localesDir, file), 'utf8'))

const flatten = (messages: Messages, prefix = ''): Record<string, string> =>
  Object.entries(messages).reduce(
    (flat, [key, value]) => ({
      ...flat,
      ...(typeof value === 'string'
        ? { [prefix + key]: value }
        : flatten(value, `${prefix}${key}.`))
    }),
    {}
  )

const placeholders = (message: string) =>
  [...message.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

const en = flatten(readMessages('en.json'))

describe('matchLocale', () => {
  it('picks the first supported language in order of preference', () => {
    expect(matchLocale(['ja', 'es-MX', 'de'])).toBe('es')
    expect(matchLocale(['de-AT', 'en'])).toBe('de')
  })

  it('falls back to the variant we have', () => {
    expect(matchLocale(['pt-PT'])).toBe('pt-BR')
    expect(matchLocale(['pt'])).toBe('pt-BR')
    expect(matchLocale(['zh-CN'])).toBe('zh-Hans')
    expect(matchLocale(['zh-TW'])).toBe('zh-Hans')
    expect(matchLocale(['ar-EG'])).toBe('ar')
  })

  it('ignores case', () => {
    expect(matchLocale(['PT-br'])).toBe('pt-BR')
  })

  it('falls back to English', () => {
    expect(matchLocale(['ja', 'ko'])).toBe('en')
    expect(matchLocale([])).toBe('en')
  })
})

describe('detectLocale', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('follows the browser languages', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['hi-IN', 'en'])
    expect(detectLocale()).toBe('hi')
  })

  it('prefers a language picked in the app', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['hi-IN', 'en'])
    localStorage.setItem('locale', 'bn')
    expect(detectLocale()).toBe('bn')
  })

  it('ignores a stored language that is no longer supported', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr'])
    localStorage.setItem('locale', 'tlh')
    expect(detectLocale()).toBe('fr')
  })
})

const pluralsOf = (code: string) => locales.find((locale) => locale.code === code)!.plurals

describe('pluralRule', () => {
  it('handles English', () => {
    const rule = pluralRule('en', pluralsOf('en'))
    expect([0, 1, 2].map((n) => rule(n, 2))).toEqual([1, 0, 1])
  })

  it('counts zero as singular in French', () => {
    const rule = pluralRule('fr', pluralsOf('fr'))
    expect([0, 1, 2, 1_000_000].map((n) => rule(n, 3))).toEqual([0, 0, 2, 1])
  })

  it('handles all six Arabic forms', () => {
    const rule = pluralRule('ar', pluralsOf('ar'))
    expect([0, 1, 2, 3, 11, 100].map((n) => rule(n, 6))).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('uses the single form of Chinese', () => {
    const rule = pluralRule('zh-Hans', pluralsOf('zh-Hans'))
    expect([0, 1, 2].map((n) => rule(n, 1))).toEqual([0, 0, 0])
  })

  it('never picks a form the message lacks', () => {
    expect(pluralRule('ar', pluralsOf('ar'))(100, 2)).toBe(1)
  })

  it('uses the last form for a category the locale does not declare', () => {
    // e.g. a browser whose CLDR data knows a category we haven't written a form for
    expect(pluralRule('fr', ['one', 'other'])(1_000_000, 2)).toBe(1)
  })

  it.each(locales)('declares the plural categories Intl knows for $code', ({ code, plurals }) => {
    const known = new Intl.PluralRules(code).resolvedOptions().pluralCategories
    expect([...plurals].sort()).toEqual([...known].sort())
  })
})

describe('locale files', () => {
  it('exist for exactly the supported locales', () => {
    const files = readdirSync(localesDir).map((file) => path.basename(file, '.json'))
    expect(files.sort()).toEqual(locales.map(({ code }) => code).sort())
  })

  describe.each(locales.filter(({ code }) => code !== 'en'))('$code', ({ code, plurals }) => {
    const messages = flatten(readMessages(`${code}.json`))

    it('has the same keys as English', () => {
      expect(Object.keys(messages).sort()).toEqual(Object.keys(en).sort())
    })

    it('translates every message', () => {
      for (const [key, message] of Object.entries(messages)) {
        expect(message.trim(), key).not.toBe('')
      }
    })

    it('keeps the placeholders of every message', () => {
      for (const [key, message] of Object.entries(messages)) {
        if (!(key in en)) continue
        for (const form of message.split('|')) {
          expect(placeholders(form), key).toEqual(placeholders(en[key].split('|')[0]))
        }
      }
    })

    it('has a plural form for every plural category of the language', () => {
      for (const [key, message] of Object.entries(messages)) {
        if (!en[key]?.includes('|')) continue
        expect(message.split('|').length, key).toBe(plurals.length)
      }
    })
  })
})

describe('source code', () => {
  const sources = (readdirSync(srcDir, { recursive: true }) as string[])
    .filter((file) => /\.(vue|ts)$/.test(file) && !file.endsWith('.spec.ts'))
    .map((file) => readFileSync(path.join(srcDir, file), 'utf8'))

  it('only uses keys that exist', () => {
    const used = sources.flatMap((source) =>
      [...source.matchAll(/(?:\bt\(|\$t\(|keypath=")\s*'?([a-z_]+(?:\.[a-z_]+)+)/g)].map(
        (m) => m[1]
      )
    )

    expect(used.length).toBeGreaterThan(50)
    expect(used.filter((key) => !(key in en))).toEqual([])
  })
})
