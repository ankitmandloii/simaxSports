const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PositionSchema } = require('../designSchemas/PositionSchema');

const TextSchema = new Schema(
  {
    id: { type: String, required: true },
    layerIndex: { type: Number, required: true, min: 0 },
    position: { type: PositionSchema, required: true },

    content: { type: String, default: 'New Text' },
    fontWeight: { type: String, enum: ['normal', 'bold'], default: 'normal' },
    fontStyle:  { type: String, enum: ['normal', 'italic'], default: 'normal' },
    fontFamily: { type: String, default: 'Montserrat' },
    textColor:  { type: String, default: '#000000' },

    outline: { type: String, enum: ['none', 'solid'], default: 'none' },
    outLineColor: { type: String, default: '' },
    outLineSize:  { type: Number, default: 0.5 },

    size:   { type: Number, default: 1 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    angle:  { type: Number, default: 0 },
    spacing:{ type: Number, default: 1 },
    arc:    { type: Number, default: 0 },

    center: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
    flipX:  { type: Boolean, default: false },
    flipY:  { type: Boolean, default: false },

    width:   { type: Number, default: 150 },
    height:  { type: Number, default: 50 },
    fontSize:{ type: Number, default: 20 },
  },
  { _id: false }
);

module.exports = { TextSchema };
