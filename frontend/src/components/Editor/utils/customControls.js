// import { fabric } from "fabric";
// import { deleteImageState, deleteTextState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
// import { useDispatch } from "react-redux";

// // Placeholder icons as data URLs (unchanged)
// const deleteIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#424447" viewBox="0 0 16 16">
//   <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
//   <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
// </svg>
// `)}`;

// const resizeIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//   <g transform="translate(4 4) rotate(90 8 8)">
//     <g>
//       <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0" fill="#424447"/>
//       <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59" fill="#424447"/>
//     </g>
//   </g>
// </svg>
// `)}`;

// const rotateIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.47 15.1">
//   <g transform="rotate(180, 8.235, 7.55)">
//     <g>
//       <path d="M14.3,2.17A8,8,0,0,1,3.09,13.42,7.84,7.84,0,0,1,1.68,12,8,8,0,0,1,2.31,1.48L3.73,2.89a6,6,0,0,0-.62,7.69,6.63,6.63,0,0,0,.65.77,5.73,5.73,0,0,0,.76.64A6,6,0,0,0,12.87,3.6L10.08,6.39,10,1.45,10,0h6.46Z" fill="#424447"/>
//     </g>
//   </g>
// </svg>
// `)}`;

// const heightIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//   <g transform="translate(4 4) rotate(-45 8 8)">
//     <g>
//       <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0" fill="#424447"/>
//       <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59" fill="#424447"/>
//     </g>
//   </g>
// </svg>
// `)}`;

// const widthIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//   <g transform="translate(4 4) rotate(45 8 8)">
//     <g>
//       <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0" fill="#424447"/>
//       <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59" fill="#424447"/>
//     </g>
//   </g>
// </svg>
// `)}`;

// const layerIconDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#424447" class="bi bi-layers-half" viewBox="0 0 16 16">
//   <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
// </svg>
// `)}`;

// // Locked objects (unchanged)
// const lockedObjects = new Set();

// function isLocked(_eventData, transform) {
//   if (!transform || !transform.target) return false;
//   return lockedObjects.has(transform.target.id);
// }

// function positionHtmlControl(el, canvas, left, top, label = "", forceSync = false) {
//   console.group(`positionHtmlControl [${label}] for object type: ${canvas.getActiveObject()?.type || 'unknown'}`);

//   // No need for initial vt/zoom log since we don't transform
//   console.log("Input coords (screen space from render):", { left, top });

//   if (!el) {
//     console.warn(`No element for ${label}`);
//     console.groupEnd();
//     return;
//   }

//   const doPosition = () => {
//     // Wait for element to be in DOM and rendered before measuring size
//     if (!el.offsetWidth || !el.offsetHeight) {
//       console.warn(`Element not rendered yet for ${label}. Deferring once more.`);
//       requestAnimationFrame(() => doPosition());
//       return;
//     }

//     const offsetW = el.offsetWidth;
//     const offsetH = el.offsetHeight;
//     console.log("Element size:", { w: offsetW, h: offsetH });

//     // Use input left/top directly (already screen-transformed by Fabric)
//     // Center the element on the control point
//     const finalLeft = left - offsetW / 2;
//     const finalTop = top - offsetH / 2;
//     console.log("Final element position:", { finalLeft, finalTop });

//     // Apply styles
//     el.style.position = "absolute";
//     el.style.left = `${finalLeft}px`;
//     el.style.top = `${finalTop}px`;
//     el.style.display = "flex";
//   };

//   if (forceSync) {
//     doPosition(); // Immediate for post-zoom cases
//   } else {
//     requestAnimationFrame(doPosition); // Defer for regular render timing (still useful for DOM readiness)
//   }

//   console.groupEnd();
// }

// function attachControlListeners(canvas, fabricObject) {
//   let prevZoom = canvas.getZoom(); // Track previous zoom for change detection

//   const update = () => {
//     if (!fabricObject._htmlControls || !canvas.getActiveObject()) return;

//     // Force setCoords() to refresh oCoords (critical for curved-text and zoom)
//     fabricObject.setCoords();

//     const currentZoom = canvas.getZoom();
//     const zoomChanged = Math.abs(currentZoom - prevZoom) > 0.001; // Detect zoom change
//     prevZoom = currentZoom;

//     if (zoomChanged) {
//       console.log(`Zoom changed to ${currentZoom} - forcing sync update`);
//     }

//     Object.entries(fabricObject._htmlControls).forEach(([key, el]) => {
//       const ctrl = fabricObject.controls[key];
//       if (!ctrl) return;

//       // Use positionHandler with optional zoom param for precision
//       let pt;
//       if (ctrl.positionHandler.length > 2) {
//         pt = ctrl.positionHandler(fabricObject, ctrl, currentZoom);
//       } else {
//         pt = ctrl.positionHandler(fabricObject, ctrl);
//       }
//       positionHtmlControl(el, canvas, pt.x, pt.y, key, zoomChanged); // forceSync if zoom changed
//     });
//   };

//   // Update when object or canvas changes
//   fabricObject.on("moved", update);
//   fabricObject.on("scaled", update);
//   fabricObject.on("rotated", update);
//   canvas.on("after:render", update); // This now detects and handles zoom via prevZoom

//   // Clear on removal/deselection
//   fabricObject.on("removed", () => {
//     prevZoom = null; // Reset tracker
//     canvas.off("after:render", update); // Clean up listener
//   });
//   canvas.on("selection:cleared", () => {
//     prevZoom = canvas.getZoom(); // Reset to current for next selection
//   });
// }

