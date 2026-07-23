import { Task } from "@/types";
import { TaskItem } from "./TaskItem";

export function TopFocus({ tasks }: { tasks: Task[] }) {
  const topTasks = tasks
    .filter((t) => !t.completed && t.importance === "high")
    .slice(0, 3);

  if (topTasks.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        ⭐ Top Focus
      </h2>
      <div className="space-y-2">
        {topTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
