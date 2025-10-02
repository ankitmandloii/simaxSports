import React from "react";
import { updateTextState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { removeAllHtmlControls } from "../HelpersFunctions/renderImageHelpers";
const renderCurveTextObjects = (
  fabricCanvasRef,
  dispatch,
  textContaintObject,
  setActiveObjectType,
  updateBoundaryVisibility,
  createControls,
  syncMirrorCanvasHelper,
  navigate,
  fabric,
  setSelectedTextState,
  globalDispatch,
  activeSide,
  bringPopup,
  productCategory,
  isZoomedIn
) => {
  const canvas = fabricCanvasRef.current;

  // ✅ Global canvas optimizations
  canvas.renderOnAddRemove = false;
  canvas.perPixelTargetFind = false;
  canvas.targetFindTolerance = 8;

  if (textContaintObject && textContaintObject.length === 0) {
    let existingTextbox = canvas
      .getObjects()
      .filter((obj) => obj.type === "curved-text" || obj.type === "textbox");
    existingTextbox.forEach((obj) => canvas.remove(obj));
    return;
  }

  if (Array.isArray(textContaintObject)) {
    textContaintObject.forEach((textInput) => {
      const canvas = fabricCanvasRef.current;
      const existingObj = canvas
        .getObjects()
        .find((obj) => obj.id === textInput.id);

      const text = textInput.content || "";
      const charSpacing = textInput.spacing || 0;
      const fontSize = 60;

      const clampScale = (value, min = 1, max = 10) =>
        Math.max(min, Math.min(value, max));

      const context = canvas.getElement().getContext("2d");
      context.font = `${fontSize}px ${textInput.fontFamily || "Arial"}`;
      const baseWidth = context.measureText(text).width;
      const extraSpacing = (text.length - 1) * (charSpacing / 1000) * fontSize;
      const measuredWidth = baseWidth + extraSpacing;

      if (existingObj && text.trim() === "") {
        canvas.remove(existingObj);
        return;
      }
      if (textInput.locked) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      if (existingObj) {
        existingObj.set({
          width: Math.min(measuredWidth + 20, 200),
          text: textInput.content,
          fontWeight: textInput.fontWeight || "normal",
          fontStyle: textInput.fontStyle || "normal",
          warp: Number(textInput.arc),
          spacing: textInput.spacing,
          stroke: textInput.outLineColor || "",
          strokeWidth: textInput.outLineSize || 0,
          fill: textInput.textColor || "white",
          angle: textInput.angle || 0,
          left: (textInput.position.x / 100) * canvasWidth,
          top: (textInput.position.y / 100) * canvasHeight,
          fontFamily: textInput.fontFamily || "Impact",
          scaleX: textInput.scaleX,
          scaleY: textInput.scaleY,
          flipX: textInput.flipX,
          flipY: textInput.flipY,
          originX: "center",
          originY: "center",
          lockMovementX: textInput.locked,
          lockMovementY: textInput.locked,
          locked: textInput.locked,
          hasControls: !textInput?.locked && !isZoomedIn,
          selectable: !isZoomedIn,
          evented: !isZoomedIn,
          lockScalingX: textInput.locked,
          lockScalingY: textInput.locked,
          lockRotation: textInput.locked,
          width: Math.min(measuredWidth + 20, 200),
        });

        existingObj.dirty = true;
        existingObj.setCoords();
        canvas.requestRenderAll();
        if (!textInput.locked && !isZoomedIn) {
          existingObj.controls = createControls(bringPopup, dispatch);
        } else {
          removeAllHtmlControls(canvas)
        }


        // existingObj.on("mouseup", (e) => {
        //   const obj = e.target;
        //   if (!obj || textInput.locked) return;

        //   // Update the state with the final position after the drag
        //   const canvasWidth = canvas.getWidth();
        //   const canvasHeight = canvas.getHeight();
        //   const percentX = (obj.left / canvasWidth) * 100;
        //   const percentY = (obj.top / canvasHeight) * 100;

        //   globalDispatch("position", { x: percentX, y: percentY }, textInput.id);
        //   globalDispatch("angle", obj.angle, textInput.id);
        //   globalDispatch("scaleX", parseFloat(obj.scaleX.toFixed(1)), obj.id);
        //   globalDispatch("scaleY", parseFloat(obj.scaleY.toFixed(1)), obj.id);

        //   syncMirrorCanvasHelper(activeSide);
        //   canvas.requestRenderAll(); // Request a final render
        // });

      } else if (!existingObj) {
        const curved = new fabric.CurvedText(textInput.content, {
          lockScalingFlip: true,
          id: textInput.id,
          fontWeight: textInput.fontWeight || "normal",
          fontStyle: textInput.fontStyle || "normal",
          left: (textInput.position.x / 100) * canvasWidth,
          top: (textInput.position.y / 100) * canvasHeight,
          stroke: textInput.outLineColor || "",
          strokeWidth: textInput.outLineSize || 0,
          fill: textInput.textColor || "white",
          spacing: textInput.spacing,
          warp: Number(textInput.arc),
          fontSize: textInput.fontSize,
          fontFamily: textInput.fontFamily || "Impact",
          originX: "center",
          originY: "center",
          hasControls: true,
          flipX: textInput.flipX,
          flipY: textInput.flipY,
          angle: textInput.angle || 0,
          scaleX: textInput.scaleX,
          scaleY: textInput.scaleY,
          layerIndex: textInput.layerIndex,
          maxWidth: 250,
          objectCaching: true, // ✅ cache drawing for performance
          lockMovementX: textInput.locked,
          lockMovementY: textInput.locked,
          borderColor: "skyblue",
          borderDashArray: [4, 4],
          hasBorders: true,
          hasControls: !textInput?.locked && !isZoomedIn,
          selectable: !isZoomedIn,
          evented: !isZoomedIn,

          width: Math.min(measuredWidth + 20, 200),
          isSync: true,
          locked: textInput.locked,
        });



        curved.on("deselected", () => {
          removeAllHtmlControls(canvas);
          dispatch(setSelectedTextState(null));
        });

        curved.on("mousedown", () => {
          dispatch(setSelectedTextState(textInput.id));
          setActiveObjectType("curved-text");
          navigate("/design/addText", { state: textInput });
        });

        const handleScale = (e) => {
          const clampScale = (value, min = 0.2, max = 10) =>
            Math.max(min, Math.min(value, max));
          const obj = e.target;
          if (
            !obj ||
            !e.transform ||
            !["scale", "scaleX", "scaleY"].includes(e.transform.action)
          )
            return;

          const center = obj.getCenterPoint();
          let deltaScaleX = obj.scaleX;
          let deltaScaleY = obj.scaleY;
          const isUniform = Math.abs(deltaScaleX - deltaScaleY) < 0.001;

          let finalScaleX, finalScaleY;
          if (isUniform) {
            finalScaleX = clampScale(deltaScaleX);
            finalScaleY = clampScale(deltaScaleX);
          } else {
            finalScaleX = clampScale(deltaScaleX);
            finalScaleY = clampScale(deltaScaleY);
          }

          obj.scaleX = finalScaleX;
          obj.scaleY = finalScaleY;
          obj.setPositionByOrigin(center, "center", "center");
          obj.setCoords();
          // globalDispatch("scaleX", parseFloat(finalScaleX.toFixed(1)), obj.id);
          // globalDispatch("scaleY", parseFloat(finalScaleY.toFixed(1)), obj.id);
          // globalDispatch(
          //   "scaledValue",
          //   parseFloat((finalScaleY + finalScaleY / 2).toFixed(1)),
          //   obj.id
          // );
          // Only dispatch if scale values have changed
          dispatch(updateTextState({
            id: textInput.id,
            changes: {
              scaleX: parseFloat(finalScaleX.toFixed(1)),
              scaleY: parseFloat(finalScaleY.toFixed(1)),
              scaledValue: parseFloat((finalScaleY + finalScaleY / 2).toFixed(1))
            }

          }));
          // if (parseFloat(finalScaleX.toFixed(1)) !== textInput.scaleX) {
          //   globalDispatch("scaleX", parseFloat(finalScaleX.toFixed(1)), obj.id);
          // }
          // if (parseFloat(finalScaleY.toFixed(1)) !== textInput.scaleY) {
          //   globalDispatch("scaleY", parseFloat(finalScaleY.toFixed(1)), obj.id);
          //   globalDispatch(
          //     "scaledValue",
          //     parseFloat((finalScaleY + finalScaleY / 2).toFixed(1)),
          //     obj.id
          //   );
          // }
          canvas.requestRenderAll();
        };

        // curved.on("modified", (e) => {
        //   setActiveObjectType("curved-text");
        //   const obj = e.target;
        //   if (!obj || textInput.locked) return;

        //   const center = obj.getCenterPoint();
        //   const percentX = (obj.left / canvasWidth) * 100;
        //   const percentY = (obj.top / canvasHeight) * 100;

        //   // globalDispatch("position", { x: percentX, y: percentY }, textInput.id);
        //   obj.setPositionByOrigin(center, "center", "center");
        //   obj.setCoords();

        //   globalDispatch("angle", obj.angle, textInput.id);
        //   canvas.requestRenderAll();
        //   handleScale(e);
        //   syncMirrorCanvasHelper(activeSide);
        // });
        curved.on("modified", (e) => {
          setActiveObjectType("curved-text");
          const obj = e.target;
          if (!obj || textInput.locked) return;

          const center = obj.getCenterPoint();
          const percentX = (obj.left / canvasWidth) * 100;
          const percentY = (obj.top / canvasHeight) * 100;

          // Only dispatch if values have changed
          // if (percentX !== textInput.position.x || percentY !== textInput.position.y) {
          //   globalDispatch("position", { x: percentX, y: percentY }, textInput.id);
          // }
          if (obj.angle !== textInput.angle) {
            globalDispatch("angle", obj.angle, textInput.id);
          }

          obj.setPositionByOrigin(center, "center", "center");
          obj.setCoords();

          canvas.requestRenderAll();
          handleScale(e);
          syncMirrorCanvasHelper(activeSide);
        });



        // curved.on("mouseup", (e) => {
        //   const obj = e.target;
        //   if (!obj || textInput.locked) return;

        //   // Update the state with the final position after the drag
        //   const canvasWidth = canvas.getWidth();
        //   const canvasHeight = canvas.getHeight();
        //   const percentX = (obj.left / canvasWidth) * 100;
        //   const percentY = (obj.top / canvasHeight) * 100;

        //   globalDispatch("position", { x: percentX, y: percentY }, textInput.id);
        //   globalDispatch("angle", obj.angle, textInput.id);
        //   globalDispatch("scaleX", parseFloat(obj.scaleX.toFixed(1)), obj.id);
        //   globalDispatch("scaleY", parseFloat(obj.scaleY.toFixed(1)), obj.id);

        //   syncMirrorCanvasHelper(activeSide);
        //   canvas.requestRenderAll(); // Request a final render
        // });

        curved.on("mouseup", (e) => {
          const obj = e.target;
          if (!obj || textInput.locked) return;

          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const percentX = (obj.left / canvasWidth) * 100;
          const percentY = (obj.top / canvasHeight) * 100;

          // Only dispatch if values have changed
          if (percentX !== textInput.position.x || percentY !== textInput.position.y) {
            globalDispatch("position", { x: percentX, y: percentY }, textInput.id);
          }
          // if (obj.angle !== textInput.angle) {
          //   globalDispatch("angle", obj.angle, textInput.id);
          // }
          // if (parseFloat(obj.scaleX.toFixed(1)) !== textInput.scaleX) {
          //   globalDispatch("scaleX", parseFloat(obj.scaleX.toFixed(1)), obj.id);
          // }
          // if (parseFloat(obj.scaleY.toFixed(1)) !== textInput.scaleY) {
          //   globalDispatch("scaleY", parseFloat(obj.scaleY.toFixed(1)), obj.id);
          // }

          syncMirrorCanvasHelper(activeSide);
          canvas.requestRenderAll(); // Request a final render
        });
        curved.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          tl: false,
          tr: false,
          bl: false,
          br: false,
          mtr: false,
        });

        if (!textInput.locked && !isZoomedIn) {
          curved.controls = createControls(bringPopup, dispatch);
        } else {
          removeAllHtmlControls(canvas)
        }
        canvas.add(curved);
      }
    });

    // ✅ Layering logic
    const sorted = [...textContaintObject].sort(
      (a, b) => a.layerIndex - b.layerIndex
    );
    sorted.forEach((text) => {
      const obj = canvas.getObjects().find((o) => o.id === text.id);
      if (obj) {
        canvas.bringToFront(obj);
      }
    });

    canvas.requestRenderAll();
    updateBoundaryVisibility(fabricCanvasRef, activeSide, productCategory);

    // ✅ Add smooth moving optimization
    let moving = false;
    // canvas.off("object:moving"); // avoid duplicate listeners
    canvas.on("object:moving", () => {
      if (moving) return;
      moving = true;
      requestAnimationFrame(() => {
        canvas.requestRenderAll();
        moving = false;
      });
    });
  }
};

export default renderCurveTextObjects;