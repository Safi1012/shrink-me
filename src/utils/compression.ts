import { optimize } from 'svgo/dist/svgo.browser.js'
import { ghostScriptToPDF } from '@/ghostscript/background'
import Compressor from 'compressorjs'
import type { Ref } from 'vue'

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
  const dataObject = { psDataURL: url, fileName: pdf.name }

  await new Promise((resolve) => {
    ghostScriptToPDF(
      dataObject,
      (element) => {
        loadPDFData(element, pdf.name).then((pdf) => {
          compressedFiles.value.push(pdf as File)
          resolve(pdf)
        })
      },
      (...args) => console.log('Progress:', JSON.stringify(args)),
      (element) => {
        console.log('Status Update:', JSON.stringify(element))
      }
    )
  })
}

const loadPDFData = (response: { pdfDataURL: string; url: string }, filename: string) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', response.pdfDataURL)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      window.URL.revokeObjectURL(response.pdfDataURL)
      const blob = new Blob([xhr.response], { type: 'application/pdf' })
      const pdf = new File([blob], filename, { type: blob.type })

      resolve(pdf)
    }
    xhr.send()
  })
}

const compressSVGs = (svgFile: File) => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const svgTree = event?.target?.result
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
