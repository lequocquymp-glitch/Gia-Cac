"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Knowledge } from "@/types";
import { Plus, X } from "lucide-react";

export function KnowledgeList({
  projectId,
  knowledge: initialKnowledge,
}: {
  projectId: string;
  knowledge: Knowledge[];
}) {
  const router = useRouter();
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Knowledge | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "document" as const,
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: formData.title.trim(),
          type: formData.type,
          content: formData.content.trim(),
          tags: [],
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setKnowledge([newItem, ...knowledge]);
        setFormData({ title: "", type: "document", content: "" });
        setShowForm(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (confirm("Delete this knowledge item?")) {
      try {
        await fetch(`/api/knowledge/${itemId}`, { method: "DELETE" });
        setKnowledge(knowledge.filter((k) => k.id !== itemId));
        setSelectedItem(null);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete knowledge", error);
      }
    }
  };

  const typeColors: Record<string, string> = {
    sop: "bg-blue-100 text-blue-800",
    policy: "bg-purple-100 text-purple-800",
    workflow: "bg-green-100 text-green-800",
    checklist: "bg-yellow-100 text-yellow-800",
    guideline: "bg-pink-100 text-pink-800",
    meeting_note: "bg-orange-100 text-orange-800",
    document: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {knowledge.length === 0 && !showForm ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No knowledge items yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Create your first
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {knowledge.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedItem?.id === item.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                      typeColors[item.type] || typeColors.document
                    }`}
                  >
                    {item.type.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Add knowledge
              </button>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., SOP Đồng phục"
                    autoFocus
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                      })
                    }
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="document">Document</option>
                    <option value="sop">SOP</option>
                    <option value="policy">Policy</option>
                    <option value="workflow">Workflow</option>
                    <option value="checklist">Checklist</option>
                    <option value="guideline">Guideline</option>
                    <option value="meeting_note">Meeting Note</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter content here..."
                    rows={5}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || !formData.title.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        title: "",
                        type: "document",
                        content: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {selectedItem && (
        <div className="lg:col-span-1">
          <div className="sticky top-8 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg break-words">
                {selectedItem.title}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
              >
                <X size={20} />
              </button>
            </div>

            <span
              className={`inline-block text-xs font-medium px-2 py-1 rounded mb-4 ${
                typeColors[selectedItem.type] || typeColors.document
              }`}
            >
              {selectedItem.type.replace("_", " ")}
            </span>

            <div className="prose prose-sm max-w-none mb-4 text-gray-700 whitespace-pre-wrap break-words">
              {selectedItem.content}
            </div>

            <button
              onClick={() => handleDelete(selectedItem.id)}
              className="w-full px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
