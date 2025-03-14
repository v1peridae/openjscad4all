let scriptInit = false;
let codeInjected = false;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "checkScriptInjected") {
    sendResponse({ injected: scriptInit });
    return true;
  }
});

function adjustForOpenJSCADOrg() {
  if (window.location.hostname.includes("openjscad.org")) {
    setTimeout(() => {
      const editorEl = document.getElementById("editor");
      if (editorEl) {
        const panel = document.getElementById("shape-builder-panel");
        if (panel) {
          panel.style.right = "20px";
          panel.style.left = "auto";
        }
      }
    }, 1000);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (scriptInit) {
    return;
  }

  if (!document.getElementById("shape-builder-panel")) {
    createShapeBuilderPanel();
  }

  adjustForOpenJSCADOrg();
  scriptInit = true;
});

window.addEventListener("load", function () {
  if (scriptInit) {
    return;
  }

  if (!document.getElementById("shape-builder-panel")) {
    createShapeBuilderPanel();
  }

  adjustForOpenJSCADOrg();
  scriptInit = true;
});

window.addEventListener("load", function () {
  if (scriptInit) {
    return;
  }

  if (window.location.hostname.includes("openjscad.com")) {
    if (!document.getElementById("shape-builder-panel")) {
      setTimeout(checkAndInitShapeBuilder, 1500);
    }
  }

  scriptInit = true;
});

function checkAndInitShapeBuilder() {
  const editorEl = document.getElementById("editor");

  if (editorEl) {
    initShapeBuilder();
  } else {
    setTimeout(checkAndInitShapeBuilder, 1000);
  }
}

