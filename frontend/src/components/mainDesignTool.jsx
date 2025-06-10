import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
// import { TbArrowForwardUp } from "react-icons/tb";
// import { TbArrowBack } from "react-icons/tb";
// import { VscZoomIn } from "react-icons/vsc";
import style from "./MainDesignTool.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTextState,
  setSelectedTextState,
  updateNameAndNumberDesignState,
  updateTextState,
} from "../redux/FrontendDesign/TextFrontendDesignSlice";
import { useNavigate } from "react-router-dom";
import LayerModal from "./CommonComponent/layerComponent/layerComponent";
import CurvedText from "./fabric/fabric.TextCurved"; // Adjust path if needed
fabric.CurvedText = CurvedText;
const MainDesignTool = ({
  warningColor,
  key,
  id,
  backgroundImage,
  // mirrorCanvasRef,
  // initialDesign,
  zoomLevel,
  // canvasReff,
  setFrontPreviewImage,
  setBackPreviewImage,
  setLeftSleevePreviewImage,
  setRightSleevePreviewImage,
  setPreviewForCurrentSide
}) => {

  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const currentProductId = useSelector((state) => state.TextFrontendDesignSlice.currentProductId);
  const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);

  console.log("currentProductId", currentProductId);
  // Safely access product state
  const productState = useSelector(
    (state) => state.TextFrontendDesignSlice.products?.[currentProductId]
  );

  const nameAndNumberDesignState = productState?.present?.[activeSide]?.nameAndNumberDesignState;

  // console.log("nameAndNumberDesignState for main ",nameAndNumberDesignState)
  const textContaintObject = productState?.present?.[activeSide]?.texts || [];
  const isRender = productState?.present?.[activeSide]?.setRendering;
  const selectedTextId = productState?.present?.[activeSide]?.selectedTextId;


  // const image = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images[0]);
  // const imgRef = useRef(null);

  // const [previewUrl, setPreviewUrl] = useState(null);
  // console.log("image", image);
  // console.log("imgRef", imgRef);
  // console.log("previewUrl", previewUrl);

  // useEffect(() => {
  //   if (image?.src) {
  //     setPreviewUrl(image.src);
  //   }
  // }, [image?.src]);

  // const [lastTranform, setLastTranform] = useState(null);

  // const isLocked = selectedTextId && textContaintObject.find((obj) => obj.id === selectedTextId).locked;
  // console.log("locked value", isLocked);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedpopup, setSelectedpopup] = useState(false);

  // const [selectedHeight, setSelectedHeight] = useState("");
  // const mirrorFabricRef = useRef(null);




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

  const globalDispatch = (lable, value, id) => {
    dispatch(
      updateTextState({
        ["id"]: id,
        changes: { [lable]: value },
      })
    );
  };

  const updateBoundaryVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const boundaryBox = canvas.getObjects().find(obj => obj.type === "rect" && !obj.selectable); // identify your boundary box
    const warningText = canvas.getObjects().find(obj => obj.type === "text" && obj.text === "Please keep design inside the box");

    if (!boundaryBox || !warningText) return;

    const textObjects = canvas.getObjects().filter((obj) => obj.type === "curved-text" || obj.isDesignGroup || obj.type === 'group');

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


  useEffect(() => {
    updateBoundaryVisibility();
  }, [addName, addNumber, nameAndNumberDesignState, textContaintObject, updateBoundaryVisibility]);




  const iconImages = useMemo(() => {
    const imgs = {};
    for (const key in icons) {
      const img = new Image();
      img.src = icons[key];
      imgs[key] = img;
    }
    return imgs;
  }, []);


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
      y: 0.6,
      offsetX: -16,
      offsetY: 10,
      cursorStyle: "pointer",
      mouseUpHandler: bringPopup,
      render: renderIcon("layer"), // use appropriate icon
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
      canvas.remove(transform.target);
      canvas.requestRenderAll();
      // setSelectedHeight("");
      navigate("/product?productId=8847707537647&title=Dusty%20Rose%20/%20S");
    }
  };

  // const bringForward = (eventData, transform) => {
  //   alert("bring to Farward");
  //   if (!isLocked(eventData, transform)) {
  //     setSelectedpopup(!selectedpopup);
  //     const target = transform.target;
  //     target.canvas.bringForward(target);
  //     target.canvas.requestRenderAll();
  //   }
  // };

  // const sendBackward = (eventData, transform) => {
  //   alert("send to back");
  //   if (!isLocked(eventData, transform)) {
  //     const target = transform.target;
  //     target.canvas.sendBackwards(target);
  //     target.canvas.requestRenderAll();
  //   }
  // };

  // const bringToFront = (eventData, transform) => {
  //   alert("bring to front");
  //   if (!isLocked(eventData, transform)) {
  //     const target = transform.target;
  //     target.canvas.bringToFront(target);
  //     target.canvas.requestRenderAll();
  //   }
  // };
  const bringPopup = () => {
    //  setSelectedpopup(!selectedpopup)
    setIsModalOpen(true);
  };
  // const bringToFrontt = (object) => {

  //   object.canvas.bringToFront(object);
  //   object.canvas.requestRenderAll();
  // };

  // const sendToBack = (eventData, transform) => {
  //   const target = transform.target;
  //   const canvas = target.canvas;

  //   const beforeIndex = canvas.getObjects().indexOf(target);
  //   //console.log("Before index:", beforeIndex);

  //   canvas.sendToBack(target);
  //   canvas.requestRenderAll();

  //   // const afterIndex = canvas.getObjects().indexOf(target);
  //   //console.log("After index:", afterIndex);
  // };

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

  // const handleHeightChange = (e) => {
  //   const value = parseFloat(e.target.value);
  //   setSelectedHeight(e.target.value);
  //   const canvas = fabricCanvasRef.current;
  //   const activeObject = canvas.getActiveObject();
  //   if (activeObject && !isNaN(value)) {
  //     activeObject.set("scaleY", value / activeObject.height);
  //     canvas.requestRenderAll();
  //   }
  // };

  const handleObjectSelection = (e) => {
    const obj = e.selected?.[0];
    if (obj && obj.height) {
      // const actualHeight = obj.height * obj.scaleY;
      // setSelectedHeight(actualHeight.toFixed(0));
    }
  };


  const syncMirrorCanvas = async (activeSide) => {


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

    // return;

    // const parent = document.querySelector(".corner-img-canva-container");

    // const w = parent.clientWidth;
    // const h = parent.clientHeight - 30;
    // //console.log(mirrorCanvasRef.current, "dafh")
    // const mirrorCanvas = mirrorCanvasRef.current;
    // const mainCanvas = fabricCanvasRef.current;

    // if (!mirrorCanvas || !mainCanvas) return;

    // const json = mainCanvas.toJSON();

    // // console.log(json, "json data");

    // // return;

    // mirrorCanvas.loadFromJSON(json, () => {
    //   const originalWidth = mainCanvas.getWidth();
    //   const originalHeight = mainCanvas.getHeight();

    //   // Target mirror canvas size
    //   const mirrorWidth = w;
    //   const mirrorHeight = h;

    //   // Scale ratio (fit while maintaining aspect ratio)
    //   const scale = Math.min(
    //     mirrorWidth / originalWidth,
    //     mirrorHeight / originalHeight
    //   );

    //   // Calculate offset to center content
    //   const offsetX = (mirrorWidth - originalWidth * scale) / 2;
    //   const offsetY = (mirrorHeight - originalHeight * scale) / 2;

    //   // Set mirror canvas size
    //   mirrorCanvas.setWidth(mirrorWidth);
    //   mirrorCanvas.setHeight(mirrorHeight);

    //   // Scale and reposition each object
    //   mirrorCanvas.getObjects().forEach((obj) => {
    //     // obj.scaleX *= scale;
    //     // obj.scaleY *= scale;
    //     // obj.left = obj.left * scale + offsetX;
    //     // obj.top = obj.top * scale + offsetY;
    //     // obj.setCoords();
    //     console.log(obj);
    //   });

    //   mirrorCanvas.getObjects().filter((obj) => obj.type == "curved-text" || obj.type  == "group" || obj.type == "image").forEach((obj) => {
    //     obj.scaleX *= scale;
    //     obj.scaleY *= scale;
    //     obj.left = obj.left * scale + offsetX;
    //     obj.top = obj.top * scale + offsetY;
    //     obj.setCoords();
    //   });

    //   // Set background color
    //   mirrorCanvas.setBackgroundColor(
    //     "white",
    //     mirrorCanvas.renderAll.bind(mirrorCanvas)
    //   );

    //   // Scale and center background image
    //   const extraScale = 1.1; // slightly enlarge

    //   const bgImage = mainCanvas.backgroundImage;
    //   if (bgImage) {
    //     bgImage.clone((clonedBg) => {
    //       // Get mirror canvas size
    //       const canvasW = mirrorCanvas.getWidth();
    //       const canvasH = mirrorCanvas.getHeight();

    //       // Original image size
    //       const imgW = bgImage.width || bgImage._element?.naturalWidth;
    //       const imgH = bgImage.height || bgImage._element?.naturalHeight;

    //       // Scale to fit while maintaining aspect ratio
    //       const bgScale = Math.min(canvasW / imgW, canvasH / imgH) * extraScale;

    //       clonedBg.set({
    //         originX: "center",
    //         originY: "center",
    //         scaleX: bgScale,
    //         scaleY: bgScale,
    //         left: canvasW / 2,
    //         top: canvasH / 2,
    //       });

    //       mirrorCanvas.setBackgroundImage(
    //         clonedBg,
    //         mirrorCanvas.renderAll.bind(mirrorCanvas)
    //       );
    //     });
    //   } else {
    //     mirrorCanvas.renderAll();
    //   }
    // });
  };



  //  const moveHandler = (e) => {
  //    console.log(e,"moved eve")
  //       const obj = e.transform.target;
  //     const foundObject =textContaintObject && textContaintObject?.find((obj) => obj.id == selectedTextId);
  //     const isLocked = foundObject?.locked ?? false;

  //      console.log(foundObject,"foundObject");  

  //       // You can check a custom flag (e.g., obj.locked)
  //       if (!isLocked) {
  //         console.log("can move object")
  //           globalDispatch("position", { x: obj.left, y: obj.top }, selectedTextId);

  //         obj.left =  obj.left;  
  //         obj.top =  obj.top;
  //         // return;
  //       }
  //       else{
  //         obj.left =foundObject.position.x;
  //         obj.top =foundObject.position.y;
  //         globalDispatch("position",{x:foundObject.position.x,y:foundObject.position.y});
  //         console.log("can not move object");
  //         return; 
  //       }

  //     }

  const checkBoundary = (e) => {
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

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 550,
      height: 450,
      // backgroundColor: "gray"
    });

    canvas.preserveObjectStacking = true;
    fabricCanvasRef.current = canvas;
    // mirrorCanvasRef.current = new fabric.StaticCanvas(id);

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
      const textObjects = canvas.getObjects().filter((obj) => obj.type === "curved-text" || obj.type === "group");
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
        handleObjectSelection(e);
        setSelectedObject(e.selected[0]);
      }
    };

    const handleSelectionCleared = () => {
      // setSelectedObject(null);
      dispatch(setSelectedTextState(null));
    };

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
      } else {

        finalScaleX = clampScale(deltaScaleX);

        finalScaleY = clampScale(deltaScaleY);

      }
      obj.scaleX = finalScaleX;
      obj.scaleY = finalScaleY;

      obj.setPositionByOrigin(center, 'center', 'center');
      obj.setCoords();

      // Dispatch based on whether it was uniform or not

      globalDispatch("scaleX", parseFloat(finalScaleX.toFixed(1)), obj.id);
      globalDispatch("scaleY", parseFloat(finalScaleY.toFixed(1)), obj.id);

      globalDispatch("scaledValue", parseFloat(finalScaleX.toFixed(1)), obj.id);
      canvas.renderAll();
    };



    // Consolidated handlers
    const handleObjectAdded = (e) => {
      syncMirrorCanvas(activeSide);
      updateBoundaryVisibility(e);
    };

    const handleObjectModified = (e) => {
      updateBoundaryVisibility(e);
      syncMirrorCanvas(activeSide);
      handleScale(e);
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
  }, [iconImages, id, backgroundImage, activeSide, currentProductId]);


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
            angle: textInput.rotate || 0,
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
            angle: textInput.rotate || 0,
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
            navigate("/addText?productId=8847707537647&title=Dusty%20Rose%20/%20S", { state: textInput });
          });

          curved.on("modified", (e) => {

            const obj = e.target;
            if (!obj) return;

            const center = obj.getCenterPoint();

            obj.setPositionByOrigin(center, 'center', 'center');
            obj.setCoords();
            globalDispatch("position", { x: obj.left, y: obj.top }, textInput.id);
            globalDispatch("rotate", obj.angle, textInput.id);
            canvas.renderAll();

            syncMirrorCanvas(activeSide);

          });

          curved.on("update", () => {
            alert("ok");
          })
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

  }, [activeSide, isRender, dispatch, id, textContaintObject, currentProductId]);


  // useEffect(() => {
  //   if (!previewUrl) return;

  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) return;

  //   // Remove old image (if needed)
  //   const existingImg = canvas.getObjects().find(obj => obj.type === 'image');
  //   if (existingImg) {
  //     canvas.remove(existingImg);
  //   }

  //   // Add new image
  //   fabric.Image.fromURL(previewUrl, (img) => {
  //     img.set({
  //       left: 400,
  //       top: 300,
  //       scaleX: 0.5,
  //       scaleY: 0.5,
  //       objectCaching: false,
  //       borderColor: "skyblue",
  //       borderDashArray: [4, 4],
  //       hasBorders: true,
  //       isSync:true,
  //       customType: "main-image", // use this to identify the image later
  //     });

  //     img.setControlsVisibility({
  //       mt: false, mb: false, ml: false, mr: false,
  //       tl: false, tr: false, bl: false, br: false, mtr: false,
  //     });

  //     img.controls = createControls(); // custom controls
  //     canvas.add(img);
  //     canvas.renderAll();

  //     syncMirrorCanvas?.(); // if you have a sync function
  //   });
  // }, [previewUrl]); // 👈 Reacts to previewUrl change


  //  *************************************************************  for rendering the name and number**********************************************************

  // useEffect(() => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas || !nameAndNumberDesignState) {
  //     console.warn("Canvas or nameAndNumberDesignState is missing.");
  //     return;
  //   }

  //   const {
  //     name,
  //     number,
  //     position,
  //     fontFamily,
  //     fontColor,
  //     fontSize,
  //     id,
  //   } = nameAndNumberDesignState;

  //   const objectId = id;

  //   // Remove existing object if neither name nor number is being added
  //   if (!addName && !addNumber) {
  //     const existingTextObject = canvas.getObjects().find(obj => obj.id === objectId);
  //     if (existingTextObject) {
  //       canvas.remove(existingTextObject);
  //       canvas.requestRenderAll();
  //       canvas.renderAll();
  //     }
  //     return;
  //   }

  //   // Build the stacked text
  //   let stackedText = '';
  //   if (addName && name) stackedText += name;
  //   if (addName && addNumber && number) stackedText += '\n';
  //   if (addNumber && number) stackedText += number;

  //   if (!stackedText) {
  //     const existingTextObject = canvas.getObjects().find(obj => obj.id === objectId);
  //     if (existingTextObject) {
  //       canvas.remove(existingTextObject);
  //       canvas.requestRenderAll();
  //     }
  //     return;
  //   }

  //   // Font size mapping
  //   const fontSizeMap = {
  //     small: 40,
  //     medium: 60,
  //     large: 80,
  //   };
  //   const resolvedFontSize = fontSizeMap[fontSize] || 60;
  //   const boxWidth = 300;

  //   let existingTextObject = canvas.getObjects().find(obj => obj.id === objectId);

  //   if (!existingTextObject) {
  //     existingTextObject = new fabric.CurvedText(stackedText,
  //       {
  //         id: objectId,
  //         originX: "center",
  //         originY: "center",
  //         textAlign: "center",
  //         selectable: true,
  //         hasBorders: true,
  //         hasControls: false,
  //         evented: true,
  //         width: boxWidth,
  //         fontWeight:  '700', 
  //         fontFamily: fontFamily ,
  //       });
  //     canvas.add(existingTextObject);
  //     canvas.renderAll();
  //   }
  //   //  existingTextObject = canvas.getObjects().find(obj => obj.id === objectId);
  //   existingTextObject.set({
  //     text: stackedText,
  //     fill: fontColor,
  //     fontFamily: fontFamily ,
  //     fontSize: resolvedFontSize,
  //     left: position?.x || 300,
  //     top: position?.y || 300,
  //     evented: true,
  //   });

  //   existingTextObject.dirty = true;
  //   existingTextObject.setCoords();
  //   canvas.requestRenderAll();

  //   console.log(existingTextObject,"existingTextObject")
  //   canvas.renderAll();
  // }, [isRender,addName, addNumber, nameAndNumberDesignState,  ]);

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
      navigate("/addNames?productId=8847707537647&title=Dusty%20Rose%20/%20S");
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

    canvas.add(group);
    canvas.requestRenderAll();
    syncMirrorCanvas(activeSide);
  }


  useEffect(() => {
    renderNameAndNumber();
  }, [isRender, addName, addNumber, nameAndNumberDesignState, activeSide]);

  // useEffect(() => {

  // const getImageFromCanvas = (fabricCanvas) => {
  //   if (!fabricCanvas) return null;
  //   // const canvas = fabricCanvas.lowerCanvasEl;
  //   return fabricCanvas .toDataURL("image/png");
  // };

  // console.log("key",activeSide  );
  // if(activeSide == "front"){
  //   console.log("active side",activeSide,"changing front")
  //   if(fabricCanvasRef.current){
  //     setFrontPreviewImage(getImageFromCanvas(fabricCanvasRef.current));
  //   }
  // }
  // else{
  //     console.log("active side",activeSide,"changing back")
  //     if(fabricCanvasRef.current){
  //       setBackPreviewImage(getImageFromCanvas(fabricCanvasRef.current));
  //     }
  // }
  // // syncMirrorCanvas();
  // },[fabricCanvasRef.current,activeSide])

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
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
    canvas.renderAll();
  }, [selectedTextId, isRender])


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const handleLayerAction = (action) => {
    if (selectedObject) {
      switch (action) {
        case "bringForward":
          selectedObject.bringForward();
          selectedObject.canvas.requestRenderAll(); // Add this line
          setSelectedpopup(!selectedpopup);
          break;
        case "sendBackward":
          selectedObject.sendBackwards();
          selectedObject.canvas.requestRenderAll(); // Add this line
          break;
        case "bringToFront":
          selectedObject.bringToFront();
          selectedObject.canvas.requestRenderAll(); // Add this line
          break;
        case "sendToBack":
          selectedObject.sendToBack();
          selectedObject.canvas.requestRenderAll(); // Add this line
          break;
        default:
          break;
      }
    }
  };


  // useEffect(() =>{
  //   const st = setTimeout(() =>{
  //    syncMirrorCanvas(activeSide);
  //   },3000);
  // },[textContaintObject,activeSide])

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
