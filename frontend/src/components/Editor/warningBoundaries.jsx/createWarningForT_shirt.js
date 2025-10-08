
function createWarningForT_shirt({ canvasWidth, canvasHeight, canvas, warningColor, activeSide, getProductSleeveType, activeProductTitle, fabric }) {
    console.log("fabric", fabric)
    let boxWidth = canvasWidth * 0.36;
    let boxHeight = canvasHeight * 0.5;
    let boxLeft = (canvasWidth - boxWidth) / 2;
    let boxTop = (canvasHeight - boxHeight) / 2;

    const strokeColor = warningColor || "skyblue";
    const dashPattern = [5, 2];


    // --- Configuration ---
    const strokeColorAdult = warningColor || "#FF5722"; // Bright Orange for Adult box (Outer)
    const strokeColorYouth = warningColor || "#FF5722"; // Use same color for Youth box (Inner)
    const dashPatternYouth = [5, 2]; // Dashed line for Youth box

    // 1. ADULT BOX (Outer Bounding Box - Solid)
    let adultBoxWidth = canvasWidth * 0.38;
    let adultBoxHeight = canvasHeight * 0.5;
    let adultBoxLeft = (canvasWidth - adultBoxWidth) / 2;
    let adultBoxTop = (canvasHeight - adultBoxHeight) / 2;

    // Adjustments for sleeve view (Keep existing logic)
    if (activeSide === "leftSleeve" || activeSide == "rightSleeve") {
        const sleeveType = getProductSleeveType(activeProductTitle);
        if (sleeveType == "Sleeveless") return;
        if (sleeveType == "Long Sleeve") {
            adultBoxLeft += canvasWidth * 0.1;
            adultBoxWidth = canvasWidth * 0.2;
            adultBoxHeight = canvasHeight * 0.4;
            adultBoxTop -= canvasHeight * 0.03;
        } else {
            adultBoxLeft += canvasWidth * 0.1;
            adultBoxWidth = canvasWidth * 0.2;
            adultBoxHeight = canvasHeight * 0.23;
            adultBoxTop -= canvasHeight * 0.03;
        }
    }

    // Set the vertical offset for the whole design group
    const verticalOffset = canvasHeight * 0.10;



    // 2. YOUTH BOX (Inner Bounding Box - Dashed)
    // Reduce size for youth (e.g., 85% of adult size)
    const youthScale = 0.89;
    const youthBoxWidth = adultBoxWidth * youthScale;
    const youthBoxHeight = adultBoxHeight * youthScale;

    // Calculate position to center the youth box inside the adult box
    const youthBoxLeft = adultBoxLeft + (adultBoxWidth - youthBoxWidth) / 2;
    const youthBoxTop = (adultBoxTop - verticalOffset) + (adultBoxHeight - youthBoxHeight) / 2;


    const boundaryBoxYouth = new fabric.Rect({
        left: youthBoxLeft,
        top: youthBoxTop,
        width: youthBoxWidth,
        height: youthBoxHeight,
        fill: "transparent",
        stroke: strokeColorYouth,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        visible: true,
        objectCaching: false,
        strokeDashArray: dashPatternYouth,
        name: "boundaryBoxInner"
    });

    // 3. TEXT LABELS (Adult and Youth)
    const labelFontSize = canvasHeight * 0.025;
    const labelFontFamily = "proxima-soft, sans-serif";
    const labelFill = "white";
    const textVerticalOffset = canvasHeight * 0.001; // Space below the box

    // Youth Label (Placed just below the Youth Box)
    const youthText = new fabric.Text("Youth", {
        left: youthBoxLeft + youthBoxWidth / 2, // Centered horizontally on Youth box
        top: youthBoxTop + youthBoxHeight - (canvasHeight * 0.04), // Below Youth box
        fontSize: labelFontSize,
        fontFamily: labelFontFamily,
        fill: labelFill,
        selectable: false,
        evented: false,
        visible: true,
        originX: "center",
        originY: "top",
        name: "youthText"
    });

    // Adult Label (Placed just below the Adult Box)
    const adultText = new fabric.Text("Adult", {
        left: adultBoxLeft + adultBoxWidth / 2, // Centered horizontally on Adult box
        top: adultBoxTop - verticalOffset + adultBoxHeight - (canvasHeight * 0.015), // Below Adult box
        fontSize: labelFontSize,
        fontFamily: labelFontFamily,
        fill: labelFill,
        selectable: false,
        evented: false,
        visible: true,
        originX: "center",
        originY: "top",
        name: "adultText"
    });

    // --- Existing/Other Elements (Commented out for this specific view) ---



    // boundaryBoxLeft, boundaryBoxRight, leftChestText, rightChestText, centerVerticalLine, leftBorder, rightBorder
    // These existing elements are currently calculated but will not be added to the canvas in this version
    // unless you want them visible alongside the Adult/Youth boxes.


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
            boxLeft += canvasWidth * 0.1;
            boxWidth = canvasWidth * 0.2;
            boxHeight = canvasHeight * 0.23;
            boxTop -= canvasHeight * 0.03;
        }
    }

    const boundaryBox = new fabric.Rect({
        left: boxLeft,
        top: boxTop - canvasHeight * 0.08,
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
    const chestBoxTopOffset = canvasHeight * 0.07;

    const boundaryBoxLeft = new fabric.Rect({
        left: boxLeft + chestBoxLeftOffset - (canvasWidth * 0.01),
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
            top: boxTop - canvasHeight * 0.11,
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

    // --- Add all new elements to canvas ---
    canvas.add(
        boundaryBoxYouth,
        youthText,
        adultText,
    );

    canvas.bringToFront(boundaryBoxYouth);
    canvas.bringToFront(youthText);
    canvas.bringToFront(adultText);

    // Layering
    canvas.sendToBack(rightBorder);
    // warningText.initDimensions();
    // canvas.bringToFront(warningText);
    canvas.bringToFront(boundaryBox);
    canvas.bringToFront(centerVerticalLine);
}
export default createWarningForT_shirt
