export const ghostScriptToPDF = (
  dataStruct,
  responseCallback,
  progressCallback,
  statusUpdateCallback
) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', dataStruct.psDataURL)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function () {
    const fileInputName = `${dataStruct.fileName}-input.pdf`
    const fileOutputName = `${dataStruct.fileName}-output.pdf`

    window.URL.revokeObjectURL(dataStruct.fileName)
    //set up EMScripten environment
    const Module = {
      preRun: [
        function () {
          window.FS.writeFile(fileInputName, new Uint8Array(xhr.response))
        }
      ],
      postRun: [
        function () {
          const uarray = window.FS.readFile(fileOutputName, { encoding: 'binary' }) //Uint8Array
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
      print: (text: string) => {
        statusUpdateCallback(text)
      },
      printErr: (text: string) => {
        statusUpdateCallback('Error: ' + text)
        console.error(text)
      },
      setStatus: (text: string) => {
        if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' }
        if (text === Module.setStatus.last.text) return

        const m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/)
        const now = Date.now()

        if (m && now - Module.setStatus.last.time < 30)
          // if this is a progress update, skip it if too soon
          return
        Module.setStatus.last.time = now
        Module.setStatus.last.text = text
        // if (m) {
        //   text = m[1]
        //   progressCallback(false, parseInt(m[2]) * 100, parseInt(m[4]) * 100)
        // } else {
        //   progressCallback(true, 0, 0)
        // }
        statusUpdateCallback(text)
      },
      totalDependencies: 0
    }
    Module.setStatus('Loading Ghostscript...')
    window.Module = Module

    import('./gs').then((gs) => {
      console.log('IMPORTED check')
      gs.executeModule()
    })
  }
  xhr.send()
}
