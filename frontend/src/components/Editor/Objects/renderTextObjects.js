import React from "react";

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
  bringPopup
) => {
  const canvas = fabricCanvasRef.current;
  if (textContaintObject && textContaintObject.length === 0) {
    let existingTextbox = canvas
      .getObjects()
      .filter((obj) => obj.type === "curved-text" || obj.type === "textbox");
    existingTextbox.forEach((obj) => canvas.remove(obj));
    return;
  }
  if (Array.isArray(textContaintObject)) {
    textContaintObject.forEach((textInput) => {
      // console.log("text input daata", textInput);
      // const isCurved = textInput.arc > 0;
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

      // console.log("existing object", existingObj);
      if (existingObj) {
        existingObj.set({
          width: Math.min(measuredWidth + 20, 200),
        });
        existingObj.set({
          text: textInput.content,
          fontWeight: textInput.fontWeight || "normal",
          fontStyle: textInput.fontStyle || "normal",
          warp: Number(textInput.arc),
          spacing: textInput.spacing,
          stroke: textInput.outLineColor || "",
          strokeWidth: textInput.outLineSize || 0,
          fill: textInput.textColor || "white",
          angle: textInput.angle || 0,
          left: textInput.position.x || 300,
          top: textInput.position.y || 300,
          fontFamily: textInput.fontFamily || "Impact",
          scaleX: textInput.scaleX,
          scaleY: textInput.scaleY,
          flipX: textInput.flipX,
          flipY: textInput.flipY,
          originX: "center",
          originY: "center",
          lockMovementX: textInput.locked,
          lockMovementY: textInput.locked,
          width: Math.min(measuredWidth + 20, 200),
        });

        existingObj.dirty = true;
        existingObj.setCoords();
        canvas.requestRenderAll();
        existingObj.controls = createControls(bringPopup, dispatch);
        canvas.renderAll();
      } else if (!existingObj) {
        const curved = new fabric.CurvedText(textInput.content, {
          lockScalingFlip: true,
          id: textInput.id,
          fontWeight: textInput.fontWeight || "normal",
          fontStyle: textInput.fontStyle || "normal",
          left: textInput.position.x || 300,
          top: textInput.position.y || 300,
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
          // height: 100,
          objectCaching: false,
          lockMovementX: textInput.locked,
          lockMovementY: textInput.locked,
          borderColor: "skyblue",
          borderDashArray: [4, 4],
          hasBorders: true,
          selectable: true,
          evented: true,
          hasControls: true,
          width: Math.min(measuredWidth + 20, 200),
          isSync: true,
        });

        function removeAllHtmlControls(canvas) {
          if (!canvas) {
            canvas = fabricCanvasRef.current;
          }
          canvas.getObjects().forEach((obj) => {
            if (obj._htmlControls) {
              for (const key in obj._htmlControls) {
                const el = obj._htmlControls[key];
                if (el?.parentNode) el.parentNode.removeChild(el);
              }
              obj._htmlControls = null;
            }
          });

          // Safety net: also remove floating orphan controls (edge case fallback)
          document.querySelectorAll('[data-fabric-control]').forEach(el => el.remove());
        }

        curved.on("deselected", () => {
          removeAllHtmlControls(canvas);
          dispatch(setSelectedTextState(null));
          // navigate("/design/product");
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
          // console.log(e, "event details");
          if (
            !obj ||
            !e.transform ||
            !["scale", "scaleX", "scaleY"].includes(e.transform.action)
          )
            return;

          // 👇 DO NOT force object to scale from center manually
          // const center = obj.getCenterPoint(); ❌ Remove this

          const center = obj.getCenterPoint();

          // const baseScaleX = Number(obj.scaleX) || 1;
          // const baseScaleY = Number(obj.scaleY) || 1;

          let deltaScaleX = obj.scaleX;
          let deltaScaleY = obj.scaleY;

          const isUniform = Math.abs(deltaScaleX - deltaScaleY) < 0.001;

          let finalScaleX, finalScaleY;

          if (isUniform) {
            // Uniform scaling adds to both axes
            const additiveScale = deltaScaleX;
            finalScaleX = clampScale(additiveScale);
            finalScaleY = clampScale(additiveScale);
            // finalScaleX = additiveScale;
            // finalScaleY = additiveScale;
          } else {
            finalScaleX = clampScale(deltaScaleX);

            finalScaleY = clampScale(deltaScaleY);
            // finalScaleX = deltaScaleX;

            // finalScaleY = deltaScaleY;
          }
          obj.scaleX = finalScaleX;
          obj.scaleY = finalScaleY;

          obj.setPositionByOrigin(center, "center", "center");
          obj.setCoords();

          // Dispatch based on whether it was uniform or not

          globalDispatch("scaleX", parseFloat(finalScaleX.toFixed(1)), obj.id);
          globalDispatch("scaleY", parseFloat(finalScaleY.toFixed(1)), obj.id);

          globalDispatch(
            "scaledValue",
            parseFloat((finalScaleY + finalScaleY / 2).toFixed(1)),
            obj.id
          );
          canvas.renderAll();
        };
        curved.on("modified", (e) => {
          setActiveObjectType("curved-text");
          const obj = e.target;
          if (!obj) return;

          const center = obj.getCenterPoint();

          obj.setPositionByOrigin(center, "center", "center");
          obj.setCoords();
          globalDispatch("position", { x: obj.left, y: obj.top }, textInput.id);
          globalDispatch("angle", obj.angle, textInput.id);
          canvas.renderAll();
          handleScale(e);
          syncMirrorCanvasHelper(activeSide);
        });

        //                     });

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

        curved.controls = createControls(bringPopup, dispatch); // your custom controls
        canvas.add(curved);
      }
    });

    // ✅ Layering Logic
    const sorted = [...textContaintObject].sort(
      (a, b) => a.layerIndex - b.layerIndex
    );
    sorted.forEach((text) => {
      const obj = canvas.getObjects().find((o) => o.id === text.id);
      if (obj) {
        canvas.bringToFront(obj);
      }
    });

    canvas.renderAll();
    updateBoundaryVisibility(fabricCanvasRef);
  }
};

export default renderCurveTextObjects;
