// import { useCallback } from "react";

// const updateBoundaryVisibility = (fabricCanvasRef) => {
//   const canvas = fabricCanvasRef.current;
//   if (!canvas) return;

//   const objects = canvas.getObjects();
//   const boundaryBox = objects.find((obj) => obj.name === "boundaryBox");
//   const boundaryBoxInner = objects.find((obj) => obj.name === "boundaryBoxInner");
//   const boundaryBoxLeft = objects.find((obj) => obj.name === "boundaryBoxLeft");
//   const centerVerticalLine = objects.find((obj) => obj.name === "centerVerticalLine");
//   const warningText = objects.find((obj) => obj.name === "warningText");
//   const centerVerticalLineRightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");
//   const centerVerticalLineLeftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");



//   // if (!boundaryBox || !warningText || !centerVerticalLine) return;

//   const textObjects = objects.filter(
//     (obj) => obj.type === "curved-text" || obj.type === "image"
//   );

//   const canvasCenterX = canvas.getWidth() / 2;
//   let anyObjectAtCenter = false;

//   textObjects.forEach((obj) => {
//     obj.setCoords();

//     const objCenterX = obj.getCenterPoint().x;
//     const delta = Math.abs(objCenterX - canvasCenterX);

//     if (delta <= 2) {
//       anyObjectAtCenter = true;

//       // Temporarily lock movement
//       obj.lockMovementX = true;
//       canvas.requestRenderAll();

//       setTimeout(() => {
//         obj.lockMovementX = false;
//         canvas.requestRenderAll();
//       }, 500);
//     }

//     obj.setCoords();
//   });

//   // Handle vertical line stroke color
//   const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";

//   if (anyObjectAtCenter) {
//     centerVerticalLine.set("stroke", "orange");
//   } else {
//     centerVerticalLine.set("stroke", originalStroke);
//   }

//   // Save original stroke if not already saved
//   if (!centerVerticalLine.originalStroke) {
//     centerVerticalLine.originalStroke = originalStroke;
//   }

//   const allInside = textObjects.every((obj) => {
//     const objBounds = obj.getBoundingRect(true);
//     const boxBounds = boundaryBox.getBoundingRect(true);
//     return (
//       objBounds.left >= boxBounds.left &&
//       objBounds.top >= boxBounds.top &&
//       objBounds.left + objBounds.width <= boxBounds.left + boxBounds.width &&
//       objBounds.top + objBounds.height <= boxBounds.top + boxBounds.height
//     );
//   });

//   const visible = !allInside;

//   if (boundaryBox) boundaryBox.visible = visible;
//   if (boundaryBoxInner) boundaryBoxInner.visible = visible;
//   if (boundaryBoxLeft) boundaryBoxLeft.visible = visible;
//   if (centerVerticalLine) centerVerticalLine.visible = visible;
//   if (warningText) warningText.visible = visible;
//   // if (centerVerticalLineLeftBorder) centerVerticalLineLeftBorder.visible = visible;
//   // if (centerVerticalLineRightBorder) centerVerticalLineRightBorder.visible = visible;

//   canvas.bringToFront(boundaryBox);
//   canvas.bringToFront(boundaryBoxInner);
//   canvas.bringToFront(boundaryBoxLeft);
//   canvas.bringToFront(centerVerticalLine);
//   canvas.bringToFront(warningText);
//   // canvas.bringToFront(centerVerticalLineRightBorder);
//   // canvas.bringToFront(centerVerticalLineLeftBorder);


//   canvas.requestRenderAll();
// };

// export default updateBoundaryVisibility;
import { useCallback } from "react";

const updateBoundaryVisibility = (fabricCanvasRef) => {
  const canvas = fabricCanvasRef.current;
  // if (!canvas) return;

  const objects = canvas.getObjects();
  const boundaryBox = objects.find((obj) => obj.name === "boundaryBox");
  const boundaryBoxInner = objects.find((obj) => obj.name === "boundaryBoxInner");
  const boundaryBoxLeft = objects.find((obj) => obj.name === "boundaryBoxLeft");
  const centerVerticalLine = objects.find((obj) => obj.name === "centerVerticalLine");
  const warningText = objects.find((obj) => obj.name === "warningText");
  const centerVerticalLineLeftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
  const centerVerticalLineRightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");
  const leftChestText = objects.find((obj) => obj.name === "leftChestText");
  const youthText = objects.find((obj) => obj.name === "youthText");
  const adultText = objects.find((obj) => obj.name === "adultText");
  const leftBorder = objects.find((obj) => obj.name === "centerVerticalLineLeftBorder");
  const rightBorder = objects.find((obj) => obj.name === "centerVerticalLineRightBorder");


  // if (!boundaryBox || !warningText || !centerVerticalLine) return;

  const textObjects = objects.filter(
    (obj) => obj.type === "curved-text" || obj.type === "image"
  );

  const canvasCenterX = canvas.getWidth() / 2;
  let anyObjectAtCenter = false;

  textObjects.forEach((obj) => {
    obj.setCoords();

    const objCenterX = obj.getCenterPoint().x;
    const delta = Math.abs(objCenterX - canvasCenterX);

    if (delta <= 2) {
      anyObjectAtCenter = true;

      // Temporarily lock movement
      obj.lockMovementX = true;
      canvas.requestRenderAll();

      setTimeout(() => {
        obj.lockMovementX = false;
        canvas.requestRenderAll();
      }, 500);
    }
  });

  // Handle center line stroke color change
  const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
  if (!centerVerticalLine.originalStroke) {
    centerVerticalLine.originalStroke = originalStroke;
  }
  centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);



  // Handle boundary visibility
  const allInside = textObjects.every((obj) => {
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

  boundaryBox.visible = showBoundary;
  if (boundaryBoxInner) boundaryBoxInner.visible = showBoundary;
  if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
  if (leftChestText) leftChestText.visible = showBoundary;
  if (adultText) adultText.visible = showBoundary;
  if (youthText) youthText.visible = showBoundary;
  if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
  if (warningText) { warningText.visible = showBoundary; }
  // Show / hide the left / right borders
  // leftBorder.set({ visible: anyObjectAtCenter && !showBoundary });
  // rightBorder.set({ visible: anyObjectAtCenter && !showBoundary });


  // Show stitched side borders only if object is at center
  // if (centerVerticalLineLeftBorder) {
  //   centerVerticalLineLeftBorder.visible = anyObjectAtCenter;
  // }
  // if (centerVerticalLineRightBorder) {
  //   centerVerticalLineRightBorder.visible = anyObjectAtCenter;
  // }

  // Bring important elements to front
  canvas.bringToFront(boundaryBox);
  canvas.bringToFront(boundaryBoxInner);
  canvas.bringToFront(boundaryBoxLeft);
  canvas.bringToFront(centerVerticalLine);
  canvas.bringToFront(warningText);
  canvas.bringToFront(youthText);
  canvas.bringToFront(adultText);
  canvas.bringToFront(leftChestText)

  // You may skip bringing stitch lines to front unless needed visually
  // canvas.bringToFront(centerVerticalLineLeftBorder);
  // canvas.bringToFront(centerVerticalLineRightBorder);

  canvas.requestRenderAll();
};

export default updateBoundaryVisibility;