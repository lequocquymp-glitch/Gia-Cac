// Task.status: "todo" | "doing" | "waiting" | "done"
// "todo" và "done" đã có tín hiệu riêng (mặc định / gạch ngang+tick),
// chỉ cần badge cho 2 trạng thái còn lại.

export function getStatusBadge(status: string): { label: string; className: string } | null {
  if (status === "doing") {
    return { label: "Đang làm", className: "bg-blue-100 text-blue-700" };
  }
  if (status === "waiting") {
    return { label: "Chờ quyết định", className: "bg-amber-100 text-amber-700" };
  }
  return null;
}
