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
  bringPopup,
  productCategory
) => {
  // console.log("imageContaintObject", imageContaintObject);
  console.log("productCategory.......", productCategory)
  
  const canvas = fabricCanvasRef.current;


  if (!canvas) return;

  function createRemoveBackgroundToggle(fabricImage, canvasId, callback, removeBg) {
    // console.log("button data ", fabricImage, canvasId, callback, removeBg);
    const id = fabricImage.id;
    const buttonId = `canvas-${id}`;
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    // Check if toggle already exists
    let container = document.getElementById(buttonId);
    if (container) {
      // console.log("container already exist so updating them");
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

    // Create the toggle
    container = document.createElement("div");
    container.id = buttonId;
    Object.assign(container.style, {
      position: "absolute",
      zIndex: "99",
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
      checkbox.checked = true;
    } else {
      slider.style.backgroundColor = "#ccc";
      circle.style.transform = "translateX(0)";
      checkbox.checked = false;
    }

    checkbox.addEventListener("change", () => {
      const addImageToolbarBgBtn = document.querySelector("#removeBackgroundInput");
      const checked = checkbox.checked;
      slider.style.backgroundColor = checked ? "#3b82f6" : "#ccc";
      circle.style.transform = checked ? "translateX(16px)" : "translateX(0)";

      // Get current image source and parameters
      const currentSrc = fabricImage.getSrc();
      const baseSrc = currentSrc.split('?')[0];
      let params = currentSrc.split('?')[1] ? currentSrc.split('?')[1].split('&') : [];
      const hasRemoveBg = params.includes('bg-remove=true');

      // Update parameters based on checkbox state
      if (checked && !hasRemoveBg) {
        params.push('bg-remove=true');
      } else if (!checked && hasRemoveBg) {
        params = params.filter(param => param !== 'bg-remove=true');
      }

      // Construct new URL
      const newTransform = params.length > 0 ? `?${params.join('&')}` : '';
      const newSrc = `${baseSrc}${newTransform}`;

      // Show loading state
      globalDispatch("loading", true, id);
      // globalDispatch("loadingSrc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s", id);

      // Update image source
      fabricImage.setSrc(newSrc, () => {
        canvas.renderAll();
        globalDispatch("loading", false, id);
        // globalDispatch("loadingSrc", null, id);
        // globalDispatch("src", newSrc, id);
        // globalDispatch("base64CanvasImage", newSrc, id);
        // globalDispatch("selectedFilter", "Normal", id);
        globalDispatch("removeBg", checked, id);
        // globalDispatch("removeBgParamValue", checked ? "bg-remove=true" : "", id);
        if (callback) callback(checked, fabricImage);
      }, { crossOrigin: "anonymous" });

      // Sync with toolbar checkbox
      const toolbarCheckbox = document.querySelector(`#addImageToolbarBgBtn`);
      console.log(toolbarCheckbox, "toolbarCheckbox");
      if (toolbarCheckbox) {
        toolbarCheckbox.checked = checked;
        const event = new Event('change');
        toolbarCheckbox.dispatchEvent(event);
      }
    });

    slider.classList.add("slider");
    circle.classList.add("circle");

    toggleWrapper.appendChild(checkbox);
    toggleWrapper.appendChild(slider);
    toggleWrapper.appendChild(circle);

    container.appendChild(label);
    container.appendChild(toggleWrapper);
    canvasElement.parentElement.appendChild(container);

    // Initial position below image
    const center = fabricImage.getCenterPoint();
    const imageBottom = center.y + fabricImage.getScaledHeight() / 2;
    const imageLeft = center.x;
    const OFFSET = 40;

    container.style.top = `${imageBottom + OFFSET}px`;
    container.style.left = `${imageLeft}px`;

    // console.warn("button created and done");
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

    document.querySelectorAll('[data-fabric-control]').forEach(el => el.remove());
  }

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
    canvas.renderAll();
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
    // console.log("base64 ", base64CanvasImage)
    // if (!base64CanvasImage) return;
    if (locked) {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
    const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);

    function createLoaderOverlay(fabricImage, canvasId) {
      const id = fabricImage.id;
      const loaderId = `loader-${id}`;
      const canvasElement = document.getElementById(canvasId);
      if (!canvasElement) return;

      let loader = document.getElementById(loaderId);

      // Compute scaled size (adjust multiplier as needed)
      const scaledWidth = fabricImage.getScaledWidth();
      const scaledHeight = fabricImage.getScaledHeight();
      const loaderSize = Math.min(scaledWidth, scaledHeight) * 0.3; // 30% of smaller dimension

      if (!loader) {
        loader = document.createElement("div");
        loader.id = loaderId;

        Object.assign(loader.style, {
          position: "absolute",
          zIndex: "1000",
          border: "4px solid #e0e0e0",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          pointerEvents: "none",
        });

        if (!document.getElementById("loader-style")) {
          const style = document.createElement("style");
          style.id = "loader-style";
          style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
          document.head.appendChild(style);
        }

        canvasElement.parentElement.appendChild(loader);
      }

      // Apply dynamic size
      loader.style.width = `${loaderSize}px`;
      loader.style.height = `${loaderSize}px`;
      loader.style.borderWidth = `${Math.max(loaderSize * 0.1, 2)}px`;

      // Center of image on screen
      const center = fabricImage.getCenterPoint();
      const zoom = fabricImage.canvas.getZoom();
      const viewportTransform = fabricImage.canvas.viewportTransform;

      const left = center.x * zoom + viewportTransform[4] - loaderSize / 2;
      const top = center.y * zoom + viewportTransform[5] - loaderSize / 2;

      loader.style.left = `${left}px`;
      loader.style.top = `${top}px`;
      loader.style.display = "block";
    }


    const loaderId = `loader-${id}`;
    // if (loading) {
    //   const canvasId = `canvas-${activeSide}`;
    //   const existingObj = canvas.getObjects("image").find((obj) => obj.id === id);
    //   if (existingObj) {
    //     existingObj.set({
    //       // selectable: false,
    //       // evented: ,

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
    if (
      existingObj &&
      (base64CanvasImage != existingObj?.base64CanvasImage || singleColor != existingObj?.singleColor || invertColor != existingObj?.invertColor || thresholdValue != existingObj?.thresholdValue || solidColor != existingObj?.solidColor)
    ) {
      canvas.remove(existingObj);
      fabric.Image.fromURL(
        base64CanvasImage,
        (newImg) => {
          const { scaleX: finalX, scaleY: finalY } = getScaled(
            newImg,
            scaleX,
            scaleY
          );

          newImg.set({
            id,
            src,
            base64CanvasImage,
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
            hasControls: !locked,
            selectable: true,
            locked: locked,
            evented: true,
            customType,
            isSync: true,
            layerIndex,
            lockScalingFlip: true,
            singleColor,
            invertColor,
            thresholdValue,
            solidColor
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
          function toggleVisibility(visible, locked) {
            // console.log("locked stated", locked)
            const toggle = document.getElementById(`canvas-${newImg.id}`);
            if (locked) {
              toggle.style.display = "none";
              return;
            }
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

          createRemoveBackgroundToggle(newImg, `canvas-${activeSide}`, (isChecked, image) => {
            // console.log(`Background removal ${isChecked ? "ON" : "OFF"} for`, image.id);
          }, removeBg);

          canvas.add(newImg);
          newImg.on("scaling", () => toggleVisibility(false, locked));
          newImg.on("rotating", () => toggleVisibility(false, locked));
          newImg.on("moving", () => toggleVisibility(false, locked));

          newImg.on("mousedown", (e) => {
            const obj = e.target;
            if (obj?.id) {
              canvas.setActiveObject(obj);
              dispatch(selectedImageIdState(obj.id));
              setActiveObjectType("Image");
              navigate("/design/addImage");
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

          newImg.on("selected", (e) => {
            // console.log(e)
            const toggle = document.getElementById(`canvas-${newImg.id}`);
            // console.log("locked stated", locked)
            if (toggle) {
              if (locked) {
                toggle.style.display = "none";
              }
              else {
                toggle.style.display = "flex";
              }
            }
          });

          newImg.on("deselected", () => {
            const toggle = document.getElementById(`canvas-${newImg.id}`);
            if (toggle) toggle.style.display = "none";
          });
          const image = newImg;
          const DPI = 300; // assumed target print resolution

          const widthPixels = image.getScaledWidth();  // actual size on canvas (in px)
          const heightPixels = image.getScaledHeight();

          const widthInches = (widthPixels / DPI).toFixed(2);
          const heightInches = (heightPixels / DPI).toFixed(2);

          // console.log(`Print Size: ${widthInches} in × ${heightInches} in`);

          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    } else if (existingObj) {
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
        hasControls: !locked,
      });

      existingObj.on("selected", (e) => {
        // console.log(e)
        const toggle = document.getElementById(`canvas-${existingObj.id}`);
        // console.log("locked stated", locked)
        if (toggle) {
          if (locked) {
            toggle.style.display = "none";
          }
          else {
            toggle.style.display = "flex";
          }
        }
      });

      existingObj.on("deselected", () => {
        const toggle = document.getElementById(`canvas-${existingObj.id}`);
        if (toggle) toggle.style.display = "none";
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

      function getPrintSizeFromCanvasBackground(fabricImage, canvas, shirtRealWidthInches) {
        const shirtImage = canvas.backgroundImage;

        if (!shirtImage) {
          // console.warn("No background image (shirt mockup) found on the canvas.");
          return null;
        }

        const imageWidthPx = fabricImage.getScaledWidth();
        const imageHeightPx = fabricImage.getScaledHeight();
        const shirtWidthPx = shirtImage.getScaledWidth();

        // Convert proportionally using real shirt width
        const pixelsPerInch = shirtWidthPx / shirtRealWidthInches;

        const widthInches = imageWidthPx / pixelsPerInch;
        const heightInches = imageHeightPx / pixelsPerInch;

        return {
          width: widthInches.toFixed(2),
          height: heightInches.toFixed(2),
        };
      }
      const printSize = getPrintSizeFromCanvasBackground(existingObj, fabricCanvasRef.current, 19);

      if (printSize) {
        // console.log(`Print Area: ${printSize.width} in × ${printSize.height} in`);
      }

      existingObj.controls = createControls(bringPopup, dispatch);
      const center = existingObj.getCenterPoint();
      existingObj.setPositionByOrigin(center, "center", "center");
      existingObj.setCoords();
      const image = existingObj;
      const DPI = 300; // assumed target print resolution
      // INPUTS
      // const shirtRealWidthInches = 19;        // actual shirt width
      // const shirtImagePixels = 400;           // shirt image width in pixels
      // const pixelsPerInch = shirtImagePixels / shirtRealWidthInches; // ≈ 35.95

      // const widthPixels = image.getScaledWidth();
      // const heightPixels = image.getScaledHeight();

      // const widthInches = (widthPixels / pixelsPerInch).toFixed(2);
      // const heightInches = (heightPixels / pixelsPerInch).toFixed(2);

      // console.log(`Actual Print Size: ${widthInches} in × ${heightInches} in`);



      canvas.renderAll();
    } else {
      fabric.Image.fromURL(
        base64CanvasImage,
        (img) => {
          const { scaleX: finalX, scaleY: finalY } = getScaled(
            img,
            scaleX,
            scaleY
          );

          img.set({
            id,
            src,
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
            hasControls: !locked,
            selectable: true,
            evented: true,
            customType,
            isSync: true,
            layerIndex,
            lockScalingFlip: true,
            singleColor,
            hasControls: !locked,
            invertColor,
            thresholdValue,
            solidColor
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

          function toggleVisibility(visible, locked) {
            // console.log("locked stated", locked)

            const toggle = document.getElementById(`canvas-${img.id}`);
            if (locked) {
              toggle.style.display = "none";
              return;
            }
            if (toggle) {
              toggle.style.display = visible ? "flex" : "none";
            }
          }

          createRemoveBackgroundToggle(img, `canvas-${activeSide}`, (isChecked, image) => {
            // console.log(`Background removal ${isChecked ? "ON" : "OFF"} for`, image.id);
          }, removeBg);

          canvas.add(img);

          img.on("scaling", () => toggleVisibility(false, locked));
          img.on("rotating", () => toggleVisibility(false, locked));
          img.on("moving", () => toggleVisibility(false, locked));

          img.on("mousedown", (e) => {
            const obj = e.target;
            if (obj?.id) {
              canvas.setActiveObject(obj);
              dispatch(selectedImageIdState(obj.id));
              setActiveObjectType("image");
              navigate("/design/addImage");
              canvas.renderAll();
            }
          });

          img.on("moving", () => {
            const center = img.getCenterPoint();
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
            toggleVisibility(true);
          });

          img.on("selected", (e) => {
            // console.log(e)
            const toggle = document.getElementById(`canvas-${img.id}`);
            console.log("locked stated", e.target.locked)
            if (toggle) {
              if (e.target.locked) {
                toggle.style.display = "none";
              }
              else {
                toggle.style.display = "flex";
              }
            }
          });

          img.on("deselected", () => {
            const toggle = document.getElementById(`canvas-${img.id}`);
            if (toggle) toggle.style.display = "none";
          });
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }
  });

  updateBoundaryVisibility(fabricCanvasRef, activeSide, productCategory);
};

export default renderAllImageObjects;