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

  test('shows an explicit focus indicator when keyboard navigation reaches primary controls', async ({ page }) => {
    await page.goto('/');

    await page.locator('#htmlEditor').focus();
    await page.keyboard.press('Tab');

    const renderButton = page.locator('#renderButton');
    await expect(renderButton).toBeFocused();

    const focusStyle = await renderButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineOffset: style.outlineOffset,
      };
    });

    expect(focusStyle.outlineStyle).not.toBe('none');
    expect(parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(3);
    expect(parseFloat(focusStyle.outlineOffset)).toBeGreaterThan(0);
  });

  test('removes hover scaling and effectively disables transitions with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const renderButton = page.locator('#renderButton');
    await renderButton.hover();

    const buttonMotion = await renderButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        transform: style.transform,
        transitionDuration: style.transitionDuration,
      };
    });

    const toggleLabel = page.locator('label', { hasText: 'Allow Scripts' }).locator('span');
    const labelTransitionDuration = await toggleLabel.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    );

    const seconds = (duration) => {
      if (duration.endsWith('ms')) return parseFloat(duration) / 1000;
      return parseFloat(duration);
    };

    expect(buttonMotion.transform).toBe('none');
    expect(seconds(buttonMotion.transitionDuration)).toBeLessThanOrEqual(0.001);
    expect(seconds(labelTransitionDuration)).toBeLessThanOrEqual(0.001);
  });
});
