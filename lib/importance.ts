// Task.importance lưu trong DB: "low" | "medium" | "high" (không đổi).
// Hàm này chỉ đổi nhãn hiển thị (presentation layer).

export function getImportanceLabel(importance: string): string {
  const labels: Record<string, string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
  };
  return labels[importance] ?? importance;
}
