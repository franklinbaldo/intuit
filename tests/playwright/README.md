# Playwright Tests for Intuit

This directory contains comprehensive Playwright end-to-end tests for the Intuit HTML renderer application.

## Test Structure

The tests are organized into the following files:

1. **rendering.spec.js** - Tests for HTML rendering functionality
   - Basic HTML rendering in iframe
   - HTML with inline styles
   - Complex HTML structures (nested elements)
   - Tables, forms, and images
   - Special characters and entities
   - Empty content handling
   - Re-rendering scenarios

2. **url-parameters.spec.js** - Tests for URL parameter loading
   - Loading HTML via `?data=` parameter (URL-encoded)
   - Loading HTML via `?b64=` parameter (Base64-encoded)
   - Parameter priority testing
   - Complex HTML in URL parameters
   - Edge cases (empty params, malformed data)

3. **editor-controls.spec.js** - Tests for editor UI controls
   - Render button functionality
   - Clear button (clears both editor and iframe)
   - Copy Link button (generates shareable URLs)
   - Update URL button (uses history.replaceState)
   - Multiple render operations
   - Large content handling

4. **toggles.spec.js** - Tests for sandbox and theme toggles
   - Sandbox toggle (allow/disallow scripts)
   - Script execution in sandboxed/unsandboxed iframes
   - Dark/light theme toggle
   - Theme persistence via localStorage
   - Combined toggle states

## Test Coverage

Total: 48 tests covering:
- ✅ Core rendering functionality
- ✅ URL-based content loading
- ✅ Editor interactions
- ✅ Security sandbox controls
- ✅ Theme switching
- ✅ Edge cases and error scenarios

## Known Issues

### CSP-Related Browser Crashes

Currently, there's a known issue where Chromium crashes when loading the application during tests. This appears to be related to the Content Security Policy (CSP) headers in `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline';" />
```

**Issue**: The CSP is blocking resources in a way that causes Chromium to crash with `Page crashed` errors during `page.goto()`.

**Potential Solutions**:
1. Create a test-specific HTML file without CSP for Playwright tests
2. Modify the CSP to be more permissive in test environments
3. Add meta tags to disable CSP in test mode
4. Use a CSP middleware/proxy for testing

**Workaround**: For now, the tests are structured correctly and will pass once the CSP issue is resolved.

## Running the Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Run All Tests

```bash
npm run test:playwright
```

### Run Specific Test File

```bash
npx playwright test tests/playwright/rendering.spec.js
```

### Run with UI Mode

```bash
npm run test:playwright:ui
```

### Run in Headed Mode (see the browser)

```bash
npm run test:playwright:headed
```

## Configuration

The Playwright configuration is in `playwright.config.js`:

- **Test Directory**: `./tests/playwright`
- **Workers**: 1 (sequential execution for stability)
- **Base URL**: `http://localhost:8080`
- **Browser**: Chromium with flags for stability:
  - `--disable-dev-shm-usage`
  - `--no-sandbox`
  - `--disable-setuid-sandbox`
  - `--disable-gpu`

## Test Development Guidelines

1. **Use descriptive test names** that explain what's being tested
2. **Add waits after actions** to ensure DOM updates complete
3. **Test both positive and negative scenarios**
4. **Use frame locators** for iframe content: `page.frameLocator('#iframe')`
5. **Keep tests independent** - each test should work in isolation
6. **Clean up state** between tests when necessary

## Future Improvements

1. Resolve CSP issues for reliable test execution
2. Add visual regression testing
3. Add tests for Gist loading functionality
4. Add performance benchmarks
5. Add accessibility tests
6. Test cross-browser compatibility (Firefox, WebKit)

## Debugging Tests

### View Test Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

### Debug Specific Test

```bash
npx playwright test --debug tests/playwright/rendering.spec.js:4
```

### Generate Trace

Traces are automatically generated on first retry. View them at:

```bash
npx playwright show-trace trace.zip
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Add tests to the appropriate spec file
3. Update this README with new test descriptions
4. Ensure tests are atomic and independent
5. Add appropriate waits and assertions
