import React from "react";
import { store } from "../../../redux/store"
import { processAndReplaceColors, applyFilterAndGetUrl, invertColorsAndGetUrl, getBase64CanvasImage, replaceColorAndGetBase64 } from "../../ImageOperation/CanvasImageOperations";
import { updateImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { createAiEditorButton, createLoaderOverlay, createRemoveBackgroundToggle, handleImage, removeAllHtmlControls, updateButtonPosition } from "../HelpersFunctions/renderImageHelpers";

const renderAllImageObjects = (
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
    productCategory,
    openAieditorPopup,
    setOpenAieditorPopup,
    isZoomedIn,
    currentImageObject
) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    let syncing = false;

    const MAX_WIDTH = 180;
    const MAX_HEIGHT = 180;

    const getScaled = (img, userScaleX = 1, userScaleY = 1) => {
        const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
        return {
            scaleX: scale * userScaleX,
            scaleY: scale * userScaleY,
        };
    };

    const seenIds = new Set();
    let duplicateRemoved = false;

    canvas.getObjects("image").forEach((obj) => {
        if (!obj.id) return;
        if (seenIds.has(obj.id)) {
            canvas.remove(obj);
            duplicateRemoved = true;
        } else {
            seenIds.add(obj.id);
        }
    });

    const validIds = imageContaintObject?.map((img) => img.id) || [];
    let staleRemoved = false;

    canvas.getObjects("image").forEach((obj) => {
        if (obj.id && !validIds.includes(obj.id)) {
            canvas.remove(obj);
            staleRemoved = true;
        }
    });

    if (duplicateRemoved || staleRemoved) {
        canvas.requestRenderAll();
    }

    if (!imageContaintObject || imageContaintObject.length === 0) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    imageContaintObject.forEach(async (imageData) => {
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
            removeBg,
            base64CanvasImage,
            singleColor,
            invertColor,
            thresholdValue,
            solidColor
        } = imageData;

        // CRITICAL FIX: Calculate pixel position from percentage stored in Redux
        const pixelLeft = ((position?.x) / 100) * canvasWidth;
        const pixelTop = ((position?.y) / 100) * canvasHeight;
        // console.log("left and top when setting in start", obj.left, obj.top)
        console.log("pixelTop and pixelTop when setting in start", pixelLeft, pixelTop)
        // const pixelLeft = position?.x;
        // const pixelTop = position?.y;

        const payload = {
            id,
            src,
            base64CanvasImage,
            left: pixelLeft,  // Use the position from Redux
            top: pixelTop,    // Use the position from Redux
            angle,
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
            hasControls: !locked && !isZoomedIn,
            selectable: !isZoomedIn,
            locked,
            evented: !isZoomedIn,
            customType,
            isSync: true,
            layerIndex,
            lockScalingFlip: true,
            singleColor,
            invertColor,
            thresholdValue,
            solidColor,
            canvasWidth,
            canvasHeight
        };

        if (locked) {
            canvas.discardActiveObject();
            try {
                canvas.requestRenderAll();
            } catch (err) {
                console.log("error in image render component");
            }
        }

        const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);

        const setupImage = (img, update = false) => {
            const { scaleX: finalX, scaleY: finalY } = getScaled(img, scaleX, scaleY);

            // DON'T recalculate position here - use the position from payload
            img.set({
                ...payload,
                scaleX: finalX,
                scaleY: finalY,
            });

            img.setControlsVisibility({
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

            if (!locked && !isZoomedIn) {
                if (canvas.getActiveObjects().find((i) => i.id == id)) {
                    toggleVisibility(true, locked);
                }
                img.controls = createControls(bringPopup, dispatch, navigate);
            } else {
                toggleVisibility(false, locked);
                removeAllHtmlControls(canvas);
            }

            if (!update) {
                img.on("scaling", () => {
                    toggleVisibility(false, locked);
                    updateButtonPosition(img, id, canvas);
                });
                img.on("rotating", () => {
                    toggleVisibility(false, locked);
                    updateButtonPosition(img, id, canvas);
                });
                img.on("moving", () => {
                    toggleVisibility(false, locked);
                    updateButtonPosition(img, id, canvas);
                });
                img.on("mousedown", mousedownHandler);
                img.on("mouseup", mouseupHandler);
                img.on("selected", selectionHandler);
                img.on("deselected", deselectedhandler);
            }

            function toggleVisibility(visible, locked) {
                const toggle = document.getElementById(`canvas-${img.id}`);
                const aiEditorBtn = document.getElementById(`canvas-${img.id}-ai`);
                if (locked && toggle && aiEditorBtn) {
                    toggle.style.display = "none";
                    aiEditorBtn.style.display = "none";
                    return;
                }
                if (toggle && aiEditorBtn) {
                    aiEditorBtn.style.display = visible ? "flex" : "none";
                    toggle.style.display = visible ? "flex" : "none";
                }
            }

            function mousedownHandler(e) {
                const obj = e.target;
                if (obj?.id) {
                    canvas.setActiveObject(obj);
                    dispatch(selectedImageIdState(obj.id));
                    setActiveObjectType("image");
                    navigate("/design/addImage");
                    try {
                        canvas.requestRenderAll();
                    } catch (err) {
                        console.log("error in image render component");
                    }
                }
            }

            function mouseupHandler(e) {
                const obj = e.target;
                if (!obj) return;

                const center = obj.getCenterPoint();
                obj.setPositionByOrigin(center, "center", "center");
                obj.setCoords();

                // const imageWidthPx = canvas?.getWidth();
                // const imageHeightPx = canvas?.getHeight();

                // Calculate position in percentage
                const percentX = (obj.left / canvasWidth) * 100;
                const percentY = (obj.top / canvasHeight) * 100;

                console.log("left and top when setting", obj.left, obj.top)
                // console.log("percentX and percentY when setting", percentX, percentY)

                if (position.x !== percentX || position.y !== percentY) {
                    dispatch(
                        updateImageState({
                            id: id,
                            changes: {
                                position: { x: percentX, y: percentY },
                                width: percentX,
                                height: percentY,
                                angle: obj.angle,
                            },
                        })
                    );
                }

                handleScale(e);
                updateButtonPosition(obj, id, canvas);
                toggleVisibility(true, locked);

                try {
                    canvas.requestRenderAll();
                } catch (err) {
                    console.log("Error in image render component", err);
                }
            }

            function selectionHandler(e) {
                const toggle = document.getElementById(`canvas-${img.id}`);
                const aibutton = document.getElementById(`canvas-${img.id}-ai`);
                if (toggle) {
                    if (e.target.locked) {
                        toggle.style.display = "none";
                        aibutton.style.display = "none";
                    } else {
                        toggle.style.display = "flex";
                        aibutton.style.display = "flex";
                        updateButtonPosition(e.target, id, canvas);
                    }
                }
            }

            function deselectedhandler() {
                removeAllHtmlControls(canvas);
                const toggle = document.getElementById(`canvas-${img.id}`);
                const aiButton = document.getElementById(`canvas-${img.id}-ai`);
                if (toggle) toggle.style.display = "none";
                if (aiButton) aiButton.style.display = "none";
            }
        };

        if (
            existingObj &&
            (src != existingObj?.src ||
                base64CanvasImage != existingObj?.base64CanvasImage ||
                singleColor != existingObj?.singleColor ||
                invertColor != existingObj?.invertColor ||
                thresholdValue != existingObj?.thresholdValue ||
                solidColor != existingObj?.solidColor)
        ) {
            canvas.remove(existingObj);
            createNewObject();
        } else if (existingObj) {
            updateExistingObject(existingObj);
        } else {
            createNewObject();
        }

        function updateExistingObject(existingObj) {
            setupImage(existingObj, true);
            // updateButtonPosition(existingObj, id, canvas);
            canvas.requestRenderAll();
        }

        function createNewObject() {
            fabric.Image.fromURL(
                base64CanvasImage,
                (img) => {
                    setupImage(img);
                    createRemoveBackgroundToggle(img, `canvas-${activeSide}`, removeBg, handleImage, globalDispatch);
                    createAiEditorButton(img, `canvas-${activeSide}`, removeBg, setOpenAieditorPopup, openAieditorPopup, handleImage, globalDispatch);
                    canvas.add(img);
                    canvas.requestRenderAll();
                },
                { crossOrigin: "anonymous" }
            );
        }
    });

    updateBoundaryVisibility(fabricCanvasRef, activeSide, productCategory);
};

export default renderAllImageObjects;