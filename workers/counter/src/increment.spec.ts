import { describe, expect, it } from 'vitest'
import { addIncrement, parseIncrement } from './increment'

const GB = 1024 ** 3

describe('parseIncrement', () => {
  it.each([
    { compressedImages: 1, savedBytes: 0 },
    { compressedImages: 1, savedBytes: 123_456 },
    { compressedImages: 1_000, savedBytes: 1_000 * GB }
  ])('accepts %j', (increment) => {
    expect(parseIncrement(JSON.stringify(increment))).toEqual(increment)
  })

  it.each([
    ['no files', { compressedImages: 0, savedBytes: 0 }],
    ['negative files', { compressedImages: -1, savedBytes: 0 }],
    ['more files than a real batch', { compressedImages: 1_001, savedBytes: 0 }],
    ['negative bytes', { compressedImages: 1, savedBytes: -1 }],
    ['more than 1 GB saved per file', { compressedImages: 2, savedBytes: 2 * GB + 1 }],
    ['fractional files', { compressedImages: 1.5, savedBytes: 0 }],
    ['fractional bytes', { compressedImages: 1, savedBytes: 0.5 }],
    ['unsafe integers', { compressedImages: 1, savedBytes: 2 ** 53 }],
    ['numbers as strings', { compressedImages: '1', savedBytes: '100' }],
    ['a missing field', { compressedImages: 1 }],
    ['an array', [1, 100]],
    ['null', null],
    ['a number', 1]
  ])('rejects %s', (_, increment) => {
    expect(parseIncrement(JSON.stringify(increment))).toBeUndefined()
  })

  it('rejects a message that is not JSON', () => {
    expect(parseIncrement('{compressedImages: 1')).toBeUndefined()
    expect(parseIncrement('')).toBeUndefined()
  })
})

describe('addIncrement', () => {
  it('adds an increment to the totals', () => {
    expect(
      addIncrement(
        { compressedImages: 10, savedBytes: 500 },
        { compressedImages: 2, savedBytes: 30 }
      )
    ).toEqual({ compressedImages: 12, savedBytes: 530 })
  })

  it('stops at the largest safe integer instead of losing precision', () => {
    const totals = { compressedImages: Number.MAX_SAFE_INTEGER - 1, savedBytes: 2 ** 53 - 10 }

    expect(addIncrement(totals, { compressedImages: 1_000, savedBytes: 1_000 * GB })).toEqual({
      compressedImages: Number.MAX_SAFE_INTEGER,
      savedBytes: Number.MAX_SAFE_INTEGER
    })
  })
})
