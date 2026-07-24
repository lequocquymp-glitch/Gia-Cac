"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types";
import {
  getTimelineColor,
  getColorDot,
  getColorLabel,
  formatDate,
  toDateInputValue,
} from "@/lib/timeline";
import { Plus } from "lucide-react";

export function TaskList({ projectId, tasks: initialTasks }: { projectId: string; tasks: Task[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          importance: "medium",
          status: "todo",
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        setTitle("");
        setShowInput(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, completed: !completed } : t))
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== taskId));
      router.refresh();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleDeadlineChange = async (taskId: string, value: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: value || null }),
      });
      const newDeadline = value ? new Date(value) : null;
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, deadline: newDeadline } : t))
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to update deadline", error);
    }
  };

  return (
    <div>
      {tasks.length === 0 && !showInput ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No tasks yet.</p>
          <button
            onClick={() => setShowInput(true)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Add your first task
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <button
                  onClick={() => handleComplete(task.id, task.completed)}
                  className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
                >
                  {task.completed && <span className="text-blue-600">✓</span>}
                </button>
                {task.deadline && (
                  <span
                    className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${getColorDot(
                      getTimelineColor(task.deadline)
                    )}`}
                    title={getColorLabel(getTimelineColor(task.deadline))}
                  />
                )}
                <span
                  className={`flex-1 ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </span>
                {task.deadline && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(task.deadline)}
                  </span>
                )}
                <input
                  type="date"
                  value={toDateInputValue(task.deadline)}
                  onChange={(e) => handleDeadlineChange(task.id, e.target.value)}
                  className="flex-shrink-0 text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-xs text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {showInput && (
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new task..."
                autoFocus
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false);
                  setTitle("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </form>
          )}

          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              Add task
            </button>
          )}
        </>
      )}
    </div>
  );
}
