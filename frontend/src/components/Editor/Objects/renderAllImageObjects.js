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
  function createRemoveBackgroundToggle(fabricImage, canvasId, callback, removeBg) {
    console.log("button data ", fabricImage, canvasId, callback, removeBg)
    const id = fabricImage.id;
    const buttonId = `canvas-${id}`;
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    // === Check if toggle already exists ===
    let container = document.getElementById(buttonId);
    if (container) {
      const center = fabricImage.getCenterPoint();
      const imageBottom = center.y + (fabricImage.getScaledHeight() / 2);
      const imageLeft = center.x;
      const OFFSET = 40;

      container.style.top = `${imageBottom + OFFSET}px`;
      container.style.left = `${imageLeft}px`;
      container.style.display = "none";

      const checkbox = container.querySelector('input[type="checkbox"]');
      const slider = container.querySelector(".slider");
      const circle = container.querySelector(".circle");

      if (checkbox) checkbox.checked = removeBg;

      if (slider && circle) {
        slider.style.backgroundColor = removeBg ? "#3b82f6" : "#ccc";
        circle.style.transform = removeBg ? "translateX(16px)" : "translateX(0)";
      }

      return;
    }


    // === Otherwise, create the toggle ===
    container = document.createElement("div");
    container.id = buttonId;
    Object.assign(container.style, {
      position: "absolute",
      zIndex: "999",
      transform: "translate(-50%, 0)",
      display: "none",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      borderRadius: "9999px",
      backgroundColor: "white",
      boxShadow: "0 0 4px rgba(0,0,0,0.1)",
      fontFamily: "sans-serif",
      fontSize: "10px",
      maxWidth: "95vw",
      flexWrap: "wrap",
    });

    const textSpan1 = document.createElement("span");
    textSpan1.textContent = "Remove";
    textSpan1.style.fontWeight = "500";

    const aiBadge = document.createElement("span");
    aiBadge.textContent = "AI";
    Object.assign(aiBadge.style, {
      fontSize: "10px",
      padding: "1px 5px",
      borderRadius: "4px",
      backgroundImage: "linear-gradient(to right, #6C6CFF, #9CF8F8)",
      color: "white",
      fontWeight: "600",
    });

    const textSpan2 = document.createElement("span");
    textSpan2.textContent = "Background";
    textSpan2.style.fontWeight = "500";

    const label = document.createElement("div");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "3px";
    label.appendChild(textSpan1);
    label.appendChild(aiBadge);
    label.appendChild(textSpan2);

    const toggleWrapper = document.createElement("label");
    Object.assign(toggleWrapper.style, {
      position: "relative",
      display: "inline-block",
      width: "34px",
      height: "18px",
      cursor: "pointer",
      flexShrink: "0",
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.opacity = "0";
    checkbox.style.width = "0";
    checkbox.style.height = "0";

    const slider = document.createElement("span");
    Object.assign(slider.style, {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "#ccc",
      borderRadius: "9999px",
      transition: "0.2s",
    });

    const circle = document.createElement("span");
    Object.assign(circle.style, {
      position: "absolute",
      left: "2px",
      top: "2px",
      width: "14px",
      height: "14px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "0.2s",
      boxShadow: "0 0 1px rgba(0,0,0,0.2)",
    });

    if (removeBg) {
      slider.style.backgroundColor = "#3b82f6";
      circle.style.transform = "translateX(16px)";
    } else {
      slider.style.backgroundColor = "#ccc";
      circle.style.transform = "translateX(0)";
    }


    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        slider.style.backgroundColor = "#3b82f6";
        circle.style.transform = "translateX(16px)";
      } else {
        slider.style.backgroundColor = "#ccc";
        circle.style.transform = "translateX(0)";
      }

      if (callback) callback(checkbox.checked, fabricImage);
    });
    slider.classList.add("slider");
    circle.classList.add("circle");


    toggleWrapper.appendChild(checkbox);
    toggleWrapper.appendChild(slider);
    toggleWrapper.appendChild(circle);

    container.appendChild(label);
    container.appendChild(toggleWrapper);
    canvasElement.parentElement.appendChild(container);

    // === Initial Position Below Image ===
    const center = fabricImage.getCenterPoint();
    const imageBottom = center.y + fabricImage.getScaledHeight() / 2;
    const imageLeft = center.x;
    const OFFSET = 40;

    container.style.top = `${imageBottom + OFFSET}px`;
    container.style.left = `${imageLeft}px`;
  }



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

  // removeAllHtmlControls(canvas);

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
      removeBg
    } = imageData;

    // const spinnerId = `spinner-${id}`;
    const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);



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
          function toggleVisibility(visible) {
            const toggle = document.getElementById(`canvas-${newImg.id}`);
            if (toggle) {
              toggle.style.display = visible ? "flex" : "none";
            }
          }
          newImg.controls = createControls(bringPopup, dispatch);

          const button = document.getElementById(`canvas-${id}`);
          if (button) {
            const center = newImg.getCenterPoint();
            const imageBottom = center.y + (newImg.getScaledHeight() / 2);
            const imageLeft = center.x;
            const OFFSET = 40;

            button.style.top = `${imageBottom + OFFSET}px`;
            button.style.left = `${imageLeft}px`;
          }

          createRemoveBackgroundToggle(newImg, "canvas", (isChecked, image) => {
            if (isChecked) {
              console.log("Background removal ON for", image.id);
              // Trigger your background removal logic
            } else {
              console.log("Background removal OFF for", image.id);
            }
          }, removeBg);


          canvas.add(newImg);
          newImg.on("scaling", () => toggleVisibility(false));
          newImg.on("rotating", () => toggleVisibility(false));
          newImg.on("moving", () => toggleVisibility(false));

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
            toggleVisibility(true);
          });

          newImg.on("selected", () => {
            const toggle = document.getElementById(`canvas-${newImg.id}`);
            if (toggle) toggle.style.display = "flex";
          });

          // HIDE toggle when the image is deselected
          newImg.on("deselected", () => {
            const toggle = document.getElementById(`canvas-${newImg.id}`);
            if (toggle) toggle.style.display = "none";
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
      const button = document.getElementById(`canvas-${id}`);
      if (button) {
        const center = existingObj.getCenterPoint();
        const imageBottom = center.y + (existingObj.getScaledHeight() / 2);
        const imageLeft = center.x;
        const OFFSET = 40;
        button.style.top = `${imageBottom + OFFSET}px`;
        button.style.left = `${imageLeft}px`;

      }

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
      // removeAllHtmlControls(canvas);
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
          removeAllHtmlControls(canvas);

          function toggleVisibility(visible) {
            const toggle = document.getElementById(`canvas-${img.id}`);
            if (toggle) {
              toggle.style.display = visible ? "flex" : "none";
            }
          }

          // const existingButton = document.getElementById(`canvas-${id}`);
          // if (existingButton) existingButton.remove();

          // const canvasElement = document.getElementById("canvas");
          // const button = document.createElement("button");
          // button.id = `canvas-${id}`;
          // button.textContent = "Edit";
          // button.style.position = "absolute";
          // button.style.zIndex = "999";
          // button.style.padding = "4px 8px";
          // button.style.border = "1px solid #888";
          // button.style.borderRadius = "4px";
          // button.style.backgroundColor = "#fff";
          // button.style.cursor = "pointer";

          // // Dynamically compute image's bottom-center position
          // const center = img.getCenterPoint();
          // const imageBottom = center.y + (img.getScaledHeight() / 2);
          // const imageLeft = center.x;
          // const OFFSET = 10;

          // button.style.top = `${imageBottom + OFFSET}px`;
          // button.style.left = `${imageLeft}px`;
          // button.style.transform = "translate(-50%, 0)";

          // button.onclick = () => {
          //   navigate("/design/addImage", { state: imageData });
          // };

          // const parentElement = canvasElement.parentElement;
          // parentElement.appendChild(button);

          createRemoveBackgroundToggle(img, "canvas", (isChecked, image) => {
            if (isChecked) {
              console.log("Background removal ON for", image.id);
              // Trigger your background removal logic
            } else {
              console.log("Background removal OFF for", image.id);
            }
          }, removeBg);

          canvas.add(img);


          img.on("scaling", () => toggleVisibility(false));
          img.on("rotating", () => toggleVisibility(false));
          img.on("moving", () => toggleVisibility(false));

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

          img.on("moving", () => {
            const center = img.getCenterPoint(); // current center
            const imageBottom = center.y + (img.getScaledHeight() / 2);
            const imageLeft = center.x;
            const OFFSET = 40;

            const button = document.getElementById(`canvas-${img.id}`);
            if (button) {
              button.style.top = `${imageBottom + OFFSET}px`;
              button.style.left = `${imageLeft}px`;
              button.style.transform = "translate(-50%, 0)";
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
            toggleVisibility(true)
          });
          img.on("selected", () => {
            const toggle = document.getElementById(`canvas-${img.id}`);
            if (toggle) toggle.style.display = "flex";
          });

          // HIDE toggle when the image is deselected
          img.on("deselected", () => {
            const toggle = document.getElementById(`canvas-${img.id}`);
            if (toggle) toggle.style.display = "none";
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