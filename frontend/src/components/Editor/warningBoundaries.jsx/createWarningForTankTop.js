
 function createWarningForTankTop({canvasWidth, canvasHeight, canvas,warningColor,activeSide,getProductSleeveType,activeProductTitle,fabric}) {

    if (activeSide == "leftSleeve" || activeSide == "rightSleeve") {
      return;
    }
    const boxWidth = canvasWidth * 0.38;
    const boxHeight = canvasHeight * 0.5;
    const boxLeft = (canvasWidth - boxWidth) / 2;

    // Center the box slightly higher (tanks are usually cut shorter)
    const boxTop = (canvasHeight - boxHeight) / 2 - canvasHeight * 0.04;

    // Dynamic proportions
    const warningTextYOffset = canvasHeight * 0.03;
    const leftBoxWidth = canvasWidth * 0.14;
    const leftBoxHeight = canvasWidth * 0.14;
    const leftChestTextFontSize = canvasHeight * 0.016;
    const warningTextFontSize = canvasHeight * 0.03;
    const leftChestTextGap = canvasHeight * 0.01;

    // Main print boundary
    const boundaryBox = new fabric.Rect({
      left: boxLeft,
      top: boxTop,
      width: boxWidth,
      height: boxHeight,
      fill: "transparent",
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
      isSync: false,
      name: "boundaryBox"
    });


    // Warning text above main box
    const warningText = new fabric.Text("Please keep design inside the box", {
      left: boxLeft + boxWidth / 2,
      top: boxTop - warningTextYOffset,
      fontSize: warningTextFontSize,
      fontFamily: "proxima-soft, sans-serif",
      fill: "white",
      selectable: false,
      evented: false,
      visible: false,
      originX: "center",
      originY: "top",
      name: "warningText"
    });

    // Vertical center guideline
    const centerX = boxLeft + boxWidth / 2;
    const centerY1 = boxTop;
    const centerY2 = boxTop + boxHeight;

    const centerVerticalLine = new fabric.Line([centerX, centerY1, centerX, centerY2], {
      stroke: warningColor || "skyblue",
      strokeWidth: 1,
      strokeDashArray: [3, 1],
      selectable: false,
      evented: false,
      visible: false,
      name: "centerVerticalLine"
    });

    // Slight borders around center for guidance
    const canvasCenterX = canvas.getWidth() / 2;

    const leftBorder = new fabric.Line([canvasCenterX - 2, centerY1, canvasCenterX - 2, centerY2], {
      stroke: '#005bff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: 'centerVerticalLineLeftBorder',
      visible: false
    });

    const rightBorder = new fabric.Line([canvasCenterX + 2, centerY1, canvasCenterX + 2, centerY2], {
      stroke: '#005bff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: 'centerVerticalLineRightBorder',
      visible: false
    });

    // Add to canvas
    canvas.add(
      boundaryBox,
      warningText,
      centerVerticalLine,
      leftBorder,
      rightBorder
    );

    // Bring relevant elements to front
    warningText.initDimensions();
    canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);

  }

  export default createWarningForTankTop