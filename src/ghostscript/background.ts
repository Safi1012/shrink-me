declare global {
  interface Window {
    FS: any
    Ghostscript: {
      preRun: (() => void)[]
      postRun: (() => void)[]
      arguments: string[]
      printErr: (text: string) => void
      setStatus: (text: string) => void
      totalDependencies: number
    }
  }
}

export const ghostScriptToPDF = (
  dataStruct,
  responseCallback,
  progressCallback,
  statusUpdateCallback
) => {
  const fileInputName = `input.pdf`
  const fileOutputName = `output.pdf`
  const xhr = new XMLHttpRequest()

  xhr.open('GET', dataStruct.psDataURL)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function () {
    window.URL.revokeObjectURL(dataStruct.fileName)

    //set up EMScripten environment
    const Ghostscript = {
      preRun: [
        function () {
          window.FS.writeFile(fileInputName, new Uint8Array(xhr.response))
        }
      ],
      postRun: [
        function () {
          const uarray = window.FS.readFile(fileOutputName, { encoding: 'binary' })
          const blob = new Blob([uarray], { type: 'application/octet-stream' })
          const pdfDataURL = window.URL.createObjectURL(blob)
          responseCallback({ pdfDataURL: pdfDataURL, url: dataStruct.url })
        }
      ],
      arguments: [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/ebook',
        '-DNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        `-sOutputFile=${fileOutputName}`,
        fileInputName
      ],
      printErr: (text: string) => {
        statusUpdateCallback('Error: ' + text)
        console.error(text)
      },
      setStatus: (text: string) => {
        statusUpdateCallback(text)
      },
      totalDependencies: 0
    }
    Ghostscript.setStatus('Loading Ghostscript...')
    window.Ghostscript = Ghostscript

    import('./gs').then((gs) => {
      gs.executeModule()
    })
  }
  xhr.send()
}
