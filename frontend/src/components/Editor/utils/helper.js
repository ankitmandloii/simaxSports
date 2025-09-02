// import { fabric } from "fabric";


// const renderAllImageObjectsHelper = (imageContaintObject, canvas) => {
//   if (imageContaintObject && imageContaintObject.length > 0) {
//     const MAX_WIDTH = 180;
//     const MAX_HEIGHT = 180;

//     const getScaled = (img, userScaleX = 1, userScaleY = 1) => {
//       const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
//       return {
//         scaleX: scale * userScaleX,
//         scaleY: scale * userScaleY,
//       };
//     };
//     imageContaintObject.forEach((imageData) => {
//       const {
//         id,
//         src,
//         position,
//         angle = 0,
//         flipX = false,
//         flipY = false,
//         locked = false,
//         scaleX = 1,
//         scaleY = 1,
//         layerIndex = 0,
//         customType = "main-image",
//         loading,
//         loadingSrc,
//       } = imageData;
//       fabric.Image.fromURL(
//         src,
//         (img) => {
//           const { scaleX: finalX, scaleY: finalY } = getScaled(
//             img,
//             scaleX,
//             scaleY
//           );

//           img.set({
//             id,
//             left: position.x,
//             top: position.y,
//             angle,
//             scaleX: finalX,
//             scaleY: finalY,
//             flipX,
//             flipY,
//             lockMovementX: locked,
//             lockMovementY: locked,
//             originX: "center",
//             originY: "center",
//             objectCaching: false,
//             borderColor: "skyblue",
//             borderDashArray: [4, 4],
//             hasBorders: true,
//             hasControls: true,
//             selectable: true,
//             evented: true,
//             customType,
//             isSync: true,
//             layerIndex,
//             lockScalingFlip: true,
//           });

//           canvas.add(img);
//         }

//       );

//     });
//   }
// };

// const renderCurveTextObjectsHelper = (textContaintObject, canvas) => {
//   if (textContaintObject && textContaintObject.length > 0) {
//     textContaintObject.forEach((textInput) => {

//       const text = textInput.content || "";
//       const charSpacing = textInput.spacing || 0;
//       const fontSize = 60;

//       const clampScale = (value, min = 1, max = 10) =>
//         Math.max(min, Math.min(value, max));

//       const context = canvas.getElement().getContext("2d");
//       context.font = `${fontSize}px ${textInput.fontFamily || "Arial"}`;
//       const baseWidth = context.measureText(text).width;
//       const extraSpacing = (text.length - 1) * (charSpacing / 1000) * fontSize;
//       const measuredWidth = baseWidth + extraSpacing;
//       const curved = new fabric.CurvedText(textInput.content, {
//         lockScalingFlip: true,
//         id: textInput.id,
//         fontWeight: textInput.fontWeight || "normal",
//         fontStyle: textInput.fontStyle || "normal",
//         left: textInput.position.x || 300,
//         top: textInput.position.y || 300,
//         stroke: textInput.outLineColor || "",
//         strokeWidth: textInput.outLineSize || 0,
//         fill: textInput.textColor || "white",
//         spacing: textInput.spacing,
//         warp: Number(textInput.arc),
//         fontSize: textInput.fontSize,
//         fontFamily: textInput.fontFamily || "Impact",
//         originX: "center",
//         originY: "center",
//         hasControls: true,
//         flipX: textInput.flipX,
//         flipY: textInput.flipY,
//         angle: textInput.angle || 0,
//         scaleX: textInput.scaleX,
//         scaleY: textInput.scaleY,
//         layerIndex: textInput.layerIndex,
//         maxWidth: 250,
//         // height: 100,
//         objectCaching: false,
//         lockMovementX: textInput.locked,
//         lockMovementY: textInput.locked,
//         borderColor: "skyblue",
//         borderDashArray: [4, 4],
//         hasBorders: true,
//         selectable: true,
//         evented: true,
//         hasControls: true,
//         width: Math.min(measuredWidth + 20, 200),
//         isSync: true,
//       });
//       canvas.add(curved);
//     });
//     canvas.renderAll();
//   }

