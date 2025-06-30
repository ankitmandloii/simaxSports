import { useCallback } from "react";

const updateBoundaryVisibility = (fabricCanvasRef) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const boundaryBox = canvas
    .getObjects()
    .find((obj) => obj.type === "rect" && !obj.selectable); // identify your boundary box
  const warningText = canvas
    .getObjects()
    .find(
      (obj) =>
        obj.type === "text" && obj.text === "Please keep design inside the box"
    );

  if (!boundaryBox || !warningText) return;

  const textObjects = canvas
    .getObjects()
    .filter((obj) => obj.type === "curved-text");

  textObjects.forEach((obj) => obj.setCoords());

  // console.log("textObject check for boundary", textObjects)

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

  boundaryBox.visible = !allInside;
  warningText.visible = !allInside;

  canvas.bringToFront(boundaryBox);
  canvas.bringToFront(warningText);
  canvas.requestRenderAll();
};

export default updateBoundaryVisibility;