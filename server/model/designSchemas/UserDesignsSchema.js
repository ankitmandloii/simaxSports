const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DesignSchema } = require('../designSchemas/DesignSchema');

const UserDesignsSchema = new Schema(
  {
    ownerEmail: { type: String, required: true, index: true },
    designs: { type: [DesignSchema], default: [] },
  },
  { timestamps: true }
);

// This is the actual collection model
const UserDesigns = mongoose.model('UserDesigns', UserDesignsSchema);

module.exports = { UserDesigns };
