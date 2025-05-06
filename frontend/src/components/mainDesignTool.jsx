import React, { useEffect, useRef, useMemo, useState } from "react";
import { fabric ,canvas} from "fabric";
import icons from "../data/icons";
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import "./MainDesigntool.css"
const MainDesignTool = ({ backgroundImage, mirrorCanvasRef, isFront }) => {

    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [redoStack, setRedoStack] = useState([]);
    const [update,setUpdate] = useState(true);
    const [isRestoring,setIsRestoring] = useState(false);
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // const mirrorCanvasRef = useRef(null);

    const recordState = () => {
        const json = fabricCanvasRef.current.toJSON();
        const lastJson = history[history.length - 1];

        if (JSON.stringify(lastJson) !== JSON.stringify(json)) {
          const updatedHistory = [...history.slice(0, currentIndex + 1), json];
          // Limit history to last 50 states
          if (updatedHistory.length > 50) {
            updatedHistory.shift();
          }
          setHistory(updatedHistory);
          console.log(updatedHistory);
          
          setCurrentIndex(updatedHistory.length - 1);
        }
      };


    const applyCustomControlsToAllObjects = () => {
        fabricCanvasRef.current.getObjects().forEach(obj => {
          obj.setControlsVisibility({
            mt: false, mb: false, ml: false, mr: false,
            tl: false, tr: false, bl: false, br: false, mtr: false,
          });
          obj.controls = createControls();
        });
        fabricCanvasRef.current.requestRenderAll();
      };    
 
      
      const saveHistory = () => {
        if (isRestoring) return;
        const json = fabricCanvasRef.current.toJSON(); // lighter and cleaner
        setHistory(prev => [...prev, json]);
        setRedoStack([]); // Clear redo on new action
      };
      
      const undo = () => {
        if (currentIndex > 0 && fabricCanvasRef.current) {
          const newIndex = currentIndex - 1;
          const json = history[newIndex];
          console.log("caling undo with this data",json)
          fabricCanvasRef.current.loadFromJSON(json, () => {
            applyCustomControlsToAllObjects();
            // fabricCanvasRef.current.renderAll();
            syncMirrorCanvas(json);
          });
          setCurrentIndex(newIndex);
        }
      };
    
      // Redo operation
      const redo = () => {
        if (currentIndex < history.length - 1 && fabricCanvasRef.current) {
          const newIndex = currentIndex + 1;
          const json = history[newIndex];
          fabricCanvasRef.current.loadFromJSON(json, () => {
            applyCustomControlsToAllObjects();
            syncMirrorCanvas(json);
          });
          setCurrentIndex(newIndex);
        }
      };
      
    


    const [selectedHeight, setSelectedHeight] = useState("");

    const iconImages = useMemo(() => {
        const imgs = {};
        for (const key in icons) {
            const img = new Image();
            img.src = icons[key];
            imgs[key] = img;
        }
        return imgs;
    }, []);

    const syncMirrorCanvas = () => {
        if (!mirrorCanvasRef.current || !mirrorCanvasRef) return;
        const parent = document.querySelector(".corner-img-canva-container");

        const w = parent.clientWidth;
        const h = parent.clientHeight - 30;
        console.log(mirrorCanvasRef.current, "dafh")
        const mirrorCanvas = mirrorCanvasRef.current;
        const mainCanvas = fabricCanvasRef.current;

        if (!mirrorCanvas || !mainCanvas) return;

        const json = mainCanvas.toJSON();

        mirrorCanvas.loadFromJSON(json, () => {
            console.log(json, "yhl")
            const originalWidth = mainCanvas.getWidth();
            const originalHeight = mainCanvas.getHeight();

            // Target mirror canvas size
            const mirrorWidth = w;
            const mirrorHeight = h;

            // Scale ratio (fit while maintaining aspect ratio)
            const scale = Math.min(mirrorWidth / originalWidth, mirrorHeight / originalHeight);

            // Calculate offset to center content
            const offsetX = (mirrorWidth - originalWidth * scale) / 2;
            const offsetY = (mirrorHeight - originalHeight * scale) / 2;

            // Set mirror canvas size
            mirrorCanvas.setWidth(mirrorWidth);
            mirrorCanvas.setHeight(mirrorHeight);

            // Scale and reposition each object
            mirrorCanvas.getObjects().forEach(obj => {
                obj.scaleX *= scale;
                obj.scaleY *= scale;
                obj.left = obj.left * scale + offsetX;
                obj.top = obj.top * scale + offsetY;
                obj.setCoords();
            });

            // Set background color
            mirrorCanvas.setBackgroundColor("white", mirrorCanvas.renderAll.bind(mirrorCanvas));

            // Scale and center background image
            const extraScale = 1.1; // slightly enlarge

            const bgImage = mainCanvas.backgroundImage;
            if (bgImage) {
                bgImage.clone(clonedBg => {
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

                    mirrorCanvas.setBackgroundImage(clonedBg, mirrorCanvas.renderAll.bind(mirrorCanvas));
                });
            } else {
                mirrorCanvas.renderAll();
            }
        });
    };








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
        layerControl: new fabric.Control({
            x: -0.5,
            y: 0.5,
            offsetX: -16,
            offsetY: 16,
            cursorStyle: "pointer",
            mouseUpHandler: bringForward,
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
        const canvas = transform.target.canvas;
        canvas.remove(transform.target);
        canvas.requestRenderAll();
        setSelectedHeight("");
    };

    const bringForward = (_eventData, transform) => {
        transform.target.canvas.bringForward(transform.target);
        transform.target.canvas.requestRenderAll();
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
        return fabric.controlsUtils.rotationWithSnapping(eventData, transform, x, y);
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

    useEffect(() => {
        // const parent = 
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 650,
            height: 410,
            // backgroundColor: "#f1f1f1",
            backgroundColor: "white",
        });
        fabricCanvasRef.current = canvas;

        const mirrorEl = document.getElementById(`${isFront ? "mirrorFrontCanvas" : "mirrorBackCanvas"}`);
        mirrorCanvasRef.current = new fabric.StaticCanvas(mirrorEl);
        // if (mirrorCanvasRef.current) {
        // }



        // Rectangle
        const rect = new fabric.Rect({
            left: 200,
            top: 200,
            width: 150,
            height: 100,
            objectCaching: false,
            borderColor: "orange",
            borderDashArray: [4, 4],
            hasBorders: true,
        });
        rect.setControlsVisibility({
            mt: false, mb: false, ml: false, mr: false,
            tl: false, tr: false, bl: false, br: false, mtr: false,
        });
        rect.controls = createControls();

        const textbox = new fabric.Textbox("Edit me", {
            top: 400,
            left: 200,
            originX: "center",
            textAlign: "center",
            fontSize: 24,
            width: 100,
            fill: "white",
            objectCaching: false,
            borderColor: "orange",
            borderDashArray: [4, 4],
            hasBorders: true,
        });

        textbox.controls = createControls();

        textbox.on("changed", () => {
            const newWidth = textbox.calcTextWidth() + 20;
            textbox.set({ width: newWidth });
            canvas.requestRenderAll();
        });

        textbox.setControlsVisibility({
            mt: false, mb: false, ml: false, mr: false,
            tl: false, tr: false, bl: false, br: false, mtr: false,
        });
        textbox.controls = createControls();

        canvas.add(textbox);
        canvas.setActiveObject(textbox);

        fabric.Image.fromURL("https://www.k12digest.com/wp-content/uploads/2024/03/1-3-550x330.jpg", (img) => {
            img.set({
                left: 400,
                top: 300,
                scaleX: 0.5,
                scaleY: 0.5,
                objectCaching: false,
                borderColor: "orange",
                borderDashArray: [4, 4],
                hasBorders: true,
            });
            img.setControlsVisibility({
                mt: false, mb: false, ml: false, mr: false,
                tl: false, tr: false, bl: false, br: false, mtr: false,
            });
            img.controls = createControls();
            canvas.add(img);
        });
        if (backgroundImage) {
            fabric.Image.fromURL(
                backgroundImage,
                (img) => {
                    const scaleX = 500 / img.width;
                    const scaleY = 400 / img.height;

                    img.set({
                        left: canvas.width / 2,
                        top: (canvas.height / 2),
                        originX: "center",
                        originY: "center",
                        scaleX,
                        scaleY,
                        selectable: false,
                        evented: false,
                    });

                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                },
                { crossOrigin: "anonymous" }
            );
        }


        // Disable transformer for multi-selection
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

        canvas.on("object:modified", syncMirrorCanvas);
        canvas.on("object:added", syncMirrorCanvas);
        canvas.on("object:removed", syncMirrorCanvas);
        const record = () => recordState();
        // canvas.on("object:scaling", record);
        // canvas.on("object:moving", record);
        // canvas.on("object:rotating", record);  


        // Save history only after actual user interaction
        // canvas.on("object:modified", record);
        // canvas.on("object:added", record);
        // canvas.on("object:removed", record);

        canvas.on("selection:cleared", () => setSelectedHeight(""));

        return () => {
            canvas.dispose();
        }
    }, [iconImages, isFront]);

    return (
        <div style={{ position: "relative" }} id="">
            <canvas ref={canvasRef} />

            {/* <div
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "90%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    gap: "15px",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
             
                <div className="corner-img-canva-container" id="mirror-container">
                    <canvas id="mirrorCanvas" width="300" height="180" />
                    <p>Front</p>
                </div>


                <div className="corner-img-canva-container">
                    <img src="https://media-hosting.imagekit.io/4570272ec5ff4b32/print-area-preview%20(1).png?Expires=1840690543&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=txGxSmU8hBTVjLgZQ6OsGAMdjOBRGS7COHqW5X7j055QDA3grzJnuybisR4jMv05WsNwewxRb4CWNr0ECd~rbT4VO~Yob42Pv5WaZkmvBpN-AmiXvNHWFZeEvApifCNCzt2P1A0yXocN9YbupjHIP7Q7RHDjLRS-YFIUOS0sxnrURrTfZ4lm7XolO1QLYYf1NDfYfIYyG1-NhduQ4~t5gJP6LaSAChQpFBfFHArat3SAENipDBhtIzzxH7P5Nc5G0uSmp4rlSKMzyaUL~ZGD~LEHO5QEaDJzetoEU6bl3m0tnsJrQ~FyCXWbrIy9Fj1i8TN0Z7kw-SUQkcWG24QZLA__"></img>
                    <p>Back</p>
                </div>

                <div className='ProductContainerSmallImageZoomButton'><span><VscZoomIn /></span>ZOOM</div>
            </div> */}



            <ul className='ProductContainerListButtton'>
                <li>
                    <button className='ProductContainerButton' onClick={undo}>
                        <span><TbArrowBack /></span>UNDO
                    </button>
                </li>
                <li>
                    <button className='ProductContainerButton' onClick={redo}>
                        <span><TbArrowForwardUp /></span>REDO
                    </button>
                </li>
            </ul>

        </div>
    );
};

const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "black",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease-in-out",
};

export default MainDesignTool;  