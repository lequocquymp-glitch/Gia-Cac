import Link from "next/link";
import { Project } from "@/types";
import { ChevronRight, Archive } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
          )}
        </div>
        <ChevronRight size={24} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0 ml-4" />
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        {project.status === "archived" && (
          <>
            <Archive size={14} />
            <span>Archived</span>
          </>
        )}
      </div>
    </Link>
  );
}