// // Render functions (unchanged, but ensure setCoords() is called)
// function renderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject, dispatch) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;
//   fabricObject.setCoords();

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

//   if (!fabricObject._htmlControls.delete) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       cursor: "pointer",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       border: "1px solid #B0B0B0",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "99",
//     });

//     const img = document.createElement("img");
//     img.src = deleteIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "auto";

//     // Hover effect
//     el.onmouseenter = () => {
//       el.style.backgroundColor = "#005bff";
//       img.style.filter = "invert(1)";
//     };
//     el.onmouseleave = () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     };

//     // Delete action
//     img.onclick = () => {
//       if (!fabricObject.locked) {
//         if (fabricObject._htmlControls) {
//           Object.values(fabricObject._htmlControls).forEach(e => e.remove());
//           fabricObject._htmlControls = null;
//         }
//         dispatch(deleteImageState(fabricObject.id));
//         dispatch(deleteTextState(fabricObject.id));
//         canvas.remove(fabricObject);
//         canvas.requestRenderAll();
//       }
//     };

//     el.appendChild(img);
//     canvas.upperCanvasEl.parentNode.appendChild(el);

//     fabricObject._htmlControls.delete = el;

//     // Attach listeners once
//     attachControlListeners(canvas, fabricObject);
//   }

//   positionHtmlControl(fabricObject._htmlControls.delete, canvas, left, top, "delete");
// }

// function renderHtmlResizeControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;
//   fabricObject.setCoords();

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

//   if (!fabricObject._htmlControls.resize) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       border: "1px solid #B0B0B0",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "99",
//       pointerEvents: "none",
//       transition: "background-color 0.2s",
//     });

//     const img = document.createElement("img");
//     img.src = resizeIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "none";

//     el.setAttribute("data-fabric-control", "true");
//     el.appendChild(img);
//     canvas.upperCanvasEl.parentNode.appendChild(el);
//     fabricObject._htmlControls.resize = el;

//     let isHovering = false;
//     const hoverDistance = 20;
//     const controlCursor = "nwse-resize";

//     const checkHover = (pointer) => {
//       const controlRect = el.getBoundingClientRect();
//       const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

//       const controlCenter = {
//         x: controlRect.left + controlRect.width / 2,
//         y: controlRect.top + controlRect.height / 2,
//       };

//       const cursorPos = {
//         x: canvasRect.left + pointer.x,
//         y: canvasRect.top + pointer.y,
//       };

//       const dx = cursorPos.x - controlCenter.x;
//       const dy = cursorPos.y - controlCenter.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       const currentlyHovering = dist < hoverDistance;

//       if (currentlyHovering !== isHovering) {
//         isHovering = currentlyHovering;

//         if (isHovering) {
//           el.style.backgroundColor = "#005bff";
//           img.style.filter = "invert(1)";
//           canvas.upperCanvasEl.style.cursor = controlCursor;
//         } else {
//           el.style.backgroundColor = "white";
//           img.style.filter = "invert(0)";
//           canvas.upperCanvasEl.style.cursor = "";
//         }
//       }
//     };

//     const moveHandler = (opt) => {
//       const pointer = canvas.getPointer(opt.e);
//       checkHover(pointer);
//     };

//     canvas.on("mouse:move", moveHandler);

//     fabricObject.on("removed", () => {
//       canvas.off("mouse:move", moveHandler);
//       if (el.parentNode) el.remove();
//     });

//     fabricObject.on("modified", () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     });

//     canvas.on("object:scaling", (e) => {
//       const obj = e.target;
//       if (obj !== fabricObject) return;
//       if (!["scale"].includes(e.transform.action)) return;

//       const controlEl = fabricObject._htmlControls?.resize;
//       if (controlEl) {
//         controlEl.style.backgroundColor = "#005bff";
//         const img = controlEl.querySelector("img");
//         if (img) img.style.filter = "invert(1)";
//       }
//     });
//   }

//   positionHtmlControl(fabricObject._htmlControls.resize, canvas, left, top);
// }

// function renderHtmlRotateControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;
//   fabricObject.setCoords();

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

//   if (!fabricObject._htmlControls.rotate) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       cursor: "crosshair",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       border: "1px solid #B0B0B0",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "99",
//       pointerEvents: "none",
//     });

//     const img = document.createElement("img");
//     img.src = rotateIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "none";
//     el.setAttribute("data-fabric-control", "true");
//     el.appendChild(img);
//     canvas.upperCanvasEl.parentNode.appendChild(el);
//     fabricObject._htmlControls.rotate = el;

//     let isHovering = false;
//     const hoverDistance = 20;

//     const checkHover = (pointer) => {
//       const controlRect = el.getBoundingClientRect();
//       const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

//       const controlCenter = {
//         x: controlRect.left + controlRect.width / 2,
//         y: controlRect.top + controlRect.height / 2,
//       };

//       const cursorPos = {
//         x: canvasRect.left + pointer.x,
//         y: canvasRect.top + pointer.y,
//       };

//       const dx = cursorPos.x - controlCenter.x;
//       const dy = cursorPos.y - controlCenter.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       const currentlyHovering = dist < hoverDistance;

