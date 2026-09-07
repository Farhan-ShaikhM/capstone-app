import { useState } from "react";
import api from "../api/axios";

const initialForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: ""
};

export default function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await api.post("/tasks", form);
      onTaskCreated(response.data.data);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-heading">
        <div>
          <p className="eyebrow">Capture the next step</p>
          <h2>New task</h2>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="What needs doing?"
        aria-label="Task title"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Details (optional)"
        rows="2"
        aria-label="Task description"
      />

      <div className="form-row">
        <select name="priority" value={form.priority} onChange={handleChange} aria-label="Task priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} aria-label="Due date" />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add task"}
        </button>
      </div>
    </form>
  );
}