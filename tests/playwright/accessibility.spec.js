const { test, expect } = require('@playwright/test');

test.describe('Workspace accessibility semantics', () => {
  test('names the rendered preview surface and exposes it as a section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Preview', level: 2 })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="previewHeading"]')).toBeVisible();
    await expect(page.locator('#iframe')).toHaveAttribute('title', 'Rendered HTML preview');
    await expect(page.locator('label', { hasText: 'Preview' })).toHaveCount(0);
  });
});
