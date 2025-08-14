const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PositionSchema } = require('../designSchemas/PositionSchema');

const ImageSchema = new Schema(
  {
    id: { type: String, required: true },
    layerIndex: { type: Number, required: true, min: 0 },
    position: { type: PositionSchema, required: true },

    src: { type: String, required: true },

    width: { type: Number, default: 150 },
    height: { type: Number, default: 150 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    angle:  { type: Number, default: 0 },
    flipX:  { type: Boolean, default: false },
    flipY:  { type: Boolean, default: false },

    thresholdValue: { type: Number, default: 144 },
    replaceBackgroundColor: { type: String, default: '#000000' },
    replaceBgParamValue: { type: String, default: 'bg-remove=true&bg=AABB22' },
    cropAndTrim: { type: Boolean, default: false },
    superResolution: { type: Boolean, default: false },
    invertColor: { type: Boolean, default: false },
    solidColor: { type: Boolean, default: false },
    removeBg: { type: Boolean, default: false },
    singleColor: { type: String, default: '#ffffff' },
    selectedFilter: { type: String, default: 'Normal' },
    editColor: { type: Boolean, default: false },
  },
  { _id: false }
);

module.exports = { ImageSchema };
