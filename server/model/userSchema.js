// const { number, required } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], required: true },
  tokenVersion: { type: Number, default: 0 }
}, { timestamps: true });




const User = mongoose.model('User', userSchema);


module.exports = User;
