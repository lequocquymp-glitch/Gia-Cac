"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Task, Knowledge } from "@/types";
import { Search as SearchIcon } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (query.length < 2) {
        setTasks([]);
        setKnowledge([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setTasks(
          data.tasks?.map((t: any) => ({
            ...t,
            deadline: t.deadline ? new Date(t.deadline) : null,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })) || []
        );
        setKnowledge(
          data.knowledge?.map((k: any) => ({
            ...k,
            createdAt: new Date(k.createdAt),
            updatedAt: new Date(k.updatedAt),
          })) || []
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = tasks.length > 0 || knowledge.length > 0;
  const showEmptyState = query.length >= 2 && !loading && !hasResults;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search</h1>

      <div className="flex items-center gap-3 mb-8">
        <SearchIcon size={24} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks and knowledge..."
          autoFocus
          className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Searching...</p>
        </div>
      )}

      {showEmptyState && (
        <div className="text-center py-12 text-gray-500">
          <p>No results found for "{query}"</p>
        </div>
      )}

      {query.length < 2 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>Type at least 2 characters to search</p>
        </div>
      )}

      {hasResults && !loading && (
        <div className="space-y-8">
          {tasks.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Tasks ({tasks.length})
              </h2>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {knowledge.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Knowledge ({knowledge.length})
              </h2>
              <div className="space-y-2">
                {knowledge.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.content}
                        </p>
                      </div>
                      <span className="ml-4 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-500">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
