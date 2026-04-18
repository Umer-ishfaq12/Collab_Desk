const Todo = require("../Model/TodoLIst.js");
//create Task
const createTask = async (req, res) => {
  try {
    const Task = await Todo.create(req.body);
    res.status(201).json(Task);
  } catch (error) {
    res.status(500).json({
      message: "Task not created ",
    });
  }
};

//get
const getTask = async (req, res) => {
  try {
    const gTask = await Todo.find();
    res.status(200).json(gTask);
  } catch (error) {
    res.status(500).json({
      msessage: "invalid Task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const updateTask = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after"
    });
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(500).json({
      msessage: "Task not updated user",
    });
  }
};


// delete Task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Todo.findByIdAndDelete(req.params.id)
    
    res.status(201).json(deletedTask);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Deleting task",
      error: error.message,
    });
  }
};

module.exports = {createTask,getTask,updateTask,deleteTask}