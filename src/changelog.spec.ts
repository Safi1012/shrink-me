import { describe, expect, it } from 'vitest'
import { version } from '../package.json'
import { parseChangelog, releases } from './changelog'

describe('parseChangelog', () => {
  it('reads the releases, sections and entries release-please writes', () => {
    const markdown = `# Changelog

## [1.1.0](https://github.com/Safi1012/shrink-me/compare/v1.0.0...v1.1.0) (2026-10-05)


### ⚠ BREAKING CHANGES

* drop support for Safari 15

### Features

* **pdf:** let the quality be chosen ([#12](https://github.com/Safi1012/shrink-me/issues/12)) ([1a2b3c4](https://github.com/Safi1012/shrink-me/commit/1a2b3c4d5e6f))
* show a changelog ([5d6e7f8](https://github.com/Safi1012/shrink-me/commit/5d6e7f8))


### Bug Fixes

* keep \`.svg\` files as they are ([9a8b7c6](https://github.com/Safi1012/shrink-me/commit/9a8b7c6))

## 1.0.0 (2026-10-01)


### Features

* compress PDFs
`

    expect(parseChangelog(markdown)).toEqual([
      {
        version: '1.1.0',
        date: '2026-10-05',
        sections: [
          { title: '⚠ BREAKING CHANGES', entries: [{ text: 'Drop support for Safari 15' }] },
          {
            title: 'Features',
            entries: [
              { scope: 'pdf', text: 'Let the quality be chosen (#12)' },
              { text: 'Show a changelog' }
            ]
          },
          { title: 'Bug Fixes', entries: [{ text: 'Keep `.svg` files as they are' }] }
        ]
      },
      {
        version: '1.0.0',
        date: '2026-10-01',
        sections: [{ title: 'Features', entries: [{ text: 'Compress PDFs' }] }]
      }
    ])
  })

  it('ignores everything before the first release', () => {
    expect(parseChangelog('# Changelog\n\n* stray entry\n')).toEqual([])
  })
})

describe('releases', () => {
  // release-please bumps both in the same pull request
  it('starts with the version in package.json', () => {
    expect(releases[0]?.version).toBe(version)
  })
})
