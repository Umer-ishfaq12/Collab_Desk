import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";
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

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  //for socket.io helps to check that user is connects rooms
  useEffect(() => {
    if (selectedTask && socketRef.current) {
      socketRef.current.emit("joinTask", {
        taskId: selectedTask._id,
        userId: user.id,
      });
    }
  }, [selectedTask]);

  //to get tasks
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

  // for findong users
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  //counts
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
      alert("You cannot delete others' messages");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/messages/${id}`);

      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  //post message
  const Send_msg = async () => {
    if (!user || !user.id) {
      alert("User not found. Please login again.");
      return;
    }

    if (!selectedTask || !selectedTask._id) {
      alert("Please select a task first.");
      return;
    }

    if (!Msg.trim()) {
      alert("Message cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/messages",
        {
          message: Msg,
          taskId: selectedTask._id,
          senderId: user.id,
          senderName: user.username,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      // 🔥 Real-time emit
      socketRef.current.emit("sendMessage", res.data);

      setMsg(""); // clear input
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Something went wrong! Please try again.");
    }
  };
  //handle all the message functions
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (newMsg) => {
      // add message
      setMessages((prev) => {
        if (prev.find((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });

      // unread logic
      // const msgTaskId = String(newMsg.taskId?._id || newMsg.taskId);

      const msgTaskId = String(newMsg.taskId?._id || newMsg.taskId);

      // 🔥 ignore own messages
      if (newMsg.senderId === user.id) return;

      if (!selectedTask || String(selectedTask._id) !== msgTaskId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msgTaskId]: (prev[msgTaskId] || 0) + 1,
        }));

        // 🔔 notification
        setNotification(`New message in task`);
      }
    };

    socketRef.current.on("receiveMessage", handler);

    return () => {
      socketRef.current.off("receiveMessage", handler);
    };
  }, [selectedTask]);

  // fecth message
  useEffect(() => {
    if (!selectedTask) return;

    axios
      .get(`http://localhost:3000/api/messages/${selectedTask._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [selectedTask]);

  useEffect(() => {
    localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
    console.log(unreadCounts);
  }, [unreadCounts]);

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:3000/api/unread/${user.id}`)
      .then((res) => {
        setUnreadCounts(res.data);
      })
      .catch((err) => console.log(err));
  }, [user]);

  //for the unread counts
  useEffect(() => {
    if (!socketRef.current || !user?.id) return;

    const handler = () => {
      axios
        .get(`http://localhost:3000/api/unread/${user.id}`)
        .then((res) => setUnreadCounts(res.data))
        .catch((err) => console.log(err));
    };

    socketRef.current.on("unreadUpdate", handler);

    return () => {
      socketRef.current.off("unreadUpdate", handler);
    };
  }, [user]);

  if (loadingUser) {
    return <p>Loading user info...</p>; // wait until user is loaded
  }

  if (!user || !user.id) {
    return <p>User not found. Please login again.</p>; // show if still missing
  }
  return (
    <>
      <div className="taskchat-wrapper">
        {/* LEFT SIDE - TASKS */}

        <div className="taskContainer">
          <h3 className="section-title">Tasks</h3>

          {tasks.map((t) => {
            console.log("TASK ID:", t._id);
            console.log("UNREAD:", unreadCounts);
            return (
              <div key={t._id} className="taskItem">
                {/* <h5>{t.taskName}</h5> */}
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

                    axios.put("http://localhost:3000/api/messages/read", {
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

          {/* <div className="chatMessages">
          
            {selectedTask ? (
              <>
                <h4>{selectedTask.taskName}</h4>

                {messages.map((msg) => (
                  <div key={msg._id}>
                    <strong>{msg.senderName}:</strong> {msg.message}
                  </div>
                ))}
              </>
            ) : (
              <p className="placeholder">Select a task to start conversation</p>
            )}
          </div> */}
          {notification && <div className="toast">{notification}</div>}
          <div className="chatMessages">
            {selectedTask ? (
              <>
                <h4>{selectedTask.taskName}</h4>

                {messages.map((msg) => {
                  const isMe = msg.senderId === user.id; //user jo ha wo login wala ha
                  const isSeen = msg.readBy?.includes(user.id); 
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
                            {msg.readBy && msg.readBy.length > 1// whatsapp double tick logic
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
              onChange={(e) => setMsg(e.target.value)}
            />
            <button onClick={Send_msg}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskChat;
