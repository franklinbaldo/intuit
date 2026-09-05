const { test, expect } = require('@playwright/test');

const GIST_API = 'https://api.github.com/gists/example-gist';
const RAW_HTML = 'https://raw.githubusercontent.com/example/example/main/demo.html';
const HTML = '<main><h1>Loaded from Gist</h1></main>';

test.describe('Gist loading feedback', () => {
  test('loads an HTML file into the editor and preview', async ({ page }) => {
    await page.route(GIST_API, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          files: {
            'demo.html': { filename: 'demo.html', raw_url: RAW_HTML },
          },
        }),
      });
    });
    await page.route(RAW_HTML, async (route) => {
      await route.fulfill({ status: 200, contentType: 'text/html', body: HTML });
    });

    await page.goto('/?gist=example-gist');

    await expect(page.locator('#htmlEditor')).toHaveValue(HTML);
    await expect(page.locator('#iframe')).toHaveAttribute('srcdoc', HTML);
    await expect(page.locator('#errorMessage')).toBeHidden();
  });

  test('explains when a valid Gist has no HTML file', async ({ page }) => {
    await page.route(GIST_API, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          files: {
            'notes.txt': { filename: 'notes.txt', raw_url: 'https://example.test/notes.txt' },
          },
        }),
      });
    });

    await page.goto('/?gist=example-gist');

    await expect(page.locator('#errorMessage')).toContainText('does not contain an HTML file');
    await expect(page.locator('#htmlEditor')).toHaveValue('');
    expect(await page.locator('#iframe').getAttribute('srcdoc')).toBeNull();
  });

  test('reports an HTTP failure without pretending the Gist has no HTML', async ({ page }) => {
    await page.route(GIST_API, async (route) => {
      await route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/?gist=example-gist');

    const alert = page.locator('#errorMessage');
    await expect(alert).toContainText('GitHub returned 404');
    await expect(alert).not.toContainText('does not contain an HTML file');
    await expect(page.locator('#htmlEditor')).toHaveValue('');
  });

  test('reports a request failure as availability, not nonexistence', async ({ page }) => {
    await page.route(GIST_API, async (route) => {
      await route.abort('failed');
    });

    await page.goto('/?gist=example-gist');

    const alert = page.locator('#errorMessage');
    await expect(alert).toContainText('request failed');
    await expect(alert).toContainText('Check your connection');
    await expect(alert).not.toContainText('does not contain an HTML file');
    await expect(page.locator('#htmlEditor')).toHaveValue('');
  });

  test('distinguishes failure to fetch the selected HTML file', async ({ page }) => {
    await page.route(GIST_API, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          files: {
            'demo.html': { filename: 'demo.html', raw_url: RAW_HTML },
          },
        }),
      });
    });
    await page.route(RAW_HTML, async (route) => {
      await route.fulfill({ status: 503, body: 'unavailable' });
    });

    await page.goto('/?gist=example-gist');

    const alert = page.locator('#errorMessage');
    await expect(alert).toContainText('Gist was found');
    await expect(alert).toContainText('HTTP 503');
    await expect(page.locator('#htmlEditor')).toHaveValue('');
  });
});
