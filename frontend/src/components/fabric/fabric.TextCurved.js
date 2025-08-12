// import { fabric } from "fabric";

// const CurvedText = fabric.util.createClass(fabric.Object, {
//   type: "curved-text",

//   initialize: function(text, options) {
//     options = options || {};
//     this.callSuper("initialize", options);

//     this.text = text || "";

//     this.id = options.id || "";
//     this.left = options.left || 300;
//     this.top = options.top || 300;
//     this.spacing = options.spacing || 0;

//     this.stroke = options.stroke || "";
//     this.strokeWidth = options.strokeWidth || 0;
//     this.fill = options.fill || "white";

//     this.warp = Number(options.warp) || 0;

//     this.fontSize = options.fontSize || 16;
//     this.fontFamily = options.fontFamily || "Impact";
//     this.originX = options.originX || "center";
//     this.originY = options.originY || "center";

//     this.flipX = options.flipX || false;
//     this.flipY = options.flipY || false;

//     this.angle = options.angle || 0;
//     this.scaleX = options.scaleX || 1;
//     this.scaleY = options.scaleY || 1;
//     this.layerIndex = options.layerIndex || 0;

//     this.lineHeight = options.lineHeight || 1.2;

//     this.originX = "center";
//     this.originY = "center";


//     this.objectCaching = false;

//     this.maxWidth = options.maxWidth || null; // maxWidth option
//     this.width = options.width || 100; // maxWidth option
//   },

//   _wrapTextToLines: function(ctx, text, maxWidth, spacing) {
//     if (!maxWidth) {
//       return text.split("\n");
//     }

//     const lines = [];
//     const paragraphs = text.split("\n");

//     for (const paragraph of paragraphs) {
//       const words = paragraph.split(" ");
//       let currentLine = "";

//       for (let n = 0; n < words.length; n++) {
//         let word = words[n];

//         while (word.length > 0) {
//           let testLine = currentLine ? currentLine + " " + word : word;
//           let testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * spacing;

//           if (testWidth <= maxWidth) {
//             currentLine = testLine;
//             word = "";
//           } else if (word.length === 1) {
//             if (currentLine) {
//               lines.push(currentLine);
//               currentLine = word;
//             } else {
//               currentLine = word;
//             }
//             word = "";
//           } else {
//             let subWord = "";
//             for (let i = 1; i <= word.length; i++) {
//               let part = word.slice(0, i);
//               testLine = currentLine ? currentLine + " " + part : part;
//               testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * spacing;
//               if (testWidth > maxWidth) {
//                 break;
//               }
//               subWord = part;
//             }

//             if (!subWord) {
//               if (currentLine) {
//                 lines.push(currentLine);
//               }
//               currentLine = "";
//               subWord = word[0];
//               word = word.slice(1);
//               continue;
//             }

//             if (subWord.length === word.length) {
//               currentLine = currentLine ? currentLine + " " + subWord : subWord;
//               word = "";
//             } else {
//               if (currentLine) {
//                 lines.push(currentLine);
//               }
//               currentLine = subWord;
//               word = word.slice(subWord.length);
//             }
//           }
//         }
//       }
//       if (currentLine) {
//         lines.push(currentLine);
//       }
//     }

//     return lines;
//   },

//   _render: function(ctx) {
//     const spacing = typeof this.spacing === "number" && this.spacing >= 0 ? this.spacing : 1;
//     ctx.save();
//     ctx.font = `${this.fontSize}px ${this.fontFamily}`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     // Wrap the text based on maxWidth if maxWidth is set and warp == 0 (straight text)
//     let  lines = this._wrapTextToLines(ctx, this.text, this.maxWidth, spacing);


//     const direction = this.warp >= 0 ? 1 : -1;
//     const warpAbs = Math.abs(this.warp);
//     const lineHeight = this.fontSize * this.lineHeight;
//     const padding = 0;

//     // Calculate bounding box min/max values
//     let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
//     const drawOps = [];

