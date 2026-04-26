const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../Middleware/authMiddleware.js")
const {createUser,getUser,updateUser,deleteUser} = require("../Controller/UserController.js")
const {createTask,getTask,updateTask,deleteTask, completeTask,approveTask} = require("../Controller/todoTaskController.js")
const {createMessage,getMsg,updateMsg,deleteMsg, getUnreadCounts,markAsRead} = require("../Controller/MsgContrller.js")
const {SignUp , Login} = require("../Controller/authController.js")

router.post("/users",protect, adminOnly,createUser)
router.get("/users",protect, adminOnly, getUser)
router.put("/users/:id", protect, adminOnly, updateUser)
router.delete("/users/:id",protect, adminOnly, deleteUser)

//tasks routes
router.post("/tasks",protect, adminOnly, createTask)
router.get("/tasks",protect, getTask)
router.put("/tasks/:id",  protect, adminOnly,updateTask)
router.delete("/tasks/:id", protect, adminOnly,deleteTask)
router.patch("/tasks/:id/complete",protect, completeTask);  // assigned user only
router.patch("/tasks/:id/approve",  protect, adminOnly, approveTask);    // admin only

//message Routes
router.post("/messages",protect, createMessage);
router.get("/unread/:userId",protect, getUnreadCounts);
router.get("/messages/:taskId",protect, getMsg);
router.put("/messages/:id",protect, updateMsg);
router.delete("/messages/:id",protect, deleteMsg);
router.put("/messages/read",protect, 
     markAsRead);

router.post("/signup",SignUp)
router.post("/login",Login)

console.log("SITE ROUTER WORKING");

module.exports = router;
