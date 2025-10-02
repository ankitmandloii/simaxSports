const showBoundaryOnAction = (e, fabricCanvasRef, activeProductTitle, activeSide) => {
    // checkBoundary(e);
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();

    // 1. Define all the names you want to find (optional, but good for clarity)
    const desiredObjectNames = new Set([
        "boundaryBox",
        "boundaryBoxInner",
        "boundaryBoxLeft",
        "boundaryBoxRight",
        "centerVerticalLine",
        "warningText",
        "centerVerticalLineLeftBorder",
        "centerVerticalLineRightBorder",
        "leftChestText",
        "rightChestText",
        "youthText",
        "adultText",
    ]);

    // 2. Initialize a map to store the found objects
    const objectMap = {};

    // 3. Iterate over the array ONCE to populate the map
    for (const obj of objects) {
        // We only care about objects that have a 'name' property
        if (obj.name && desiredObjectNames.has(obj.name)) {
            objectMap[obj.name] = obj;
        }
    }

    // 4. Destructure the objects from the map for easy access
    const {
        boundaryBox,
        boundaryBoxInner,
        boundaryBoxLeft,
        boundaryBoxRight,
        centerVerticalLine,
        warningText,
        leftChestText,
        rightChestText,
        youthText,
        adultText,
        // ... any other properties you need
    } = objectMap;

    const productCategory = getProductType(activeProductTitle)
    if (!canvas) return;
    if (productCategory == "Zip") {
        if (activeSide == "front") {
            const showBoundary = true;
            if (boundaryBoxLeft) boundaryBoxLeft.visible = showBoundary;
            if (boundaryBoxRight) boundaryBoxRight.visible = showBoundary;
            if (leftChestText) leftChestText.visible = showBoundary;
            if (rightChestText) rightChestText.visible = showBoundary;
            if (warningText) { warningText.visible = showBoundary; }
        }
        else {
            const showBoundary = true;
            if (boundaryBox) boundaryBox.visible = showBoundary;
            if (warningText) { warningText.visible = showBoundary; }
            // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
        }
    }
    else {
        const showBoundary = true;
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


    if (activeSide == "leftSleeve" || activeSide == "rightSleeve") {
        canvas.renderAll();
        return;
    }
    // // Detect center collision
    const canvasCenterX = canvas.getWidth() / 2;
    const textObjects = objects.filter(
        (obj) => obj.type === "curved-text" || obj.type === "image"
    );

    let anyObjectAtCenter = false;

    // textObjects.forEach((obj) => {
    //     obj.setCoords();

    //     const objCenterX = obj.getCenterPoint().x;
    //     const delta = Math.abs(objCenterX - canvasCenterX);

    //     if (delta <= 4) {
    //         anyObjectAtCenter = true;

    //         // Temporarily lock movement
    //         obj.lockMovementX = true;
    //         canvas.requestRenderAll();

    //         setTimeout(() => {
    //             obj.lockMovementX = false;
    //             canvas.requestRenderAll();
    //         }, 1000);
    //     }

    //     obj.setCoords();
    // });

    // Show / hide the left / right borders
    // leftBorder.set({ visible: anyObjectAtCenter });
    // rightBorder.set({ visible: anyObjectAtCenter });
    if (centerVerticalLine) {
        if (anyObjectAtCenter) {
            // alert("center");
            centerVerticalLine.visible = true
        }
        else {
            centerVerticalLine.visible = false
        }
        // if (centerVerticalLine) { centerVerticalLine.visible = showBoundary; }
        // Change center line color if hitting center
        const originalStroke = centerVerticalLine.originalStroke || centerVerticalLine.stroke || "skyblue";
        if (!centerVerticalLine.originalStroke) {
            centerVerticalLine.originalStroke = originalStroke;
        }

        centerVerticalLine.set("stroke", anyObjectAtCenter ? "orange" : originalStroke);

    }

    canvas.requestRenderAll();

}
function getProductType(title) {

    const keywords = [
        "Boxy",
        "Zip",
        "T-shirt",
        "Hoodie",
        "Women's Sweatshirt",
        "Unisex Sweatshirt",
        "Hooded Sweatshirt",
        "Pullover Hoodie",
        "Polo",
        "Zip(?: Pullover)?", // handles both "Zip" and "Zip Pullover"
        "Tee",
        "Jacket",
        "Long Sleeve",
        "Sweatshirt",
        "Tank",
        "Sleeveless",
    ];

    const lowerTitle = title?.toLowerCase();

    for (let key of keywords) {
        const regex = new RegExp(`\\b${key}\\b`, "i"); // \b ensures whole word match
        if (regex.test(title)) {
            return key;
        }
    }

    return "Unknown";
}
function getProductSleeveType(title) {
    // console.log("-----titleee", title);

    const keywords = [
        "Sleeveless",
        "Long Sleeve",
    ];

    if (!title) {
        // console.log("Title is undefined or null");
        return "Unknown";
    }

    const lowerTitle = title.toLowerCase();
    // console.log("Lowercase title:", lowerTitle);

    for (let key of keywords) {
        const regex = new RegExp(`\\b${key}\\b`, "i");
        // console.log(`Testing regex: ${regex} against title: ${lowerTitle}`);
        if (regex.test(lowerTitle)) {
            // console.log(`Match found for keyword: ${key}`);
            return key;
        }
    }

    // console.log("No match found, returning Unknown");
    return "Unknown";
}



export { showBoundaryOnAction, getProductType, getProductSleeveType }