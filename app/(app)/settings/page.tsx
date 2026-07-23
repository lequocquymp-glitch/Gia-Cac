"use client";

import { useState } from "react";
import { Download, Upload } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);

  const handleExportData = async () => {
    try {
      const [projectRes, taskRes, knowledgeRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/tasks"),
        fetch("/api/knowledge"),
      ]);

      const [projects, tasks, knowledge] = await Promise.all([
        projectRes.json(),
        taskRes.json(),
        knowledgeRes.json(),
      ]);

      const data = { projects, tasks, knowledge };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gia-cac-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data", error);
      alert("Failed to export data");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="max-w-2xl space-y-8">
        {/* Theme */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Theme</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Light</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Dark</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Enable notifications</span>
          </label>
        </div>

        {/* Data */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Data</h2>
          <p className="text-gray-600 mb-4">
            Backup and restore your data.
          </p>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>

        {/* About */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Gia Các Command Center</span>
            <br />
            Version 1.0.0
            <br />
            Personal project management system.
          </p>
        </div>
      </div>
    </div>
  );
}
