// models/Image.js
const mongoose = require('mongoose');

const saveImageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true},
  urls: { type: [String], default: [] }
}, { timestamps: true });


const SaveImageSchema =  mongoose.model('saveImageSchema', saveImageSchema);
module.exports = SaveImageSchema;