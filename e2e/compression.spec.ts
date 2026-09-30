import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test, type Page } from '@playwright/test'

const fixture = (name: string) => path.join(import.meta.dirname, 'fixtures', name)

// e.g. "You saved 108.1 KB (-94%)", never a negative saving
const savings = /You saved\s+[\d.]+ [KM]B\s+\(-\d+%\)/

// Safari gets a <button> fallback instead of a download link
const save = async (page: Page) => {
  const downloadPromise = page.waitForEvent('download')
  await page
    .getByRole('link', { name: 'SAVE' })
    .or(page.getByRole('button', { name: 'SAVE' }))
    .click()
  return downloadPromise
}

test.use({ locale: 'en-US' })

test.beforeEach(async ({ page }) => {
  // Never let test runs touch the production Firebase counter
  await page.routeWebSocket(/firebaseio\.com/, () => {})
  await page.route(/firebaseio\.com/, (route) => route.abort())

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

    await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByText(savings)).toBeVisible()

    const download = await save(page)
    expect(download.suggestedFilename()).toBe(file)
  })
}

test('reports an already optimized png', async ({ page }) => {
  await page.locator('#fileButton').setInputFiles(fixture('graphic.png'))

  await expect(page.getByRole('heading', { name: 'Done!' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('File was already optimized')).toBeVisible()
})

test('compresses a pdf picked from the drop area', async ({ page }) => {
  await page.locator('#file').setInputFiles(fixture('document.pdf'))

  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(savings)).toBeVisible()
})

test('compresses a pdf dropped onto the drop area', async ({ page }) => {
  const bytes = [...(await readFile(fixture('document.pdf')))]
  const dataTransfer = await page.evaluateHandle((bytes) => {
    const dataTransfer = new DataTransfer()
    const file = new File([new Uint8Array(bytes)], 'document.pdf', { type: 'application/pdf' })
    dataTransfer.items.add(file)
    return dataTransfer
  }, bytes)

  await page.locator('form.form-area').dispatchEvent('drop', { dataTransfer })

  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(savings)).toBeVisible()
})

test('bundles multiple files into a zip download', async ({ page }) => {
  await page
    .locator('#fileButton')
    .setInputFiles(
      ['photo.jpg', 'graphic.png', 'pattern.webp', 'drawing.svg', 'document.pdf'].map(fixture)
    )

  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(savings)).toBeVisible()

  const download = await save(page)
  expect(download.suggestedFilename()).toBe('CompressedFiles_ShrinkMe.zip')
})
