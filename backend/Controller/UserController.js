const express = require("express")
const User = require("../Model/User")
const { get } = require("mongoose")
//create user
const createUser = async (req,res) => {
    try {
    const newUser = await User.create(req.body)
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({
            msessage : "invalid user"
        })
    }
}

//get user

const getUser = async (req,res) => {
    try {
    const user = await User.find();
    res.status(201).json(user)        
    } catch (error) {
     res.status(500).json({
     msessage : "invalid user"

     })   
    }
}

// update user

const updateUser = async (req,res) => {
    try {
    const user = await User.findByIdAndUpdate(
    req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json(user)        
    } catch (error) {
     res.status(500).json({
     msessage : "invalid user"

     })   
    }
}

// delete user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

module.exports = {createUser,getUser,updateUser,deleteUser}