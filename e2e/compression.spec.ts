import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import {
  dropFiles,
  expectAlreadyOptimized,
  expectSuccess,
  fixture,
  mockCounter,
  save
} from './support'

test.use({ locale: 'en-US' })

test.beforeEach(async ({ page }) => {
  await mockCounter(page)
  await page.goto('/')
})

test('shows the file selector with all supported formats', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Shrink your images' })).toBeVisible()

  for (const format of ['JPG', 'PNG', 'WEBP', 'SVG', 'PDF']) {
    await expect(page.locator('form.form-area strong', { hasText: format })).toBeVisible()
  }
})

test('drop area and select button accept every supported format', async ({ page }) => {
  for (const input of [page.locator('#file'), page.locator('#fileButton')]) {
    await expect(input).toHaveAttribute('accept', '.png,.jpg,.jpeg,.webp,.svg,.pdf')
  }
})

const shrinkableFiles = ['photo.jpg', 'pattern.webp', 'drawing.svg', 'document.pdf']

for (const file of shrinkableFiles) {
  test(`compresses ${file}`, async ({ page, browserName }) => {
    test.skip(
      file === 'pattern.webp' && browserName === 'webkit',
      'WebKit cannot encode WebP, so the original is kept as already optimized'
    )

    await page.locator('#fileButton').setInputFiles(fixture(file))
    await expectSuccess(page)

    const download = await save(page)
    expect(download.suggestedFilename()).toBe(file)
  })
}

test('reports an already optimized png', async ({ page }) => {
  await page.locator('#fileButton').setInputFiles(fixture('graphic.png'))
  await expectAlreadyOptimized(page)
})

test('compresses a pdf picked from the drop area', async ({ page }) => {
  await page.locator('#file').setInputFiles(fixture('document.pdf'))
  await expectSuccess(page)
})

test('compresses a pdf dropped onto the drop area', async ({ page }) => {
  await dropFiles(page, [
    {
      name: 'document.pdf',
      type: 'application/pdf',
      bytes: await readFile(fixture('document.pdf'))
    }
  ])
  await expectSuccess(page)
})

test('bundles multiple files into a zip download', async ({ page }) => {
  await page
    .locator('#fileButton')
    .setInputFiles(
      ['photo.jpg', 'graphic.png', 'pattern.webp', 'drawing.svg', 'document.pdf'].map(fixture)
    )
  await expectSuccess(page)

  const download = await save(page)
  expect(download.suggestedFilename()).toBe('CompressedFiles_ShrinkMe.zip')
})
