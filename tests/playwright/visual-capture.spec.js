const { test } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test('capture deterministic home surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const outputDir = path.join(process.cwd(), 'artifacts', 'visual');
  fs.mkdirSync(outputDir, { recursive: true });

  await page.screenshot({
    path: path.join(outputDir, 'home-1440x900.png'),
    fullPage: true,
  });
});
