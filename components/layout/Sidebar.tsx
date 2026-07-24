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
    { href: "/", icon: Home, label: "Home" },
    { href: "/projects", icon: FolderOpen, label: "Projects" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-blue-50 border-r border-blue-100 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-blue-100">
        <h1 className="text-2xl font-bold text-gray-900">Gia Các</h1>
        <p className="text-xs text-gray-500 mt-1">Command Center</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-blue-100 text-xs text-gray-500">
        <p>© 2026 Gia Các</p>
      </div>
    </aside>
  );
}
