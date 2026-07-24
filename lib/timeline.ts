import type { TimelineColor } from "@/types";

export function getTimelineColor(deadline: Date | null | undefined): TimelineColor {
  if (!deadline) return "more7days";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 2) return "1-2days";
  if (diffDays <= 7) return "3-7days";
  return "more7days";
}

export function getColorBadge(color: TimelineColor): string {
  const badges: Record<TimelineColor, string> = {
    overdue: "⚫",
    today: "🔴",
    "1-2days": "🟠",
    "3-7days": "🟡",
    more7days: "🟢",
  };
  return badges[color];
}

export function getColorDot(color: TimelineColor): string {
  const dots: Record<TimelineColor, string> = {
    overdue: "bg-gray-800",
    today: "bg-red-500",
    "1-2days": "bg-orange-500",
    "3-7days": "bg-yellow-400",
    more7days: "bg-green-500",
  };
  return dots[color];
}

export function getColorLabel(color: TimelineColor): string {
  const labels: Record<TimelineColor, string> = {
    overdue: "Quá hạn",
    today: "Hôm nay",
    "1-2days": "1–2 ngày",
    "3-7days": "3–7 ngày",
    more7days: "Hơn 7 ngày",
  };
  return labels[color];
}

export function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN", {
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(completed: boolean, deadline: Date | null | undefined): boolean {
  if (completed) return false;
  if (!deadline) return false;
  const now = new Date();
  return new Date(deadline) < now;
}
