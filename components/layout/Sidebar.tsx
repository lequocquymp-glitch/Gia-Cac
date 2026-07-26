"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Search, Settings } from "lucide-react";

const textOutline = {
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 3px rgba(0,0,0,0.5)",
};

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
    <aside
      className="w-full md:w-64 md:h-screen flex flex-col md:sticky top-0 flex-shrink-0"
      style={{
        background:
          "linear-gradient(180deg, #dff5ef 0%, #a9e3d6 30%, #6bcdbb 60%, #3fb3a1 100%)",
      }}
    >
      <div className="px-4 py-3 md:p-6 md:border-b md:border-white/25">
        <h1 className="text-lg md:text-2xl font-bold text-white" style={textOutline}>
          Gia Các
        </h1>
        <p className="hidden md:block text-xs text-white/90 mt-1" style={textOutline}>
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
                  ? "bg-white text-teal-700"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Icon
                size={18}
                className={active ? undefined : "drop-shadow-[0_0_2px_black]"}
              />
              <span style={active ? undefined : textOutline}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block px-4 py-4 border-t border-white/25 text-xs text-white/90">
        <p style={textOutline}>© 2026 Gia Các</p>
      </div>
    </aside>
  );
}
