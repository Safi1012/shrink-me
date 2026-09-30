import { onMounted, onUnmounted, readonly, ref } from 'vue'

export type CounterTotals = { compressedImages: number; savedBytes: number }

const ENDPOINT = '/api/counter'
const SNAPSHOT_KEY = 'counter-snapshot'
const RECONNECT_BASE_DELAY = 1_000
const RECONNECT_MAX_DELAY = 60_000

const readSnapshot = (): CounterTotals | null => {
  try {
    return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) ?? 'null')
  } catch {
    return null
  }
}

const writeSnapshot = (value: CounterTotals) => {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(value))
  } catch {
    // Storage is unavailable (private mode, quota), the live value still works
  }
}

// Render the last known totals instantly, the socket replaces them once connected
const totals = ref<CounterTotals | null>(readSnapshot())

let socket: WebSocket | null = null
let subscribers = 0
let failedAttempts = 0
let reconnectTimer: ReturnType<typeof setTimeout> | undefined

const connect = () => {
  clearTimeout(reconnectTimer)
  if (socket || !subscribers) return

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const ws = new WebSocket(`${protocol}//${location.host}${ENDPOINT}`)
  socket = ws

  ws.addEventListener('message', ({ data }) => {
    failedAttempts = 0
    totals.value = JSON.parse(data)
    writeSnapshot(totals.value!)
  })

  ws.addEventListener('close', () => {
    if (socket !== ws) return
    socket = null
    scheduleReconnect()
  })
}

// Exponential backoff with full jitter, so a Worker deploy (which drops every socket)
// doesn't make all open tabs reconnect in the same instant
const scheduleReconnect = () => {
  if (!subscribers || document.hidden) return

  const ceiling = Math.min(RECONNECT_MAX_DELAY, RECONNECT_BASE_DELAY * 2 ** failedAttempts++)
  reconnectTimer = setTimeout(connect, Math.random() * ceiling)
}

// Background tabs keep an open socket (idle sockets are free), but a dropped one
// is only replaced once somebody looks at the page again
const onVisibilityChange = () => {
  if (!document.hidden) connect()
}

/** Live totals, pushed by the server over a WebSocket shared by all subscribers */
export const useCounter = () => {
  onMounted(() => {
    if (subscribers++ === 0) document.addEventListener('visibilitychange', onVisibilityChange)
    connect()
  })

  onUnmounted(() => {
    if (--subscribers > 0) return

    document.removeEventListener('visibilitychange', onVisibilityChange)
    clearTimeout(reconnectTimer)
    const ws = socket
    socket = null
    ws?.close()
  })

  return readonly(totals)
}

/** Adds to the global totals, reusing the open socket when there is one */
export const addToCounter = (increment: CounterTotals) => {
  const message = JSON.stringify(increment)

  // Messages on an existing socket are ~20x cheaper than a new request
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(message)
    return
  }

  fetch(ENDPOINT, { method: 'POST', body: message, keepalive: true }).catch(() => {
    // The counter is best effort, never bother the user about it
  })
}
