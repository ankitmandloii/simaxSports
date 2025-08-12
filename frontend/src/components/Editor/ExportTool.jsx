import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { fabric } from "fabric";
import style from "./MainDesignTool.module.css";
import { useDispatch, useSelector } from "react-redux";
import renderCurveTextObjects from "./Objects/renderTextObjects";
import renderAllImageObjects from "./Objects/renderAllImageObjects";
import renderNameAndNumber from "./Objects/renderNameAndNumberObject";
import CurvedText from "../fabric/fabric.TextCurved";
fabric.CurvedText = CurvedText;

const ExportTool = ({
    setUrl,
    backgroundImage,
    activeSide
}) => {

    const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);
    const nameAndNumberDesignState = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].nameAndNumberDesignState)
    const imageContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
    const textContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
    // **********************************************************************************************************************************************************
    //                                                                                    USE REFS AREA
    // **********************************************************************************************************************************************************
    const fabricCanvasRef = useRef(null);
    const canvasRef = useRef(null)

    const syncMirrorCanvasHelper = async () => {
        const fabricCanvas = fabricCanvasRef.current;
        if (!fabricCanvas) return; // Ensure fabricCanvas is set

        const getImageFromCanvas = async () => {
            const tempCanvas = new fabric.StaticCanvas(null, {
                width: fabricCanvas.getWidth(),
                height: fabricCanvas.getHeight(),
                backgroundColor: fabricCanvas.backgroundColor,
            });

            const objectClones = await Promise.all(
                fabricCanvas
                    .getObjects()
                    .filter((obj) => obj.type !== "text" && obj.type !== "rect")
                    .map((obj) => new Promise((resolve) => obj.clone((clone) => resolve(clone))))
            );

            objectClones.forEach((obj) => tempCanvas.add(obj));

            // Clone and apply background image if any
            if (fabricCanvas.backgroundImage) {
                const clonedBg = await new Promise((resolve) =>
                    fabricCanvas.backgroundImage.clone((clone) => resolve(clone))
                );
                tempCanvas.setBackgroundImage(clonedBg, () => tempCanvas.renderAll());
            } else {
                tempCanvas.renderAll();
            }

            await new Promise((resolve) => requestAnimationFrame(resolve)); // Ensure the rendering is complete
            return tempCanvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
        };

        const url = await getImageFromCanvas();
        console.log("Exported URL: ", url);
        setUrl(url); // Set the exported URL
    };

    useEffect(() => {
        const canvasElement = canvasRef.current;
        // if (!canvasElement) return; // Ensure the canvas element exists
        const wrapperElement = canvasElement.parentNode;
        // if (!wrapperElement) return; // Ensure the wrapper exists
        const canvasWidth = wrapperElement.clientWidth;
        const canvasHeight = wrapperElement.clientHeight;
        const canvas = new fabric.Canvas(canvasElement, {
            width: canvasWidth,
            height: canvasHeight,
        });

        fabricCanvasRef.current = canvas;

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
                    //   updateBoundaryVisibility(fabricCanvasRef);
                },
                { crossOrigin: "anonymous" }
            );
        }
        // renderCurveTextObjects();
        renderCurveTextObjectsHelper();
        // renderNameAndNumberHelper(); //note : we have to call it for render object after canvas initialize
        renderAllImageObjectsHelper();

        return () => {
            canvas.dispose();
        };

    }, [backgroundImage, activeSide]);


    const renderCurveTextObjectsHelper = (activeSide) => {
        if (textContaintObject && textContaintObject.length > 0) {
            const canvas = fabricCanvasRef.current;
            textContaintObject.forEach((textInput) => {
                const canvas = fabricCanvasRef.current;

                const text = textInput.content || "";
                const charSpacing = textInput.spacing || 0;
                const fontSize = 60;

                const clampScale = (value, min = 1, max = 10) =>
                    Math.max(min, Math.min(value, max));

                const context = canvas.getElement().getContext("2d");
                context.font = `${fontSize}px ${textInput.fontFamily || "Arial"}`;
                const baseWidth = context.measureText(text).width;
                const extraSpacing = (text.length - 1) * (charSpacing / 1000) * fontSize;
                const measuredWidth = baseWidth + extraSpacing;
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
                canvas.add(curved);
            });
            canvas.renderAll();
        }

    }
    const renderAllImageObjectsHelper = (activeSide) => {
        if (imageContaintObject && imageContaintObject.length > 0) {
            const canvas = fabricCanvasRef.current;
            const MAX_WIDTH = 180;
            const MAX_HEIGHT = 180;

            const getScaled = (img, userScaleX = 1, userScaleY = 1) => {
                const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
                return {
                    scaleX: scale * userScaleX,
                    scaleY: scale * userScaleY,
                };
            };
            imageContaintObject.forEach((imageData) => {
                const {
                    id,
                    src,
                    position,
                    angle = 0,
                    flipX = false,
                    flipY = false,
                    locked = false,
                    scaleX = 1,
                    scaleY = 1,
                    layerIndex = 0,
                    customType = "main-image",
                    loading,
                    loadingSrc,
                } = imageData;
                fabric.Image.fromURL(
                    src,
                    (img) => {
                        const { scaleX: finalX, scaleY: finalY } = getScaled(
                            img,
                            scaleX,
                            scaleY
                        );

                        img.set({
                            id,
                            left: position.x,
                            top: position.y,
                            angle,
                            scaleX: finalX,
                            scaleY: finalY,
                            flipX,
                            flipY,
                            lockMovementX: locked,
                            lockMovementY: locked,
                            originX: "center",
                            originY: "center",
                            objectCaching: false,
                            borderColor: "skyblue",
                            borderDashArray: [4, 4],
                            hasBorders: true,
                            hasControls: true,
                            selectable: true,
                            evented: true,
                            customType,
                            isSync: true,
                            layerIndex,
                            lockScalingFlip: true,
                        });

                        canvas.add(img);
                    }

                );

            });
        }
        // **********************************************************************************************************************************************************
        //                                                                                    OTHER USE EFFECTS
        // **********************************************************************************************************************************************************
    };
    return (
        <div class="canvas-wrapper-5" style={{ position: "relative", top: 5, }}  >
            <canvas ref={canvasRef} id="canvas-export-5" style={{ display: "none" }} />
        </div>
    );

}
export default ExportTool;