// }
// // Function to render text and images on an off-screen canvas
// async function renderDesignOnCanvas(canvasWidth, canvasHeight, canvas, backgroundImage, texts, images) {
//   // Clear the canvas before rendering
//   canvas.clear();
//   // 
//   // const canvasWidth = canvas.getWidth();
//   // const canvasHeight = canvas.getHeight();
//   // Add background image (if provided)
//   // if (background) {
//   //   await new Promise((resolve, reject) => { // Added reject for error handling
//   //     fabric.Image.fromURL(background, (bg) => {
//   //       if (bg) { // Check if image loaded successfully
//   //         canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));
//   //         resolve();
//   //       } else {
//   //         reject(new Error("Failed to load background image: " + background));
//   //       }
//   //     }, {
//   //       crossOrigin: 'anonymous' // <--- ADD THIS HERE FOR BACKGROUND IMAGE
//   //     });
//   //   });f
//   // }

//   if (backgroundImage) {
//     fabric.Image.fromURL(
//       backgroundImage,
//       (img) => {
//         const imgWidth = img.width;
//         const imgHeight = img.height;

//         // Calculate scale based on the parent container size
//         const scaleX = (canvasWidth - 130) / imgWidth;
//         const scaleY = (canvasHeight - 130) / imgHeight;

//         // Apply the scale to ensure the image fits within the canvas while maintaining aspect ratio
//         const scale = Math.max(scaleX, scaleY);

//         img.set({
//           left: canvasWidth / 2,
//           top: canvasHeight / 2 - 25,
//           originX: "center",
//           originY: "center",
//           scaleX: scale || 1,
//           scaleY: scale || 1,
//           selectable: false,
//           evented: false,
//         });

//         canvas.setBackgroundImage(img, () => {
//           canvas.renderAll();
//         });
//       },
//       { crossOrigin: "anonymous" }
//     );
//   }
//   //render text elements
//   renderCurveTextObjectsHelper(texts, canvas)
//   // Render image elements
//   renderAllImageObjectsHelper(images, canvas)

//   canvas.renderAll();
// }

// // Function to export a canvas as PNG
// function exportCanvasAsPNG(canvas) {
//   return canvas.toDataURL({
//     format: 'png',
//     multiplier: 2, // Optional: Increase quality
//   });
// }

// // Main function to handle the design rendering and export
// export async function generateDesigns(backgrounds, texts, images) {
//   const exportedImages = [];

//   // Create off-screen canvases and render the designs asynchronously
//   for (let i = 0; i < backgrounds.length; i++) {
//     // Create an off-screen canvas (not attached to the DOM)
//     const canvasElement = document.getElementById('canvas');
//     // if (!canvasElement) return; // Ensure the canvas element exists
//     const wrapperElement = canvasElement.parentNode;
//     // if (!wrapperElement) return; // Ensure the wrapper exists
//     const canvasWidth = wrapperElement.clientWidth;
//     const canvasHeight = wrapperElement.clientHeight;
//     const canvas = new fabric.Canvas(canvasElement);

//     // Set canvas size (e.g., 500x500)
//     canvas.setWidth(canvasWidth);
//     canvas.setHeight(canvasHeight);

//     try {
//       // Render the design for the current canvas
//       await renderDesignOnCanvas(canvasWidth, canvasHeight, canvas, backgrounds[i], texts[i], images[i]);

//       // Export the canvas as PNG and push to the array
//       const pngDataUrl = exportCanvasAsPNG(canvas);
//       exportedImages.push(pngDataUrl);
//     } catch (error) {
//       console.error(`Error rendering design for index ${i}:`, error);
//       // You might want to push a placeholder or skip this design
//       // exportedImages.push(null); // Example: push null if a design fails
//     }
//   }

//   // Return the array of PNG data URLs
//   return exportedImages;
// }
import { fabric } from "fabric";

/**
 * Renders all image objects onto the given Fabric.js canvas.
 * This function returns a Promise that resolves when all images are loaded and added.
 * @param {Array<Object>} imageContentObjects - Array of image data objects.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas instance.
 * @returns {Promise<void>} A Promise that resolves when all images are added to the canvas.
 */
