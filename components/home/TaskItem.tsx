"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Task } from "@/types";
import {
  getTimelineColor,
  getColorDot,
  getColorLabel,
  formatDate,
  toDateInputValue,
} from "@/lib/timeline";
import { getStatusBadge } from "@/lib/status";
import { Check } from "lucide-react";

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? "");
  const color = getTimelineColor(task.deadline);
  const dot = getColorDot(color);
  const statusBadge = task.completed ? null : getStatusBadge(task.status);

  const handleComplete = async () => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeadlineChange = async (value: string) => {
    setSaving(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: value || null }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update deadline", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
        }),
      });
      setEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to edit task", error);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-2">
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
            onClick={handleSaveEdit}
            disabled={saving || !editTitle.trim()}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Lưu
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setEditTitle(task.title);
              setEditDesc(task.description ?? "");
            }}
            className="px-4 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
          >
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group">
      <button
        onClick={handleComplete}
        className="flex-shrink-0 mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        {task.completed && <Check size={16} className="text-blue-600" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {task.deadline && (
            <span
              className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${dot}`}
              title={getColorLabel(color)}
            />
          )}
          <p
            className={`font-medium text-sm ${
              task.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          <input
            type="date"
            value={toDateInputValue(task.deadline)}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            disabled={saving}
            className="text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
          />
          {task.deadline && (
            <span className="text-xs text-gray-500">
              {getColorLabel(color)} · {formatDate(task.deadline)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => setEditing(true)}
        className="text-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        Sửa
      </button>

      {statusBadge && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusBadge.className}`}
        >
          {statusBadge.label}
        </span>
      )}

      <div className="text-xs font-medium text-gray-500 flex-shrink-0 uppercase tracking-wide">
        {task.importance}
      </div>
    </div>
  );
}
