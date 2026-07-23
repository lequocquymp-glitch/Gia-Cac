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
    overdue: "🔥",
    today: "🔴",
    "1-2days": "🟠",
    "3-7days": "🟡",
    more7days: "🟢",
  };
  return badges[color];
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
