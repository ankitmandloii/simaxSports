import React, { useEffect, useRef, useMemo, useState } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import "./MainDesigntool.css"
import { useDispatch, useSelector } from "react-redux";
import { deleteTextState, setSelectedTextState, updateTextState } from "../redux/FrontendDesign/TextFrontendDesignSlice";
import { useNavigate } from "react-router-dom";
import LayerModal from "./CommonComponent/layerComponent/layerComponent";


const MainDesignTool = ({ id, backgroundImage, mirrorCanvasRef, initialDesign }) => {
    const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
    console.log("active side",activeSide);
    const textContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
    const isRender = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].setRendering);
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

 
    const [selectedpopup, setSelectedpopup] = useState(false);


    const [selectedHeight, setSelectedHeight] = useState("");
    const mirrorFabricRef = useRef(null);


    const globalDispatch = (lable, value, id) => {
        dispatch(updateTextState({
            ["id"]: id,
            changes: { [lable]: value },
        }));
    }

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
    const syncMirrorCanvas = () => {

        const parent = document.querySelector(".corner-img-canva-container");

        const w = parent.clientWidth;
        const h = parent.clientHeight - 30;
        //console.log(mirrorCanvasRef.current, "dafh")
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
        bringToFrontControl: new fabric.Control({
            x: -0.5,
            y: 0.7,
            offsetX: -16,
            offsetY: 32,
            cursorStyle: "pointer",
            mouseUpHandler: bringPopup,
            render: renderIcon("layer"), // use appropriate icon
            cornerSize: 20,
        }),
        
        // bringForwardControl: new fabric.Control({
        //     x: -0.5,
        //     y: 0.5,
        //     offsetX: -16,
        //     offsetY: 16,
        //     cursorStyle: "pointer",
        //     mouseUpHandler: bringForward,
            
        //     render: renderIcon("layerUp"), // use appropriate icon
        //     cornerSize: 20,
        // }),
        // sendBackwardControl: new fabric.Control({
        //     x: -0.7,
        //     y: 0.5,
        //     offsetX: -32,
        //     offsetY: 16,
        //     cursorStyle: "pointer",
        //     mouseUpHandler: sendBackward,
        //     render: renderIcon("layerDown"), // use appropriate icon
        //     cornerSize: 20,
        // }),
        // bringToFrontControl: new fabric.Control({
        //     x: -0.5,
        //     y: 0.7,
        //     offsetX: -16,
        //     offsetY: 32,
        //     cursorStyle: "pointer",
        //     mouseUpHandler: bringToFront,
        //     render: renderIcon("layerTop"), // use appropriate icon
        //     cornerSize: 20,
        // }),
        // sendToBackControl: new fabric.Control({
        //     x: -0.7,
        //     y: 0.7,
        //     offsetX: -32,
        //     offsetY: 32,
        //     cursorStyle: "pointer",
        //     mouseUpHandler: sendToBack,
        //     render: renderIcon("layerBottom"), // use appropriate icon
        //     cornerSize: 20,
        // }),
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
        alert("bring to Farward")
        setSelectedpopup(!selectedpopup)
        const target = transform.target;
        target.canvas.bringForward(target);
        target.canvas.requestRenderAll();
    };
  


    const sendBackward = (eventData, transform) => {
        alert("send to back")
        const target = transform.target;
        target.canvas.sendBackwards(target);
        target.canvas.requestRenderAll();
    };

    const bringToFront = (eventData, transform) => {
        alert("bring to front")
        const target = transform.target;
        target.canvas.bringToFront(target);
        target.canvas.requestRenderAll();
    };
    const bringPopup=()=>{
        //  setSelectedpopup(!selectedpopup)
         setIsModalOpen(true)
    }
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
        canvas.preserveObjectStacking = true;
        fabricCanvasRef.current = canvas;


        // const canvasEl = document.getElementById('mirrorCanvasRef');
        mirrorCanvasRef.current = new fabric.StaticCanvas(id);
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




        // fabric.Image.fromURL("https://www.k12digest.com/wp-content/uploads/2024/03/1-3-550x330.jpg", (img) => {
        //     img.set({
        //         left: 400,
        //         top: 300,
        //         scaleX: 0.5,
        //         scaleY: 0.5,
        //         objectCaching: false,
        //         borderColor: "orange",
        //         borderDashArray: [4, 4],
        //         hasBorders: true,
        //     });
        //     img.setControlsVisibility({
        //         mt: false, mb: false, ml: false, mr: false,
        //         tl: false, tr: false, bl: false, br: false, mtr: false,
        //     });
        //     img.controls = createControls();
        //     canvas.add(img);
        //     syncMirrorCanvas();
        // });
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
                    syncMirrorCanvas();
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
        canvas.on("selection:created", (e) => {
    if (e.selected.length === 1) {
        setSelectedObject(e.selected[0]);
    }
});
canvas.on("selection:cleared", () => {
    setSelectedObject(null);
});

        canvas.on("object:modified", syncMirrorCanvas);


        canvas.on('object:scaling', function (e) {
            const obj = e.target;
        
            const MAX_WIDTH = 250;
            const MAX_HEIGHT = 250;
            const MIN_WIDTH = 20;
            const MIN_HEIGHT = 20;
        
            const currentWidth = obj.width * obj.scaleX;
            const currentHeight = obj.height * obj.scaleY;
        
            let newScaleX = obj.scaleX;
            let newScaleY = obj.scaleY;
        
            if (currentWidth > MAX_WIDTH) {
                newScaleX = MAX_WIDTH / obj.width;
            } else if (currentWidth < MIN_WIDTH) {
                newScaleX = MIN_WIDTH / obj.width;
            }
        
            if (currentHeight > MAX_HEIGHT) {
                newScaleY = MAX_HEIGHT / obj.height;
            } else if (currentHeight < MIN_HEIGHT) {
                newScaleY = MIN_HEIGHT / obj.height;
            }
        
            // Only update if changed
            if (newScaleX !== obj.scaleX || newScaleY !== obj.scaleY) {
                const center = obj.getCenterPoint(); // store center before clamping
                obj.scaleX = newScaleX;
                obj.scaleY = newScaleY;
                obj.setPositionByOrigin(center, 'center', 'center'); // restore center
                obj.setCoords();
            }
        });
        
        // canvas.on("object:added", syncMirrorCanvas);
        // canvas.on("object:removed", syncMirrorCanvas);
        // canvas.on("object:scaling", syncMirrorCanvas);
        // canvas.on("object:moving", syncMirrorCanvas);
        // canvas.on("object:rotating", syncMirrorCanvas);


        // return () => canvas.dispose();
    }, [iconImages,id]);


    useEffect(() => {
        const canvas = fabricCanvasRef.current;

        if (Array.isArray(textContaintObject)) {
            textContaintObject.forEach((textInput) => {
                console.log(textInput, "input data")
                // Check if the text object already exists by ID
                if (canvas) {
                    let existingTextbox = canvas.getObjects().find(obj => obj.id === textInput.id);

                    setSelectedObject(existingTextbox);


                    if (existingTextbox) {
                        // Update the existing text object
                        const context = canvas.getContext();
                        context.font = `${existingTextbox.fontSize}px ${existingTextbox.fontFamily}`;
                        const measuredWidth = context.measureText(textInput.content).width;
                        
                        if(textInput.content == "" || textInput.content.trim() === ""){
                            canvas.remove(existingTextbox);
                            return
                        }
                        existingTextbox.set({
                            width: Math.min(measuredWidth + 20, 300) // add padding to avoid wrapping
                        });
                        canvas.requestRenderAll();


                        console.log("fontsize store in redux", textInput.size);
                        existingTextbox.set({
                            text: textInput.content.trim(),
                            top: textInput.position.y || 100,
                            left: textInput.position.x || 110,
                            fontSize: textInput.size,
                            angle: textInput.rotate || 0,
                            charSpacing: textInput.spacing || 0,
                            fill: textInput.textColor || '#000000',
                            fontFamily: textInput.fontFamily || 'Arial',
                            textAlign: textInput.center || 'center',
                            stroke: textInput.outLineColor || "", //outline color
                            strokeWidth: textInput.outLineSize || 0, //outline size
                            flipX: textInput.flipX,
                            flipY: textInput.flipY,
                            splitByGrapheme: true,
                            minWidth: 100,
                        });

                        // Re-render the canvas to reflect changes
                        existingTextbox.setCoords(); // Updates the coordinates for the controls and bounding box
                        canvas.requestRenderAll();
                    } else {
                        // If the text object doesn't exist, create a new one
                        const textbox = new fabric.Textbox(textInput.content, {
                            id: textInput.id,
                            top: textInput.position.y || 100, // Provide fallback values if position is undefined
                            left: textInput.position.x || 110,
                            originX: 'center',
                            textAlign: textInput.center || 'center',
                            fontSize: textInput.size,  // Default font size if undefined
                            fill: textInput.textColor ,  // Default text color if undefined
                            fontFamily: textInput.fontFamily || 'Arial',  // Default font family if undefined
                            textAlign: textInput.center ,
                            stroke: textInput.outLineColor  , //outline color
                            strokeWidth: textInput.outLineSize ||    0, //outline size
                            flipX: textInput.flipX,
                            flipY: textInput.flipY,
                            angle: textInput.rotate || 0,
                            objectCaching: false,
                            borderColor: 'orange',
                            borderDashArray: [4, 4],
                            hasBorders: true,

                            wordWrap: false,  // Disable word wrapping
                            editable: false,   // Ensures non-editable
                        });
                       
                        const context = canvas.getElement().getContext("2d");
                        context.font = `${textbox.fontSize}px ${textbox.fontFamily}`;
                        const measuredWidth = context.measureText(textInput.content).width;
                        textbox.set({
                          width: Math.min(measuredWidth + 20, 300) // add padding and cap
                        });
                        textbox.controls = createControls();
                        canvas.add(textbox);

                        setSelectedObject(textbox);


                        // Ensure that the textbox width is calculated properly when the content changes
                        textbox.on('changed', (e) => {
                            //console.log(e, "text data")
                            const textWidth = textbox.calcTextWidth();
                            const padding = 30;
                            const newWidth = Math.max(textWidth + padding, 150); // Minimum width
                            textbox.set({ width: newWidth });
                            canvas.requestRenderAll();
                        });


                        textbox.on("mousedown", (e) => {

                            dispatch(setSelectedTextState(textInput.id));
                            navigate("/addText",
                                {
                                    state: textInput
                                }
                            )
                        });



                        textbox.on("modified", (e) => {
                            const target = e.target;
                        
                            // Dispatch final position
                            globalDispatch("position", { x: target.left, y: target.top }, textInput.id);
                        
                            // Dispatch final rotation
                            globalDispatch("rotate", target.angle, textInput.id);
                        
                            // Calculate final font size based on Y-scale applied during transform
                            const originalFontSize = textInput.size;
                            const finalFontSize = Math.min(50, Math.round(originalFontSize * target.scaleY));
                        
                            console.log("fontsize calculate in toolbar", finalFontSize);
                        
                            // Find the existing textbox
                            let existingTextbox = canvas.getObjects().find(obj => obj.id === textInput.id);
                        
                            // Check if the textbox exists
                            if (existingTextbox) {
                                // existingTextbox.set({
                                //     fontSize: finalFontSize
                                // });
                        
                                // Dispatch the new font size
                                // globalDispatch("size", finalFontSize, textInput.id);
                        
                                // Render canvas again to apply changes
                                canvas.requestRenderAll();
                            } else {
                                console.warn("Textbox not found on canvas for id:", textInput.id);
                            }
                        });
                        
                        // Set visibility of the controls (resize and rotate)
                        textbox.setControlsVisibility({
                            mt: false, mb: false, ml: false, mr: false,
                            tl: false, tr: false, bl: false, br: false, mtr: false,
                        });

                        // Add the textbox to the canvas
                        canvas.setActiveObject(textbox);  // Set the new object as the active object on the canvas
                        canvas.requestRenderAll();  // Re-render the canvas to reflect changes
                    }
                }
            });
        }
    }, [activeSide,isRender, dispatch,id]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
const handleLayerAction = (action) => {
     if (selectedObject) {
         switch (action) {
             case 'bringForward':
                 selectedObject.bringForward();
                 selectedObject.canvas.requestRenderAll();  // Add this line
                 setSelectedpopup(!selectedpopup);
                 break;
             case 'sendBackward':
                 selectedObject.sendBackwards();
                 selectedObject.canvas.requestRenderAll();  // Add this line
                 break;
             case 'bringToFront':
                 selectedObject.bringToFront();
                 selectedObject.canvas.requestRenderAll();  // Add this line
                 break;
             case 'sendToBack':
                 selectedObject.sendToBack();
                 selectedObject.canvas.requestRenderAll();  // Add this line
                 break;
             default:
                 break;
         }
     }
 };

    // const handleLayerAction = (action) => {
    //     if (selectedObject) {
    //         switch (action) {
    //             case 'bringForward':
    //                 selectedObject.bringForward();
    //                 setSelectedpopup(!selectedpopup)
    //                 break;
    //             case 'sendBackward':
    //                 selectedObject.sendBackwards();
    //                 break;
    //             case 'bringToFront':
    //                 selectedObject.bringToFront();
    //                 break;
    //             case 'sendToBack':
    //                 selectedObject.sendToBack();
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // };


    return (
        <div style={{ position: "relative" }} id="">
            <canvas ref={canvasRef} />
       

            <LayerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLayerAction={handleLayerAction}
            />
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