function initShapeBuilder() {
  try {
    if (document.getElementById("shape-builder-panel")) {
      return;
    }

    if (!document.getElementById("editor")) {
      return;
    }

    const panel = document.createElement("div");
    panel.id = "shape-builder-panel";
    panel.className = "shape-builder-panel";

    panel.innerHTML = `
      <div class="shape-builder-header">
        <h2>OpenJSCAD4All</h2>
        <button id="shape-builder-toggle">▼</button>
      </div>
      <div class="shape-builder-content">
        <div class="shape-selector">
          <label for="shape-select">Pick a Shape:</label>
          <select id="shape-select">
            <optgroup label="3D Shapes">
              <option value="cube">Cube</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="cone">Cone</option>
              <option value="torus">Torus</option>
              <option value="text3d">3D Text</option>
            </optgroup>
            <optgroup label="2D Shapes">
              <option value="circle">Circle</option>
              <option value="square">Square/Rectangle</option>
              <option value="polygon">Polygon</option>
            </optgroup>
          </select>
        </div>
        
        <div id="shape-parameters">
          <div class="parameter cube-param">
            <label for="size-x-input">Width (X):</label>
            <input type="number" id="size-x-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter cube-param">
            <label for="size-y-input">Depth (Y):</label>
            <input type="number" id="size-y-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter cube-param">
            <label for="size-z-input">Height (Z):</label>
            <input type="number" id="size-z-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter sphere-param" style="display: none;">
            <label for="radius-input">Radius:</label>
            <input type="number" id="radius-input" value="5" min="0.1" step="0.1">
          </div>
          
          <div class="parameter sphere-param" style="display: none;">
            <label for="sphere-resolution-input">Resolution:</label>
            <input type="number" id="sphere-resolution-input" value="32" min="8" step="1">
          </div>
          
          <div class="parameter cylinder-param" style="display: none;">
            <label for="cylinder-radius-input">Radius:</label>
            <input type="number" id="cylinder-radius-input" value="5" min="0.1" step="0.1">
          </div>
          
          <div class="parameter cylinder-param" style="display: none;">
            <label for="height-input">Height:</label>
            <input type="number" id="height-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter cylinder-param" style="display: none;">
            <label for="cylinder-resolution-input">Resolution:</label>
            <input type="number" id="cylinder-resolution-input" value="32" min="8" step="1">
          </div>
          
          <div class="parameter cone-param" style="display: none;">
            <label for="cone-bottom-radius-input">Bottom Radius:</label>
            <input type="number" id="cone-bottom-radius-input" value="5" min="0.1" step="0.1">
          </div>
          
          <div class="parameter cone-param" style="display: none;">
            <label for="cone-top-radius-input">Top Radius:</label>
            <input type="number" id="cone-top-radius-input" value="0" min="0" step="0.1">
          </div>
          
          <div class="parameter cone-param" style="display: none;">
            <label for="cone-height-input">Height:</label>
            <input type="number" id="cone-height-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter cone-param" style="display: none;">
            <label for="cone-resolution-input">Resolution:</label>
            <input type="number" id="cone-resolution-input" value="32" min="8" step="1">
          </div>
          
          <div class="parameter torus-param" style="display: none;">
            <label for="torus-radius1-input">Outer Radius:</label>
            <input type="number" id="torus-radius1-input" value="4" min="0.1" step="0.1">
          </div>
          
          <div class="parameter torus-param" style="display: none;">
            <label for="torus-radius2-input">Inner Radius:</label>
            <input type="number" id="torus-radius2-input" value="1" min="0.1" step="0.1">
          </div>
          
          <div class="parameter torus-param" style="display: none;">
            <label for="torus-resolution-input">Outer Resolution:</label>
            <input type="number" id="torus-resolution-input" value="32" min="4" step="1">
          </div>
          
          <div class="parameter torus-param" style="display: none;">
            <label for="torus-inner-resolution-input">Inner Resolution:</label>
            <input type="number" id="torus-inner-resolution-input" value="16" min="4" step="1">
          </div>
          
          <div class="parameter text3d-param" style="display: none;">
            <label for="text-input">Text:</label>
            <input type="text" id="text-input" value="OpenJSCAD">
          </div>
          
          <div class="parameter text3d-param" style="display: none;">
            <label for="text-size-input">Size:</label>
            <input type="number" id="text-size-input" value="5" min="0.1" step="0.1">
          </div>
          
          <div class="parameter text3d-param" style="display: none;">
            <label for="text-height-input">Height:</label>
            <input type="number" id="text-height-input" value="2" min="0.1" step="0.1">
          </div>
          
          <div class="parameter circle-param" style="display: none;">
            <label for="circle-radius-input">Radius:</label>
            <input type="number" id="circle-radius-input" value="5" min="0.1" step="0.1">
          </div>
          
          <div class="parameter circle-param" style="display: none;">
            <label for="circle-resolution-input">Resolution:</label>
            <input type="number" id="circle-resolution-input" value="32" min="8" step="1">
          </div>
          
          <div class="parameter square-param" style="display: none;">
            <label for="square-size-x-input">Width (X):</label>
            <input type="number" id="square-size-x-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter square-param" style="display: none;">
            <label for="square-size-y-input">Height (Y):</label>
            <input type="number" id="square-size-y-input" value="10" min="0.1" step="0.1">
          </div>
          
          <div class="parameter polyhedron-param polygon-param" style="display: none;">
            <p>This shape needs some pretty complex point definitions.</p>
            <p>A simple example's gonna be generated.</p>
          </div>
        </div>
        
        <div class="transform-options" style="margin-top: 15px;">
          <details>
            <summary>Transformations</summary>
            <div class="parameter transform-param">
              <label for="rotate-x-input">Rotate X:</label>
              <input type="number" id="rotate-x-input" value="0" step="5">
            </div>
            
            <div class="parameter transform-param">
              <label for="rotate-y-input">Rotate Y:</label>
              <input type="number" id="rotate-y-input" value="0" step="5">
            </div>
            
            <div class="parameter transform-param">
              <label for="rotate-z-input">Rotate Z:</label>
              <input type="number" id="rotate-z-input" value="0" step="5">
            </div>
            
            <div class="parameter transform-param">
              <label for="translate-x-input">Translate X:</label>
              <input type="number" id="translate-x-input" value="0" step="1">
            </div>
            
            <div class="parameter transform-param">
              <label for="translate-y-input">Translate Y:</label>
              <input type="number" id="translate-y-input" value="0" step="1">
            </div>
            
            <div class="parameter transform-param">
              <label for="translate-z-input">Translate Z:</label>
              <input type="number" id="translate-z-input" value="0" step="1">
            </div>
          </details>
        </div>
        
        <button id="generate-button" class="generate-button">Add my shape :)</button>
      </div>
    `;

    document.body.appendChild(panel);

    const toggleButton = document.getElementById("shape-builder-toggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", function () {
        const content = panel.querySelector(".shape-builder-content");
        if (content.style.display === "none") {
          content.style.display = "block";
          toggleButton.textContent = "▼";
        } else {
          content.style.display = "none";
          toggleButton.textContent = "▲";
        }
      });
    }

    const shapeSelect = document.getElementById("shape-select");
    if (shapeSelect) {
      shapeSelect.addEventListener("change", function () {
        updateparamVisibility();
      });
    }

    document.getElementById("generate-button").addEventListener("click", function () {
      try {
        generateAndInjectCode();
      } catch (err) {
        alert("Sorry, there's an error generating shape: " + err.message);
      }
    });

    updateparamVisibility();
  } catch (err) {
    console.error("Error:", err);
  }
}

