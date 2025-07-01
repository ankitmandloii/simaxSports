import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { fabric } from "fabric";
import icons from "../../data/icons";
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
import { initControlContext, createControls } from "./utils/customControls";

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
    syncMirrorCanvasHelper(activeSide);
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
    updateBoundaryVisibility(fabricCanvasRef);
  }, [addName, addNumber, nameAndNumberDesignState, textContaintObject]);

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
      fontFamily: "Roboto-Regular",
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
      syncMirrorCanvasHelper(activeSide);
      updateBoundaryVisibility(fabricCanvasRef);
    };

    const handleObjectModified = (e) => {
      updateBoundaryVisibility(fabricCanvasRef);
      syncMirrorCanvasHelper(activeSide);
      // handleScale(e);
    };

    const handleMoving = (e) => {
      checkBoundary(e);
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      console.log("babu code....");

      const boundaryBox = canvas
        .getObjects()
        .find((obj) => obj.type === "rect" && !obj.selectable); // identify your boundary box
      const warningText = canvas
        .getObjects()
        .find(
          (obj) =>
            obj.type === "text" && obj.text === "Please keep design inside the box"
        );
      boundaryBox.visible = true;
      warningText.visible = true;

      // updateBoundaryVisibility(fabricCanvasRef);
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
          syncMirrorCanvasHelper(activeSide);
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

  useEffect(() => {
    // console.log("renderiing on layer index changed");
    // renderCurveTextObjects();
    initControlContext({
      iconImages,
      textContaintObject,
      imageContaintObject,
      navigate,
      dispatch,
    });
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
