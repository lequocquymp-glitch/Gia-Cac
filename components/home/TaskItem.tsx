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
import { Check } from "lucide-react";

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const color = getTimelineColor(task.deadline);
  const dot = getColorDot(color);

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

      <div className="text-xs font-medium text-gray-500 flex-shrink-0 uppercase tracking-wide">
        {task.importance}
      </div>
    </div>
  );
}