//     if (this.warp === 0) {
//       // Straight text rendering (with wrapping lines)
//       for (let j = 0; j < lines.length; j++) {
//         const line = lines[j];
//         const y = j * lineHeight + lineHeight / 2;

//         let lineWidth = 0;
//         const charWidths = line.split("").map(char => {
//           const w = ctx.measureText(char).width;
//           lineWidth += w;
//           return w;
//         });
//         lineWidth += (line.length - 1) * spacing;

//         let xCursor = -lineWidth / 2;

//         for (let i = 0; i < line.length; i++) {
//           const char = line[i];
//           const charWidth = charWidths[i];
//           const x = xCursor + charWidth / 2;

//           drawOps.push({ char, x, y });

//           minX = Math.min(minX, x - charWidth / 2);
//           maxX = Math.max(maxX, x + charWidth / 2);
//           minY = Math.min(minY, y - this.fontSize / 2);
//           maxY = Math.max(maxY, y + this.fontSize / 2);

//           xCursor += charWidth + spacing;
//         }
//       }
//     } else {
//       // Curved/warped text rendering (no wrapping)
//       for (let j = 0; j < lines.length; j++) {
//         const line = lines[j];
//         const yOffset = j * lineHeight;

//         const charWidths = line.split("").map(char => ctx.measureText(char).width);
//         let arcLength = charWidths.reduce((a, b) => a + b, 0) + (line.length - 1) * spacing;
//         const radius = arcLength / (8 * Math.sin((warpAbs * Math.PI) / 360));
//         let angle = -(arcLength / radius) / 2;

//         for (let i = 0; i < line.length; i++) {
//           const char = line[i];
//           const charWidth = charWidths[i];
//           const theta = angle + (charWidth / 2) / radius;

//           const x = radius * Math.sin(theta);
//           const y = direction * radius * (1 - Math.cos(theta)) + yOffset;

//           drawOps.push({ char, x, y, angle: theta * direction });

//           minX = Math.min(minX, x - charWidth / 2);
//           maxX = Math.max(maxX, x + charWidth / 2);
//           minY = Math.min(minY, y - this.fontSize / 2);
//           maxY = Math.max(maxY, y + this.fontSize / 2);

//           angle += (charWidth + spacing) / radius;
//         }
//       }
//     }

//     // Set bounding box width and height
//     const calculatedWidth = (maxX - minX) + padding * 2;
//     const calculatedHeight = (maxY - minY) + padding * 2;

//     if (this.maxWidth && calculatedWidth > this.maxWidth) {
//       this.width = this.maxWidth;
//     } else {
//       this.width = calculatedWidth;
//     }
//     this.height = calculatedHeight;

//     // Center offset
//     const offsetX = (minX + maxX) / 2;
//     const offsetY = (minY + maxY) / 2;

//     ctx.translate(-offsetX, -offsetY);

//     // Draw each character
//     for (const op of drawOps) {
//       ctx.save();
//       if (op.angle !== undefined) {
//         ctx.translate(op.x, op.y);
//         ctx.rotate(op.angle);
//         if (this.stroke && this.strokeWidth > 0) {
//           ctx.lineWidth = this.strokeWidth;
//           ctx.strokeStyle = this.stroke;
//           ctx.strokeText(op.char, 0, 0);
//         }
//         ctx.fillStyle = this.fill;
//         ctx.fillText(op.char, 0, 0);
//       } else {
//         if (this.stroke && this.strokeWidth > 0) {
//           ctx.lineWidth = this.strokeWidth;
//           ctx.strokeStyle = this.stroke;
//           ctx.strokeText(op.char, op.x, op.y);
//         }
//         ctx.fillStyle = this.fill;
//         ctx.fillText(op.char, op.x, op.y);
//       }
//       ctx.restore();
//     }

//     ctx.restore();
//   },