function togglePanel() {
  const panel = document.getElementById("shape-builder-panel");
  const content = panel.querySelector(".shape-builder-content");
  const toggleButton = document.getElementById("shape-builder-toggle");

  if (content.style.display === "none") {
    content.style.display = "block";
    toggleButton.textContent = "▼";
  } else {
    content.style.display = "none";
    toggleButton.textContent = "▲";
  }
}

function updateShapeParameters() {
  try {
    const shapeType = document.getElementById("shape-type").value;
    const paramContainer = document.getElementById("shape-parameters");

    if (!paramContainer) {
      return;
    }

    paramContainer.innerHTML = "";

    switch (shapeType) {
      case "cube":
        addParameter(paramContainer, "size", "Size", 2, "number", 0.1);
        addParameter(paramContainer, "center-x", "Center X", 0, "number", 0.1);
        addParameter(paramContainer, "center-y", "Center Y", 0, "number", 0.1);
        addParameter(paramContainer, "center-z", "Center Z", 0, "number", 0.1);
        break;

      case "sphere":
        addParameter(paramContainer, "radius", "Radius", 1, "number", 0.1);
        addParameter(paramContainer, "center-x", "Center X", 0, "number", 0.1);
        addParameter(paramContainer, "center-y", "Center Y", 0, "number", 0.1);
        addParameter(paramContainer, "center-z", "Center Z", 0, "number", 0.1);
        addParameter(paramContainer, "resolution", "Resolution", 32, "number", 1);
        break;

      case "cylinder":
        addParameter(paramContainer, "height", "Height", 2, "number", 0.1);
        addParameter(paramContainer, "radius", "Radius", 1, "number", 0.1);
        addParameter(paramContainer, "center-x", "Center X", 0, "number", 0.1);
        addParameter(paramContainer, "center-y", "Center Y", 0, "number", 0.1);
        addParameter(paramContainer, "center-z", "Center Z", 0, "number", 0.1);
        addParameter(paramContainer, "resolution", "Resolution", 32, "number", 1);
        break;

      case "cone":
        addParameter(paramContainer, "bottomRadius", "Bottom Radius", 5, "number", 0.1);
        addParameter(paramContainer, "topRadius", "Top Radius", 0, "number", 0.1);
        addParameter(paramContainer, "height", "Height", 10, "number", 0.1);
        addParameter(paramContainer, "resolution", "Resolution", 32, "number", 1);
        break;

      case "torus":
        addParameter(paramContainer, "innerRadius", "Inner Radius", 1, "number", 0.1);
        addParameter(paramContainer, "outerRadius", "Outer Radius", 4, "number", 0.1);
        addParameter(paramContainer, "center-x", "Center X", 0, "number", 0.1);
        addParameter(paramContainer, "center-y", "Center Y", 0, "number", 0.1);
        addParameter(paramContainer, "center-z", "Center Z", 0, "number", 0.1);
        addParameter(paramContainer, "resolution", "Resolution", 32, "number", 1);
        break;
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

function addParameter(container, id, label, defaultValue, type, step) {
  try {
    if (!container) {
      return;
    }

    const paramDiv = document.createElement("div");
    paramDiv.className = "parameter";

    const paramLabel = document.createElement("label");
    paramLabel.htmlFor = id;
    paramLabel.textContent = label;

    const paramInput = document.createElement("input");
    paramInput.type = type || "number";
    paramInput.id = id;
    paramInput.value = defaultValue;
    paramInput.step = step || 0.1;

    if (
      type === "number" &&
      (id === "radius" || id === "size" || id === "resolution" || id === "innerRadius" || id === "outerRadius" || id === "height")
    ) {
      paramInput.min = 0.1;
    }

    paramInput.addEventListener("change", function () {
      validateInput(this);
    });

    paramDiv.appendChild(paramLabel);
    paramDiv.appendChild(paramInput);
    container.appendChild(paramDiv);
  } catch (err) {
    console.error("Error:", err);
  }
}

function validateInput(input) {
  try {
    const val = parseFloat(input.value);

    if (isNaN(val)) {
      input.value = input.min || 0.1;
      return;
    }

    if (input.min && val < parseFloat(input.min)) {
      input.value = input.min;
    }

    if (input.max && val > parseFloat(input.max)) {
      input.value = input.max;
    }

    if (input.id === "resolution") {
      input.value = Math.max(4, Math.round(val));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

function generateShapeCode() {
  try {
    const shapeSelect = document.getElementById("shape-select");
    const selectedShape = shapeSelect.value;

    const params = getShapeParameters();

    let code = "";

    code += "// Generated with <3 by OpenJSCAD4All\n\n";

    code += "function main() {\n";

    let shapeCode = "";
    switch (selectedShape) {
      case "cube":
        shapeCode = generateCubeCode(params);
        break;
      case "sphere":
        shapeCode = generateSphereCode(params);
        break;
      case "cylinder":
        shapeCode = generateCylinderCode(params);
        break;
      case "cone":
        shapeCode = generateConeCode(params);
        break;
      case "torus":
        shapeCode = generateTorusCode(params);
        break;
      case "text3d":
        shapeCode = generate3DTextCode(params);
        break;
      case "circle":
        shapeCode = generateCircleCode(params);
        break;
      case "square":
        shapeCode = generateSquareCode(params);
        break;
      case "polygon":
        shapeCode = generatePolygonCode(params);
        break;
      default:
        throw new Error("Unknown shape: " + selectedShape);
    }

    if (
      params.rotateX !== 0 ||
      params.rotateY !== 0 ||
      params.rotateZ !== 0 ||
      params.translateX !== 0 ||
      params.translateY !== 0 ||
      params.translateZ !== 0
    ) {
      code += "  let shape = " + shapeCode + ";\n\n";

      if (params.rotateX !== 0 || params.rotateY !== 0 || params.rotateZ !== 0) {
        code += `  shape = shape.rotateX(${params.rotateX});\n`;
        code += `  shape = shape.rotateY(${params.rotateY});\n`;
        code += `  shape = shape.rotateZ(${params.rotateZ});\n`;
      }

      if (params.translateX !== 0 || params.translateY !== 0 || params.translateZ !== 0) {
        code += `  shape = shape.translate([${params.translateX}, ${params.translateY}, ${params.translateZ}]);\n`;
      }

      code += "\n  return shape;\n";
    } else {
      code += "  return " + shapeCode + ";\n";
    }

    code += "}\n";

    return code;
  } catch (err) {
    console.error("Error:", err);
    alert("Sorry, there's an error generating shape: " + err.message);
    return null;
  }
}

function generateCubeCode(params) {
  const x = params.sizeX || 10;
  const y = params.sizeY || 10;
  const z = params.sizeZ || 10;
  const center = params.center || false;

  return `cube({size: [${x}, ${y}, ${z}], center: ${center}})`;
}

function generateSphereCode(params) {
  const r = params.radius || 5;
  const res = params.resolution || 32;
  const center = params.center || false;

  return `sphere({r: ${r}, fn: ${res}, center: ${center}})`;
}

function generateCylinderCode(params) {
  const r = params.radius || 5;
  const h = params.height || 10;
  const res = params.resolution || 32;
  const center = params.center || false;

  return `cylinder({r: ${r}, h: ${h}, fn: ${res}, center: ${center}})`;
}

function generateConeCode(params) {
  const r1 = params.bottomRadius || 5;
  const r2 = params.topRadius || 0;
  const h = params.height || 10;
  const res = params.resolution || 32;
  const center = params.center || false;

  return `cylinder({r1: ${r1}, r2: ${r2}, h: ${h}, fn: ${res}, center: ${center}})`;
}

function generateTorusCode(params) {
  const ro = params.radius1 || 4;
  const ri = params.radius2 || 1;
  const fno = params.resolution || 32;
  const fni = params.innerResolution || 16;
  const roti = 0;
  const center = params.center || false;

  return `torus({ri: ${ri}, ro: ${ro}, fni: ${fni}, fno: ${fno}, roti: ${roti}, center: ${center}})`;
}

function generate3DTextCode(params) {
  const txt = params.text || "OpenJSCAD";
  const size = params.size || 5;
  const h = params.height || 2;
  const center = params.center || false;

  return `vector_text(0, 0, "${txt}").map(function(pl) {
    return rectangular_extrude(pl, {w: ${size}, h: ${h}});
  }).reduce(function(a, b) {
    return a.union(b);
  })`;
}

function generateCircleCode(params) {
  const r = params.radius || 5;
  const res = params.resolution || 32;
  const center = params.center || false;

  return `circle({r: ${r}, fn: ${res}, center: ${center}})`;
}

function generateSquareCode(params) {
  const x = params.sizeX || 10;
  const y = params.sizeY || 10;
  const center = params.center || false;

  return `square({size: [${x}, ${y}], center: ${center}})`;
}

function generatePolygonCode(params) {
  return `polygon({
    points: [
      [0, 0],
      [10, 0],
      [5, 10]
    ]
  })`;
}

function isEditorReady() {
  try {
    const editorEl = document.getElementById("editor");
    if (!editorEl) {
      return false;
    }

    if (window.ace && typeof window.ace.edit === "function") {
      try {
        const editor = window.ace.edit("editor");
        if (editor && typeof editor.setValue === "function") {
          return true;
        }
      } catch (e) {}
    }

    if (editorEl.env && editorEl.env.editor) {
      return true;
    }

    const textarea = editorEl.querySelector("textarea");
    if (textarea) {
      return true;
    }

    if (typeof window.setEditorContent === "function" || typeof window.injectCodeFromExtension === "function") {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}

function generateAndInjectCode() {
  try {
    const code = generateShapeCode();

    if (!code) {
      return;
    }

    if (typeof window.setEditorContent === "function") {
      const result = window.setEditorContent(code);
      if (result) {
        return;
      }
    }

    let editor = null;

    if (window.ace && typeof window.ace.edit === "function") {
      try {
        editor = window.ace.edit("editor");
        if (editor && typeof editor.setValue === "function") {
          editor.setValue(code);
          editor.clearSelection();
          triggerRender();
          return;
        }
      } catch (e) {}
    }

    if (window.CodeMirror && document.querySelector(".CodeMirror")) {
      try {
        const cm = document.querySelector(".CodeMirror").CodeMirror;
        if (cm) {
          cm.setValue(code);
          triggerRender();
          return;
        }
      } catch (e) {}
    }

    const textareas = document.querySelectorAll("textarea");
    for (const ta of textareas) {
      if (
        ta.parentElement.classList.contains("editor") ||
        ta.parentElement.classList.contains("CodeMirror") ||
        ta.id.includes("editor") ||
        ta.classList.contains("editor") ||
        ta.parentElement.id === "editor"
      ) {
        ta.value = code;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.dispatchEvent(new Event("change", { bubbles: true }));
        triggerRender();
        return;
      }
    }

    chrome.runtime.sendMessage(
      {
        action: "executeCode",
        code: code,
      },
      function (resp) {
        if (resp && resp.success) {
        } else {
          alert("Sorry, failed to inject code. Please, try refreshing the page.");
        }
      }
    );
  } catch (err) {
    alert("Sorry, there's an error generating/injecting the code: " + err.message);
  }
}

function triggerRender() {
  try {
    const updateButton = document.getElementById("updateButton");
    if (updateButton) {
      updateButton.click();
      return;
    }

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
        return;
      }
    }

    keebSim();
  } catch (err) {}
}

function keebSim() {
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

function updateparamVisibility() {
  const shape = document.getElementById("shape-select").value;

  document
    .querySelectorAll(
      ".cube-param, .sphere-param, .cylinder-param, .cone-param, .torus-param, " +
        ".text3d-param, .circle-param, " +
        ".square-param, .polygon-param"
    )
    .forEach((p) => {
      p.style.display = "none";
    });

  document.querySelectorAll(".common-param").forEach((p) => {
    p.style.display = "block";
  });

  document.querySelectorAll(`.${shape}-param`).forEach((p) => {
    p.style.display = "block";
  });
}

function getShapeParameters() {
  try {
    const shape = document.getElementById("shape-select").value;
    const params = {};

    params.center = true;

    params.rotateX = parseFloat(document.getElementById("rotate-x-input").value) || 0;
    params.rotateY = parseFloat(document.getElementById("rotate-y-input").value) || 0;
    params.rotateZ = parseFloat(document.getElementById("rotate-z-input").value) || 0;
    params.translateX = parseFloat(document.getElementById("translate-x-input").value) || 0;
    params.translateY = parseFloat(document.getElementById("translate-y-input").value) || 0;
    params.translateZ = parseFloat(document.getElementById("translate-z-input").value) || 0;

    switch (shape) {
      case "cube":
        params.sizeX = parseFloat(document.getElementById("size-x-input").value);
        params.sizeY = parseFloat(document.getElementById("size-y-input").value);
        params.sizeZ = parseFloat(document.getElementById("size-z-input").value);
        break;
      case "sphere":
        params.radius = parseFloat(document.getElementById("radius-input").value);
        params.resolution = parseInt(document.getElementById("sphere-resolution-input").value);
        break;
      case "cylinder":
        params.radius = parseFloat(document.getElementById("cylinder-radius-input").value);
        params.height = parseFloat(document.getElementById("height-input").value);
        params.resolution = parseInt(document.getElementById("cylinder-resolution-input").value);
        break;
      case "cone":
        params.bottomRadius = parseFloat(document.getElementById("cone-bottom-radius-input").value);
        params.topRadius = parseFloat(document.getElementById("cone-top-radius-input").value);
        params.height = parseFloat(document.getElementById("cone-height-input").value);
        params.resolution = parseInt(document.getElementById("cone-resolution-input").value);
        break;
      case "torus":
        params.radius1 = parseFloat(document.getElementById("torus-radius1-input").value);
        params.radius2 = parseFloat(document.getElementById("torus-radius2-input").value);
        params.resolution = parseInt(document.getElementById("torus-resolution-input").value);
        params.innerResolution = parseInt(document.getElementById("torus-inner-resolution-input").value);
        break;
      case "text3d":
        params.text = document.getElementById("text-input").value;
        params.size = parseFloat(document.getElementById("text-size-input").value);
        params.height = parseFloat(document.getElementById("text-height-input").value);
        break;
      case "circle":
        params.radius = parseFloat(document.getElementById("circle-radius-input").value);
        params.resolution = parseInt(document.getElementById("circle-resolution-input").value);
        break;
      case "square":
        params.sizeX = parseFloat(document.getElementById("square-size-x-input").value);
        params.sizeY = parseFloat(document.getElementById("square-size-y-input").value);
        break;
      case "polygon":
        break;
      default:
    }

    return params;
  } catch (err) {
    throw new Error(err.message);
  }
}

function createShapeBuilderPanel() {
  if (document.getElementById("shape-builder-panel")) {
    return;
  }

  initShapeBuilder();
}