//       if (currentlyHovering !== isHovering) {
//         isHovering = currentlyHovering;
//         el.style.backgroundColor = isHovering ? "#005bff" : "white";
//         img.style.filter = isHovering ? "invert(1)" : "invert(0)";
//       }
//     };

//     const moveHandler = (opt) => {
//       const pointer = canvas.getPointer(opt.e);
//       checkHover(pointer);
//     };

//     canvas.on("mouse:move", moveHandler);

//     fabricObject.on("removed", () => {
//       canvas.off("mouse:move", moveHandler);
//       if (el.parentNode) el.parentNode.removeChild(el);
//     });

//     fabricObject.on("modified", () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     });

//     canvas.on("object:rotating", (e) => {
//       if (fabricObject.locked) return;
//       const obj = e.target;
//       if (obj !== fabricObject) return;

//       el.style.backgroundColor = "#005bff";
//       img.style.filter = "invert(1)";
//     });
//   }

//   positionHtmlControl(fabricObject._htmlControls.rotate, canvas, left, top);
// }

// function renderHtmlHeightControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;
//   fabricObject.setCoords();

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

//   if (!fabricObject._htmlControls.height) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "15px",
//       height: "28px",
//       marginLeft: "6px",
//       backgroundColor: "white",
//       border: "1px solid #B0B0B0",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: "99",
//       pointerEvents: "none",
//     });

//     const img = document.createElement("img");
//     img.src = heightIconDataURL;
//     img.style.width = "18px";
//     img.style.height = "18px";
//     img.style.pointerEvents = "none";
//     el.setAttribute("data-fabric-control", "true");
//     el.appendChild(img);
//     canvas.upperCanvasEl.parentNode.appendChild(el);
//     fabricObject._htmlControls.height = el;

//     let isHovering = false;
//     const hoverDistance = 20;
//     const controlCursor = "n-resize";

//     const checkHover = (pointer) => {
//       const controlRect = el.getBoundingClientRect();
//       const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

//       const controlCenter = {
//         x: controlRect.left + controlRect.width / 2,
//         y: controlRect.top + controlRect.height / 2,
//       };

//       const cursorPos = {
//         x: canvasRect.left + pointer.x,
//         y: canvasRect.top + pointer.y,
//       };

//       const dx = cursorPos.x - controlCenter.x;
//       const dy = cursorPos.y - controlCenter.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       const currentlyHovering = dist < hoverDistance;

//       if (currentlyHovering !== isHovering) {
//         isHovering = currentlyHovering;
//         el.style.backgroundColor = isHovering ? "#005bff" : "white";
//         img.style.filter = isHovering ? "invert(1)" : "invert(0)";
//         canvas.upperCanvasEl.style.cursor = isHovering ? controlCursor : "";
//       }
//     };

//     const moveHandler = (opt) => {
//       const pointer = canvas.getPointer(opt.e);
//       checkHover(pointer);
//     };

//     canvas.on("mouse:move", moveHandler);

//     fabricObject.on("removed", () => {
//       canvas.off("mouse:move", moveHandler);
//       if (el.parentNode) el.parentNode.removeChild(el);
//     });

//     fabricObject.on("modified", () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     });

//     canvas.on("object:scaling", (e) => {
//       const obj = e.target;
//       if (obj !== fabricObject || fabricObject.locked) return;
//       if (!["scaleY"].includes(e.transform.action)) return;

//       const controlEl = fabricObject._htmlControls?.height;
//       if (controlEl) {
//         controlEl.style.backgroundColor = "#005bff";
//         const img = controlEl.querySelector("img");
//         if (img) img.style.filter = "invert(1)";
//       }
//     });
//   }

//   positionHtmlControl(fabricObject._htmlControls.height, canvas, left, top);
// }

// function renderHtmlWidthControl(ctx, left, top, _styleOverride, fabricObject) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;
//   fabricObject.setCoords();

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

//   if (!fabricObject._htmlControls.width) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "15px",
//       backgroundColor: "white",
//       border: "1px solid #B0B0B0",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       marginTop: "6px",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: "99",
//       pointerEvents: "none",
//       transition: "background-color 0.2s",
//     });

//     const img = document.createElement("img");
//     img.src = widthIconDataURL;
//     img.style.width = "18px";
//     img.style.height = "18px";
//     img.style.pointerEvents = "none";
//     el.setAttribute("data-fabric-control", "true");
//     el.appendChild(img);
//     canvas.upperCanvasEl.parentNode.appendChild(el);
//     fabricObject._htmlControls.width = el;

//     let isHovering = false;
//     const hoverDistance = 20;
//     const controlCursor = "e-resize";

//     const checkHover = (pointer) => {
//       const controlRect = el.getBoundingClientRect();
//       const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

//       const controlCenter = {
//         x: controlRect.left + controlRect.width / 2,
//         y: controlRect.top + controlRect.height / 2,
//       };

//       const cursorPos = {
//         x: canvasRect.left + pointer.x,
//         y: canvasRect.top + pointer.y,
//       };

//       const dx = cursorPos.x - controlCenter.x;
//       const dy = cursorPos.y - controlCenter.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       const currentlyHovering = dist < hoverDistance;

//       if (currentlyHovering !== isHovering) {
//         isHovering = currentlyHovering;
//         el.style.backgroundColor = isHovering ? "#005bff" : "white";
//         img.style.filter = isHovering ? "invert(1)" : "invert(0)";
//         canvas.upperCanvasEl.style.cursor = isHovering ? controlCursor : "";
//       }
//     };

