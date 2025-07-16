import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { fabric } from "fabric";
// import icons from "../../data/icons";
// import { TbArrowForwardUp } from "react-icons/tb";
// import { TbArrowBack } from "react-icons/tb";
// import { VscZoomIn } from "react-icons/vsc";
import style from "./MainDesignTool.module.css";
import FontFaceObserver from 'fontfaceobserver';
import { useDispatch, useSelector } from "react-redux";
import renderCurveTextObjects from "./Objects/renderTextObjects";
import renderAllImageObjects from "./Objects/renderAllImageObjects";
import renderNameAndNumber from "./Objects/renderNameAndNumberObject";
import updateBoundaryVisibility from "./core/updateBoundaryVisibility";
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
} from "../../redux/FrontendDesign/TextFrontendDesignSlice";
import { useNavigate } from "react-router-dom";
import LayerModal from "../CommonComponent/layerComponent/layerComponent";
import CurvedText from "../fabric/fabric.TextCurved"; // Adjust path if needed
import syncMirrorCanvas from "./core/syncMirrorCanvas";
import { createControls } from "./utils/customControls";

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
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId);
  const loadingState = useSelector(state => state.TextFrontendDesignSlice.present[activeSide].loadingState);
  // console.log("loadingState redux ........", loadingState)

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
  const [loading, setLoading] = useState(false);

  // **********************************************************************************************************************************************************
  //                                                                                    USE DISPTACHS AREA
  // **********************************************************************************************************************************************************
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // **********************************************************************************************************************************************************
  //                                                                                    USE MEMO AREA
  // **********************************************************************************************************************************************************
  const iconImages = useMemo(() => {
    const imgs = {};
    // for (const key in icons) {
    //   const img = new Image();
    //   img.src = icons[key];
    //   imgs[key] = img;
    // }
    return imgs;
  }, []);

  // **********************************************************************************************************************************************************
  //                                                                                    HELPER FUNCTIONS AREA
  // **********************************************************************************************************************************************************
  const globalDispatch = (lable, value, id) => {
    dispatch(
      updateImageState({
        "id": id,
        changes: { [lable]: (lable == "angle" ? Number(value).toFixed(1) : value) },
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

  const syncMirrorCanvasHelper = (activeSide) => {
    syncMirrorCanvas(fabric, fabricCanvasRef, activeSide, setFrontPreviewImage, setBackPreviewImage, setLeftSleevePreviewImage, setRightSleevePreviewImage);
  }
  const renderCurveTextObjectsHelper = () => {
    renderCurveTextObjects(
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

    )
  }
  const renderNameAndNumberHelper = () => {
    renderNameAndNumber(
      fabricCanvasRef,
      dispatch,
      nameAndNumberDesignState,
      setActiveObjectType,
      updateBoundaryVisibility,
      createControls,
      syncMirrorCanvasHelper,
      navigate,
      fabric,
      globalDispatch,
      activeSide,
      addNumber,
      addName,
      updateNameAndNumberDesignState,
      bringPopup
    );
  }
  const renderAllImageObjectsHelper = () => {
    renderAllImageObjects(
      fabricCanvasRef,
      dispatch,
      imageContaintObject,
      setActiveObjectType,
      updateBoundaryVisibility,
      createControls,
      syncMirrorCanvasHelper,
      navigate,
      fabric,
      selectedImageIdState,
      selectedImageId,
      globalDispatch,
      activeSide,
      handleScale,
      bringPopup
    )
  }

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
    // alert("medam present")
    setIsModalOpen(true);


  };

  const handleScale = (e) => {
    const clamp = (value, min = 0.01, max = 20) => Math.max(min, Math.min(value, max));

    const obj = e.target;
    const canvas = fabricCanvasRef.current;

    if (!obj || !obj.id || !e.transform || !['scale', 'scaleX', 'scaleY'].includes(e.transform.action)) return;

    const imageData = imageContaintObject?.find(img => img.id === obj.id);
    if (!imageData) return;

    // Preserve center before scaling
    const center = obj.getCenterPoint();

    const originalWidth = obj.width;
    const originalHeight = obj.height;

    const MAX_WIDTH = 180;
    const MAX_HEIGHT = 180;

    const boundingScale = Math.min(MAX_WIDTH / originalWidth, MAX_HEIGHT / originalHeight);

    let relativeScaleX = obj.scaleX / boundingScale;
    let relativeScaleY = obj.scaleY / boundingScale;

    // Clamp small values safely (even below 0.1)
    relativeScaleX = clamp(relativeScaleX);
    relativeScaleY = clamp(relativeScaleY);

    obj.set({
      scaleX: boundingScale * relativeScaleX,
      scaleY: boundingScale * relativeScaleY,
    });

    // Keep the object centered visually
    obj.setPositionByOrigin(center, 'center', 'center');
    obj.setCoords();

    globalDispatch("scaleX", parseFloat(relativeScaleX.toFixed(2)), obj.id);
    globalDispatch("scaleY", parseFloat(relativeScaleY.toFixed(2)), obj.id);
    globalDispatch("scaledValue", parseFloat(((relativeScaleX + relativeScaleY) / 2).toFixed(2)), obj.id);

    canvas?.renderAll();
    syncMirrorCanvasHelper(activeSide);
  };



  // **********************************************************************************************************************************************************
  //                                                                                    USE EFFECTS 
  // **********************************************************************************************************************************************************
  useEffect(() => {

    console.log("loading reduxt is ", loadingState)
    setLoading(loadingState?.loading);
    console.log("loading state is ", loading)
  }, [loadingState])
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

  const removeAllHtmlControls = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      if (obj._htmlControls) {
        Object.values(obj._htmlControls).forEach((el) => el.remove());
        obj._htmlControls = null;
        canvas.requestRenderAll();
      }
    });
  }

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const wrapperElement = canvasElement.parentNode;

    const canvasWidth = wrapperElement.clientWidth;
    const canvasHeight = wrapperElement.clientHeight;

    const canvas = new fabric.Canvas(canvasElement, {
      width: canvasWidth,
      height: canvasHeight,
    });
    fabricCanvasRef.current = canvas;

    const boxWidth = 270;
    const boxHeight = 335;

    const boxLeft = (canvasWidth - boxWidth) / 2;
    const boxTop = (canvasHeight - boxHeight) / 2;

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop + 20,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"

    });
    const boundaryBoxInner = new fabric.Rect({
      left: boxLeft + 5,
      top: boxTop + 25,
      width: boxWidth - 10,
      height: boxHeight - 40,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      objectCaching: false,
      strokeDashArray: [3, 1], // ← use this instead of borderDashArray
      name: "boundaryBoxInner"
    });
    const boundaryBoxLeft = new fabric.Rect({
      left: boxLeft + 165,
      top: boxTop + 25,
      width: 100,
      height: 100,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      strokeWidth: 1,
      selectable: false,
      objectCaching: false,
      strokeDashArray: [3, 1],
      name: "boundaryBoxLeft"
    });

    const warningText = new fabric.Text("Please keep design inside the box", {
      left: boxLeft + boxWidth / 2,
      top: boxTop + 30,
      fontSize: 15,
      fontFamily: "Poppins",
      fill: warningColor || "#00F8E7FF",
      selectable: false,
      evented: false,
      visible: true,
      originX: "center", // ⬅️ Centers text
      originY: "top",
      name: "warningText",
    });
    // canvas.add(warningText);
    canvas.bringToFront(warningText);
    // canvas.requestRenderAll();


    const adultText = new fabric.Text("Adult", {
      left: boxLeft + boxWidth / 2,
      top: boxTop + 330,
      width: boxWidth - 20,           // ✅ important for wrapping
      fontSize: 13,
      fontFamily: "Poppins",
      fill: warningColor || "#00F8E7FF",
      selectable: false,
      evented: false,
      visible: false,                  // ✅ visible for testing
      isSync: false,
      originX: "center",
      originY: "top",
      textAlign: "center",
      name: "adultText",
    });
    const leftChestText = new fabric.Text("Left Chest", {
      left: boxLeft + 80 + boxWidth / 2,
      top: boxTop + 105,
      // width: boxWidth - 20,             // ✅ important for wrapping
      fontSize: 13,
      fontFamily: "Poppins",
      fill: warningColor || "#00F8E7FF",
      selectable: false,
      evented: false,
      visible: false,                  // ✅ visible for testing
      isSync: false,
      originX: "center",
      originY: "top",
      textAlign: "center",
      name: "leftChestText",
      scaleX: 1,
      scaleY: 1,
    });
    const youthText = new fabric.Text("Youth", {
      left: boxLeft + boxWidth / 2,
      top: boxTop + 300,
      width: boxWidth - 20,           // ✅ important for wrapping
      fontSize: 13,
      fontFamily: "Poppins",
      fill: warningColor || "#00F8E7FF",
      selectable: false,
      evented: false,
      visible: false,                  // ✅ visible for testing
      isSync: false,
      originX: "center",
      originY: "top",
      textAlign: "center",
      name: "youthText",
      scaleX: 1,
      scaleY: 1,
    });


    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop + 20;
    const centerY2 = boxTop + 20 + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });


    const canvasCenterX = canvas.getWidth() / 2;

    // Sync Y positions with main line
    const y1 = centerVerticalLine.y1 ?? 0;
    const y2 = centerVerticalLine.y2;

    // Create if not present

    const leftBorder = new fabric.Line([canvasCenterX - 2, y1, canvasCenterX - 2, y2], {
      stroke: '#005bff',
      strokeWidth: 1,
      // strokeDashArray: [2, 1],
      selectable: false,
      evented: false,
      name: 'centerVerticalLineLeftBorder',
      visible: false,
    });



    const rightBorder = new fabric.Line([canvasCenterX + 2, y1, canvasCenterX + 2, y2], {
      stroke: '#005bff',
      strokeWidth: 1,
      // strokeDashArray: [2, 1],
      selectable: false,
      evented: false,
      name: 'centerVerticalLineRightBorder',
      visible: false,
    });
    canvas.add(rightBorder);
    canvas.sendToBack(rightBorder);


    canvas.add(boundaryBox, centerVerticalLine);
    canvas.add(boundaryBoxLeft);
    canvas.add(adultText);
    canvas.add(youthText);
    canvas.add(leftChestText);
    canvas.add(boundaryBoxInner);
    canvas.add(leftBorder);
    canvas.add(warningText);
    // canvas.sendToBack(leftBorder);
    warningText.initDimensions();
    warningText.initDimensions();


    youthText.initDimensions();
    adultText.initDimensions();
    canvas.bringToFront(warningText);
    canvas.bringToFront(youthText);
    canvas.bringToFront(adultText);
    canvas.bringToFront(leftChestText)
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(boundaryBoxInner);
    canvas.bringToFront(boundaryBoxLeft);
    canvas.bringToFront(centerVerticalLine);



    // function updateBoundaryVisibility() {
    //   console.log("lal code....");
    //   const textObjects = canvas.getObjects().filter((obj) => obj.type === "curved-text");
    //   textObjects.forEach((obj) => obj.setCoords());

    //   const allInside = textObjects.every((obj) => {
    //     const objBounds = obj.getBoundingRect(true);
    //     const boxBounds = boundaryBox.getBoundingRect(true);

    //     return (
    //       objBounds.left >= boxBounds.left &&
    //       objBounds.top >= boxBounds.top &&
    //       objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
    //       objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
    //     );
    //   });

    //   boundaryBox.visible = !allInside;
    //   warningText.visible = !allInside;
    //   canvas.bringToFront(boundaryBox);
    //   canvas.bringToFront(warningText);
    //   canvas.requestRenderAll();
    // }

    const handleSelection = (e) => {
      removeAllHtmlControls();
      if (e.selected.length > 1) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      } else {
        setSelectedObject(e.selected[0]);
      }
      const active = e.selected?.[0];
      canvas.getObjects().forEach((obj) => {
        if (obj !== active && obj._htmlControls) {
          Object.values(obj._htmlControls).forEach((el) => el.remove());
          obj._htmlControls = null;
        }
      });
      canvas.requestRenderAll();
    };

    const handleSelectionCleared = () => {
      // setSelectedObject(null);
      removeAllHtmlControls();
      dispatch(setSelectedTextState(null));
    };




    // Consolidated handlers
    const handleObjectRemoved = (e) => {
      const removedObject = e.target;
      removeAllHtmlControls();
      syncMirrorCanvasHelper(activeSide);
      updateBoundaryVisibility(fabricCanvasRef);
      dispatch(deleteTextState(removedObject.id));
      dispatch(deleteImageState(removedObject.id));


    };
    const handleObjectAdded = (e) => {
      removeAllHtmlControls();
      syncMirrorCanvasHelper(activeSide);
    };

    const handleObjectModified = (e) => {
      updateBoundaryVisibility(fabricCanvasRef);
      syncMirrorCanvasHelper(activeSide);
      // handleScale(e);
    };

    const handleMoving = (e) => {
      // checkBoundary(e);
      const canvas = fabricCanvasRef.current;
      // if (!canvas) return;

      const objects = canvas.getObjects();

      boundaryBox.visible = true;
      warningText.visible = true;
      centerVerticalLine.visible = true;
      boundaryBoxInner.visible = true;
      boundaryBoxLeft.visible = true;
      if (leftChestText) leftChestText.visible = true;
      if (youthText) youthText.visible = true;
      if (adultText) adultText.visible = true;

      // Detect center collision
      const textObjects = objects.filter(
        (obj) => obj.type === "curved-text" || obj.type === "image"
      );

      let anyObjectAtCenter = false;

      textObjects.forEach((obj) => {
        obj.setCoords();

        const objCenterX = obj.getCenterPoint().x;
        const delta = Math.abs(objCenterX - canvasCenterX);

        if (delta <= 2) {
          anyObjectAtCenter = true;

          // Temporarily lock movement
          obj.lockMovementX = true;
          canvas.requestRenderAll();

          setTimeout(() => {
            obj.lockMovementX = false;
            canvas.requestRenderAll();
          }, 1000);
        }

        obj.setCoords();
      });

      // Show / hide the left / right borders
      // leftBorder.set({ visible: anyObjectAtCenter });
      // rightBorder.set({ visible: anyObjectAtCenter });

      // Change center line color if hitting center
      const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
      if (!centerVerticalLine.originalStroke) {
        centerVerticalLine.originalStroke = originalStroke;
      }

      centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);

      canvas.requestRenderAll();
    };

    // const handleMoving = (e) => {
    //   checkBoundary(e);
    //   const canvas = fabricCanvasRef.current;
    //   if (!canvas) return;

    //   const objects = canvas.getObjects();

    //   const boundaryBox = objects.find((obj) => obj.name === "boundaryBox");
    //   const boundaryBoxInner = objects.find((obj) => obj.name === "boundaryBoxInner");
    //   const boundaryBoxLeft = objects.find((obj) => obj.name === "boundaryBoxLeft");
    //   const centerVerticalLine = objects.find((obj) => obj.name === "centerVerticalLine");
    //   const warningText = objects.find((obj) => obj.name === "warningText");

    //   if (!boundaryBox || !warningText || !centerVerticalLine) return;

    //   boundaryBox.visible = true;
    //   warningText.visible = true;
    //   centerVerticalLine.visible = true;
    //   boundaryBoxInner.visible = true;
    //   boundaryBoxLeft.visible = true;

    //   const canvasCenterX = canvas.getWidth() / 2;
    //   const canvasHeight = canvas.getHeight();

    //   const y1 = centerVerticalLine.y1 ?? 0;
    //   const y2 = centerVerticalLine.y2 ?? canvasHeight;

    //   let leftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
    //   let rightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");

    //   // Create only once, and make invisible initially
    //   if (!leftBorder) {
    //     leftBorder = new fabric.Line([canvasCenterX - 2, y1, canvasCenterX - 2, y2], {
    //       stroke: 'limegreen',
    //       strokeWidth: 1,
    //       selectable: false,
    //       evented: false,
    //       visible: false,
    //       name: 'centerVerticalLineLeftBorder',
    //     });
    //     canvas.add(leftBorder);
    //     canvas.sendToBack(leftBorder);
    //   }

    //   if (!rightBorder) {
    //     rightBorder = new fabric.Line([canvasCenterX + 2, y1, canvasCenterX + 2, y2], {
    //       stroke: 'limegreen',
    //       strokeWidth: 1,
    //       selectable: false,
    //       evented: false,
    //       visible: false,
    //       name: 'centerVerticalLineRightBorder',
    //     });
    //     canvas.add(rightBorder);
    //     canvas.sendToBack(rightBorder);
    //   }

    //   const textObjects = objects.filter(
    //     (obj) => obj.type === "curved-text" || obj.type === "image"
    //   );

    //   let anyObjectAtCenter = false;

    //   textObjects.forEach((obj) => {
    //     obj.setCoords();

    //     const objCenterX = obj.getCenterPoint().x;
    //     const delta = Math.abs(objCenterX - canvasCenterX);

    //     if (delta <= 2) {
    //       anyObjectAtCenter = true;

    //       // Lock X movement temporarily
    //       obj.lockMovementX = true;
    //       canvas.requestRenderAll();

    //       setTimeout(() => {
    //         obj.lockMovementX = false;
    //         canvas.requestRenderAll();
    //       }, 1000);
    //     }
    //   });

    //   // Set visibility of left/right border lines
    //   leftBorder.visible = anyObjectAtCenter;
    //   rightBorder.visible = anyObjectAtCenter;

    //   // Handle center vertical line color
    //   const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
    //   if (!centerVerticalLine.originalStroke) {
    //     centerVerticalLine.originalStroke = originalStroke;
    //   }
    //   centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);

    //   canvas.requestRenderAll();
    // };

    const showBoundaryOnAction = () => {
      boundaryBox.visible = true;
      warningText.visible = true;
      centerVerticalLine.visible = true;
      boundaryBoxInner.visible = true;
      boundaryBoxLeft.visible = true;
      if (leftChestText) leftChestText.visible = true;
      if (youthText) youthText.visible = true;
      if (adultText) adultText.visible = true;

    }



    const events = [
      ["object:added", handleObjectAdded],
      ["object:removed", handleObjectRemoved],
      ["object:modified", handleObjectModified],
      ["object:moving", handleMoving],
      ["object:scaling", showBoundaryOnAction],
      ["object:rotating", showBoundaryOnAction],
      ["selection:created", handleSelection],
      ["selection:updated", handleSelection],
      ["selection:cleared", handleSelectionCleared],
      ["editing:exited", updateBoundaryVisibility],
      ["text:cut", updateBoundaryVisibility],
      ["text:changed", handleObjectAdded],

      // ["object:moving", moveHandler], // Uncomment if needed
    ];
    // canvas.on("selection:created", (e) => {
    //   const active = e.selected?.[0];
    //   canvas.getObjects().forEach((obj) => {
    //     if (obj !== active && obj._htmlControls) {
    //       Object.values(obj._htmlControls).forEach((el) => el.remove());
    //       obj._htmlControls = null;
    //     }
    //   });
    //   canvas.requestRenderAll(); // force re-render to show controls on new selection
    // });

    // canvas.on("selection:updated", (e) => {
    //   const active = e.selected?.[0];
    //   canvas.getObjects().forEach((obj) => {
    //     if (obj !== active && obj._htmlControls) {
    //       Object.values(obj._htmlControls).forEach((el) => el.remove());
    //       obj._htmlControls = null;
    //     }
    //   });
    //   canvas.requestRenderAll();
    // });



    events.forEach(([event, handler]) => canvas.on(event, handler));

    if (backgroundImage) {
      fabric.Image.fromURL(
        backgroundImage,
        (img) => {
          const imgWidth = img.width;
          const imgHeight = img.height;

          // Calculate scale based on the parent container size
          const scaleX = 590 / imgWidth;
          const scaleY = 450 / imgHeight;

          // Apply the scale to ensure the image fits within the canvas while maintaining aspect ratio
          const scale = Math.max(scaleX, scaleY);

          img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: "center",
            originY: "center",
            scaleX: scaleX,
            scaleY: scaleY,
            selectable: false,
            evented: false,
          });

          canvas.setBackgroundImage(img, () => {
            fabricCanvasRef.current.renderAll();
          });
          syncMirrorCanvasHelper(activeSide);
          updateBoundaryVisibility(fabricCanvasRef);
        },
        { crossOrigin: "anonymous" }
      );
    }
    // renderCurveTextObjects();
    renderCurveTextObjectsHelper();
    renderNameAndNumberHelper(); //note : we have to call it for render object after canvas initialize
    renderAllImageObjectsHelper();
    //want to do same for image 

    return () => {
      removeAllHtmlControls();
      // Remove all listeners
      events.forEach(([event, handler]) => canvas.off(event, handler));

      // Dispose of the canvas to prevent memory leaks
      canvas.dispose();
      fabricCanvasRef.current = null;
      // mirrorCanvasRef.current.dispose();
      // mirrorCanvasRef.current = null;
    };
  }, [iconImages, id, backgroundImage, activeSide]);


  useEffect(() => {
    updateBoundaryVisibility(fabricCanvasRef);
  }, [addName, addNumber, nameAndNumberDesignState, textContaintObject]);

  // **********************************************************************************************************************************************************
  //                                                                                    TEXT OBJECTS AREA
  // **********************************************************************************************************************************************************

  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvasRef.current) {
        console.log("repostioning......................")
        fabricCanvasRef.current.requestRenderAll(); // this will reposition all controls
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeSide]);
  useEffect(() => {
    // console.log("renderiing on layer index changed");
    // renderCurveTextObjects();
    // ontrolContext({
    //   iconImages,
    //   textContaintObject,
    //   imageContaintObject,
    //   navigate,
    //   dispatch,
    // });
  }, [activeSide, isRender, dispatch, id, textContaintObject, imageContaintObject]);

  // **********************************************************************************************************************************************************
  //                                                                                    IMAGE OBJECTS AREA
  // **********************************************************************************************************************************************************

  useEffect(() => {
    // renderAllImageObjects();
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
        removeAllHtmlControls();
        canvas.remove(obj);
      }
      if (
        obj.type === 'image' &&
        (!imageContaintObject || !imageContaintObject.some(i => i.id === obj.id))
      ) {
        removeAllHtmlControls();
        canvas.remove(obj);
      }
    });

    // Render text objects
    if (textContaintObject && textContaintObject.length > 0) {
      // renderCurveTextObjects();
      renderCurveTextObjects(
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

      )
    }

    // Render image objects
    if (imageContaintObject && imageContaintObject.length > 0) {
      // renderAllImageObjects();
      renderAllImageObjectsHelper();
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
    updateBoundaryVisibility?.(fabricCanvasRef);
  };
  // **********************************************************************************************************************************************************
  //                                                                                    NAME AND NUMBER OBJECTS AREA
  // **********************************************************************************************************************************************************

  useEffect(() => {
    const loadAndRender = async () => {
      if (nameAndNumberDesignState?.fontFamily) {
        await loadFont(nameAndNumberDesignState.fontFamily);
      }
      renderNameAndNumberHelper();
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
        removeAllHtmlControls();
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
    <div class="canvas-wrapper" style={{ position: "relative", top: 5 }} >
      <canvas ref={canvasRef} id="canvas" />
      <LayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLayerAction={handleLayerAction}
        fabricCanvas={fabricCanvasRef.current}
      />
      {/* <div class="tenor-gif-embed" data-postid="6449096453315144907" data-share-method="host" data-aspect-ratio="0.991667" data-width="100%" style={{ zIndex: 9999999, position: "absolute", top: "50%", left: "50%" }}>
        <a href="https://tenor.com/view/loading-gif-6449096453315144907">Loading Sticker</a>from <a href="https://tenor.com/search/loading-stickers"
        >Loading Stickers</a></div> */}
      {/* <img src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif" height={200} width={200} style={{ zIndex: 9999999, position: "absolute", top: "50%", left: "50%" }}></img> */}
      {/* <!-- index.html or in React root --> */}




    </div>
  );
};
export default MainDesignTool;