const { test, expect } = require('@playwright/test');

test.describe('Sandbox and Theme Toggles', () => {
  test.describe('Sandbox Toggle', () => {
    test('should have scripts disabled by default (sandbox mode)', async ({ page }) => {
      await page.goto('/');

      // Verify sandbox toggle is unchecked by default
      const sandboxToggle = page.locator('#sandboxToggle');
      await expect(sandboxToggle).not.toBeChecked();

      // Verify iframe has empty sandbox attribute (strict mode)
      const iframe = page.locator('#iframe');
      const sandboxAttr = await iframe.getAttribute('sandbox');
      expect(sandboxAttr).toBe('');
    });

    test('should enable scripts when sandbox toggle is checked', async ({ page }) => {
      await page.goto('/');

      const sandboxToggle = page.locator('#sandboxToggle');
      const iframe = page.locator('#iframe');

      // Enable scripts
      await sandboxToggle.check();
      await page.waitForTimeout(300);

      // Verify iframe sandbox attribute includes script permissions
      const sandboxAttr = await iframe.getAttribute('sandbox');
      expect(sandboxAttr).toContain('allow-scripts');
      expect(sandboxAttr).toContain('allow-same-origin');
    });

    test('should disable scripts when sandbox toggle is unchecked', async ({ page }) => {
      await page.goto('/');

      const sandboxToggle = page.locator('#sandboxToggle');
      const iframe = page.locator('#iframe');

      // Enable then disable scripts
      await sandboxToggle.check();
      await page.waitForTimeout(300);
      await sandboxToggle.uncheck();
      await page.waitForTimeout(300);

      // Verify iframe sandbox is back to strict mode
      const sandboxAttr = await iframe.getAttribute('sandbox');
      expect(sandboxAttr).toBe('');
    });

    test('should re-render content when toggling sandbox mode', async ({ page }) => {
      await page.goto('/');

      const htmlContent = '<h1>Test Content</h1><p>Testing sandbox toggle</p>';
      await page.fill('#htmlEditor', htmlContent);
      await page.click('#renderButton');
      await page.waitForTimeout(500);

      // Toggle sandbox mode
      await page.locator('#sandboxToggle').check();
      await page.waitForTimeout(500);

      // Content should still be rendered after toggle
      const iframe = page.frameLocator('#iframe');
      await expect(iframe.locator('h1')).toHaveText('Test Content');
      await expect(iframe.locator('p')).toHaveText('Testing sandbox toggle');
    });

    test('should block inline scripts when sandbox is disabled', async ({ page }) => {
      await page.goto('/');

      // HTML with inline script
      const htmlWithScript = `
        <h1 id="testHeading">Original Text</h1>
        <script>
          document.getElementById('testHeading').textContent = 'Modified by Script';
        </script>
      `;

      await page.fill('#htmlEditor', htmlWithScript);
      await page.click('#renderButton');
      await page.waitForTimeout(500);

      // With sandbox disabled (strict mode), script should not execute
      const iframe = page.frameLocator('#iframe');
      await expect(iframe.locator('#testHeading')).toHaveText('Original Text');
    });

    test('should allow inline scripts when sandbox is enabled', async ({ page }) => {
      await page.goto('/');

      // Enable scripts first
      await page.locator('#sandboxToggle').check();
      await page.waitForTimeout(300);

      // HTML with inline script
      const htmlWithScript = `
        <h1 id="testHeading">Original Text</h1>
        <script>
          document.getElementById('testHeading').textContent = 'Modified by Script';
        </script>
      `;

      await page.fill('#htmlEditor', htmlWithScript);
      await page.click('#renderButton');
      await page.waitForTimeout(500);

      // With sandbox enabled, script should execute
      const iframe = page.frameLocator('#iframe');
      await expect(iframe.locator('#testHeading')).toHaveText('Modified by Script');
    });

    test('should maintain sandbox state across multiple renders', async ({ page }) => {
      await page.goto('/');

      // Enable scripts
      await page.locator('#sandboxToggle').check();
      await page.waitForTimeout(300);

      // First render
      await page.fill('#htmlEditor', '<h1>First</h1>');
      await page.click('#renderButton');
      await page.waitForTimeout(300);

      // Second render
      await page.fill('#htmlEditor', '<h1>Second</h1>');
      await page.click('#renderButton');
      await page.waitForTimeout(300);

      // Sandbox should still be enabled
      const iframe = page.locator('#iframe');
      const sandboxAttr = await iframe.getAttribute('sandbox');
      expect(sandboxAttr).toContain('allow-scripts');
    });
  });

  test.describe('Theme Toggle', () => {
    test('should start with light theme by default', async ({ page }) => {
      await page.goto('/');

      // Clear any previous theme preference
      await page.evaluate(() => localStorage.clear());
      await page.reload();

      // Verify theme toggle is unchecked (light mode)
      const themeToggle = page.locator('#themeToggle');
      await expect(themeToggle).not.toBeChecked();

      // Verify dark class is not present
      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      expect(hasClass).toBe(false);
    });

    test('should switch to dark theme when toggle is checked', async ({ page }) => {
      await page.goto('/');

      const themeToggle = page.locator('#themeToggle');

      // Enable dark theme
      await themeToggle.check();
      await page.waitForTimeout(300);

      // Verify dark class is added to html element
      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      expect(hasClass).toBe(true);

      // Verify theme preference is saved in localStorage
      const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(savedTheme).toBe('dark');
    });

    test('should switch back to light theme when toggle is unchecked', async ({ page }) => {
      await page.goto('/');

      const themeToggle = page.locator('#themeToggle');

      // Enable then disable dark theme
      await themeToggle.check();
      await page.waitForTimeout(300);
      await themeToggle.uncheck();
      await page.waitForTimeout(300);

      // Verify dark class is removed
      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      expect(hasClass).toBe(false);

      // Verify theme preference is updated
      const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(savedTheme).toBe('light');
    });

    test('should persist theme preference across page reloads', async ({ page }) => {
      await page.goto('/');

      // Set dark theme
      await page.locator('#themeToggle').check();
      await page.waitForTimeout(300);

      // Reload page
      await page.reload();
      await page.waitForTimeout(500);

      // Verify dark theme is still active
      const themeToggle = page.locator('#themeToggle');
      await expect(themeToggle).toBeChecked();

      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      expect(hasClass).toBe(true);
    });

    test('should load dark theme from localStorage on initial page load', async ({ page }) => {
      await page.goto('/');

      // Set dark theme in localStorage before navigation
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));

      // Navigate to page again
      await page.goto('/');
      await page.waitForTimeout(500);

      // Verify dark theme is applied
      const themeToggle = page.locator('#themeToggle');
      await expect(themeToggle).toBeChecked();

      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      expect(hasClass).toBe(true);
    });

    test('should apply theme-specific styles', async ({ page }) => {
      await page.goto('/');

      // Get background color in light mode
      const bodyLight = page.locator('body');
      const lightBgColor = await bodyLight.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );

      // Switch to dark mode
      await page.locator('#themeToggle').check();
      await page.waitForTimeout(300);

      // Get background color in dark mode
      const darkBgColor = await bodyLight.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );

      // Background colors should be different
      expect(lightBgColor).not.toBe(darkBgColor);
    });

    test('should not affect iframe content when toggling theme', async ({ page }) => {
      await page.goto('/');

      const htmlContent = '<h1>Theme Test</h1><p>Content should remain unchanged</p>';
      await page.fill('#htmlEditor', htmlContent);
      await page.click('#renderButton');
      await page.waitForTimeout(500);

      // Toggle theme
      await page.locator('#themeToggle').check();
      await page.waitForTimeout(300);

      // Verify iframe content is still rendered correctly
      const iframe = page.frameLocator('#iframe');
      await expect(iframe.locator('h1')).toHaveText('Theme Test');
      await expect(iframe.locator('p')).toHaveText('Content should remain unchanged');
    });
  });

  test.describe('Combined Toggle Tests', () => {
    test('should handle both toggles being enabled simultaneously', async ({ page }) => {
      await page.goto('/');

      // Enable both toggles
      await page.locator('#sandboxToggle').check();
      await page.locator('#themeToggle').check();
      await page.waitForTimeout(300);

      // Verify both are active
      const sandboxToggle = page.locator('#sandboxToggle');
      const themeToggle = page.locator('#themeToggle');

      await expect(sandboxToggle).toBeChecked();
      await expect(themeToggle).toBeChecked();

      // Verify sandbox attribute
      const iframe = page.locator('#iframe');
      const sandboxAttr = await iframe.getAttribute('sandbox');
      expect(sandboxAttr).toContain('allow-scripts');

      // Verify dark theme
      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      expect(hasClass).toBe(true);
    });

    test('should maintain both toggle states across renders', async ({ page }) => {
      await page.goto('/');

      // Enable both toggles
      await page.locator('#sandboxToggle').check();
      await page.locator('#themeToggle').check();
      await page.waitForTimeout(300);

      // Render content
      await page.fill('#htmlEditor', '<h1>Toggle Test</h1>');
      await page.click('#renderButton');
      await page.waitForTimeout(500);

      // Both toggles should still be enabled
      await expect(page.locator('#sandboxToggle')).toBeChecked();
      await expect(page.locator('#themeToggle')).toBeChecked();
    });
  });
});
