import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "pending",
  });

  const [editId, setEditId] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(import.meta.VITE_API_URL + "/api/task", {
          withCredentials: true,
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update task
  const handleSubmit = async () => {
    const payload = {
      ...form,
      priority: form.priority.toLowerCase(),
      status: form.status.toLowerCase().replace(/\s/g, "-"),
    };

    try {
      if (editId) {
        const res = await axios.put(
          import.meta.VITE_API_URL + `/api/task/${editId}`,
          payload,
          { withCredentials: true }
        );
        setTasks((prev) =>
          prev.map((task) => (task._id === editId ? res.data : task))
        );
        setEditId(null);
      } else {
        const res = await axios.post(
          import.meta.VITE_API_URL + "/api/task",
          payload,
          { withCredentials: true }
        );
        setTasks([...tasks, res.data]);
      }

      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        status: "pending",
      });
    } catch (err) {
      console.error("Error saving task:", err.message);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate?.split("-")[0] || "",
      priority: task.priority || "low",
      status: task.status || "pending",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(import.meta.VITE_API_URL + `/api/task/${id}`, {
        withCredentials: true,
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(import.meta.VITE_API_URL + "/api/auth/logout", {
        withCredentials: true,
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="task-manager-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <h1 className="task-manager-title">Task Manager</h1>

      <div className="task-form-container">
        <h2 className="task-form-header">{editId ? "Edit Task" : "Add New Task"}</h2>

        <div className="task-form-grid">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          <input name="priority" value={form.priority} onChange={handleChange} placeholder="Priority (Low/Medium/High)" />
          <input name="status" value={form.status} onChange={handleChange} placeholder="Status (Pending/In Progress/Done)" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        </div>

        <button onClick={handleSubmit} className="task-submit-button">
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="task-list-container">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-details">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  {task.description}<br />
                  <strong>Due:</strong> {task.dueDate?.split("T")[0]} | <strong>Priority:</strong> {task.priority} | <strong>Status:</strong> {task.status}
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => handleEdit(task)} className="task-button edit">Edit</button>
                <button onClick={() => handleDelete(task._id)} className="task-button delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
