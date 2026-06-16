"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Chat", icon: "💬" },
  { href: "/documents", label: "Documents", icon: "📄" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-navy-100 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-navy-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-white text-sm font-bold">
          R
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900">RAG Engine</p>
          <p className="text-xs text-navy-400">Knowledge Base</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-alice-blue text-navy-800 border border-navy-100"
                : "text-navy-500 hover:bg-slate-50 hover:text-navy-700"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-navy-100 p-4">
        <div className="rounded-lg bg-alice-blue p-3">
          <p className="text-xs font-medium text-navy-700">Hybrid Search</p>
          <p className="mt-0.5 text-xs text-navy-400">BM25 + Vector · Pinecone</p>
        </div>
      </div>
    </aside>
  );
};
