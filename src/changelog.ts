import changelog from '../CHANGELOG.md?raw'

export type ChangelogEntry = { scope?: string; text: string }
export type ChangelogSection = { title: string; entries: ChangelogEntry[] }
export type Release = { version: string; date?: string; sections: ChangelogSection[] }

// `## [1.2.0](https://github.com/…/compare/v1.1.0...v1.2.0) (2026-10-05)` or `## 1.0.0 (2026-10-01)`
const RELEASE = /^## \[?([^\]\s]+)\]?(?:\([^)]*\))?(?: \((\d{4}-\d{2}-\d{2})\))?/
const SECTION = /^### (.+)/
const ENTRY = /^[*-] (.+)/
// The `([abc1234](…/commit/…))` release-please appends to every entry
const COMMIT_LINK = /\s*\(\[[0-9a-f]{7,40}\]\([^)]*\)\)/g
const LINK = /\[([^\]]*)\]\([^)]*\)/g
const SCOPE = /^\*\*([^*]+):\*\* /

const parseEntry = (line: string): ChangelogEntry => {
  let text = line.replace(COMMIT_LINK, '').replace(LINK, '$1').trim()
  const scope = text.match(SCOPE)?.[1]
  if (scope) text = text.replace(SCOPE, '')
  // Conventional commit subjects are usually lower case
  return { scope, text: text.charAt(0).toUpperCase() + text.slice(1) }
}

/** Reads the CHANGELOG.md release-please writes, newest release first */
export const parseChangelog = (markdown: string): Release[] => {
  const releases: Release[] = []

  for (const line of markdown.split('\n')) {
    const release = line.match(RELEASE)
    if (release) {
      releases.push({ version: release[1]!, date: release[2], sections: [] })
      continue
    }

    const current = releases[releases.length - 1]
    if (!current) continue

    const section = line.match(SECTION)
    if (section) {
      current.sections.push({ title: section[1]!.trim(), entries: [] })
      continue
    }

    const entry = line.match(ENTRY)
    const currentSection = current.sections[current.sections.length - 1]
    if (entry && currentSection) currentSection.entries.push(parseEntry(entry[1]!))
  }

  return releases
}

export const releases = parseChangelog(changelog)
