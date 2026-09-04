const { test } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const viewports = [
  { name: 'home-1440x900.png', width: 1440, height: 900 },
  { name: 'home-390x844.png', width: 390, height: 844 },
];

const targetUrl = process.env.PUBLISHED_URL || '/';

for (const viewport of viewports) {
  test(`capture deterministic home surface at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    const outputDir = path.join(process.cwd(), 'artifacts', 'visual');
    fs.mkdirSync(outputDir, { recursive: true });

    await page.screenshot({
      path: path.join(outputDir, viewport.name),
      fullPage: true,
    });
  });
}
