const { test, expect } = require('@playwright/test');

test.describe('Project explanation', () => {
  test('explains the local preview and sharing model on the public entry page', async ({ page }) => {
    await page.goto('/');

    const explanation = page.locator('#howItWorks');

    await expect(explanation).toBeVisible();
    await expect(explanation).toContainText('locally in your browser');
    await expect(explanation).toContainText('no rendering backend');
    await expect(explanation).toContainText('URL or Gist');
    await expect(page.locator('#htmlEditor')).toBeVisible();
    await expect(page.locator('#renderButton')).toBeVisible();
  });
});
