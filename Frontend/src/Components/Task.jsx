import { useEffect, useState } from "react";
import axios1 from "../config/axios";
import toast from "react-hot-toast";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios1.get("/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

  const completeTask = async (id) => {
    try {
      const res = await axios1.patch(`/api/tasks/${id}/complete`);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      toast.success("Task submitted");
    } catch (error) {
      toast.error("Failed to submit task");
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <>
      <h1>My Tasks</h1>
      <div className="displayTask">
        {tasks.map((t) => (
          <div key={t._id} className="taskItem">
            <h2>{t.taskName}</h2>
            <p>{t.taskMsg}</p>
            <p>Type: {t.taskType}</p>
            <p>Priority: {t.priority}</p>
            <p>Start: {formatDateTime(t.taskStart)}</p>
            <p>End: {formatDateTime(t.taskEnd)}</p>
            <p>Status: {t.status}</p>

            {t.status === "pending" && (
              <button onClick={() => completeTask(t._id)}>Mark Complete</button>
            )}

            {t.status === "submitted" && <p>Waiting for admin approval</p>}
            {t.status === "approved" && <p>✓ Approved</p>}
          </div>
        ))}
      </div>
    </>
  );
}

export default Tasks;