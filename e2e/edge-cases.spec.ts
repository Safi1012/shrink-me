import { readFile } from 'node:fs/promises'
import JSZip from 'jszip'
import { expect, test, type Page } from '@playwright/test'
import {
  dropFiles,
  expectAlreadyOptimized,
  expectSuccess,
  fixture,
  fixtureSize,
  mockCounter,
  readDownload,
  save,
  saveButton,
  startOver
} from './support'

test.use({ locale: 'en-US' })

let counter: Awaited<ReturnType<typeof mockCounter>>

test.beforeEach(async ({ page }) => {
  counter = await mockCounter(page)
  await page.goto('/')
})

const selector = (page: Page) => page.getByRole('heading', { name: 'Shrink your images' })

test('hands back a smaller, valid file of the same type', async ({ page }) => {
  for (const [name, signature] of [
    ['photo.jpg', 'ffd8ff'],
    ['document.pdf', Buffer.from('%PDF-').toString('hex')],
    ['drawing.svg', Buffer.from('<svg').toString('hex')]
  ] as const) {
    await page.locator('#fileButton').setInputFiles(fixture(name))
    await expectSuccess(page)

    const bytes = await readDownload(await save(page))
    expect(bytes.byteLength, name).toBeLessThan(await fixtureSize(name))
    expect(bytes.subarray(0, signature.length / 2).toString('hex'), name).toBe(signature)

    await startOver(page)
  }
})

test('keeps the name of a file with spaces, accents and an uppercase extension', async ({
  page
}) => {
  const name = 'Café photo (1).JPG'
  await page.locator('#fileButton').setInputFiles({
    name,
    mimeType: 'image/jpeg',
    buffer: await readFile(fixture('photo.jpg'))
  })
  await expectSuccess(page)

  // WebKit hands the name back decomposed (e + combining accent)
  expect((await save(page)).suggestedFilename().normalize()).toBe(name)
})

test('says both files were already optimized when none of them shrink', async ({ page }) => {
  const png = await readFile(fixture('graphic.png'))
  await page.locator('#fileButton').setInputFiles([
    { name: 'graphic.png', mimeType: 'image/png', buffer: png },
    { name: 'graphic-copy.png', mimeType: 'image/png', buffer: png }
  ])

  await expectAlreadyOptimized(page, 'Files were already optimized')
  await expect(saveButton(page)).toBeHidden()
  await expect.poll(() => counter.increments).toEqual([{ compressedImages: 2, savedBytes: 0 }])
})

test('zips a batch where only some of the files shrink', async ({ page }) => {
  await page.locator('#fileButton').setInputFiles([fixture('photo.jpg'), fixture('graphic.png')])
  await expectSuccess(page)

  const zip = await JSZip.loadAsync(await readDownload(await save(page)))
  expect(Object.keys(zip.files).sort()).toEqual(['graphic.png', 'photo.jpg'])
  // The png could not be shrunk, so it is handed back untouched
  const png = await zip.file('graphic.png')!.async('nodebuffer')
  expect(png.equals(await readFile(fixture('graphic.png')))).toBe(true)
})

test('starts over from an already optimized file with "Select New"', async ({ page }) => {
  await page.locator('#fileButton').setInputFiles(fixture('graphic.png'))
  await expectAlreadyOptimized(page)

  await page.getByText('Select New').click()
  await expect(selector(page)).toBeVisible()

  await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
  await expectSuccess(page)
  expect((await save(page)).suggestedFilename()).toBe('photo.jpg')
})

test('starts over after saving and does not mix in the previous files', async ({ page }) => {
  await page.locator('#fileButton').setInputFiles([fixture('photo.jpg'), fixture('drawing.svg')])
  await expectSuccess(page)
  await save(page)

  await startOver(page)
  await expect(selector(page)).toBeVisible()

  await page.locator('#fileButton').setInputFiles(fixture('document.pdf'))
  await expectSuccess(page)
  expect((await save(page)).suggestedFilename()).toBe('document.pdf')
})

test('only offers to start over once the files were saved', async ({ page }) => {
  await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
  await expectSuccess(page)
  await expect(page.locator('button.retry:not(.share)')).toBeHidden()

  await save(page)
  await expect(page.locator('button.retry:not(.share)')).toBeVisible()
})

