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
    // console.log("actual image width and height ", img.width, img.height)
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

    const payload = {
      id, src, base64CanvasImage, left: position?.x || 100, top: position?.y || 100, angle,
      flipX, flipY, lockMovementX: locked, lockMovementY: locked, originX: "center", originY: "center",
      objectCaching: false, borderColor: "skyblue", borderDashArray: [4, 4], hasBorders: true, hasControls: !locked && !isZoomedIn,
      selectable: !isZoomedIn, locked, evented: !isZoomedIn, customType, isSync: true, layerIndex, lockScalingFlip: true,
      singleColor, invertColor, thresholdValue, solidColor, evented: !isZoomedIn,
    }
    // console.log("base64 ", base64CanvasImage)
    // if (!base64CanvasImage) return;
    if (locked) {
      canvas.discardActiveObject();
      try {
        canvas.requestRenderAll();

      } catch (err) {
        console.log("error in image render component")
      }
    }
    const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);


    const loaderId = `loader-${id}`;
    // if (loading) {
    //   const canvasId = `canvas-${activeSide}`;
    //   const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);
    //   if (existingObj) {
    //     existingObj.set({
    //       selectable: false,
    //       evented: false,
    //       hasControls: false

    //     })
    //     canvas.renderAll();
    //     createLoaderOverlay(existingObj, canvasId);
    //     return;
    //   }
    //   // create dynamically the loader circle and postion like the bgremove button postioned 
    // }
    // let loader = document.getElementById(loaderId);
    // if (loader) {
    //   if (existingObj) {
    //     if (existingObj) {
    //       existingObj.set({
    //         selectable: true,
    //         evented: true,
    //       })
    //     }
    //     loader.remove();
    //   }
    // }

    // const normalizeUrl = (url) => decodeURIComponent(url.trim().toLowerCase());
    const setupImage = (img, update = false) => {
      const { scaleX: finalX, scaleY: finalY } = getScaled(
        img,
        scaleX,
        scaleY
      );
      img.set({
        ...payload,
        scaleX: finalX,
        scaleY: finalY,
      })
      img.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false, tl: false, tr: false, bl: false, br: false, mtr: false, });
      if (!locked && !isZoomedIn) {
        if (canvas.getActiveObjects().find((i) => i.id == id)) {
          toggleVisibility(true, locked)
        }
        img.controls = createControls(bringPopup, dispatch, navigate);
      }
      else {
        toggleVisibility(false, locked)
        removeAllHtmlControls(canvas);
      }
      if (!update) {
        img.on("scaling", () => toggleVisibility(false, locked));
        img.on("rotating", () => toggleVisibility(false, locked));
        img.on("moving", () => toggleVisibility(false, locked));
        img.on("mousedown", mousedownHandler);
        // img.on("moving", movingHandler);
        img.on("mouseup", mouseupHandler)
        // img.on("modified", modifiedHandler);
        img.on("selected", selectionHandler);
        img.on("deselected", deselectedhandler);

      }
      function toggleVisibility(visible, locked) {
        const state = store.getState();
        const activeSide = state.TextFrontendDesignSlice.activeSide;
        const images = state.TextFrontendDesignSlice.present[activeSide].images;
        const selectedImageId = state.TextFrontendDesignSlice.present[activeSide].selectedImageId;
        if (selectedImageId != img.id || canvas.getActiveObjects().find((obj) => obj.id == img.id)) {
          return;
        }
        console.log(selectedImageId, img.id);
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
            console.log("error in image render component")
          }
        }
      }
      function movingHandler() {
        // const center = img.getCenterPoint();
        // const imageBottom = center.y + (img.getScaledHeight() / 2);
        // const imageLeft = center.x;
        // const OFFSET = 40;

        // const button = document.getElementById(`canvas-${img.id}`);
        // const aibutton = document.getElementById(`canvas-${img.id}-ai`);
        // if (button) {
        //   button.style.top = `${imageBottom + OFFSET}px`;
        //   button.style.left = `${imageLeft}px`;
        //   button.style.transform = "translate(-50%, 0)";
        // }
        // if (aibutton) {
        //   const center = img.getCenterPoint();
        //   const imageBottom = center.y + (img.getScaledHeight() / 2);
        //   const imageLeft = center.x;
        //   const OFFSET = 70;
        //   aibutton.style.top = `${imageBottom + OFFSET}px`;
        //   aibutton.style.left = `${imageLeft}px`;
        //   aibutton.style.transform = "translate(-50%, 0)";
        // }
      }
      function mouseupHandler(e) {

        const obj = e.target;
        if (!obj) return;
        const center = obj.getCenterPoint();
        obj.setPositionByOrigin(center, "center", "center");
        obj.setCoords();
        const imageWidthPx = img?.getScaledWidth();
        const imageHeightPx = img?.getScaledHeight();

        const changes = {};
        if (position.x != obj.left && position.y != obj.top) {
          changes.position = { x: obj.left, y: obj.top }
        }
        dispatch(updateImageState({
          id: id,
          changes: {
            // loadingText: true,
            position: { x: obj.left, y: obj.top },
            width: imageWidthPx,
            height: imageHeightPx,
            angle: obj.angle,
          },
        }));
        handleScale(e);
        try {
          canvas.requestRenderAll();

        } catch (err) {
          console.log("error in image render component")
        }
      }
      function modifiedHandler(e) {
        // const obj = e.target;
        // if (!obj) return;
        // syncMirrorCanvasHelper(activeSide);
        // handleScale(e);
        // toggleVisibility(true);
      }
      function selectionHandler(e) {
        // console.log(e)
        const toggle = document.getElementById(`canvas-${img.id}`);
        const aibutton = document.getElementById(`canvas-${img.id}-ai`);
        console.log("locked stated", e.target.locked)
        if (toggle) {
          if (e.target.locked) {
            toggle.style.display = "none";
            aibutton.style.display = "none";
          }
          else {
            toggle.style.display = "flex";
            aibutton.style.display = "flex";
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
      (src != existingObj?.src || base64CanvasImage != existingObj?.base64CanvasImage || singleColor != existingObj?.singleColor || invertColor != existingObj?.invertColor || thresholdValue != existingObj?.thresholdValue || solidColor != existingObj?.solidColor)
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
      updateButtonPosition(existingObj, id)
      canvas.requestRenderAll();
    }
    function createNewObject() {
      fabric.Image.fromURL(
        base64CanvasImage,
        (img) => {
          setupImage(img)
          createRemoveBackgroundToggle(img, `canvas-${activeSide}`, removeBg, handleImage, globalDispatch);
          createAiEditorButton(img, `canvas-${activeSide}`, removeBg, setOpenAieditorPopup, openAieditorPopup, handleImage, globalDispatch);
          canvas.add(img)
          console.log("active objects", canvas.getActiveObjects());
          if (selectedImageId == img.id) {
            canvas.setActiveObject(img); // Keeps the updated object selected 
          }
          canvas.requestRenderAll();

        },
        { crossOrigin: "anonymous" }
      );
    }
  });

  updateBoundaryVisibility(fabricCanvasRef, activeSide, productCategory);
};

export default renderAllImageObjects;

