<div align="center">

# 🎨 Intuit

### *A Minimalist HTML Renderer & Visual Testing Tool*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live-success)](https://franklinbaldo.github.io/intuit/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/franklinbaldo/intuit/issues)

[**Live Demo**](https://franklinbaldo.github.io/intuit/) • [**Report Bug**](https://github.com/franklinbaldo/intuit/issues) • [**Request Feature**](https://github.com/franklinbaldo/intuit/issues)

</div>

---

## 📖 Overview

Intuit is a **zero-dependency, client-side HTML renderer** that displays HTML content from URL parameters, the built-in editor, or GitHub Gists. With an Apple-inspired design aesthetic and powerful sandboxing controls, it provides instant visual feedback for HTML snippets without requiring any backend infrastructure.

---

## ✅ What This Is

**Intuit IS:**

- 🎯 **A Visual Testing Tool** – Instantly preview HTML/CSS snippets in a sandboxed iframe
- 🔗 **A URL-Based HTML Renderer** – Share HTML via encoded URLs (`?data=` or `?b64=`)
- 🛡️ **A Security-Conscious Sandbox** – Configurable iframe sandbox with script control
- 🤖 **LLM-Agent Friendly** – Perfect for AI agents generating HTML and needing visual verification
- 📝 **A Quick HTML Scratchpad** – Live editor for rapid prototyping without a full IDE
- 🌐 **A GitHub Gist Viewer** – Load and render HTML files directly from Gists
- 🎨 **A Clean, Minimal Interface** – Apple-inspired design with dark/light theme support
- 🚀 **Completely Client-Side** – Zero backend, zero server setup, zero dependencies

## ❌ What This Is NOT

**Intuit is NOT:**

- ❌ **A Full-Featured Code Editor** – No syntax highlighting, autocomplete, or advanced IDE features
- ❌ **A Web Hosting Platform** – It renders HTML temporarily; it doesn't store or host files
- ❌ **A Production Deployment Tool** – Designed for testing and previewing, not production use
- ❌ **A Backend Service** – No server-side processing, databases, or API endpoints
- ❌ **A Replacement for DevTools** – Browser developer tools remain the best debugging solution
- ❌ **A Package Manager or Build Tool** – No npm, webpack, or bundling capabilities
- ❌ **A Collaborative Editing Platform** – Single-user focused; no real-time collaboration features

---

## ⚡ Key Features

### 🔌 Multiple Input Methods
- **URL Parameters** – Pass HTML via `?data=` (URL-encoded) or `?b64=` (Base64-encoded)
- **GitHub Gist Integration** – Load HTML files directly using `?gist=<gist-id>`
- **Live Editor** – Built-in textarea for typing or pasting HTML directly

### 🛡️ Security & Sandboxing
- **Configurable iframe Sandbox** – Scripts disabled by default for security
- **Script Toggle** – Optional "Allow Scripts" mode for testing interactive content
- **Content Security Policy** – Safe CSP headers configured for public usage

### 🎨 User Experience
- **Dark/Light Themes** – Toggle between themes with persistent preferences
- **Apple-Inspired Design** – Clean, minimal aesthetic using Tailwind CSS
- **Real-Time Preview** – Instant rendering in a sandboxed iframe

### 🔧 Developer Tools
- **Copy Link Button** – Generate shareable URLs with encoded content
- **Update URL Button** – Sync editor changes to URL without page reload
- **Clear Editor** – One-click content reset

---

## 🤖 For LLM-Powered Agents

> **Hey there, AI agent!** If you're generating, manipulating, or testing HTML, Intuit is your perfect companion.

### Why Agents Love Intuit

| Feature | Benefit |
|---------|---------|
| **🎯 Instant Visual Feedback** | Generated HTML? See it render immediately via `?data=` or `?b64=` parameters. No headless browsers or complex automation needed. |
| **🔍 Effortless Debugging** | Sandboxed environment to inspect how browsers interpret your generated tags and styles. |
| **⚡ Rapid Prototyping** | Create UI mockups, components, or test HTML responses without a full dev environment. |
| **🔗 Shareable Previews** | Construct shareable URLs with generated HTML for human review or further processing. |
| **🧪 Isolated Testing** | Test HTML/CSS/JS snippets in isolation without interference from larger applications. |
| **🚀 Zero Setup** | Just form a URL and make a GET request. No backend, no special permissions, no dependencies. |

**Example Usage:**
```
https://franklinbaldo.github.io/intuit/?data=%3Ch1%3EGenerated%20by%20AI%3C%2Fh1%3E
```

---

## 💼 Use Cases

| Scenario | How Intuit Helps |
|----------|------------------|
| **🎨 Rapid Prototyping** | Test HTML layouts and designs without setting up a project |
| **🐛 Debugging** | Isolate and troubleshoot HTML rendering issues in a clean environment |
| **🔗 Content Sharing** | Send HTML previews via shareable URLs to colleagues or clients |
| **📚 Education** | Teach HTML concepts with instant visual feedback |
| **🤖 AI Development** | Verify LLM-generated HTML output visually |
| **📊 Data Visualization** | Quickly render HTML-based charts, tables, or reports |
| **✉️ Email Templates** | Preview and test HTML email templates before deployment |

---

## 🚀 Quick Start

### Method 1: URL Parameters
```
https://franklinbaldo.github.io/intuit/?data=%3Ch1%3EHello%20World%3C%2Fh1%3E
```

### Method 2: Base64 Encoding
```
https://franklinbaldo.github.io/intuit/?b64=PGgxPkhlbGxvIFdvcmxkPC9oMT4=
```

### Method 3: GitHub Gist
```
https://franklinbaldo.github.io/intuit/?gist=YOUR_GIST_ID
```

### Method 4: Live Editor
1. Visit [https://franklinbaldo.github.io/intuit/](https://franklinbaldo.github.io/intuit/)
2. Type or paste HTML into the editor
3. Click **Render** to preview

---

## 📚 API Reference

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| **`data`** | URL-encoded HTML content | `?data=%3Ch1%3EHello%3C%2Fh1%3E` |
| **`b64`** | Base64-encoded HTML content | `?b64=PGgxPkhlbGxvPC9oMT4=` |
| **`gist`** | GitHub Gist ID (fetches first `.html` file) | `?gist=3f3c76c07548eb884388600d877f7691` |

**Priority Order:** `data` > `b64` > `gist` > editor content

> **Note:** If multiple parameters are provided, the highest priority parameter will be used.

### Editor Controls

| Button | Function |
|--------|----------|
| **Render** | Renders editor content into the preview iframe |
| **Copy Link** | Generates shareable URL with encoded content and copies to clipboard |
| **Update URL** | Syncs editor content to URL parameter without reload (uses `history.replaceState`) |
| **Clear Editor** | Clears both editor and preview iframe |
| **Allow Scripts** | Toggle sandbox mode: Off (secure) / On (allows scripts, forms, popups) |
| **Theme Toggle** | Switch between light and dark themes (preference saved locally) |

---

## 💻 Local Installation

Want to run Intuit locally? It's simple:

```bash
# Clone the repository
git clone https://github.com/franklinbaldo/intuit.git
cd intuit

# Open in your browser (that's it!)
open index.html
# or just double-click index.html
```

**No build step. No npm install. No dependencies.** Just open `index.html` in any modern browser.

---

## 🛠️ Technology Stack

<div align="center">

| Technology | Purpose |
|:----------:|:-------:|
| **HTML5** | Core structure |
| **JavaScript (Vanilla)** | Logic & interactivity |
| **Tailwind CSS v2.2.19** | Styling framework |
| **GitHub Pages** | Hosting & deployment |

</div>

**External APIs:**
- GitHub API (for Gist loading)

**Zero Build Dependencies** – Runs directly in the browser!

---

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

Feel free to [open an issue](https://github.com/franklinbaldo/intuit/issues) or submit a pull request.

---

## 📄 License

This project is licensed under the **Apache 2.0 License** – see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Franklin Silveira Baldo**
🔗 [GitHub](https://github.com/franklinbaldo)

---

## ✅ Roadmap & Completed Features

### ✨ Completed
- ✅ Base64 support (`?b64=` parameter)
- ✅ GitHub Gist loader (`?gist=` parameter)
- ✅ Configurable sandbox toggle (allow-scripts vs. strict mode)
- ✅ Copy Link button (generate shareable URLs)
- ✅ Update URL button (`history.replaceState` integration)
- ✅ Clear Editor button
- ✅ Dark/Light theme switcher with persistence
- ✅ Unit tests for core functionality
- ✅ Content Security Policy (CSP) configuration
- ✅ Comprehensive API documentation

### 🚧 Future Considerations
- [ ] Syntax highlighting in editor
- [ ] Multiple theme options (beyond light/dark)
- [ ] Export rendered output as screenshot
- [ ] Local storage for editor history
- [ ] Custom CSP configuration via UI

---

<div align="center">

**Made with ❤️ for developers, designers, and AI agents**

[⬆ Back to Top](#-intuit)

</div>
