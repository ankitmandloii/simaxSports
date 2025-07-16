import { fabric } from "fabric";
import { deleteImageState, deleteTextState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { useDispatch } from "react-redux";

// const dispatch = useDispatch();
// Placeholder icons as data URLs (replace with your SVG data URLs)
const deleteIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
`)}`;

const resizeIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(90 8 8)">
    <g>
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0"/>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59"/>
    </g>
  </g>
</svg>
`)}`;

const rotateIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.47 15.1">
  <g transform="rotate(180, 8.235, 7.55)">
    <g>
      <path d="M14.3,2.17A8,8,0,0,1,3.09,13.42,7.84,7.84,0,0,1,1.68,12,8,8,0,0,1,2.31,1.48L3.73,2.89a6,6,0,0,0-.62,7.69,6.63,6.63,0,0,0,.65.77,5.73,5.73,0,0,0,.76.64A6,6,0,0,0,12.87,3.6L10.08,6.39,10,1.45,10,0h6.46Z"/>
    </g>
  </g>
</svg>
`)}`;
const heightIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(-45 8 8)">
    <g>
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0"/>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59"/>
    </g>
  </g>
</svg>
`)}`;

const widthIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(45 8 8)">
    <g>
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0"/>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59"/>
    </g>
  </g>
</svg>
`)}`;

const layerIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers-half" viewBox="0 0 16 16">
  <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
</svg>
`)}`;

// Example locked objects list (can be dynamic or from your redux)
const lockedObjects = new Set(); // contains fabricObject IDs to lock transformations

// Check if object is locked
function isLocked(_eventData, transform) {
  if (!transform || !transform.target) return false;
  return lockedObjects.has(transform.target.id);
}

// --- Renderers for HTML controls ---
// Delete control - clickable


// Helper: position and show HTML control icons
function positionHtmlControl(el, canvas, left, top) {
  const viewportTransform = canvas.viewportTransform;
  const rect = canvas.upperCanvasEl.getBoundingClientRect();

  const { x, y } = fabric.util.transformPoint(new fabric.Point(left, top), viewportTransform);

  el.style.left = `${rect.left + x - 14}px`;
  el.style.top = `${rect.top + y - 14}px`;
  el.style.display = "flex";
}

// Delete control - clickable
function renderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

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
    el.onmouseenter = () => {
      el.style.backgroundColor = "#005bff";
      img.style.filter = "invert(1)"; // white icon
    };
    el.onmouseleave = () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)"; // restore icon
    };

    img.onclick = () => {
      if (!isLocked(null, { target: fabricObject })) {
        // Get canvas early
        const canvas = fabricObject.canvas;
        if (!canvas) return;  // Safety check

        // Remove HTML controls
        if (fabricObject.htmlDeleteEl) {
          fabricObject.htmlDeleteEl.remove();
          fabricObject.htmlDeleteEl = null;
        }
        if (fabricObject._htmlControls) {
          Object.values(fabricObject._htmlControls).forEach(el => el.remove());
          fabricObject._htmlControls = null;
        }

        // dispatch(deleteTextState(fabricObject.id));
        // dispatch(deleteImageState(fabricObject.id));

        // Remove object and request render
        canvas.remove(fabricObject);
        canvas.requestRenderAll();
      }
    };


    el.appendChild(img);
    document.body.appendChild(el);
    fabricObject._htmlControls.delete = el;
  }

  positionHtmlControl(fabricObject._htmlControls.delete, canvas, left, top);
}

// Resize control - scale both axes (drag via Fabric)
// function renderHtmlResizeControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
//   if (!fabricObject._htmlControls.resize) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       cursor: "nwse-resize",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "9999",
//       pointerEvents: "none",
//     });

//     const img = document.createElement("img");
//     img.src = resizeIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "none";

//     fabricObject.on("modified", () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     });

//     // Attach events directly
//     canvas.on("object:scaling", (e) => {
//       const obj = e.target;
//       if (obj !== fabricObject) return;


//       if (!['scale'].includes(e.transform.action)) return;

//       const corner = e.transform?.corner;

//       const controlEl = fabricObject._htmlControls?.resize;
//       if (controlEl) {
//         controlEl.style.backgroundColor = "#005bff";
//         const img = controlEl.querySelector("img");
//         if (img) img.style.filter = "invert(1)";
//       }
//     });
//     el.appendChild(img);
//     document.body.appendChild(el);
//     fabricObject._htmlControls.resize = el;
//   }

//   positionHtmlControl(fabricObject._htmlControls.resize, canvas, left, top);
// }
function renderHtmlResizeControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.resize) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      backgroundColor: "white",
      borderRadius: "50%",
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

    el.appendChild(img);
    document.body.appendChild(el);
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

