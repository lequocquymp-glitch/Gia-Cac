import Link from "next/link";
import { Project } from "@/types";
import { ChevronRight } from "lucide-react";

export function RecentProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        📁 Recent Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.slice(0, 4).map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-between group"
          >
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              )}
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
          </Link>
        ))}
      </div>
      {projects.length > 4 && (
        <Link
          href="/projects"
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all projects →
        </Link>
      )}
    </div>
  );
}
