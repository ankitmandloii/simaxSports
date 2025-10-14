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
import EditWithAipopup from "../PopupComponent/EditWithAipopup/EditWithAipopup"
import { useMediaQuery } from 'react-responsive';


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
import { useLocation, useNavigate } from "react-router-dom";
import LayerModal from "../CommonComponent/layerComponent/layerComponent";
import CurvedText from "../fabric/fabric.TextCurved"; // Adjust path if needed
import syncMirrorCanvas from "./core/syncMirrorCanvas";
import { createControls } from "./utils/customControls";
import { markDesignButtonClicked, setHoveredRoute } from "../../redux/ProductSlice/HoverSlice";
import { AddArtIcon, AddProductIcon, NumberArtIcon, SelectArtIcon } from "../iconsSvg/CustomIcon";
import { CgNotes } from "react-icons/cg";
import DesignNotesPopup from "../PopupComponent/DesignNotesPopup/DesignNotesPopup";
import { setCanvasDimensions } from "../../redux/FrontendDesign/CanvasStoreSlice";
import createWarningForSweatShirt from "./warningBoundaries.jsx/createWarningForSweatShirt";
import createWarningForT_shirt from "./warningBoundaries.jsx/createWarningForT_shirt";
import createWarningForBoxy from "./warningBoundaries.jsx/createWarningForBoxy";
import createWarningForhoodie from "./warningBoundaries.jsx/createWarningForhoodie";
import createWarningForZip from "./warningBoundaries.jsx/createWarningForZip";
import createWarningForTankTop from "./warningBoundaries.jsx/createWarningForTankTop";
import createWarningForPolo from "./warningBoundaries.jsx/createWarningForPolo";
import { getProductSleeveType, getProductType, showBoundaryOnAction } from "./HelpersFunctions/editorHelpers";
import { removeAllHtmlControls } from "./HelpersFunctions/renderImageHelpers";
fabric.CurvedText = CurvedText;
const WarningFunctionMap = {
  "Zip": createWarningForZip,
  "Jacket": createWarningForZip, // Maps to the same function as "Zip"
  "Polo": createWarningForPolo,
  "Hoodie": createWarningForhoodie,
  "Hooded Sweatshirt": createWarningForhoodie, // Maps to the same function as "Hoodie"
  "Tank": createWarningForTankTop,
  "Boxy": createWarningForBoxy,
  "T-shirt": createWarningForT_shirt,
  "Tee": createWarningForT_shirt, // Maps to the same function as "T-shirt"
  "Sweatshirt": createWarningForSweatShirt,
};

