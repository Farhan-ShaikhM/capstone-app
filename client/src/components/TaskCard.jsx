import { useState } from "react";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    if (!draft.title.trim()) return;

    setSaving(true);
    try {
      const updated = await onUpdate(task._id, draft);
      if (updated) setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="task-card editing">
        <input name="title" value={draft.title} onChange={handleChange} aria-label="Task title" />
        <textarea name="description" value={draft.description} onChange={handleChange} rows="2" aria-label="Task description" />
        <div className="form-row">
          <select name="status" value={draft.status} onChange={handleChange} aria-label="Task status">
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <select name="priority" value={draft.priority} onChange={handleChange} aria-label="Task priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="card-actions">
          <button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button onClick={handleCancel} className="btn-ghost">Cancel</button>
        </div>
      </article>
    );
  }

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : null;

  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-main">
        <h3>{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>
      <div className="task-meta">
        <span className={`badge status-${task.status}`}>{task.status}</span>
        <span className={`badge priority-${task.priority}`}>{task.priority}</span>
        {formattedDate && <span className="due">Due {formattedDate}</span>}
      </div>
      <div className="card-actions">
        <button onClick={() => setIsEditing(true)} className="btn-ghost">Edit</button>
        <button onClick={() => onDelete(task._id)} className="btn-danger">Delete</button>
      </div>
    </article>
  );
}