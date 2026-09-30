import { describe, expect, it } from 'vitest'
import { uniqueName } from '../files'

const nameAll = (names: string[]) => {
  const taken = new Set<string>()
  return names.map((name) => uniqueName(name, taken))
}

describe('uniqueName', () => {
  it('keeps names that are already unique', () => {
    expect(nameAll(['photo.jpg', 'photo.png', 'drawing.svg'])).toEqual([
      'photo.jpg',
      'photo.png',
      'drawing.svg'
    ])
  })

  it('numbers repeated names before the extension', () => {
    expect(nameAll(['photo.jpg', 'photo.jpg', 'photo.jpg'])).toEqual([
      'photo.jpg',
      'photo (1).jpg',
      'photo (2).jpg'
    ])
  })

  it('treats names that only differ in case as the same', () => {
    // They would overwrite each other once unzipped on macOS or Windows
    expect(nameAll(['photo.jpg', 'PHOTO.JPG'])).toEqual(['photo.jpg', 'PHOTO (1).JPG'])
  })

  it('skips a number that is already taken by a real file', () => {
    expect(nameAll(['photo (1).jpg', 'photo.jpg', 'photo.jpg'])).toEqual([
      'photo (1).jpg',
      'photo.jpg',
      'photo (2).jpg'
    ])
  })

  it('handles names without an extension or with several dots', () => {
    expect(nameAll(['image', 'image', '.hidden', '.hidden', 'a.b.pdf', 'a.b.pdf'])).toEqual([
      'image',
      'image (1)',
      '.hidden',
      '.hidden (1)',
      'a.b.pdf',
      'a.b (1).pdf'
    ])
  })
})