const renderAllImageObjectsHelper = (imageContentObjects, canvas) => {
  if (!imageContentObjects || imageContentObjects.length === 0) {
    return Promise.resolve(); // No images to render, resolve immediately
  }

  const MAX_WIDTH = 180;
  const MAX_HEIGHT = 180;

  const getScaled = (img, userScaleX = 1, userScaleY = 1) => {
    const scale = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
    return {
      scaleX: scale * userScaleX,
      scaleY: scale * userScaleY,
    };
  };

  const imageLoadPromises = imageContentObjects.map((imageData) => {
    return new Promise((resolve, reject) => {
      const {
        id,
        src,
        position,
        angle = 0,
        flipX = false,
        flipY = false,
        locked = false,
        scaleX = 1,
        scaleY = 1,
        layerIndex = 0,
        customType = "main-image",
      } = imageData;

      // Ensure crossOrigin is set for all external images to prevent tainting
      fabric.Image.fromURL(src, (img) => {
        if (!img) {
          console.warn(`Failed to load image from URL: ${src}`);
          // Resolve even on failure to allow other images to load
          resolve();
          return;
        }

        const { scaleX: finalX, scaleY: finalY } = getScaled(
          img,
          scaleX,
          scaleY
        );

        img.set({
          id,
          left: position.x,
          top: position.y,
          angle,
          scaleX: finalX,
          scaleY: finalY,
          flipX,
          flipY,
          lockMovementX: locked,
          lockMovementY: locked,
          originX: "center",
          originY: "center",
          objectCaching: false,
          borderColor: "skyblue",
          borderDashArray: [4, 4],
          hasBorders: true,
          hasControls: true,
          selectable: true,
          evented: true,
          customType,
          isSync: true,
          layerIndex,
          lockScalingFlip: true,
        });

        canvas.add(img);
        resolve(); // Resolve the promise once the image is added
      }, { crossOrigin: 'anonymous' }); // Crucial for CORS
    });
  });

  return Promise.all(imageLoadPromises); // Wait for all images to load
};

/**
 * Renders all curved text objects onto the given Fabric.js canvas.
 * This function is synchronous as Fabric.js text objects are created immediately.
 * @param {Array<Object>} textContentObjects - Array of text data objects.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas instance.
 */
const renderCurveTextObjectsHelper = (textContentObjects, canvas) => {
  if (!textContentObjects || textContentObjects.length === 0) {
    return; // No text to render
  }

  textContentObjects.forEach((textInput) => {
    const text = textInput.content || "";
    const charSpacing = textInput.spacing || 0;
    const fontSize = textInput.fontSize || 60; // Use textInput.fontSize if available

    const context = canvas.getElement().getContext("2d");
    context.font = `${fontSize}px ${textInput.fontFamily || "Arial"}`;
    const baseWidth = context.measureText(text).width;
    const extraSpacing = (text.length - 1) * (charSpacing / 1000) * fontSize;
    const measuredWidth = baseWidth + extraSpacing;

    const curved = new fabric.CurvedText(textInput.content, {
      lockScalingFlip: true,
      id: textInput.id,
      fontWeight: textInput.fontWeight || "normal",
      fontStyle: textInput.fontStyle || "normal",
      left: textInput.position.x || 300,
      top: textInput.position.y || 300,
      stroke: textInput.outLineColor || "",
      strokeWidth: textInput.outLineSize || 0,
      fill: textInput.textColor || "white",
      spacing: textInput.spacing,
      warp: Number(textInput.arc),
      fontSize: textInput.fontSize,
      fontFamily: textInput.fontFamily || "Impact",
      originX: "center",
      originY: "center",
      hasControls: true,
      flipX: textInput.flipX,
      flipY: textInput.flipY,
      angle: textInput.angle || 0,
      scaleX: textInput.scaleX,
      scaleY: textInput.scaleY,
      layerIndex: textInput.layerIndex,
      maxWidth: 250,
      objectCaching: false,
      lockMovementX: textInput.locked,
      lockMovementY: textInput.locked,
      borderColor: "skyblue",
      borderDashArray: [4, 4],
      hasBorders: true,
      selectable: true,
      evented: true,
      hasControls: true,
      width: Math.min(measuredWidth + 20, 200),
      isSync: true,
    });
    canvas.add(curved);
  });
};

