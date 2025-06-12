// models/ActiveUser.js
const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema({
  anonId: { type: String, required: true, unique: true },
  lastActive: { type: Date, required: true },
  userAgent: String,
  language: String,
  timezone: String,
  screen: String,
  platform: String,
  ip: String
});

module.exports = mongoose.models.ActiveUser || mongoose.model('ActiveUser', ActiveUserSchema);