//     const moveHandler = (opt) => {
//       const pointer = canvas.getPointer(opt.e);
//       checkHover(pointer);
//     };

//     canvas.on("mouse:move", moveHandler);

//     fabricObject.on("removed", () => {
//       canvas.off("mouse:move", moveHandler);
//       if (el.parentNode) el.parentNode.removeChild(el);
//     });

//     fabricObject.on("modified", () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     });

//     canvas.on("object:scaling", (e) => {
//       const obj = e.target;
//       if (obj !== fabricObject) return;
//       if (!["scaleX"].includes(e.transform.action)) return;

//       const controlEl = fabricObject._htmlControls?.width;
//       if (controlEl) {
//         controlEl.style.backgroundColor = "#005bff";
//         const img = controlEl.querySelector("img");
//         if (img) img.style.filter = "invert(1)";
//       }
//     });
//   }

//   positionHtmlControl(fabricObject._htmlControls.width, canvas, left, top);
// }

// function renderHtmlLayerControl(ctx, left, top, _styleOverride, fabricObject, bringPopup) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;
//   fabricObject.setCoords();

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
//   if (!fabricObject._htmlControls.layer) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px",
//       height: "28px",
//       cursor: "pointer",
//       backgroundColor: "white",
//       borderRadius: "50%",
//       border: "1px solid #B0B0B0",
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "2px",
//       zIndex: "99",
//       transition: "background-color 0.2s",
//     });

//     const img = document.createElement("img");
//     img.src = layerIconDataURL;
//     img.style.width = "16px";
//     img.style.height = "16px";
//     img.style.pointerEvents = "auto";

//     el.onmouseenter = () => {
//       el.style.backgroundColor = "#005bff";
//       img.style.filter = "invert(1)";
//     };
//     el.onmouseleave = () => {
//       el.style.backgroundColor = "white";
//       img.style.filter = "invert(0)";
//     };

//     img.onclick = (e) => {
//       e.stopPropagation();
//       if (typeof bringPopup === "function") {
//         bringPopup(fabricObject);
//       }
//     };
//     el.setAttribute("data-fabric-control", "true");
//     el.appendChild(img);
//     canvas.upperCanvasEl.parentNode.appendChild(el);
//     fabricObject._htmlControls.layer = el;
//   }

//   positionHtmlControl(fabricObject._htmlControls.layer, canvas, left, top);
// }

// // Action handlers (unchanged)
// function scaleFromCenter(eventData, transform, x, y) {
//   transform.target.set({ centeredScaling: true });
//   return fabric.controlsUtils.scalingEqually(eventData, transform, x, y);
// }
// function scaleXFromCenter(eventData, transform, x, y) {
//   transform.target.set({ centeredScaling: true });
//   return fabric.controlsUtils.scalingX(eventData, transform, x, y);
// }
// function scaleYFromCenter(eventData, transform, x, y) {
//   transform.target.set({ centeredScaling: true });
//   return fabric.controlsUtils.scalingY(eventData, transform, x, y);
// }
// function rotateWithCenter(eventData, transform, x, y) {
//   transform.target.set({ centeredRotation: true });
//   return fabric.controlsUtils.rotationWithSnapping(eventData, transform, x, y);
// }

