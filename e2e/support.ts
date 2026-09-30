import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { inflateSync } from 'node:zlib'
import { expect, type Download, type Page } from '@playwright/test'

export type CounterTotals = { compressedImages: number; savedBytes: number }

export const fixture = (name: string) => path.join(import.meta.dirname, 'fixtures', name)

export const fixtureSize = async (name: string) => (await readFile(fixture(name))).byteLength

// e.g. "You saved 108.1 KB (-94%)", never a negative saving
export const savings = /You saved\s+[\d.]+ [KM]B\s+\(-\d+%\)/

// The first PDF of a run loads the 15 MB Ghostscript wasm
export const COMPRESSION_TIMEOUT = 20_000

export const expectSuccess = async (page: Page, { timeout = COMPRESSION_TIMEOUT } = {}) => {
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible({ timeout })
  await expect(page.getByText(savings)).toBeVisible()
}

export const expectAlreadyOptimized = async (
  page: Page,
  subtitle = 'File was already optimized'
) => {
  await expect(page.getByRole('heading', { name: 'Done!' })).toBeVisible({
    timeout: COMPRESSION_TIMEOUT
  })
  await expect(page.getByText(subtitle)).toBeVisible()
}

export const saveButton = (page: Page) =>
  page.getByRole('link', { name: 'SAVE' }).or(page.getByRole('button', { name: 'SAVE' }))

// Safari gets a <button> fallback instead of a download link
export const save = async (page: Page) => {
  const downloadPromise = page.waitForEvent('download')
  await saveButton(page).click()
  return downloadPromise
}

// The round button shown after saving (the Android share button looks the same)
export const startOver = (page: Page) => page.locator('button.retry:not(.share)').click()

export const readDownload = async (download: Download) => readFile(await download.path())

/** Drops files onto the drop area, bypassing the file picker (and its `accept` filter) */
export const dropFiles = async (
  page: Page,
  files: { name: string; type: string; bytes: Buffer | Uint8Array }[]
) => {
  const dataTransfer = await page.evaluateHandle(
    (files) => {
      const dataTransfer = new DataTransfer()
      for (const { name, type, bytes } of files) {
        dataTransfer.items.add(new File([new Uint8Array(bytes)], name, { type }))
      }
      return dataTransfer
    },
    files.map(({ name, type, bytes }) => ({ name, type, bytes: [...bytes] }))
  )

  await page.locator('form.form-area').dispatchEvent('drop', { dataTransfer })
}

/**
 * Stands in for the counter Worker, so test runs never touch the real counter. Like the
 * real one it sends the totals on connect and pushes the new totals after every increment.
 * With `socket: 'refused'` every WebSocket is closed right away, so increments are POSTed.
 */
export const mockCounter = async (
  page: Page,
  {
    totals = { compressedImages: 1234, savedBytes: 5_000_000_000 } as CounterTotals | null,
    socket = 'open' as 'open' | 'refused'
  } = {}
) => {
  const increments: CounterTotals[] = []
  const posts: CounterTotals[] = []
  let current = totals

  await page.routeWebSocket(/\/api\/counter$/, (ws) => {
    if (socket === 'refused') return ws.close()

    if (current) ws.send(JSON.stringify(current))
    ws.onMessage((message) => {
      const increment: CounterTotals = JSON.parse(message as string)
      increments.push(increment)
      current = {
        compressedImages: (current?.compressedImages ?? 0) + increment.compressedImages,
        savedBytes: (current?.savedBytes ?? 0) + increment.savedBytes
      }
      ws.send(JSON.stringify(current))
    })
  })
  await page.route(/\/api\/counter$/, async (route) => {
    posts.push(route.request().postDataJSON())
    await route.fulfill({ status: 204 })
  })

  return { increments, posts }
}

/**
 * Just enough PDF parsing to check what Ghostscript wrote: the page count (from the page
 * tree) and the text, looking inside the Flate streams it compresses everything into
 */
export const inspectPDF = (pdf: Buffer) => {
  const raw = pdf.toString('latin1')
  let content = raw

  for (const match of raw.matchAll(/stream\r?\n/g)) {
    const start = match.index + match[0].length
    const end = raw.indexOf('endstream', start)
    try {
      content += inflateSync(pdf.subarray(start, end)).toString('latin1')
    } catch {
      // Not Flate encoded (or an image), nothing to read in there
    }
  }

  return {
    isPDF: raw.startsWith('%PDF-'),
    pages: content.match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0,
    text: content
  }
}
