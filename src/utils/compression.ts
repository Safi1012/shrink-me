import { ghostscriptCompress } from '@/ghostscript/ghostscript'
import type { Ref } from 'vue'

// The compressors are only needed once files have been dropped, so keep them out of the
// entry chunk (svgo alone is ~800 kB) and load each one the first time it is used

export const compressVectorImage = async (svg: File, compressedFiles: Ref<File[]>) => {
  let result = svg
  try {
    result = await compressSVGs(svg)
  } catch (err) {
    // Hand back the original rather than leaving the batch stuck on "Shrinking..."
    console.log(err)
  }
  compressedFiles.value.push(result)
  return result
}

export const compressRasterImage = async (image: File, compressedFiles: Ref<File[]>) => {
  const { default: Compressor } = await import('compressorjs')
  const result = await new Promise<File>((resolve) => {
    new Compressor(image, {
      quality: 0.6,
      success: (compressed) => resolve(compressed as File),
      error(err) {
        // An empty or corrupt image can't be decoded, so hand back the original rather
        // than leaving the batch stuck on "Shrinking..."
        console.log(err.message)
        resolve(image)
      }
    })
  })
  compressedFiles.value.push(result)
  return result
}

export const compressPDF = async (
  pdf: File,
  compressedFiles: Ref<File[]>,
  onProgress?: (progress: number) => void
) => {
  let result = pdf
  try {
    const compressed = await ghostscriptCompress(pdf, onProgress)
    // Rewriting an already lean PDF can make it bigger, so only keep a real improvement
    if (compressed.byteLength < pdf.size) {
      result = new File([compressed], pdf.name, { type: 'application/pdf' })
    }
  } catch (err) {
    // Hand back the original rather than leaving the file (and the progress) stuck
    console.log(err)
  }
  // Reported in the same tick as the push, so the file never counts as both in progress and done
  onProgress?.(1)
  compressedFiles.value.push(result)
  return result
}

const compressSVGs = async (svgFile: File) => {
  const { optimize } = await import('svgo/browser')
  // Throws on an invalid SVG, which the caller turns into keeping the original
  const result = optimize(await svgFile.text())
  return new File([result.data], svgFile.name, { type: 'image/svg+xml' })
}