//   toObject: function(propertiesToInclude) {
//     return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
//       text: this.text,
//       fontSize: this.fontSize,
//       warp: this.warp,
//       width :this.width,
//       spacing: this.spacing,
//       fill: this.fill,
//       stroke: this.stroke,
//       originX: this.originX,
//       originY: this.originY,
//       strokeWidth: this.strokeWidth,
//       fontFamily: this.fontFamily,
//       lineHeight: this.lineHeight,
//       flipX: this.flipX,
//       flipY: this.flipY,
//       angle: this.angle,
//       scaleX: this.scaleX,
//       scaleY: this.scaleY,
//       layerIndex: this.layerIndex,
//       maxWidth: this.maxWidth,
//     });
//   },
// });

// // fromObject for JSON deserialization
// CurvedText.fromObject = function(object, callback) {
//   return callback(new CurvedText(object.text, object));
// };

// // attach to fabric namespace
// fabric.CurvedText = CurvedText;

// export default CurvedText;
import { fabric } from "fabric";

const CurvedText = fabric.util.createClass(fabric.Object, {
  type: "curved-text",

  initialize: function (text, options) {
    options = options || {};
    this.callSuper("initialize", options);

    this.text = text || "";

    this.id = options.id || "";
    this.left = options.left || 300;
    this.top = options.top || 300;
    this.spacing = options.spacing || 0;

    this.stroke = options.stroke || "";
    this.strokeWidth = options.strokeWidth || 0;
    this.fill = options.fill || "white";

    this.warp = Number(options.warp) || 0;

    this.fontSize = options.fontSize || 16;
    this.fontFamily = options.fontFamily || "Impact";
    this.originX = "center";
    this.originY = "center";
    this.fontWeight = options.fontWeight || "normal";
    this.fontStyle = options.fontStyle || "normal";

    this.flipX = options.flipX || false;
    this.flipY = options.flipY || false;

    this.angle = options.angle || 0;
    this.scaleX = options.scaleX || 1;
    this.scaleY = options.scaleY || 1;
    this.layerIndex = options.layerIndex || 0;

    this.lineHeight = options.lineHeight || 1.2;
    this.objectCaching = false;
    this.lockMovementX = options.lockMovementX || false;
    this.lockMovementY = options.lockMovementY || false;
    this.maxWidth = options.maxWidth || null;

    // Do NOT preset width/height here; let _render handle it
  },

  _wrapTextToLines: function (ctx, text, maxWidth, spacing) {
    if (!maxWidth) {
      return text.split("\n");
    }

    const lines = [];
    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {
      const words = paragraph.split(" ");
      let currentLine = "";

      for (let n = 0; n < words.length; n++) {
        let word = words[n];

        while (word.length > 0) {
          let testLine = currentLine ? currentLine + " " + word : word;
          let testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * spacing;

          if (testWidth <= maxWidth) {
            currentLine = testLine;
            word = "";
          } else if (word.length === 1) {
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = word;
            }
            word = "";
          } else {
            let subWord = "";
            for (let i = 1; i <= word.length; i++) {
              let part = word.slice(0, i);
              testLine = currentLine ? currentLine + " " + part : part;
              testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * spacing;
              if (testWidth > maxWidth) {
                break;
              }
              subWord = part;
            }

            if (!subWord) {
              if (currentLine) {
                lines.push(currentLine);
              }
              currentLine = "";
              subWord = word[0];
              word = word.slice(1);
              continue;
            }

            if (subWord.length === word.length) {
              currentLine = currentLine ? currentLine + " " + subWord : subWord;
              word = "";
            } else {
              if (currentLine) {
                lines.push(currentLine);
              }
              currentLine = subWord;
              word = word.slice(subWord.length);
            }
          }
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  },

  _render: function (ctx) {
    const spacing = typeof this.spacing === "number" && this.spacing >= 0 ? this.spacing : 1;
    ctx.save();
    ctx.font = `${this.fontStyle || "normal"} ${this.fontWeight || "normal"} ${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = this._wrapTextToLines(ctx, this.text, this.maxWidth, spacing);

    const direction = this.warp >= 0 ? 1 : -1;
    const warpAbs = Math.abs(this.warp);
    const lineHeight = this.fontSize * this.lineHeight;
    const padding = 0;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const drawOps = [];

    if (this.warp === 0) {
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        const y = j * lineHeight + lineHeight / 2;

        let lineWidth = 0;
        const charWidths = line.split("").map(char => {
          const w = ctx.measureText(char).width;
          lineWidth += w;
          return w;
        });
        lineWidth += (line.length - 1) * spacing;

        let xCursor = -lineWidth / 2;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const charWidth = charWidths[i];
          const x = xCursor + charWidth / 2;

          drawOps.push({ char, x, y });

          minX = Math.min(minX, x - charWidth / 2);
          maxX = Math.max(maxX, x + charWidth / 2);
          minY = Math.min(minY, y - this.fontSize / 2);
          maxY = Math.max(maxY, y + this.fontSize / 2);

          xCursor += charWidth + spacing;
        }
      }
    } else {
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        const yOffset = j * lineHeight;

        const charWidths = line.split("").map(char => ctx.measureText(char).width);
        let arcLength = charWidths.reduce((a, b) => a + b, 0) + (line.length - 1) * spacing;
        const radius = arcLength / (8 * Math.sin((warpAbs * Math.PI) / 360));
        let angle = -(arcLength / radius) / 2;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const charWidth = charWidths[i];
          const theta = angle + (charWidth / 2) / radius;

          const x = radius * Math.sin(theta);
          const y = direction * radius * (1 - Math.cos(theta)) + yOffset;

          drawOps.push({ char, x, y, angle: theta * direction });

          minX = Math.min(minX, x - charWidth / 2);
          maxX = Math.max(maxX, x + charWidth / 2);
          minY = Math.min(minY, y - this.fontSize / 2);
          maxY = Math.max(maxY, y + this.fontSize / 2);

          angle += (charWidth + spacing) / radius;
        }
      }
    }

    const calculatedWidth = (maxX - minX) + padding * 2;
    const calculatedHeight = (maxY - minY) + padding * 2;

    this.width = this.maxWidth && calculatedWidth > this.maxWidth ? this.maxWidth : calculatedWidth;
    this.height = calculatedHeight;

    const offsetX = (minX + maxX) / 2;
    const offsetY = (minY + maxY) / 2;

    ctx.translate(-offsetX, -offsetY);

    for (const op of drawOps) {
      ctx.save();
      if (op.angle !== undefined) {
        ctx.translate(op.x, op.y);
        ctx.rotate(op.angle);
        if (this.stroke && this.strokeWidth > 0) {
          ctx.lineWidth = this.strokeWidth;
          ctx.strokeStyle = this.stroke;
          ctx.strokeText(op.char, 0, 0);
        }
        ctx.fillStyle = this.fill;
        ctx.fillText(op.char, 0, 0);
      } else {
        if (this.stroke && this.strokeWidth > 0) {
          ctx.lineWidth = this.strokeWidth;
          ctx.strokeStyle = this.stroke;
          ctx.strokeText(op.char, op.x, op.y);
        }
        ctx.fillStyle = this.fill;
        ctx.fillText(op.char, op.x, op.y);
      }
      ctx.restore();
    }

    ctx.restore();

    // Important: Update bounding box for selection
    this.setCoords();
  },

  toObject: function (propertiesToInclude) {
    return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
      text: this.text,
      fontSize: this.fontSize,
      warp: this.warp,
      spacing: this.spacing,
      fill: this.fill,
      stroke: this.stroke,
      originX: this.originX,
      originY: this.originY,
      strokeWidth: this.strokeWidth,
      fontFamily: this.fontFamily,
      lineHeight: this.lineHeight,
      flipX: this.flipX,
      flipY: this.flipY,
      angle: this.angle,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      layerIndex: this.layerIndex,
      maxWidth: this.maxWidth,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      lockMovementX: this.lockMovementX,
      lockMovementY: this.lockMovementY,

    });
  },
});

// Deserialize support
CurvedText.fromObject = function (object, callback) {
  return callback(new CurvedText(object.text, object));
};

fabric.CurvedText = CurvedText;

export default CurvedText;
