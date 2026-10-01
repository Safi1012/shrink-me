import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'
import type {
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestError
} from '@playwright/test/reporter'

/**
 * Replaces Playwright's `github` reporter, whose run summary is always titled
 * "Playwright Run Summary". With one CI job per browser those summaries could not be told
 * apart, so every annotation here names the browser it belongs to.
 */
export default class GitHubReporter implements Reporter {
  private root?: Suite

  onBegin(_config: unknown, suite: Suite) {
    this.root = suite
  }

  onEnd(result: FullResult) {
    if (!this.root) return

    const browsers = this.root.suites.map((project) => project.title).join(', ')
    const counts = { passed: 0, failed: 0, flaky: 0, skipped: 0 }

    for (const test of this.root.allTests()) {
      const outcome = test.outcome()
      if (outcome === 'expected') counts.passed++
      else if (outcome === 'skipped') counts.skipped++
      else if (outcome === 'flaky') {
        counts.flaky++
        annotate('warning', `Flaky: ${testTitle(test)}`, firstLine(lastErrors(test)), test)
      } else {
        counts.failed++
        annotate('error', testTitle(test), lastErrors(test), test)
      }
    }

    const summary = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([label, count]) => `${count} ${label}`)
      .join(' · ')
    annotate(
      'notice',
      `🎭 Playwright (${browsers})`,
      `${summary || 'No tests ran'} in ${formatDuration(result.duration)}`
    )
  }

  printsToStdio() {
    return false
  }
}

// e.g. "[webkit] › e2e/pdf.spec.ts:114 › keeps a pdf that ghostscript cannot shrink any further"
const testTitle = (test: TestCase) => {
  const [, browser, , ...titles] = test.titlePath()
  return `[${browser}] › ${relativePath(test.location.file)}:${test.location.line} › ${titles.join(' › ')}`
}

// The last attempt that failed: for a failed test the one that decided the outcome, for a
// flaky one the attempt before it passed
const failedAttempt = (test: TestCase) => test.results.findLast((result) => result.errors.length)

const lastErrors = (test: TestCase) =>
  (failedAttempt(test)?.errors ?? [])
    .map((error: TestError) => stripVTControlCharacters(error.message ?? error.value ?? ''))
    .join('\n\n')

const firstLine = (text: string) => text.split('\n')[0]

const relativePath = (file: string) =>
  path.relative(process.env.GITHUB_WORKSPACE ?? process.cwd(), file)

const formatDuration = (ms: number) =>
  ms < 60_000 ? `${(ms / 1000).toFixed(1)}s` : `${(ms / 60_000).toFixed(1)}m`

// https://docs.github.com/actions/reference/workflow-commands-for-github-actions
const escapeData = (value: string) =>
  value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')

const escapeProperty = (value: string) =>
  escapeData(value).replaceAll(':', '%3A').replaceAll(',', '%2C')

const annotate = (
  level: 'error' | 'warning' | 'notice',
  title: string,
  message: string,
  test?: TestCase
) => {
  const location = (test && failedAttempt(test)?.errors[0]?.location) ?? test?.location
  const properties = [`title=${escapeProperty(title)}`]
  if (location) {
    properties.push(
      `file=${escapeProperty(relativePath(location.file))}`,
      `line=${location.line}`,
      `col=${location.column}`
    )
  }
  console.log(`::${level} ${properties.join(',')}::${escapeData(message)}`)
}