// // Exported function (unchanged)
// export function createControls(bringPopup, dispatch) {
//   return {
//     deleteControl: new fabric.Control({
//       x: 0.5,
//       y: -0.5,
//       offsetY: -16,
//       offsetX: 15,
//       render: (ctx, left, top, _styleOverride, fabricObject) => {
//         return renderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject, dispatch)
//       },
//       cornerSize: 15,
//     }),
//     resizeControl: new fabric.Control({
//       x: 0.5,
//       y: 0.5,
//       offsetX: 16,
//       offsetY: 16,
//       cursorStyle: "nwse-resize",
//       actionHandler: scaleFromCenter,
//       actionName: "scale",
//       render: renderHtmlResizeControl,
//       cornerSize: 15,
//     }),
//     rotateControl: new fabric.Control({
//       x: -0.5,
//       y: -0.5,
//       offsetX: -16,
//       offsetY: -16,
//       cursorStyle: "crosshair",
//       actionHandler: rotateWithCenter,
//       actionName: "rotate",
//       render: renderHtmlRotateControl,
//       cornerSize: 15,
//     }),
//     increaseHeight: new fabric.Control({
//       x: 0,
//       y: -0.5,
//       offsetY: -16,
//       cursorStyle: "n-resize",
//       actionHandler: scaleYFromCenter,
//       actionName: "scaleY",
//       render: renderHtmlHeightControl,
//       cornerSize: 15,
//     }),
//     increaseWidth: new fabric.Control({
//       x: 0.5,
//       y: 0,
//       offsetX: 16,
//       cursorStyle: "e-resize",
//       actionHandler: scaleXFromCenter,
//       actionName: "scaleX",
//       render: renderHtmlWidthControl,
//       cornerSize: 15,
//     }),
//     layerControl: new fabric.Control({
//       x: -0.5,
//       y: 0.5,
//       offsetX: -16,
//       offsetY: 16,
//       cursorStyle: "pointer",
//       render: (ctx, left, top, styleOverride, fabricObject) => {
//         renderHtmlLayerControl(ctx, left, top, styleOverride, fabricObject, bringPopup);
//       },
//       cornerSize: 15,
//     }),
//   };
// }
import { fabric } from "fabric";
import { deleteImageState, deleteTextState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { useDispatch } from "react-redux";

// const dispatch = useDispatch();
// Placeholder icons as data URLs (replace with your SVG data URLs)
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


// Example locked objects list (can be dynamic or from your redux)
const lockedObjects = new Set(); // contains fabricObject IDs to lock transformations

// Check if object is locked
function isLocked(_eventData, transform) {
  if (!transform || !transform.target) return false;
  return lockedObjects.has(transform.target.id);
}

// --- Renderers for HTML controls ---
// Delete control - clickable

// function positionHtmlControl(el, canvas, left, top) {
//   // get wrapper element instead ofcanvas.upperCanvasEl.parentNode
//   const wrapper = canvas.upperCanvasEl.parentNode;
//   const rect = wrapper.getBoundingClientRect();

//   // apply viewport transform to (left, top)
//   const { x, y } = fabric.util.transformPoint(
//     new fabric.Point(left, top),
//     canvas.viewportTransform
//   );

//   // position relative to wrapper
//   const controlLeft = x - 14;
//   const controlTop = y - 14;

//   // check bounds inside wrapper (not full window)
//   if (
//     controlLeft >= 0 &&
//     controlLeft <= rect.width &&
//     controlTop >= 0 &&
//     controlTop <= rect.height
//   ) {
//     el.style.position = "absolute";
//     el.style.left = `${controlLeft}px`;
//     el.style.top = `${controlTop}px`;
//     el.style.display = "flex";
//   } else {
//     el.style.display = "none";
//   }
// }
function positionHtmlControlForHide(el, canvas, left, top) {
  // get wrapper (relative container)
  const wrapper = canvas.upperCanvasEl.parentNode;
  const rect = wrapper.getBoundingClientRect();

  // current zoom + pan
  const zoom = canvas.getZoom();
  const vpt = canvas.viewportTransform;

  // apply viewport transform to (left, top)
  const { x, y } = fabric.util.transformPoint(
    new fabric.Point(left, top),
    vpt
  );

  // account for zoom scaling of control size
  const controlOffset = 28 * zoom;

  const controlLeft = x - controlOffset;
  const controlTop = y - controlOffset;

  // check bounds inside wrapper (after zoom)
  if (
    controlLeft >= 0 &&
    controlLeft <= rect.width &&
    controlTop >= 0 &&
    controlTop <= rect.height
  ) {
    el.style.display = "flex ";
  } else {
    el.style.display = "none";
  }
}

function positionHtmlControl(el, canvas, left, top) {
  if (!el || !canvas?.upperCanvasEl) return;

  const doPosition = () => {
    // Wait for element to be rendered/measured
    if (!el.offsetWidth || !el.offsetHeight) {
      requestAnimationFrame(() => doPosition());
      return;
    }
    // get wrapper element instead ofcanvas.upperCanvasEl.parentNode
    //   const wrapper = canvas.upperCanvasEl.parentNode;
    //   const rect = wrapper.getBoundingClientRect();
    const wrapper = canvas.upperCanvasEl.parentNode;
    const rect = wrapper.getBoundingClientRect();
    //   // apply viewport transform to (left, top)
    const { x, y } = fabric.util.transformPoint(
      new fabric.Point(left, top),
      canvas.viewportTransform
    );

    //   // position relative to wrapper
    const controlLeft = x - 14;
    const controlTop = y - 14;

    const offsetW = el.offsetWidth;
    const offsetH = el.offsetHeight;

    // Use left/top directly (already in screen space, centered on control)
    const finalLeft = left - offsetW / 2;
    const finalTop = top - offsetH / 2;

    // Optional bounds check to hide off-screen controls

    const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();
    if (
      finalLeft >= canvasRect.left - rect.left &&
      finalLeft <= canvasRect.right - rect.left &&
      finalTop >= canvasRect.top - rect.top &&
      finalTop <= canvasRect.bottom - rect.top
    ) {
      el.style.position = "absolute";
      el.style.left = `${finalLeft}px`;
      el.style.top = `${finalTop}px`;
      // el.style.display = "block";
    } else {
      // el.style.display = "none";
    }
  };

  requestAnimationFrame(doPosition);
  positionHtmlControlForHide(el, canvas, left, top);
}



function renderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject, dispatch) {
  // const dispatch = useDispatch();


  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
  if (!fabricObject._htmlControls.delete) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px", // Size of the circle (unchanged from original)
      height: "28px", // Same as above
      cursor: "pointer",
      backgroundColor: "white", // White background for the circle
      borderRadius: "50%", // Ensures it's a circle
      border: "1px solid #B0B0B0", // Added grey border around the circle
      boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect
      display: "flex",
      alignItems: "center", // Vertically center the icon
      justifyContent: "center", // Horizontally center the icon
      padding: "2px", // Padding for icon positioning (unchanged from original)
      zIndex: "99",
    });

    const img = document.createElement("img");
    img.src = deleteIconDataURL; // Ensure correct icon URL
    img.style.width = "16px"; // Icon size (unchanged from original)
    img.style.height = "16px"; // Icon size (unchanged from original)
    img.style.pointerEvents = "auto"; // Ensure the icon is clickable

    el.setAttribute("data-fabric-control", "true");
    // Hover effect to change background and icon color
    el.onmouseenter = () => {
      el.style.backgroundColor = "#005bff"; // Blue background on hover
      img.style.filter = "invert(1)"; // Invert icon color to white
    };
    el.onmouseleave = () => {
      el.style.backgroundColor = "white"; // Reset background to white
      img.style.filter = "invert(0)"; // Restore icon color
    };

    // Click event for removing the object
    img.onclick = () => {
      // console.log("fabric obejct locked state", fabricObject, fabricObject.locked);
      if (!fabricObject.locked) {
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
        dispatch(deleteImageState(fabricObject.id));
        dispatch(deleteTextState(fabricObject.id));

        // Remove object from canvas
        canvas.remove(fabricObject);
        canvas.requestRenderAll();
        const buttonId = `canvas-${fabricObject.id}`;
        const button = document.getElementById(buttonId);
        if (button) button.remove();
      }
    };

    el.appendChild(img); // Append the icon to the div
    canvas.upperCanvasEl.parentNode.appendChild(el); // Add the delete button to the body
    fabricObject._htmlControls.delete = el; // Store the control reference for later removal
  }

  // Position the delete control on the canvas
  positionHtmlControl(fabricObject._htmlControls.delete, canvas, left, top);
}
function renderHtmlResizeControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.resize) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px", // Size of the circle
      height: "28px", // Same as above
      backgroundColor: "white", // White background for the circle
      borderRadius: "50%", // Ensures it's a circle
      border: "1px solid #B0B0B0", // Grey border around the circle
      boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect
      display: "flex",
      alignItems: "center", // Vertically center the icon
      justifyContent: "center", // Horizontally center the icon
      padding: "2px", // Padding for the icon positioning
      zIndex: "99",
      pointerEvents: "none", // Prevents pointer events from interfering with the main object
      transition: "background-color 0.2s", // Smooth transition for background color change
    });

    const img = document.createElement("img");
    img.src = resizeIconDataURL; // Ensure correct resize icon source
    img.style.width = "16px"; // Icon size
    img.style.height = "16px";
    img.style.pointerEvents = "none"; // Prevent interference with the pointer events

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
          el.style.backgroundColor = "#005bff"; // Blue background on hover
          img.style.filter = "invert(1)"; // Invert icon color to white on hover
          canvas.upperCanvasEl.style.cursor = controlCursor;
        } else {
          el.style.backgroundColor = "white"; // Reset background to white
          img.style.filter = "invert(0)"; // Restore original icon color
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
      el.style.backgroundColor = "white"; // Reset background when object is modified
      img.style.filter = "invert(0)"; // Reset icon to original color
    });

    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj !== fabricObject) return;
      if (!["scale"].includes(e.transform.action)) return;

      const controlEl = fabricObject._htmlControls?.resize;
      if (controlEl) {
        controlEl.style.backgroundColor = "#005bff"; // Change background to blue on scaling
        const img = controlEl.querySelector("img");
        if (img) img.style.filter = "invert(1)"; // Invert icon color on scaling
      }
    });
  }

  positionHtmlControl(fabricObject._htmlControls.resize, canvas, left, top);
}
function renderHtmlRotateControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;
  // if (fabricObject.locked) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.rotate) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px", // Size of the circle (unchanged from original)
      height: "28px", // Same as above
      cursor: "crosshair", // Cursor style for rotate control
      backgroundColor: "white", // White background for the circle
      borderRadius: "50%", // Ensures it's a circle
      border: "1px solid #B0B0B0", // Added grey border around the circle
      boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect
      display: "flex",
      alignItems: "center", // Vertically center the icon
      justifyContent: "center", // Horizontally center the icon
      padding: "2px", // Padding for icon positioning (unchanged from original)
      zIndex: "99", // Ensure it's on top
      pointerEvents: "none", // Prevent Fabric functionality interference
    });

    const img = document.createElement("img");
    img.src = rotateIconDataURL; // Ensure correct rotate icon source
    img.style.width = "16px"; // Icon size (unchanged from original)
    img.style.height = "16px";
    img.style.pointerEvents = "none"; // Prevent pointer events from interfering with the icon
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img); // Append the image inside the circle
    canvas.upperCanvasEl.parentNode.appendChild(el); // Add the control to the document body
    fabricObject._htmlControls.rotate = el; // Store the rotate control reference for removal later

    // State for hover detection
    let isHovering = false;
    const hoverDistance = 20; // Distance tolerance for hover detection

    // Function to check hover status based on mouse position
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
        el.style.backgroundColor = isHovering ? "#005bff" : "white"; // Change background on hover
        img.style.filter = isHovering ? "invert(1)" : "invert(0)"; // Invert icon color on hover
      }
    };

    // Handle mouse movement for hover detection
    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    // Listen for mouse movement on the canvas
    canvas.on("mouse:move", moveHandler);

    // Clean up when object is removed from canvas
    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    // Reset the style when object is modified
    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white"; // Reset background color
      img.style.filter = "invert(0)"; // Reset icon color
    });

    // Handle rotation and change style during rotation
    canvas.on("object:rotating", (e) => {
      if (!fabricObject.locked) {
        const obj = e.target;
        if (obj !== fabricObject) return;

        el.style.backgroundColor = "#005bff"; // Blue background on rotate
        img.style.filter = "invert(1)"; // Invert icon color during rotation

      }
    });
  }

  // Position the rotate control on the canvas
  positionHtmlControl(fabricObject._htmlControls.rotate, canvas, left, top);
}
function renderHtmlHeightControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.height) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "15px", // Size of the circle
      height: "28px", // Same as above
      // marginLeft: "6px",
      backgroundColor: "white", // White background for the circle
      // borderRadius: "50%", // Ensures it's a circle
      border: "1px solid #B0B0B0", // Added grey border around the circle
      boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect
      display: "flex",
      alignItems: "center", // Vertically center the icon
      justifyContent: "center", // Horizontally center the icon
      // padding: "2px", // Padding for icon positioning
      zIndex: "99", // Ensure it appears on top
      pointerEvents: "none", // Prevent Fabric functionality interference
    });

    const img = document.createElement("img");
    img.src = heightIconDataURL; // Ensure correct height icon source
    img.style.width = "18px"; // Icon size
    img.style.height = "18px";
    img.style.pointerEvents = "none"; // Prevent pointer events from interfering with the icon
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img); // Append the image inside the circle
    canvas.upperCanvasEl.parentNode.appendChild(el); // Add the control to the document body
    fabricObject._htmlControls.height = el; // Store the height control reference for later removal

    // State for hover detection
    let isHovering = false;
    const hoverDistance = 20; // Distance tolerance for hover detection
    const controlCursor = "n-resize"; // Resize cursor when hovering over the height control

    // Function to check hover status based on mouse position
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
        el.style.backgroundColor = isHovering ? "#005bff" : "white"; // Change background on hover
        img.style.filter = isHovering ? "invert(1)" : "invert(0)"; // Invert icon color on hover
        canvas.upperCanvasEl.style.cursor = isHovering ? controlCursor : ""; // Change cursor when hovering
      }
    };

    // Handle mouse movement for hover detection
    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    // Listen for mouse movement on the canvas
    canvas.on("mouse:move", moveHandler);

    // Clean up when object is removed from canvas
    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    // Reset the style when object is modified
    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white"; // Reset background color
      img.style.filter = "invert(0)"; // Reset icon color
    });

    // Handle scaling of the object (specifically height scaling)
    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj !== fabricObject || fabricObject.locked) return;

      if (!["scaleY"].includes(e.transform.action)) return; // Only handle height scaling

      const controlEl = fabricObject._htmlControls?.height;
      if (controlEl) {
        controlEl.style.backgroundColor = "#005bff"; // Change background to blue during scaling
        const img = controlEl.querySelector("img");
        if (img) img.style.filter = "invert(1)"; // Invert icon color during scaling
      }
    });
  }

  // Position the height control on the canvas
  positionHtmlControl(fabricObject._htmlControls.height, canvas, left, top);
}
function renderHtmlWidthControl(ctx, left, top, _styleOverride, fabricObject) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};

  if (!fabricObject._htmlControls.width) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px", // Size of the circle (unchanged from original)
      height: "15px", // Same as above
      backgroundColor: "white", // White background for the circle
      // borderRadius: "50%", // Ensures it's a circle
      border: "1px solid #B0B0B0", // Added grey border around the circle
      boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect
      display: "flex",
      // marginTop: "6px",
      alignItems: "center", // Vertically center the icon
      justifyContent: "center", // Horizontally center the icon
      // padding: "2px",   // Padding for icon positioning
      zIndex: "99", // Ensure it appears on top
      pointerEvents: "none", // Prevent Fabric functionality interference
      transition: "background-color 0.2s", // Smooth transition for background color change
    });

    const img = document.createElement("img");
    img.src = widthIconDataURL; // Ensure correct width icon source
    img.style.width = "18px"; // Icon size (unchanged from original)
    img.style.height = "18px";
    img.style.pointerEvents = "none"; // Prevent pointer events from interfering with the icon
    el.setAttribute("data-fabric-control", "true");
    el.appendChild(img); // Append the image inside the circle
    canvas.upperCanvasEl.parentNode.appendChild(el); // Add the control to the document body
    fabricObject._htmlControls.width = el; // Store the width control reference for later removal

    // State for hover detection
    let isHovering = false;
    const hoverDistance = 20; // Distance tolerance for hover detection
    const controlCursor = "e-resize"; // Resize cursor when hovering over the width control

    // Function to check hover status based on mouse position
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
        el.style.backgroundColor = isHovering ? "#005bff" : "white"; // Change background on hover
        img.style.filter = isHovering ? "invert(1)" : "invert(0)"; // Invert icon color on hover
        canvas.upperCanvasEl.style.cursor = isHovering ? controlCursor : ""; // Change cursor when hovering
      }
    };

    // Handle mouse movement for hover detection
    const moveHandler = (opt) => {
      const pointer = canvas.getPointer(opt.e);
      checkHover(pointer);
    };

    // Listen for mouse movement on the canvas
    canvas.on("mouse:move", moveHandler);

    // Clean up when object is removed from canvas
    fabricObject.on("removed", () => {
      canvas.off("mouse:move", moveHandler);
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    // Reset the style when object is modified
    fabricObject.on("modified", () => {
      el.style.backgroundColor = "white"; // Reset background color
      img.style.filter = "invert(0)"; // Reset icon color
    });

    // Handle scaling of the object (specifically width scaling)
    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj !== fabricObject) return;
      if (!["scaleX"].includes(e.transform.action)) return; // Only handle width scaling

      const controlEl = fabricObject._htmlControls?.width;
      if (controlEl) {
        controlEl.style.backgroundColor = "#005bff"; // Change background to blue during scaling
        const img = controlEl.querySelector("img");
        if (img) img.style.filter = "invert(1)"; // Invert icon color during scaling
      }
    });
  }

  // Position the width control on the canvas
  positionHtmlControl(fabricObject._htmlControls.width, canvas, left, top);
}
function renderHtmlLayerControl(ctx, left, top, _styleOverride, fabricObject, bringPopup) {
  const canvas = fabricObject.canvas;
  if (!canvas || !canvas.upperCanvasEl) return;

  if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
  if (!fabricObject._htmlControls.layer) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width: "28px", // Size of the circle
      height: "28px", // Same as above
      cursor: "pointer", // Pointer cursor to indicate interactivity
      backgroundColor: "white", // White background for the circle
      borderRadius: "50%", // Ensures it's a circle
      border: "1px solid #B0B0B0", // Added grey border around the circle
      boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect for depth
      display: "flex",
      alignItems: "center", // Vertically center the icon
      justifyContent: "center", // Horizontally center the icon
      padding: "2px", // Padding to position the icon inside the circle
      zIndex: "99", // Ensures it appears on top
      transition: "background-color 0.2s", // Smooth background color change on hover
    });

    // Hover effect: Change background and invert icon color on hover
    el.onmouseenter = () => {
      el.style.backgroundColor = "#005bff"; // Blue background on hover
      img.style.filter = "invert(1)"; // White icon on hover
    };
    el.onmouseleave = () => {
      el.style.backgroundColor = "white"; // Reset to white background
      img.style.filter = "invert(0)"; // Restore icon color
    };

    // Create the image element for the layer control icon
    const img = document.createElement("img");
    img.src = layerIconDataURL; // Ensure the correct icon source
    img.style.width = "16px"; // Icon size
    img.style.height = "16px";
    img.style.pointerEvents = "auto"; // Ensure the icon is clickable

    // Click event: Call the `bringPopup` function when the icon is clicked
    img.onclick = (e) => {
      e.stopPropagation(); // Prevent the click event from propagating to other elements
      if (typeof bringPopup === "function") {
        bringPopup(fabricObject); // Call the popup function with the fabricObject
      }
    };
    el.setAttribute("data-fabric-control", "true");
    // Append the image to the control div
    el.appendChild(img);
    // Append the control div to the document body
    canvas.upperCanvasEl.parentNode.appendChild(el);
    // Store the control reference for later removal
    fabricObject._htmlControls.layer = el;
  }

  // Position the layer control on the canvas
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
// function RenderHtmlDeleteControl(ctx, left, top, _styleOverride, fabricObject, dispatch) {
//   const canvas = fabricObject.canvas;
//   if (!canvas || !canvas.upperCanvasEl) return;

