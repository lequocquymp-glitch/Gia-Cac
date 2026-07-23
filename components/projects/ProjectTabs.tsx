"use client";

import { useState } from "react";
import { Task, Knowledge } from "@/types";
import { TaskList } from "./TaskList";
import { KnowledgeList } from "./KnowledgeList";

export function ProjectTabs({
  projectId,
  tasks,
  knowledge,
}: {
  projectId: string;
  tasks: Task[];
  knowledge: Knowledge[];
}) {
  const [activeTab, setActiveTab] = useState<"knowledge" | "tasks">("tasks");

  return (
    <div>
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "tasks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "knowledge"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Knowledge ({knowledge.length})
        </button>
      </div>

      {activeTab === "tasks" && <TaskList projectId={projectId} tasks={tasks} />}
      {activeTab === "knowledge" && <KnowledgeList projectId={projectId} knowledge={knowledge} />}
    </div>
  );
}
