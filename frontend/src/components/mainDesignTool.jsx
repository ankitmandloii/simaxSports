import React, { useEffect, useRef, useMemo, useState } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import "./MainDesigntool.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTextState,
  setSelectedTextState,
  updateTextState,
} from "../redux/FrontendDesign/TextFrontendDesignSlice";
import { useNavigate } from "react-router-dom";
import LayerModal from "./CommonComponent/layerComponent/layerComponent";
import CurvedText from "./fabric/fabric.TextCurved"; // Adjust path if needed
fabric.CurvedText = CurvedText;
const MainDesignTool = ({
  id,
  backgroundImage,
  mirrorCanvasRef,
  initialDesign,
}) => {
  console.log("-------id", id);
  const activeSide = useSelector(
    (state) => state.TextFrontendDesignSlice.activeSide
  );
  console.log("active side", activeSide);
  const [lastTranform, setLastTranform] = useState(null);
  const textContaintObject = useSelector(
    (state) => state.TextFrontendDesignSlice.present[activeSide].texts
  );
  const isRender = useSelector(
    (state) => state.TextFrontendDesignSlice.present[activeSide].setRendering
  );
  console.log("textContaintObject", textContaintObject);

  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId)
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedpopup, setSelectedpopup] = useState(false);

  const [selectedHeight, setSelectedHeight] = useState("");
  const mirrorFabricRef = useRef(null);

  const globalDispatch = (lable, value, id) => {
    dispatch(
      updateTextState({
        ["id"]: id,
        changes: { [lable]: value },
      })
    );
  };

  useEffect(() => {
    const canvas = new fabric.StaticCanvas(canvasRef.current);
    mirrorCanvasRef.current = canvas;

    // Load saved design if exists
    if (initialDesign) {
      canvas.loadFromJSON(initialDesign, () => {
        canvas.renderAll();
      });
    }

    return () => {
      mirrorCanvasRef.current = null;
      canvas.dispose();
    };
  }, []);

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
    //console.log("delete object called", transform.target.id);
    const canvas = transform.target.canvas;
    dispatch(deleteTextState(transform.target.id));
    canvas.remove(transform.target);
    canvas.requestRenderAll();
    setSelectedHeight("");
    navigate("/product");
  };
  const bringForward = (eventData, transform) => {
    alert("bring to Farward");
    setSelectedpopup(!selectedpopup);
    const target = transform.target;
    target.canvas.bringForward(target);
    target.canvas.requestRenderAll();
  };

  const sendBackward = (eventData, transform) => {
    alert("send to back");
    const target = transform.target;
    target.canvas.sendBackwards(target);
    target.canvas.requestRenderAll();
  };

  const bringToFront = (eventData, transform) => {
    alert("bring to front");
    const target = transform.target;
    target.canvas.bringToFront(target);

    target.canvas.requestRenderAll();
  };
  const bringPopup = () => {
    //  setSelectedpopup(!selectedpopup)
    setIsModalOpen(true);
  };
  const bringToFrontt = (object) => {
    object.canvas.bringToFront(object);
    object.canvas.requestRenderAll();
  };

  const sendToBack = (eventData, transform) => {
    const target = transform.target;
    const canvas = target.canvas;

    const beforeIndex = canvas.getObjects().indexOf(target);
    //console.log("Before index:", beforeIndex);

    canvas.sendToBack(target);
    canvas.requestRenderAll();

    const afterIndex = canvas.getObjects().indexOf(target);
    //console.log("After index:", afterIndex);
  };

  const scaleFromCenter = (eventData, transform, x, y) => {
    transform.target.set({ centeredScaling: true });
    return fabric.controlsUtils.scalingEqually(eventData, transform, x, y);
  };

  const scaleXFromCenter = (eventData, transform, x, y) => {
    transform.target.set({ centeredScaling: true });
    return fabric.controlsUtils.scalingX(eventData, transform, x, y);
  };

  const scaleYFromCenter = (eventData, transform, x, y) => {
    transform.target.set({ centeredScaling: true });
    return fabric.controlsUtils.scalingY(eventData, transform, x, y);
  };

  const rotateWithCenter = (eventData, transform, x, y) => {
    transform.target.set({ centeredRotation: true });
    return fabric.controlsUtils.rotationWithSnapping(
      eventData,
      transform,
      x,
      y
    );
  };

  const handleHeightChange = (e) => {
    const value = parseFloat(e.target.value);
    setSelectedHeight(e.target.value);
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject && !isNaN(value)) {
      activeObject.set("scaleY", value / activeObject.height);
      canvas.requestRenderAll();
    }
  };

  const handleObjectSelection = (e) => {
    const obj = e.selected?.[0];
    if (obj && obj.height) {
      const actualHeight = obj.height * obj.scaleY;
      setSelectedHeight(actualHeight.toFixed(0));
    }
  };


 const syncMirrorCanvas = () => {
    // return;

    const parent = document.querySelector(".corner-img-canva-container");

    const w = parent.clientWidth;
    const h = parent.clientHeight - 30;
    //console.log(mirrorCanvasRef.current, "dafh")
    const mirrorCanvas = mirrorCanvasRef.current;
    const mainCanvas = fabricCanvasRef.current;

    if (!mirrorCanvas || !mainCanvas) return;

    const json = mainCanvas.toJSON();

    console.log(json, "json data");

    // return;

    mirrorCanvas.loadFromJSON(json, () => {
      const originalWidth = mainCanvas.getWidth();
      const originalHeight = mainCanvas.getHeight();

      // Target mirror canvas size
      const mirrorWidth = w;
      const mirrorHeight = h;

      // Scale ratio (fit while maintaining aspect ratio)
      const scale = Math.min(
        mirrorWidth / originalWidth,
        mirrorHeight / originalHeight
      );

      // Calculate offset to center content
      const offsetX = (mirrorWidth - originalWidth * scale) / 2;
      const offsetY = (mirrorHeight - originalHeight * scale) / 2;

      // Set mirror canvas size
      mirrorCanvas.setWidth(mirrorWidth);
      mirrorCanvas.setHeight(mirrorHeight);

      // Scale and reposition each object

      mirrorCanvas.getObjects().forEach((obj) => {
        obj.scaleX *= scale;
        obj.scaleY *= scale;
        obj.left = obj.left * scale + offsetX;
        obj.top = obj.top * scale + offsetY;
        obj.setCoords();
      });

      // Set background color
      mirrorCanvas.setBackgroundColor(
        "white",
        mirrorCanvas.renderAll.bind(mirrorCanvas)
      );

      // Scale and center background image
      const extraScale = 1.1; // slightly enlarge

      const bgImage = mainCanvas.backgroundImage;
      if (bgImage) {
        bgImage.clone((clonedBg) => {
          // Get mirror canvas size
          const canvasW = mirrorCanvas.getWidth();
          const canvasH = mirrorCanvas.getHeight();

          // Original image size
          const imgW = bgImage.width || bgImage._element?.naturalWidth;
          const imgH = bgImage.height || bgImage._element?.naturalHeight;

          // Scale to fit while maintaining aspect ratio
          const bgScale = Math.min(canvasW / imgW, canvasH / imgH) * extraScale;

          clonedBg.set({
            originX: "center",
            originY: "center",
            scaleX: bgScale,
            scaleY: bgScale,
            left: canvasW / 2,
            top: canvasH / 2,
          });

          mirrorCanvas.setBackgroundImage(
            clonedBg,
            mirrorCanvas.renderAll.bind(mirrorCanvas)
          );
        });
      } else {
        mirrorCanvas.renderAll();
      }
    });
  };



  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 650,
      height: 700,
      // backgroundColor: "#f1f1f1",
      // backgroundColor: "gray",
    });

    canvas.preserveObjectStacking = true;
    fabricCanvasRef.current = canvas;
    // fabricCanvasRef.current

    mirrorCanvasRef.current = new fabric.StaticCanvas(id);
    const boundaryBox = new fabric.Rect({
      left: 215,
      top: 170,
      width: 220,
      height: 355,
      fill: "transparent",
      stroke: "skyblue",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      visible: false, // initially hidden
    });
    const warningText = new fabric.Text(
      "Please keep design inside the box",
      {
        left: boundaryBox.left + 2,
        top: boundaryBox.top,
        fontSize: 16,
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
      }
    );

    canvas.add(warningText);

    // Boundary Box (initially hidden)

    canvas.add(boundaryBox);

    // Utility: check if object is fully inside boundaryBox
    function isInsideBoundary(obj, boundary) {
      const objBounds = obj.getBoundingRect();
      const boxBounds = boundary.getBoundingRect();

      return (
        objBounds.left >= boxBounds.left &&
        objBounds.top >= boxBounds.top &&
        objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
        objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
      );
    }

    // Toggle visibility based on text objects inside boundary
    function updateBoundaryVisibility() {
      const textObjects = canvas.getObjects().filter((obj) => obj.type === "curved-text"); // future me add karna hai obj.type == image
      console.log(textObjects, "textObjects")

      textObjects.forEach((obj) => obj.setCoords()); // ensure up-to-date bounds

      const allInside = textObjects.every((obj) => {
        const objBounds = obj.getBoundingRect(true); // consider transformations
        const boxBounds = boundaryBox.getBoundingRect(true);

        return (
          objBounds.left >= boxBounds.left &&
          objBounds.top >= boxBounds.top &&
          objBounds.left + objBounds.width <=
          boxBounds.left + boxBounds.width &&
          objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
        );
      });

      boundaryBox.visible = !allInside;
      warningText.visible = !allInside;

      canvas.bringToFront(boundaryBox);
      canvas.bringToFront(warningText);
      canvas.requestRenderAll();
    }

    // Attach to relevant events
    canvas.on("object:added", updateBoundaryVisibility);
    canvas.on("object:modified", updateBoundaryVisibility);
    canvas.on("object:moving", updateBoundaryVisibility);
    canvas.on("object:scaling", updateBoundaryVisibility);

    // Load background image if present
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

          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          syncMirrorCanvas();
        },
        { crossOrigin: "anonymous" }
      );
    }

    canvas.on("selection:created", (e) => {
      if (e.selected.length > 1) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      } else {
        handleObjectSelection(e);
      }
    });

    canvas.on("selection:updated", (e) => {
      if (e.selected.length > 1) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      } else {
        handleObjectSelection(e);
      }
    });
    canvas.on("selection:created", (e) => {
      if (e.selected.length === 1) {
        setSelectedObject(e.selected[0]);
      }
    });
    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    canvas.on("object:modified", syncMirrorCanvas);

    const handleSelectionCleared = () => {
      dispatch(setSelectedTextState(null));
      // navigate("/product");
    };

    canvas.on("selection:cleared", handleSelectionCleared);


    

    return () => {
      // canvas.dispose();
    };
  }, [iconImages, id, backgroundImage]);

  useEffect(() => {
    console.log("renderiing on layer index changed");
    const canvas = fabricCanvasRef.current;
    if (textContaintObject && textContaintObject.length == 0) {
      let existingTextbox = canvas.getObjects();
      existingTextbox.forEach((obj) => canvas.remove(obj));
      return;
    }

   
    if (Array.isArray(textContaintObject)) {
      textContaintObject.forEach((textInput) => {
        console.log("text input daata", textInput);
        const isCurved = textInput.arc > 0;
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

        console.log("existing object", existingObj);
        if (existingObj) {

          existingObj.set({
            width: Math.min(measuredWidth + 20, 200),
          });
          existingObj.set({
            text: textInput.content,
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
            // width: Math.min(measuredWidth + 20, 200),
          });

          existingObj.dirty = true;
          existingObj.setCoords();
          canvas.requestRenderAll();
          canvas.renderAll();
        } else if (!existingObj) {
          const curved = new fabric.CurvedText(textInput.content, {
            id: textInput.id,
            left: textInput.position.x || 300,
            top: textInput.position.y || 300,
            stroke: textInput.outLineColor || "",
            strokeWidth: textInput.outLineSize || 0,
            fill: textInput.textColor || "white",
            spacing: textInput.spacing,
            warp: Number(textInput.arc),
            fontSize: 16,
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
            borderColor: "skyblue",
            borderDashArray: [4, 4],
            hasBorders: true,
          });

          curved.on("mousedown", () => {
            dispatch(setSelectedTextState(textInput.id));
            navigate("/addText", { state: textInput });
          });

          curved.on("modified", (e) => {

            
            const obj = e.target;
            if (!obj) return;

            const center = obj.getCenterPoint();

            const MAX_SCALE = 10;
            const MIN_SCALE = 1;

            // Use textInput as base scale
            const baseScaleX = Number(textInput.scaleX) || 1;
            const baseScaleY = Number(textInput.scaleY) || 1;

            let deltaScaleX = obj.scaleX;
            let deltaScaleY = obj.scaleY;

            const isUniform = Math.abs(deltaScaleX - deltaScaleY) < 0.001;

            let finalScaleX, finalScaleY;

            if (isUniform) {
              // Uniform scaling adds to both axes
              const additiveScale = deltaScaleX;
              finalScaleX = clampScale(baseScaleX + (additiveScale - 1));
              finalScaleY = clampScale(baseScaleY + (additiveScale - 1));
            } else {
              // Non-uniform: preserve individual axis scaling
              finalScaleX = clampScale(deltaScaleX);
              // obj.height = (obj*finalScaleY);
              finalScaleY = clampScale(deltaScaleY);
              // obj.width = (obj*finalScaleX);
            }

            obj.scaleX = finalScaleX;
            obj.scaleY = finalScaleY;

            obj.setPositionByOrigin(center, 'center', 'center');
            obj.setCoords();

            // Dispatch based on whether it was uniform or not
            globalDispatch("scaleX", parseFloat(finalScaleX.toFixed(1)), textInput.id);
            globalDispatch("scaleY", parseFloat(finalScaleY.toFixed(1)), textInput.id);
            // globalDispatch("originalScaleY", parseFloat(finalScaleY.toFixed(1)), textInput.id);
            // globalDispatch("originalScaleX", parseFloat(finalScaleX.toFixed(1)), textInput.id);

            globalDispatch("scaledValue", parseFloat(finalScaleX.toFixed(1)), textInput.id);
            globalDispatch("position", { x: obj.left, y: obj.top }, textInput.id);
            globalDispatch("rotate", obj.angle, textInput.id);

            canvas.renderAll();

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
    }
  }, [activeSide, isRender, dispatch, id, textContaintObject]);

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
    console.log("selectedTextId", selectedTextId, object)
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



  return (
    <div style={{ position: "relative" }} id="">
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
