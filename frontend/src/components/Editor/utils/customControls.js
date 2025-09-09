import { fabric } from "fabric";
import { deleteImageState, deleteTextState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { useDispatch } from "react-redux";

// Placeholder icons as data URLs (unchanged)
const deleteIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#424447" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
`)}`;

const resizeIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(90 8 8)">
    <g>
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0" fill="#424447"/>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59" fill="#424447"/>
    </g>
  </g>
</svg>
`)}`;

const rotateIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.47 15.1">
  <g transform="rotate(180, 8.235, 7.55)">
    <g>
      <path d="M14.3,2.17A8,8,0,0,1,3.09,13.42,7.84,7.84,0,0,1,1.68,12,8,8,0,0,1,2.31,1.48L3.73,2.89a6,6,0,0,0-.62,7.69,6.63,6.63,0,0,0,.65.77,5.73,5.73,0,0,0,.76.64A6,6,0,0,0,12.87,3.6L10.08,6.39,10,1.45,10,0h6.46Z" fill="#424447"/>
    </g>
  </g>
</svg>
`)}`;

const heightIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(-45 8 8)">
    <g>
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0" fill="#424447"/>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59" fill="#424447"/>
    </g>
  </g>
</svg>
`)}`;

const widthIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(45 8 8)">
    <g>
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0" fill="#424447"/>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59" fill="#424447"/>
    </g>
  </g>
</svg>
`)}`;

const layerIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#424447" class="bi bi-layers-half" viewBox="0 0 16 16">
  <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
</svg>
`)}`;

// Locked objects (unchanged)
const lockedObjects = new Set();

function isLocked(_eventData, transform) {
  if (!transform || !transform.target) return false;
  return lockedObjects.has(transform.target.id);
}

function positionHtmlControl(el, canvas, left, top, label = "", forceSync = false) {
  console.group(`positionHtmlControl [${label}] for object type: ${canvas.getActiveObject()?.type || 'unknown'}`);

  // No need for initial vt/zoom log since we don't transform
  console.log("Input coords (screen space from render):", { left, top });

  if (!el) {
    console.warn(`No element for ${label}`);
    console.groupEnd();
    return;
  }

  const doPosition = () => {
    // Wait for element to be in DOM and rendered before measuring size
    if (!el.offsetWidth || !el.offsetHeight) {
      console.warn(`Element not rendered yet for ${label}. Deferring once more.`);
      requestAnimationFrame(() => doPosition());
      return;
    }

    const offsetW = el.offsetWidth;
    const offsetH = el.offsetHeight;
    console.log("Element size:", { w: offsetW, h: offsetH });

    // Use input left/top directly (already screen-transformed by Fabric)
    // Center the element on the control point
    const finalLeft = left - offsetW / 2;
    const finalTop = top - offsetH / 2;
    console.log("Final element position:", { finalLeft, finalTop });

    // Apply styles
    el.style.position = "absolute";
    el.style.left = `${finalLeft}px`;
    el.style.top = `${finalTop}px`;
    el.style.display = "flex";
  };

  if (forceSync) {
    doPosition(); // Immediate for post-zoom cases
  } else {
    requestAnimationFrame(doPosition); // Defer for regular render timing (still useful for DOM readiness)
  }

  console.groupEnd();
}

function attachControlListeners(canvas, fabricObject) {
  let prevZoom = canvas.getZoom(); // Track previous zoom for change detection

  const update = () => {
    if (!fabricObject._htmlControls || !canvas.getActiveObject()) return;

    // Force setCoords() to refresh oCoords (critical for curved-text and zoom)
    fabricObject.setCoords();

    const currentZoom = canvas.getZoom();
    const zoomChanged = Math.abs(currentZoom - prevZoom) > 0.001; // Detect zoom change
    prevZoom = currentZoom;

    if (zoomChanged) {
      console.log(`Zoom changed to ${currentZoom} - forcing sync update`);
    }

    Object.entries(fabricObject._htmlControls).forEach(([key, el]) => {
      const ctrl = fabricObject.controls[key];
      if (!ctrl) return;

      // Use positionHandler with optional zoom param for precision
      let pt;
      if (ctrl.positionHandler.length > 2) {
        pt = ctrl.positionHandler(fabricObject, ctrl, currentZoom);
      } else {
        pt = ctrl.positionHandler(fabricObject, ctrl);
      }
      positionHtmlControl(el, canvas, pt.x, pt.y, key, zoomChanged); // forceSync if zoom changed
    });
  };

  // Update when object or canvas changes
  fabricObject.on("moved", update);
  fabricObject.on("scaled", update);
  fabricObject.on("rotated", update);
  canvas.on("after:render", update); // This now detects and handles zoom via prevZoom

  // Clear on removal/deselection
  fabricObject.on("removed", () => {
    prevZoom = null; // Reset tracker
    canvas.off("after:render", update); // Clean up listener
  });
  canvas.on("selection:cleared", () => {
    prevZoom = canvas.getZoom(); // Reset to current for next selection
  });
}

// Render functions (unchanged, but ensure setCoords() is called)
function renderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject, dispatch) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  fabricObject.setCoords();

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.delete) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      cursor: "pointer",
      backgroundColor: "white",
      borderRadius: "50%",
      border: "1px solid #B0B0B0",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
    });

    const img = document.createElement("img");
    img.src = deleteIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "auto";

    // Hover effect
    el.onmouseenter = () => {
      el.style.backgroundColor = "#005bff";
      img.style.filter = "invert(1)";
    };
    el.onmouseleave = () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    };

    // Delete action
    img.onclick = () => {
      if (!fabricObject.locked) {
        if (fabricObject._htmlControls) {
          Object.values(fabricObject._htmlControls).forEach(e => e.remove());
          fabricObject._htmlControls = null;
        }
        dispatch(deleteImageState(fabricObject.id));
        dispatch(deleteTextState(fabricObject.id));
        canvas.remove(fabricObject);
        canvas.requestRenderAll();
      }
    };

    el.appendChild(img);
    canvas.upperCanvasEl.parentNode.appendChild(el);

    fabricObject._htmlControls.delete = el;

    // Attach listeners once
    attachControlListeners(canvas, fabricObject);
  }

  positionHtmlControl(fabricObject._htmlControls.delete, canvas, left, top, "delete");
}

function renderHtmlResizeControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  fabricObject.setCoords();

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.resize) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      backgroundColor: "white",
      borderRadius: "50%",
      border: "1px solid #B0B0B0",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
      pointerEvents: "none",
      transition: "background-color 0.2s",
    });

    const img = document.createElement("img");
    img.src = resizeIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "none";

    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img);
    canvas.upperCanvasEl.parentNode.appendChild(el);
    fabricObject._htmlControls.resize = el;

    let isHovering = false;
    const hoverDistance = 20;
    const controlCursor = "nwse-resize";

    const checkHover = (pointer) => {
      const controlRect = el.getBoundingClientRect();
      const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

      const controlCenter = {
        x: controlRect.left + controlRect.width / 2,
        y: controlRect.top + controlRect.height / 2,
      };

      const cursorPos = {
        x: canvasRect.left + pointer.x,
        y: canvasRect.top + pointer.y,
      };

      const dx = cursorPos.x - controlCenter.x;
      const dy = cursorPos.y - controlCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const currentlyHovering = dist < hoverDistance;

      if (currentlyHovering !== isHovering) {
        isHovering = currentlyHovering;

        if (isHovering) {
          el.style.backgroundColor = "#005bff";
          img.style.filter = "invert(1)";
          canvas.upperCanvasEl.style.cursor = controlCursor;
        } else {
          el.style.backgroundColor = "white";
          img.style.filter = "invert(0)";
          canvas.upperCanvasEl.style.cursor = "";
        }
      }
    };

    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    canvas.on("mouse:move", moveHandler);

    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.remove();
    });

    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    });

    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj !== fabricObject) return;
      if (!["scale"].includes(e.transform.action)) return;

      const controlEl = fabricObject._htmlControls?.resize;
      if (controlEl) {
        controlEl.style.backgroundColor = "#005bff";
        const img = controlEl.querySelector("img");
        if (img) img.style.filter = "invert(1)";
      }
    });
  }

  positionHtmlControl(fabricObject._htmlControls.resize, canvas, left, top);
}

function renderHtmlRotateControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  fabricObject.setCoords();

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.rotate) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      cursor: "crosshair",
      backgroundColor: "white",
      borderRadius: "50%",
      border: "1px solid #B0B0B0",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
      pointerEvents: "none",
    });

    const img = document.createElement("img");
    img.src = rotateIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "none";
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img);
    canvas.upperCanvasEl.parentNode.appendChild(el);
    fabricObject._htmlControls.rotate = el;

    let isHovering = false;
    const hoverDistance = 20;

    const checkHover = (pointer) => {
      const controlRect = el.getBoundingClientRect();
      const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

      const controlCenter = {
        x: controlRect.left + controlRect.width / 2,
        y: controlRect.top + controlRect.height / 2,
      };

      const cursorPos = {
        x: canvasRect.left + pointer.x,
        y: canvasRect.top + pointer.y,
      };

      const dx = cursorPos.x - controlCenter.x;
      const dy = cursorPos.y - controlCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const currentlyHovering = dist < hoverDistance;

      if (currentlyHovering !== isHovering) {
        isHovering = currentlyHovering;
        el.style.backgroundColor = isHovering ? "#005bff" : "white";
        img.style.filter = isHovering ? "invert(1)" : "invert(0)";
      }
    };

    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    canvas.on("mouse:move", moveHandler);

    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    });

    canvas.on("object:rotating", (e) => {
      if (fabricObject.locked) return;
      const obj = e.target;
      if (obj !== fabricObject) return;

      el.style.backgroundColor = "#005bff";
      img.style.filter = "invert(1)";
    });
  }

  positionHtmlControl(fabricObject._htmlControls.rotate, canvas, left, top);
}

function renderHtmlHeightControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  fabricObject.setCoords();

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.height) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "15px",
      height: "28px",
      marginLeft: "6px",
      backgroundColor: "white",
      border: "1px solid #B0B0B0",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "99",
      pointerEvents: "none",
    });

    const img = document.createElement("img");
    img.src = heightIconDataURL;
    img.style.width = "18px";
    img.style.height = "18px";
    img.style.pointerEvents = "none";
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img);
    canvas.upperCanvasEl.parentNode.appendChild(el);
    fabricObject._htmlControls.height = el;

    let isHovering = false;
    const hoverDistance = 20;
    const controlCursor = "n-resize";

    const checkHover = (pointer) => {
      const controlRect = el.getBoundingClientRect();
      const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

      const controlCenter = {
        x: controlRect.left + controlRect.width / 2,
        y: controlRect.top + controlRect.height / 2,
      };

      const cursorPos = {
        x: canvasRect.left + pointer.x,
        y: canvasRect.top + pointer.y,
      };

      const dx = cursorPos.x - controlCenter.x;
      const dy = cursorPos.y - controlCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const currentlyHovering = dist < hoverDistance;

      if (currentlyHovering !== isHovering) {
        isHovering = currentlyHovering;
        el.style.backgroundColor = isHovering ? "#005bff" : "white";
        img.style.filter = isHovering ? "invert(1)" : "invert(0)";
        canvas.upperCanvasEl.style.cursor = isHovering ? controlCursor : "";
      }
    };

    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    canvas.on("mouse:move", moveHandler);

    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    });

    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj !== fabricObject || fabricObject.locked) return;
      if (!["scaleY"].includes(e.transform.action)) return;

      const controlEl = fabricObject._htmlControls?.height;
      if (controlEl) {
        controlEl.style.backgroundColor = "#005bff";
        const img = controlEl.querySelector("img");
        if (img) img.style.filter = "invert(1)";
      }
    });
  }

  positionHtmlControl(fabricObject._htmlControls.height, canvas, left, top);
}

function renderHtmlWidthControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  fabricObject.setCoords();

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.width) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "15px",
      backgroundColor: "white",
      border: "1px solid #B0B0B0",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      marginTop: "6px",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "99",
      pointerEvents: "none",
      transition: "background-color 0.2s",
    });

    const img = document.createElement("img");
    img.src = widthIconDataURL;
    img.style.width = "18px";
    img.style.height = "18px";
    img.style.pointerEvents = "none";
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img);
    canvas.upperCanvasEl.parentNode.appendChild(el);
    fabricObject._htmlControls.width = el;

    let isHovering = false;
    const hoverDistance = 20;
    const controlCursor = "e-resize";

    const checkHover = (pointer) => {
      const controlRect = el.getBoundingClientRect();
      const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

      const controlCenter = {
        x: controlRect.left + controlRect.width / 2,
        y: controlRect.top + controlRect.height / 2,
      };

      const cursorPos = {
        x: canvasRect.left + pointer.x,
        y: canvasRect.top + pointer.y,
      };

      const dx = cursorPos.x - controlCenter.x;
      const dy = cursorPos.y - controlCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const currentlyHovering = dist < hoverDistance;

      if (currentlyHovering !== isHovering) {
        isHovering = currentlyHovering;
        el.style.backgroundColor = isHovering ? "#005bff" : "white";
        img.style.filter = isHovering ? "invert(1)" : "invert(0)";
        canvas.upperCanvasEl.style.cursor = isHovering ? controlCursor : "";
      }
    };

    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    canvas.on("mouse:move", moveHandler);

    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    });

    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj !== fabricObject) return;
      if (!["scaleX"].includes(e.transform.action)) return;

      const controlEl = fabricObject._htmlControls?.width;
      if (controlEl) {
        controlEl.style.backgroundColor = "#005bff";
        const img = controlEl.querySelector("img");
        if (img) img.style.filter = "invert(1)";
      }
    });
  }

  positionHtmlControl(fabricObject._htmlControls.width, canvas, left, top);
}