const MainDesignTool = ({
  id,
  backgroundImage,
  zoomLevel,
  setFrontPreviewImage,
  setBackPreviewImage,
  setLeftSleevePreviewImage,
  setRightSleevePreviewImage,
  setPreviewForCurrentSide,
  activeProductTitle,
  isZoomedIn
}) => {
  const warningColor = "skyblue"

  // **********************************************************************************************************************************************************
  //                                                                                    USE SELECTORS AREA
  // **********************************************************************************************************************************************************
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
  const { addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);
  const nameAndNumberDesignState = useSelector((state) => state.TextFrontendDesignSlice.nameAndNumberDesignState)
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice?.present[activeSide]?.selectedImageId);
  const imageContaintObject = useSelector((state) => state.TextFrontendDesignSlice?.present[activeSide]?.images);
  const textContaintObject = useSelector((state) => state.TextFrontendDesignSlice?.present[activeSide]?.texts);
  const isRender = useSelector((state) => state.TextFrontendDesignSlice?.present[activeSide]?.setRendering);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice?.present[activeSide]?.selectedTextId);
  const loadingState = useSelector(state => state.TextFrontendDesignSlice?.present[activeSide]?.loadingState);
  const { data: settings } = useSelector((state) => state.settingsReducer);
  const allImageData = useSelector((state) => state.TextFrontendDesignSlice?.present[activeSide]?.images);
  const currentImageObject = allImageData?.find((img) => img.id == selectedImageId);


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
  const [resize, setResize] = useState(0);
  const [productCategory, setProductCategory] = useState(getProductType(activeProductTitle))
  const [showNotes, setShowNotes] = useState(false);
  const [openAieditorPopup, setOpenAieditorPopup] = useState(false);
  const [size, setSize] = useState();
  const [Sleeve, setSleeve] = useState(getProductSleeveType(activeProductTitle));

  // **********************************************************************************************************************************************************
  //                                                                                    USE DISPTACHS AREA
  // **********************************************************************************************************************************************************
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity" || location.pathname === '/review';


  // **********************************************************************************************************************************************************
  //                                                                                    USE MEMO AREA
  // **********************************************************************************************************************************************************
  const handleClose = () => {
    setShowNotes(false)
  }
  const handleHover = (path) => dispatch(setHoveredRoute(path));
  const handleLeave = () => dispatch(setHoveredRoute(null));
  const handleClick = (path) => {
    dispatch(setHoveredRoute(null));
    dispatch(markDesignButtonClicked(activeSide));// Clear hovered state
    // Your existing navigation logic, e.g., using useNavigate
    navigate(path); // Assuming you're using react-router-dom's navigate
  };
  const hasClickedMap = useSelector((state) => state?.hoverReducer.hasClickedDesignButton);
  const hasClicked = hasClickedMap?.[activeSide];

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
    // return;
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
    const productCategory = getProductType(activeProductTitle);
    const globalDispatch = (lable, value, id) => {
      dispatch(
        updateTextState({
          "id": id,
          changes: { [lable]: value },
        })
      );
    };
    renderCurveTextObjects(
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
      isZoomedIn
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
      bringPopup,
      getProductType(activeProductTitle),
      activeNameAndNumberPrintSide,
      isZoomedIn
    );
  }
  const renderAllImageObjectsHelper = (openAieditorPopup, setOpenAieditorPopup) => {
    const globalDispatch = (lable, value, id) => {
      dispatch(
        updateImageState({
          "id": id,
          changes: { [lable]: value },
        })
      );
    };
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
      bringPopup,
      getProductType(activeProductTitle),
      openAieditorPopup,
      setOpenAieditorPopup,
      isZoomedIn,
      currentImageObject
    )
  }
  // useEffect(() => {

  // }, [openAieditorPopup])

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

    dispatch(updateImageState({
      id: obj.id,
      changes: {
        scaleX: parseFloat(relativeScaleX.toFixed(2)),
        scaleY: parseFloat(relativeScaleY.toFixed(2)),
        scaledValue: parseFloat(((relativeScaleX + relativeScaleY) / 2).toFixed(2))
      }

    }));

    // globalDispatch("scaleX", parseFloat(relativeScaleX.toFixed(2)), obj.id);
    // globalDispatch("scaleY", parseFloat(relativeScaleY.toFixed(2)), obj.id);
    // globalDispatch("scaledValue", parseFloat(((relativeScaleX + relativeScaleY) / 2).toFixed(2)), obj.id);

    canvas?.renderAll();
    syncMirrorCanvasHelper(activeSide);
  };



  // **********************************************************************************************************************************************************
  //                                                                                    USE EFFECTS 
  // **********************************************************************************************************************************************************
  useEffect(() => {

    // console.log("loading reduxt is ", loadingState)
    setLoading(loadingState?.loading);
    // console.log("loading state is ", loading)
  }, [loadingState])

  // useEffect(() => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) return;
  //   const path = window.location.pathname;
  //   if (path !== '/design/addImage' && path !== '/design/addText') {
  //     canvas.discardActiveObject();
  //     canvas.requestRenderAll();

  //   }
  // }, [window.location.pathname])
  // console.log("---------------",window.location.pathname=='/quantity'|| '/review')
  // console.log("---------------", window.location.pathname)

  //   useEffect(() => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) return;

  //   const validPaths = ['/quantity', '/review'];
  //   const currentPath = window.location.pathname;

  //   if (validPaths.includes(currentPath)) {
  //     canvas.discardActiveObject();
  //     canvas.requestRenderAll(); // optional, to ensure visual update
  //   }
  // }, [window.location.pathname]);


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

  // useEffect(() => {
  //   const canvas = fabricCanvasRef.current;
  //   if (canvas && canvas.setZoom) {
  //     // Get canvas center point (in pixels)
  //     //     const center = new fabric.Point(canvas.width / 2, canvas.height / 2);

  //     //     // Zoom relative to center point
  //     //     canvas.zoomToPoint(center, zoom);
  //     const zoom = zoomLevel;  // Zoom level toggles between 1 and 1.4

  //     const backgroundImage = canvas.backgroundImage;
  //     // console.log("backgroundImage", backgroundImage);

  //     if (backgroundImage) {
  //       // Calculate the new scale based on the zoom level
  //       let newScale = backgroundImage.scaleX * zoom;

  //       // console.log("zoom", zoom)

  //       if (zoom == 1) {
  //         // Calculate scale factors based on canvas size and background image size
  //         const imgWidth = backgroundImage.width;
  //         const imgHeight = backgroundImage.height;
  //         const canvasWidth = canvas.getWidth();
  //         const canvasHeight = canvas.getHeight();

  //         // Calculate scale to fit the image inside the canvas while maintaining aspect ratio
  //         const scaleX = (canvasWidth - 130) / imgWidth;
  //         const scaleY = (canvasHeight - 130) / imgHeight;

  //         // Choose the maximum of the two scale values to preserve aspect ratio
  //         newScale = Math.max(scaleX, scaleY);
  //         // console.log("new scale ", newScale);
  //       }

  //       // Ensure the background image properties are updated correctly
  //       backgroundImage.set({
  //         scaleX: newScale,
  //         scaleY: newScale
  //       });

  //       // Re-set the background image to update the canvas background
  //       canvas.setBackgroundImage(backgroundImage, () => {
  //         canvas.renderAll();  // Explicitly re-render the canvas
  //       });

  //       // console.log("Updated background image scale:", newScale);
  //     }
  //   }
  // }, [zoomLevel]);  // Trigger effect when zoomLevel changes

  // function removeAllHtmlControls(canvas) {
  //   // return
  //   if (!canvas) {
  //     canvas = fabricCanvasRef.current;
  //   }
  //   canvas.getObjects().forEach((obj) => {
  //     if (obj._htmlControls) {
  //       for (const key in obj._htmlControls) {
  //         const el = obj._htmlControls[key];
  //         if (el?.parentNode) el.parentNode.removeChild(el);
  //       }
  //       obj._htmlControls = null;
  //     }
  //   });

  //   // Safety net: also remove floating orphan controls (edge case fallback)
  //   document.querySelectorAll('[data-fabric-control]').forEach(el => el.remove());
  // }
  useEffect(() => {
    const canvasElement = canvasRef.current;
    const wrapperElement = canvasElement.parentNode;

    const canvasWidth = wrapperElement.clientWidth;
    const canvasHeight = wrapperElement.clientHeight;
    if (canvasWidth !== 0 && canvasHeight !== 0) {

      dispatch(setCanvasDimensions({ width: canvasWidth, height: canvasHeight }));

    }

    // console.log("canvasWidth canvasHeight", canvasWidth, canvasHeight)

    const canvas = new fabric.Canvas(canvasElement, {
      width: canvasWidth,
      height: canvasHeight,
      // backgroundColor: "red",
      perPixelTargetFind: false,
      targetFindTolerance: 4,
      preserveObjectStacking: true,
      // 

    });
    canvas.preserveObjectStacking = true;
    fabricCanvasRef.current = canvas;

    const warningOptions = {
      canvasWidth,
      canvasHeight,
      canvas,
      warningColor,
      activeSide,
      getProductSleeveType,
      activeProductTitle,
      fabric
    };

    const productType = getProductType(activeProductTitle);
    const warningFunction = WarningFunctionMap[productType];

    // 4. Execute the function if it exists
    if (warningFunction) {
      warningFunction(warningOptions);
    }
    canvas.requestRenderAll();

    const handleSelection = (e) => {
      // removeAllHtmlControls(canvas);
      if (e.selected.length > 1) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      } else {
        setSelectedObject(e.selected[0]);
      }
      // const active = e.selected?.[0];
      // canvas.getObjects().forEach((obj) => {
      //   if (obj !== active && obj._htmlControls) {
      //     Object.values(obj._htmlControls).forEach((el) => el.remove());
      //     obj._htmlControls = null;
      //   }
      // });
      // canvas.requestRenderAll();
    };

    const handleSelectionCleared = () => {
      // setSelectedObject(null);

      removeAllHtmlControls(canvas);
      dispatch(setSelectedTextState(null));
      // navigate("/design/product")
    };




    // Consolidated handlers
    const handleObjectRemoved = (e) => {
      // console.warn("removedObject................", e.target)
      const removedObject = e.target;
      // removeAllHtmlControls(canvas);
      syncMirrorCanvasHelper(activeSide);
      updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));
      // dispatch(deleteTextState(removedObject.id));
      // dispatch(deleteImageState(removedObject.id));


    };
    const handleObjectAdded = (e) => {
      // removeAllHtmlControls(canvas);
      syncMirrorCanvasHelper(activeSide);
    };

    const handleObjectModified = (e) => {
      updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));
      syncMirrorCanvasHelper(activeSide);
      // handleScale(e);
    };



    const eventHandlers = {
      "object:added": handleObjectAdded,
      "object:removed": handleObjectRemoved,
      "object:modified": handleObjectModified,
      // These three handlers need the extra context variables:
      "object:moving": showBoundaryOnAction,
      "object:scaling": showBoundaryOnAction,
      "object:rotating": showBoundaryOnAction,
      "selection:created": handleSelection,
      "selection:updated": handleSelection,
      "selection:cleared": handleSelectionCleared,
      "editing:exited": updateBoundaryVisibility,
      "text:cut": updateBoundaryVisibility,
      "text:changed": handleObjectAdded,
      // "object:moving": moveHandler,
    };

    // 2. Define a Set of handler functions that require the extra context variables.
    const HANDLERS_NEEDING_CONTEXT = new Set([
      showBoundaryOnAction
    ]);


    // 3. Iterate over the event handlers and register them.
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (HANDLERS_NEEDING_CONTEXT.has(handler)) {
        // If the handler needs context, wrap it in an arrow function to pass 
        // the event object (e) plus the required context variables from the closure scope.
        canvas.on(event, (e) => {
          handler(e, fabricCanvasRef, activeProductTitle, activeSide);
        });
      } else {
        // Otherwise, register the handler directly (it only receives the Fabric.js event object 'e').
        canvas.on(event, handler);
      }
    });

    if (backgroundImage) {
      fabric.Image.fromURL(
        backgroundImage,
        (img) => {
          const imgWidth = img.width;
          const imgHeight = img.height;

          // Calculate scale based on the parent container size
          const scaleX = (canvasWidth - 130) / imgWidth;
          const scaleY = (canvasHeight - 130) / imgHeight;
          // const scaleX = (canvasWidth ) / imgWidth;
          // const scaleY = (canvasHeight) / imgHeight;

          // Apply the scale to ensure the image fits within the canvas while maintaining aspect ratio
          const scale = Math.max(scaleX, scaleY);

          img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2 - 25,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
          });

          canvas.setBackgroundImage(img, () => {
            fabricCanvasRef.current.renderAll();
          });
          // canvas.add(img);
          // canvas.bringToFront(img);
          syncMirrorCanvasHelper(activeSide);
          updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));
        },
        { crossOrigin: "anonymous" }
      );
    }
    // renderCurveTextObjects();
    renderCurveTextObjectsHelper();
    renderNameAndNumberHelper(); //note : we have to call it for render object after canvas initialize
    renderAllImageObjectsHelper(openAieditorPopup, setOpenAieditorPopup);
    //want to do same for image 
    // window.addEventListener("resize", (e) => {
    //   setResize(Math.random());
    // })
    return () => {
      // window.removeEventListener("resize", () => { });
      removeAllHtmlControls(canvas);
      setOpenAieditorPopup(false);
      // Remove all listeners
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        canvas.off(event, handler);
      });
      // events.forEach(([event, handler]) => canvas.off(event, handler));
      const btn = document.getElementById(`canvas-${id}-ai`);
      if (btn) {
        btn.removeEventListener("click", () => {
          // console.log("event removed");
        })
      }
      // Dispose of the canvas to prevent memory leaks
      canvas.dispose()
      // fabricCanvasRef.current = null;
      // mirrorCanvasRef.current.dispose();
      // mirrorCanvasRef.current = null;
    };
  }, [id, backgroundImage, activeSide, size]);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
  useEffect(() => {
    const handleResize = () => {
      // console.log("resizing......................", window.innerWidth);
      setSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

    };
  }, []);

  useEffect(() => {
    // 1. Get the target element directly (it should exist after the initial render)
    const targetElement = document.querySelector(".canvas-wrapper");

    // 2. CRITICAL CHECKS: Ensure the element exists and we aren't on mobile (if condition requires it)
    if (!targetElement) {
      // console.log("resize observer return (element not found or mobile mode)");
      return;
    }

    // 3. Define the observer callback
    const observerCallback = (entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;

        // CORRECT LOGIC: Calculate the size as the MINIMUM of width and height 
        // to ensure the square fits inside the available space.
        const newSize = Math.random() * 1000; // Math.min(width, height);

        // Set the new size state
        setSize(newSize);
        // console.log(`New square size set: ${newSize}`);
      }
    };

    // 4. Create and start observing
    const resizeObserver = new ResizeObserver(observerCallback);
    resizeObserver.observe(targetElement);

    // 5. Cleanup function: runs when the component unmounts or dependencies change
    return () => {
      resizeObserver.unobserve(targetElement);
      // console.log("ResizeObserver unobserved/cleaned up.");
    };

    // Removed canvasRef and fabricCanvasRef from dependencies, as they don't cause the observer to need re-initialization.
    // Kept isTabletOrMobile as it affects the logic.
  }, [isTabletOrMobile])


  useEffect(() => {
    updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));
  }, [addName, addNumber, nameAndNumberDesignState, textContaintObject, imageContaintObject]);

  // **********************************************************************************************************************************************************
  //                                                                                    TEXT OBJECTS AREA
  // **********************************************************************************************************************************************************

  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvasRef.current) {
        // console.log("repostioning......................")
        // fabricCanvasRef.current.requestRenderAll(); // this will reposition all controls
      }
    };

    window.addEventListener("resize", handleResize);

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
  }, [imageContaintObject, textContaintObject, activeSide, isRender, isZoomedIn]); // 👈 Reacts to previewUrl change

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
        // removeAllHtmlControls(canvas);
        canvas.remove(obj);
      }
      if (
        obj.type === 'image' &&
        (!imageContaintObject || !imageContaintObject.some(i => i.id === obj.id))
      ) {
        // removeAllHtmlControls(canvas);
        canvas.remove(obj);
      }
    });

    // Render text objects
    if (textContaintObject && textContaintObject.length > 0) {
      renderCurveTextObjectsHelper();
    }

    // Render image objects
    if (imageContaintObject && imageContaintObject.length > 0) {
      renderAllImageObjectsHelper(openAieditorPopup, setOpenAieditorPopup);
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
    updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));

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
  }, [isZoomedIn, addName, addNumber, nameAndNumberDesignState, activeSide, activeNameAndNumberPrintSide]);

  useEffect(() => {
    const sleeveType = getProductSleeveType(activeProductTitle);
    setSleeve(sleeveType);
  }, [activeProductTitle]);



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
        // removeAllHtmlControls(canvas);
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
  }, [selectedTextId, isRender,])


  function getLeft(canvasRef) {
    const canvasElement = canvasRef?.current;
    const rect = canvasElement?.getBoundingClientRect();
    const centerX = rect?.width / 2.5;
    const centerY = rect?.height / 4;
    return `${centerX}px`;
  }
  function getTop(canvasRef) {
    const canvasElement = canvasRef?.current;
    const rect = canvasElement?.getBoundingClientRect();
    const centerX = rect?.width / 3;
    const centerY = rect?.height / 3;
    return `${centerY}px`;
  }
  // console.log("first", hasClicked, "s", addName, "s", addNumber, "s", imageContaintObject, "s", textContaintObject)

  return (
    <div className="canvas-wrapper" data-canvasparent="canvasParent" style={{ position: "relative", top: 5 }} >



      <canvas ref={canvasRef} id={`canvas-${id}`} />
      {!hasClicked && !addName && !addNumber &&
        imageContaintObject?.length == 0 &&
        textContaintObject?.length == 0 && (
          <div className={style.buttonsroute}  >
            {settings?.settingsForTextSection?.sideBarTextSection && (

              <button
                onMouseEnter={() => handleHover("/design/addText")}
                onMouseLeave={handleLeave}
                onClick={() => handleClick("/design/addText")}
                className={style.canvaButton}
              >
                <span className={style.icon}><AddProductIcon /></span> Add Text
              </button>
            )}


            {settings?.uploadSettings?.sideBarImageUploadSection && (
              <button
                onMouseEnter={() => handleHover("/design/uploadArt")}
                onMouseLeave={handleLeave}
                onClick={() => handleClick("/design/uploadArt")}
                className={style.canvaButton}
              >
                <span className={style.icon}><AddArtIcon /></span> Upload Art
              </button>

            )}

            {settings?.settingsforAddArtSection?.sideBarAddArtSection && (
              <button
                onMouseEnter={() => handleHover("/design/addArt")}
                onMouseLeave={handleLeave}
                onClick={() => handleClick("/design/addArt")}
                className={style.canvaButton}
              >
                <span className={style.icon}><SelectArtIcon /></span> Add Art
              </button>
            )}
            {settings?.settingsforAddNamesAndNumbers?.sideBarAddNamesAndNumbersSection && (
              <>
                {activeSide === "back" && (
                  <button
                    onMouseEnter={() => handleHover("/design/addNames")}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick("/design/addNames")}
                    className={style.canvaButton}
                  >
                    <span className={style.icon}><NumberArtIcon /></span> Add Number
                  </button>
                )}
              </>
            )
            }

          </div>
        )
      }

      {/* {(hasClicked || addName || addNumber || imageContaintObject.length > 0 || textContaintObject.length > 0 || !isQuantityPage) && (
        <div className={style.notesroute}>
          <button
            // onMouseEnter={() => handleHover("/design/addNotes")}
            // onMouseLeave={handleLeave}
            onClick={() => setShowNotes(true)}
            className={style.canvaButton}
          >
            <span className={style.icon}><CgNotes /></span> Add Notes
          </button>
        </div>
      )} */}
      {
        !isQuantityPage && (hasClicked || addName || addNumber || imageContaintObject.length > 0 || textContaintObject.length > 0) && (
          <div className={style.notesroute}>
            <button
              onClick={() => setShowNotes(true)}
              className={style.AddNotesButton}
            >
              <span className={style.icon}><CgNotes /></span> Add Notes
            </button>
          </div>
        )
      }

      <LayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLayerAction={handleLayerAction}
        fabricCanvas={fabricCanvasRef.current}
        Sleeve={Sleeve}
      />
      {
        openAieditorPopup && <EditWithAipopup onClose={() => {
          setOpenAieditorPopup(false);
        }}></EditWithAipopup>
      }

      {showNotes && <DesignNotesPopup handleClose={handleClose} />}






    </div>
  );



};


export default MainDesignTool;