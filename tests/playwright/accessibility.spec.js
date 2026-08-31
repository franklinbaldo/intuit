const { test, expect } = require('@playwright/test');

test.describe('Workspace accessibility semantics', () => {
  test('names the rendered preview surface and exposes it as a section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Preview', level: 2 })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="previewHeading"]')).toBeVisible();
    await expect(page.locator('#iframe')).toHaveAttribute('title', 'Rendered HTML preview');
    await expect(page.locator('label', { hasText: 'Preview' })).toHaveCount(0);
  });

  test('exposes dynamic errors and workspace control groups semantically', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#errorMessage')).toHaveAttribute('role', 'alert');
    await expect(page.locator('#errorMessage')).toHaveAttribute('aria-live', 'assertive');
    await expect(page.getByRole('group', { name: 'Editor actions' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Preview settings' })).toBeVisible();
  });

  test('preserves the strict default sandbox contract', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#iframe')).toHaveAttribute('sandbox', '');
    await page.locator('#htmlEditor').fill('<h1>Strict sandbox preview</h1>');
    await page.locator('#renderButton').click();
    await expect(page.locator('#iframe')).toHaveAttribute('srcdoc', '<h1>Strict sandbox preview</h1>');
  });
});
