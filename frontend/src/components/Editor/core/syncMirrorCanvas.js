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
  // return;

  const getImageFromCanvas = async (fabricCanvas) => {
    if (!fabricCanvas) return null;

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
            new Promise((resolve) => obj.clone((clone) => resolve(clone)))
        )
    );

    objectClones.forEach((obj) => tempCanvas.add(obj));

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

  // console.log("activeSide inside", activeSide);
  if (activeSide === "front") {
    // console.log("active side", activeSide, "changing front")
    setFrontPreviewImage(await getImageFromCanvas(fabricCanvasRef.current));
  } else if (activeSide === "back") {
    setBackPreviewImage(await getImageFromCanvas(fabricCanvasRef.current));
  } else if (activeSide === "leftSleeve") {
    setLeftSleevePreviewImage(
      await getImageFromCanvas(fabricCanvasRef.current)
    );
  } else if (activeSide === "rightSleeve") {
    setRightSleevePreviewImage(
      await getImageFromCanvas(fabricCanvasRef.current)
    );
  }
};

export default syncMirrorCanvas;
