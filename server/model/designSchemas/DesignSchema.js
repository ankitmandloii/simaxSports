const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PresentSideSchema } = require('../designSchemas/PresentSideSchema');

const DesignSchema = new Schema(
  {
    DesignName: { type: String, default: 'Untitled Design', trim: true },
    present: {
      front:       { type: PresentSideSchema, required: true, default: () => ({}) },
      back:        { type: PresentSideSchema, required: true, default: () => ({}) },
      leftSleeve:  { type: PresentSideSchema, required: true, default: () => ({}) },
      rightSleeve: { type: PresentSideSchema, required: true, default: () => ({}) },
    },
    FinalImages: [{ type: String }],
    status:  { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = { DesignSchema };
