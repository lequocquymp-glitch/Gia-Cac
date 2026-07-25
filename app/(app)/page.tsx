import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Task } from "@/types";
import { QuickCapture } from "@/components/home/QuickCapture";
import { TaskItem } from "@/components/home/TaskItem";
import { getTimelineColor } from "@/lib/timeline";
import { ChevronRight } from "lucide-react";

export const revalidate = 0;

async function getData() {
  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.project.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const mappedTasks: Task[] = tasks.map((t) => ({
    ...t,
    projectId: t.projectId ?? undefined,
    description: t.description ?? undefined,
    deadline: t.deadline ? new Date(t.deadline) : undefined,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  }));

  return { tasks: mappedTasks, projects };
}

export default async function HomePage() {
  const { tasks, projects } = await getData();

  const activeTasks = tasks.filter((t) => !t.completed);
  const overdue = activeTasks.filter(
    (t) => getTimelineColor(t.deadline) === "overdue" && t.deadline
  );
  const noProject = activeTasks.filter((t) => !t.projectId);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Bảng điều khiển
      </h1>

      <QuickCapture />

      {overdue.length > 0 && (
        <section className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
            🔥 Quá hạn
            <span className="text-xs font-normal text-red-400">
              ({overdue.length})
            </span>
          </h2>
          <div className="space-y-2">
            {overdue.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      <div className="space-y-6">
        {projects.map((project) => {
          const projectTasks = activeTasks.filter(
            (t) => t.projectId === project.id
          );
          return (
            <section
              key={project.id}
              className="rounded-xl border border-blue-100 bg-white p-4 md:p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900">
                    📁 {project.name}
                  </h2>
                  {project.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {project.description}
                    </p>
                  )}
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
                >
                  Mở dự án
                  <ChevronRight size={16} />
                </Link>
              </div>

              {projectTasks.length > 0 ? (
                <div className="space-y-2">
                  {projectTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-2">
                  Không có công việc đang chờ.
                </p>
              )}
            </section>
          );
        })}

        {noProject.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
              📥 Chưa thuộc dự án
            </h2>
            <div className="space-y-2">
              {noProject.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
