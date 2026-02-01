import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasksApi } from "../hooks/useApi";
import type { Task } from "../hooks/useApi";
export function Tasks() {
  const { logout } = useAuth();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading } =
    useTasksApi();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask(newTaskTitle.trim(), newTaskDescription.trim() || undefined);
      setNewTaskTitle("");
      setNewTaskDescription("");
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
          width: "100%",
          fontSize: "18px",
        }}
      >
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-700">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 pb-8 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-4 sm:mb-0">
            My Tasks ({tasks.length})
          </h1>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-gray-300 font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <div className="max-w-2xl mb-12">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all  text-gray-200"
              required
              disabled={loading}
            />
            <textarea
              value={newTaskDescription || ""}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Description (optional)..."
              rows={3}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-vertical text-gray-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newTaskTitle.trim()}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 shadow-xl transition-all"
            >
              {loading ? "Creating..." : "➕ Add Task"}
            </button>
          </form>
        </div>

        {/* Tasks */}
        <div className="grid gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="text-6xl mb-6">📋</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No tasks yet
              </h2>
              <p className="text-lg text-gray-500">
                Start by adding your first task above!
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-400 p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="mt-1 w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-600 border-2"
                  />
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {/* Description Edit */}
                    {editingTaskId === task.id ? (
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        onBlur={() => {
                          if (editDescription.trim() !== task.description) {
                            updateTask(task.id, {
                              description: editDescription.trim(),
                            });
                          }
                          setEditingTaskId(null);
                          setEditDescription("");
                        }}
                        autoFocus
                        className="mt-3 w-full p-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px] font-medium"
                      />
                    ) : (
                      <>
                        {task.description && (
                          <p className="mt-2 text-gray-600 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditDescription(task.description || "");
                          }}
                          className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {task.description ? "✏️ Edit" : "➕ Add description"}
                        </button>
                      </>
                    )}

                    <p className="mt-3 text-xs text-gray-500">
                      {new Date(task.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-4 py-2 bg-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
