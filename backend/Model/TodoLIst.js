const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodoSchema = new Schema({
  
  taskName: {
    type: String,
    required: true,
    trim: true
  },

  taskMsg: {
    type: String,
    required: true,
    trim: true
  },

  taskType: {
    type: String,
    required: true,
    enum: ["personal", "team", "urgent"], // optional control
  },

  taskStart: {
    type: Date,
    required: true
  },

  taskEnd: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "submitted", "approved"],
    default: "pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },

  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],

  // optional priority
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  completedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

completedAt: {
  type: Date,
}

}, { timestamps: true });

module.exports = mongoose.model("Todo", TodoSchema);