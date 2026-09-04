const { test, expect } = require('@playwright/test');

test.describe('Shareable URL size feedback', () => {
  test('keeps normal links shareable', async ({ page }) => {
    await page.goto('/');
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const html = '<h1>Small shareable state</h1>';
    await page.fill('#htmlEditor', html);
    await page.click('#copyLinkButton');

    await expect(page.locator('#copyLinkButton')).toHaveText('Copied!');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(`?data=${encodeURIComponent(html)}`);
    await expect(page.locator('#errorMessage')).toBeHidden();
  });

  test('refuses oversized Copy Link without claiming success', async ({ page }) => {
    await page.goto('/');
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.evaluate(() => navigator.clipboard.writeText('keep-me'));
    const largeHtml = `<div>${'A'.repeat(9000)}</div>`;
    await page.fill('#htmlEditor', largeHtml);

    await page.click('#copyLinkButton');

    await expect(page.locator('#copyLinkButton')).toHaveText('Copy Link');
    await expect(page.locator('#errorMessage')).toContainText(
      'too large for a reliable shareable link',
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('keep-me');
    await expect(page.locator('#htmlEditor')).toHaveValue(largeHtml);
  });

  test('refuses oversized Update URL and preserves editor state', async ({ page }) => {
    await page.goto('/');

    const largeHtml = `<main>${'B'.repeat(9000)}</main>`;
    await page.fill('#htmlEditor', largeHtml);
    const originalUrl = page.url();

    await page.click('#updateUrlButton');

    expect(page.url()).toBe(originalUrl);
    await expect(page.locator('#errorMessage')).toContainText(
      'too large for a reliable shareable link',
    );
    await expect(page.locator('#htmlEditor')).toHaveValue(largeHtml);
  });
});
