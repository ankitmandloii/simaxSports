
function createWarningForhoodie({canvasWidth, canvasHeight, canvas,warningColor,activeSide,getProductSleeveType,activeProductTitle,fabric}) {
    let boxWidth = canvasWidth * 0.4;
    let boxHeight = canvasHeight * 0.34;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    if (activeSide === "front") {
        boxTop -= canvasHeight * 0.12;
    } else if (activeSide == "back") {
        boxTop -= canvasHeight * 0.07;
    }
    else {
        boxLeft += canvasWidth * 0.12
        boxWidth = canvasWidth * 0.18;
        boxHeight = canvasHeight * 0.34;
        boxTop -= canvasHeight * 0.10;
    }



    // Dynamic proportions
    const warningTextYOffset = canvasHeight * 0.03;
    const leftBoxWidth = canvasWidth * 0.15;
    const leftBoxHeight = canvasWidth * 0.15;
    const leftChestTextFontSize = canvasHeight * 0.02;
    const warningTextFontSize = canvasHeight * 0.03;
    const leftChestTextGap = canvasHeight * 0.01;
    const textGapFromBottom = canvasHeight * 0.0225;

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

    const boundaryBoxLeft = new fabric.Rect({
        left: boxLeft + boxWidth - leftBoxWidth, // align to top-right corner
        top: boxTop,
        width: leftBoxWidth,
        height: leftBoxHeight,
        fill: "transparent",
        stroke: warningColor || "skyblue",
        strokeWidth: 1,
        strokeDashArray: [3, 1],
        selectable: false,
        evented: false,
        visible: false,
        isSync: false,
        objectCaching: false,
        name: "boundaryBoxLeft"
    });

    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {


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
        canvas.add(warningText);
        canvas.bringToFront(warningText);
    }

    const leftChestText = new fabric.Text("Left Chest", {
        left: boundaryBoxLeft.left + leftBoxWidth / 2, // center under box
        top: boundaryBoxLeft.top + leftBoxHeight - textGapFromBottom,
        fontSize: leftChestTextFontSize,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        isSync: false,
        originX: "center",
        originY: "top",
        textAlign: "center",
        name: "leftChestText"
    });

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

    // Add all elements
    canvas.add(
        boundaryBox,
        boundaryBoxLeft,
        // warningText,
        leftChestText,
        centerVerticalLine,
        rightBorder
    );

    // Ensure proper layer order
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
}

export default createWarningForhoodie