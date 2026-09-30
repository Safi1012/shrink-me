import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFileStore } from '../file'
import { useProgressStore } from '../progress'

beforeEach(() => {
  setActivePinia(createPinia())
})

const file = (name: string, type: string) => new File(['x'], name, { type })

// setFiles gets the input's (or the drop's) FileList, which is indexed like an array
const fileList = (files: File[]) => files as unknown as FileList

describe('file store', () => {
  it('keeps only the file types Shrink Me can compress', () => {
    const store = useFileStore()
    const supported = [
      file('a.jpg', 'image/jpeg'),
      file('b.png', 'image/png'),
      file('c.webp', 'image/webp'),
      file('d.svg', 'image/svg+xml'),
      file('e.pdf', 'application/pdf')
    ]

    store.setFiles(
      fileList([
        ...supported,
        file('f.gif', 'image/gif'),
        file('g.txt', 'text/plain'),
        file('h.heic', 'image/heic'),
        file('unknown', '')
      ])
    )

    expect(store.files).toEqual(supported)
  })

  it('replaces the previous selection', () => {
    const store = useFileStore()
    store.setFiles(fileList([file('a.jpg', 'image/jpeg')]))
    store.setFiles(fileList([file('b.png', 'image/png')]))

    expect(store.files.map(({ name }) => name)).toEqual(['b.png'])
  })

  it('forgets the selected and the compressed files on reset', () => {
    const store = useFileStore()
    store.setFiles(fileList([file('a.jpg', 'image/jpeg')]))
    store.compressedFiles.push(file('a.jpg', 'image/jpeg'))

    store.resetFiles()

    expect(store.files).toEqual([])
    expect(store.compressedFiles).toEqual([])
  })
})

describe('progress store', () => {
  it('goes from select to compress to export and back to select', () => {
    const store = useProgressStore()
    const stages = [store.stage]
    for (let i = 0; i < 3; i++) {
      store.incrementStage()
      stages.push(store.stage)
    }

    expect(stages).toEqual([0, 1, 2, 0])
  })

  it('measures the border of the drop area the progress runs along', () => {
    const store = useProgressStore()
    store.setDimensions(320, 180)

    expect(store.circumference).toBe(1000)
  })

  it('starts over at the first stage without any progress', () => {
    const store = useProgressStore()
    store.incrementStage()
    store.setPercentage(0.5)

    store.resetProgress()

    expect(store.stage).toBe(0)
    expect(store.percentage).toBe(0)
  })
})
