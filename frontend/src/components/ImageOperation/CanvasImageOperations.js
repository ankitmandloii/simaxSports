async function processAndReplaceColors(imageSrc, color, editColor = false, extractedColors = []) {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();

    if (!imageSrc.startsWith("data:image")) {
      img.crossOrigin = "anonymous";
    }

    img.src = imageSrc;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Failed to load image"));
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (editColor) {
      try {
        const paletteUrl = imageSrc.split("?")[0] + "?palette=json";
        const res = await fetch(paletteUrl);

        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
          const json = await res.json();
          const colors = json?.colors?.map(c => `${c.hex}`) || [];
          const updateColors = [...extractedColors];

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          const minLength = Math.min(colors.length, updateColors.length);
          for (let i = 0; i < minLength; i++) {
            const targetColor = hexToRgbForReplaceColor(colors[i]);
            const newColor = hexToRgbForReplaceColor(updateColors[i]);

            for (let j = 0; j < data.length; j += 4) {
              const r = data[j], g = data[j + 1], b = data[j + 2];
              if (colorsMatch([r, g, b], targetColor, 50)) {
                data[j] = newColor[0];
                data[j + 1] = newColor[1];
                data[j + 2] = newColor[2];
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);
        } else {
          console.warn("Palette not found, returning normal image.");
        }
      } catch (paletteError) {
        console.warn("Failed to fetch/parse palette, returning normal image:", paletteError.message);
      }
    }

    // Always return something (normal image if no replacement was done)
    const objectURL = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error("Failed to convert canvas to blob"))),
        "image/png",
        0.92
      );
    });

    canvas.width = 0;
    canvas.height = 0;

    return objectURL;
  } catch (error) {
    console.error("Error in processing the image:", error);
    throw error;
  }
}
function applyFilterAndGetUrl(imageSrc, color) {
  console.log("apply filter call with color", color, imageSrc);
  imageSrc = String(imageSrc);
  if (imageSrc.includes("monochrome=black")) {
    imageSrc = imageSrc.replace("monochrome=black", "");
  }
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();

    // If imageSrc is base64, directly set img.src
    if (imageSrc.startsWith("data:image")) {
      img.src = imageSrc;
    } else {
      img.crossOrigin = "anonymous"; // Allow cross-  origin access
      img.src = imageSrc;  // For external URLs
    }

    img.onload = function () {
      // Set the canvas size to the image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get the tint color in RGB
      const tint = hexToRgb(color);

      // Apply the effect: grayscale, sepia, and alpha tinting
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3]; // Alpha value

        // Calculate brightness and invert it
        const brightness = (r + g + b) / 3;
        const inverted = 255 - brightness;
        const alpha = inverted / 255;

        // If the pixel is fully transparent, retain transparency; else apply tint
        if (a === 0) {
          data[i + 3] = 0; // Keep the pixel transparent
        } else {
          // Apply tint color and alpha (preserving original alpha if the background exists)
          data[i] = tint.r; // Red
          data[i + 1] = tint.g; // Green
          data[i + 2] = tint.b; // Blue
          data[i + 3] = a * alpha; // Keep the transparency effect consistent
        }
      }

      // Put the altered image data back to the canvas
      ctx.putImageData(imageData, 0, 0);

      // Return the base64 representation of the canvas
      canvas.toBlob((blob) => {
        if (blob) {
          const objectURL = URL.createObjectURL(blob);
          resolve(objectURL); // You can directly use this in img.src
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }

        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
        // canvas.remove();
      }, "image/png", 0.92);
      // canvas.remove();
    };

    img.onerror = function () {
      resolve(imageSrc);
    };
  });
}
function invertColorsAndGetUrl(imageSrc) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();

    // If imageSrc is base64, directly set img.src
    if (imageSrc.startsWith("data:image")) {
      img.src = imageSrc;
    } else {
      img.crossOrigin = "anonymous"; // Allow cross-origin access
      img.src = imageSrc;  // For external URLs
    }

    img.onload = function () {
      // Set the canvas size to the image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get the image data from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Loop through each pixel and invert the brightness
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }

      // Put the altered image data back to the canvas
      ctx.putImageData(imageData, 0, 0);

      // Return the base64 representation of the inverted image
      canvas.toBlob((blob) => {
        if (blob) {
          const objectURL = URL.createObjectURL(blob);
          resolve(objectURL); // You can directly use this in img.src
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }

        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
        // canvas.remove();
      }, "image/png", 0.92);
      // canvas.remove();
    };

    img.onerror = function () {
      resolve(imageSrc);
    };
  });
}
function getBase64CanvasImage(imageSrc, color) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;

      // Optional: Fill background if needed (e.g., white)
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);

      // Export as Blob and convert to Object URL
      canvas.toBlob((blob) => {
        if (blob) {
          const objectURL = URL.createObjectURL(blob);
          resolve(objectURL); // You can directly use this in img.src
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }

        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
        // canvas.remove();
      }, "image/png", 0.92);
    };

    img.onerror = function () {
      reject(new Error("Failed to load image"));
    };
  });
}
function replaceColorAndGetBase64(imageSrc, targetHex, newHex, tolerance = 50) {
  // console.log(targetHex, newHex, "replaceColorAndGetBase64 functiion", imageSrc)
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();

    // Support CORS if external URL
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = async function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const targetColor = hexToRgbForReplaceColor(targetHex);
      const newColor = hexToRgbForReplaceColor(newHex);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];

        if (colorsMatch([r, g, b], targetColor, tolerance)) {
          data[i] = newColor[0];
          data[i + 1] = newColor[1];
          data[i + 2] = newColor[2];
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const base64 = canvas.toDataURL('image/png');


      const objectURL = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/png", 0.92);
      });

      // Cleanup
      canvas.width = 0;
      canvas.height = 0;
      // canvas.remove();

      resolve(objectURL);
      // canvas.remove();
    };

    img.onerror = function () {
      resolve(imageSrc);
    };
  });
}
function hexToRgbForReplaceColor(hex) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}
function colorsMatch(c1, c2, tolerance = 50) {
  return (
    Math.abs(c1[0] - c2[0]) < tolerance &&
    Math.abs(c1[1] - c2[1]) < tolerance &&
    Math.abs(c1[2] - c2[2]) < tolerance
  );
}
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
export { processAndReplaceColors, applyFilterAndGetUrl, invertColorsAndGetUrl, getBase64CanvasImage, replaceColorAndGetBase64 };