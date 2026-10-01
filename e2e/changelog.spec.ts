import { expect, test } from '@playwright/test'
import packageJson from '../package.json' with { type: 'json' }

const { version } = packageJson

test.use({ locale: 'en-US' })

test('opens the changelog from the version on the contact page', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('link', { name: `Version: ${version}` }).click()

  await expect(page).toHaveURL('/changelog')
  await expect(page.getByRole('heading', { level: 1, name: 'Changelog' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(version)
})
