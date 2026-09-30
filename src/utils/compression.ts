import { ghostScriptToPDF } from '@/ghostscript/ghostscript'
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

export const compressPDF = async (pdf: File, compressedFiles: Ref<File[]>) => {
  const url = window.URL.createObjectURL(pdf)

  await new Promise((resolve) => {
    ghostScriptToPDF({
      name: pdf.name,
      url,
      statusUpdate: (status) => {
        console.log('Progress:', JSON.stringify(status))
      },
      onSuccess: (pdfDataURL) => {
        loadPDFData(pdfDataURL, pdf.name).then((pdf) => {
          compressedFiles.value.push(pdf as File)
          resolve(pdf)
        })
      },
      onError: () => {
        // TODO: Handle error
      }
    })
  })
}

const loadPDFData = (pdfDataURL: string, filename: string) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', pdfDataURL)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      window.URL.revokeObjectURL(pdfDataURL)
      const blob = new Blob([xhr.response], { type: 'application/pdf' })
      const pdf = new File([blob], filename, { type: blob.type })

      resolve(pdf)
    }
    xhr.send()
  })
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
