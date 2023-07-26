// @ts-ignore
import { optimize } from 'svgo/dist/svgo.browser.js'

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

export default compressSVGs
