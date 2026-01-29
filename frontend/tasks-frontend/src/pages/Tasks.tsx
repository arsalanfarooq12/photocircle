import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasksApi } from "../hooks/useApi";
import type { Task } from "../hooks/useApi";
export function Tasks() {
  const { logout } = useAuth();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading } =
    useTasksApi();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Delete this task?")) {
      deleteTask(taskId);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "18px",
        }}
      >
        Loading tasks...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
          My Tasks ({tasks.length})
        </h1>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>

      {/* New Task Form */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            maxWidth: "600px",
          }}
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              padding: "14px 16px",
              border: "2px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
            }}
            disabled={loading}
          />

          {/* description input */}

          <button
            type="submit"
            disabled={loading || !newTaskTitle.trim()}
            style={{
              padding: "14px 24px",
              backgroundColor:
                loading || !newTaskTitle.trim() ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor:
                loading || !newTaskTitle.trim() ? "not-allowed" : "pointer",
              fontWeight: "500",
              minWidth: "100px",
            }}
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Tasks List */}
      <div style={{ display: "grid", gap: "16px" }}>
        {tasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            No tasks yet. Create one above!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              className="task-item"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  style={{
                    marginTop: "4px",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />

                {/* Task Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: task.completed ? "400" : "600",
                      color: task.completed ? "#9ca3af" : "#1f2937",
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        color: "#6b7280",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {task.description}
                    </p>
                  )}
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      color: "#9ca3af",
                      fontSize: "12px",
                    }}
                  >
                    {new Date(task.updated_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  }}
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
}
