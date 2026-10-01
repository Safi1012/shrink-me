import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

class FakeWebSocket extends EventTarget {
  static readonly OPEN = 1
  static instances: FakeWebSocket[] = []

  readyState = 0
  sent: string[] = []

  constructor(readonly url: string) {
    super()
    FakeWebSocket.instances.push(this)
  }

  send(message: string) {
    this.sent.push(message)
  }

  close() {
    this.readyState = 3
    this.dispatchEvent(new Event('close'))
  }

  // Test helpers standing in for the server
  open() {
    this.readyState = FakeWebSocket.OPEN
    this.dispatchEvent(new Event('open'))
  }

  receive(totals: object) {
    this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(totals) }))
  }
}

const sockets = FakeWebSocket.instances
const lastSocket = () => sockets[sockets.length - 1]!

let hidden = false
const setHidden = (value: boolean) => {
  hidden = value
  document.dispatchEvent(new Event('visibilitychange'))
}

const fetchMock = vi.fn()

// counter.ts keeps its socket and totals at module level, so every test gets a fresh copy
const loadCounter = () => import('./counter')

const subscribe = async () => {
  const { useCounter } = await loadCounter()
  let totals!: ReturnType<typeof useCounter>
  const wrapper = mount(
    defineComponent({
      setup() {
        totals = useCounter()
        return () => h('div')
      }
    })
  )
  return { totals, unmount: () => wrapper.unmount() }
}

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  sockets.length = 0
  hidden = false
  localStorage.clear()
  fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }))
  vi.stubGlobal('WebSocket', FakeWebSocket)
  vi.stubGlobal('fetch', fetchMock)
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden })
  // Always wait for the longest delay backoff allows
  vi.spyOn(Math, 'random').mockReturnValue(0.999_999)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useCounter', () => {
  it('shows the last known totals before the socket connects', async () => {
    localStorage.setItem(
      'counter-snapshot',
      JSON.stringify({ compressedImages: 7, savedBytes: 70 })
    )

    const { totals } = await subscribe()

    expect(totals.value).toEqual({ compressedImages: 7, savedBytes: 70 })
  })

  it('starts without totals when the snapshot is broken', async () => {
    localStorage.setItem('counter-snapshot', '{broken')

    const { totals } = await subscribe()

    expect(totals.value).toBeNull()
  })

  it('shows and remembers the totals the server sends', async () => {
    const { totals } = await subscribe()

    lastSocket().receive({ compressedImages: 3, savedBytes: 300 })

    expect(totals.value).toEqual({ compressedImages: 3, savedBytes: 300 })
    expect(JSON.parse(localStorage.getItem('counter-snapshot')!)).toEqual({
      compressedImages: 3,
      savedBytes: 300
    })
  })

  it('shares one socket between all subscribers and closes it after the last one', async () => {
    const first = await subscribe()
    const second = await subscribe()

    expect(sockets).toHaveLength(1)
    expect(lastSocket().url).toBe(`ws://${location.host}/api/counter`)

    first.unmount()
    expect(lastSocket().readyState).not.toBe(3)

    second.unmount()
    expect(lastSocket().readyState).toBe(3)

    // Closing it on purpose never reconnects
    await vi.runAllTimersAsync()
    expect(sockets).toHaveLength(1)
  })
})

describe('reconnecting', () => {
  it('backs off exponentially up to a minute', async () => {
    await subscribe()

    const delays: number[] = []
    for (let attempt = 0; attempt < 9; attempt++) {
      const before = sockets.length
      lastSocket().close()
      const start = Date.now()
      while (sockets.length === before) await vi.advanceTimersByTimeAsync(100)
      delays.push(Math.round((Date.now() - start) / 1000))
    }

    expect(delays).toEqual([1, 2, 4, 8, 16, 32, 60, 60, 60])
  })

  it('starts over with a short delay once the server answered again', async () => {
    await subscribe()
    for (let attempt = 0; attempt < 3; attempt++) {
      lastSocket().close()
      await vi.runOnlyPendingTimersAsync()
    }
    expect(sockets).toHaveLength(4)

    lastSocket().receive({ compressedImages: 1, savedBytes: 1 })
    lastSocket().close()
    await vi.advanceTimersByTimeAsync(1_000)

    expect(sockets).toHaveLength(5)
  })

  it('waits for a hidden tab to be looked at again', async () => {
    await subscribe()
    hidden = true

    lastSocket().close()
    await vi.runAllTimersAsync()
    expect(sockets).toHaveLength(1)

    setHidden(false)
    expect(sockets).toHaveLength(2)
  })

  it('keeps the open socket when a tab becomes visible again', async () => {
    await subscribe()

    setHidden(true)
    setHidden(false)

    expect(sockets).toHaveLength(1)
  })
})

describe('addToCounter', () => {
  const increment = { compressedImages: 2, savedBytes: 2048 }

  it('sends the increment over the open socket', async () => {
    await subscribe()
    lastSocket().open()
    const { addToCounter } = await loadCounter()

    addToCounter(increment)

    expect(lastSocket().sent).toEqual([JSON.stringify(increment)])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    ['nothing subscribed to the counter', false],
    ['the socket is still connecting', true]
  ])('posts the increment when %s', async (_, subscribed) => {
    if (subscribed) await subscribe()
    const { addToCounter } = await loadCounter()

    addToCounter(increment)

    expect(fetchMock).toHaveBeenCalledWith('/api/counter', {
      method: 'POST',
      body: JSON.stringify(increment),
      // Lets the request finish even when the tab is closed right after
      keepalive: true
    })
    expect(sockets.flatMap(({ sent }) => sent)).toEqual([])
  })

  it('never lets a failed request reach the user', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    const unhandled = vi.fn()
    process.on('unhandledRejection', unhandled)
    const { addToCounter } = await loadCounter()

    expect(() => addToCounter(increment)).not.toThrow()
    await vi.runAllTimersAsync()

    process.off('unhandledRejection', unhandled)
    expect(unhandled).not.toHaveBeenCalled()
  })
})
