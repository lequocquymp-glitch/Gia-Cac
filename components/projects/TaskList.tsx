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
import { getStatusBadge } from "@/lib/status";
import { Plus } from "lucide-react";

export function TaskList({ projectId, tasks: initialTasks }: { projectId: string; tasks: Task[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

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
          description: desc.trim(),
          importance: "medium",
          status: "todo",
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        setTitle("");
        setDesc("");
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

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editTitle.trim()) return;
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
        }),
      });
      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, title: editTitle.trim(), description: editDesc.trim() }
            : t
        )
      );
      cancelEdit();
      router.refresh();
    } catch (error) {
      console.error("Failed to edit task", error);
    }
  };

  // Website tự phân loại: 4 nhóm
  const done = tasks.filter((t) => t.completed);
  const active = tasks.filter((t) => !t.completed);
  const overdue = active.filter((t) => getTimelineColor(t.deadline) === "overdue");
  const soon = active.filter((t) => {
    const c = getTimelineColor(t.deadline);
    return t.deadline && (c === "today" || c === "1-2days" || c === "3-7days");
  });
  const later = active.filter(
    (t) => getTimelineColor(t.deadline) === "more7days"
  );

  const renderTask = (task: Task) => {
    if (editingId === task.id) {
      return (
        <div
          key={task.id}
          className="p-3 bg-white rounded-lg border border-blue-200 space-y-2"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Tên công việc"
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Nội dung thực hiện..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveEdit(task.id)}
              disabled={!editTitle.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Lưu
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
            >
              Huỷ
            </button>
          </div>
        </div>
      );
    }

    const statusBadge = task.completed ? null : getStatusBadge(task.status);

    return (
      <div
        key={task.id}
        className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleComplete(task.id, task.completed)}
            className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors"
          >
            {task.completed && <span className="text-blue-600">✓</span>}
          </button>
          {statusBadge && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          )}
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
              task.completed ? "line-through text-gray-400" : "text-gray-900"
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
            onClick={() => startEdit(task)}
            className="text-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDelete(task.id)}
            className="text-xs text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          >
            Xoá
          </button>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1.5 ml-8 whitespace-pre-wrap">
            {task.description}
          </p>
        )}
      </div>
    );
  };

  const groups = [
    { key: "overdue", emoji: "🔥", label: "Quá hạn", items: overdue, accent: "text-gray-800", box: "border-gray-300 bg-gray-50" },
    { key: "soon", emoji: "📅", label: "Cần làm (trong 7 ngày)", items: soon, accent: "text-orange-600", box: "border-orange-200 bg-orange-50" },
    { key: "later", emoji: "🗓️", label: "Còn xa", items: later, accent: "text-green-700", box: "border-green-200 bg-green-50" },
    { key: "done", emoji: "✅", label: "Đã hoàn thành", items: done, accent: "text-gray-400", box: "border-gray-200 bg-white" },
  ];

  return (
    <div>
      {tasks.length === 0 && !showInput ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">Chưa có công việc nào.</p>
          <button
            onClick={() => setShowInput(true)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Thêm công việc đầu tiên
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-5 mb-4">
            {groups.map((group) =>
              group.items.length === 0 ? null : (
                <section
                  key={group.key}
                  className={`rounded-xl border p-4 ${group.box}`}
                >
                  <h3
                    className={`text-sm font-bold mb-3 flex items-center gap-2 ${group.accent}`}
                  >
                    <span>{group.emoji}</span>
                    {group.label}
                    <span className="text-xs font-normal text-gray-400">
                      ({group.items.length})
                    </span>
                  </h3>
                  <div className="space-y-2">{group.items.map(renderTask)}</div>
                </section>
              )
            )}
          </div>

          {showInput && (
            <form
              onSubmit={handleAddTask}
              className="mb-4 p-3 bg-white rounded-lg border border-blue-200 space-y-2"
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề cần thực hiện"
                autoFocus
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Nội dung cần thực hiện..."
                rows={3}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:opacity-50"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInput(false);
                    setTitle("");
                    setDesc("");
                  }}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                >
                  Huỷ
                </button>
              </div>
            </form>
          )}

          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              Thêm công việc
            </button>
          )}
        </>
      )}
    </div>
  );
}
