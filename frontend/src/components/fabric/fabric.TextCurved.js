import { fabric } from "fabric";

const CurvedText = fabric.util.createClass(fabric.Object, {
  type: "curved-text",

  initialize: function (text, options = {}) {
    this.callSuper("initialize", options);

    this.text = text || "";

    // Positioning
    this.left = options.left || 300;
    this.top = options.top || 300;
    this.originX = options.originX || "center";
    this.originY = options.originY || "center";

    // Style
    this.spacing = options.spacing || 0;
    this.fontSize = options.fontSize || 16;
    this.fontFamily = options.fontFamily || "Impact";
    this.fill = options.fill || "white";
    this.stroke = options.stroke || "";
    this.strokeWidth = options.strokeWidth || 0;
    this.lineHeight = options.lineHeight || 1.2;
    this.maxWidth = options.maxWidth || null;
    // this.lockMovementY = options.lockMovementY || false;
    // this.lockMovementX = options.lockMovementX || false;
    // Warp amount
    this.warp = Number(options.warp) || 0;

    // Transform
    this.angle = options.angle || 0;
    this.scaleX = options.scaleX || 1;
    this.scaleY = options.scaleY || 1;
    this.flipX = options.flipX || false;
    this.flipY = options.flipY || false;

    // Fabric properties
    // this.selectable = options.selectable;
    // this.evented = options.evented ;
    // this.hasControls = options.hasControls;
    // this.hasBorders = options.hasBorders;
    // this.objectCaching =  options.objectCaching;
    // this.hoverCursor =  'move';
    // this.moveCursor = 'move';

  },

  _wrapTextToLines: function (ctx, text, maxWidth, spacing) {
    if (!maxWidth) return text.split("\n");

    const lines = [];
    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {
      const words = paragraph.split(" ");
      let currentLine = "";

      for (let word of words) {
        let testLine = currentLine ? currentLine + " " + word : word;
        const testWidth = ctx.measureText(testLine).width + (testLine.length - 1) * spacing;

        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) lines.push(currentLine);
    }

    return lines;
  },

  _render: function (ctx) {
    ctx.save();
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const spacing = this.spacing >= 0 ? this.spacing : 1;
    const lines = (this.warp === 0 && this.maxWidth)
      ? this._wrapTextToLines(ctx, this.text, this.maxWidth, spacing)
      : this.text.split("\n");

    const direction = this.warp >= 0 ? 1 : -1;
    const warpAbs = Math.abs(this.warp);
    const lineHeight = this.fontSize * this.lineHeight;

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

    // Bounding box
    const width = maxX - minX;
    const height = maxY - minY;
    this.width = this.maxWidth && width > this.maxWidth ? this.maxWidth : width;
    this.height = height;

    const offsetX = (minX + maxX) / 2;
    const offsetY = (minY + maxY) / 2;
    ctx.translate(-offsetX, -offsetY);

    for (const op of drawOps) {
      ctx.save();
      if (op.angle !== undefined) {
        ctx.translate(op.x, op.y);
        ctx.rotate(op.angle);
        if (this.stroke && this.strokeWidth) {
          ctx.lineWidth = this.strokeWidth;
          ctx.strokeStyle = this.stroke;
          ctx.strokeText(op.char, 0, 0);
        }
        ctx.fillStyle = this.fill;
        ctx.fillText(op.char, 0, 0);
      } else {
        if (this.stroke && this.strokeWidth) {
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
  },

  toObject: function (propertiesToInclude) {
    return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
      text: this.text,
      spacing: this.spacing,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      warp: this.warp,
      maxWidth: this.maxWidth,
      lineHeight: this.lineHeight,
      flipX: this.flipX,
      flipY: this.flipY,
      angle: this.angle,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      selectable: this.selectable,
      evented: this.evented,
      hoverCursor: this.hoverCursor,
      moveCursor: this.moveCursor,
      lockMovementY:this.lockMovementY,
      lockMovementX:this.lockMovementX

    });
  },

  containsPoint: function (point) {
    const rect = this.getBoundingRect();
    return (
      point.x >= rect.left &&
      point.x <= rect.left + rect.width &&
      point.y >= rect.top &&
      point.y <= rect.top + rect.height
    );
  }
});

// Fabric requires fromObject to deserialize
CurvedText.fromObject = function (object, callback) {
  return callback(new CurvedText(object.text, object));
};

// Attach to fabric
fabric.CurvedText = CurvedText;

export default CurvedText;