function renderHtmlLayerControl(ctx, left, top, _styleOverride, fabricObject, bringPopup) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  fabricObject.setCoords();

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
  if (!fabricObject._htmlControls.layer) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      cursor: "pointer",
      backgroundColor: "white",
      borderRadius: "50%",
      border: "1px solid #B0B0B0",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
      transition: "background-color 0.2s",
    });

    const img = document.createElement("img");
    img.src = layerIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "auto";

    el.onmouseenter = () => {
      el.style.backgroundColor = "#005bff";
      img.style.filter = "invert(1)";
    };
    el.onmouseleave = () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    };

    img.onclick = (e) => {
      e.stopPropagation();
      if (typeof bringPopup === "function") {
        bringPopup(fabricObject);
      }
    };
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img);
    canvas.upperCanvasEl.parentNode.appendChild(el);
    fabricObject._htmlControls.layer = el;
  }

  positionHtmlControl(fabricObject._htmlControls.layer, canvas, left, top);
}

// Action handlers (unchanged)
function scaleFromCenter(eventData, transform, x, y) {
  transform.target.set({ centeredScaling: true });
  return fabric.controlsUtils.scalingEqually(eventData, transform, x, y);
}
function scaleXFromCenter(eventData, transform, x, y) {
  transform.target.set({ centeredScaling: true });
  return fabric.controlsUtils.scalingX(eventData, transform, x, y);
}
function scaleYFromCenter(eventData, transform, x, y) {
  transform.target.set({ centeredScaling: true });
  return fabric.controlsUtils.scalingY(eventData, transform, x, y);
}
function rotateWithCenter(eventData, transform, x, y) {
  transform.target.set({ centeredRotation: true });
  return fabric.controlsUtils.rotationWithSnapping(eventData, transform, x, y);
}

// Exported function (unchanged)
export function createControls(bringPopup, dispatch) {
  return {
    deleteControl: new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 15,
      render: (ctx, left, top, _styleOverride, fabricObject) => {
        return renderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject, dispatch)
      },
      cornerSize: 15,
    }),
    resizeControl: new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetX: 16,
      offsetY: 16,
      cursorStyle: "nwse-resize",
      actionHandler: scaleFromCenter,
      actionName: "scale",
      render: renderHtmlResizeControl,
      cornerSize: 15,
    }),
    rotateControl: new fabric.Control({
      x: -0.5,
      y: -0.5,
      offsetX: -16,
      offsetY: -16,
      cursorStyle: "crosshair",
      actionHandler: rotateWithCenter,
      actionName: "rotate",
      render: renderHtmlRotateControl,
      cornerSize: 15,
    }),
    increaseHeight: new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -16,
      cursorStyle: "n-resize",
      actionHandler: scaleYFromCenter,
      actionName: "scaleY",
      render: renderHtmlHeightControl,
      cornerSize: 15,
    }),
    increaseWidth: new fabric.Control({
      x: 0.5,
      y: 0,
      offsetX: 16,
      cursorStyle: "e-resize",
      actionHandler: scaleXFromCenter,
      actionName: "scaleX",
      render: renderHtmlWidthControl,
      cornerSize: 15,
    }),
    layerControl: new fabric.Control({
      x: -0.5,
      y: 0.5,
      offsetX: -16,
      offsetY: 16,
      cursorStyle: "pointer",
      render: (ctx, left, top, styleOverride, fabricObject) => {
        renderHtmlLayerControl(ctx, left, top, styleOverride, fabricObject, bringPopup);
      },
      cornerSize: 15,
    }),
  };
}