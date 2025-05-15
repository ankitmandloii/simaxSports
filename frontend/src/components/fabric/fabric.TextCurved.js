import { fabric } from "fabric";

class CurvedText extends fabric.Object {
  constructor(text, options = {}) {
    super(options);

    this.type = "curved-text";
    this.text = text || "";

    this.id = options.id || "";
    this.left = options.left || 300;
    this.top = options.top || 300;
    this.spacing = options.spacing;

    this.stroke = options.stroke || "";
    this.strokeWidth = options.strokeWidth || 0;
    this.fill = options.fill || "white";

    this.spacing = options.spacing || 0;
    this.warp = Number(options.warp) || 0;

    this.fontSize = options.fontSize || 16;
    this.fontFamily = options.fontFamily || "Impact";
    this.originX = options.originX || "center";
    this.originY = options.originY || "center";

    this.flipX = options.flipX || false;
    this.flipY = options.flipY || false;

    this.angle = options.angle || 0;
    this.scaleX = options.scaleX || 1;
    this.scaleY = options.scaleY || 1;
    this.layerIndex = options.layerIndex || 0;

    this.lineHeight = options.lineHeight || 1.2;

    this.originX = "center";
    this.originY = "center";
    this.objectCaching = false;
  }

  getTextWidth() {
    const spacing = this.fontSize * 0.8;
    return this.text.length * spacing;
  }

  getTextHeight() {
    const lines = this.text.split("\n");
    return this.fontSize * this.lineHeight * lines.length;
  }

_render(ctx) {
  const lines = this.text.split("\n");
  const spacing = typeof this.spacing === "number" && this.spacing >= 0 ? this.spacing : 1;
  const direction = this.warp >= 0 ? 1 : -1;
  const warpAbs = Math.abs(this.warp);
  const lineHeight = this.fontSize * this.lineHeight;
  const padding = 0;

  ctx.save();
  ctx.font = `${this.fontSize}px ${this.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Measure total bounding box first
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const drawOps = [];

  if (this.warp === 0) {
    // Straight text rendering
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
    // Curved/warped text rendering
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

  // Set correct bounding box with padding
  this.width = (maxX - minX) + padding * 2;
  this.height = (maxY - minY) + padding * 2;

  // Shift everything to center of bounding box
  const offsetX = (minX + maxX) / 2;
  const offsetY = (minY + maxY) / 2;

  ctx.translate(-offsetX, -offsetY);

  // Draw characters
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
}



  toObject(propertiesToInclude = []) {
    return {
      ...super.toObject(propertiesToInclude),
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
      id: this.id,
      width: this.width,
      height: this.height,
    };
  }

  static fromObject(object, callback) {
    return callback(new CurvedText(object.text, object));
  }
}

export default fabric.CurvedText = CurvedText;
