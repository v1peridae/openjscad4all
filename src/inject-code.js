(function () {
  if (window.codeInjectorLoaded || document.querySelector('script[data-injected="true"]')) {
    return;
  }

  window.codeInjectorLoaded = true;

  if (document.currentScript) {
    document.currentScript.setAttribute("data-injected", "true");
  }

  const scriptTag = document.currentScript;
  let code;

  try {
    code = JSON.parse(scriptTag.dataset.code);
  } catch (error) {
    return;
  }

  let codeInjected = false;

  try {
    if (!codeInjected && window.ace && typeof window.ace.edit === "function") {
      try {
        const aceEditor = window.ace.edit("editor");
        if (aceEditor) {
          aceEditor.setValue(code);
          aceEditor.clearSelection();
          codeInjected = true;
          triggerUpdates();
          return true;
        }
      } catch (e) {}
    }

    if (!codeInjected) {
      const editorElement = document.getElementById("editor");
      if (editorElement) {
        if (editorElement.env && editorElement.env.editor) {
          try {
            editorElement.env.editor.setValue(code);
            editorElement.env.editor.clearSelection();
            codeInjected = true;
            triggerUpdates();
            return true;
          } catch (e) {}
        }

        if (!codeInjected) {
          const textarea = editorElement.querySelector("textarea");
          if (textarea) {
            try {
              textarea.value = code;
              textarea.dispatchEvent(new Event("input", { bubbles: true }));
              textarea.dispatchEvent(new Event("change", { bubbles: true }));
              codeInjected = true;
              triggerUpdates();
              return true;
            } catch (e) {}
          }
        }
      }
    }

    if (!codeInjected && typeof window.updateEditorText === "function") {
      try {
        const result = window.updateEditorText(code);
        codeInjected = true;
        return result;
      } catch (e) {}
    }

    if (!codeInjected && typeof window.injectCode === "function") {
      try {
        const result = window.injectCode(code);
        codeInjected = true;
        return result;
      } catch (e) {}
    }

    return codeInjected;
  } catch (error) {
    return false;
  }

  function triggerUpdates() {
    try {
      let updateTriggered = false;

      if (!updateTriggered) {
        const updateButton = document.getElementById("updateButton");
        if (updateButton) {
          updateButton.click();
          updateTriggered = true;
          return;
        }
      }

      if (!updateTriggered) {
        const statusButtons = document.getElementById("statusbuttons");
        if (statusButtons) {
          const buttons = statusButtons.querySelectorAll("button");
          if (buttons.length > 0) {
            buttons[buttons.length - 1].click();
            updateTriggered = true;
            return;
          }
        }
      }

      if (!updateTriggered) {
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
            updateTriggered = true;
            break;
          }
        }
      }

      if (!updateTriggered) {
        const f5 = new Keyboard("keydown", {
          key: "F5",
          code: "F5",
          keyCode: 116,
          which: 116,
          bubbles: true,
          cancelable: true,
        });
        document.dispatch(f5);

        const shiftReturn = new Keyboard("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        });
        document.dispatch(shiftReturn);

        const ctrlEnter = new Keyboard("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        });
        document.dispatch(ctrlEnter);
      }
    } catch (error) {}
  }
})();
