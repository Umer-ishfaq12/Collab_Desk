// // import axios1 from "axios1";
// import React, { useEffect } from "react";
// import { useState } from "react";
// import { io } from "socket.io-client";
// import { useRef } from "react";

// import API_BASE from "../config/api";
// import axios1 from "../config/axios";




// function TaskChat() {
//   const [tasks, setTasks] = useState([]);
//   const [selectedMsgId, setSelectedMsgId] = useState(null);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [Msg, setMsg] = useState("");
//   const [user, setUser] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [messages, setMessages] = useState([]);
//   const [notification, setNotification] = useState(null);
//   const [unreadCounts, setUnreadCounts] = useState({});

//   const socketRef = useRef();
//   useEffect(() => {
//     // socketRef.current = io("http://localhost:3000");
// //     socketRef.current = io(API_BASE, {
// //   transports: ["websocket", "polling"]
// // });
// socketRef.current = io(API_BASE, {
//     transports: ["websocket", "polling"],  // ✅ Try websocket first
//     withCredentials: true,
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000
//   });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);

//   //for socket.io helps to check that user is connects rooms
//   useEffect(() => {
//     if (selectedTask && socketRef.current) {
//       socketRef.current.emit("joinTask", {
//         taskId: selectedTask._id,
//         userId: user.id,
//       });
//     }
//   }, [selectedTask]);

//   //to get tasks
//   useEffect(() => {
//     axios1
//       .get("/api/tasks")
//       .then((res) => setTasks(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   // for findong users
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoadingUser(false);
//   }, []);

