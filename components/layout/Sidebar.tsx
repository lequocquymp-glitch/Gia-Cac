"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Search, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const links = [
    { href: "/", icon: Home, label: "Trang chủ" },
    { href: "/projects", icon: FolderOpen, label: "Dự án" },
    { href: "/search", icon: Search, label: "Tìm kiếm" },
    { href: "/settings", icon: Settings, label: "Cài đặt" },
  ];

  return (
    <aside className="w-full md:w-64 bg-blue-600 md:h-screen flex flex-col md:sticky top-0 flex-shrink-0">
      <div className="px-4 py-3 md:p-6 md:border-b md:border-blue-500">
        <h1 className="text-lg md:text-2xl font-bold text-white">Gia Các</h1>
        <p className="hidden md:block text-xs text-blue-200 mt-1">
          Trung tâm chỉ huy
        </p>
      </div>

      <nav className="flex md:flex-col md:flex-1 gap-1 md:gap-2 px-2 pb-2 md:px-4 md:py-6 overflow-x-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex-shrink-0 ${
                active
                  ? "bg-white text-blue-700"
                  : "text-blue-100 hover:bg-blue-500 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block px-4 py-4 border-t border-blue-500 text-xs text-blue-200">
        <p>© 2026 Gia Các</p>
      </div>
    </aside>
  );
}
