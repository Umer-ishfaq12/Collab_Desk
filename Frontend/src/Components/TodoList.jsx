import { useEffect, useState } from "react";
import axios from "axios";

function Todo() {
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
      const res = await axios.post("http://localhost:3000/api/tasks", form);

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tasks")
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
    const res = await axios.put(
      `http://localhost:3000/api/tasks/${editId}`,
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

  const deleteTask = async (id) => {
  await axios.delete(`http://localhost:3000/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
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

        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="displayTask">
        {tasks.map((t) => (
          <div key={t._id || t.id} className="taskItem">
            <h2>{t.taskName}</h2>
            <p>{t.taskMsg}</p>

            <p>Type: {t.taskType}</p>
            <p>Priority: {t.priority}</p>

            <p>Start: {formatDateTime(t.taskStart)}</p>
            <p>End: {formatDateTime(t.taskEnd)}</p>
            
            <p>Remaining Time: {getRemainingTime(t.taskEnd)}</p>
            <button onClick={editId ? updateTask : addTask}>
  {editId ? "Update Task" : "Add Task"}
</button>
<button onClick={() => handleEdit(t)}>Edit</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Todo;
