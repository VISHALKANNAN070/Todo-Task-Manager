import { useState, useEffect } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "pending",
    sharedWith: "",
  });

  const [editId, setEditId] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/task", {
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
      sharedWith: form.sharedWith
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/task/${editId}`,
          payload,
          { withCredentials: true }
        );
        setTasks((prev) =>
          prev.map((task) => (task._id === editId ? res.data : task))
        );
        setEditId(null);
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/task",
          payload,
          {
            withCredentials: true,
          }
        );
        setTasks([...tasks, res.data]);
      }
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        status: "pending",
        sharedWith: "",
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
      sharedWith: (task.sharedWith || []).join(", "),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/${id}`, {
        withCredentials: true,
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Task" : "Add New Task"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            placeholder="Priority (Low/Medium/High)"
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="status"
            value={form.status}
            onChange={handleChange}
            placeholder="Status (pending/In Progress/Done)"
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="sharedWith"
            value={form.sharedWith}
            onChange={handleChange}
            placeholder="Shared with (comma-separated emails)"
            className="border px-3 py-2 rounded col-span-1 md:col-span-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border px-3 py-2 rounded col-span-1 md:col-span-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm">
                  <strong>Due:</strong> {task.dueDate?.split("T")[0]} |{" "}
                  <strong>Priority:</strong> {task.priority} |{" "}
                  <strong>Status:</strong> {task.status}
                </p>
                {task.sharedWith?.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Shared with: {task.sharedWith.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
