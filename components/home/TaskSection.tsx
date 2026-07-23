import { Task } from "@/types";
import { TaskItem } from "./TaskItem";

export function TaskSection({
  title,
  tasks,
  emoji,
}: {
  title: string;
  tasks: Task[];
  emoji: string;
}) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        {emoji} {title}
      </h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
