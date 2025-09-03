const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PresentSideSchema } = require('../designSchemas/PresentSideSchema');
const { nameAndNumberPrintAreaSchma } = require('../designSchemas/nameAndNumberPrintAreaSchma');

const DesignSchema = new Schema(
  {
    DesignName: { type: String, default: 'Untitled Design', trim: true },
    present: {
      front: { type: PresentSideSchema, required: true, default: () => ({}) },
      back: { type: PresentSideSchema, required: true, default: () => ({}) },
      leftSleeve: { type: PresentSideSchema, required: true, default: () => ({}) },
      rightSleeve: { type: PresentSideSchema, required: true, default: () => ({}) },
    },
    FinalImages: [{ type: String }],
    DesignNotes: {
      FrontDesignNotes: { type: String },
      BackDesignNotes: { type: String },
      ExtraInfo: { type: String }
    },
    NamesAndNumberPrintAreas: { type: [nameAndNumberPrintAreaSchma] },
    status: { type: String, enum: ['draft', 'ordered', 'archived'], default: 'draft', index: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = { DesignSchema };
