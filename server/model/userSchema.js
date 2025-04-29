// const { number, required } = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const { required, array, ref } = require('joi');


const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: {type: String, required: true},
  password: { type: String, required: true },
  role: { type: String, required: true},
  myPatient: [ {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  myDoctor: [ {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  
}, { timestamps: true });




const User = mongoose.model('User', userSchema);


module.exports = User;
