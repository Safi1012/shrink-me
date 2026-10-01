export type Totals = { compressedImages: number; savedBytes: number }

// Anything above this in a single batch is not a real user of the site
const MAX_FILES_PER_INCREMENT = 1_000
const MAX_SAVED_BYTES_PER_FILE = 1024 ** 3

const isTotals = (value: unknown): value is Totals =>
  typeof value === 'object' &&
  value !== null &&
  Number.isSafeInteger((value as Totals).compressedImages) &&
  Number.isSafeInteger((value as Totals).savedBytes)

const isValidIncrement = (value: unknown): value is Totals =>
  isTotals(value) &&
  value.compressedImages > 0 &&
  value.compressedImages <= MAX_FILES_PER_INCREMENT &&
  value.savedBytes >= 0 &&
  value.savedBytes <= value.compressedImages * MAX_SAVED_BYTES_PER_FILE

// Past this, totals lose integer precision; only reachable by flooding the counter
const sum = (a: number, b: number) => Math.min(a + b, Number.MAX_SAFE_INTEGER)

export const addIncrement = (totals: Totals, increment: Totals): Totals => ({
  compressedImages: sum(totals.compressedImages, increment.compressedImages),
  savedBytes: sum(totals.savedBytes, increment.savedBytes)
})

export const parseIncrement = (message: string): Totals | undefined => {
  try {
    const increment: unknown = JSON.parse(message)
    return isValidIncrement(increment) ? increment : undefined
  } catch {
    return undefined
  }
}