test('ignores unsupported files dropped next to supported ones', async ({ page }) => {
  await dropFiles(page, [
    { name: 'notes.txt', type: 'text/plain', bytes: Buffer.from('not an image') },
    { name: 'photo.jpg', type: 'image/jpeg', bytes: await readFile(fixture('photo.jpg')) },
    { name: 'animation.gif', type: 'image/gif', bytes: Buffer.from('GIF89a') }
  ])
  await expectSuccess(page)

  // Only one file is left, so it is handed back on its own rather than zipped
  expect((await save(page)).suggestedFilename()).toBe('photo.jpg')
  await expect
    .poll(() => counter.increments)
    .toEqual([{ compressedImages: 1, savedBytes: expect.any(Number) }])
})

test('stays on the file selector when only unsupported files are dropped', async ({ page }) => {
  await dropFiles(page, [{ name: 'notes.txt', type: 'text/plain', bytes: Buffer.from('hello') }])

  await expect(selector(page)).toBeVisible()
  await expect(page.getByRole('heading', { name: /Done!|Success!/ })).toBeHidden()

  // and a supported file picked afterwards still goes through
  await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
  await expectSuccess(page)
  await expect
    .poll(() => counter.increments)
    .toEqual([{ compressedImages: 1, savedBytes: expect.any(Number) }])
})

test('keeps both files when two of them have the same name', async ({ page }) => {
  // e.g. picked from two different folders
  const jpg = await readFile(fixture('photo.jpg'))
  const svg = await readFile(fixture('drawing.svg'))
  await dropFiles(page, [
    { name: 'image.jpg', type: 'image/jpeg', bytes: jpg },
    { name: 'image.jpg', type: 'image/jpeg', bytes: jpg },
    { name: 'IMAGE.JPG', type: 'image/jpeg', bytes: jpg },
    { name: 'image', type: 'image/svg+xml', bytes: svg },
    { name: 'image', type: 'image/svg+xml', bytes: svg }
  ])
  await expectSuccess(page)

  // Which duplicate gets a suffix depends on which one finishes compressing first
  const names = Object.keys((await JSZip.loadAsync(await readDownload(await save(page)))).files)
  expect(names).toHaveLength(5)
  expect(new Set(names.map((name) => name.toLowerCase())).size).toBe(5)
  expect(names.filter((name) => /^image( \(\d\))?\.jpg$/i.test(name))).toHaveLength(3)
  expect(names.filter((name) => /^image( \(\d\))?$/.test(name))).toHaveLength(2)
})

test('keeps an empty image as it is and compresses the rest', async ({ page }) => {
  await dropFiles(page, [
    { name: 'empty.jpg', type: 'image/jpeg', bytes: Buffer.alloc(0) },
    { name: 'photo.jpg', type: 'image/jpeg', bytes: await readFile(fixture('photo.jpg')) }
  ])
  await expectSuccess(page, { timeout: 10_000 })

  const zip = await JSZip.loadAsync(await readDownload(await save(page)))
  expect(await zip.file('empty.jpg')!.async('uint8array')).toHaveLength(0)
  expect((await zip.file('photo.jpg')!.async('uint8array')).byteLength).toBeLessThan(
    await fixtureSize('photo.jpg')
  )
  await expect.poll(() => counter.increments).toMatchObject([{ compressedImages: 2 }])
})

for (const [name, type] of [
  ['broken.jpg', 'image/jpeg'],
  ['broken.png', 'image/png'],
  ['broken.svg', 'image/svg+xml']
] as const) {
  test(`keeps a corrupt ${name.split('.')[1]} as it is and compresses the rest`, async ({
    page
  }) => {
    const broken = Buffer.from('<definitely not an image')
    await dropFiles(page, [
      { name, type, bytes: broken },
      { name: 'photo.jpg', type: 'image/jpeg', bytes: await readFile(fixture('photo.jpg')) }
    ])
    await expectSuccess(page, { timeout: 10_000 })

    const zip = await JSZip.loadAsync(await readDownload(await save(page)))
    expect((await zip.file(name)!.async('nodebuffer')).equals(broken)).toBe(true)
  })
}

test('says a corrupt image on its own was already optimized', async ({ page }) => {
  await dropFiles(page, [
    { name: 'broken.jpg', type: 'image/jpeg', bytes: Buffer.from('definitely not a jpeg') }
  ])

  await expectAlreadyOptimized(page)
  await expect.poll(() => counter.increments).toEqual([{ compressedImages: 1, savedBytes: 0 }])
})
