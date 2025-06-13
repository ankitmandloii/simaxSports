const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema({
  anonId: { type: String, required: true, unique: true },
  lastActive: { type: Date, required: true },
  location: {
    city: String,
    country: String,
    region: String,
    lat: Number,
    lon: Number,
    ip: String,
    timestamp: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.models.ActiveUser || mongoose.model('ActiveUser', ActiveUserSchema);
