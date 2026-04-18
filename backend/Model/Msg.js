const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  
  message: {
    type: String,
    required: true,
  },

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",   // link with task
    required: true,
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   //  who sent message
    required: true,
  },

  senderName: {
    type: String,  // optional (for easy UI display)
  },
  readBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);