// Rotate control
function renderHtmlRotateControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

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
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
      pointerEvents: "none", // Keep Fabric functionality intact
    });

    const img = document.createElement("img");
    img.src = rotateIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "none";

    el.appendChild(img);
    document.body.appendChild(el);
    fabricObject._htmlControls.rotate = el;

    // Store state for hover
    let isHovering = false;

    const hoverDistance = 20; // Pixels tolerance

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

    // Clean up when object removed
    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    // Reset style on end
    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)";
    });

    canvas.on("object:rotating", (e) => {
      const obj = e.target;
      if (obj !== fabricObject) return;

      el.style.backgroundColor = "#005bff";
      img.style.filter = "invert(1)";
    });
  }

  positionHtmlControl(fabricObject._htmlControls.rotate, canvas, left, top);
}


// Height control (scaleY)
function renderHtmlHeightControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.height) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      backgroundColor: "white",
      borderRadius: "50%",
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
      pointerEvents: "none", // critical for fabric to work
    });

    const img = document.createElement("img");
    img.src = heightIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "none";

    el.appendChild(img);
    document.body.appendChild(el);
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

        if (isHovering) {
          el.style.backgroundColor = "#005bff";
          img.style.filter = "invert(1)";
          canvas.upperCanvasEl.style.cursor = controlCursor;
        } else {
          el.style.backgroundColor = "white";
          img.style.filter = "invert(0)";
          canvas.upperCanvasEl.style.cursor = ""; // Reset to default
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


// Width control (scaleX)
// function renderHtmlWidthControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
//   if (!fabricObject._htmlControls.width) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       cursor: "e-resize",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "9999",
//       pointerEvents: "auto",
//     });
//         const img = document.createElement("img");


//       img.src = widthIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "none";
//     el.onmouseenter = () => {
//       el.style.backgroundColor = "#005bff";
//       img.style.filter = "invert(1)"; // white icon
//     };
//     el.onmouseleave = () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)"; // restore icon
//     };

//     el.appendChild(img);
//     document.body.appendChild(el);
//     fabricObject._htmlControls.width = el;
//   }

//   positionHtmlControl(fabricObject._htmlControls.width, canvas, left, top);
// }
// function renderHtmlWidthControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

//   if (!fabricObject._htmlControls.width) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       cursor: "e-resize",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "9999",
//       pointerEvents: "none", // Allow events
//       transition: "background-color 0.2s",
//     });

//     const img = document.createElement("img");
//     img.src = widthIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "none";
//     el.appendChild(img);

//     fabricObject.on("modified", () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     });

//     // Attach events directly
//     canvas.on("object:scaling", (e) => {
//       const obj = e.target;
//       if (obj !== fabricObject) return;


//       if (!['scaleX'].includes(e.transform.action)) return;

//       const corner = e.transform?.corner;

//       const controlEl = fabricObject._htmlControls?.width;
//       if (controlEl) {
//         controlEl.style.backgroundColor = "#005bff";
//         const img = controlEl.querySelector("img");
//         if (img) img.style.filter = "invert(1)";
//       }
//     });
//     document.body.appendChild(el);
//     fabricObject._htmlControls.width = el;
//   }

//   positionHtmlControl(fabricObject._htmlControls.width, canvas, left, top);
// }
function renderHtmlWidthControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.width) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      backgroundColor: "white",
      borderRadius: "50%",
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
    img.src = widthIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "none";

    el.appendChild(img);
    document.body.appendChild(el);
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


// Layer control - clickable (call bringPopup or any handler)
function renderHtmlLayerControl(ctx, left, top, _styleOverride, fabricObject, bringPopup) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

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
      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
      zIndex: "99",
    });
    el.onmouseenter = () => {
      el.style.backgroundColor = "#005bff";
      img.style.filter = "invert(1)"; // white icon
    };
    el.onmouseleave = () => {
      el.style.backgroundColor = "white";
      img.style.filter = "invert(0)"; // restore icon
    };

    const img = document.createElement("img");
    img.src = layerIconDataURL;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.pointerEvents = "auto";

    img.onclick = (e) => {
      e.stopPropagation();
      if (typeof bringPopup === "function") {
        bringPopup(fabricObject);
      }
    };

    el.appendChild(img);
    document.body.appendChild(el);
    fabricObject._htmlControls.layer = el;
  }

  positionHtmlControl(fabricObject._htmlControls.layer, canvas, left, top);
}


// Action handlers for scaling and rotation (use fabric.utils)
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

// Main exported function to create controls object
export function createControls(bringPopup) {
  return {
    deleteControl: new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 15,
      render: renderHtmlDeleteControl,
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