//   //counts
//   useEffect(() => {
//     const saved = localStorage.getItem("unreadCounts");
//     if (saved) {
//       setUnreadCounts(JSON.parse(saved));
//     }
//   }, []);
//   const formatDateTime = (date) => {
//     return new Date(date).toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getRemainingTime = (taskEnd) => {
//     const end = new Date(taskEnd);
//     const diffMs = end - new Date();
//     if (diffMs <= 0) return "Time's up!";
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   const deleteMessage = async (id, senderId) => {
//     if (senderId !== user.id) {
//       alert("You cannot delete others' messages");
//       return;
//     }

//     try {
//       await axios1.delete(`/api/messages/${id}`);

//       setMessages((prev) => prev.filter((m) => m._id !== id));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //post message
//   const Send_msg = async () => {
//     if (!user || !user.id) {
//       alert("User not found. Please login again.");
//       return;
//     }

//     if (!selectedTask || !selectedTask._id) {
//       alert("Please select a task first.");
//       return;
//     }

//     if (!Msg.trim()) {
//       alert("Message cannot be empty");
//       return;
//     }

//     try {
//       const res = await axios1.post(
//         "/api/messages",
//         {
//           message: Msg,
//           taskId: selectedTask._id,
//           senderId: user.id,
//           senderName: user.username,
//         },
//         { headers: { "Content-Type": "application/json" } },
//       );

//       // 🔥 Real-time emit
//       socketRef.current.emit("sendMessage", res.data);

//       setMsg(""); // clear input
//     } catch (error) {
//       console.error(error.response?.data || error.message);
//       alert("Something went wrong! Please try again.");
//     }
//   };
//   //handle all the message functions
//   useEffect(() => {
//     if (!socketRef.current) return;

//     const handler = (newMsg) => {
//       // add message
//       setMessages((prev) => {
//         if (prev.find((m) => m._id === newMsg._id)) return prev;
//         return [...prev, newMsg];
//       });

//       // unread logic
//       // const msgTaskId = String(newMsg.taskId?._id || newMsg.taskId);

//       const msgTaskId = String(newMsg.taskId?._id || newMsg.taskId);

//       // 🔥 ignore own messages
//       if (newMsg.senderId === user.id) return;

//       if (!selectedTask || String(selectedTask._id) !== msgTaskId) {
//         setUnreadCounts((prev) => ({
//           ...prev,
//           [msgTaskId]: (prev[msgTaskId] || 0) + 1,
//         }));

//         // 🔔 notification
//         setNotification(`New message in task`);
//       }
//     };

//     socketRef.current.on("receiveMessage", handler);

//     return () => {
//       socketRef.current.off("receiveMessage", handler);
//     };
//   }, [selectedTask]);

//   // fecth message
//   useEffect(() => {
//     if (!selectedTask) return;

//     axios1
//       .get(`/api/messages/${selectedTask._id}`)
//       .then((res) => setMessages(res.data))
//       .catch((err) => console.log(err));
//   }, [selectedTask]);

//   useEffect(() => {
//     localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
//     console.log(unreadCounts);
//   }, [unreadCounts]);

//   useEffect(() => {
//     if (!user?.id) return;

//     axios1
//       .get(`/api/unread/${user.id}`)
//       .then((res) => {
//         setUnreadCounts(res.data);
//       })
//       .catch((err) => console.log(err));
//   }, [user]);

//   //for the unread counts
//   useEffect(() => {
//     if (!socketRef.current || !user?.id) return;

//     const handler = () => {
//       axios1
//         .get(`/api/unread/${user.id}`)
//         .then((res) => setUnreadCounts(res.data))
//         .catch((err) => console.log(err));
//     };

//     socketRef.current.on("unreadUpdate", handler);

//     return () => {
//       socketRef.current.off("unreadUpdate", handler);
//     };
//   }, [user]);

//   if (loadingUser) {
//     return <p>Loading user info...</p>; // wait until user is loaded
//   }

//   if (!user || !user.id) {
//     return <p>User not found. Please login again.</p>; // show if still missing
//   }
//   return (
//     <>
//       <div className="taskchat-wrapper">
//         {/* LEFT SIDE - TASKS */}

//         <div className="taskContainer">
//           <h3 className="section-title">Tasks</h3>

//           {tasks.map((t) => {
//             console.log("TASK ID:", t._id);
//             console.log("UNREAD:", unreadCounts);
//             return (
//               <div key={t._id} className="taskItem">
//                 {/* <h5>{t.taskName}</h5> */}
//                 <h5>
//                   {t.taskName}

//                   {unreadCounts[String(t._id)] > 0 && (
//                     <span className="badge">{unreadCounts[t._id]}</span>
//                   )}
//                 </h5>
//                 <p>{t.taskMsg}</p>
//                 <div className="taskMeta">
//                   <span>Type: {t.taskType}</span>
//                   <span>Priority: {t.priority}</span>
//                 </div>
//                 <div className="taskTime">
//                   <p>Start: {formatDateTime(t.taskStart)}</p>
//                   <p>End: {formatDateTime(t.taskEnd)}</p>
//                 </div>
//                 <p className="remaining">⏳ {getRemainingTime(t.taskEnd)}</p>

//                 <button
//                   className="chatBtn"
//                   onClick={() => {
//                     setSelectedTask(t);

//                     axios1.put("/api/messages/read", {
//                       taskId: t._id,
//                       userId: user.id,
//                     });

//                     setUnreadCounts((prev) => ({
//                       ...prev,
//                       [t._id]: 0,
//                     }));
//                   }}
//                 >
//                   Open Chat
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* RIGHT SIDE - CHAT UI */}
//         <div className="ChatContainer">
//           <h3 className="section-title">Chat Area</h3>

//           {/* <div className="chatMessages">
          
//             {selectedTask ? (
//               <>
//                 <h4>{selectedTask.taskName}</h4>

//                 {messages.map((msg) => (
//                   <div key={msg._id}>
//                     <strong>{msg.senderName}:</strong> {msg.message}
//                   </div>
//                 ))}
//               </>
//             ) : (
//               <p className="placeholder">Select a task to start conversation</p>
//             )}
//           </div> */}
//           {notification && <div className="toast">{notification}</div>}
//           <div className="chatMessages">
//             {selectedTask ? (
//               <>
//                 <h4>{selectedTask.taskName}</h4>

