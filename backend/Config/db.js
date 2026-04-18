// const express = require("express");
// const { default: mongoose } = require("mongoose");


// const connectDB = async (req,res) => {

// const uri = process.env.MONGO_URI;

// try {
//     await mongoose.connect(uri,{})
// } catch (error) {
//  console.error(" Error connecting to MongoDB with Mongoose:", error);   
// }

// }
// module.exports = connectDB;

const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri, {});
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;