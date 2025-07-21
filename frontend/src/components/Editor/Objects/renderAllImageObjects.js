import React from "react";

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
  bringPopup
) => {
  console.log("imageContaintObject", imageContaintObject)
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  const removeAllHtmlControls = (canvas) => {
    canvas.getObjects().forEach((obj) => {
      if (obj._htmlControls) {
        Object.values(obj._htmlControls).forEach((el) => el.remove());
        obj._htmlControls = null;
      }
    });
  };
  removeAllHtmlControls(canvas);

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
      // console.warn("→ Removed duplicate image with id:", obj.id);
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
      // console.warn("→ Removed stale image not in imageContaintObject:", obj.id);
      canvas.remove(obj);
      staleRemoved = true;
    }
  });

  if (duplicateRemoved || staleRemoved) {
    canvas.renderAll();
  }

  if (!imageContaintObject || imageContaintObject.length === 0) return;

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

    // const spinnerId = `spinner-${id}`;
    const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);

    // // Loader (Spinner)
    // if (loading) {
    //   canvas.getObjects().forEach((obj) => {
    //     if (obj.id === selectedImageId) canvas.remove(obj);
    //   });

    //   const existingSpinner = canvas
    //     .getObjects()
    //     .find((o) => o.id === spinnerId);
    //   if (existingSpinner) return;

    //   const dotCount = 5;
    //   const dotRadius = 6;
    //   const dotSpacing = 15;
    //   // const colors = Array(dotCount).fill('#000000');
    //   const colors = ["black", "black", "black", "black", "black"];
    //   const dots = [];

    //   for (let i = 0; i < dotCount; i++) {
    //     dots.push(
    //       new fabric.Circle({
    //         radius: dotRadius,
    //         fill: colors[i],
    //         left:
    //           position.x +
    //           i * dotSpacing -
    //           (dotCount * dotSpacing) / 2 +
    //           dotSpacing / 2,
    //         top: position.y,
    //         originX: "center",
    //         originY: "center",
    //         opacity: 0.3,
    //         selectable: false,
    //         evented: false,
    //       })
    //     );
    //   }

    //   const loader = new fabric.Group(dots, {
    //     id: spinnerId,
    //     scaleX: 1,
    //     scaleY: 1,
    //     originX: "center",
    //     originY: "center",
    //     left: position.x,
    //     top: position.y,
    //     selectable: true,
    //     evented: false,
    //     lockMovementX: true,
    //     lockMovementY: true,
    //     objectCaching: false,
    //     borderColor: "skyblue",
    //     borderDashArray: [4, 4],
    //   });

    //   loader.setControlsVisibility({
    //     mt: true,
    //     mb: true,
    //     ml: true,
    //     mr: true,
    //     tl: true,
    //     tr: true,
    //     bl: true,
    //     br: true,
    //     mtr: true,
    //   });

    //   if (typeof createControls === "function") {
    //     loader.controls = createControls(bringPopup);
    //   }

    //   loader.on("mousedown", () => {
    //     setActiveObjectType("image");
    //     dispatch?.(selectedImageIdState(id));
    //   });

    //   loader.on("modified", (e) => {
    //     const obj = e.target;
    //     if (!obj) return;
    //     const center = obj.getCenterPoint();
    //     obj.setPositionByOrigin(center, "center", "center");
    //     obj.setCoords();
    //     globalDispatch("position", { x: obj.left, y: obj.top }, id);
    //     globalDispatch("angle", obj.angle, id);
    //     handleScale(e);
    //   });

    //   canvas.add(loader);
    //   canvas.bringToFront(loader);

    //   let animationStep = 0;
    //   const animationSpeed = 0.15;
    //   let animationFrameId = null;

    //   const animateDots = () => {
    //     if (!canvas.getObjects().includes(loader)) return;

    //     animationStep += animationSpeed;
    //     loader.getObjects().forEach((dot, i) => {
    //       const waveOffset = i * 0.8;
    //       const scale = 0.6 + Math.sin(animationStep + waveOffset) * 0.4;
    //       const opacity = 0.4 + scale * 0.6;
    //       dot.set({ scaleX: scale, scaleY: scale, opacity });
    //     });

    //     canvas.requestRenderAll();
    //     animationFrameId = requestAnimationFrame(animateDots);
    //   };

    //   animateDots();
    //   loader.cleanup = () => {
    //     if (animationFrameId) cancelAnimationFrame(animationFrameId);
    //     canvas.remove(loader);
    //   };

    //   // return loader;
    // }

    // const oldSpinner = canvas.getObjects().find((o) => o.id === spinnerId);
    // if (oldSpinner) {
    //   clearTimeout(oldSpinner.__spinnerTimer);
    //   canvas.remove(oldSpinner);
    // }


    // Replace Image
    const normalizeUrl = (url) => decodeURIComponent(url.trim().toLowerCase());
    if (
      existingObj &&
      normalizeUrl(existingObj.getSrc()) !== normalizeUrl(src)
    ) {
      // console.log("src....00", src, "prev src", existingObj.getSrc());
      // console.log("→ Replacing image (src changed):", id);
      canvas.remove(existingObj);
      fabric.Image.fromURL(
        src,
        (newImg) => {
          const { scaleX: finalX, scaleY: finalY } = getScaled(
            newImg,
            scaleX,
            scaleY
          );

          newImg.set({
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

          newImg.setControlsVisibility({
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
          removeAllHtmlControls(canvas);

          newImg.controls = createControls(bringPopup, dispatch);
          canvas.add(newImg);

          newImg.on("mousedown", (e) => {
            const obj = e.target;
            if (obj?.id) {
              canvas.setActiveObject(obj);
              dispatch(selectedImageIdState(obj.id));
              setActiveObjectType("Image");
              navigate("/design/addImage", { state: imageData });
            }
          });

          newImg.on("modified", (e) => {
            const obj = e.target;
            if (!obj) return;
            const center = obj.getCenterPoint();
            obj.setPositionByOrigin(center, "center", "center");
            obj.setCoords();
            globalDispatch("position", { x: obj.left, y: obj.top }, id);
            globalDispatch("angle", obj.angle, id);
            handleScale(e);
            canvas.renderAll();
            syncMirrorCanvasHelper(activeSide);
          });

          canvas.renderAll();
        },
        {
          crossOrigin: "anonymous",
        }
      );
    } else if (existingObj) {
      // console.log("src....00", src, "prev src", existingObj.getSrc());
      // console.log("→ updaing existing image :", id);
      const { scaleX: finalX, scaleY: finalY } = getScaled(
        existingObj,
        scaleX,
        scaleY
      );

      existingObj.set({
        left: position.x,
        top: position.y,
        angle,
        flipX,
        flipY,
        scaleX: finalX,
        scaleY: finalY,
        lockMovementX: locked,
        lockMovementY: locked,
        layerIndex,
        customType,
        isSync: true,
      });

      existingObj.setControlsVisibility({
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
      removeAllHtmlControls(canvas);
      existingObj.controls = createControls(bringPopup, dispatch);
      const center = existingObj.getCenterPoint();
      existingObj.setPositionByOrigin(center, "center", "center");
      existingObj.setCoords();
      canvas.renderAll();
    } else {
      // console.log("src....00", src);
      // console.log("→ creating nwe image ", id);
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

          img.controls = createControls(bringPopup, dispatch);
          canvas.add(img);

          img.on("mousedown", (e) => {
            const obj = e.target;
            if (obj?.id) {
              canvas.setActiveObject(obj);
              dispatch(selectedImageIdState(obj.id));
              setActiveObjectType("image");
              navigate("/design/addImage", { state: imageData });
              canvas.renderAll();
            }
          });

          img.on("modified", (e) => {
            const obj = e.target;
            if (!obj) return;
            const center = obj.getCenterPoint();
            obj.setPositionByOrigin(center, "center", "center");
            obj.setCoords();
            globalDispatch("position", { x: obj.left, y: obj.top }, id);
            globalDispatch("angle", obj.angle, id);
            handleScale(e);
            canvas.renderAll();
            syncMirrorCanvasHelper(activeSide);
          });

          canvas.renderAll();
        },
        {
          crossOrigin: "anonymous",
        }
      );
    }
  });

  updateBoundaryVisibility?.(fabricCanvasRef);
};

export default renderAllImageObjects;