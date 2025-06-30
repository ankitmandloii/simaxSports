import { fabric } from 'fabric';

// This will be injected from the outside
let iconImages = {};
let textContaintObject = [];
let imageContaintObject = [];
let navigate;
let dispatch;

export const initControlContext = (ctx) => {
  iconImages = ctx.iconImages;
  textContaintObject = ctx.textContaintObject;
  imageContaintObject = ctx.imageContaintObject;
  navigate = ctx.navigate;
  dispatch = ctx.dispatch;
};

// 🔒 Lock checker
const isLocked = (_eventData, transform) => {
  const id = transform.target.id;
  const foundObject =
    textContaintObject?.find((obj) => obj.id === id) ||
    imageContaintObject?.find((obj) => obj.id === id);
  return foundObject?.locked ?? false;
};

// 🎨 Icon renderer
const renderIcon = (key) => {
  return function (ctx, left, top, _styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(iconImages[key], -size / 2, -size / 2, size, size);
    ctx.restore();
  };
};

// ❌ Delete object
const deleteObject = (_eventData, transform) => {
  if (!isLocked(_eventData, transform)) {
    navigate("/design/product");
    const canvas = transform.target.canvas;
    dispatch({ type: 'DELETE_TEXT', id: transform.target.id });
    dispatch({ type: 'DELETE_IMAGE', id: transform.target.id });
    canvas.remove(transform.target);
    canvas.requestRenderAll();
  }
};

// ↔️ Resize handlers
const scaleFromCenter = (eventData, transform, x, y) => {
  if (!isLocked(eventData, transform)) {
    transform.target.set({ centeredScaling: true });
    return fabric.controlsUtils.scalingEqually(eventData, transform, x, y);
  }
};

const scaleXFromCenter = (eventData, transform, x, y) => {
  if (!isLocked(eventData, transform)) {
    transform.target.set({ centeredScaling: true });
    return fabric.controlsUtils.scalingX(eventData, transform, x, y);
  }
};

const scaleYFromCenter = (eventData, transform, x, y) => {
  if (!isLocked(eventData, transform)) {
    transform.target.set({ centeredScaling: true });
    return fabric.controlsUtils.scalingY(eventData, transform, x, y);
  }
};

// 🔄 Rotate handler
const rotateWithCenter = (eventData, transform, x, y) => {
  if (!isLocked(eventData, transform)) {
    transform.target.set({ centeredRotation: true });
    return fabric.controlsUtils.rotationWithSnapping(eventData, transform, x, y);
  }
};

// 🛠️ Control generator
export const createControls = (bringPopup) => ({
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
  bringToFrontControl: new fabric.Control({
    x: -0.5,
    y: 0.5,
    offsetX: -16,
    offsetY: 16,
    actionName: "layer",
    cursorStyle: "pointer",
    mouseUpHandler: bringPopup,
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
});
