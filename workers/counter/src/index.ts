import { DurableObject } from 'cloudflare:workers'

export type Totals = { compressedImages: number; savedBytes: number }

// One-off migration: the first time the Durable Object starts with empty storage it
// copies the totals over from the old Firebase Realtime Database
const FIREBASE_SNAPSHOT_URL = 'https://shrink-me-counter.firebaseio.com/.json'

const ALLOWED_ORIGINS = [/^https:\/\/shrinkme\.app$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/]

// Anything above this in a single batch is not a real user of the site
const MAX_FILES_PER_INCREMENT = 1_000
const MAX_SAVED_BYTES_PER_FILE = 1024 ** 3

const isTotals = (value: unknown): value is Totals =>
  typeof value === 'object' &&
  value !== null &&
  Number.isSafeInteger((value as Totals).compressedImages) &&
  Number.isSafeInteger((value as Totals).savedBytes)

const isValidIncrement = (value: unknown): value is Totals =>
  isTotals(value) &&
  value.compressedImages > 0 &&
  value.compressedImages <= MAX_FILES_PER_INCREMENT &&
  value.savedBytes >= 0 &&
  value.savedBytes <= value.compressedImages * MAX_SAVED_BYTES_PER_FILE

const parseIncrement = (message: string): Totals | undefined => {
  try {
    const increment: unknown = JSON.parse(message)
    return isValidIncrement(increment) ? increment : undefined
  } catch {
    return undefined
  }
}

/**
 * Single global counter. Clients hold a hibernatable WebSocket: while nothing
 * happens the object is evicted from memory and idle sockets cost nothing, and
 * every increment is pushed to all of them.
 */
export class Counter extends DurableObject<Env> {
  private totals: Totals = { compressedImages: 0, savedBytes: 0 }

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)

    ctx.blockConcurrencyWhile(async () => {
      const stored = ctx.storage.kv.get<Totals>('totals')

      if (stored) {
        this.totals = stored
        return
      }

      // Throwing leaves storage empty, so the next request retries the seed
      const response = await fetch(FIREBASE_SNAPSHOT_URL)
      const snapshot: unknown = await response.json()
      if (!isTotals(snapshot)) throw new Error('Unexpected Firebase snapshot')

      this.totals = {
        compressedImages: snapshot.compressedImages,
        savedBytes: snapshot.savedBytes
      }
      ctx.storage.kv.put('totals', this.totals)
    })
  }

  async fetch(): Promise<Response> {
    const { 0: client, 1: server } = new WebSocketPair()

    this.ctx.acceptWebSocket(server)
    server.send(JSON.stringify(this.totals))

    return new Response(null, { status: 101, webSocket: client })
  }

  async webSocketMessage(_ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== 'string') return

    const increment = parseIncrement(message)
    if (increment) this.add(increment)
  }

  async webSocketClose(ws: WebSocket, code: number) {
    // Complete the closing handshake (1005 means no code was sent and can't be echoed)
    ws.close(code === 1005 ? 1000 : code)
  }

  add(increment: Totals) {
    this.totals = {
      compressedImages: this.totals.compressedImages + increment.compressedImages,
      savedBytes: this.totals.savedBytes + increment.savedBytes
    }
    this.ctx.storage.kv.put('totals', this.totals)

    const message = JSON.stringify(this.totals)
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(message)
      } catch {
        // Socket is already closing, it will be dropped by the runtime
      }
    }
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    if (!ALLOWED_ORIGINS.some((allowed) => allowed.test(origin))) {
      return new Response('Forbidden', { status: 403 })
    }

    const counter = env.COUNTER.getByName('global')

    if (request.headers.get('Upgrade') === 'websocket') {
      return counter.fetch(request)
    }

    // Fallback for clients without an open socket (e.g. the counter isn't shown on small screens)
    if (request.method === 'POST') {
      const increment = parseIncrement(await request.text())
      if (!increment) return new Response('Bad Request', { status: 400 })

      await counter.add(increment)
      return new Response(null, { status: 204 })
    }

    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } })
  }
} satisfies ExportedHandler<Env>
