const express = require("express");
const router = express.Router();

const {createUser,getUser,updateUser,deleteUser} = require("../Controller/UserController.js")
const {createTask,getTask,updateTask,deleteTask} = require("../Controller/todoTaskController.js")
const {createMessage,getMsg,updateMsg,deleteMsg, getUnreadCounts,markAsRead} = require("../Controller/MsgContrller.js")
const {SignUp , Login} = require("../Controller/authController.js")

router.post("/users",createUser)
router.get("/users",getUser)
router.put("/users/:id",updateUser)
router.delete("/users/:id",deleteUser)

router.post("/tasks",createTask)
router.get("/tasks",getTask)
router.put("/tasks/:id",updateTask)
router.delete("/tasks/:id",deleteTask)

//message Routes
router.post("/messages", createMessage);
router.get("/unread/:userId", getUnreadCounts);
router.get("/messages/:taskId", getMsg);
router.put("/messages/:id", updateMsg);
router.delete("/messages/:id", deleteMsg);
router.put("/messages/read", markAsRead);

router.post("/signup",SignUp)
router.post("/login",Login)

console.log("SITE ROUTER WORKING");

module.exports = router;