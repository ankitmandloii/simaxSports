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
fabric.CurvedText = CurvedText;
const MainDesignTool = ({

  id,
  backgroundImage,
  zoomLevel,
  setFrontPreviewImage,
  setBackPreviewImage,
  setLeftSleevePreviewImage,
  setRightSleevePreviewImage,
  setPreviewForCurrentSide,
  activeProductTitle
}) => {
  const warningColor = "skyblue"

  // **********************************************************************************************************************************************************
  //                                                                                    USE SELECTORS AREA
  // **********************************************************************************************************************************************************
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
  // const addName  = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].addName);
  // const  addNumber = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].addNumber);
  const { addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);
  // const { addName, addNumber } = useSelector(
  //   (state) => ({
  //     addName: state.TextFrontendDesignSlice.present[activeSide]?.addName || false,
  //     addNumber: state.TextFrontendDesignSlice.present[activeSide]?.addNumber || false,
  //   })
  // );

  // console.log("--------------------------namenumber",addName,addNumber)
  const nameAndNumberDesignState = useSelector((state) => state.TextFrontendDesignSlice.nameAndNumberDesignState)
  // console.log("--------------namesssDesign",nameAndNumberDesignState)
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const imageContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
  const textContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);

  const isRender = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].setRendering);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId);
  const loadingState = useSelector(state => state.TextFrontendDesignSlice.present[activeSide].loadingState);
  const { data: settings } = useSelector((state) => state.settingsReducer);
  // console.log("-------settings", settings)

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
  const [resize, setResize] = useState(0);
  const [productCategory, setProductCategory] = useState(getProductType(activeProductTitle))
  const [showNotes, setShowNotes] = useState(false);
  const [openAieditorPopup, setOpenAieditorPopup] = useState(false);
  const [size, setSize] = useState();
  // console.log(openAieditorPopup);
  // **********************************************************************************************************************************************************
  //                                                                                    USE DISPTACHS AREA
  // **********************************************************************************************************************************************************
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isQuantityPage = location.pathname === "/quantity" || location.pathname === '/review';
  // console.log("---------------------checkqty", isQuantityPage)


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
  // for route buttons
  const handleClose = () => {
    setShowNotes(false)
  }
  const handleHover = (path) => dispatch(setHoveredRoute(path));
  const handleLeave = () => dispatch(setHoveredRoute(null));
  // const handleClick = (route) => {
  //   dispatch(markDesignButtonClicked(activeSide)); // pass current side
  //   setTimeout(() => navigate(route), 50); // slight delay to allow re-render
  // };
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
  // Function to detect ProductTye
  function getProductType(title) {

    const keywords = [
      "Boxy",
      "Zip",
      "T-shirt",
      "Hoodie",
      "Women's Sweatshirt",
      "Unisex Sweatshirt",
      "Hooded Sweatshirt",
      "Pullover Hoodie",
      "Polo",
      "Zip(?: Pullover)?", // handles both "Zip" and "Zip Pullover"
      "Tee",
      "Jacket",
      "Long Sleeve",
      "Sweatshirt",
      "Tank",
      "Sleeveless",
    ];

    const lowerTitle = title?.toLowerCase();

    for (let key of keywords) {
      const regex = new RegExp(`\\b${key}\\b`, "i"); // \b ensures whole word match
      if (regex.test(title)) {
        return key;
      }
    }

    return "Unknown";
  }
  function getProductSleeveType(title) {

    const keywords = [
      "Sleeveless",
      "Long Sleeve",
      // "T-shirt",
      // "Hoodie",
      // "Women's Sweatshirt",
      // "Unisex Sweatshirt",
      // "Hooded Sweatshirt",
      // "Pullover Hoodie",
      // "Polo",
      // "Zip(?: Pullover)?", // handles both "Zip" and "Zip Pullover"
      // "Tee",
      // "Jacket",
      // "Sweatshirt",
      // "Tank"
    ];

    const lowerTitle = title?.toLowerCase();

    for (let key of keywords) {
      const regex = new RegExp(`\\b${key}\\b`, "i"); // \b ensures whole word match
      if (regex.test(title)) {
        return key;
      }
    }

    return "Unknown";
  }
  // function getProductType(title) {
  //   const keywords = [
  //     "Unisex",
  //     "Women's",
  //     "Men's",
  //     "Hooded",
  //     "Hoodie",
  //     "Sweatshirt",
  //     "T-shirt",
  //     "Long Sleeve",
  //     "Sleeveless",
  //     "Tee",
  //     "Tank",
  //     "Polo",
  //     "Jacket",
  //     "Zip",
  //   ];

  //   // Normalize curly quotes to straight quotes
  //   const normalizeQuotes = (str) =>
  //     str.replace(/[\u2018\u2019\u201A\u201B]/g, "'") // curly single quotes → '
  //       .replace(/[\u201C\u201D\u201E\u201F]/g, '"'); // curly double quotes → "

  //   const lowerTitle = normalizeQuotes(title?.toLowerCase());
  //   const matchedKeywords = [];

  //   for (let keyword of keywords) {
  //     const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "i");
  //     if (regex.test(lowerTitle)) {
  //       matchedKeywords.push(keyword);
  //     }
  //   }

  //   return matchedKeywords.length ? matchedKeywords.join(" ") : "Unknown";
  // }


  // console.log("--------activeTitle", getProductType(activeProductTitle));


  // ---

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
      bringPopup,
      productCategory

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
      activeNameAndNumberPrintSide
    );
  }
  const renderAllImageObjectsHelper = (openAieditorPopup, setOpenAieditorPopup) => {
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
      setOpenAieditorPopup
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

    // console.log("loading reduxt is ", loadingState)
    setLoading(loadingState?.loading);
    // console.log("loading state is ", loading)
  }, [loadingState])

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const path = window.location.pathname;
    if (path !== '/design/addImage' && path !== '/design/addText') {
      canvas.discardActiveObject();
      canvas.requestRenderAll();

    }
  }, [window.location.pathname])
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


  // useEffect(() => {
  //   const canvas = fabricCanvasRef.current;
  //   if (canvas && canvas.setZoom) {
  //     const zoom = zoomLevel;

  //     // Get canvas center point (in pixels)
  //     const center = new fabric.Point(canvas.width / 2, canvas.height / 2);

  //     // Zoom relative to center point
  //     canvas.zoomToPoint(center, zoom);
  //   }
  // }, [zoomLevel]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && canvas.setZoom) {
      // Get canvas center point (in pixels)
      //     const center = new fabric.Point(canvas.width / 2, canvas.height / 2);

      //     // Zoom relative to center point
      //     canvas.zoomToPoint(center, zoom);
      const zoom = zoomLevel;  // Zoom level toggles between 1 and 1.4

      const backgroundImage = canvas.backgroundImage;
      // console.log("backgroundImage", backgroundImage);

      if (backgroundImage) {
        // Calculate the new scale based on the zoom level
        let newScale = backgroundImage.scaleX * zoom;

        // console.log("zoom", zoom)

        if (zoom == 1) {
          // Calculate scale factors based on canvas size and background image size
          const imgWidth = backgroundImage.width;
          const imgHeight = backgroundImage.height;
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();

          // Calculate scale to fit the image inside the canvas while maintaining aspect ratio
          const scaleX = (canvasWidth - 130) / imgWidth;
          const scaleY = (canvasHeight - 130) / imgHeight;

          // Choose the maximum of the two scale values to preserve aspect ratio
          newScale = Math.max(scaleX, scaleY);
          // console.log("new scale ", newScale);
        }

        // Ensure the background image properties are updated correctly
        backgroundImage.set({
          scaleX: newScale,
          scaleY: newScale
        });

        // Re-set the background image to update the canvas background
        canvas.setBackgroundImage(backgroundImage, () => {
          canvas.renderAll();  // Explicitly re-render the canvas
        });

        // console.log("Updated background image scale:", newScale);
      }
    }
  }, [zoomLevel]);  // Trigger effect when zoomLevel changes

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


  function createWarning(canvasWidth, canvasHeight, canvas) {

    const boxWidth = canvasWidth * 0.36;  // 40% of canvas width
    const boxHeight = canvasHeight * 0.6; // 60% of canvas height

    const boxLeft = (canvasWidth - boxWidth) / 2;
    const boxTop = ((canvasHeight - boxHeight) / 2);

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop - 30,
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
    // const boundaryBoxInner = new fabric.Rect({
    //   left: boxLeft + 5,
    //   top: boxTop + 25,
    //   width: boxWidth - 10,
    //   height: boxHeight - 40,
    //   fill: "transparent",
    //   stroke: warningColor || "skyblue",
    //   strokeWidth: 1,
    //   selectable: false,
    //   evented: false,
    //   visible: false,
    //   isSync: false,
    //   objectCaching: false,
    //   strokeDashArray: [3, 1], // ← use this instead of borderDashArray
    //   name: "boundaryBoxInner"
    // });
    // const boundaryBoxLeft = new fabric.Rect({
    //   left: boxLeft + 145,
    //   top: boxTop + 25,
    //   width: 100,
    //   height: 100,
    //   fill: "transparent",
    //   stroke: warningColor || "skyblue",
    //   strokeWidth: 1,
    //   selectable: false,
    //   evented: false,
    //   visible: false,
    //   isSync: false,
    //   strokeWidth: 1,
    //   selectable: false,
    //   objectCaching: false,
    //   strokeDashArray: [3, 1],
    //   name: "boundaryBoxLeft"
    // });

    const warningText = new fabric.Text("Please keep design inside the box", {
      left: boxLeft + boxWidth / 2,
      top: boxTop - 20,
      fontSize: canvasHeight * 0.03,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white" || "#00F8E7FF",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center", // ⬅️ Centers text
      originY: "top",
      name: "warningText",
    });


    // canvas.add(warningText);
    // canvas.bringToFront(warningText);
    // canvas.requestRenderAll();


    // const adultText = new fabric.Text("Adult", {
    //   left: boxLeft + boxWidth / 2,
    //   top: boxTop + 390,
    //   width: boxWidth - 20,           // ✅ important for wrapping
    //   fontSize: 13,
    //   fontFamily: "proxima-soft, sans-serif",
    //   fill: "white" || "#00F8E7FF",
    //   selectable: false,
    //   evented: false,
    //   visible: false,                  // ✅ visible for testing
    //   isSync: false,
    //   originX: "center",
    //   originY: "top",
    //   textAlign: "center",
    //   name: "adultText",
    // });
    // const leftChestText = new fabric.Text("Left Chest", {
    //   left: boxLeft + 70 + boxWidth / 2,
    //   top: boxTop + 105,
    //   // width: boxWidth - 20,             // ✅ important for wrapping
    //   fontSize: 13,
    //   fontFamily: "proxima-soft, sans-serif",
    //   fill: "white" || "#00F8E7FF",
    //   selectable: false,
    //   evented: false,
    //   visible: false,                  // ✅ visible for testing
    //   isSync: false,
    //   originX: "center",
    //   originY: "top",
    //   textAlign: "center",
    //   name: "leftChestText",
    //   scaleX: 1,
    //   scaleY: 1,
    // });
    // const youthText = new fabric.Text("Youth", {
    //   left: boxLeft + boxWidth / 2,
    //   top: boxTop + 350,
    //   width: boxWidth - 20,           // ✅ important for wrapping
    //   fontSize: 13,
    //   fontFamily: "proxima-soft, sans-serif",
    //   fill: "white" || "#00F8E7FF",
    //   selectable: false,
    //   evented: false,
    //   visible: false,                  // ✅ visible for testing
    //   isSync: false,
    //   originX: "center",
    //   originY: "top",
    //   textAlign: "center",
    //   name: "youthText",
    //   scaleX: 1,
    //   scaleY: 1,
    // });


    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop - 30;
    const centerY2 = boxTop - 30 + boxHeight;

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
    // canvas.add(boundaryBoxLeft);
    // canvas.add(adultText);
    // canvas.add(youthText);
    // canvas.add(leftChestText);
    // canvas.add(boundaryBoxInner);
    // canvas.add(leftBorder);
    canvas.add(warningText);
    // canvas.sendToBack(leftBorder);
    warningText.initDimensions();
    warningText.initDimensions();


    // youthText.initDimensions();
    // adultText.initDimensions();
    canvas.bringToFront(warningText);
    // canvas.bringToFront(youthText);
    // canvas.bringToFront(adultText);
    // canvas.bringToFront(leftChestText)
    canvas.bringToFront(boundaryBox);
    // canvas.bringToFront(boundaryBoxInner);
    // canvas.bringToFront(boundaryBoxLeft);
    canvas.bringToFront(centerVerticalLine);
  }
  function createWarningForSweatShirt(canvasWidth, canvasHeight, canvas) {
    let boxWidth = canvasWidth * 0.4;
    let boxHeight = canvasHeight * 0.7;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    const strokeColor = warningColor || "skyblue";
    const dashPattern = [3, 1];

    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {

      boxLeft += canvasWidth * 0.15;
      boxWidth = canvasWidth * 0.2;
      boxHeight = canvasHeight * 0.6;
      boxTop -= canvasHeight * 0.03;
    }

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop - canvasHeight * 0.04,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });

    // Left Chest box (scaled)
    const chestBoxWidth = canvasWidth * 0.14;
    const chestBoxHeight = canvasHeight * 0.18;
    const chestBoxLeftOffset = canvasWidth * 0.22;
    const chestBoxTopOffset = canvasHeight * 0.05;

    const boundaryBoxLeft = new fabric.Rect({
      left: boxLeft + chestBoxLeftOffset,
      top: boxTop,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxLeft"
    });

    // Right Chest box (mirror of Left Chest)
    const boundaryBoxRight = new fabric.Rect({
      left: boxLeft + boxWidth - chestBoxLeftOffset - chestBoxWidth,
      top: boxTop + chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxRight"
    });


    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {


      const warningText = new fabric.Text("Please keep design inside the box", {
        left: boxLeft + boxWidth / 2,
        top: boxTop - canvasHeight * 0.03,
        fontSize: canvasHeight * 0.03,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "warningText"
      });
      canvas.add(warningText);
      canvas.bringToFront(warningText);
    }
    // Warning text

    // Left Chest Label
    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + chestBoxWidth / 2,
      top: boundaryBoxLeft.top + chestBoxHeight - canvasHeight * 0.03,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "leftChestText"
    });

    // Right Chest Label
    const rightChestText = new fabric.Text("Right Chest", {
      left: boundaryBoxRight.left + chestBoxWidth / 2,
      top: boundaryBoxRight.top + chestBoxHeight + canvasHeight * 0.01,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "rightChestText"
    });

    // Center vertical line
    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop - canvasHeight * 0.04;
    const centerY2 = centerY1 + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: strokeColor,
      strokeWidth: 1,
      strokeDashArray: dashPattern,
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // Left and Right borders of center line
    const canvasCenterX = canvas.getWidth() / 2;

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineLeftBorder",
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineRightBorder",
      visible: false
    });

    // Add all elements to canvas
    canvas.add(
      boundaryBox,
      // boundaryBoxLeft,
      // boundaryBoxRight,
      centerVerticalLine,
      // leftChestText,
      // rightChestText,
      // warningText,
      // leftBorder,
      // rightBorder
    );

    // Layering
    canvas.sendToBack(rightBorder);
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
  }
  function createWarningForT_shirt(canvasWidth, canvasHeight, canvas) {
    let boxWidth = canvasWidth * 0.36;
    let boxHeight = canvasHeight * 0.5;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    const strokeColor = warningColor || "skyblue";
    const dashPattern = [3, 1];

    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {
      const sleeveType = getProductSleeveType(activeProductTitle);
      if (sleeveType == "Sleeveless") return;
      if (sleeveType == "Long Sleeve") {
        boxLeft += canvasWidth * 0.1;
        boxWidth = canvasWidth * 0.2;
        boxHeight = canvasHeight * 0.4;
        boxTop -= canvasHeight * 0.03;
      }
      else {
        boxLeft += canvasWidth * 0.1;
        boxWidth = canvasWidth * 0.2;
        boxHeight = canvasHeight * 0.23;
        boxTop -= canvasHeight * 0.03;
      }
    }

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop - canvasHeight * 0.08,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });

    // Left Chest box (scaled)
    const chestBoxWidth = canvasWidth * 0.14;
    const chestBoxHeight = canvasHeight * 0.14;
    const chestBoxLeftOffset = canvasWidth * 0.22;
    const chestBoxTopOffset = canvasHeight * 0.05;

    const boundaryBoxLeft = new fabric.Rect({
      left: boxLeft + chestBoxLeftOffset,
      top: boxTop - chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxLeft"
    });

    // Right Chest box (mirror of Left Chest)
    const boundaryBoxRight = new fabric.Rect({
      left: boxLeft + boxWidth - chestBoxLeftOffset - chestBoxWidth,
      top: boxTop + chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxRight"
    });

    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {
      // Warning text
      const warningText = new fabric.Text("Please keep design inside the box", {
        left: boxLeft + boxWidth / 2,
        top: boxTop - canvasHeight * 0.09,
        fontSize: canvasHeight * 0.03,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "warningText"
      });
      canvas.add(warningText);
      canvas.bringToFront(warningText);
    }

    // Left Chest Label
    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + chestBoxWidth / 2,
      top: boundaryBoxLeft.top + chestBoxHeight - canvasHeight * 0.03,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "leftChestText"
    });

    // Right Chest Label
    const rightChestText = new fabric.Text("Right Chest", {
      left: boundaryBoxRight.left + chestBoxWidth / 2,
      top: boundaryBoxRight.top + chestBoxHeight + canvasHeight * 0.01,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "rightChestText"
    });

    // Center vertical line
    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop - canvasHeight * 0.07;
    const centerY2 = centerY1 + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: strokeColor,
      strokeWidth: 1,
      strokeDashArray: dashPattern,
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // Left and Right borders of center line
    const canvasCenterX = canvas.getWidth() / 2;

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineLeftBorder",
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineRightBorder",
      visible: false
    });

    // Add all elements to canvas
    canvas.add(
      boundaryBox,
      boundaryBoxLeft,
      boundaryBoxRight,
      centerVerticalLine,
      leftChestText,
      rightChestText,
      // warningText,
      leftBorder,
      rightBorder
    );

    // Layering
    canvas.sendToBack(rightBorder);
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
  }
  function createWarningForBoxy(canvasWidth, canvasHeight, canvas) {
    let boxWidth = canvasWidth * 0.36;
    let boxHeight = canvasHeight * 0.4;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    const strokeColor = warningColor || "skyblue";
    const dashPattern = [3, 1];

    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {
      const sleeveType = getProductSleeveType(activeProductTitle);
      if (sleeveType == "Sleeveless") return;
      if (sleeveType == "Long Sleeve") {
        boxLeft += canvasWidth * 0.1;
        boxWidth = canvasWidth * 0.2;
        boxHeight = canvasHeight * 0.4;
        boxTop -= canvasHeight * 0.03;
      }
      else {
        boxLeft += canvasWidth * 0.12;
        boxWidth = canvasWidth * 0.2;
        boxHeight = canvasHeight * 0.23;
        boxTop -= canvasHeight * 0.03;
      }
    }

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop - canvasHeight * 0.06,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });

    // Left Chest box (scaled)
    const chestBoxWidth = canvasWidth * 0.14;
    const chestBoxHeight = canvasHeight * 0.14;
    const chestBoxLeftOffset = canvasWidth * 0.22;
    const chestBoxTopOffset = canvasHeight * 0.05;

    const boundaryBoxLeft = new fabric.Rect({
      left: boxLeft + chestBoxLeftOffset,
      top: boxTop - chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxLeft"
    });

    // Right Chest box (mirror of Left Chest)
    const boundaryBoxRight = new fabric.Rect({
      left: boxLeft + boxWidth - chestBoxLeftOffset - chestBoxWidth,
      top: boxTop + chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxRight"
    });

    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {
      // Warning text
      const warningText = new fabric.Text("Please keep design inside the box", {
        left: boxLeft + boxWidth / 2,
        top: boxTop - canvasHeight * 0.03,
        fontSize: canvasHeight * 0.03,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "warningText"
      });
      canvas.add(warningText);
      canvas.bringToFront(warningText);
    }

    // Left Chest Label
    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + chestBoxWidth / 2,
      top: boundaryBoxLeft.top + chestBoxHeight - canvasHeight * 0.03,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "leftChestText"
    });

    // Right Chest Label
    const rightChestText = new fabric.Text("Right Chest", {
      left: boundaryBoxRight.left + chestBoxWidth / 2,
      top: boundaryBoxRight.top + chestBoxHeight + canvasHeight * 0.01,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "rightChestText"
    });

    // Center vertical line
    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop - canvasHeight * 0.07;
    const centerY2 = centerY1 + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: strokeColor,
      strokeWidth: 1,
      strokeDashArray: dashPattern,
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // Left and Right borders of center line
    const canvasCenterX = canvas.getWidth() / 2;

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineLeftBorder",
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineRightBorder",
      visible: false
    });

    // Add all elements to canvas
    canvas.add(
      boundaryBox,
      boundaryBoxLeft,
      boundaryBoxRight,
      centerVerticalLine,
      leftChestText,
      rightChestText,
      // warningText,
      leftBorder,
      rightBorder
    );

    // Layering
    canvas.sendToBack(rightBorder);
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
  }
  function createWarningForhoodie(canvasWidth, canvasHeight, canvas) {
    let boxWidth = canvasWidth * 0.4;
    let boxHeight = canvasHeight * 0.34;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    if (activeSide === "front") {
      boxTop -= canvasHeight * 0.12;
    } else if (activeSide == "back") {
      boxTop -= canvasHeight * 0.07;
    }
    else {
      boxLeft += canvasWidth * 0.12
      boxWidth = canvasWidth * 0.18;
      boxHeight = canvasHeight * 0.34;
      boxTop -= canvasHeight * 0.10;
    }



    // Dynamic proportions
    const warningTextYOffset = canvasHeight * 0.03;
    const leftBoxWidth = canvasWidth * 0.15;
    const leftBoxHeight = canvasWidth * 0.15;
    const leftChestTextFontSize = canvasHeight * 0.02;
    const warningTextFontSize = canvasHeight * 0.03;
    const leftChestTextGap = canvasHeight * 0.01;
    const textGapFromBottom = canvasHeight * 0.0225;

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop,
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

    const boundaryBoxLeft = new fabric.Rect({
      left: boxLeft + boxWidth - leftBoxWidth, // align to top-right corner
      top: boxTop,
      width: leftBoxWidth,
      height: leftBoxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      objectCaching: false,
      name: "boundaryBoxLeft"
    });

    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {


      const warningText = new fabric.Text("Please keep design inside the box", {
        left: boxLeft + boxWidth / 2,
        top: boxTop - warningTextYOffset,
        fontSize: warningTextFontSize,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "warningText"
      });
      canvas.add(warningText);
      canvas.bringToFront(warningText);
    }

    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + leftBoxWidth / 2, // center under box
      top: boundaryBoxLeft.top + leftBoxHeight - textGapFromBottom,
      fontSize: leftChestTextFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      originX: "center",
      originY: "top",
      textAlign: "center",
      name: "leftChestText"
    });

    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop;
    const centerY2 = boxTop + boxHeight;

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

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: '#005bff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: 'centerVerticalLineLeftBorder',
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: '#005bff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: 'centerVerticalLineRightBorder',
      visible: false
    });

    // Add all elements
    canvas.add(
      boundaryBox,
      boundaryBoxLeft,
      // warningText,
      leftChestText,
      centerVerticalLine,
      rightBorder
    );

    // Ensure proper layer order
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
  }
  function createWarningForZip(canvasWidth, canvasHeight, canvas) {
    // MAIN BACK BOX
    let boxWidthBack = canvasWidth * 0.4;
    let boxHeightBack = canvasHeight * 0.6;
    let boxLeftBack = (canvasWidth - boxWidthBack) / 2;
    let boxTopBack = (canvasHeight - boxHeightBack) / 2;


    // CHEST BOXES
    const chestBoxWidth = canvasWidth * 0.15;
    const chestBoxHeight = canvasHeight * 0.15;
    const centerX = canvasWidth / 2;
    const spacing = canvasWidth * 0.05;
    const chestBoxTop = canvasHeight * 0.2;

    // DYNAMIC TEXT/OFFSET VALUES

    const textFontSize = canvasHeight * 0.02;      // ≈13px
    const textGapFromBottom = canvasHeight * 0.0225; // ≈18px
    const warningTextOffset = canvasHeight * 0.03;   // ≈20px
    const backBoxTopOffset = canvasHeight * 0.0375;  // ≈30px


    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {

      boxLeftBack += canvasWidth * 0.15
      boxWidthBack = canvasWidth * 0.16;
      boxHeightBack = canvasHeight * 0.5;

      //   boxLeft += canvasWidth * 0.15;
      // boxWidth = canvasWidth * 0.2;
      // boxHeight = canvasHeight * 0.6;
      // boxTop -= canvasHeight * 0.03;
      // boxTopBack ;
    }

    // WARNING TEXT ABOVE MAIN BACK BOX
    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {
      const warningText = new fabric.Text("Please keep design inside the box", {
        left: boxLeftBack + boxWidthBack / 2,
        top: boxTopBack - warningTextOffset,
        fontSize: canvasHeight * 0.03,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "warningText",
      });

      canvas.add(warningText);
      canvas.bringToFront(warningText);
    }
    // MAIN BACK BOUNDARY BOX
    const boundaryBox = new fabric.Rect({
      left: boxLeftBack,
      top: boxTopBack - backBoxTopOffset,
      width: boxWidthBack,
      height: boxHeightBack,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });

    // RIGHT CHEST BOX (left side)
    const boundaryBoxRight = new fabric.Rect({
      left: centerX - chestBoxWidth - spacing,
      top: chestBoxTop,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      name: "boundaryBoxRight"
    });

    // RIGHT CHEST TEXT
    const rightChestText = new fabric.Text("Right Chest", {
      left: boundaryBoxRight.left + chestBoxWidth / 2,
      top: boundaryBoxRight.top + chestBoxHeight - textGapFromBottom,
      fontSize: textFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "rightChestText"
    });

    // LEFT CHEST BOX (right side)
    const boundaryBoxLeft = new fabric.Rect({
      left: centerX + spacing,
      top: chestBoxTop,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      name: "boundaryBoxLeft"
    });

    // LEFT CHEST TEXT
    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + chestBoxWidth / 2,
      top: boundaryBoxLeft.top + chestBoxHeight - textGapFromBottom,
      fontSize: textFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "leftChestText"
    });
    const centerXVertical = boxLeftBack + boxWidthBack / 2;
    const centerY1 = boxTopBack - backBoxTopOffset;
    const centerY2 = boxTopBack + boxHeightBack - backBoxTopOffset;

    const centerVerticalLine = new fabric.Line([centerXVertical, centerY1, centerX, centerY2], {
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // ADD TO CANVAS
    if (activeSide == "back") {
      canvas.add(centerVerticalLine);
    }
    canvas.add(
      boundaryBox,
      boundaryBoxLeft,
      leftChestText,
      boundaryBoxRight,
      rightChestText
    );

    // BRING TO FRONT
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(boundaryBoxRight);
    canvas.bringToFront(leftChestText);
    canvas.bringToFront(rightChestText);
    canvas.bringToFront(boundaryBoxLeft);
    if (activeSide == "back") {
      canvas.bringToFront(centerVerticalLine);
    }
  }
  function createWarningForPolo(canvasWidth, canvasHeight, canvas) {
    // MAIN BACK BOX
    let boxWidthBack = canvasWidth * 0.4;
    let boxHeightBack = canvasHeight * 0.6;
    let boxLeftBack = (canvasWidth - boxWidthBack) / 2;
    let boxTopBack = (canvasHeight - boxHeightBack) / 2;


    // CHEST BOXES
    const chestBoxWidth = canvasWidth * 0.15;
    const chestBoxHeight = canvasHeight * 0.15;
    const centerX = canvasWidth / 2;
    const spacing = canvasWidth * 0.05;
    const chestBoxTop = canvasHeight * 0.2;

    // DYNAMIC TEXT/OFFSET VALUES

    const textFontSize = canvasHeight * 0.02;      // ≈13px
    const textGapFromBottom = canvasHeight * 0.0225; // ≈18px
    const warningTextOffset = canvasHeight * 0.03;   // ≈20px
    const backBoxTopOffset = canvasHeight * 0.0375;  // ≈30px


    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {
      const sleeveType = getProductSleeveType(activeProductTitle);
      if (sleeveType == "Sleeveless") return;
      if (sleeveType == "Long Sleeve") {
        // return
        // boxLeft += canvasWidth * 0.1;
        // boxWidth = canvasWidth * 0.2;
        // boxHeight = canvasHeight * 0.4;
        // boxTop -= canvasHeight * 0.03;
      }
      else {
        boxLeftBack += canvasWidth * 0.10
        boxWidthBack = canvasWidth * 0.2;
        boxHeightBack = canvasHeight * 0.3;

      }
    }


    // WARNING TEXT ABOVE MAIN BACK BOX
    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {
      // const warningText = new fabric.Text("Please keep design inside the box", {
      //   left: boxLeftBack + boxWidthBack / 2,
      //   top: boxTopBack - warningTextOffset,
      //   fontSize: canvasHeight * 0.03,
      //   fontFamily: "proxima-soft, sans-serif",
      //   fill: "white",
      //   selectable: false,
      //   evented: false,
      //   visible: false,
      //   originX: "center",
      //   originY: "top",
      //   name: "warningText",
      // });

      // canvas.add(warningText);
      // canvas.bringToFront(warningText);
    }
    // MAIN BACK BOUNDARY BOX
    const boundaryBox = new fabric.Rect({
      left: boxLeftBack,
      top: boxTopBack - backBoxTopOffset,
      width: boxWidthBack,
      height: boxHeightBack,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });

    // RIGHT CHEST BOX (left side)
    const boundaryBoxRight = new fabric.Rect({
      left: centerX - chestBoxWidth - spacing,
      top: chestBoxTop,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      name: "boundaryBoxRight"
    });

    // RIGHT CHEST TEXT
    const rightChestText = new fabric.Text("Right Chest", {
      left: boundaryBoxRight.left + chestBoxWidth / 2,
      top: boundaryBoxRight.top + chestBoxHeight - textGapFromBottom,
      fontSize: textFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "rightChestText"
    });

    // LEFT CHEST BOX (right side)
    const boundaryBoxLeft = new fabric.Rect({
      left: centerX + spacing,
      top: chestBoxTop,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      name: "boundaryBoxLeft"
    });

    // LEFT CHEST TEXT
    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + chestBoxWidth / 2,
      top: boundaryBoxLeft.top + chestBoxHeight - textGapFromBottom,
      fontSize: textFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "leftChestText"
    });
    const centerXVertical = boxLeftBack + boxWidthBack / 2;
    const centerY1 = boxTopBack - backBoxTopOffset;
    const centerY2 = boxTopBack + boxHeightBack - backBoxTopOffset;

    const centerVerticalLine = new fabric.Line([centerXVertical, centerY1, centerX, centerY2], {
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // ADD TO CANVAS
    if (activeSide == "back") {
      canvas.add(centerVerticalLine);
    }
    if (activeSide != "back" || activeSide != "front") {
      canvas.add(centerVerticalLine);
      canvas.add(boundaryBox)
    }
    canvas.add(
      // boundaryBox,
      boundaryBoxLeft,
      leftChestText,
      boundaryBoxRight,
      rightChestText
    );

    // BRING TO FRONT
    // canvas.bringToFront(boundaryBox);
    canvas.bringToFront(boundaryBoxRight);
    canvas.bringToFront(leftChestText);
    canvas.bringToFront(rightChestText);
    canvas.bringToFront(boundaryBoxLeft);
    if (activeSide == "back") {
      canvas.bringToFront(boundaryBox);
      canvas.bringToFront(boundaryBoxRight);
      canvas.bringToFront(centerVerticalLine);
    }
  }
  function createWarningForTankTop(canvasWidth, canvasHeight, canvas) {

    if (activeSide == "leftSleeve" || activeSide == "rightSleeve") {
      return;
    }
    const boxWidth = canvasWidth * 0.38;
    const boxHeight = canvasHeight * 0.5;
    const boxLeft = (canvasWidth - boxWidth) / 2;

    // Center the box slightly higher (tanks are usually cut shorter)
    const boxTop = (canvasHeight - boxHeight) / 2 - canvasHeight * 0.04;

    // Dynamic proportions
    const warningTextYOffset = canvasHeight * 0.03;
    const leftBoxWidth = canvasWidth * 0.14;
    const leftBoxHeight = canvasWidth * 0.14;
    const leftChestTextFontSize = canvasHeight * 0.016;
    const warningTextFontSize = canvasHeight * 0.03;
    const leftChestTextGap = canvasHeight * 0.01;

    // Main print boundary
    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop,
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


    // Warning text above main box
    const warningText = new fabric.Text("Please keep design inside the box", {
      left: boxLeft + boxWidth / 2,
      top: boxTop - warningTextYOffset,
      fontSize: warningTextFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "warningText"
    });

    // Vertical center guideline
    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop;
    const centerY2 = boxTop + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // Slight borders around center for guidance
    const canvasCenterX = canvas.getWidth() / 2;

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: '#005bff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: 'centerVerticalLineLeftBorder',
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: '#005bff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: 'centerVerticalLineRightBorder',
      visible: false
    });

    // Add to canvas
    canvas.add(
      boundaryBox,
      warningText,
      centerVerticalLine,
      leftBorder,
      rightBorder
    );

    // Bring relevant elements to front
    warningText.initDimensions();
    canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);

  }

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const wrapperElement = canvasElement.parentNode;

    const canvasWidth = wrapperElement.clientWidth;
    const canvasHeight = wrapperElement.clientHeight;
    console.log("canvasWidth canvasHeight", canvasWidth, canvasHeight)

    const canvas = new fabric.Canvas(canvasElement, {
      width: canvasWidth,
      height: canvasHeight,
    });
    canvas.preserveObjectStacking = true;
    fabricCanvasRef.current = canvas;
    // console.log("productCategory before warning", productCategory)

    if ((getProductType(activeProductTitle) === "Zip") || (getProductType(activeProductTitle) === "Jacket")) {
      createWarningForZip(canvasWidth, canvasHeight, canvas)
    }
    else if ((getProductType(activeProductTitle) === "Polo")) {

      createWarningForPolo(canvasWidth, canvasHeight, canvas)
    }
    else if ((getProductType(activeProductTitle) === "Hoodie") || (getProductType(activeProductTitle) === "Hooded Sweatshirt")) {
      createWarningForhoodie(canvasWidth, canvasHeight, canvas)

    } else if ((getProductType(activeProductTitle) === "Tank")) {
      createWarningForTankTop(canvasWidth, canvasHeight, canvas)
    }
    else if ((getProductType(activeProductTitle) === "Boxy")) {
      createWarningForBoxy(canvasWidth, canvasHeight, canvas)
    }
    else if ((getProductType(activeProductTitle) === "T-shirt") || (getProductType(activeProductTitle) === "Tee")) {
      createWarningForT_shirt(canvasWidth, canvasHeight, canvas)
    }
    else if ((getProductType(activeProductTitle) === "Sweatshirt")) {
      createWarningForSweatShirt(canvasWidth, canvasHeight, canvas)
    }
    canvas.requestRenderAll();



    const handleSelection = (e) => {
      removeAllHtmlControls();
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
      removeAllHtmlControls();
      syncMirrorCanvasHelper(activeSide);
      updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));
      // dispatch(deleteTextState(removedObject.id));
      // dispatch(deleteImageState(removedObject.id));


    };
    const handleObjectAdded = (e) => {
      removeAllHtmlControls();
      syncMirrorCanvasHelper(activeSide);
    };

    const handleObjectModified = (e) => {
      updateBoundaryVisibility(fabricCanvasRef, activeSide, getProductType(activeProductTitle));
      syncMirrorCanvasHelper(activeSide);
      // handleScale(e);
    };

    // const handleMoving = (e) => {
    //   checkBoundary(e);
    //   const canvas = fabricCanvasRef.current;
    //   if (!canvas) return;



    //   // const objects = canvas.getObjects();
    //   // if (activeSide === 'front') {
    //   //   boundaryBox.visible = true;
    //   //   warningText.visible = true;
    //   //   centerVerticalLine.visible = true;
    //   //   boundaryBoxInner.visible = true;
    //   //   boundaryBoxLeft.visible = true;
    //   //   if (leftChestText) leftChestText.visible = true;
    //   //   if (youthText) youthText.visible = true;
    //   //   if (adultText) adultText.visible = true;
    //   // }
    //   // else {
    //   //   boundaryBox.visible = true;
    //   //   centerVerticalLine.visible = true;

    //   // }

    //   if (productCategory == "Zip") {

    //     if (activeSide == "front") {
    //       const showBoundary = true;
    //       if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
    //       if (boundaryBoxRight) boundaryBoxRight.visible = showBoundary;
    //       if (leftChestText) leftChestText.visible = showBoundary;
    //       if (rightChestText) rightChestText.visible = showBoundary;
    //       if (warningText) { warningText.visible = showBoundary; }
    //     }
    //     else {
    //       const showBoundary = true;
    //       if (boundaryBox) boundaryBox.visible = showBoundary;
    //       if (warningText) { warningText.visible = showBoundary; }
    //       // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
    //     }
    //   }
    //   else {
    //     const showBoundary = true;
    //     if (activeSide == 'front') {
    //       if (boundaryBox) boundaryBox.visible = showBoundary;
    //       if (boundaryBoxInner) boundaryBoxInner.visible = showBoundary;
    //       if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
    //       if (leftChestText) leftChestText.visible = showBoundary;
    //       if (adultText) adultText.visible = showBoundary;
    //       if (youthText) youthText.visible = showBoundary;
    //       // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
    //       if (warningText) { warningText.visible = showBoundary; }
    //     }
    //     else {
    //       if (boundaryBox) boundaryBox.visible = showBoundary;
    //       if (boundaryBoxInner) boundaryBoxInner.visible = false;
    //       if (boundaryBoxLeft) boundaryBoxLeft.visible = false;
    //       if (leftChestText) leftChestText.visible = false;
    //       if (adultText) adultText.visible = false;
    //       if (youthText) youthText.visible = false;
    //       if (warningText) { warningText.visible = showBoundary; }
    //       // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }

    //     }
    //   }




    //   // // Detect center collision
    //   // const textObjects = objects.filter(
    //   //   (obj) => obj.type === "curved-text" || obj.type === "image"
    //   // );

    //   // let anyObjectAtCenter = false;

    //   // textObjects.forEach((obj) => {
    //   //   obj.setCoords();

    //   //   const objCenterX = obj.getCenterPoint().x;
    //   //   const delta = Math.abs(objCenterX - canvasCenterX);

    //   //   if (delta <= 2) {
    //   //     anyObjectAtCenter = true;

    //   //     // Temporarily lock movement
    //   //     obj.lockMovementX = true;
    //   //     canvas.requestRenderAll();

    //   //     setTimeout(() => {
    //   //       obj.lockMovementX = false;
    //   //       canvas.requestRenderAll();
    //   //     }, 1000);
    //   //   }

    //   //   obj.setCoords();
    //   // });

    //   // // Show / hide the left / right borders
    //   // // leftBorder.set({ visible: anyObjectAtCenter });
    //   // // rightBorder.set({ visible: anyObjectAtCenter });

    //   // // Change center line color if hitting center
    //   // const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
    //   // if (!centerVerticalLine.originalStroke) {
    //   //   centerVerticalLine.originalStroke = originalStroke;
    //   // }

    //   // centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);

    //   // canvas.requestRenderAll();
    // };

    const showBoundaryOnAction = (e) => {
      // checkBoundary(e);
      const canvas = fabricCanvasRef.current;
      const objects = canvas.getObjects();
      const boundaryBox = objects.find((obj) => obj.name === "boundaryBox");
      const boundaryBoxInner = objects.find((obj) => obj.name === "boundaryBoxInner");
      const boundaryBoxLeft = objects.find((obj) => obj.name === "boundaryBoxLeft");
      const boundaryBoxRight = objects.find((obj) => obj.name === "boundaryBoxRight");
      const centerVerticalLine = objects.find((obj) => obj.name === "centerVerticalLine");
      const warningText = objects.find((obj) => obj.name === "warningText");
      const centerVerticalLineLeftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
      const centerVerticalLineRightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");
      const leftChestText = objects.find((obj) => obj.name === "leftChestText");
      const rightChestText = objects.find((obj) => obj.name === "rightChestText");
      const youthText = objects.find((obj) => obj.name === "youthText");
      const adultText = objects.find((obj) => obj.name === "adultText");
      const leftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
      const rightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");
      const productCategory = getProductType(activeProductTitle)
      if (!canvas) return;
      if (productCategory == "Zip") {

        if (activeSide == "front") {
          const showBoundary = true;
          if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
          if (boundaryBoxRight) boundaryBoxRight.visible = showBoundary;
          if (leftChestText) leftChestText.visible = showBoundary;
          if (rightChestText) rightChestText.visible = showBoundary;
          if (warningText) { warningText.visible = showBoundary; }
        }
        else {
          const showBoundary = true;
          if (boundaryBox) boundaryBox.visible = showBoundary;
          if (warningText) { warningText.visible = showBoundary; }
          // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
        }
      }
      else {
        const showBoundary = true;
        if (activeSide == 'front') {
          if (boundaryBox) boundaryBox.visible = showBoundary;
          if (boundaryBoxInner) boundaryBoxInner.visible = showBoundary;
          if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
          if (leftChestText) leftChestText.visible = showBoundary;
          if (adultText) adultText.visible = showBoundary;
          if (youthText) youthText.visible = showBoundary;
          // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
          if (warningText) { warningText.visible = showBoundary; }
        }
        else {
          if (boundaryBox) boundaryBox.visible = showBoundary;
          if (boundaryBoxInner) boundaryBoxInner.visible = false;
          if (boundaryBoxLeft) boundaryBoxLeft.visible = false;
          if (leftChestText) leftChestText.visible = false;
          if (adultText) adultText.visible = false;
          if (youthText) youthText.visible = false;
          if (warningText) { warningText.visible = showBoundary; }
          // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
        }
      }


      if (activeSide == "leftSleeve" || activeSide == "rightSleeve") {
        canvas.renderAll();
        return;
      }
      // // Detect center collision
      const canvasCenterX = canvas.getWidth() / 2;
      const textObjects = objects.filter(
        (obj) => obj.type === "curved-text" || obj.type === "image"
      );

      let anyObjectAtCenter = false;

      textObjects.forEach((obj) => {
        obj.setCoords();

        const objCenterX = obj.getCenterPoint().x;
        const delta = Math.abs(objCenterX - canvasCenterX);

        if (delta <= 4) {
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
      if (centerVerticalLine) {
        if (anyObjectAtCenter) {
          // alert("center");
          centerVerticalLine.visible = true
        }
        else {
          centerVerticalLine.visible = false
        }
        // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
        // Change center line color if hitting center
        const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
        if (!centerVerticalLine.originalStroke) {
          centerVerticalLine.originalStroke = originalStroke;
        }

        centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);

      }

      canvas.requestRenderAll();



    }



    const events = [
      ["object:added", handleObjectAdded],
      ["object:removed", handleObjectRemoved],
      ["object:modified", handleObjectModified],
      ["object:moving", showBoundaryOnAction],
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
    events.forEach(([event, handler]) => canvas.on(event, handler));

    if (backgroundImage) {
      fabric.Image.fromURL(
        backgroundImage,
        (img) => {
          const imgWidth = img.width;
          const imgHeight = img.height;

          // Calculate scale based on the parent container size
          const scaleX = (canvasWidth - 130) / imgWidth;
          const scaleY = (canvasHeight - 130) / imgHeight;

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
      removeAllHtmlControls();
      setOpenAieditorPopup(false);
      // Remove all listeners
      events.forEach(([event, handler]) => canvas.off(event, handler));
      const btn = document.getElementById(`canvas-${id}-ai`);
      if (btn) {
        btn.removeEventListener("click", () => {
          console.log("event removed");
        })
      }
      // Dispose of the canvas to prevent memory leaks
      canvas.dispose();
      // fabricCanvasRef.current = null;
      // mirrorCanvasRef.current.dispose();
      // mirrorCanvasRef.current = null;
    };
  }, [id, backgroundImage, activeSide, size]);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
  useEffect(() => {
    const handleResize = () => {
      console.log("resizing......................", window.innerWidth);
      if (!isTabletOrMobile) {
        // setSize(window.innerWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


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
  }, [imageContaintObject, textContaintObject, activeSide, isRender]); // 👈 Reacts to previewUrl change

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
      renderCurveTextObjectsHelper();
      // renderCurveTextObjectsHelper(
      //   fabricCanvasRef,
      //   dispatch,
      //   textContaintObject,
      //   setActiveObjectType,
      //   updateBoundaryVisibility,
      //   createControls,
      //   syncMirrorCanvasHelper,
      //   navigate,
      //   fabric,
      //   setSelectedTextState,
      //   globalDispatch,
      //   activeSide,
      //   bringPopup,
      //   getProductType(activeProductTitle)

      // )
    }

    // Render image objects
    if (imageContaintObject && imageContaintObject.length > 0) {
      // renderAllImageObjects();
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
  }, [isRender, addName, addNumber, nameAndNumberDesignState, activeSide]);

  useEffect(() => {
    // const buttonId = `canvas-${id}-ai`;
    // if(!buttonId) return
    // buttonId?.addEventListener("click", (event) => {
    //   setOpenAieditorPopup(!openAieditorPopup);
    //   // console.log("clicked ai btn",openAieditorPopup);
    //   // event.stopPropagation();
    // })
  }, [])


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
    <div class="canvas-wrapper" id="canvasParent" style={{ position: "relative", top: 5 }} >



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
              className={style.canvaButton}
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
      />
      {
        openAieditorPopup && <EditWithAipopup onClose={() => {
          setOpenAieditorPopup(false);
        }}></EditWithAipopup>
      }

      {showNotes && <DesignNotesPopup handleClose={handleClose} />}

      {/* <div class="tenor-gif-embed" data-postid="6449096453315144907" data-share-method="host" data-aspect-ratio="0.991667" data-width="100%" style={{ zIndex: 9999999, position: "absolute", top: "50%", left: "50%" }}>
        <a href="https://tenor.com/view/loading-gif-6449096453315144907">Loading Sticker</a>from <a href="https://tenor.com/search/loading-stickers"
        >Loading Stickers</a></div> */}
      {/* <img src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif" height={200} width={200} style={{ zIndex: 9999999, position: "absolute", top: "50%", left: "50%" }}></img> */}
      {/* <!-- index.html or in React root --> */}




    </div >
  );



};


export default MainDesignTool;