import React from "react";

const renderNameAndNumber = (
  fabricCanvasRef,
  dispatch,
  nameAndNumberDesignState,
  setActiveObjectType,
  updateBoundaryVisibility,
  createControls,
  syncMirrorCanvasHelper,
  navigate,
  fabric,
  globalDispatch,
  activeSide,
  addNumber,
  addName,
  updateNameAndNumberDesignState,
  bringPopup,
  productCategory,
  // proudctType,
  activeNameAndNumberPrintSide
) => {
  // console.log("productCategory.......", productCategory)

  const canvas = fabricCanvasRef.current;
  if (!canvas || !nameAndNumberDesignState) {
    // console.warn("Canvas or nameAndNumberDesignState is missing.");
    return;
  }

  const { name, number, position, fontFamily, fontColor, fontSize, id } =
    nameAndNumberDesignState;

  const objectId = id;

  if (!addName && !addNumber) {
    const existingGroup = canvas
      .getObjects()
      .find((obj) => obj.id === objectId);
    if (existingGroup) {
      canvas.remove(existingGroup);
      canvas.requestRenderAll();
    }
    return;
  }

  const fontSizeMap = {
    small: 60,
    medium: 100,
    large: 150,
  };
  const baseFontSize = fontSizeMap[fontSize] || 80;

  // Remove old group if it exists
  const oldGroup = canvas
    .getObjects()
    .filter((obj) => obj.isDesignGroup === true);
  oldGroup.forEach((oldGroup) => canvas.remove(oldGroup));

  const textObjects = [];

  if (addName && name && activeNameAndNumberPrintSide == activeSide) {
    const nameText = new fabric.Text(name, {
      fontSize: baseFontSize * 0.3,
      fontFamily: fontFamily,
      fill: fontColor,
      originX: "left", // manual centering
      originY: "top",
    });
    // Center horizontally
    nameText.left = -nameText.width / 2;
    textObjects.push(nameText);
  }
  // console.log("-----------activesiede", activeSide)
  // console.log("-----------activeNameAndNumberPrintSide", activeNameAndNumberPrintSide)


  if (addNumber && number && activeNameAndNumberPrintSide == activeSide) {
    const numberText = new fabric.Text(number, {
      fontSize: baseFontSize,
      fontFamily: fontFamily,
      fill: fontColor,
      originX: "left",
      originY: "top",
    });
    numberText.left = -numberText.width / 2;

    // Stack below name if present
    if (textObjects.length > 0) {
      const previous = textObjects[textObjects.length - 1];
      numberText.top = previous.top + previous.height + 5;
      numberText.left = -previous.width / 2 - (fontSize === "small" ? 12 : 30);
    }
    textObjects.push(numberText);
  }

  if (textObjects.length === 0) return;

  const group = new fabric.Group(textObjects, {
    id: objectId,
    left: position?.x || canvas.getWidth() / 2,
    top: position?.y || canvas.getHeight() / 2,
    originX: "center",
    originY: "center",
    alignText: "center",
    selectable: true,
    fontFamily: fontFamily,
    hasBorders: false,
    hasControls: false,
    evented: true,
    isSync: true,
  });

  group.on("modified", (e) => {
    const obj = e.target;
    if (!obj) return;
    const center = obj.getCenterPoint();

    obj.setPositionByOrigin(center, "center", "center");
    obj.setCoords();
    dispatch(
      updateNameAndNumberDesignState({
        changes: {
          position: { x: obj.left, y: obj.top },
        },
      })
    );
  });
  group.on("mousedown", () => {
    navigate("/design/addNames");
  });

  // console.log("group ", group, group.type);
  // Force recalculation of bounds
  group._calcBounds();
  group._updateObjectsCoords();
  group.set({
    width: fontSize === "small" ? 60 : 190,
    left: position?.x || canvas.getWidth() / 2,
    top: position?.y || canvas.getHeight() / 2,

    // originX: 'center',
    // originY: 'center',
    isDesignGroup: true,
    hasBorders: false,
  });

  group.setCoords();
  canvas.add(group);
  canvas.requestRenderAll();
  syncMirrorCanvasHelper(activeSide);
};

export default renderNameAndNumber;
