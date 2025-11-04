const { test, expect } = require('@playwright/test');

test.describe('Editor Controls', () => {
  test('should clear editor and iframe when clicking Clear button', async ({ page }) => {
    await page.goto('/');

    // Fill editor with content
    const htmlContent = '<h1>Content to be cleared</h1>';
    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    // Verify content is rendered
    let iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('Content to be cleared');

    // Click clear button
    await page.click('#clearEditorButton');
    await page.waitForTimeout(300);

    // Verify editor is cleared
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe('');

    // Verify iframe is cleared (should be empty)
    iframe = page.frameLocator('#iframe');
    const bodyText = await iframe.locator('body').textContent();
    expect(bodyText).toBe('');
  });

  test('should copy shareable link to clipboard when clicking Copy Link button', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<h1>Test Content</h1>';
    await page.fill('#htmlEditor', htmlContent);

    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click copy link button
    await page.click('#copyLinkButton');

    // Wait for the button text to change to "Copied!"
    await expect(page.locator('#copyLinkButton')).toHaveText('Copied!');

    // Read clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

    // Verify clipboard contains the shareable link
    expect(clipboardContent).toContain('?data=');
    expect(clipboardContent).toContain(encodeURIComponent(htmlContent));

    // Wait for button text to revert back
    await page.waitForTimeout(2500);
    await expect(page.locator('#copyLinkButton')).toHaveText('Copy Link');
  });

  test('should render HTML when clicking Render button', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<h1>Render Button Test</h1><p>Testing render functionality</p>';
    await page.fill('#htmlEditor', htmlContent);

    // Initially, iframe might be empty
    let iframe = page.frameLocator('#iframe');

    // Click render button
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    // Verify content is rendered
    await expect(iframe.locator('h1')).toHaveText('Render Button Test');
    await expect(iframe.locator('p')).toHaveText('Testing render functionality');
  });

  test('should update browser URL when clicking Update URL button', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<h1>URL Update Test</h1>';
    await page.fill('#htmlEditor', htmlContent);

    // Click update URL button
    await page.click('#updateUrlButton');
    await page.waitForTimeout(300);

    // Verify URL has been updated with the content
    const url = page.url();
    expect(url).toContain('?data=');
    expect(decodeURIComponent(url)).toContain(htmlContent);

    // Verify page didn't reload (editor content should still be there)
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe(htmlContent);
  });

  test('should handle multiple render operations', async ({ page }) => {
    await page.goto('/');

    // First render
    await page.fill('#htmlEditor', '<h1>First</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    let iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('First');

    // Second render
    await page.fill('#htmlEditor', '<h1>Second</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    await expect(iframe.locator('h1')).toHaveText('Second');

    // Third render
    await page.fill('#htmlEditor', '<h1>Third</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    await expect(iframe.locator('h1')).toHaveText('Third');
  });

  test('should allow typing in editor textarea', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<p>Testing textarea input</p>';

    // Type content character by character
    await page.locator('#htmlEditor').click();
    await page.keyboard.type(htmlContent);

    // Verify content is in the editor
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe(htmlContent);
  });

  test('should preserve editor content after rendering', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<h1>Persistent Content</h1>';
    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    // Verify editor still has the content after rendering
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe(htmlContent);
  });

  test('should handle rapid button clicks', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<h1>Rapid Click Test</h1>';
    await page.fill('#htmlEditor', htmlContent);

    // Click render button multiple times rapidly
    await page.click('#renderButton');
    await page.click('#renderButton');
    await page.click('#renderButton');

    await page.waitForTimeout(500);

    // Should still render correctly
    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('Rapid Click Test');
  });

  test('should handle clear followed by new content', async ({ page }) => {
    await page.goto('/');

    // Add content, render, then clear
    await page.fill('#htmlEditor', '<h1>Original</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(300);
    await page.click('#clearEditorButton');
    await page.waitForTimeout(300);

    // Add new content and render
    await page.fill('#htmlEditor', '<h1>New Content</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('New Content');
  });

  test('should handle large HTML content in editor', async ({ page }) => {
    await page.goto('/');

    // Generate large HTML content
    let largeHtml = '<div>';
    for (let i = 0; i < 100; i++) {
      largeHtml += `<p>Paragraph ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`;
    }
    largeHtml += '</div>';

    await page.fill('#htmlEditor', largeHtml);
    await page.click('#renderButton');
    await page.waitForTimeout(1000);

    const iframe = page.frameLocator('#iframe');
    const paragraphs = iframe.locator('p');
    const count = await paragraphs.count();

    expect(count).toBe(100);
    await expect(paragraphs.first()).toContainText('Paragraph 0');
    await expect(paragraphs.last()).toContainText('Paragraph 99');
  });

  test('should copy link with empty editor', async ({ page }) => {
    await page.goto('/');
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    // Clear editor if it has any content
    await page.fill('#htmlEditor', '');

    // Click copy link with empty content
    await page.click('#copyLinkButton');
    await expect(page.locator('#copyLinkButton')).toHaveText('Copied!');

    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain('?data=');
  });

  test('should update URL with empty content', async ({ page }) => {
    await page.goto('/');

    await page.fill('#htmlEditor', '');
    await page.click('#updateUrlButton');
    await page.waitForTimeout(300);

    const url = page.url();
    expect(url).toContain('?data=');
  });
});
