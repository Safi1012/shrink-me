import { readFile } from 'node:fs/promises'
import JSZip from 'jszip'
import { expect, test } from '@playwright/test'
import {
  dropFiles,
  expectAlreadyOptimized,
  expectSuccess,
  fixture,
  fixtureSize,
  inspectPDF,
  mockCounter,
  readDownload,
  save,
  saveButton
} from './support'

test.use({ locale: 'en-US' })

let counter: Awaited<ReturnType<typeof mockCounter>>

test.beforeEach(async ({ page }) => {
  counter = await mockCounter(page)
  await page.goto('/')
})

test('compresses a multi-page pdf and keeps every page', async ({ page }) => {
  const original = inspectPDF(await readFile(fixture('multipage.pdf')))
  expect(original.pages).toBe(6)

  await page.locator('#fileButton').setInputFiles(fixture('multipage.pdf'))
  await expectSuccess(page)

  const download = await save(page)
  expect(download.suggestedFilename()).toBe('multipage.pdf')

  const bytes = await readDownload(download)
  expect(bytes.byteLength).toBeLessThan(await fixtureSize('multipage.pdf'))

  const compressed = inspectPDF(bytes)
  expect(compressed.isPDF).toBe(true)
  expect(compressed.pages).toBe(6)
  // The last page's content made it through, not just an empty page
  expect(compressed.text).toContain('Shrink Me page 6 line 37')
})

test('moves the progress along page by page for a multi-page pdf', async ({ page }) => {
  // Record every value the progress border takes while the PDF is being compressed
  await page.evaluate(() => {
    const progress = ((window as any).__progress = new Set<number>())
    new MutationObserver((mutations) => {
      for (const { target } of mutations) {
        const path = target as SVGPathElement
        if (path.id !== 'path-2' || !path.style.strokeDasharray) continue
        const length = parseFloat(path.style.strokeDasharray)
        if (length) progress.add(1 - parseFloat(path.style.strokeDashoffset) / length)
      }
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] })
  })

  await page.locator('#fileButton').setInputFiles(fixture('multipage.pdf'))
  await expectSuccess(page)

  const progress: number[] = await page.evaluate(() => [...(window as any).__progress])
  const betweenStartAndEnd = progress.filter((value) => value > 0.01 && value < 0.99)

  // Ghostscript reports pages 2–6 of 6, i.e. 1/6 … 5/6 of the way through
  for (const page of [1, 2, 3, 4, 5]) {
    expect(betweenStartAndEnd).toContainEqual(expect.closeTo(page / 6, 2))
  }
})

test('compresses several pdfs at once into a zip of valid pdfs', async ({ page }) => {
  await page
    .locator('#fileButton')
    .setInputFiles([fixture('document.pdf'), fixture('multipage.pdf')])
  await expectSuccess(page)

  const download = await save(page)
  expect(download.suggestedFilename()).toBe('CompressedFiles_ShrinkMe.zip')

  const zip = await JSZip.loadAsync(await readDownload(download))
  expect(Object.keys(zip.files).sort()).toEqual(['document.pdf', 'multipage.pdf'])

  for (const [name, pages] of [
    ['document.pdf', 1],
    ['multipage.pdf', 6]
  ] as const) {
    const pdf = Buffer.from(await zip.file(name)!.async('uint8array'))
    expect(pdf.byteLength).toBeLessThan(await fixtureSize(name))
    expect(inspectPDF(pdf)).toMatchObject({ isPDF: true, pages })
  }
})

test('keeps a pdf that ghostscript cannot read and says it is already optimized', async ({
  page
}) => {
  await dropFiles(page, [
    {
      name: 'broken.pdf',
      type: 'application/pdf',
      bytes: Buffer.from('%PDF-1.4\nnot really a pdf')
    }
  ])

  await expectAlreadyOptimized(page)
  await expect.poll(() => counter.increments).toEqual([{ compressedImages: 1, savedBytes: 0 }])

  // The broken PDF does not break Ghostscript for the next one
  await page.getByText('Select New').click()
  await page.locator('#fileButton').setInputFiles(fixture('document.pdf'))
  await expectSuccess(page)
})

test('keeps a pdf that ghostscript cannot shrink any further', async ({ page }) => {
  // A hand-written page of a few hundred bytes: Ghostscript adds kilobytes of metadata to
  // anything it writes, so its rewrite is always bigger and the original is kept. (Feeding it
  // its own output instead is flaky, that rewrite lands within a byte of the input depending
  // on the timestamps it embeds.)
  await page.locator('#fileButton').setInputFiles(fixture('lean.pdf'))

  await expectAlreadyOptimized(page)
  await expect(saveButton(page)).toBeHidden()
  await expect.poll(() => counter.increments.at(-1)).toEqual({ compressedImages: 1, savedBytes: 0 })
})
