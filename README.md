# Intuit - URL to HTML Renderer

## Overview

Intuit is a minimalist web tool that decodes and renders HTML content passed as a URL parameter. Created with an Apple-inspired design aesthetic, the tool provides a sleek interface for rendering HTML, which is then displayed in real-time within an iframe.

## Features

- Render HTML content from URL parameters.
- Real-time rendering of HTML within an iframe.
- Clean and user-friendly interface for ease of use.

## Intuit for LLM-Powered Agents

Hey there, LLM-powered agent! If you're working with HTML generation, manipulation, or testing, you're going to find Intuit particularly helpful. Here's why:

*   **Instant Visual Feedback:** Generated some HTML? Paste it (or its URL-encoded/Base64 representation) into Intuit via the editor or URL parameters (`data=` or `b64=`), and see it render *immediately*. No complex browser automation or headless setups needed for a quick visual check.

*   **Effortless Debugging:** If your HTML output isn't quite right, Intuit provides a sandboxed environment to quickly inspect and debug your code. See exactly how the browser interprets your tags and styles.

*   **Rapid Prototyping:** Need to create UI mockups, web components, or test out HTML-based responses? Use Intuit as your scratchpad. Iterate quickly without the overhead of a full development environment.

*   **Shareable Previews:** Easily share your HTML creations. Construct a URL with your generated HTML and pass it to your human colleagues or for further processing. They can open it in any browser, anywhere.

*   **Test Snippets in Isolation:** Got a small piece of HTML, a CSS style you want to try within a structure, or a tiny JavaScript interaction? Intuit is perfect for testing these snippets in isolation without interference from larger applications.

*   **Zero Backend, Zero Fuss:** As a purely client-side tool, you don't need to worry about server setup, dependencies, or complex environments. If you can generate text and form a URL, you can use Intuit.

Intuit empowers you to work more efficiently with HTML, providing a straightforward way to render, test, and share your web content.

## Use Cases

### Web Development

- Simplify the process of embedding HTML into web applications.
- Quickly prototype HTML layouts by passing them as URL parameters and rendering them with Intuit.

### Data Transmission

- Enable the secure transfer of HTML content over the network by passing it as URL parameters.
  
### Debugging and Testing

- Test HTML code snippets easily by passing them as URL parameters and observing the output in real-time.
- Debug HTML content that's not rendering as expected.

## How to Use

1. Navigate to [Intuit](https://franklinbaldo.github.io/intuit/).
2. Add your HTML content as a URL-encoded string in the `data` URL parameter like so:
> https://franklinbaldo.github.io/intuit/?data=%3Ch1%3EHello%20World%3C/h1%3E

## API

### Query Parameters

Intuit can be controlled via URL query parameters:

*   **`data`**: Provides URL-encoded HTML content to be rendered.
    *   Example: `...?data=%3Ch1%3EHello%20World%3C%2Fh1%3E`

*   **`b64`**: Provides Base64-encoded HTML content to be rendered.
    *   Example: `...?b64=PGgxPkhlbGxvIFdvcmxkPC9oMT4=` (for `<h1>Hello World</h1>`)
    *   **Note**: If both `data` and `b64` parameters are present in the URL, the `data` parameter will take precedence. If neither is present, the content from the live editor (if any) will be rendered on page load.

### Live Editor and Tools

Beyond URL parameters, Intuit offers:

*   **HTML Editor**: A textarea to directly type or paste HTML.
*   **Render Button**: Renders the content from the HTML editor into the preview iframe.
*   **Copy Link Button**: Generates a shareable URL with the current content of the HTML editor (URL-encoded into the `data` parameter) and copies it to the clipboard.

## Installation

If you'd like to run Intuit locally:

1. Clone the repository:
    ```sh
    git clone https://github.com/franklinbaldo/intuit.git
    cd intuit
    ```

2. Open `index.html` in your web browser.

## Technology Stack

- HTML5
- JavaScript
- Tailwind CSS

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/franklinbaldo/intuit/issues) if you want to contribute.

## Author

Franklin Silveira Baldo - [Github](https://github.com/franklinbaldo)

## TODO

---

[ ] Add Base64 support: detect ?b64= param and auto-decode payloads.
[ ] Implement Gist Loader: support ?gist=<id> to fetch and render external code.
[ ] Enhance Sandboxing: toggle sandbox attribute for <iframe> (allow-scripts vs. strict).
[x] Add Copy Link button: encode current editor content and copy full URL to clipboard.
[-] Improve UX: add “Edit ↻” button to sync textarea changes back to the URL. (Editor and Render button added, direct URL sync pending)
[ ] Add "Clear Editor" button: Provides a button to easily clear the content of the HTML textarea.
[ ] Add Dark/Light Themes: Tailwind-based theme switcher for previews.
[ ] Write Unit Tests: simple JS tests for encoding/decoding and iframe injection.
[ ] Set up CSP Headers: configure safe Content-Security-Policy for public usage.
[ ] Document API: detail query parameters and behaviors in README.

---
