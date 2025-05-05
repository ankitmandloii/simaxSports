import React, { useEffect, useRef, useMemo, useState } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import "./MainDesigntool.css"
import { useSelector } from "react-redux";
const MainDesignTool = ({ backgroundImage, mirrorCanvasRef }) => {

    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    // const mirrorCanvasRef = useRef(null);
    const textContentState = useSelector((state) => state.canvas.text);
    const textColorState = useSelector((state) => state.canvas.textColor);
    const fontFamilyState = useSelector((state) => state.canvas.fontFamily);
    const sizeState = useSelector((state) => state.canvas.size);
    const arcState = useSelector((state) => state.canvas.arc);
    const rotateState = useSelector((state) => state.canvas.rotate);
    const spacingState = useSelector((state) => state.canvas.spacing);
    const outLineColorState = useSelector((state) => state.canvas.outLineColor);
    const outLineSizeState = useSelector((state) => state.canvas.outLineSize);
    const centerState = useSelector((state)=> state.canvas.center);
    const flipXYState = useSelector((state)=> state.canvas.flipXY);

    const [selectedHeight, setSelectedHeight] = useState("");
    const mirrorFabricRef = useRef(null);


    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
       
       
        const textbox = canvas.getActiveObject();

        // const textbox = canvas.getObjects().find(obj => obj.type === "textbox");
        if (!textbox || textbox.type !== 'textbox') return;
        if (textbox) {
            let updated = false;

            if (textContentState !== textbox.text) {
                textbox.text = textContentState;
                updated = true;
            }

            if (textbox.fill !== textColorState) {
                textbox.fill= textColorState; // Set text color
                updated = true;
            }

            if (textbox.fontFamily !== fontFamilyState) {
                textbox.fontFamily = fontFamilyState; // Set font family
                updated = true;
            }

            if (textbox.fontSize !== sizeState) {
                textbox.fontSize = sizeState; // Set font size
                updated = true;
            }

            // if (textbox.strokeWidth !== arcState) {
            //     textbox.set("strokeWidth", arcState); // Set stroke width
            //     updated = true;
            // }

            if (textbox.angle !== rotateState) {
                textbox.angle = rotateState; // Set rotation angle
                updated = true;
            }

            if (textbox.charSpacing !== spacingState) {
                textbox.charSpacing = spacingState; // Set character spacing
                updated = true;
            }

            if (textbox.stroke !== outLineColorState) {
                textbox.stroke = outLineColorState;
              
                updated = true;
            }
            if (textbox.strokeWidth !== outLineSizeState) {
               textbox.strokeWidth = outLineSizeState;
              
                updated = true;
            }

            if (textbox.textAlign !== centerState) {
                textbox.textAlign = centerState; // Set character spacing
                updated = true;
            }

            if (textbox.scaleX !== flipXYState) {
                textbox.scaleX =  flipXYState;
                updated = true;
            }

        

            if (updated) {
                canvas.requestRenderAll();
                syncMirrorCanvas(); // reflect changes in mirror if needed
            }
        }
    }, [textColorState, textContentState, fontFamilyState, sizeState, arcState, rotateState, spacingState, outLineSizeState, outLineColorState,flipXYState,centerState]);

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

        const parent = document.querySelector(".corner-img-canva-container");

        const w = parent.clientWidth;
        const h = parent.clientHeight - 30;
        console.log(mirrorCanvasRef.current, "dafh")
        const mirrorCanvas = mirrorCanvasRef.current;
        const mainCanvas = fabricCanvasRef.current;

        if (!mirrorCanvas || !mainCanvas) return;

        const json = mainCanvas.toJSON();

        mirrorCanvas.loadFromJSON(json, () => {
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
            // backgroundColor: "gray",
        });
        fabricCanvasRef.current = canvas;

        mirrorCanvasRef.current = new fabric.StaticCanvas(mirrorCanvasRef.current);
        // const mirrorEl = document.getElementById("mirrorCanvas");
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

        const textbox = new fabric.Textbox(textContentState || "Default text", {
            top: 100,
            left: 320,
            originX: "center",
            // textAlign: centerState,
            // fontSize: 24,
            width: 100,
            // fill: textColorState || "#000000",
            // fontFamily: "Segoe UI",
            objectCaching: false,
            borderColor: "orange",
            borderDashArray: [4, 4],
            hasBorders: true,

            editable: false,   // ensures non-editable
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
                    const scaleX = 590 / img.width;
                    const scaleY = 450 / img.height;

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
        // canvas.on("object:added", syncMirrorCanvas);
        // canvas.on("object:removed", syncMirrorCanvas);
        // canvas.on("object:scaling", syncMirrorCanvas);
        // canvas.on("object:moving", syncMirrorCanvas);
        // canvas.on("object:rotating", syncMirrorCanvas);

        canvas.on("selection:cleared", () => setSelectedHeight(""));

        return () => canvas.dispose();
    }, [iconImages]);

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



            {/* <ul className='ProductContainerListButtton'>
                <li><button className='ProductContainerButton'><span><TbArrowBack /></span>UNDO</button></li>
                <li><button className='ProductContainerButton'><span><TbArrowForwardUp /></span>REDO</button></li>
                <li><button className='ProductContainerButton'>START OVER</button></li>
            </ul> */}

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