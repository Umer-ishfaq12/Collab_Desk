import { useEffect, useState } from "react";
import axios from "axios";
import axios1 from "../config/axios";
import toast from "react-hot-toast";


function Todo() {
  const [pendingDelete, setPendingDelete] = useState(null);
const [timerId, setTimerId] = useState(null);
const [tasks, setTasks] = useState([]);
const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    taskName: "",
    taskMsg: "",
    taskType: "",
    taskStart: "",
    taskEnd: "",
    priority: "medium",
  });

  // handle all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // add task
  const addTask = async () => {
    try {
      // backend call (optional)
      const res = await axios1.post("/api/tasks", form);

      setTasks([...tasks, res.data]);

      // reset form
      setForm({
        taskName: "",
        taskMsg: "",
        taskType: "",
        taskStart: "",
        taskEnd: "",
        priority: "medium",
      });
    toast.success("Task ADDED successfully");

    } catch (error) {
      console.log(error);
      toast.error("Failed to ADD task");
    }
  };

  useEffect(() => {
    axios1
      .get("/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

const handleEdit = (task) => {
  setEditId(task._id);

  setForm({
    taskName: task.taskName,
    taskMsg: task.taskMsg,
    taskType: task.taskType,
    taskStart: task.taskStart.slice(0,16),
    taskEnd: task.taskEnd.slice(0,16),
    priority: task.priority,
  });
};
const updateTask = async () => {
  try {
    const res = await axios1.put(
      `/api/tasks/${editId}`,
      form
    );

    setTasks((prev) =>
      prev.map((t) => (t._id === editId ? res.data : t))
    );

    setEditId(null);

    setForm({
      taskName: "",
      taskMsg: "",
      taskType: "",
      taskStart: "",
      taskEnd: "",
      priority: "medium",
    });
    toast.success("Task UPDATED successfully");

  } catch (error) {
    console.log(error);
  }
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

  // delete task

  // const deleteTask = async (id) => {
  // await axios1.delete(`/api/tasks/${id}`);
  //   setTasks(tasks.filter((t) => t._id !== id));
  // };


const deleteTask = (task) => {
  if (!window.confirm("Are you sure you want to delete this task?")) return;

  // remove from UI
  setTasks((prev) => prev.filter((t) => t._id !== task._id));

  // store deleted task
  setPendingDelete(task);

  // start timer
  const timeout = setTimeout(async () => {
    try {
      await axios1.delete(`/api/tasks/${task._id}`);
      setPendingDelete(null);
      toast.success("Task deleted permanently");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  }, 5000);

  setTimerId(timeout);

  toast(
    (t) => (
      <span>
        Task deleted
        <button onClick={() => undoDelete(t.id)}>Undo</button>
      </span>
    ),
    { duration: 5000 }
  );
};
//undo function
const undoDelete = (toastId) => {
  if (!pendingDelete) return;

  if (timerId) clearTimeout(timerId);

  setTasks((prev) => {
    if (prev.find((t) => t._id === pendingDelete._id)) return prev;
    return [pendingDelete, ...prev];
  });

  setPendingDelete(null);
  setTimerId(null);

  toast.dismiss(toastId);
  toast.success("Task restored");
};

  const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

  return (
    <>
      <h1>Collab Desk Tasks</h1>
{editId && <p style={{color: "orange"}}>Editing Task...</p>}
      <div className="toDos">
        <input
          name="taskName"
          value={form.taskName}
          onChange={handleChange}
          placeholder="Task Name"
        />

        <input
          name="taskMsg"
          value={form.taskMsg}
          onChange={handleChange}
          placeholder="Task Description"
        />

        <input
          type="datetime-local"
          name="taskStart"
          value={form.taskStart}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="taskEnd"
          value={form.taskEnd}
          onChange={handleChange}
        />

        <select name="taskType" value={form.taskType} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="personal">Personal</option>
          <option value="team">Team</option>
          <option value="urgent">Urgent</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* <button onClick={addTask}>Add Task</button> */}
        <button onClick={editId ? updateTask : addTask}>
  {editId ? "Update Task" : "Add Task"}
</button>
        
      </div>

      <div className="displayTask">
        {tasks.map((t) => (
          <div key={t._id || t.id} className="taskItem">
            <h2>{t.taskName}</h2>
            <p>{t.taskMsg}</p>

            <p>Type: {t.taskType}</p>
            <p className={`priority ${t.priority}`}>Priority: {t.priority}</p>

            <p>Start: {formatDateTime(t.taskStart)}</p>
            <p>End: {formatDateTime(t.taskEnd)}</p>
            
            <p>Remaining Time: {getRemainingTime(t.taskEnd)}</p>
            {/* <button onClick={editId ? updateTask : addTask}>
  {editId ? "Update Task" : "Add Task"}
</button>
<button onClick={() => handleEdit(t)}>Edit</button> */}
<button onClick={() => handleEdit(t)}>Edit</button>

<button onClick={() => deleteTask(t)}>
  Delete
</button>
          </div>
        ))}
        <div className="taskMetaGroup">
  <span>Type: {t.taskType}</span>
  <span>Priority: {t.priority}</span>
</div>
      </div>
    </>
  );
}

export default Todo;
