const { test, expect } = require('@playwright/test');

test.describe('Script trust disclosure', () => {
  test('explains the isolation change before scripts are enabled', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#sandboxToggle');
    const help = page.locator('#sandboxHelp');
    const iframe = page.locator('#iframe');

    await expect(toggle).not.toBeChecked();
    await expect(toggle).toHaveAttribute('aria-describedby', 'sandboxHelp');
    await expect(help).toBeVisible();
    await expect(help).toContainText('trusted HTML');
    await expect(help).toContainText('reduces preview isolation');
    await expect(iframe).toHaveAttribute('sandbox', '');

    await toggle.check();

    const sandbox = await iframe.getAttribute('sandbox');
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-same-origin');
  });
});