//                 {messages.map((msg) => {
//                   const isMe = msg.senderId === user.id; //user jo ha wo login wala ha
//                   const isSeen = msg.readBy?.includes(user.id); 
//                   return (
//                     <div
//                       key={msg._id}
//                       className={`messageBubble ${isMe ? "me" : "other"}`}
//                     >
//                       <p
//                         className="messageText"
//                         onClick={() => setSelectedMsgId(msg._id)}
//                       >
//                         {msg.message}
//                       </p>

//                       <span className="messageMeta">
//                         {msg.senderName} •{" "}
//                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                         {isMe && (
//                           <span className="ticks">
//                             {msg.readBy && msg.readBy.length > 1// whatsapp double tick logic
//                               ? "✔✔ (seen)"
//                               : "✔✔"}
//                           </span>
//                         )}
//                         {selectedMsgId === msg._id && (
//                           <button
//                             onClick={() => deleteMessage(msg._id, msg.senderId)}
//                           >
//                             Delete
//                           </button>
//                         )}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </>
//             ) : (
//               <p className="placeholder">Select a task to start conversation</p>
//             )}
//           </div>
//           <div className="chatInputBox">
//             <input
//               type="text"
//               placeholder="Type message..."
//               onChange={(e) => setMsg(e.target.value)}
//             />
//             <button onClick={Send_msg}>Send</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default TaskChat;

