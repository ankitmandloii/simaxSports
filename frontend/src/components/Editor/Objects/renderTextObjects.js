import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';  // Import necessary hooks
import { updateTextState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { removeAllHtmlControls } from "../HelpersFunctions/renderImageHelpers";

const renderCurveTextObjects = (
  fabricCanvasRef,
  dispatch,
  textContaintObject,
  globalDispatch,
  setActiveObjectType,
  updateBoundaryVisibility,
  createControls,
  syncMirrorCanvasHelper,
  navigate,
  fabric,
  setSelectedTextState,
  activeSide,
  bringPopup,
  productCategory,
  isZoomedIn,
) => {

  const canvas = fabricCanvasRef.current;

  // ✅ Global canvas optimizations
  canvas.renderOnAddRemove = false;
  canvas.perPixelTargetFind = false;
  canvas.targetFindTolerance = 8;

  // If there are no objects, remove any existing ones
  if (textContaintObject && textContaintObject.length === 0) {
    let existingTextbox = canvas
      .getObjects()
      .filter((obj) => obj.type === "curved-text" || obj.type === "textbox");
    existingTextbox.forEach((obj) => canvas.remove(obj));
    return;
  }

  // For each object in the textContaintObject array
  if (Array.isArray(textContaintObject)) {
    textContaintObject.forEach((textInput) => {
      const { fontSize, id, content, fontStyle, fontWeight, locked, flipY, flipX, scaleY, scaleX, fontFamily, position, angle, textColor, arc, spacing, outLineColor, outLineSize, layerIndex } = textInput;
      const canvas = fabricCanvasRef.current;
      const existingObj = canvas
        .getObjects()
        .find((obj) => obj.id === id);

      const text = content || "";
      const charSpacing = spacing || 0;

      const clampScale = (value, min = 1, max = 10) =>
        Math.max(min, Math.min(value, max));

      const context = canvas.getElement().getContext("2d");
      context.font = `${fontSize}px ${fontFamily || "Arial"}`;
      const baseWidth = context.measureText(text).width;
      const extraSpacing = (text.length - 1) * (charSpacing / 1000) * fontSize;
      const measuredWidth = baseWidth + extraSpacing;

      if (existingObj && text.trim() === "") {
        canvas.remove(existingObj);
        return; 
      }
      // if (locked) {
      //   canvas.discardActiveObject();
      //   canvas.requestRenderAll();
      // }
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      function setUpText(text) {
        text.set({
          text: content,
          lockScalingFlip: true,
          id: id,
          fontWeight: fontWeight || "normal",
          fontStyle: fontStyle || "normal",
          left: (position.x / 100) * canvasWidth,
          top: (position.y / 100) * canvasHeight,
          stroke: outLineColor || "",
          strokeWidth: outLineSize || 0,
          fill: textColor || "white",
          spacing: spacing,
          warp: Number(arc),
          fontSize: fontSize,
          fontFamily: fontFamily || "Impact",
          originX: "center",
          originY: "center",
          hasControls: true,
          flipX: flipX,
          flipY: flipY,
          angle: angle || 0,
          scaleX: scaleX,
          scaleY: scaleY,
          layerIndex: layerIndex,
          maxWidth: 250,
          objectCaching: true,
          lockMovementX: locked,
          lockMovementY: locked,
          borderColor: "skyblue",
          borderDashArray: [4, 4],
          hasBorders: true,
          hasControls: !textInput?.locked && !isZoomedIn,
          selectable: !isZoomedIn,
          evented: !isZoomedIn,
          width: Math.min(measuredWidth + 20, 200),
          isSync: true,
          locked: locked,
        })
        text.dirty = true;
        text.setCoords();
        if (!locked && !isZoomedIn) {
          text.controls = createControls(bringPopup, dispatch);
        } else {
          console.log("removing controls for", id);
          removeAllHtmlControls(canvas)
        }
      }

      if (existingObj) {
        setUpText(existingObj)
      } else if (!existingObj) {
        const curved = new fabric.CurvedText(content, {});
        setUpText(curved);
        curved.on("deselected", deselecteHandler);
        curved.on("mousedown", mousedownHandler);
        curved.on("modified", modifiedHandler);
        curved.on("mouseup", mouseupHandler);

        // Handle deselection (check current path to decide navigation)
        function deselecteHandler() {
          removeAllHtmlControls(canvas);
          dispatch(setSelectedTextState(null));
          navigate('/design/product');  // Use history.push() for navigation
        }

        function mousedownHandler() {
          dispatch(setSelectedTextState(id));
          setActiveObjectType("curved-text");
          navigate("/design/addText", { state: textInput });
        }

        function handleScale(e) {
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

          dispatch(updateTextState({
            id: id,
            changes: {
              scaleX: parseFloat(finalScaleX.toFixed(1)),
              scaleY: parseFloat(finalScaleY.toFixed(1)),
              scaledValue: parseFloat((finalScaleY + finalScaleY / 2).toFixed(1))
            }
          }));

          canvas.requestRenderAll();
        };

        function modifiedHandler(e) {
          setActiveObjectType("curved-text");
          const obj = e.target;
          if (!obj || locked) return;

          const center = obj.getCenterPoint();
          const percentX = (obj.left / canvasWidth) * 100;
          const percentY = (obj.top / canvasHeight) * 100;

          if (obj.angle !== angle) {
            globalDispatch("angle", obj.angle, id);
          }

          obj.setPositionByOrigin(center, "center", "center");
          obj.setCoords();

          canvas.requestRenderAll();
          handleScale(e);
          syncMirrorCanvasHelper(activeSide);
        }

        function mouseupHandler(e) {
          const obj = e.target;
          if (!obj || locked) return;

          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const percentX = (obj.left / canvasWidth) * 100;
          const percentY = (obj.top / canvasHeight) * 100;

          if (percentX !== position.x || percentY !== position.y) {
            globalDispatch("position", { x: percentX, y: percentY }, id);
          }
          syncMirrorCanvasHelper(activeSide);
          canvas.requestRenderAll();
        }

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
        canvas.add(curved);
      }
    });

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

    let moving = false;
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
