/// <reference lib="webworker" />
import loadGhostscript from '@okathira/ghostpdl-wasm'
import type { GhostscriptRequest, GhostscriptResponse } from './ghostscript'

const INPUT = 'input.pdf'
const OUTPUT = 'output.pdf'

// Ghostscript only logs through print/printErr, so keep the last run's output to explain a failure
let log: string[] = []
let current = { id: -1, pages: 0 }

// Ghostscript announces the page count and then each page as it starts on it, which is
// turned into a 0–1 progress for the PDF being compressed
const reportProgress = (line: string) => {
  const pages = line.match(/^Processing pages \d+ through (\d+)\.$/)
  if (pages) current.pages = Number(pages[1])

  const page = line.match(/^Page (\d+)$/)
  if (page && current.pages > 0) {
    const progress = (Number(page[1]) - 1) / current.pages
    self.postMessage({ id: current.id, progress } satisfies GhostscriptResponse)
  }
}

// Loaded once when the worker starts, then reused for every PDF
const ghostscript = loadGhostscript({
  print: (line: string) => {
    log.push(line)
    reportProgress(line)
  },
  printErr: (line: string) => log.push(line)
})

const compress = async (id: number, pdf: ArrayBuffer) => {
  const { FS, callMain } = await ghostscript
  // Everything from here on is synchronous, so queued PDFs never interleave
  log = []
  current = { id, pages: 0 }

  FS.writeFile(INPUT, new Uint8Array(pdf))
  try {
    const exitCode = callMain([
      '-sDEVICE=pdfwrite',
      // 1.5 allows object streams, which shave a few more percent off than 1.4
      '-dCompatibilityLevel=1.5',
      '-dPDFSETTINGS=/ebook',
      '-dSAFER',
      '-dNOPAUSE',
      '-dBATCH',
      `-sOutputFile=${OUTPUT}`,
      INPUT
    ])
    if (exitCode !== 0) {
      throw new Error(`Ghostscript exited with code ${exitCode}: ${log.slice(-20).join('\n')}`)
    }
    return FS.readFile(OUTPUT)
  } finally {
    // The files live in the worker's memory, so drop them before the next PDF
    for (const file of [INPUT, OUTPUT]) {
      try {
        FS.unlink(file)
      } catch {
        // A failed run may not have written the output (this build has no FS.analyzePath)
      }
    }
  }
}

self.onmessage = async ({ data: { id, pdf } }: MessageEvent<GhostscriptRequest>) => {
  let response: GhostscriptResponse
  try {
    response = { id, pdf: await compress(id, pdf) }
  } catch (err) {
    response = { id, error: err instanceof Error ? err.message : String(err) }
  }
  self.postMessage(response, 'pdf' in response ? [response.pdf.buffer] : [])
}