/**
 * Renders a complete design (background, texts, images) onto an off-screen canvas.
 * This function is asynchronous and ensures all assets are loaded before rendering.
 * @param {number} canvasWidth - The width of the canvas for rendering.
 * @param {number} canvasHeight - The height of the canvas for rendering.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas instance.
 * @param {string} backgroundImageSrc - URL of the background image.
 * @param {Array<Object>} texts - Array of text data objects.
 * @param {Array<Object>} images - Array of image data objects.
 * @returns {Promise<void>} A Promise that resolves when the design is fully rendered.
 */
async function renderDesignOnCanvas(canvasWidth, canvasHeight, canvas, backgroundImageSrc, texts, images) {
  // Clear the canvas before rendering new design
  canvas.clear();

  // Add background image (if provided)
  if (backgroundImageSrc) {
    await new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        backgroundImageSrc,
        (img) => {
          if (!img) {
            console.warn(`Failed to load background image: ${backgroundImageSrc}`);
            resolve(); // Resolve even on failure to allow other elements to render
            return;
          }

          const imgWidth = img.width;
          const imgHeight = img.height;

          // Calculate scale to fit background image within canvas, maintaining aspect ratio
          // Adjusted to fill the canvas, not just fit within a padded area, for backgrounds
          const scaleX = (canvasWidth - 130) / imgWidth;
          const scaleY = (canvasHeight - 130) / imgHeight;
          const scale = Math.max(scaleX, scaleY); // Use Math.max to ensure it covers the canvas

          img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2 - 25,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
          });

          canvas.setBackgroundImage(img, () => {
            resolve(); // Resolve after background image is set
          });
        },
        { crossOrigin: "anonymous" } // Crucial for CORS
      );
    });
  }

  // Render text elements (synchronous)
  renderCurveTextObjectsHelper(texts, canvas);

  // Render image elements (asynchronous, await its completion)
  await renderAllImageObjectsHelper(images, canvas);

  // After all elements are added, render the canvas once
  canvas.renderAll();
}

// Function to export a canvas as PNG
function exportCanvasAsPNG(canvas) {
  return canvas.toDataURL({
    format: 'png',
    multiplier: 2, // Optional: Increase quality
  });
}

/**
 * Main function to handle the design rendering and export for multiple designs.
 * Each design is rendered on a new off-screen canvas.
 * @param {Array<string>} backgrounds - Array of background image URLs.
 * @param {Array<Array<Object>>} texts - Array of arrays of text data objects for each design.
 * @param {Array<Array<Object>>} images - Array of arrays of image data objects for each design.
 * @returns {Promise<Array<string>>} A Promise that resolves with an array of PNG data URLs.
 */
export async function generateDesigns(backgrounds, texts, images) {
  const exportedImages = [];

  // Define a consistent size for the off-screen canvases
  const OFFSCREEN_CANVAS_WIDTH = 500;
  const OFFSCREEN_CANVAS_HEIGHT = 500;

  // Create off-screen canvases and render the designs asynchronously
  for (let i = 0; i < backgrounds.length; i++) {
    // Create a new off-screen canvas element for each design
    const canvasElement = document.getElementById('canvas-export');
    const wrapperElement = document.getElementById("canvasParent");

    const canvasWidth = wrapperElement.clientWidth;
    const canvasHeight = wrapperElement.clientHeight;
    console.log("canvasWidth canvasHeight", canvasWidth, canvasHeight)

    const canvas = new fabric.Canvas(canvasElement, {
      width: canvasWidth,
      height: canvasHeight,
    });

    // Set canvas size
    // canvas.setWidth(OFFSCREEN_CANVAS_WIDTH);
    // canvas.setHeight(OFFSCREEN_CANVAS_HEIGHT);

    try {
      // Render the design for the current canvas
      await renderDesignOnCanvas(
        canvasWidth,
        canvasHeight,
        canvas,
        backgrounds[i],
        texts,
        images
      );

      // Export the canvas as PNG and push to the array
      const pngDataUrl = exportCanvasAsPNG(canvas);
      exportedImages.push(pngDataUrl);
    } catch (error) {
      console.error(`Error rendering design for index ${i}:`, error);
      // Optionally, push a placeholder or null if a design fails
      exportedImages.push(null);
    } finally {
      // Dispose the canvas to free up memory, important for off-screen canvases in a loop
      // canvas.dispose();
    }
  }

  // Return the array of PNG data URLs
  return exportedImages;
}