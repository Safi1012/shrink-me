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

interface GhostscriptProps {
  url: string
  name: string
  statusUpdate: (status: string) => void
  onSuccess: (pdfDataURL: string) => void
  onError: (error: Error) => void
}

export const ghostScriptToPDF = ({
  url,
  name,
  statusUpdate,
  onSuccess,
  onError
}: GhostscriptProps) => {
  const fileInputName = `${name}-input.pdf`
  const fileOutputName = `${name}-output.pdf`
  const xhr = new XMLHttpRequest()

  xhr.open('GET', url)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function () {
    window.URL.revokeObjectURL(name)

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
          onSuccess(pdfDataURL)
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
        onError(new Error(text))
      },
      setStatus: (text: string) => {
        statusUpdate(text)
      },
      totalDependencies: 0
    }
    Ghostscript.setStatus('Loading Ghostscript...')
    window.Ghostscript = Ghostscript

    // @ts-ignore
    import('../ghostscript/gs').then((gs) => {
      gs.executeModule()
    })
  }
  xhr.send()
}
