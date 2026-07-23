"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const activeProjects = projects.filter((p) => p.status === "active");
  const archivedProjects = projects.filter((p) => p.status === "archived");

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {activeProjects.length === 0 && archivedProjects.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">No projects yet.</p>
          <button
            onClick={() => setDialogOpen(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first project →
          </button>
        </div>
      ) : (
        <>
          {activeProjects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Active</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {archivedProjects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Archived</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                {archivedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
