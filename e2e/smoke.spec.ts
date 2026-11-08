import { test, expect } from '@playwright/test'

// Every route has to mount without a runtime error. A dependency bump that
// builds fine can still break at runtime (a react / react-dom mismatch did).
const routes = ['/', '/discover', '/saved', '/meal-plan', '/grocery', '/add-recipe', '/settings']

for (const route of routes) {
  test(`${route} renders without errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

    await page.goto(route)
    await expect(page.locator('main, #root').first()).not.toBeEmpty()
    await page.waitForTimeout(500)

    expect(errors).toEqual([])
  })
}

test('discover search is driven by the URL', async ({ page }) => {
  await page.goto('/discover?q=pasta')
  await expect(page.getByPlaceholder(/Search pasta/)).toHaveValue('pasta')
  await page.getByPlaceholder(/Search pasta/).fill('salad')
  await expect(page).toHaveURL(/q=salad/)
})
