import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Project, Task, Knowledge } from "@/types";
import { ProjectTabs } from "@/components/projects/ProjectTabs";

export const revalidate = 0;

async function getProjectData(
  id: string
): Promise<{
  project: Project;
  tasks: Task[];
  knowledge: Knowledge[];
}> {
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  const [tasks, knowledge] = await Promise.all([
    prisma.task.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.knowledge.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    project: {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    },
    tasks: tasks.map((t) => ({
      ...t,
      deadline: t.deadline ? new Date(t.deadline) : null,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    })),
    knowledge: knowledge.map((k) => ({
      ...k,
      createdAt: new Date(k.createdAt),
      updatedAt: new Date(k.updatedAt),
    })),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project, tasks, knowledge } = await getProjectData(id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        {project.description && (
          <p className="text-gray-600 mt-2">{project.description}</p>
        )}
      </div>

      <ProjectTabs projectId={id} tasks={tasks} knowledge={knowledge} />
    </div>
  );
}
