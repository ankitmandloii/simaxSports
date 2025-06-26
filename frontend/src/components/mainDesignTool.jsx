import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
// import { TbArrowForwardUp } from "react-icons/tb";
// import { TbArrowBack } from "react-icons/tb";
// import { VscZoomIn } from "react-icons/vsc";
import style from "./MainDesignTool.module.css";
import FontFaceObserver from 'fontfaceobserver';
import { useDispatch, useSelector } from "react-redux";
import {
  deleteImageState,
  deleteTextState,
  moveElementBackwardState,
  moveElementForwardState,
  moveElementToLowest,
  moveElementToTopmost,
  moveTextBackwardState,
  moveTextForwardState,
  selectedImageIdState,
  setSelectedTextState,
  updateImageState,
  updateNameAndNumberDesignState,
  updateTextState,
} from "../redux/FrontendDesign/TextFrontendDesignSlice";
import { useNavigate } from "react-router-dom";
import LayerModal from "./CommonComponent/layerComponent/layerComponent";
import CurvedText from "./fabric/fabric.TextCurved"; // Adjust path if needed

fabric.CurvedText = CurvedText;
const MainDesignTool = ({
  warningColor,
  id,
  backgroundImage,
  zoomLevel,
  setFrontPreviewImage,
  setBackPreviewImage,
  setLeftSleevePreviewImage,
  setRightSleevePreviewImage,
  setPreviewForCurrentSide
}) => {

  // **********************************************************************************************************************************************************
  //                                                                                    USE SELECTORS AREA
  // **********************************************************************************************************************************************************
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);
  const nameAndNumberDesignState = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].nameAndNumberDesignState)
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const imageContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
  const textContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
  const isRender = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].setRendering);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId)

  // **********************************************************************************************************************************************************
  //                                                                                    USE REFS AREA
  // **********************************************************************************************************************************************************
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // **********************************************************************************************************************************************************
  //                                                                                    USE STATS AREA
  // **********************************************************************************************************************************************************
  const [selectedpopup, setSelectedpopup] = useState(false);
  const [activeObjectType, setActiveObjectType] = useState("image");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  // **********************************************************************************************************************************************************
  //                                                                                    USE DISPTACHS AREA
  // **********************************************************************************************************************************************************
  const dispatch = useDispatch();
  const navigate = useNavigate();




  // **********************************************************************************************************************************************************
  //                                                                                    USE CALLBACKS AREA
  // **********************************************************************************************************************************************************

  const updateBoundaryVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const boundaryBox = canvas.getObjects().find(obj => obj.type === "rect" && !obj.selectable); // identify your boundary box
    const warningText = canvas.getObjects().find(obj => obj.type === "text" && obj.text === "Please keep design inside the box");

    if (!boundaryBox || !warningText) return;

    const textObjects = canvas.getObjects().filter((obj) => obj.type === "curved-text");

    textObjects.forEach((obj) => obj.setCoords());

    // console.log("textObject check for boundary", textObjects)

    const allInside = textObjects.every((obj) => {
      const objBounds = obj.getBoundingRect(true);
      const boxBounds = boundaryBox.getBoundingRect(true);
      return (
        objBounds.left >= boxBounds.left &&
        objBounds.top >= boxBounds.top &&
        objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
        objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
      );
    });

    boundaryBox.visible = !allInside;
    warningText.visible = !allInside;

    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(warningText);
    canvas.requestRenderAll();
  }, []);
  // **********************************************************************************************************************************************************
  //                                                                                    USE MEMO AREA
  // **********************************************************************************************************************************************************
  const iconImages = useMemo(() => {
    const imgs = {};
    for (const key in icons) {
      const img = new Image();
      img.src = icons[key];
      imgs[key] = img;
    }
    return imgs;
  }, []);

  // **********************************************************************************************************************************************************
  //                                                                                    HELPER FUNCTIONS AREA
  // **********************************************************************************************************************************************************
  const globalDispatch = (lable, value, id) => {
    dispatch(
      updateImageState({
        "id": id,
        changes: { [lable]: (lable=="angle"?Number(value).toFixed(1):value) },
      })
    );
    dispatch(
      updateTextState({
        "id": id,
        changes: { [lable]: value },
      })
    );
  };
  const checkBoundary = (e) => {
    return;
    const obj = e.target;
    const canvas = fabricCanvasRef.current;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    obj.setCoords(); // Make sure aCoords is updated
    const bounds = obj.aCoords;

    // Left boundary
    if (bounds.tl.x < 0) {
      obj.left -= bounds.tl.x;
    }

    // Top boundary
    if (bounds.tl.y < 0) {
      obj.top -= bounds.tl.y;
    }

    // Right boundary
    if (bounds.tr.x > canvasWidth) {
      obj.left -= bounds.tr.x - canvasWidth;
    }

    // Bottom boundary
    if (bounds.bl.y > canvasHeight) {
      obj.top -= bounds.bl.y - canvasHeight;
    }
  };
  const loadFont = (fontName) => {
    return new Promise((resolve) => {
      const font = new FontFaceObserver(fontName);
      font.load().then(resolve).catch(resolve); // ignore error to avoid blocking
    });
  };
  const handleLayerAction = (action) => {
    if (selectedObject) {
      const objectId = selectedObject.id;
      switch (action) {
        case "bringForward":
          selectedObject.bringForward();
          dispatch(moveElementToTopmost(objectId));
          selectedObject.canvas.requestRenderAll(); // Add this line
          setSelectedpopup(!selectedpopup);
          break;
        case "sendBackward":
          selectedObject.sendBackwards();
          dispatch(moveElementToLowest(objectId));
          selectedObject.canvas.requestRenderAll(); // Add this line
          break;
        case "bringToFront":
          selectedObject.bringToFront();
          dispatch(moveElementForwardState(objectId));
          selectedObject.canvas.requestRenderAll(); // Add this line
          break;
        case "sendToBack":
          selectedObject.sendToBack();
          dispatch(moveElementBackwardState(objectId));

          selectedObject.canvas.requestRenderAll(); // Add this line
          break;
        default:
          break;
      }
    }
  };
  const bringPopup = () => {
    setIsModalOpen(true);
  };
 const handleScale = (e) => {
  const clamp = (value, min = 0.2, max = 20) => Math.max(min, Math.min(value, max));
  const obj = e.target;
  const canvas = fabricCanvasRef.current;

  if (!obj || !obj.id || !e.transform || !['scale', 'scaleX', 'scaleY'].includes(e.transform.action)) return;

  const imageData = imageContaintObject?.find(img => img.id === obj.id);
  if (!imageData) return;

  const center = obj.getCenterPoint();
  const originalWidth = obj.width;
  const originalHeight = obj.height;

  const MAX_WIDTH = 300;
  const MAX_HEIGHT = 300;

  // Calculate base (initial bounding box) scale
  const boundingScale = Math.min(MAX_WIDTH / originalWidth, MAX_HEIGHT / originalHeight);

  // Actual current scale relative to that base
  const relativeScaleX = obj.scaleX / boundingScale;
  const relativeScaleY = obj.scaleY / boundingScale;

  // Clamp to avoid extreme zoom in/out
  const clampedScaleX = clamp(relativeScaleX);
  const clampedScaleY = clamp(relativeScaleY);

  // Apply scaled values
  obj.scaleX = boundingScale * clampedScaleX;
  obj.scaleY = boundingScale * clampedScaleY;

  // Maintain center position
  obj.setPositionByOrigin(center, 'center', 'center');
  obj.setCoords();

  // Dispatch relative scale values (user control)
  globalDispatch("scaleX", parseFloat(clampedScaleX.toFixed(1)), obj.id);
  globalDispatch("scaleY", parseFloat(clampedScaleY.toFixed(1)), obj.id);
  globalDispatch("scaledValue", parseFloat(((clampedScaleX + clampedScaleY) / 2).toFixed(1)), obj.id);

  canvas?.renderAll();
  syncMirrorCanvas(activeSide);
};


  // **********************************************************************************************************************************************************
  //                                                                                    CONTROL BUTTONS AREA
  // **********************************************************************************************************************************************************

  const renderIcon = (key) => {
    return function (ctx, left, top, _styleOverride, fabricObject) {
      const size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(iconImages[key], -size / 2, -size / 2, size, size);
      ctx.restore();
    };
  };

  const isLocked = (_eventData, transform) => {
    const id = transform.target.id;
    const foundObject = textContaintObject?.find((obj) => obj.id === id);
    const isLocked = foundObject?.locked ?? false;
    return isLocked;
  }

  const createControls = () => ({
    deleteControl: new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      cursorStyle: "pointer",
      offsetX: 15,
      mouseUpHandler: deleteObject,
      render: renderIcon("delete"),
      cornerSize: 20,
    }),
    resizeControl: new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetX: 16,
      offsetY: 16,
      cursorStyle: "nwse-resize",
      actionHandler: scaleFromCenter,
      actionName: "scale",
      render: renderIcon("resize"),
      cornerSize: 20,
    }),
    rotateControl: new fabric.Control({
      x: -0.5,
      y: -0.5,
      offsetX: -16,
      offsetY: -16,
      cursorStyle: "crosshair",
      actionHandler: rotateWithCenter,
      actionName: "rotate",
      render: renderIcon("rotate"),
      cornerSize: 20,
    }),
    bringToFrontControl: new fabric.Control({
      x: -0.5,
      y: 0.5,
      offsetX: -16,  // move a little left
      offsetY: 16,   // move a little down
      actionName: "layer",
      cursorStyle: "pointer",
      mouseUpHandler: bringPopup,
      render: renderIcon("layer"),
      cornerSize: 20,
    }),

    increaseHeight: new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -16,
      cursorStyle: "n-resize",
      actionHandler: scaleYFromCenter,
      actionName: "scaleY",
      render: renderIcon("height"),
      cornerSize: 20,
    }),
    increaseWidth: new fabric.Control({
      x: 0.5,
      y: 0,
      offsetX: 16,
      cursorStyle: "e-resize",
      actionHandler: scaleXFromCenter,
      actionName: "scaleX",
      render: renderIcon("width"),
      cornerSize: 20,
    }),
  });

  const deleteObject = (_eventData, transform) => {

    if (!isLocked(_eventData, transform)) {
      const canvas = transform.target.canvas;
      dispatch(deleteTextState(transform.target.id));
      dispatch(deleteImageState(transform.target.id));

      canvas.remove(transform.target);
      canvas.requestRenderAll();
      // setSelectedHeight("");
      navigate("/design/product");
    }
  };

  const scaleFromCenter = (eventData, transform, x, y) => {
    if (!isLocked(eventData, transform)) {
      transform.target.set({ centeredScaling: true });
      return fabric.controlsUtils.scalingEqually(eventData, transform, x, y);
    }
  };

  const scaleXFromCenter = (eventData, transform, x, y) => {
    if (!isLocked(eventData, transform)) {
      transform.target.set({ centeredScaling: true });
      return fabric.controlsUtils.scalingX(eventData, transform, x, y);
    }

  };

  const scaleYFromCenter = (eventData, transform, x, y) => {
    if (!isLocked(eventData, transform)) {
      transform.target.set({ centeredScaling: true });
      return fabric.controlsUtils.scalingY(eventData, transform, x, y);
    }
  };

  const rotateWithCenter = (eventData, transform, x, y) => {
    if (!isLocked(eventData, transform)) {
      transform.target.set({ centeredRotation: true });
      return fabric.controlsUtils.rotationWithSnapping(
        eventData,
        transform,
        x,
        y
      );

    }
  };

  // **********************************************************************************************************************************************************
  //                                                                                    MIRROR OBJECTS
  // **********************************************************************************************************************************************************
  const syncMirrorCanvas = async (activeSide) => {
    return;

    const getImageFromCanvas = async (fabricCanvas) => {
      if (!fabricCanvas) return null;

      // Create an off-screen Fabric canvas
      const tempCanvas = new fabric.StaticCanvas(null, {
        width: fabricCanvas.getWidth(),
        height: fabricCanvas.getHeight(),
        backgroundColor: fabricCanvas.backgroundColor,
      });

      // Clone only non-text/non-rect objects 
      const objectClones = await Promise.all(
        fabricCanvas.getObjects()
          .filter(obj => obj.type !== 'text' && obj.type !== 'rect')
          .map(obj => new Promise(resolve => obj.clone(clone => resolve(clone))))
      );

      objectClones.forEach(obj => tempCanvas.add(obj));

      // Clone and apply background image (if any)
      if (fabricCanvas.backgroundImage) {
        const clonedBg = await new Promise(resolve =>
          fabricCanvas.backgroundImage.clone(clone => resolve(clone))
        );

        tempCanvas.setBackgroundImage(clonedBg, () => {
          tempCanvas.renderAll();
        });
      } else {
        tempCanvas.renderAll();
      }

      // Wait for 1 frame to ensure rendering
      await new Promise(resolve => requestAnimationFrame(resolve));


      // Export the canvas image
      return tempCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });
    };


    // console.log("activeSide inside", activeSide);
    if (activeSide === "front") {
      // console.log("active side", activeSide, "changing front")
      setFrontPreviewImage(await getImageFromCanvas(fabricCanvasRef.current));
    }
    else if (activeSide === "back") {
      setBackPreviewImage(await getImageFromCanvas(fabricCanvasRef.current));
    }
    else if (activeSide === "leftSleeve") {
      setLeftSleevePreviewImage(await getImageFromCanvas(fabricCanvasRef.current));
    }
    else if (activeSide === "rightSleeve") {
      setRightSleevePreviewImage(await getImageFromCanvas(fabricCanvasRef.current))
    }

  };

  // **********************************************************************************************************************************************************
  //                                                                                    USE EFFECTS 
  // **********************************************************************************************************************************************************

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && canvas.setZoom) {
      const zoom = zoomLevel;

      // Get canvas center point (in pixels)
      const center = new fabric.Point(canvas.width / 2, canvas.height / 2);

      // Zoom relative to center point
      canvas.zoomToPoint(center, zoom);
    }
  }, [zoomLevel]);


  useEffect(() => {
    updateBoundaryVisibility();
  }, [addName, addNumber, nameAndNumberDesignState, textContaintObject, updateBoundaryVisibility]);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 550,
      height: 450,
      // backgroundColor: "gray"
    });

    canvas.preserveObjectStacking = true;
    fabricCanvasRef.current = canvas;

    const boxWidth = 270;
    const boxHeight = 355;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const boxLeft = (canvasWidth - boxWidth) / 2;
    const boxTop = (canvasHeight - boxHeight) / 2;

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
    });

    const warningText = new fabric.Text("Please keep design inside the box", {
      left: boxLeft + boxWidth / 2, // center horizontally
      top: boxTop + 5, // add padding from top
      fontSize: 16,
      fill: warningColor || "#00F8E7FF",
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      originX: "center",
      originY: "top", // align top edge (with padding)
      textAlign: "center",
    });



    canvas.add(boundaryBox);
    canvas.add(warningText);

    function updateBoundaryVisibility() {
      const textObjects = canvas.getObjects().filter((obj) => obj.type === "curved-text");
      textObjects.forEach((obj) => obj.setCoords());

      const allInside = textObjects.every((obj) => {
        const objBounds = obj.getBoundingRect(true);
        const boxBounds = boundaryBox.getBoundingRect(true);

        return (
          objBounds.left >= boxBounds.left &&
          objBounds.top >= boxBounds.top &&
          objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
          objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
        );
      });

      boundaryBox.visible = !allInside;
      warningText.visible = !allInside;
      canvas.bringToFront(boundaryBox);
      canvas.bringToFront(warningText);
      canvas.requestRenderAll();
    }







    const handleSelection = (e) => {
      if (e.selected.length > 1) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      } else {

        setSelectedObject(e.selected[0]);
      }
    };

    const handleSelectionCleared = () => {
      // setSelectedObject(null);
      dispatch(setSelectedTextState(null));
    };




    // Consolidated handlers
    const handleObjectAdded = (e) => {
      syncMirrorCanvas(activeSide);
      updateBoundaryVisibility(e);
    };

    const handleObjectModified = (e) => {
      updateBoundaryVisibility(e);
      syncMirrorCanvas(activeSide);
      // handleScale(e);
    };

    const handleMoving = (e) => {
      checkBoundary(e);
      updateBoundaryVisibility(e);
    }

    const events = [
      ["object:added", handleObjectAdded],
      ["object:removed", handleObjectAdded],
      ["object:modified", handleObjectModified],
      ["object:moving", handleMoving],
      ["object:scaling", updateBoundaryVisibility],
      ["selection:created", handleSelection],
      ["selection:updated", handleSelection],
      ["selection:cleared", handleSelectionCleared],
      ["editing:exited", updateBoundaryVisibility],
      ["text:cut", updateBoundaryVisibility],
      ["text:changed", handleObjectAdded],
      // ["object:moving", moveHandler], // Uncomment if needed
    ];



    events.forEach(([event, handler]) => canvas.on(event, handler));

    // Add separate key event handler
    canvas.on('key:down', function (opt) {
      if (opt.e.ctrlKey && opt.e.keyCode === 88) { // Ctrl+X
        setTimeout(updateBoundaryVisibility, 10);
      }
    });

    if (backgroundImage) {
      fabric.Image.fromURL(
        backgroundImage,
        (img) => {
          const scaleX = 590 / img.width;
          const scaleY = 450 / img.height;

          img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: "center",
            originY: "center",
            scaleX,
            scaleY,
            selectable: false,
            evented: false,
          });

          canvas.setBackgroundImage(img, () => fabricCanvasRef.current.renderAll());
          syncMirrorCanvas(activeSide);
        },
        { crossOrigin: "anonymous" }
      );
    }
    renderCurveTextObjects();
    renderNameAndNumber(); //note : we have to call it for render object after canvas initialize
    renderAllImageObjects();
    //want to do same for image 

    return () => {
      // Remove all listeners
      events.forEach(([event, handler]) => canvas.off(event, handler));

      // Dispose of the canvas to prevent memory leaks
      canvas.dispose();
      fabricCanvasRef.current = null;
      // mirrorCanvasRef.current.dispose();
      // mirrorCanvasRef.current = null;
    };
  }, [iconImages, id, backgroundImage, activeSide]);



  // **********************************************************************************************************************************************************
  //                                                                                    TEXT OBJECTS AREA
  // **********************************************************************************************************************************************************
  const renderCurveTextObjects = () => {
    const canvas = fabricCanvasRef.current;
    if (textContaintObject && textContaintObject.length === 0) {
      let existingTextbox = canvas.getObjects().filter((obj) => obj.type === "curved-text" || obj.type === "textbox");
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

        const clampScale = (value, min = 1, max = 10) => Math.max(min, Math.min(value, max));

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
          existingObj.controls = createControls()
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

          curved.on("mousedown", () => {
            dispatch(setSelectedTextState(textInput.id));
            setActiveObjectType("curved-text");
            navigate("/design/addText", { state: textInput });
          });
          const handleScale = (e) => {
            const clampScale = (value, min = 0.2, max = 10) => Math.max(min, Math.min(value, max));
            const obj = e.target;
            // console.log(e, "event details");
            if (!obj || !e.transform || !['scale', 'scaleX', 'scaleY'].includes(e.transform.action)) return;


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
              finalScaleX = clampScale((additiveScale));
              finalScaleY = clampScale((additiveScale));
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

            obj.setPositionByOrigin(center, 'center', 'center');
            obj.setCoords();

            // Dispatch based on whether it was uniform or not

            globalDispatch("scaleX", parseFloat(finalScaleX.toFixed(1)), obj.id);
            globalDispatch("scaleY", parseFloat(finalScaleY.toFixed(1)), obj.id);

            globalDispatch("scaledValue", parseFloat((finalScaleY + finalScaleY / 2).toFixed(1)), obj.id);
            canvas.renderAll();
          }
          curved.on("modified", (e) => {
            setActiveObjectType("curved-text")
            const obj = e.target;
            if (!obj) return;

            const center = obj.getCenterPoint();

            obj.setPositionByOrigin(center, 'center', 'center');
            obj.setCoords();
            globalDispatch("position", { x: obj.left, y: obj.top }, textInput.id);
            globalDispatch("angle", obj.angle, textInput.id);
            canvas.renderAll();
            handleScale(e);
            syncMirrorCanvas(activeSide);

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

          curved.controls = createControls(); // your custom controls
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
      updateBoundaryVisibility();
    }
  }
  useEffect(() => {
    // console.log("renderiing on layer index changed");
    renderCurveTextObjects();

  }, [activeSide, isRender, dispatch, id, textContaintObject]);

  // **********************************************************************************************************************************************************
  //                                                                                    IMAGE OBJECTS AREA
  // **********************************************************************************************************************************************************

  // const renderAllImageObjects = () => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) return;

  //   // Step 1: Clean duplicates (same ID multiple times on canvas)
  //   const seenIds = new Set();
  //   let duplicateRemoved = false;

  //   canvas.getObjects('image').forEach(obj => {
  //     if (!obj.id) return;
  //     if (seenIds.has(obj.id)) {
  //       console.warn("→ Removed duplicate image with id:", obj.id);
  //       canvas.remove(obj);
  //       duplicateRemoved = true;
  //     } else {
  //       seenIds.add(obj.id);
  //     }
  //   });

  //   // Step 2: Remove images not in imageContaintObject
  //   const validIds = imageContaintObject?.map(img => img.id) || [];
  //   let staleRemoved = false;

  //   canvas.getObjects('image').forEach(obj => {
  //     if (obj.id && !validIds.includes(obj.id)) {
  //       console.warn("→ Removed stale image not in imageContaintObject:", obj.id);
  //       canvas.remove(obj);
  //       staleRemoved = true;
  //     }
  //   });

  //   if (duplicateRemoved || staleRemoved) {
  //     canvas.renderAll();
  //   }

  //   // Step 3: If no images to render, stop
  //   if (!imageContaintObject || imageContaintObject.length === 0) {
  //     return;
  //   }

  //   // Step 4: Render/update image objects
  //   imageContaintObject.forEach((imageData) => {
  //     const {
  //       id,
  //       src,
  //       position,
  //       angle = 0,
  //       flipX = false,
  //       flipY = false,
  //       locked = false,
  //       scaleX,
  //       scaleY,
  //       layerIndex = 0,
  //       customType = "main-image",
  //       loading,
  //       loadingSrc,
  //     } = imageData;
  //     const spinnerId = `spinner-${id}`;
  //     const existingObj = canvas.getObjects('image').find(obj => obj.id === id);
  //     console.log("loading state", loading, loadingSrc);
  //     //  Step 1: If loading, show animated arc spinner
  //     if (loading) {
  //       // Remove existing image with same ID (e.g., if reloading)
  //       canvas.getObjects().forEach(obj => {
  //         if (obj.id === selectedImageId) {
  //           canvas.remove(obj);
  //         }
  //       });

  //       const spinnerId = `spinner-${id}`;
  //       const existingSpinner = canvas.getObjects().find(o => o.id === spinnerId);
  //       if (existingSpinner) return;

  //       const dotCount = 5;
  //       const dotRadius = 6;
  //       const dotSpacing = 15;
  //       const colors = ['#000000', '#000000', '#000000', '#000000', '#000000']; // black

  //       const dots = [];

  //       for (let i = 0; i < dotCount; i++) {
  //         dots.push(new fabric.Circle({
  //           radius: dotRadius,
  //           fill: colors[i],
  //           left: position.x + (i * dotSpacing) - ((dotCount * dotSpacing) / 2) + (dotSpacing / 2),
  //           top: position.y,
  //           originX: 'center',
  //           originY: 'center',
  //           opacity: 0.3,
  //           selectable: false,
  //           evented: false
  //         }));
  //       }

  //       const loader = new fabric.Group(dots, {
  //         id: spinnerId,
  //         scaleX,
  //         scaleY,
  //         height: 150,
  //         width: 150,
  //         originX: 'center',
  //         originY: 'center',
  //         left: position.x,
  //         top: position.y,
  //         selectable: true, // enable interaction
  //         evented: false,
  //         lockMovementX: true,  
  //         lockMovementY: true,
  //         objectCaching: false,
  //         borderColor: "skyblue",
  //         borderDashArray: [4, 4],
  //       });

  //       // Enable all control points
  //       loader.setControlsVisibility({
  //         mt: true, mb: true, ml: true, mr: true,
  //         tl: true, tr: true, bl: true, br: true, mtr: true
  //       });

  //       // Optional: if using custom controls
  //       if (typeof createControls === 'function') {
  //         loader.controls = createControls();
  //       }

  //       // Event listeners for interaction
  //       loader.on("mousedown", (e) => {
  //         setActiveObjectType("image");
  //         console.log("Loader clicked:", loader.id);
  //         dispatch?.(selectedImageIdState(id)); // Optional Redux dispatch
  //       });

  //       loader.on("modified", (e) => {
  //         const obj = e.target;
  //         if (!obj) return;
  //         const center = obj.getCenterPoint();
  //         obj.setPositionByOrigin(center, 'center', 'center');
  //         obj.setCoords();

  //         globalDispatch("position", { x: obj.left, y: obj.top }, id);
  //         globalDispatch("angle", obj.angle, id);
  //         handleScale(e);
  //         // canvas.renderAll();
  //       });

  //       canvas.add(loader);
  //       canvas.bringToFront(loader);

  //       // Animate wave effect
  //       let animationStep = 0;
  //       const animationSpeed = 0.15;
  //       let animationFrameId = null;

  //       const animateDots = () => {
  //         if (!canvas.getObjects().includes(loader)) return;

  //         animationStep += animationSpeed;

  //         loader.getObjects().forEach((dot, i) => {
  //           const waveOffset = i * 0.8;
  //           const scale = 0.6 + Math.sin(animationStep + waveOffset) * 0.4;
  //           const opacity = 0.4 + scale * 0.6;

  //           dot.set({
  //             scaleX: scale,
  //             scaleY: scale,
  //             opacity: opacity
  //           });
  //         });

  //         canvas.requestRenderAll();
  //         animationFrameId = requestAnimationFrame(animateDots);
  //       };

  //       animateDots();

  //       // Attach cleanup method to remove loader and stop animation
  //       loader.cleanup = () => {
  //         if (animationFrameId) {
  //           cancelAnimationFrame(animationFrameId);
  //         }
  //         canvas.remove(loader);
  //       };

  //       return loader;
  //     }


  //     // Step 2: Remove spinner when loading is false
  //     const oldSpinner = canvas.getObjects().find(o => o.id === spinnerId);
  //     if (oldSpinner) {
  //       clearTimeout(oldSpinner.__spinnerTimer);
  //       canvas.remove(oldSpinner);
  //     }

  //     if (existingObj && existingObj.getSrc() !== src) {
  //       // CASE 1: Replace if src changed

  //       console.log("src....00", src, "prev src", existingObj.getSrc());
  //       console.log("→ Replacing image (src changed):", id);
  //       canvas.remove(existingObj);

  //         fabric.Image.fromURL(src, (newImg) => {
  //            console.log("img height and width when replace ",newImg.width,newImg.height);
  //           const computedScaleX = 150 / newImg.width;
  //           const computedScaleY = 150 / newImg.height;

  //           newImg.set({
  //             id,
  //             left: position.x,
  //             top: position.y,
  //             angle,
  //             scaleX: computedScaleX * scaleX,
  //             scaleY: computedScaleY * scaleY,
  //             flipX,
  //             flipY,
  //             lockMovementX: locked,
  //             lockMovementY: locked,
  //             originX: "center",
  //             originY: "center",
  //             objectCaching: false,
  //             borderColor: "skyblue",
  //             borderDashArray: [4, 4],
  //             hasBorders: true,
  //             hasControls: true,
  //             selectable: true,
  //             evented: true,
  //             customType,
  //             isSync: true,
  //             layerIndex
  //           });

  //           newImg.setControlsVisibility({
  //             mt: false, mb: false, ml: false, mr: false,
  //             tl: false, tr: false, bl: false, br: false, mtr: false,
  //           });

  //           newImg.controls = createControls();
  //           canvas.add(newImg);

  //           newImg.on("mousedown", (e) => {
  //             const obj = e.target;
  //             if (obj && obj.id) {
  //               canvas.setActiveObject(e.target);
  //               dispatch(selectedImageIdState(obj.id));
  //               setActiveObjectType("Image");
  //               navigate("/design/addImage", { state: imageData });
                
  //             }
  //           });


  //           newImg.on("modified", (e) => {
  //             setActiveObjectType("image");
  //             const obj = e.target;
  //             if (!obj) return;
  //             const center = obj.getCenterPoint();
  //             obj.setPositionByOrigin(center, 'center', 'center');
  //             obj.setCoords();

  //             globalDispatch("position", { x: obj.left, y: obj.top }, id);
  //             globalDispatch("angle", obj.angle, id);
  //             handleScale(e);
  //             canvas.renderAll();
  //             syncMirrorCanvas(activeSide);
  //           });


  //           canvas.renderAll();
  //         });

  //     } else if (existingObj) {
  //       // CASE 2: Update properties
  //       console.log("→ Updating existing image:", id);
  //       const computedScaleX = 150 / existingObj.width;
  //       const computedScaleY = 150 / existingObj.height;

  //       existingObj.set({
  //         left: position.x,
  //         top: position.y,
  //         angle,
  //         flipX,
  //         flipY,
  //         scaleX: computedScaleX * scaleX,
  //         scaleY: computedScaleY * scaleY,
  //         lockMovementX: locked,
  //         lockMovementY: locked,
  //         layerIndex,
  //         customType,
  //         isSync: true
  //       });
  //       existingObj.setControlsVisibility({
  //         mt: false, mb: false, ml: false, mr: false,
  //         tl: false, tr: false, bl: false, br: false, mtr: false,
  //       });

  //       existingObj.controls = createControls();
  //       // canvas.add(newImg);
  //       const center = existingObj.getCenterPoint();
  //       existingObj.setPositionByOrigin(center, "center", "center");
  //       existingObj.setCoords();

  //       canvas.renderAll();

  //     } else {
  //       // CASE 3: Create new image
  //       console.log("→ Creating new image:", id);
  //       console.log("src....01", src);

  //       fabric.Image.fromURL(src, (img) => {
  //         console.log("img height and width ",img.width,img.height);
  //         const computedScaleX = 150 / img.width;
  //         const computedScaleY = 150 / img.height;

  //         img.set({
  //           id,
  //           left: position.x,
  //           top: position.y,
  //           angle,
  //           scaleX: computedScaleX * scaleX,
  //           scaleY: computedScaleY * scaleY,
  //           flipX,
  //           flipY,
  //           lockMovementX: locked,
  //           lockMovementY: locked,
  //           originX: "center",
  //           originY: "center",
  //           objectCaching: false,
  //           borderColor: "skyblue",
  //           borderDashArray: [4, 4],
  //           hasBorders: true,
  //           hasControls: true,
  //           selectable: true,
  //           evented: true,
  //           customType,
  //           isSync: true,
  //           layerIndex
  //         });

  //         img.setControlsVisibility({
  //           mt: false, mb: false, ml: false, mr: false,
  //           tl: false, tr: false, bl: false, br: false, mtr: false,
  //         });

  //         img.controls = createControls();
  //         canvas.add(img);

  //         img.on("mousedown", (e) => {
  //           const obj = e.target;
  //           if (obj && obj.id) {
  //             canvas.setActiveObject(obj);
  //             dispatch(selectedImageIdState(obj.id));
  //             setActiveObjectType("image");
  //             navigate("/design/addImage", { state: imageData });
  //              canvas.renderAll();
  //           }
  //         });

  //         img.on("modified", (e) => {
  //           const obj = e.target;
  //           if (!obj) return;
  //           const center = obj.getCenterPoint();
  //           obj.setPositionByOrigin(center, 'center', 'center');
  //           obj.setCoords();

  //           globalDispatch("position", { x: obj.left, y: obj.top }, id);
  //           globalDispatch("angle", obj.angle, id);
  //           handleScale(e);
  //           canvas.renderAll();
  //           syncMirrorCanvas(activeSide);
  //         });



  //         canvas.renderAll();
  //       });
  //     }
  //   });

  //   updateBoundaryVisibility?.();
  // };
  const renderAllImageObjects = () => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const MAX_WIDTH = 300;
  const MAX_HEIGHT = 300;

  const getScaled = (img, userScaleX = 1, userScaleY = 1) => {
    const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
    return {
      scaleX: scale * userScaleX,
      scaleY: scale * userScaleY
    };
  };

  const seenIds = new Set();
  let duplicateRemoved = false;

  canvas.getObjects('image').forEach(obj => {
    if (!obj.id) return;
    if (seenIds.has(obj.id)) {
      console.warn("→ Removed duplicate image with id:", obj.id);
      canvas.remove(obj);
      duplicateRemoved = true;
    } else {
      seenIds.add(obj.id);
    }
  });

  const validIds = imageContaintObject?.map(img => img.id) || [];
  let staleRemoved = false;

  canvas.getObjects('image').forEach(obj => {
    if (obj.id && !validIds.includes(obj.id)) {
      console.warn("→ Removed stale image not in imageContaintObject:", obj.id);
      canvas.remove(obj);
      staleRemoved = true;
    }
  });

  if (duplicateRemoved || staleRemoved) {
    canvas.renderAll();
  }

  if (!imageContaintObject || imageContaintObject.length === 0) return;

  imageContaintObject.forEach((imageData) => {
    const {
      id, src, position, angle = 0,
      flipX = false, flipY = false,
      locked = false,
      scaleX = 1, scaleY = 1,
      layerIndex = 0, customType = "main-image",
      loading, loadingSrc
    } = imageData;

    const spinnerId = `spinner-${id}`;
    const existingObj = canvas.getObjects('image').find(obj => obj.id === id);

    // Loader (Spinner)
    if (loading) {
      canvas.getObjects().forEach(obj => {
        if (obj.id === selectedImageId) canvas.remove(obj);
      });

      const existingSpinner = canvas.getObjects().find(o => o.id === spinnerId);
      if (existingSpinner) return;

      const dotCount = 5;
      const dotRadius = 6;
      const dotSpacing = 15;
      const colors = Array(dotCount).fill('#000000');
      const dots = [];

      for (let i = 0; i < dotCount; i++) {
        dots.push(new fabric.Circle({
          radius: dotRadius,
          fill: colors[i],
          left: position.x + (i * dotSpacing) - ((dotCount * dotSpacing) / 2) + (dotSpacing / 2),
          top: position.y,
          originX: 'center',
          originY: 'center',
          opacity: 0.3,
          selectable: false,
          evented: false
        }));
      }

      const loader = new fabric.Group(dots, {
        id: spinnerId,
        scaleX,
        scaleY,
        originX: 'center',
        originY: 'center',
        left: position.x,
        top: position.y,
        selectable: true,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        objectCaching: false,
        borderColor: "skyblue",
        borderDashArray: [4, 4],
      });

      loader.setControlsVisibility({
        mt: true, mb: true, ml: true, mr: true,
        tl: true, tr: true, bl: true, br: true, mtr: true
      });

      if (typeof createControls === 'function') {
        loader.controls = createControls();
      }

      loader.on("mousedown", () => {
        setActiveObjectType("image");
        dispatch?.(selectedImageIdState(id));
      });

      loader.on("modified", (e) => {
        const obj = e.target;
        if (!obj) return;
        const center = obj.getCenterPoint();
        obj.setPositionByOrigin(center, 'center', 'center');
        obj.setCoords();
        globalDispatch("position", { x: obj.left, y: obj.top }, id);
        globalDispatch("angle", obj.angle, id);
        handleScale(e);
      });

      canvas.add(loader);
      canvas.bringToFront(loader);

      let animationStep = 0;
      const animationSpeed = 0.15;
      let animationFrameId = null;

      const animateDots = () => {
        if (!canvas.getObjects().includes(loader)) return;

        animationStep += animationSpeed;
        loader.getObjects().forEach((dot, i) => {
          const waveOffset = i * 0.8;
          const scale = 0.6 + Math.sin(animationStep + waveOffset) * 0.4;
          const opacity = 0.4 + scale * 0.6;
          dot.set({ scaleX: scale, scaleY: scale, opacity });
        });

        canvas.requestRenderAll();
        animationFrameId = requestAnimationFrame(animateDots);
      };

      animateDots();
      loader.cleanup = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        canvas.remove(loader);
      };

      return loader;
    }

    const oldSpinner = canvas.getObjects().find(o => o.id === spinnerId);
    if (oldSpinner) {
      clearTimeout(oldSpinner.__spinnerTimer);
      canvas.remove(oldSpinner);
    }

    // Replace Image
    if (existingObj && existingObj.getSrc() !== src) {
      canvas.remove(existingObj);
      fabric.Image.fromURL(src, (newImg) => {
        const { scaleX: finalX, scaleY: finalY } = getScaled(newImg, scaleX, scaleY);

        newImg.set({
          id, left: position.x, top: position.y,
          angle, scaleX: finalX, scaleY: finalY,
          flipX, flipY,
          lockMovementX: locked, lockMovementY: locked,
          originX: "center", originY: "center",
          objectCaching: false,
          borderColor: "skyblue", borderDashArray: [4, 4],
          hasBorders: true, hasControls: true,
          selectable: true, evented: true,
          customType, isSync: true, layerIndex
        });

        newImg.setControlsVisibility({
          mt: false, mb: false, ml: false, mr: false,
          tl: false, tr: false, bl: false, br: false, mtr: false
        });

        newImg.controls = createControls();
        canvas.add(newImg);

        newImg.on("mousedown", (e) => {
          const obj = e.target;
          if (obj?.id) {
            canvas.setActiveObject(obj);
            dispatch(selectedImageIdState(obj.id));
            setActiveObjectType("Image");
            navigate("/design/addImage", { state: imageData });
          }
        });

        newImg.on("modified", (e) => {
          const obj = e.target;
          if (!obj) return;
          const center = obj.getCenterPoint();
          obj.setPositionByOrigin(center, 'center', 'center');
          obj.setCoords();
          globalDispatch("position", { x: obj.left, y: obj.top }, id);
          globalDispatch("angle", obj.angle, id);
          handleScale(e);
          canvas.renderAll();
          syncMirrorCanvas(activeSide);
        });

        canvas.renderAll();
      });

    } else if (existingObj) {
      const { scaleX: finalX, scaleY: finalY } = getScaled(existingObj, scaleX, scaleY);

      existingObj.set({
        left: position.x, top: position.y,
        angle, flipX, flipY,
        scaleX: finalX, scaleY: finalY,
        lockMovementX: locked, lockMovementY: locked,
        layerIndex, customType, isSync: true
      });

      existingObj.setControlsVisibility({
        mt: false, mb: false, ml: false, mr: false,
        tl: false, tr: false, bl: false, br: false, mtr: false
      });

      existingObj.controls = createControls();
      const center = existingObj.getCenterPoint();
      existingObj.setPositionByOrigin(center, "center", "center");
      existingObj.setCoords();
      canvas.renderAll();

    } else {
      fabric.Image.fromURL(src, (img) => {
        const { scaleX: finalX, scaleY: finalY } = getScaled(img, scaleX, scaleY);

        img.set({
          id, left: position.x, top: position.y,
          angle, scaleX: finalX, scaleY: finalY,
          flipX, flipY,
          lockMovementX: locked, lockMovementY: locked,
          originX: "center", originY: "center",
          objectCaching: false,
          borderColor: "skyblue", borderDashArray: [4, 4],
          hasBorders: true, hasControls: true,
          selectable: true, evented: true,
          customType, isSync: true, layerIndex
        });

        img.setControlsVisibility({
          mt: false, mb: false, ml: false, mr: false,
          tl: false, tr: false, bl: false, br: false, mtr: false
        });

        img.controls = createControls();
        canvas.add(img);

        img.on("mousedown", (e) => {
          const obj = e.target;
          if (obj?.id) {
            canvas.setActiveObject(obj);
            dispatch(selectedImageIdState(obj.id));
            setActiveObjectType("image");
            navigate("/design/addImage", { state: imageData });
            canvas.renderAll();
          }
        });

        img.on("modified", (e) => {
          const obj = e.target;
          if (!obj) return;
          const center = obj.getCenterPoint();
          obj.setPositionByOrigin(center, 'center', 'center');
          obj.setCoords();
          globalDispatch("position", { x: obj.left, y: obj.top }, id);
          globalDispatch("angle", obj.angle, id);
          handleScale(e);
          canvas.renderAll();
          syncMirrorCanvas(activeSide);
        });

        canvas.renderAll();
      });
    }
  });

  updateBoundaryVisibility?.();
};


  useEffect(() => {
    renderAllImageObjects();
    renderAllElements();
  }, [imageContaintObject, activeSide, isRender]); // 👈 Reacts to previewUrl change

  const renderAllElements = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Clean up existing objects
    const existingObjects = canvas.getObjects();
    existingObjects.forEach(obj => {
      if (
        (obj.type === 'curved-text' || obj.type === 'textbox') &&
        (!textContaintObject || !textContaintObject.some(t => t.id === obj.id))
      ) {
        canvas.remove(obj);
      }
      if (
        obj.type === 'image' &&
        (!imageContaintObject || !imageContaintObject.some(i => i.id === obj.id))
      ) {
        canvas.remove(obj);
      }
    });

    // Render text objects
    if (textContaintObject && textContaintObject.length > 0) {
      textContaintObject.forEach(renderCurveTextObjects);
    }

    // Render image objects
    if (imageContaintObject && imageContaintObject.length > 0) {
      imageContaintObject.forEach(renderAllImageObjects);
    }

    // Apply proper z-ordering for all elements
    const allElements = [
      ...(textContaintObject || []),
      ...(imageContaintObject || [])
    ].sort((a, b) => a.layerIndex - b.layerIndex);

    allElements.forEach(element => {
      const obj = canvas.getObjects().find(o => o.id === element.id);
      if (obj) {
        canvas.bringToFront(obj);
      }
    });

    canvas.renderAll();
    updateBoundaryVisibility?.();
  };
  // **********************************************************************************************************************************************************
  //                                                                                    NAME AND NUMBER OBJECTS AREA
  // **********************************************************************************************************************************************************
  const renderNameAndNumber = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !nameAndNumberDesignState) {
      // console.warn("Canvas or nameAndNumberDesignState is missing.");
      return;
    }

    const {
      name,
      number,
      position,
      fontFamily,
      fontColor,
      fontSize,
      id,
    } = nameAndNumberDesignState;

    const objectId = id;

    if (!addName && !addNumber) {
      const existingGroup = canvas.getObjects().find(obj => obj.id === objectId);
      if (existingGroup) {
        canvas.remove(existingGroup);
        canvas.requestRenderAll();
      }
      return;
    }

    const fontSizeMap = {
      small: 60,
      medium: 100,
      large: 150,
    };
    const baseFontSize = fontSizeMap[fontSize] || 80;

    // Remove old group if it exists
    const oldGroup = canvas.getObjects().filter(obj => obj.isDesignGroup === true);
    oldGroup.forEach((oldGroup) => canvas.remove(oldGroup));

    const textObjects = [];

    if (addName && name) {
      const nameText = new fabric.Text(name, {
        fontSize: baseFontSize * 0.3,
        fontFamily: fontFamily,
        fill: fontColor,
        originX: 'left', // manual centering
        originY: 'top',
      });
      // Center horizontally
      nameText.left = -nameText.width / 2;
      textObjects.push(nameText);
    }

    if (addNumber && number) {
      const numberText = new fabric.Text(number, {
        fontSize: baseFontSize,
        fontFamily: fontFamily,
        fill: fontColor,
        originX: 'left',
        originY: 'top',
      });
      numberText.left = (-numberText.width) / 2;

      // Stack below name if present
      if (textObjects.length > 0) {
        const previous = textObjects[textObjects.length - 1];
        numberText.top = previous.top + previous.height + 5;
        numberText.left = ((-previous.width) / 2) - (fontSize === "small" ? 12 : 30);
      }
      textObjects.push(numberText);
    }

    if (textObjects.length === 0) return;

    const group = new fabric.Group(textObjects, {
      id: objectId,
      left: position?.x || canvas.getWidth() / 2,
      top: position?.y || canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      alignText: 'center',
      selectable: true,
      fontFamily: fontFamily,
      hasBorders: false,
      hasControls: false,
      evented: true,
      isSync: true,
    });

    group.on(("modified"), (e) => {
      const obj = e.target;
      if (!obj) return;
      const center = obj.getCenterPoint();

      obj.setPositionByOrigin(center, 'center', 'center');
      obj.setCoords();
      dispatch(updateNameAndNumberDesignState({
        changes: {
          "position": { x: obj.left, y: obj.top },
        }
      }));

    })
    group.on("mousedown", () => {
      navigate("/design/addNames");
    })

    // console.log("group ", group, group.type);
    // Force recalculation of bounds
    group._calcBounds();
    group._updateObjectsCoords();
    group.set({
      width: fontSize === "small" ? 60 : 190,
      left: position?.x || canvas.getWidth() / 2,
      top: position?.y || canvas.getHeight() / 2,

      // originX: 'center',
      // originY: 'center',
      isDesignGroup: true,
      hasBorders: false,

    });

    group.setCoords();
    canvas.add(group);
    canvas.requestRenderAll();
    syncMirrorCanvas(activeSide);
  }
  useEffect(() => {
    const loadAndRender = async () => {
      if (nameAndNumberDesignState?.fontFamily) {
        await loadFont(nameAndNumberDesignState.fontFamily);
      }
      renderNameAndNumber();
    };

    loadAndRender();
  }, [isRender, addName, addNumber, nameAndNumberDesignState, activeSide]);



  // **********************************************************************************************************************************************************
  //                                                                                    OTHER USE EFFECTS
  // **********************************************************************************************************************************************************

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const existingObjects = canvas.getObjects();
    existingObjects.forEach((obj) => {
      if (
        (obj.type === "curved-text" || obj.type === "text" || obj.type === "textbox") &&
        obj.id &&
        !textContaintObject.find((txt) => txt.id === obj.id)
      ) {
        canvas.remove(obj);
      }
    });

    const object = canvas.getObjects().find((obj) => obj.id === selectedTextId);
    // console.log("selectedTextId", selectedTextId, object)
    // if (object) {
    //   canvas.setActiveObject(object);
    //   canvas.renderAll();
    // }
    canvas.renderAll();
  }, [selectedTextId, isRender])






  return (
    <div id={style.canvas} style={{ position: "relative", top: 5 }} >
      <canvas ref={canvasRef} />
      <LayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLayerAction={handleLayerAction}
      />

    </div>
  );
};
export default MainDesignTool;
