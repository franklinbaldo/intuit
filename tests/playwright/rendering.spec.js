const { test, expect } = require('@playwright/test');

test.describe('HTML Rendering Functionality', () => {
  test('should render HTML in iframe when using editor and render button', async ({ page }) => {
    await page.goto('/');

    // Type HTML into the editor
    const htmlContent = '<h1>Test Heading</h1><p>Test paragraph</p>';
    await page.fill('#htmlEditor', htmlContent);

    // Click the render button
    await page.click('#renderButton');

    // Wait for iframe to load
    await page.waitForTimeout(500);

    // Get iframe content
    const iframe = page.frameLocator('#iframe');

    // Verify the HTML is rendered in the iframe
    await expect(iframe.locator('h1')).toHaveText('Test Heading');
    await expect(iframe.locator('p')).toHaveText('Test paragraph');
  });

  test('should render HTML with styles correctly', async ({ page }) => {
    await page.goto('/');

    // HTML with inline styles
    const htmlContent = '<div style="color: red; font-size: 20px;">Styled Content</div>';
    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    const styledDiv = iframe.locator('div');

    await expect(styledDiv).toHaveText('Styled Content');
    await expect(styledDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(styledDiv).toHaveCSS('font-size', '20px');
  });

  test('should render complex HTML structures', async ({ page }) => {
    await page.goto('/');

    const htmlContent = `
      <div class="container">
        <header>
          <h1>Title</h1>
          <nav>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <h2>Article Title</h2>
            <p>Article content goes here.</p>
          </article>
        </main>
        <footer>
          <p>Footer text</p>
        </footer>
      </div>
    `;

    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');

    // Verify all elements are rendered
    await expect(iframe.locator('h1')).toHaveText('Title');
    await expect(iframe.locator('nav li')).toHaveCount(3);
    await expect(iframe.locator('article h2')).toHaveText('Article Title');
    await expect(iframe.locator('article p')).toHaveText('Article content goes here.');
    await expect(iframe.locator('footer p')).toHaveText('Footer text');
  });

  test('should render HTML with tables', async ({ page }) => {
    await page.goto('/');

    const htmlContent = `
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>30</td>
            <td>New York</td>
          </tr>
          <tr>
            <td>Jane</td>
            <td>25</td>
            <td>London</td>
          </tr>
        </tbody>
      </table>
    `;

    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');

    // Verify table structure
    await expect(iframe.locator('table')).toBeVisible();
    await expect(iframe.locator('thead th')).toHaveCount(3);
    await expect(iframe.locator('tbody tr')).toHaveCount(2);
    await expect(iframe.locator('tbody tr:first-child td:first-child')).toHaveText('John');
    await expect(iframe.locator('tbody tr:last-child td:first-child')).toHaveText('Jane');
  });

  test('should render HTML with forms', async ({ page }) => {
    await page.goto('/');

    const htmlContent = `
      <form id="testForm">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" placeholder="Enter name" />

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Enter email" />

        <button type="submit">Submit</button>
      </form>
    `;

    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');

    // Verify form elements are rendered
    await expect(iframe.locator('form#testForm')).toBeVisible();
    await expect(iframe.locator('input#name')).toBeVisible();
    await expect(iframe.locator('input#email')).toBeVisible();
    await expect(iframe.locator('button[type="submit"]')).toBeVisible();
    await expect(iframe.locator('label[for="name"]')).toHaveText('Name:');
  });

  test('should handle empty HTML content', async ({ page }) => {
    await page.goto('/');

    await page.fill('#htmlEditor', '');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    // Iframe should exist but be empty
    const iframeElement = await page.locator('#iframe');
    await expect(iframeElement).toBeVisible();
  });

  test('should update rendered content when re-rendering', async ({ page }) => {
    await page.goto('/');

    // First render
    await page.fill('#htmlEditor', '<h1>First Content</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    let iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('First Content');

    // Second render with different content
    await page.fill('#htmlEditor', '<h1>Second Content</h1>');
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('h1')).toHaveText('Second Content');
  });

  test('should render HTML with special characters', async ({ page }) => {
    await page.goto('/');

    const htmlContent = '<p>Special chars: &lt; &gt; &amp; &quot; &#39;</p>';
    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('p')).toHaveText('Special chars: < > & " \'');
  });

  test('should render HTML with images', async ({ page }) => {
    await page.goto('/');

    const htmlContent = `
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='blue' width='100' height='100'/%3E%3C/svg%3E" alt="Blue Square" />
      <p>Image above</p>
    `;

    await page.fill('#htmlEditor', htmlContent);
    await page.click('#renderButton');
    await page.waitForTimeout(500);

    const iframe = page.frameLocator('#iframe');
    await expect(iframe.locator('img')).toBeVisible();
    await expect(iframe.locator('img')).toHaveAttribute('alt', 'Blue Square');
    await expect(iframe.locator('p')).toHaveText('Image above');
  });
});
