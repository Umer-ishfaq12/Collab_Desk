// const Todo = require("../Model/TodoLIst.js");
// //create Task
// const createTask = async (req, res) => {
//   try {
//     const Task = await Todo.create(req.body);
//     res.status(201).json(Task);
//   } catch (error) {
//     res.status(500).json({
//       message: "Task not created ",
//     });
//   }
// };

// //get
// const getTask = async (req, res) => {
//   try {
//     const gTask = await Todo.find();
//     res.status(200).json(gTask);
//   } catch (error) {
//     res.status(500).json({
//       msessage: "invalid Task",
//     });
//   }
// };

// const updateTask = async (req, res) => {
//   try {
//     const updateTask = await Todo.findByIdAndUpdate(req.params.id, req.body, {
//       returnDocument: "after"
//     });
//     res.status(200).json(updateTask);
//   } catch (error) {
//     res.status(500).json({
//       msessage: "Task not updated user",
//     });
//   }
// };


// // delete Task
// const deleteTask = async (req, res) => {
//   try {
//     const deletedTask = await Todo.findByIdAndDelete(req.params.id)
    
//     res.status(201).json(deletedTask);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error Deleting task",
//       error: error.message,
//     });
//   }
// };

// module.exports = {createTask,getTask,updateTask,deleteTask}
const Todo = require("../Model/TodoLIst.js");

// Admin only
const createTask = async (req, res) => {
  try {
    const task = await Todo.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Task not created", error: error.message });
  }
};

// Admin sees all, user sees only their assigned tasks
const getTask = async (req, res) => {
  try {
    const filter = req.user.role === "admin" 
      ? {} 
      : { assignedTo: req.user._id };
    
    const tasks = await Todo.find(filter)
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch tasks", error: error.message });
  }
};

// Admin only
const updateTask = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Task not updated", error: error.message });
  }
};

// Admin only
const deleteTask = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted", task: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// User only — submit their assigned task
const completeTask = async (req, res) => {
  try {
    const task = await Todo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check user is actually assigned
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned) return res.status(403).json({ message: "Not your task" });

    task.status = "submitted";
    task.completedBy = req.user._id;
    task.completedAt = new Date();
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not complete task", error: error.message });
  }
};

// Admin only — approve a submitted task
const approveTask = async (req, res) => {
  try {
    const task = await Todo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.status !== "submitted") 
      return res.status(400).json({ message: "Task not submitted yet" });

    task.status = "approved";
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not approve task", error: error.message });
  }
};

module.exports = { createTask, getTask, updateTask, deleteTask, completeTask, approveTask };