import React from "react";

const syncMirrorCanvas = async (
  fabric,
  fabricCanvasRef,
  activeSide,
  setFrontPreviewImage,
  setBackPreviewImage,
  setLeftSleevePreviewImage,
  setRightSleevePreviewImage
) => {
  const getImageFromCanvas = async (fabricCanvas) => {
    if (!fabricCanvas) {
      console.error("Fabric canvas is null or undefined");
      return null;
    }

    // Create an off-screen Fabric canvas
    const tempCanvas = new fabric.StaticCanvas(null, {
      width: fabricCanvas.getWidth(),
      height: fabricCanvas.getHeight(),
      backgroundColor: fabricCanvas.backgroundColor,
    });

    // Clone only non-text/non-rect objects
    const objectClones = await Promise.all(
      fabricCanvas
        .getObjects()
        .filter((obj) => obj.type !== "text" && obj.type !== "rect")
        .map(
          (obj) =>
            new Promise((resolve) => {
              if (obj) {
                obj.clone((clone) => resolve(clone));
              } else {
                resolve(null);
              }
            })
        )
    );

    // Add valid clones to the temporary canvas
    objectClones.forEach((obj) => {
      if (obj) tempCanvas.add(obj);
    });

    // Clone and apply background image (if any)
    if (fabricCanvas.backgroundImage) {
      const clonedBg = await new Promise((resolve) =>
        fabricCanvas.backgroundImage.clone((clone) => resolve(clone))
      );

      tempCanvas.setBackgroundImage(clonedBg, () => {
        tempCanvas.renderAll();
      });
    } else {
      tempCanvas.renderAll();
    }

    // Wait for 1 frame to ensure rendering
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Export the canvas image
    return tempCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
  };

  // Ensure that fabricCanvasRef.current is valid
  const fabricCanvas = fabricCanvasRef.current;
  if (!fabricCanvas) {
    console.error("fabricCanvasRef is null or undefined");
    return;
  }

  // Handle image processing based on active side
  try {
    if (activeSide === "front") {
      setFrontPreviewImage(await getImageFromCanvas(fabricCanvas));
    } else if (activeSide === "back") {
      setBackPreviewImage(await getImageFromCanvas(fabricCanvas));
    } else if (activeSide === "leftSleeve") {
      setLeftSleevePreviewImage(await getImageFromCanvas(fabricCanvas));
    } else if (activeSide === "rightSleeve") {
      setRightSleevePreviewImage(await getImageFromCanvas(fabricCanvas));
    }
  } catch (error) {
    console.error("Error during image processing:", error);
  }
};

export default syncMirrorCanvas;
