import { expect, test, type Page } from '@playwright/test'
import { expectSuccess, fixture, mockCounter, save } from './support'

test.use({ locale: 'en-US' })

// Records every Content-Security-Policy violation, including those in the Ghostscript worker,
// which reports to the page's console
const recordViolations = async (page: Page) => {
  const violations: string[] = []
  page.on('console', (message) => {
    if (/Content.Security.Policy/i.test(message.text())) violations.push(message.text())
  })
  await page.exposeFunction('__reportViolation', (violation: string) => violations.push(violation))
  await page.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (event) =>
      (window as any).__reportViolation(`${event.violatedDirective} ${event.blockedURI}`)
    )
  )
  return violations
}

test.beforeEach(async ({ page }) => {
  await mockCounter(page)
  const response = await page.goto('/')
  // The policy comes from public/_headers, which only `vite preview` sends (as on CI)
  test.skip(
    !response?.headers()['content-security-policy'],
    'only runs against the production build'
  )
})

for (const name of ['photo.jpg', 'drawing.svg', 'document.pdf']) {
  test(`compresses ${name} without violating the Content-Security-Policy`, async ({ page }) => {
    const violations = await recordViolations(page)
    await page.reload()

    await page.locator('#fileButton').setInputFiles(fixture(name))
    await expectSuccess(page)
    await save(page)

    expect(violations).toEqual([])
  })
}

test('renders every page without violating the Content-Security-Policy', async ({ page }) => {
  const violations = await recordViolations(page)

  for (const route of ['/', '/credits', '/contact', '/changelog', '/privacy', '/legal']) {
    await page.goto(route)
    await page.waitForLoadState('networkidle')
  }

  expect(violations).toEqual([])
})
