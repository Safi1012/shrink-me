export interface GhostscriptRequest {
  id: number
  pdf: ArrayBuffer
}

export type GhostscriptResponse =
  | { id: number; pdf: Uint8Array<ArrayBuffer> }
  | { id: number; error: string }
  | { id: number; progress: number }

type ProgressCallback = (progress: number) => void

// Ghostscript runs in a worker so a large PDF never freezes the page. The worker is only
// started for the first PDF (its wasm is ~15 MB) and then kept around for the next ones
let worker: Worker | undefined
let nextId = 0
const pending = new Map<
  number,
  {
    resolve: (pdf: Uint8Array<ArrayBuffer>) => void
    reject: (err: Error) => void
    onProgress?: ProgressCallback
  }
>()

const getWorker = () => {
  if (worker) return worker

  worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = ({ data }: MessageEvent<GhostscriptResponse>) => {
    const request = pending.get(data.id)
    if ('progress' in data) return request?.onProgress?.(data.progress)

    pending.delete(data.id)
    if ('error' in data) request?.reject(new Error(data.error))
    else request?.resolve(data.pdf)
  }
  // A crashed worker (e.g. the wasm failed to load) fails every open request, and the
  // next PDF starts a fresh one
  worker.onerror = (event) => {
    event.preventDefault()
    worker?.terminate()
    worker = undefined
    for (const { reject } of pending.values()) {
      reject(new Error(event.message || 'Ghostscript worker failed'))
    }
    pending.clear()
  }
  return worker
}

export const ghostscriptCompress = async (pdf: Blob, onProgress?: ProgressCallback) => {
  const buffer = await pdf.arrayBuffer()
  const id = nextId++

  return new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress })
    getWorker().postMessage({ id, pdf: buffer } satisfies GhostscriptRequest, [buffer])
  })
}
