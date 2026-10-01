import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { compressPDF, compressRasterImage, compressVectorImage } from './compression'

const ghostscript = vi.hoisted(() => ({ compress: vi.fn() }))
vi.mock('@/ghostscript/ghostscript', () => ({ ghostscriptCompress: ghostscript.compress }))

// Compressor calls back `success` or `error`, whichever `outcome` says
const compressor = vi.hoisted(() => ({
  outcome: (_file: File): { result: Blob } | { error: Error } => ({ error: new Error('unset') })
}))
vi.mock('compressorjs', () => ({
  default: class {
    constructor(
      file: File,
      options: { success: (result: Blob) => void; error: (err: Error) => void }
    ) {
      const outcome = compressor.outcome(file)
      if ('result' in outcome) options.success(outcome.result)
      else options.error(outcome.error)
    }
  }
}))

const pdf = new File([new Uint8Array(1000)], 'document.pdf', { type: 'application/pdf' })

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('compressPDF', () => {
  it('keeps the compressed pdf when it is smaller', async () => {
    ghostscript.compress.mockResolvedValue(new Uint8Array(400))
    const compressedFiles = ref<File[]>([])

    const result = await compressPDF(pdf, compressedFiles)

    expect(result).not.toBe(pdf)
    expect(result).toMatchObject({ name: 'document.pdf', type: 'application/pdf', size: 400 })
    expect(compressedFiles.value).toEqual([result])
  })

  it.each([1000, 1200])('keeps the original when the result has %i bytes', async (size) => {
    ghostscript.compress.mockResolvedValue(new Uint8Array(size))
    const compressedFiles = ref<File[]>([])

    expect(await compressPDF(pdf, compressedFiles)).toBe(pdf)
    expect(compressedFiles.value).toEqual([pdf])
  })

  it('keeps the original when ghostscript fails', async () => {
    ghostscript.compress.mockRejectedValue(new Error('Ghostscript exited with code 1'))
    const compressedFiles = ref<File[]>([])

    expect(await compressPDF(pdf, compressedFiles)).toBe(pdf)
    expect(compressedFiles.value).toEqual([pdf])
  })

  it('passes on the progress and finishes it together with the file', async () => {
    ghostscript.compress.mockImplementation(async (_pdf, onProgress) => {
      onProgress(0.5)
      return new Uint8Array(400)
    })
    const compressedFiles = ref<File[]>([])
    const progress: [number, number][] = []

    await compressPDF(pdf, compressedFiles, (value) =>
      progress.push([value, compressedFiles.value.length])
    )

    // 1 is reported right before the push, so the file is never counted twice or not at all
    expect(progress).toEqual([
      [0.5, 0],
      [1, 0]
    ])
    expect(compressedFiles.value).toHaveLength(1)
  })

  it('finishes the progress when ghostscript fails too', async () => {
    ghostscript.compress.mockRejectedValue(new Error('worker crashed'))
    const onProgress = vi.fn()

    await compressPDF(pdf, ref([]), onProgress)

    expect(onProgress).toHaveBeenLastCalledWith(1)
  })
})

describe('compressRasterImage', () => {
  const photo = new File([new Uint8Array(1000)], 'photo.jpg', { type: 'image/jpeg' })

  it('hands back the compressed image', async () => {
    const compressed = new File([new Uint8Array(100)], 'photo.jpg', { type: 'image/jpeg' })
    compressor.outcome = () => ({ result: compressed })
    const compressedFiles = ref<File[]>([])

    expect(await compressRasterImage(photo, compressedFiles)).toBe(compressed)
    expect(compressedFiles.value).toEqual([compressed])
  })

  it('hands back the original when the image cannot be decoded', async () => {
    compressor.outcome = () => ({ error: new Error('Failed to load the image.') })
    const compressedFiles = ref<File[]>([])

    expect(await compressRasterImage(photo, compressedFiles)).toBe(photo)
    expect(compressedFiles.value).toEqual([photo])
  })
})

describe('compressVectorImage', () => {
  it('optimizes the svg and keeps its name and type', async () => {
    const svg = new File(
      [
        `<?xml version="1.0" encoding="UTF-8"?>
        <!-- Generator: Sketch -->
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
          <title>Drawing</title>
          <g>
            <rect x="10.000000" y="10.000000" width="80.000000" height="80.000000" fill="#ff0000"/>
          </g>
        </svg>`
      ],
      'drawing.svg',
      { type: 'image/svg+xml' }
    )
    const compressedFiles = ref<File[]>([])

    const result = await compressVectorImage(svg, compressedFiles)

    expect(result).toMatchObject({ name: 'drawing.svg', type: 'image/svg+xml' })
    expect(result.size).toBeLessThan(svg.size)
    const text = await result.text()
    expect(text).toMatch(/^<svg/)
    expect(text).not.toContain('Sketch')
    expect(compressedFiles.value).toEqual([result])
  })

  it('hands back the original when the svg cannot be parsed', async () => {
    const broken = new File(['<svg><g></svg'], 'broken.svg', { type: 'image/svg+xml' })
    const compressedFiles = ref<File[]>([])

    expect(await compressVectorImage(broken, compressedFiles)).toBe(broken)
    expect(compressedFiles.value).toEqual([broken])
  })
})
