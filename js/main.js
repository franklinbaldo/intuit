document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const htmlData = urlParams.get("data");
  const b64Data = urlParams.get("b64");
  const gistId = urlParams.get("gist"); // New: Get gist parameter
  const iframe = document.getElementById("iframe").contentWindow.document;
  const htmlEditor = document.getElementById("htmlEditor");
  const errorMessage = document.getElementById("errorMessage");

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }

  function hideError() {
    errorMessage.textContent = "";
    if (!errorMessage.classList.contains("hidden")) {
      errorMessage.classList.add("hidden");
    }
  }

  // Prioritize data, then b64, then gist
  if (htmlData) {
    renderHTML(htmlData);
    htmlEditor.value = htmlData; // Populate editor with loaded HTML
  } else if (b64Data) {
    try {
      // Assuming decodeBase64 is available globally or imported if modules are used
      // For this refactor, we assume utils.js might be loaded separately or its functions made global
      // If utils.js is refactored to modules, this would need an import.
      const decodedHtml =
        typeof decodeBase64 === "function"
          ? decodeBase64(b64Data)
          : atob(b64Data);
      renderHTML(decodedHtml);
      htmlEditor.value = decodedHtml; // Populate editor with loaded HTML
    } catch (error) {
      console.error("Error decoding Base64 data: ", error);
      showError("Failed to decode Base64 content. It might be corrupted.");
    }
  } else if (gistId) {
    hideError();
    console.log("Fetching Gist:", gistId);
    fetch(`https://api.github.com/gists/${gistId}`)
      .then((response) => {
        if (!response.ok) {
          // Construct a more specific error object to pass down
          const error = new Error(`GitHub API error: ${response.status}`);
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then((data) => {
        let htmlFileUrl = null;
        for (const file of Object.values(data.files)) {
          if (file.filename.endsWith(".html")) {
            htmlFileUrl = file.raw_url;
            break;
          }
        }

        if (htmlFileUrl) {
          return fetch(htmlFileUrl).then(rawResponse => {
            if (!rawResponse.ok) {
              const error = new Error(`Fetching Gist raw content failed: ${rawResponse.status}`);
              error.status = rawResponse.status; // Pass status for raw content fetch error
              throw error;
            }
            return rawResponse.text();
          });
        } else {
          // Specific error for no HTML file
          const error = new Error("No HTML file found in Gist");
          error.type = "NO_HTML_FILE";
          throw error;
        }
      })
      .then((htmlText) => {
        hideError();
        renderHTML(htmlText);
        htmlEditor.value = htmlText; // Populate editor with loaded HTML
      })
      .catch((error) => {
        console.error("Error fetching Gist content:", error.message, error);
        let userMessage = "Failed to load Gist content."; // Default message
        if (error.type === "NO_HTML_FILE") {
          userMessage = "No HTML file found in the specified Gist.";
        } else if (error.status) {
          // Handle HTTP errors from either fetch call
          switch (error.status) {
            case 404:
              userMessage = "Gist not found. Please check the Gist ID.";
              break;
            case 403:
              userMessage = "Could not access Gist. It might be private, or you may have exceeded GitHub API rate limits.";
              break;
            default:
              userMessage = `Failed to load Gist content (Error ${error.status}). Please try again.`;
          }
        } else if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
            userMessage = "Network error. Please check your internet connection and try again.";
        }
        // For other generic errors, error.message might be informative enough if it's not too technical
        // else if (error.message) {
        //    userMessage = `Failed to load Gist content: ${error.message}`; // Could be too technical
        // }
        showError(userMessage);
      });
  } else {
    // If no URL params, check if editor has content (e.g. from previous session if we implement localStorage persistence)
    const editorContent = htmlEditor.value;
    if (editorContent) {
      renderHTML(editorContent);
    }
  }

  const renderButton = document.getElementById("renderButton");
  const copyLinkButton = document.getElementById("copyLinkButton");
  const clearEditorButton = document.getElementById("clearEditorButton");
  const updateUrlButton = document.getElementById("updateUrlButton");
  const sandboxToggle = document.getElementById("sandboxToggle");
  const themeToggle = document.getElementById("themeToggle");
  const iframeElement = document.getElementById("iframe");

  // Initialize theme based on localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.documentElement.classList.remove("dark"); // Ensure light is default if no setting
    if (themeToggle) themeToggle.checked = false;
  }

  function checkHTMLWellFormedness(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const parserErrorNode = doc.querySelector("parsererror");
    if (parserErrorNode) {
      // More specific error for XML-like parsing issues, but for HTML it's often a sign of severe problems.
      // Browsers typically don't inject <parsererror> for simple bad HTML, but for structural issues.
      console.warn("DOMParser found a parsererror node:", parserErrorNode.textContent);
      return {
        isValid: false,
        // Use a milder warning as it might be overly aggressive for typical HTML issues
        message: "Warning: The HTML structure may have issues that could affect rendering or behavior. The browser will attempt to correct them."
      };
    }
    return { isValid: true };
  }

  if (renderButton) {
    renderButton.addEventListener("click", () => {
      hideError(); // Clear previous errors before new render attempt
      const htmlContent = htmlEditor.value;
      const validation = checkHTMLWellFormedness(htmlContent);
      if (!validation.isValid) {
        showError(validation.message);
        // Still render, allowing the browser to handle it, but with a warning shown.
      }
      renderHTML(htmlContent);
    });
  }

  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", () => {
      const htmlContent = htmlEditor.value;
      const encodedHtml = encodeURIComponent(htmlContent);
      const baseUrl = window.location.origin + window.location.pathname;
      const shareableLink = `${baseUrl}?data=${encodedHtml}`;

      navigator.clipboard
        .writeText(shareableLink)
        .then(() => {
          const originalButtonText = copyLinkButton.textContent;
          copyLinkButton.textContent = "Copied!";
          setTimeout(() => {
            copyLinkButton.textContent = originalButtonText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
          showError("Failed to copy link to clipboard.");
        });
    });
  }

  if (clearEditorButton) {
    clearEditorButton.addEventListener("click", () => {
      htmlEditor.value = "";
      renderHTML(""); // Clear the iframe
    });
  }

  if (updateUrlButton) {
    updateUrlButton.addEventListener("click", () => {
      const htmlContent = htmlEditor.value;
      const encodedHtml = encodeURIComponent(htmlContent);
      // Preserve other query parameters if any, like theme or sandbox settings if they were in URL
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete("b64"); // Remove b64 if data is being set
      currentParams.delete("gist"); // Remove gist if data is being set
      currentParams.set("data", encodedHtml);
      const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
      history.replaceState(null, "", newUrl);
    });
  }

  if (sandboxToggle) {
    // Initialize toggle based on current sandbox attribute (could be set by URL param in future)
    // For now, assume it starts unchecked (strict sandbox) unless modified by user
    iframeElement.sandbox = ""; // Default strict
    sandboxToggle.checked = false;

    sandboxToggle.addEventListener("change", function () {
      if (this.checked) {
        iframeElement.sandbox =
          "allow-scripts allow-same-origin allow-popups allow-forms";
      } else {
        iframeElement.sandbox = "";
      }
      // Re-render the current content with the new sandbox settings
      const currentHtml = htmlEditor.value;
      renderHTML(currentHtml);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // renderHTML is expected to be globally available from utils.js
  // Ensure utils.js is loaded before main.js in index.html
});

// The htmz function was outside the DOMContentLoaded event listener in the original HTML.
// It's related to the iframe's onload event.
// It needs to be global if it's called directly from an HTML attribute (`onload="htmz(this)"`).
function htmz(frame) {
  setTimeout(() => {
    // Ensure frame and its contentWindow are accessible
    if (frame && frame.contentWindow) {
      const hash = frame.contentWindow.location.hash;
      if (hash) {
        // Also ensure contentDocument is accessible
        if (frame.contentDocument) {
          const element = frame.contentDocument.querySelector(hash);
          if (
            element &&
            frame.contentDocument.body &&
            frame.contentDocument.body.childNodes
          ) {
            // Ensure replaceWith is a function and childNodes is not null
            try {
              element.replaceWith(...frame.contentDocument.body.childNodes);
            } catch (e) {
              console.error("Error during htmz replacement:", e);
            }
          }
        }
      }
    }
  }, 0);
}
