import { useCallback } from "react";

const updateBoundaryVisibility = (fabricCanvasRef, activeSide, productCategory) => {
  console.log("-----activewee", activeSide, productCategory)
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const objects = canvas.getObjects();
  const boundaryBox = objects.find((obj) => obj.name === "boundaryBox");
  const boundaryBoxInner = objects.find((obj) => obj.name === "boundaryBoxInner");
  const boundaryBoxLeft = objects.find((obj) => obj.name === "boundaryBoxLeft");
  const boundaryBoxRight = objects.find((obj) => obj.name === "boundaryBoxRight");
  const centerVerticalLine = objects.find((obj) => obj.name === "centerVerticalLine");
  const warningText = objects.find((obj) => obj.name === "warningText");
  const centerVerticalLineLeftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
  const centerVerticalLineRightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");
  const leftChestText = objects.find((obj) => obj.name === "leftChestText");
  const rightChestText = objects.find((obj) => obj.name === "rightChestText");
  const youthText = objects.find((obj) => obj.name === "youthText");
  const adultText = objects.find((obj) => obj.name === "adultText");
  const leftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
  const rightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");


  // console.log("------------------boundry", activeSide) 

  // if (!boundaryBox || !warningText || !centerVerticalLine) return;

  const textObjects = objects.filter(
    (obj) => obj.type === "curved-text" || obj.type === "image"
  );

  // const canvasCenterX = canvas.getWidth() / 2;
  // let anyObjectAtCenter = false;
  // console.log("textObjects", textObjects)
  // textObjects.forEach((obj) => {
  //   obj.setCoords();

  //   const objCenterX = obj.getCenterPoint().x;
  //   const delta = Math.abs(objCenterX - canvasCenterX);

  //   if (delta <= 2) {
  //     anyObjectAtCenter = true;

  //     // Temporarily lock movement
  //     obj.lockMovementX = true;
  //     canvas.requestRenderAll();

  //     setTimeout(() => {
  //       obj.lockMovementX = false;
  //       canvas.requestRenderAll();
  //     }, 500);
  //   }
  // });

  // // Handle center line stroke color change
  // if (centerVerticalLine) {
  //   const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
  //   if (!centerVerticalLine.originalStroke) {
  //     centerVerticalLine.originalStroke = originalStroke;
  //   }
  //   centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);
  // }
  // console.log("productCategory before warning", productCategory)
  if (productCategory == "Zip") {

    if (activeSide == "front") {
      const allInside = textObjects.every((obj) => {
        if (!obj || !boundaryBoxLeft || !boundaryBoxRight) return false;

        const objBounds = obj.getBoundingRect(true);
        const boxBoundsLeft = boundaryBoxLeft.getBoundingRect(true);
        const boxBoundsRight = boundaryBoxRight.getBoundingRect(true);
        return (
          (objBounds.left >= boxBoundsLeft.left &&
            objBounds.top >= boxBoundsLeft.top &&
            objBounds.left + objBounds.width <= boxBoundsLeft.left + boxBoundsLeft.width &&
            objBounds.top + objBounds.height <= boxBoundsLeft.top + boxBoundsLeft.height)
          ||
          (objBounds.left >= boxBoundsRight.left &&
            objBounds.top >= boxBoundsRight.top &&
            objBounds.left + objBounds.width <= boxBoundsRight.left + boxBoundsRight.width &&
            objBounds.top + objBounds.height <= boxBoundsRight.top + boxBoundsRight.height)
        );
      });
      const showBoundary = !allInside;
      if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
      if (boundaryBoxRight) boundaryBoxRight.visible = showBoundary;
      if (leftChestText) leftChestText.visible = showBoundary;
      if (rightChestText) rightChestText.visible = showBoundary;
      if (warningText) { warningText.visible = showBoundary; }
    }
    else {
      const allInside = textObjects.every((obj) => {
        if (!obj || !boundaryBox) return false;

        const objBounds = obj.getBoundingRect(true);
        const boxBounds = boundaryBox.getBoundingRect(true);

        return (
          objBounds.left >= boxBounds.left &&
          objBounds.top >= boxBounds.top &&
          objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
          objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
        );
      });
      const showBoundary = !allInside;
      if (boundaryBox) boundaryBox.visible = showBoundary;
      if (warningText) { warningText.visible = showBoundary; }
      // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
    }
  }
  else {
    const allInside = textObjects.every((obj) => {
      if (!obj || !boundaryBox) return false;

      const objBounds = obj.getBoundingRect(true);
      const boxBounds = boundaryBox.getBoundingRect(true);

      return (
        objBounds.left >= boxBounds.left &&
        objBounds.top >= boxBounds.top &&
        objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
        objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
      );
    });


    const showBoundary = !allInside;
    if (activeSide == 'front') {
      if (boundaryBox) boundaryBox.visible = showBoundary;
      if (boundaryBoxInner) boundaryBoxInner.visible = showBoundary;
      if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
      if (leftChestText) leftChestText.visible = showBoundary;
      if (adultText) adultText.visible = showBoundary;
      if (youthText) youthText.visible = showBoundary;
      // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
      if (warningText) { warningText.visible = showBoundary; }
    }
    else {
      if (boundaryBox) boundaryBox.visible = showBoundary;
      if (boundaryBoxInner) boundaryBoxInner.visible = false;
      if (boundaryBoxLeft) boundaryBoxLeft.visible = false;
      if (leftChestText) leftChestText.visible = false;
      if (adultText) adultText.visible = false;
      if (youthText) youthText.visible = false;
      if (warningText) { warningText.visible = showBoundary; }
      // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }

    }
  }


  // Handle boundary visibility


  canvas.requestRenderAll();
};

export default updateBoundaryVisibility;