"use client";

import { useState, useEffect } from "react";
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
import { Plus, ChevronDown, ChevronRight } from "lucide-react";

const DESC_CLAMP_THRESHOLD = 100; // ký tự — ngưỡng coi là "dài", cần nút Xem thêm

type FilterKey = "all" | "today" | "overdue" | "waiting" | "done";

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
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<Set<string>>(new Set());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Focus task khi mở project từ Trang chủ với ?task=<id> — chỉ đọc URL, không đổi dữ liệu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task");
    if (!taskId) return;

    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    setFilter("all");
    if (target.completed) setShowCompleted(true);
    if ((target.description?.length ?? 0) > DESC_CLAMP_THRESHOLD) {
      setExpandedDesc((prev) => new Set(prev).add(taskId));
    }
    setHighlightedId(taskId);

    const scrollTimer = setTimeout(() => {
      document
        .querySelector(`[data-task-id="${taskId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);

    const clearTimer = setTimeout(() => setHighlightedId(null), 4000);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const toggleDescExpand = (taskId: string) => {
    setExpandedDesc((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  // Phân loại: "waiting" tách riêng khỏi timeline (không bị coi là quá hạn vận hành)
  const done = tasks.filter((t) => t.completed);
  const activeNotDone = tasks.filter((t) => !t.completed);
  const waiting = activeNotDone.filter((t) => t.status === "waiting");
  const normal = activeNotDone.filter((t) => t.status !== "waiting");
  const today = normal.filter((t) => getTimelineColor(t.deadline) === "today");
  const overdue = normal.filter((t) => getTimelineColor(t.deadline) === "overdue");
  const soon = normal.filter((t) => {
    const c = getTimelineColor(t.deadline);
    return t.deadline && (c === "today" || c === "1-2days" || c === "3-7days");
  });
  const later = normal.filter((t) => getTimelineColor(t.deadline) === "more7days");

  const filterTabs: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: tasks.length },
    { key: "today", label: "Hôm nay", count: today.length },
    { key: "overdue", label: "Quá hạn", count: overdue.length },
    { key: "waiting", label: "Chờ quyết định", count: waiting.length },
    { key: "done", label: "Hoàn thành", count: done.length },
  ];

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
    const isLongDesc = (task.description?.length ?? 0) > DESC_CLAMP_THRESHOLD;
    const isExpanded = expandedDesc.has(task.id);

    const isHighlighted = task.id === highlightedId;

    return (
      <div
        key={task.id}
        data-task-id={task.id}
        className={`p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-700 group ${
          isHighlighted ? "ring-2 ring-blue-400 bg-blue-50" : ""
        }`}
      >
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
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
            className={`flex-1 min-w-0 break-words ${
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
          <div className="mt-1.5 ml-8">
            <p
              className={`text-sm text-gray-600 whitespace-pre-wrap break-words ${
                !isExpanded && isLongDesc ? "line-clamp-2" : ""
              }`}
            >
              {task.description}
            </p>
            {isLongDesc && (
              <button
                onClick={() => toggleDescExpand(task.id)}
                className="text-xs text-blue-600 hover:text-blue-700 mt-0.5"
              >
                {isExpanded ? "Thu gọn" : "Xem thêm..."}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (
    key: string,
    emoji: string,
    label: string,
    accent: string,
    box: string,
    items: Task[]
  ) =>
    items.length === 0 ? null : (
      <section key={key} className={`rounded-xl border p-4 ${box}`}>
        <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${accent}`}>
          <span>{emoji}</span>
          {label}
          <span className="text-xs font-normal text-gray-400">({items.length})</span>
        </h3>
        <div className="space-y-2">{items.map(renderTask)}</div>
      </section>
    );

  // filter !== "all" → chỉ hiện đúng 1 nhóm tương ứng
  const filteredView = () => {
    if (filter === "today") return renderGroup("today", "⚡", "Hôm nay", "text-red-600", "border-red-200 bg-red-50", today);
    if (filter === "overdue") return renderGroup("overdue", "🔥", "Quá hạn", "text-gray-800", "border-gray-300 bg-gray-50", overdue);
    if (filter === "waiting") return renderGroup("waiting", "🟡", "Chờ quyết định", "text-amber-700", "border-amber-200 bg-amber-50", waiting);
    if (filter === "done") return renderGroup("done", "✅", "Đã hoàn thành", "text-gray-400", "border-gray-200 bg-white", done);
    return null;
  };

  return (
    <div>
      {/* P0: Thêm công việc lên đầu trang */}
      {showInput ? (
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
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full sm:w-auto mb-5 px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Thêm công việc
        </button>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có công việc nào.</p>
        </div>
      ) : (
        <>
          {/* P1: Filter nhanh */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  filter === tab.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className={filter === tab.key ? "text-blue-100" : "text-gray-400"}>
                  {" "}
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {filter !== "all" ? (
            <div className="space-y-5 mb-4">{filteredView()}</div>
          ) : (
            <div className="space-y-5 mb-4">
              {renderGroup("overdue", "🔥", "Quá hạn", "text-gray-800", "border-gray-300 bg-gray-50", overdue)}
              {renderGroup("soon", "⚡", "Hôm nay / 7 ngày tới", "text-orange-600", "border-orange-200 bg-orange-50", soon)}
              {renderGroup("waiting", "🟡", "Chờ quyết định", "text-amber-700", "border-amber-200 bg-amber-50", waiting)}
              {renderGroup("later", "🗓", "Còn lại", "text-green-700", "border-green-200 bg-green-50", later)}

              {/* P0: Đã hoàn thành — collapse mặc định */}
              {done.length > 0 && (
                <section className="rounded-xl border border-gray-200 bg-white">
                  <button
                    onClick={() => setShowCompleted((v) => !v)}
                    className="w-full flex items-center justify-between p-4 text-sm font-bold text-gray-400"
                  >
                    <span className="flex items-center gap-2">
                      ✅ Đã hoàn thành
                      <span className="text-xs font-normal text-gray-400">({done.length})</span>
                    </span>
                    {showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {showCompleted && (
                    <div className="px-4 pb-4 space-y-2">{done.map(renderTask)}</div>
                  )}
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
