"use client";

import { useState } from "react";
import { Download, Calendar, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

  const calendarUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/calendar`
      : "/api/calendar";

  const handleCopyCalendarUrl = async () => {
    try {
      await navigator.clipboard.writeText(calendarUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(calendarUrl);
    }
  };

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
        {/* Google Calendar */}
        <div className="p-6 bg-white border border-blue-200 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Google Calendar
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            Công việc có deadline sẽ tự hiện trên Google Calendar và tự cập
            nhật khi bạn đổi ngày, sửa, hoặc hoàn thành.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              readOnly
              value={calendarUrl}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
            />
            <button
              onClick={handleCopyCalendarUrl}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Đã copy" : "Copy link"}
            </button>
          </div>
          <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
            <li>Bấm "Copy link" ở trên</li>
            <li>
              Mở{" "}
              <a
                href="https://calendar.google.com/calendar/u/0/r/settings/addbyurl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Google Calendar → Thêm lịch từ URL
              </a>
            </li>
            <li>Dán link vào ô "URL của lịch" → bấm "Thêm lịch"</li>
            <li>
              Lịch "Gia Các Command Center" sẽ hiện trong danh sách lịch của
              bạn
            </li>
          </ol>
          <p className="text-xs text-gray-400 mt-3">
            Lưu ý: Google tự làm mới lịch đăng ký theo chu kỳ (thường vài
            giờ một lần).
          </p>
        </div>

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
