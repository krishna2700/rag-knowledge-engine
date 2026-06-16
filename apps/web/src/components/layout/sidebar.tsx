"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Chat",
    description: "Query knowledge base",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Manage knowledge base",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="relative flex h-screen w-64 flex-col"
      style={{
        background: "rgba(4,6,13,0.8)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="relative flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            boxShadow: "0 0 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v6M8 11h6" />
          </svg>
          <div
            className="absolute inset-0 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
          />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>RAG Engine</p>
          <p className="text-xs" style={{ color: "#475569" }}>Knowledge Base</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 pt-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#334155" }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "text-white"
                  : "hover:text-white"
              )}
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      boxShadow: "0 0 16px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                      color: "#f1f5f9",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "#475569",
                    }
              }
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                  style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }}
                />
              )}
              <span
                className="transition-colors duration-200"
                style={{ color: isActive ? "#818cf8" : "inherit" }}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-none">{item.label}</p>
                <p className="mt-0.5 text-xs" style={{ color: isActive ? "#6366f1" : "#334155" }}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="rounded-xl p-3"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "#10b981",
                boxShadow: "0 0 6px rgba(16,185,129,0.8)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            />
            <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>System Online</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "#334155" }}>Search</span>
              <span className="text-xs font-medium" style={{ color: "#818cf8" }}>BM25 + Vector</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "#334155" }}>Vector DB</span>
              <span className="text-xs font-medium" style={{ color: "#818cf8" }}>Pinecone</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "#334155" }}>Model</span>
              <span className="text-xs font-medium" style={{ color: "#818cf8" }}>GPT-4o</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
