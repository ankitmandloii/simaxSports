

function createWarningForZip({ canvasWidth, canvasHeight, canvas, warningColor, activeSide, getProductSleeveType, activeProductTitle, fabric }) {
    // MAIN BACK BOX
    let boxWidthBack = canvasWidth * 0.4;
    let boxHeightBack = canvasHeight * 0.6;
    let boxLeftBack = (canvasWidth - boxWidthBack) / 2;
    let boxTopBack = (canvasHeight - boxHeightBack) / 2;


    // CHEST BOXES
    const chestBoxWidth = canvasWidth * 0.15;
    const chestBoxHeight = canvasHeight * 0.15;
    const centerX = canvasWidth / 2;
    const spacing = canvasWidth * 0.05;
    const chestBoxTop = canvasHeight * 0.2;

    // DYNAMIC TEXT/OFFSET VALUES

    const textFontSize = canvasHeight * 0.02;      // ≈13px
    const textGapFromBottom = canvasHeight * 0.0225; // ≈18px
    const warningTextOffset = canvasHeight * 0.03;   // ≈20px
    const backBoxTopOffset = canvasHeight * 0.0375;  // ≈30px


    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {

        boxLeftBack += canvasWidth * 0.15
        boxWidthBack = canvasWidth * 0.16;
        boxHeightBack = canvasHeight * 0.5;

        //   boxLeft += canvasWidth * 0.15;
        // boxWidth = canvasWidth * 0.2;
        // boxHeight = canvasHeight * 0.6;
        // boxTop -= canvasHeight * 0.03;
        // boxTopBack ;
    }

    // WARNING TEXT ABOVE MAIN BACK BOX
    if (activeSide !== "leftSleeve" && activeSide !== "rightSleeve") {
        const warningText = new fabric.Text("Please keep design inside the box", {
            left: boxLeftBack + boxWidthBack / 2,
            top: boxTopBack - warningTextOffset,
            fontSize: canvasHeight * 0.03,
            fontFamily: "proxima-soft, sans-serif",
            fill: "white",
            selectable: false,
            evented: false,
            visible: false,
            originX: "center",
            originY: "top",
            name: "warningText",
        });

        canvas.add(warningText);
        canvas.bringToFront(warningText);
    }
    // MAIN BACK BOUNDARY BOX
    const boundaryBox = new fabric.Rect({
        left: boxLeftBack,
        top: boxTopBack - backBoxTopOffset,
        width: boxWidthBack,
        height: boxHeightBack,
        fill: "transparent",
        stroke: warningColor || "skyblue",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        visible: false,
        isSync: false,
        name: "boundaryBox"
    });

    // RIGHT CHEST BOX (left side)
    const boundaryBoxRight = new fabric.Rect({
        left: centerX - chestBoxWidth - spacing,
        top: chestBoxTop,
        width: chestBoxWidth,
        height: chestBoxHeight,
        fill: "transparent",
        stroke: warningColor || "skyblue",
        strokeWidth: 1,
        strokeDashArray: [3, 1],
        selectable: false,
        evented: false,
        visible: false,
        objectCaching: false,
        name: "boundaryBoxRight"
    });

    // RIGHT CHEST TEXT
    const rightChestText = new fabric.Text("Right Chest", {
        left: boundaryBoxRight.left + chestBoxWidth / 2,
        top: boundaryBoxRight.top + chestBoxHeight - textGapFromBottom,
        fontSize: textFontSize,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "rightChestText"
    });

    // LEFT CHEST BOX (right side)
    const boundaryBoxLeft = new fabric.Rect({
        left: centerX + spacing,
        top: chestBoxTop,
        width: chestBoxWidth,
        height: chestBoxHeight,
        fill: "transparent",
        stroke: warningColor || "skyblue",
        strokeWidth: 1,
        strokeDashArray: [3, 1],
        selectable: false,
        evented: false,
        visible: false,
        objectCaching: false,
        name: "boundaryBoxLeft"
    });

    // LEFT CHEST TEXT
    const leftChestText = new fabric.Text("Left Chest", {
        left: boundaryBoxLeft.left + chestBoxWidth / 2,
        top: boundaryBoxLeft.top + chestBoxHeight - textGapFromBottom,
        fontSize: textFontSize,
        fontFamily: "proxima-soft, sans-serif",
        fill: "white",
        selectable: false,
        evented: false,
        visible: false,
        originX: "center",
        originY: "top",
        name: "leftChestText"
    });
    const centerXVertical = boxLeftBack + boxWidthBack / 2;
    const centerY1 = boxTopBack - backBoxTopOffset;
    const centerY2 = boxTopBack + boxHeightBack - backBoxTopOffset;

    const centerVerticalLine = new fabric.Line([centerXVertical, centerY1, centerX, centerY2], {
        stroke: warningColor || "skyblue",
        strokeWidth: 1,
        strokeDashArray: [3, 1],
        selectable: false,
        evented: false,
        visible: false,
        name: "centerVerticalLine"
    });

    // ADD TO CANVAS
    if (activeSide == "back") {
        canvas.add(centerVerticalLine);
    }
    canvas.add(
        boundaryBox,
        boundaryBoxLeft,
        leftChestText,
        boundaryBoxRight,
        rightChestText
    );

    // BRING TO FRONT
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(boundaryBoxRight);
    canvas.bringToFront(leftChestText);
    canvas.bringToFront(rightChestText);
    canvas.bringToFront(boundaryBoxLeft);
    if (activeSide == "back") {
        canvas.bringToFront(centerVerticalLine);
    }
}
export default createWarningForZip