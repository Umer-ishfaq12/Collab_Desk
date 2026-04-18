// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, 'Please enter a valid email address'] // basic validation
  },
  password : {
    type: String,
    required: true,
  },
  role :{
    type : String,
    enum : ["user", "manager", "admin"],
    default : "user"
  }

}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema); // Export the schema
