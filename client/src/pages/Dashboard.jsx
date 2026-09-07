import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";

const defaultFilters = {
  search: "",
  status: "all",
  sort: "newest"
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/tasks");
      setTasks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      try {
        const response = await api.get("/tasks");
        if (active) {
          setTasks(response.data.data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Could not load your tasks");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((previousTasks) => [newTask, ...previousTasks]);
  };

  const handleUpdate = async (id, updates) => {
    try {
      setError("");
      const response = await api.put(`/tasks/${id}`, updates);
      setTasks((previousTasks) => previousTasks.map((task) => (
        task._id === id ? response.data.data : task
      )));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the task");
      return false;
    }

    return true;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;

    try {
      setError("");
      await api.delete(`/tasks/${id}`);
      setTasks((previousTasks) => previousTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the task");
    }
  };

  const visibleTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter((task) => (
        task.title.toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query)
      ));
    }

    if (filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status);
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((first, second) => {
      if (filters.sort === "oldest") {
        return new Date(first.createdAt) - new Date(second.createdAt);
      }
      if (filters.sort === "priority") {
        return priorityOrder[first.priority] - priorityOrder[second.priority];
      }
      if (filters.sort === "title") {
        return first.title.localeCompare(second.title);
      }
      return new Date(second.createdAt) - new Date(first.createdAt);
    });

    return result;
  }, [tasks, filters]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="dashboard">
      <header className="dash-header">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Hello, {user?.name}</h1>
        </div>
        <button onClick={handleLogout} className="btn-ghost">Log out</button>
      </header>

      <TaskForm onTaskCreated={handleTaskCreated} />

      {loading && <div className="loader">Loading your tasks...</div>}

      {error && (
        <div className="alert-error">
          <span>{error}</span>
          <button onClick={fetchTasks} className="btn-retry">Try again</button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <h2>No tasks yet</h2>
          <p>Add your first task above to get started.</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={visibleTasks.length}
            totalCount={tasks.length}
          />

          {visibleTasks.length > 0 ? (
            <TaskList
              tasks={visibleTasks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <div className="empty-state filter-empty">
              <h2>No tasks match your filters</h2>
              <button onClick={() => setFilters(defaultFilters)}>Clear filters</button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;