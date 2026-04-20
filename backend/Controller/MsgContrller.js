// const Msg = require("../Model/Msg");
// const mongoose = require("mongoose");
// // create message
// const createMessage = async (req, res) => {
//   try {
//     const { message, taskId, senderId, senderName } = req.body;

//     if (!message || !taskId || !senderId) {
//       return res.status(400).json({
//         message: "All fields required",
//       });
//     }

//     const newMessage = await Msg.create({
//       message,
//       taskId,
//       senderId,
//       senderName,
//        readBy: [senderId],
//     });

// const io = req.app.get("io");

// // real-time message (keep this)
// io.to(taskId).emit("receiveMessage", newMessage);

// io.emit("unreadUpdate"); // notify everyone to refresh unread counts


//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({
//       message: "Message not created",
//       error: error.message,
//     });
//   }
// };
 
// //get
// const getMsg = async (req, res) => {
//   try {
//       console.log("GET TASK HIT"); 
//     const { taskId } = req.params;

//     const messages = await Msg.find({ taskId }).sort({ createdAt: 1 }); // oldest to the  latest

//     res.status(200).json(messages);
//   } catch (error) {
//        console.error("TASK ERROR:", err);
//     res.status(500).json({
//       message: "Messages not found",
//       error: error.message,
//     });
//   }
// };

// const updateMsg = async (req, res) => {
//   try {
//     const updated = await Msg.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }, // ✅ important
//     );

//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({
//       message: "Message not updated",
//       error: error.message,
//     });
//   }
// };

// // delete Task
// const deleteMsg = async (req, res) => {
//   try {
//     const deleted = await Msg.findByIdAndDelete(req.params.id);

//     res.status(200).json(deleted);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting message",
//       error: error.message,
//     });
//   }
// };

// const getUnreadCounts = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     console.log("USER ID:", userId);

    
// const counts = await Msg.aggregate([
//   {
//     $match: {
//       readBy: {
//         $ne: new mongoose.Types.ObjectId(userId),
//       },
//     },
//   },
//   {
//     $group: {
//       _id: "$taskId",
//       count: { $sum: 1 },
//     },
//   },
// ]);
//     const result = {};
//     counts.forEach((c) => {
//       result[c._id.toString()] = c.count;
//     });

//     res.json(result);
//   } catch (error) {
//     console.error("ERROR IN getUnreadCounts:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const markAsRead = async (req, res) => {
//   try {
//     const { taskId, userId } = req.body;

//     await Msg.updateMany(
//       {
//         taskId,
//         readBy: { $ne: userId },
//       },
//       {
//         $push: { readBy: userId },
//       }
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { createMessage, getMsg, updateMsg, deleteMsg , getUnreadCounts , markAsRead};
const Msg = require("../Model/Msg");
const mongoose = require("mongoose");

const createMessage = async (req, res) => {
  try {
    const { message, taskId, senderId, senderName } = req.body;

    if (!message || !taskId || !senderId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newMessage = await Msg.create({
      message,
      taskId,
      senderId,
      senderName,
      readBy: [senderId],
    });

    const io = req.app.get("io");
    io.to(taskId).emit("receiveMessage", newMessage);
    io.emit("unreadUpdate");

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("ERROR in createMessage:", error);
    res.status(500).json({
      message: "Message not created",
      error: error.message,
    });
  }
};

const getMsg = async (req, res) => {
  try {
    console.log("GET MESSAGES HIT for taskId:", req.params.taskId);
    const { taskId } = req.params;
    const messages = await Msg.find({ taskId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("ERROR in getMsg:", error);
    res.status(500).json({
      message: "Messages not found",
      error: error.message,
    });
  }
};

const updateMsg = async (req, res) => {
  try {
    const updated = await Msg.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("ERROR in updateMsg:", error);
    res.status(500).json({
      message: "Message not updated",
      error: error.message,
    });
  }
};

const deleteMsg = async (req, res) => {
  try {
    const deleted = await Msg.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    console.error("ERROR in deleteMsg:", error);
    res.status(500).json({
      message: "Error deleting message",
      error: error.message,
    });
  }
};

const getUnreadCounts = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("USER ID for unread:", userId);
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId, returning empty");
      return res.json({});
    }
    
    const counts = await Msg.aggregate([
      {
        $match: {
          readBy: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $group: {
          _id: "$taskId",
          count: { $sum: 1 },
        },
      },
    ]);
    
    const result = {};
    counts.forEach((c) => {
      result[c._id.toString()] = c.count;
    });
    
    console.log("Unread counts result:", result);
    res.json(result);
  } catch (error) {
    console.error("ERROR IN getUnreadCounts:", error);
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    console.log("Mark as read:", { taskId, userId });
    
    if (!taskId || !userId) {
      return res.status(400).json({ error: "taskId and userId required" });
    }
    
    await Msg.updateMany(
      {
        taskId,
        readBy: { $ne: userId },
      },
      {
        $push: { readBy: userId },
      }
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error("ERROR in markAsRead:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMessage, getMsg, updateMsg, deleteMsg, getUnreadCounts, markAsRead };