import { fabric } from "fabric";
import icons from "../data/icons";

// Helper to load images asynchronously
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Preload icons once and export a Promise that resolves when ready
let iconImages = {};
let iconsLoaded = false;

const loadIconsAsync = async () => {
  if (iconsLoaded) return; // prevent double loading
  const entries = await Promise.all(
    Object.entries(icons).map(async ([key, src]) => [key, await loadImage(src)])
  );
  iconImages = Object.fromEntries(entries);
  iconsLoaded = true;
};

// Safe render method using loaded icons
const renderIcon = (key) => {
  return function (ctx, left, top, _styleOverride, fabricObject) {
    const size = this.cornerSize;
    const icon = iconImages[key];
    if (!icon) return; // not loaded yet

    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
};

// Main control creator
export const createControls = async (
  deleteObject,
  scaleFromCenter,
  rotateWithCenter,
  bringForward,
  scaleYFromCenter,
  scaleXFromCenter
) => {
  await loadIconsAsync(); // ensure icons are loaded before controls use them

  return {
    deleteControl: new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 15,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon("delete"),
      cornerSize: 20,
    }),
    resizeControl: new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetX: 16,
      offsetY: 16,
      cursorStyle: "nwse-resize",
      actionHandler: scaleFromCenter,
      actionName: "scale",
      render: renderIcon("resize"),
      cornerSize: 20,
    }),
    rotateControl: new fabric.Control({
      x: -0.5,
      y: -0.5,
      offsetX: -16,
      offsetY: -16,
      cursorStyle: "crosshair",
      actionHandler: rotateWithCenter,
      actionName: "rotate",
      render: renderIcon("rotate"),
      cornerSize: 20,
    }),
    layerControl: new fabric.Control({
      x: -0.5,
      y: 0.5,
      offsetX: -16,
      offsetY: 16,
      cursorStyle: "pointer",
      mouseUpHandler: bringForward,
      render: renderIcon("layer"),
      cornerSize: 20,
    }),
    increaseHeight: new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -16,
      cursorStyle: "n-resize",
      actionHandler: scaleYFromCenter,
      actionName: "scaleY",
      render: renderIcon("height"),
      cornerSize: 20,
    }),
    increaseWidth: new fabric.Control({
      x: 0.5,
      y: 0,
      offsetX: 16,
      cursorStyle: "e-resize",
      actionHandler: scaleXFromCenter,
      actionName: "scaleX",
      render: renderIcon("width"),
      cornerSize: 20,
    }),
  };
};
