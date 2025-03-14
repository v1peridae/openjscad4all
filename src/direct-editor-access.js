(function () {
  if (window.editorAccessLoaded || typeof window.updateEditorText === "function" || typeof window.injectCode === "function") {
    return;
  }

  window.editorAccessLoaded = true;

  window.updateEditorText = function (code) {
    let updated = false;

    try {
      if (window.location.hostname.includes("openjscad.com")) {
        const edFrame = document.querySelector('iframe[id="editorFrame"]');
        if (edFrame && edFrame.contentWindow) {
          const frameDoc = edFrame.contentWindow.document;
          const edElement = frameDoc.getElementById("editor");

          if (edElement) {
            if (edFrame.contentWindow.ace) {
              const aceEd = edFrame.contentWindow.ace.edit("editor");
              if (aceEd) {
                aceEd.setValue(code);
                aceEd.clearSelection();
                updated = true;
                triggerRender();
                return true;
              }
            }

            const ta = edElement.querySelector("textarea");
            if (ta) {
              ta.value = code;
              ta.dispatchEvent(new Event("input", { bubbles: true }));
              ta.dispatchEvent(new Event("change", { bubbles: true }));
              updated = true;
              triggerRender();
              return true;
            }
          }
        }

        const mainEd = document.getElementById("editor");
        if (mainEd) {
          if (mainEd.tagName === "TEXTAREA") {
            mainEd.value = code;
            mainEd.dispatchEvent(new Event("input", { bubbles: true }));
            mainEd.dispatchEvent(new Event("change", { bubbles: true }));
            updated = true;
            triggerRender();
            return true;
          }
        }
      }

      if (!updated && window.ace && typeof window.ace.edit === "function") {
        const ed = window.ace.edit("editor");
        if (ed) {
          ed.setValue(code);
          ed.clearSelection();
          updated = true;
          triggerRender();
          return true;
        }
      }

      if (!updated) {
        const edElement = document.getElementById("editor");
        if (edElement && edElement.env && edElement.env.editor) {
          edElement.env.editor.setValue(code);
          edElement.env.editor.clearSelection();
          updated = true;
          triggerRender();
          return true;
        }
      }

      if (!updated) {
        const edDiv = document.getElementById("editor");
        if (edDiv) {
          const ta = edDiv.querySelector("textarea");
          if (ta) {
            ta.value = code;
            ta.dispatchEvent(new Event("input", { bubbles: true }));
            ta.dispatchEvent(new Event("change", { bubbles: true }));
            updated = true;
            triggerRender();
            return true;
          }
        }
      }

      const tas = document.querySelectorAll("textarea");
      for (const ta of tas) {
        if (
          ta.parentElement.classList.contains("editor") ||
          ta.parentElement.classList.contains("CodeMirror") ||
          ta.id.includes("editor") ||
          ta.classList.contains("editor")
        ) {
          ta.value = code;
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dispatchEvent(new Event("change", { bubbles: true }));
          triggerRender();
          return true;
        }
      }

      if (!updated) {
        simulateKeyboardShortcuts();
      }

      return updated;
    } catch (err) {
      return false;
    }
  };

  window.injectCode = function (code) {
    return window.updateEditorText(code);
  };

  function triggerRender() {
    try {
      let triggered = false;

      if (!triggered) {
        const updateButton = document.getElementById("updateButton");
        if (updateButton) {
          updateButton.click();
          triggered = true;
          return true;
        }
      }

      if (!triggered) {
        const genButton = document.querySelector("#statusbuttons button:last-of-type");
        if (genButton) {
          genButton.click();
          triggered = true;
          return true;
        }
      }

      if (!triggered) {
        const buttons = document.querySelectorAll("button");
        for (const button of buttons) {
          if (
            button.textContent.toLowerCase().includes("render") ||
            button.textContent.toLowerCase().includes("generate") ||
            button.textContent.toLowerCase().includes("update") ||
            button.innerHTML.includes("play") ||
            button.innerHTML.includes("run") ||
            button.innerHTML.includes("refresh") ||
            button.classList.contains("run-button") ||
            button.classList.contains("generate-button")
          ) {
            button.click();
            triggered = true;
            return true;
          }
        }
      }

      if (!triggered) {
        simulateKeyboardShortcuts();
      }

      return triggered;
    } catch (err) {
      return false;
    }
  }

  function simulateKeyboardShortcuts() {
    try {
      const f5Event = new KeyboardEvent("keydown", {
        key: "F5",
        code: "F5",
        keyCode: 116,
        which: 116,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(f5Event);

      const shiftEnterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(shiftEnterEvent);

      const ctrlEnterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(ctrlEnterEvent);
    } catch (err) {}
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        for (const n of m.addedNodes) {
          if (n.id === "editor" || (n.querySelector && n.querySelector("#editor"))) {
            observer.disconnect();
            break;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
