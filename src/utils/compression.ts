import { ghostscriptCompress } from '@/ghostscript/ghostscript'
import type { Ref } from 'vue'

// The compressors are only needed once files have been dropped, so keep them out of the
// entry chunk (svgo alone is ~800 kB) and load each one the first time it is used

export const compressVectorImage = async (svg: File, compressedFiles: Ref<File[]>) => {
  try {
    const result = await compressSVGs(svg)
    compressedFiles.value.push(result as File)
    return result as File
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const compressRasterImage = async (image: File, compressedFiles: Ref<File[]>) => {
  try {
    const { default: Compressor } = await import('compressorjs')
    return new Promise<File>((resolve, reject) => {
      new Compressor(image, {
        quality: 0.6,
        success(result) {
          compressedFiles.value.push(result as File)
          resolve(result as File)
        },
        error(err) {
          console.log(err.message)
          reject(err)
        }
      })
    })
  } catch (err) {
    console.log(err)
    throw err
  }
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
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const svgTree = event?.target?.result as string
      const result = await optimize(svgTree)
      const compressedSVG = new File([result.data], svgFile.name, { type: 'image/svg+xml' })

      return resolve(compressedSVG)
    }

    reader.onerror = (err) => {
      return reject(err)
    }

    reader.readAsText(svgFile)
  })
}
