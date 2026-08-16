const { test, expect } = require('@playwright/test');

test.describe('Editor / preview accessibility', () => {
  test('exposes the preview and dynamic errors semantically', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('iframe[title="Preview"][aria-labelledby="previewHeading"]')).toBeVisible();
    await expect(page.locator('#previewHeading')).toHaveText('Preview');
    await expect(page.locator('#errorMessage')).toHaveAttribute('role', 'alert');
    await expect(page.locator('[role="group"][aria-label="Editor actions"]')).toBeVisible();
    await expect(page.locator('[role="group"][aria-label="Preview settings"]')).toBeVisible();
  });

  test('keeps keyboard focus visible on primary actions', async ({ page }) => {
    await page.goto('/');

    const renderButton = page.locator('#renderButton');
    await renderButton.focus();

    const outlineStyle = await renderButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return `${style.outlineStyle} ${style.outlineWidth}`;
    });

    expect(outlineStyle).not.toContain('none 0px');
  });

  test('removes hover scaling when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const renderButton = page.locator('#renderButton');
    await renderButton.hover();

    await expect(renderButton).toHaveCSS('transform', 'none');
  });
});
