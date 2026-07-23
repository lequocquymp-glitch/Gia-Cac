import { prisma } from "@/lib/prisma";
import { Task } from "@/types";
import { QuickCapture } from "@/components/home/QuickCapture";
import { TaskSection } from "@/components/home/TaskSection";
import { TopFocus } from "@/components/home/TopFocus";
import { RecentProjects } from "@/components/home/RecentProjects";

export const revalidate = 0;

async function getTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    take: 100,
  });
  return tasks.map((t) => ({
    ...t,
    projectId: t.projectId ?? undefined,
    description: t.description ?? undefined,
    deadline: t.deadline ? new Date(t.deadline) : undefined,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  }));
}

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return projects.map((p) => ({
    ...p,
    description: p.description ?? undefined,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));
}

function categorizeTasksNew(tasks: Task[]) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdue: Task[] = [];
  const today: Task[] = [];
  const next7: Task[] = [];
  const noDeadline: Task[] = [];

  tasks.forEach((task) => {
    if (task.completed) return;

    if (!task.deadline) {
      noDeadline.push(task);
      return;
    }

    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      overdue.push(task);
    } else if (diffDays === 0) {
      today.push(task);
    } else if (diffDays <= 7) {
      next7.push(task);
    }
  });

  return { overdue, today, next7, noDeadline };
}

export default async function HomePage() {
  const [tasks, projects] = await Promise.all([getTasks(), getProjects()]);
  const { overdue, today, next7, noDeadline } = categorizeTasksNew(tasks);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <QuickCapture />

      <TopFocus tasks={tasks} />

      <TaskSection title="Overdue" tasks={overdue} emoji="🔥" />

      <TaskSection title="Today" tasks={today} emoji="🔴" />

      <TaskSection title="Next 7 Days" tasks={next7} emoji="📅" />

      <TaskSection title="All Tasks (No Deadline)" tasks={noDeadline} emoji="📝" />

      <RecentProjects projects={projects} />
    </div>
  );
}
