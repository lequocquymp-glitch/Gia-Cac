"use client";

import { useRouter } from "next/navigation";
import { Task } from "@/types";
import { getTimelineColor, getColorBadge, formatDate } from "@/lib/timeline";
import { Check } from "lucide-react";

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const color = getTimelineColor(task.deadline);
  const badge = getColorBadge(color);

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

  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group">
      <button
        onClick={handleComplete}
        className="flex-shrink-0 mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        {task.completed && <Check size={16} className="text-blue-600" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-sm ${
            task.completed
              ? "line-through text-gray-400"
              : "text-gray-900"
          }`}
        >
          {task.title}
        </p>
        {task.deadline && (
          <p className="text-xs text-gray-500 mt-1">
            {badge} {formatDate(task.deadline)}
          </p>
        )}
      </div>

      <div className="text-xs font-medium text-gray-500 flex-shrink-0 uppercase tracking-wide">
        {task.importance}
      </div>
    </div>
  );
}
