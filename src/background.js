chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "injectScript") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "checkScriptInjected" }, (response) => {
      if (response && response.injected) {
        sendResponse({ success: true, alreadyInjected: true });
        return;
      }

      chrome.scripting
        .executeScript({
          target: { tabId: sender.tab.id },
          files: ["src/js/direct-editor-access.js"],
        })
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
    });

    return true;
  }

  if (message.action === "executeCode") {
    const tabId = sender.tab.id;

    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        func: (codeToInject) => {
          if (window.location.hostname.includes("openjscad.com")) {
            const editorFrame = document.querySelector('iframe[id="editorFrame"]');
            if (editorFrame && editorFrame.contentWindow) {
              try {
                const frameDoc = editorFrame.contentWindow.document;
                const editorElement = frameDoc.getElementById("editor");
                if (editorElement) {
                  if (editorElement.tagName === "TEXTAREA") {
                    editorElement.value = codeToInject;
                    editorElement.dispatchEvent(new Event("input", { bubbles: true }));
                    editorElement.dispatchEvent(new Event("change", { bubbles: true }));
                    return true;
                  }

                  const textarea = editorElement.querySelector("textarea");
                  if (textarea) {
                    textarea.value = codeToInject;
                    textarea.dispatchEvent(new Event("input", { bubbles: true }));
                    textarea.dispatchEvent(new Event("change", { bubbles: true }));
                    return true;
                  }
                }

                const textareas = frameDoc.querySelectorAll("textarea");
                for (const textarea of textareas) {
                  if (textarea.id.includes("editor") || textarea.classList.contains("editor") || textarea.parentElement.id === "editor") {
                    textarea.value = codeToInject;
                    textarea.dispatchEvent(new Event("input", { bubbles: true }));
                    textarea.dispatchEvent(new Event("change", { bubbles: true }));
                    return true;
                  }
                }
              } catch (e) {}
            }
          }
          return false;
        },
        args: [message.code],
      })
      .then((results) => {
        if (results && results[0] && results[0].result === true) {
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && (tab.url.includes("openjscad.org") || tab.url.includes("openjscad.com"))) {
    chrome.tabs.sendMessage(tabId, { action: "checkScriptInjected" }, (response) => {
      if (response && response.injected) {
        return;
      }

      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ["src/js/direct-editor-access.js"],
        })
        .catch((error) => {
          console.error("Failed to inject script:", error);
        });
    });
  }
});