import React, { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";

import API_BASE from "../config/api";
import axios1 from "../config/axios";

// Toast types: success | error | warning | info
function ToastContainer({ toasts }) {
  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none"
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: "12px 18px",
          borderRadius: "10px",
          fontSize: "14px",
          color: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          animation: "fadeInOut 3s ease forwards",
          background:
            t.type === "success" ? "#25d366" :
            t.type === "error"   ? "#e74c3c" :
            t.type === "warning" ? "#f39c12" :
                                   "#3498db",
          maxWidth: "280px",
          pointerEvents: "auto"
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function TaskChat() {
  const [tasks, setTasks] = useState([]);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [Msg, setMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [toasts, setToasts] = useState([]);

  const socketRef = useRef();

  // ✅ Toast helper
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    socketRef.current = io(API_BASE, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedTask && socketRef.current) {
      socketRef.current.emit("joinTask", {
        taskId: selectedTask._id,
        userId: user.id,
      });
    }
  }, [selectedTask]);

  useEffect(() => {
    axios1
      .get("/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("unreadCounts");
    if (saved) {
      setUnreadCounts(JSON.parse(saved));
    }
  }, []);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRemainingTime = (taskEnd) => {
    const end = new Date(taskEnd);
    const diffMs = end - new Date();
    if (diffMs <= 0) return "Time's up!";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const deleteMessage = async (id, senderId) => {
    if (senderId !== user.id) {
      showToast("You cannot delete others' messages", "error");
      return;
    }

    try {
      await axios1.delete(`/api/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      showToast("Message deleted", "success");
    } catch (error) {
      console.log(error);
      showToast("Failed to delete message", "error");
    }
  };

  const Send_msg = async () => {
    if (!user || !user.id) {
      showToast("User not found. Please login again.", "error");
      return;
    }

    if (!selectedTask || !selectedTask._id) {
      showToast("Please select a task first.", "warning");
      return;
    }

    if (!Msg.trim()) {
      showToast("Message cannot be empty", "warning");
      return;
    }

    try {
      const res = await axios1.post(
        "/api/messages",
        {
          message: Msg,
          taskId: selectedTask._id,
          senderId: user.id,
          senderName: user.username,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      socketRef.current.emit("sendMessage", res.data);
      setMsg("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      showToast("Something went wrong! Please try again.", "error");
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (newMsg) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });

      const msgTaskId = String(newMsg.taskId?._id || newMsg.taskId);

      if (newMsg.senderId === user.id) return;

      if (!selectedTask || String(selectedTask._id) !== msgTaskId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msgTaskId]: (prev[msgTaskId] || 0) + 1,
        }));

        showToast("New message in task", "info");
      }
    };

    socketRef.current.on("receiveMessage", handler);

    return () => {
      socketRef.current.off("receiveMessage", handler);
    };
  }, [selectedTask]);

  useEffect(() => {
    if (!selectedTask) return;

    axios1
      .get(`/api/messages/${selectedTask._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [selectedTask]);

  useEffect(() => {
    localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  useEffect(() => {
    if (!user?.id) return;

    axios1
      .get(`/api/unread/${user.id}`)
      .then((res) => {
        setUnreadCounts(res.data);
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (!socketRef.current || !user?.id) return;

    const handler = () => {
      axios1
        .get(`/api/unread/${user.id}`)
        .then((res) => setUnreadCounts(res.data))
        .catch((err) => console.log(err));
    };

    socketRef.current.on("unreadUpdate", handler);

    return () => {
      socketRef.current.off("unreadUpdate", handler);
    };
  }, [user]);

  if (loadingUser) {
    return <p>Loading user info...</p>;
  }

  if (!user || !user.id) {
    return <p>User not found. Please login again.</p>;
  }

  return (
    <>
      {/* ✅ Toast Notifications */}
      <ToastContainer toasts={toasts} />

      <div className="taskchat-wrapper">
        {/* LEFT SIDE - TASKS */}
        <div className="taskContainer">
          <h3 className="section-title">Tasks</h3>

          {tasks.map((t) => {
            return (
              <div key={t._id} className="taskItem">
                <h5>
                  {t.taskName}
                  {unreadCounts[String(t._id)] > 0 && (
                    <span className="badge">{unreadCounts[t._id]}</span>
                  )}
                </h5>
                <p>{t.taskMsg}</p>
                <div className="taskMeta">
                  <span>Type: {t.taskType}</span>
                  <span>Priority: {t.priority}</span>
                </div>
                <div className="taskTime">
                  <p>Start: {formatDateTime(t.taskStart)}</p>
                  <p>End: {formatDateTime(t.taskEnd)}</p>
                </div>
                <p className="remaining">⏳ {getRemainingTime(t.taskEnd)}</p>

                <button
                  className="chatBtn"
                  onClick={() => {
                    setSelectedTask(t);

                    axios1.put("/api/messages/read", {
                      taskId: t._id,
                      userId: user.id,
                    });

                    setUnreadCounts((prev) => ({
                      ...prev,
                      [t._id]: 0,
                    }));
                  }}
                >
                  Open Chat
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE - CHAT UI */}
        <div className="ChatContainer">
          <h3 className="section-title">Chat Area</h3>

          <div className="chatMessages">
            {selectedTask ? (
              <>
                <h4>{selectedTask.taskName}</h4>

                {messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div
                      key={msg._id}
                      className={`messageBubble ${isMe ? "me" : "other"}`}
                    >
                      <p
                        className="messageText"
                        onClick={() => setSelectedMsgId(msg._id)}
                      >
                        {msg.message}
                      </p>

                      <span className="messageMeta">
                        {msg.senderName} •{" "}
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {isMe && (
                          <span className="ticks">
                            {msg.readBy && msg.readBy.length > 1
                              ? "✔✔ (seen)"
                              : "✔✔"}
                          </span>
                        )}
                        {selectedMsgId === msg._id && (
                          <button
                            onClick={() => deleteMessage(msg._id, msg.senderId)}
                          >
                            Delete
                          </button>
                        )}
                      </span>
                    </div>
                  );
                })}
              </>
            ) : (
              <p className="placeholder">Select a task to start conversation</p>
            )}
          </div>

          <div className="chatInputBox">
            <input
              type="text"
              placeholder="Type message..."
              value={Msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && Send_msg()}
            />
            <button onClick={Send_msg}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskChat;
