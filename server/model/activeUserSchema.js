// models/ActiveUser.js
const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema({
  anonId: { type: String, required: true, unique: true },
  lastActive: { type: Date, required: true }
});

module.exports = mongoose.models.ActiveUser || mongoose.model('ActiveUser', ActiveUserSchema);