//   if (!fabricObject._htmlControls) fabricObject._htmlControls = {};
//   if (!fabricObject._htmlControls.delete) {
//     const el = document.createElement("div");
//     Object.assign(el.style, {
//       position: "absolute",
//       width: "28px", // Size of the circle (unchanged from original)
//       height: "28px", // Same as above
//       cursor: "pointer",
//       backgroundColor: "white", // White background for the circle
//       borderRadius: "50%", // Ensures it's a circle
//       border: "1px solid #B0B0B0", // Added grey border around the circle
//       boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Light shadow effect
//       display: "flex",
//       alignItems: "center", // Vertically center the icon
//       justifyContent: "center", // Horizontally center the icon
//       padding: "2px", // Padding for icon positioning (unchanged from original)
//       zIndex: "99",
//     });

//     const img = document.createElement("img");
//     img.src = deleteIconDataURL; // Ensure correct icon URL
//     img.style.width = "16px"; // Icon size (unchanged from original)
//     img.style.height = "16px"; // Icon size (unchanged from original)
//     img.style.pointerEvents = "auto"; // Ensure the icon is clickable

//     // Hover effect to change background and icon color
//     el.onmouseenter = () => {
//       el.style.backgroundColor = "#005bff"; // Blue background on hover
//       img.style.filter = "invert(1)"; // Invert icon color to white
//     };
//     el.onmouseleave = () => {
//       el.style.backgroundColor = "white"; // Reset background to white
//       img.style.filter = "invert(0)"; // Restore icon color
//     };

//     // Click event for removing the object
//     img.onclick = () => {
//       if (!isLocked(null, { target: fabricObject })) {
//         const canvas = fabricObject.canvas;
//         if (!canvas) return;  // Safety check

//         // Remove HTML controls
//         if (fabricObject.htmlDeleteEl) {
//           fabricObject.htmlDeleteEl.remove();
//           fabricObject.htmlDeleteEl = null;
//         }
//         if (fabricObject._htmlControls) {
//           Object.values(fabricObject._htmlControls).forEach(el => el.remove());
//           fabricObject._htmlControls = null;
//         }
//         dispatch(deleteImageState(fabricObject.id));

//         // Remove object from canvas
//         canvas.remove(fabricObject);
//         canvas.requestRenderAll();
//       }
//     };

//     el.appendChild(img); // Append the icon to the div
//    canvas.upperCanvasEl.parentNode.appendChild(el); // Add the delete button to the body
//     fabricObject._htmlControls.delete = el; // Store the control reference for later removal
//   }

//   // Position the delete control on the canvas
//   positionHtmlControl(fabricObject._htmlControls.delete, canvas, left, top);
// }
// Main exported function to create controls object
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