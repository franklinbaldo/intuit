const { test, expect } = require('@playwright/test');

test.describe('URL Parameter Loading', () => {
  test('should load and render HTML from ?data= parameter', async ({ page }) => {
    const htmlContent = '<h1>Hello from URL</h1><p>This was loaded from data parameter</p>';
    const encodedHtml = encodeURIComponent(htmlContent);

    await page.goto(`/?data=${encodedHtml}`);
    await page.waitForTimeout(500);

    // Verify HTML is rendered in iframe
    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('Hello from URL');
    await expect(iframe.locator('p')).toHaveText('This was loaded from data parameter');

    // Verify editor is populated with the HTML
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe(htmlContent);
  });

  test('should load and render HTML from ?b64= parameter', async ({ page }) => {
    const htmlContent = '<h1>Base64 Content</h1><p>Loaded from base64</p>';
    // Encode to base64
    const base64Html = Buffer.from(htmlContent).toString('base64');

    await page.goto(`/?b64=${base64Html}`);
    await page.waitForTimeout(500);

    // Verify HTML is rendered in iframe
    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('Base64 Content');
    await expect(iframe.locator('p')).toHaveText('Loaded from base64');

    // Verify editor is populated with the decoded HTML
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe(htmlContent);
  });

  test('should prioritize ?data= over ?b64= parameter', async ({ page }) => {
    const dataHtml = '<h1>From data parameter</h1>';
    const b64Html = '<h1>From b64 parameter</h1>';
    const encodedData = encodeURIComponent(dataHtml);
    const encodedB64 = Buffer.from(b64Html).toString('base64');

    await page.goto(`/?data=${encodedData}&b64=${encodedB64}`);
    await page.waitForTimeout(500);

    // Should render content from data parameter (higher priority)
    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('From data parameter');
  });

  test('should handle complex HTML in ?data= parameter', async ({ page }) => {
    const complexHtml = `
      <div style="background: #f0f0f0; padding: 20px;">
        <h1 style="color: blue;">Complex HTML</h1>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <table border="1">
          <tr><td>Cell 1</td><td>Cell 2</td></tr>
        </table>
      </div>
    `;
    const encodedHtml = encodeURIComponent(complexHtml);

    await page.goto(`/?data=${encodedHtml}`);
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('Complex HTML');
    await expect(iframe.locator('ul li')).toHaveCount(3);
    await expect(iframe.locator('table td')).toHaveCount(2);
  });

  test('should handle special characters in ?data= parameter', async ({ page }) => {
    const htmlContent = '<p>Special: &lt;script&gt; &amp; &quot;quotes&quot;</p>';
    const encodedHtml = encodeURIComponent(htmlContent);

    await page.goto(`/?data=${encodedHtml}`);
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    const text = await iframe.locator('p').textContent();
    expect(text).toContain('Special:');
    expect(text).toContain('&');
  });

  test('should handle empty ?data= parameter', async ({ page }) => {
    await page.goto('/?data=');
    await page.waitForTimeout(500);

    // Editor should be empty
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe('');
  });

  test('should handle empty ?b64= parameter', async ({ page }) => {
    await page.goto('/?b64=');
    await page.waitForTimeout(500);

    // Editor should be empty
    const editorContent = await page.inputValue('#htmlEditor');
    expect(editorContent).toBe('');
  });

  test('should load HTML with inline CSS from URL parameter', async ({ page }) => {
    const htmlContent = `
      <style>
        .test-class {
          color: red;
          font-size: 24px;
          font-weight: bold;
        }
      </style>
      <div class="test-class">Styled Content</div>
    `;
    const encodedHtml = encodeURIComponent(htmlContent);

    await page.goto(`/?data=${encodedHtml}`);
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    const styledDiv = iframe.locator('.test-class');

    await expect(styledDiv).toHaveText('Styled Content');
    await expect(styledDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(styledDiv).toHaveCSS('font-size', '24px');
  });

  test('should handle URL parameter with forms and inputs', async ({ page }) => {
    const htmlContent = `
      <form id="urlForm">
        <input type="text" id="urlInput" value="Prefilled Value" />
        <select id="urlSelect">
          <option value="1">Option 1</option>
          <option value="2" selected>Option 2</option>
        </select>
        <textarea id="urlTextarea">Text area content</textarea>
      </form>
    `;
    const encodedHtml = encodeURIComponent(htmlContent);

    await page.goto(`/?data=${encodedHtml}`);
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('#urlInput')).toHaveValue('Prefilled Value');
    await expect(iframe.locator('#urlSelect')).toHaveValue('2');
    await expect(iframe.locator('#urlTextarea')).toHaveValue('Text area content');
  });

  test('should handle malformed base64 gracefully', async ({ page }) => {
    // Use invalid base64 string
    await page.goto('/?b64=!!!invalid-base64!!!');
    await page.waitForTimeout(500);

    // Should not crash - just not render anything or show error
    // The page should still be functional
    await expect(page.locator('#htmlEditor')).toBeVisible();
    await expect(page.locator('#renderButton')).toBeVisible();
  });

  test('should update URL when clicking Update URL button', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<h1>Test Content for URL Update</h1>';
    await page.fill('#htmlEditor', htmlContent);
    await page.click('#updateUrlButton');

    // Wait for URL to update
    await page.waitForTimeout(300);

    // Verify URL contains the encoded content
    const currentUrl = page.url();
    expect(currentUrl).toContain('?data=');
    expect(currentUrl).toContain(encodeURIComponent(htmlContent));
  });
});
