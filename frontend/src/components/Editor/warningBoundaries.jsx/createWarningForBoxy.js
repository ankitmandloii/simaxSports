
  function createWarningForBoxy({canvasWidth, canvasHeight, canvas,warningColor,activeSide,getProductSleeveType,activeProductTitle,fabric}) {
    console.log(fabric,"fabric");
    
    let boxWidth = canvasWidth * 0.36;
    let boxHeight = canvasHeight * 0.4;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    const strokeColor = warningColor || "skyblue";
    const dashPattern = [3, 1];

    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {
      const sleeveType = getProductSleeveType(activeProductTitle);
      if (sleeveType == "Sleeveless") return;
      if (sleeveType == "Long Sleeve") {
        boxLeft += canvasWidth * 0.1;
        boxWidth = canvasWidth * 0.2;
        boxHeight = canvasHeight * 0.4;
        boxTop -= canvasHeight * 0.03;
      }
      else {
        boxLeft += canvasWidth * 0.12;
        boxWidth = canvasWidth * 0.2;
        boxHeight = canvasHeight * 0.23;
        boxTop -= canvasHeight * 0.03;
      }
    }

    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop - canvasHeight * 0.06,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });

    // Left Chest box (scaled)
    const chestBoxWidth = canvasWidth * 0.14;
    const chestBoxHeight = canvasHeight * 0.14;
    const chestBoxLeftOffset = canvasWidth * 0.22;
    const chestBoxTopOffset = canvasHeight * 0.05;

    const boundaryBoxLeft = new fabric.Rect({
      left: boxLeft + chestBoxLeftOffset,
      top: boxTop - chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxLeft"
    });

    // Right Chest box (mirror of Left Chest)
    const boundaryBoxRight = new fabric.Rect({
      left: boxLeft + boxWidth - chestBoxLeftOffset - chestBoxWidth,
      top: boxTop + chestBoxTopOffset,
      width: chestBoxWidth,
      height: chestBoxHeight,
      fill: "transparent",
      stroke: strokeColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      objectCaching: false,
      strokeDashArray: dashPattern,
      name: "boundaryBoxRight"
    });

    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {
      // Warning text
      const warningText = new fabric.Text("Please keep design inside the box", {
        left: boxLeft + boxWidth / 2,
        top: boxTop - canvasHeight * 0.03,
        fontSize: canvasHeight * 0.03,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "warningText"
      });
      canvas.add(warningText);
      canvas.bringToFront(warningText);
    }

    // Left Chest Label
    const leftChestText = new fabric.Text("Left Chest", {
      left: boundaryBoxLeft.left + chestBoxWidth / 2,
      top: boundaryBoxLeft.top + chestBoxHeight - canvasHeight * 0.03,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "leftChestText"
    });

    // Right Chest Label
    const rightChestText = new fabric.Text("Right Chest", {
      left: boundaryBoxRight.left + chestBoxWidth / 2,
      top: boundaryBoxRight.top + chestBoxHeight + canvasHeight * 0.01,
      fontSize: canvasHeight * 0.02,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "rightChestText"
    });

    // Center vertical line
    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop - canvasHeight * 0.07;
    const centerY2 = centerY1 + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: strokeColor,
      strokeWidth: 1,
      strokeDashArray: dashPattern,
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // Left and Right borders of center line
    const canvasCenterX = canvas.getWidth() / 2;

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineLeftBorder",
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: "#005bff",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: "centerVerticalLineRightBorder",
      visible: false
    });

    // Add all elements to canvas
    canvas.add(
      boundaryBox,
      boundaryBoxLeft,
      boundaryBoxRight,
      centerVerticalLine,
      leftChestText,
      rightChestText,
      // warningText,
      leftBorder,
      rightBorder
    );

    // Layering
    canvas.sendToBack(rightBorder);
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
  }
  export default createWarningForBoxy