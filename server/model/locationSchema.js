const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: String,
  country: String,
  region: String,
  lat: Number,
  lon: Number,
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);
