import JSZip from 'jszip'
import { expect, test, type Page } from '@playwright/test'
import {
  expectAlreadyOptimized,
  expectSuccess,
  fixture,
  fixtureSize,
  mockCounter,
  readDownload,
  save,
  startOver
} from './support'

test.use({ locale: 'en-US' })

const counterText = (page: Page) => page.getByText('Shrink Me compressed')

// The odometer renders every digit on its own (and several while it rolls), so read its
// value once it has settled
const odometers = (page: Page) => page.locator('.display-counter .odometer')
const odometerValue = async (page: Page, index: number) =>
  (await odometers(page).nth(index).innerText()).replace(/\s/g, '')

test.describe('display', () => {
  test('shows the totals the server sends', async ({ page }) => {
    await mockCounter(page, { totals: { compressedImages: 1234, savedBytes: 5_000_000_000 } })
    await page.goto('/')

    await expect(counterText(page)).toBeVisible()
    await expect.poll(() => odometerValue(page, 0)).toBe('1,234')
    await expect.poll(() => odometerValue(page, 1)).toBe('5')
    await expect(page.locator('.display-counter')).toContainText('GB of storage')
  })

  test('rolls the totals forward after a compression', async ({ page }) => {
    await mockCounter(page, { totals: { compressedImages: 1234, savedBytes: 5_000_000_000 } })
    await page.goto('/')
    await expect.poll(() => odometerValue(page, 0)).toBe('1,234')

    await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
    await expectSuccess(page)

    await expect.poll(() => odometerValue(page, 0)).toBe('1,235')
  })

  test('shows the last known totals while the server is unreachable', async ({ page }) => {
    await mockCounter(page, { socket: 'refused' })
    await page.addInitScript(() =>
      localStorage.setItem(
        'counter-snapshot',
        JSON.stringify({ compressedImages: 42, savedBytes: 1_000_000 })
      )
    )
    await page.goto('/')

    await expect(counterText(page)).toBeVisible()
    await expect.poll(() => odometerValue(page, 0)).toBe('42')
  })

  test('stays hidden without any totals', async ({ page }) => {
    await mockCounter(page, { socket: 'refused' })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Shrink your images' })).toBeVisible()
    await expect(counterText(page)).toBeHidden()
  })

  test('ignores a broken snapshot', async ({ page }) => {
    await mockCounter(page)
    await page.addInitScript(() => localStorage.setItem('counter-snapshot', '{not json'))
    await page.goto('/')

    await expect.poll(() => odometerValue(page, 0)).toBe('1,234')
  })
})

test.describe('increments', () => {
  let counter: Awaited<ReturnType<typeof mockCounter>>

  test.beforeEach(async ({ page }) => {
    counter = await mockCounter(page)
    await page.goto('/')
    // Increments only go over the socket once it is open
    await expect(counterText(page)).toBeVisible()
  })

  test('counts one file and exactly the bytes it saved', async ({ page }) => {
    await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
    await expectSuccess(page)

    const compressed = await readDownload(await save(page))
    const savedBytes = (await fixtureSize('photo.jpg')) - compressed.byteLength
    expect(savedBytes).toBeGreaterThan(0)

    await expect.poll(() => counter.increments).toEqual([{ compressedImages: 1, savedBytes }])
    expect(counter.posts).toEqual([])
  })

  test('counts every file of a batch and the bytes saved across all of them', async ({ page }) => {
    const files = ['photo.jpg', 'graphic.png', 'pattern.webp', 'drawing.svg', 'document.pdf']
    await page.locator('#fileButton').setInputFiles(files.map(fixture))
    await expectSuccess(page)

    const zip = await JSZip.loadAsync(await readDownload(await save(page)))
    let savedBytes = 0
    for (const name of files) {
      const compressed = await zip.file(name)!.async('uint8array')
      savedBytes += (await fixtureSize(name)) - compressed.byteLength
    }

    await expect
      .poll(() => counter.increments)
      .toEqual([{ compressedImages: files.length, savedBytes }])
  })

  test('counts an already optimized file without any saved bytes', async ({ page }) => {
    await page.locator('#fileButton').setInputFiles(fixture('graphic.png'))
    await expectAlreadyOptimized(page)

    await expect.poll(() => counter.increments).toEqual([{ compressedImages: 1, savedBytes: 0 }])
  })

  test('counts each compression once, not each save', async ({ page }) => {
    await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
    await expectSuccess(page)
    await save(page)
    await save(page)

    await startOver(page)
    await page.locator('#fileButton').setInputFiles(fixture('drawing.svg'))
    await expectSuccess(page)
    const svg = await readDownload(await save(page))

    await expect.poll(() => counter.increments).toHaveLength(2)
    expect(counter.increments[1]).toEqual({
      compressedImages: 1,
      savedBytes: (await fixtureSize('drawing.svg')) - svg.byteLength
    })
  })
})

test.describe('without an open socket', () => {
  test('posts the increment when the server refuses the socket', async ({ page }) => {
    const counter = await mockCounter(page, { socket: 'refused' })
    await page.goto('/')

    await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
    await expectSuccess(page)
    const compressed = await readDownload(await save(page))

    await expect
      .poll(() => counter.posts)
      .toEqual([
        {
          compressedImages: 1,
          savedBytes: (await fixtureSize('photo.jpg')) - compressed.byteLength
        }
      ])
    expect(counter.increments).toEqual([])
  })

  test('posts the increment on small screens, which never open the socket', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 })
    const counter = await mockCounter(page)
    await page.goto('/')

    await expect(counterText(page)).toBeHidden()
    await page.locator('#fileButton').setInputFiles(fixture('graphic.png'))
    await expectAlreadyOptimized(page)

    await expect.poll(() => counter.posts).toEqual([{ compressedImages: 1, savedBytes: 0 }])
    expect(counter.increments).toEqual([])
  })

  test('still finishes when the counter cannot be reached at all', async ({ page }) => {
    await page.routeWebSocket(/\/api\/counter$/, (ws) => ws.close())
    await page.route(/\/api\/counter$/, (route) => route.abort())
    await page.goto('/')

    await page.locator('#fileButton').setInputFiles(fixture('photo.jpg'))
    await expectSuccess(page)
    expect((await save(page)).suggestedFilename()).toBe('photo.jpg')
  })
})
