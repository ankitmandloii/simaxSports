const mongoose = require('mongoose');
const { Schema } = mongoose;
const { TextSchema } = require('../designSchemas/TextSchema');
const { ImageSchema } = require('../designSchemas/ImageSchema');

const PresentSideSchema = new Schema(
  {
    texts:  { type: [TextSchema], default: [] },
    images: { type: [ImageSchema], default: [] },
  },
  { _id: false }
);

module.exports = { PresentSideSchema };
